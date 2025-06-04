from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from openpyxl import load_workbook
from datetime import datetime
import shutil
import os
import pythoncom
import win32com.client as win32


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Archivos base
PLANTILLA = "Manifiesto_Preview.xlsx"
CONTADOR_FILE = "contador.txt"
PDF_FILENAME = "Manifiesto_Preview.pdf"


def obtener_siguiente_numero():
    anio = datetime.now().year % 100
    if not os.path.exists(CONTADOR_FILE):
        with open(CONTADOR_FILE, "w") as f:
            f.write(f"{anio},1")
        return f"KMX-{anio:02d}-01", 1

    with open(CONTADOR_FILE, "r") as f:
        data = f.read().strip()
        prev_anio, prev_contador = map(int, data.split(","))

    if prev_anio != anio:
        contador = 1
    else:
        contador = prev_contador + 1

    with open(CONTADOR_FILE, "w") as f:
        f.write(f"{anio},{contador}")

    return f"KMX-{anio:02d}-{contador:02d}", contador


@app.get("/generar-manifiesto")
def generar_manifiesto():
    if not os.path.exists(PLANTILLA):
        return JSONResponse(status_code=404, content={"detail": "Plantilla no encontrada."})

    try:
        num_manifiesto, _ = obtener_siguiente_numero()
        excel_filename = f"Manifiesto {num_manifiesto} SAI.xlsx"

        shutil.copyfile(PLANTILLA, excel_filename)
        wb = load_workbook(excel_filename)

        datos = [
            ["Trapos, guantes y textiles contaminados con aceite hidraulico,pintura, thinner y grasa provenientes de actividades de limpieza, operación y mantenimiento", "200", "Tambor", "0.5", "100"],
            ["Disolvente", "150", "Cont. plástico", "0.8", "1000"],
            ["Pintura vencida", "100", "Lata", "0.3", "2000"],
            ["Fango industrial", "250", "Tambor", "1.2", "400"],
            ["Líquido refrigerante", "180", "Bidón", "0.6", "213"]
        ]

        for idx in range(4):
            ws = wb.worksheets[idx]
            ws["U12"] = num_manifiesto
            fila_inicio = 20
            for i, fila in enumerate(datos):
                f = fila_inicio + i
                ws[f"B{f}"] = fila[0]
                ws[f"P{f}"] = fila[1]
                ws[f"S{f}"] = fila[2]
                if f < 31:
                    ws[f"V{f}"] = fila[3]
                    ws[f"Y{f}"] = fila[4]

        wb.save(excel_filename)
        wb.close()

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
        # Buscar último manifiesto generado
        if not os.path.exists(CONTADOR_FILE):
            return JSONResponse(status_code=404, content={"detail": "Primero genera el manifiesto."})

        with open(CONTADOR_FILE, "r") as f:
            anio, contador = map(int, f.read().strip().split(","))
        num_manifiesto = f"KMX-{anio:02d}-{contador:02d}"
        excel_filename = f"Manifiesto {num_manifiesto} SAI.xlsx"

        if not os.path.exists(excel_filename):
            return JSONResponse(status_code=404, content={"detail": "Excel no encontrado."})

        # Convertir a PDF
        pythoncom.CoInitialize()
        excel = win32.gencache.EnsureDispatch("Excel.Application")
        wb = excel.Workbooks.Open(os.path.abspath(excel_filename))
        excel.CalculateFullRebuild()
        wb.ExportAsFixedFormat(0, os.path.abspath(PDF_FILENAME))
        wb.Close(False)
        excel.Quit()
        pythoncom.CoUninitialize()

        return FileResponse(
            path=PDF_FILENAME,
            filename=PDF_FILENAME,
            media_type="application/pdf"
        )

    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Error al generar PDF: {str(e)}"})
