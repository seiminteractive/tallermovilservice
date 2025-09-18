# 🔄 Sistema de Opiniones de Google - Configuración Completa

## 📋 Resumen del Sistema

Este sistema actualiza automáticamente las opiniones de Google Places 2 veces al día usando GitHub Actions, sin necesidad de backend.

## 🔑 Paso 1: Obtener API Key y Place ID de Google

### A. Crear cuenta y obtener API Key:

1. **Ve a [Google Cloud Console](https://console.cloud.google.com/)**
2. **Crea un proyecto** o selecciona uno existente
3. **Habilita la API de Google Places:**
   - Ve a "APIs & Services" → "Library"
   - Busca "Places API"
   - Haz clic en "Enable"
4. **Crea una API Key:**
   - Ve a "APIs & Services" → "Credentials"
   - Haz clic en "Create Credentials" → "API Key"
   - Copia tu API Key

### B. Obtener Place ID de tu negocio:

1. **Ve a [Google Places ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id#find-id)**
2. **Busca "Taller Movil Service Rosario"**
3. **Copia el Place ID** (algo como: `ChIJd8BlQ2BZqJURFVMGKhQ8pqk`)

## ⚙️ Paso 2: Configurar GitHub Secrets

En tu repositorio de GitHub:

1. **Ve a Settings** → **Secrets and variables** → **Actions**
2. **Añade estos secrets:**
   - `GOOGLE_PLACES_API_KEY`: `AIzaSyCbMgYvVlDr1D1xTMdvnBkdZKRAbL07iPY`
   - `GOOGLE_PLACE_ID`: `ChIJ72TQxwCrt5URvGIAPdw-eWU`

### ✅ **Datos ya configurados:**
- **API Key**: `AIzaSyCbMgYvVlDr1D1xTMdvnBkdZKRAbL07iPY`
- **Place ID**: `ChIJ72TQxwCrt5URvGIAPdw-eWU`
- **Total de reseñas**: 342
- **Calificación promedio**: 4.9/5

## 🚀 Paso 3: Configurar Deploy a Hostinger

### Opción A: Deploy automático desde GitHub

1. **En Hostinger:**
   - Ve a "Git" en tu panel de control
   - Conecta tu repositorio de GitHub
   - Configura deploy automático

2. **Añade este workflow a `.github/workflows/deploy.yml`:**

```yaml
name: Deploy to Hostinger

on:
  push:
    branches: [ main ]
  workflow_run:
    workflows: ["Update Google Reviews"]
    types: [completed]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to Hostinger
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOSTINGER_HOST }}
        username: ${{ secrets.HOSTINGER_USERNAME }}
        key: ${{ secrets.HOSTINGER_SSH_KEY }}
        script: |
          cd /public_html
          git pull origin main
          npm run build
```

### Opción B: Deploy manual

1. **Haz push** de los cambios a GitHub
2. **Descarga** el build desde GitHub Actions
3. **Sube** los archivos a Hostinger

## 📊 Paso 4: Verificar el Sistema

### Probar localmente:

```bash
# Instalar dependencias
npm install

# Probar la actualización de opiniones
npm run update-reviews

# Ver el resultado
cat public/reviews.json
```

### Verificar en GitHub Actions:

1. **Ve a tu repositorio** → **Actions**
2. **Verifica** que el workflow "Update Google Reviews" se ejecute
3. **Revisa** los logs para asegurar que funciona

## 🔄 Cómo Funciona

### Flujo del Sistema:

1. **GitHub Actions** se ejecuta 2 veces al día (9 AM y 9 PM Argentina)
2. **Script** obtiene opiniones de Google Places API
3. **Archivo** `public/reviews.json` se actualiza
4. **Frontend** carga las opiniones desde el archivo JSON
5. **Usuario** ve opiniones actualizadas automáticamente

### Estructura de Archivos:

```
├── .github/workflows/
│   ├── update-reviews.yml    # Actualiza opiniones 2x día
│   └── deploy.yml            # Deploy automático
├── scripts/
│   └── update-reviews.js     # Script de actualización
├── public/
│   └── reviews.json          # Opiniones actualizadas
└── src/
    └── App.vue               # Carga opiniones dinámicamente
```

## 💰 Costos

### Google Places API:
- **Gratis**: Hasta 28,000 consultas/mes
- **Tu uso**: ~60 consultas/mes (2x día)
- **Costo**: $0 USD (dentro del límite gratuito)

### GitHub Actions:
- **Gratis**: 2,000 minutos/mes
- **Tu uso**: ~10 minutos/mes
- **Costo**: $0 USD (dentro del límite gratuito)

## 🛠️ Comandos Útiles

```bash
# Actualizar opiniones manualmente
npm run update-reviews

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🔍 Troubleshooting

### Error: "Faltan variables de entorno"
- Verifica que los secrets estén configurados en GitHub
- Asegúrate de que los nombres sean exactos

### Error: "Error de API: REQUEST_DENIED"
- Verifica que la API Key sea correcta
- Asegúrate de que Places API esté habilitada

### Error: "Error de API: INVALID_REQUEST"
- Verifica que el Place ID sea correcto
- Asegúrate de que el negocio esté en Google My Business

## 📞 Soporte

Si tienes problemas:
1. **Revisa** los logs de GitHub Actions
2. **Verifica** que los secrets estén configurados
3. **Prueba** el script localmente con `npm run update-reviews`

---

## ✅ Checklist de Configuración

- [ ] API Key de Google Places obtenida
- [ ] Place ID del negocio obtenido
- [ ] Secrets configurados en GitHub
- [ ] Workflow de GitHub Actions funcionando
- [ ] Deploy a Hostinger configurado
- [ ] Opiniones cargándose correctamente en el frontend

¡Sistema completo y funcionando! 🎉
