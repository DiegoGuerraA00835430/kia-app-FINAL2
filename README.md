
# 🧾 Proyecto KIA - Manifiesto de Residuos

Este proyecto genera un manifiesto oficial de residuos en formato Excel usando una plantilla con diseño oficial. Combina un frontend en React con un backend en FastAPI que llena automáticamente los datos de residuos.

---

## 📁 Estructura del proyecto

### 
KIA-APP-FINAL2/
├── KIAAPI/                     # Backend en Node.js
├── fastapi-manifiesto/        # Backend en FastAPI para generar el Excel
│   ├── main.py
│   ├── requirements.txt
│   ├── Manifiesto KMX-25-40 SAI.xlsx  # Plantilla Excel con formato visual
│   └── .venv/                 # (Se genera automáticamente)
├── src/                       # Frontend React 
├── public/
├── package.json
└── README.md
### 

---

## ✅ Instrucciones para correr el proyecto

### 🔧 Paso 1: Configurar el backend en FastAPI

1. Abre terminal en la carpeta `fastapi-manifiesto`
   ### bash
   cd fastapi-manifiesto
   ### 
2. Crea un entorno virtual:
   ### bash
   python -m venv .venv
   ### 

3. Activa el entorno virtual:

   - En Windows:
     ### bash
     .\.venv\Scripts\activate
     ### 

   - En Mac/Linux:
     ### bash
     source .venv/bin/activate
     ### 

4. Instala las dependencias:

   ### bash
   pip install -r requirements.txt
   ### 

5. Corre el servidor:

   ### bash
   uvicorn main:app --reload
   ### 

   Esto lo habilita en: `http://localhost:8000`

------------------------------------------------------------------------------------------------------


### 🔧 Paso 2: Configurar el backend en FastAPI

1. Abre terminal en la carpeta `KIAAPI`
   ### bash
   cd KIAAPI
   ### 
2. Conecta a la base de datos
   ### bash
   node app.js
   ###

------------------------------------------------------------------------------------------------------
### 💻 Paso 3: Iniciar el frontend React

1. Desde la raíz del proyecto:

   ### bash
   npm install
   npm start
   ### 

2. Abre `http://localhost:3000` 


## 🔁 Próximos pasos sugeridos

- Convertir los datos fijos en `main.py` en un endpoint POST para enviar datos desde React.
- Añadir control de fechas o filtros.
- Agregar autenticación si se requiere proteger el manifiesto.

---

