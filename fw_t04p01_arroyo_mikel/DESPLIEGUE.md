# Despliegue Backend (Railway) y Frontend (Netlify)

---

## BACKEND — Railway

### 1. Crear repo en GitHub solo para el backend
Crear repo vacío en GitHub (sin README ni .gitignore): `dragonball-api`

Dentro de la carpeta del backend:
```bash
git init
git remote add origin https://github.com/mikelarroyo/dragonball-api.git
git add .
git commit -m "Initial commit - Dragon Ball API"
git branch -M main
git push -u origin main
```

> El `.gitignore` debe excluir `node_modules/` y `.env`

---

### 2. En Railway
1. Ir a [railway.app](https://railway.app) → Login with GitHub
2. **New Project → GitHub Repository** → selecciona `dragonball-api`
3. Railway detecta automáticamente Node.js (por el `package.json` con `"start": "node index.js"`)

---

### 3. Variables de entorno
En el servicio → pestaña **Variables** → añadir:

| Variable | Valor |
|---|---|
| `MONGO_URI` | `mongodb+srv://fwseries_user:...@fwcluster.fanihtz.mongodb.net/fwseries?appName=fwcluster` |
| `JWT_SECRET` | `mikelarroyomikelarroyomikelarroyo` |
| `JWT_EXPIRES` | `30d` |

> No añadir `PORT` — Railway lo asigna automáticamente

---

### 4. Generar dominio público
**Settings → Networking → Generate Domain**
- Mirar en los logs el puerto que usa la app (`Servidor ejecutándose en puerto 8080`)
- Poner ese puerto al generar el dominio

---

### 5. Verificar
```
https://dragonball-api-production.up.railway.app/api/characters
→ responde "Token requerido" ✅
```

Hacer login desde `test.rest` para obtener el token:
```
POST https://dragonball-api-production.up.railway.app/api/auth/login
```

---

---

## FRONTEND — Netlify

### 1. Ficheros necesarios antes de subir

**`netlify.toml`** en la raíz del frontend:
```toml
[build]
  command = "ng build"
  publish = "dist/front_ejercicio1_arroyo/browser"
```

**`public/_redirects`** para que funcionen las rutas de Angular:
```
/* /index.html 200
```

---

### 2. Crear repo en GitHub solo para el frontend
Crear repo vacío en GitHub: `dragonball-front`

Dentro de la carpeta del frontend:
```bash
git init
git remote add origin https://github.com/mikelarroyo/dragonball-front.git
git add .
git commit -m "Initial commit - Dragon Ball Front"
git branch -M main
git push -u origin main
```

---

### 3. En Netlify
1. Ir a [netlify.com](https://netlify.com) → Login with GitHub
2. **Add new site → Import an existing project → Deploy with GitHub**
3. Seleccionar `dragonball-front`
4. Netlify detecta el `netlify.toml` automáticamente
5. **Deploy site**

---

### 4. CORS en el backend
Tras obtener la URL de Netlify, añadirla al CORS del backend en `src/app.js`:
```js
app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://tu-url.netlify.app'
  ]
}));
```
Hacer commit y push al repo del backend → Railway redespliega automáticamente.

---

### 5. Verificar
Abrir la URL de Netlify → deben verse los personajes y episodios cargando desde Railway ✅

---

## URLs finales

| Servicio | URL |
|---|---|
| API Railway | `https://dragonball-api-production.up.railway.app` |
| Frontend Netlify | `https://6a17303f90c2d28421d89554--eloquent-cuchufli-7e98e2.netlify.app` |
| Repo backend | `https://github.com/mikelarroyo/dragonball-api` |
| Repo frontend | `https://github.com/mikelarroyo/dragonball-front` |
| Repo completo | `https://github.com/mikelarroyo/fw_ejercicios_Arroyo_Mikel_25-26` |
