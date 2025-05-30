from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from openpyxl import load_workbook
from datetime import datetime
import shutil
import os

# Para exportar a PDF
import pythoncom
import win32com.client as win32

app = FastAPI()

# CORS para React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Nombre fijo de archivo para que ambos endpoints trabajen sobre el mismo
EXCEL_FILENAME = "Manifiesto KMX-AA-X1 SAI.xlsx"
PDF_FILENAME = "Manifiesto_Preview.pdf"
PLANTILLA = "Manifiesto KMX-AA-XX SAI.xlsx"  # Tu plantilla base original


# Ruta: Generar manifiesto Excel
@app.get("/generar-manifiesto")
def generar_manifiesto():
    if not os.path.exists(PLANTILLA):
        return JSONResponse(status_code=404, content={"detail": "Plantilla no encontrada."})

    try:
        # Copiar plantilla base al archivo de trabajo
        shutil.copyfile(PLANTILLA, EXCEL_FILENAME)

        # Abrir y modificar Excel
        wb = load_workbook(EXCEL_FILENAME)
        ws = wb["GENERADOR ORIGINAL"]

        # Generar número de manifiesto (estático para este ejemplo)
        anio = datetime.now().year % 100
        consecutivo = 1
        num_manifiesto = f"KMX-{anio:02d}-{consecutivo:02d}"
        ws["U12"] = num_manifiesto

        # Agregar los datos
        datos = [
            ["Aceite usado", "200", "Tambor", "0.5", "kg"],
            ["Disolvente", "150", "Cont. plástico", "0.8", "kg"],
            ["Pintura vencida", "100", "Lata", "0.3", "kg"],
            ["Fango industrial", "250", "Tambor", "1.2", "kg"],
            ["Líquido refrigerante", "180", "Bidón", "0.6", "kg"]
        ]

        fila_inicio = 20
        for i, fila in enumerate(datos):
            f = fila_inicio + i
            ws[f"B{f}"] = fila[0]
            ws[f"P{f}"] = fila[1]
            ws[f"S{f}"] = fila[2]
            ws[f"V{f}"] = fila[3]
            ws[f"Y{f}"] = fila[4]

        wb.save(EXCEL_FILENAME)
        wb.close()

        return FileResponse(
            path=EXCEL_FILENAME,
            filename=EXCEL_FILENAME,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Error: {str(e)}"})


# Ruta: Generar vista previa PDF
@app.get("/preview-manifiesto")
def preview_manifiesto():
    if not os.path.exists(EXCEL_FILENAME):
        return JSONResponse(status_code=404, content={"detail": "Primero genera el manifiesto Excel."})

    try:
        # Inicializar COM
        pythoncom.CoInitialize()
        excel = win32.gencache.EnsureDispatch("Excel.Application")
        wb = excel.Workbooks.Open(os.path.abspath(EXCEL_FILENAME))
        wb.ExportAsFixedFormat(0, os.path.abspath(PDF_FILENAME))  # 0 = PDF
        wb.Close(False)
        excel.Quit()
        pythoncom.CoUninitialize()

        return FileResponse(
            path=PDF_FILENAME,
            filename=PDF_FILENAME,
            media_type="application/pdf"
        )

    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Error al convertir a PDF: {str(e)}"})
