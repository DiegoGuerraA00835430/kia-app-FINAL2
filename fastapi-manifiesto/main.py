from fastapi import FastAPI
from fastapi.responses import FileResponse
from openpyxl import load_workbook
import shutil

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 🔓 Permitir solicitudes desde React (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/generar-manifiesto")
def generar_manifiesto():
    plantilla = "Manifiesto KMX-25-40 SAI.xlsx"
    salida = "Manifiesto_KIA_Listo.xlsx"

    # Copiar plantilla para no modificar la original
    shutil.copyfile(plantilla, salida)

    wb = load_workbook(salida)
    ws = wb["GENERADOR ORIGINAL"]

    datos = [
        ["Aceite usado", "200", "Tambor", "0.5", "kg"],
        ["Disolvente", "150", "Cont. plástico", "0.8", "kg"],
        ["Pintura vencida", "100", "Lata", "0.3", "kg"],
        ["Fango industrial", "250", "Tambor", "1.2", "kg"],
        ["Líquido refrigerante", "180", "Bidón", "0.6", "kg"]
    ]

    start_row = 20
    for i, fila in enumerate(datos):
        row = start_row + i
        ws[f"B{row}"] = fila[0]
        ws[f"P{row}"] = fila[1]
        ws[f"S{row}"] = fila[2]
        ws[f"V{row}"] = fila[3]
        ws[f"Y{row}"] = fila[4]

    wb.save(salida)

    return FileResponse(
        path=salida,
        filename="Manifiesto_KIA_Listo.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
