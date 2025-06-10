from collections import defaultdict
from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from openpyxl import load_workbook
import shutil
import os
import pythoncom
import win32com.client as win32
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PLANTILLA = "Manifiesto_Preview.xlsx"
PDF_FILENAME = "Manifiesto_Preview.pdf"


@app.get("/generar-manifiesto")
def generar_manifiesto():
    if not os.path.exists(PLANTILLA):
        return JSONResponse(status_code=404, content={"detail": "Plantilla no encontrada."})

    try:
        response = requests.get("http://localhost:4002/api/manifiesto-temporal")
        if response.status_code != 200:
            raise Exception("No se pudieron obtener las filas temporales")
        datos_json = response.json()

        agrupados = defaultdict(lambda: {
            "codigo": "",
            "contenedor": "",
            "cantidad": 0.0,
            "peso": 0.0
        })

        for fila in datos_json:
            nombre = fila["nombre"]
            agrupados[nombre]["codigo"] = fila.get("codigo", "")
            agrupados[nombre]["contenedor"] = fila.get("contenedor", "")
            agrupados[nombre]["cantidad"] += float(fila.get("cantidad", 0))     # ← aquí va el peso como cantidad
            agrupados[nombre]["peso"] += float(fila.get("peso", 0))     # ← aquí va la cantidad como peso

        datos = [
            [nombre, datos["codigo"], datos["contenedor"], datos["cantidad"], datos["peso"]]
            for nombre, datos in agrupados.items()
        ]

        if not datos:
            raise Exception("No hay datos para generar el manifiesto")

        gen_resp = requests.post("http://localhost:4002/api/documento-final")
        if gen_resp.status_code != 201:
            raise Exception("No se pudo registrar el manifiesto en la base de datos")

        nombre_archivo = gen_resp.json()["archivo"]
        num_manifiesto = nombre_archivo.replace(".xlsx", "")
        excel_filename = f"Manifiesto {num_manifiesto} SAI.xlsx"

        shutil.copyfile(PLANTILLA, excel_filename)
        wb = load_workbook(excel_filename)

        for idx in range(4):
            ws = wb.worksheets[idx]
            ws["U12"] = num_manifiesto
            fila_inicio = 20
            for i, fila in enumerate(datos):
                f = fila_inicio + i
                ws[f"B{f}"] = fila[0]  # nombre
                ws[f"P{f}"] = fila[1]  # codigo
                ws[f"S{f}"] = fila[2]  # contenedor

                peso = float(str(fila[3]).replace(",", "."))
                cantidad = float(str(fila[4]).replace(",", "."))

                ws[f"V{f}"] = peso
                ws[f"V{f}"].number_format = '0'

                ws[f"Y{f}"] = cantidad
                ws[f"Y{f}"].number_format = '0.00'

        wb.save(excel_filename)
        wb.close()

        borrar_resp = requests.delete("http://localhost:4002/api/manifiesto-temporal")
        if borrar_resp.status_code != 200:
            print("⚠️ No se pudo borrar la tabla temporal:", borrar_resp.text)

        return FileResponse(
            path=excel_filename,
            filename=excel_filename,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Error: {str(e)}"})


@app.get("/preview-manifiesto")
def preview_manifiesto():
    try:
        print("✅ Iniciando generación del PDF")

        resp = requests.get("http://localhost:4002/api/documentos/ultimo")
        if resp.status_code != 200:
            return JSONResponse(status_code=404, content={"detail": "No se encontró el número del manifiesto."})

        nombre_archivo = resp.json()["nombre_archivo"].replace(".xlsx", "")
        excel_filename = f"Manifiesto {nombre_archivo} SAI.xlsx"

        if not os.path.exists(excel_filename):
            return JSONResponse(status_code=404, content={"detail": "Excel no encontrado."})

        print(f"📄 Abriendo archivo: {excel_filename}")
        pythoncom.CoInitialize()
        import win32com.client.gencache
        win32com.client.gencache.is_readonly = False
        win32com.client.gencache.Rebuild()
        excel = win32.gencache.EnsureDispatch("Excel.Application")
        wb = excel.Workbooks.Open(os.path.abspath(excel_filename))
        excel.CalculateFullRebuild()
        wb.ExportAsFixedFormat(0, os.path.abspath(PDF_FILENAME))
        wb.Close(False)
        excel.Quit()
        pythoncom.CoUninitialize()

        print("✅ PDF generado correctamente")

        return FileResponse(
            path=PDF_FILENAME,
            filename=PDF_FILENAME,
            media_type="application/pdf"
        )

    except Exception as e:
        print(f"❌ Error al generar PDF: {e}")
        return JSONResponse(status_code=500, content={"detail": f"Error al generar PDF: {str(e)}"})
