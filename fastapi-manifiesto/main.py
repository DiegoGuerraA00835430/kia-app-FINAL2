from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from openpyxl import load_workbook
from datetime import datetime
import shutil
import os
import pythoncom
import win32com.client as win32
import requests
import re

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
CAPACIDADES = {
    "tote": "1000 litros",
    "tambo": "200 litros",
    "paca": "600 kg",
    "pieza": "1",
    "tarima": "1"
}

def obtener_siguiente_numero():
    try:
        response = requests.get("http://localhost:4002/api/documentos/ultimo")
        if response.status_code != 200:
            raise Exception("No se pudo obtener el último documento")

        data = response.json()
        nombre_archivo = data.get("nombre_archivo")

        if not nombre_archivo:
            raise Exception("No se encontró 'nombre_archivo' en la respuesta")

        match = re.search(r"KMX-(\d{2})-(\d{2})", nombre_archivo)
        if not match:
            raise Exception("Formato de nombre_archivo inválido")

        anio = int(match.group(1))
        contador = int(match.group(2)) + 1
    except Exception as e:
        print(f"❌ Error en obtener_siguiente_numero: {e}")
        anio = datetime.now().year % 100
        contador = 1

    numero = f"KMX-{anio:02d}-{contador:02d}"
    return numero, contador

@app.get("/generar-manifiesto")
def generar_manifiesto():
    try:
        if not os.path.exists(PLANTILLA):
            return JSONResponse(status_code=404, content={"detail": "Plantilla no encontrada."})

        response = requests.get("http://localhost:4002/api/manifiesto-temporal")
        if response.status_code != 200:
            raise Exception("No se pudieron obtener las filas temporales")
        datos_json = response.json()

        residuos = {}
        for fila in datos_json:
            nombre = fila["nombre"]
            contenedor = fila["contenedor"].lower()
            cantidad = float(fila["cantidad"])
            peso = float(fila["peso"])

            clave = (nombre, contenedor)
            if clave not in residuos:
                residuos[clave] = {"cantidad_total": 0, "peso_total": 0}
            residuos[clave]["cantidad_total"] += cantidad
            residuos[clave]["peso_total"] += peso

        datos = []
        for (nombre, contenedor), valores in residuos.items():
            capacidad = CAPACIDADES.get(contenedor, "N/A")
            datos.append([
                nombre,
                capacidad,
                contenedor,
                valores["cantidad_total"],
                valores["peso_total"]
            ])

        if not datos:
            raise Exception("No hay datos para generar el manifiesto")

        numero, _ = obtener_siguiente_numero()
        excel_filename = f"Manifiesto {numero} SAI.xlsx"

        shutil.copyfile(PLANTILLA, excel_filename)
        wb = load_workbook(excel_filename)

        for idx in range(4):
            ws = wb.worksheets[idx]
            ws["U12"] = numero
            fila_inicio = 20
            for i, fila in enumerate(datos):
                f = fila_inicio + i
                ws[f"B{f}"] = fila[0] #nombre
                ws[f"P{f}"] = fila[1]  # Capacidad
                ws[f"S{f}"] = fila[2]  # Tipo
                if f < 31:
                    ws[f"V{f}"] = fila[3]  # Cantidad total
                    ws[f"Y{f}"] = fila[4]  # Peso total

        wb.save(excel_filename)
        wb.close()

        return FileResponse(
            path=excel_filename,
            filename=excel_filename,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

    except Exception as e:
        print(f"❌ Error en generar_manifiesto: {e}")
        return JSONResponse(status_code=500, content={"detail": f"Error: {str(e)}"})

@app.get("/preview-manifiesto")
def preview_manifiesto():
    try:
        archivos = [f for f in os.listdir() if f.startswith("Manifiesto KMX-") and f.endswith(".xlsx")]
        if not archivos:
            return JSONResponse(status_code=404, content={"detail": "Ningún manifiesto Excel encontrado."})

        ultimo_excel = max(archivos, key=os.path.getmtime)

        print(f"📄 Generando PDF de: {ultimo_excel}")
        pythoncom.CoInitialize()
        win32.gencache.is_readonly = False
        win32.gencache.Rebuild()
        excel = win32.gencache.EnsureDispatch("Excel.Application")
        wb = excel.Workbooks.Open(os.path.abspath(ultimo_excel))
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
