# 🍳 RecetasHub - Aplicación de Gestión de Recetas

**Autor:** Mikel Arroyo  
**Curso:** Desarrollo de Aplicaciones Web - Frameworks  
**Fecha:** Febrero 2026

## 📋 Descripción del Proyecto

RecetasHub es una aplicación web desarrollada en TypeScript que consume la API pública de recetas TheMealDB. Permite a los usuarios explorar, guardar y gestionar recetas de cocina, además de crear planes semanales de comidas.

La aplicación cuenta con dos zonas diferenciadas:
- **Zona pública**: Exploración de recetas aleatorias por categorías
- **Zona privada**: Gestión personalizada de recetas favoritas, valoraciones y planificación semanal

## 🚀 Tecnologías Utilizadas

| Tecnología | Versión |
|------------|---------|
| **TypeScript** | 5.9.3 |
| **Node.js** | Compatible con versiones LTS |
| **Bootstrap** | 5.3.8 (vía CDN) |
| **Bootstrap Icons** | 1.13.1 (vía CDN) |
| **TheMealDB API** | v1 (API Key: 1) |
| **Pug** | 3.0.3 |

## 📁 Estructura del Proyecto

```
ejercicio1_arroyo/
├── src/
│   ├── ts/                    # Código TypeScript
│   │   ├── ApiService.ts      # Servicio de consumo API
│   │   ├── StorageService.ts  # Gestión de localStorage
│   │   ├── ViewService.ts     # Renderizado de vistas
│   │   ├── Utilities.ts       # Funciones auxiliares
│   │   ├── app.ts            # Orquestador principal
│   │   ├── home.ts           # Lógica página principal
│   │   ├── details.ts        # Lógica página detalles
│   │   ├── planSemanal.ts    # Lógica planes semanales
│   │   └── [interfaces y clases]
│   └── views/                 # Plantillas Pug
│       ├── pages/
│       └── partials/
├── public/
│   ├── dist/                  # JS compilado
│   ├── css/                   # Estilos
│   ├── index.html            # Página principal
│   ├── detalles.html         # Detalles de receta
│   └── planSemanal.html      # Planificador semanal
├── tsconfig.json             # Configuración TypeScript
├── package.json              # Dependencias del proyecto
├── .gitignore               # Archivos ignorados por git
├── Dockerfile               # Configuración Docker
└── docker-compose.yml       # Orquestación de contenedores
```

## 🛠️ Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Instalar TypeScript (si no está instalado)

```bash
npm install --save-dev typescript
```

### 3. Compilar TypeScript a JavaScript

```bash
npx tsc
```

O para compilación en modo watch:

```bash
npx tsc --watch
```

### 4. Compilar plantillas Pug (opcional)

```bash
npm run build:pug
```

Para modo watch:

```bash
npm run watch:pug
```

## 🚦 Ejecución del Proyecto

### Opción 1: Servidor HTTP local

```bash
npx http-server public -p 8080
```

Accede a: `http://localhost:8080`

### Opción 2: Live Server (VS Code)

Instala la extensión "Live Server" y haz clic derecho en `index.html` > "Open with Live Server"

### Opción 3: Docker (Producción)

```bash
cd public
docker-compose up -d
```

Accede a: `http://localhost` (puerto 80)

## 📦 Modelos de Datos (TypeScript)

### Interfaces

- **User**: Usuario registrado en la aplicación
- **AuthSession**: Sesión activa del usuario
- **UserMeal**: Relación usuario-receta guardada
- **MyMeal**: Receta obtenida de la API (adaptada)
- **UserMiniMeal**: Caché mínima de recetas
- **WeeklyPlan**: Plan semanal de comidas
- **WeeklyPlanDay**: Día específico del plan
- **Category**: Categoría de recetas

### Clases

- **ApiService**: Gestión de peticiones a TheMealDB API
- **StorageService**: Persistencia en localStorage
- **ViewService**: Renderizado dinámico del DOM
- **Utilities**: Funciones auxiliares estáticas

## ✨ Funcionalidades Principales

### Zona Pública
- ✅ Exploración de 8 recetas aleatorias
- ✅ Filtrado por categorías
- ✅ Registro e inicio de sesión
- ✅ Validación de formularios
- ✅ Gestión de errores de red y API

### Zona Privada (Autenticado)
- ✅ Guardar/eliminar recetas favoritas
- ✅ Categoría favorita personalizada
- ✅ Valoración de recetas (1-5 estrellas)
- ✅ Notas personales en recetas
- ✅ Estado de recetas (quiero hacerla / la he hecho)
- ✅ Vista detallada de ingredientes
- ✅ Visualización de últimas 4 recetas guardadas
- ⏳ **Planificador semanal** (próximamente - se implementará en Angular)

## 🔐 Almacenamiento Local (localStorage)

### Claves utilizadas:

- `users`: Array de usuarios registrados
- `authSession`: Sesión activa del usuario
- `userMeals_<userId>`: Recetas guardadas por usuario
- `weeklyPlans_<userId>`: Planes semanales por usuario
- `userMiniMeals_<userId>`: Caché de recetas utilizadas

## 🌐 API Utilizada

**TheMealDB API**  
- URL: `https://www.themealdb.com/api/json/v1/1/`
- Documentación: https://www.themealdb.com/api.php
- API Key de desarrollo: `1` (solo fines educativos)

### Endpoints principales:
- `/random.php` - Receta aleatoria
- `/categories.php` - Listado de categorías
- `/filter.php?c={category}` - Recetas por categoría
- `/lookup.php?i={id}` - Detalles de receta

## 📱 Diseño Responsivo

La aplicación es totalmente adaptativa gracias a Bootstrap 5.3, con breakpoints optimizados para:
- 📱 Móvil (< 768px)
- 💻 Escritorio (≥ 768px)

## 🧪 Validaciones Implementadas

### Registro de Usuario
- ✅ Campos no vacíos
- ✅ Email válido y único
- ✅ Contraseña mínimo 4 caracteres
- ✅ Confirmación de contraseña coincidente

### Inicio de Sesión
- ✅ Email válido
- ✅ Contraseña correcta
- ✅ Usuario existente

### Recetas Guardadas
- ✅ Valoración obligatoria si está "hecha"
- ✅ Notas máximo 250 caracteres

## 🚧 Consideraciones Técnicas

### Imports en TypeScript
⚠️ **Importante**: Todos los imports deben incluir la extensión `.js`:

```typescript
import { User } from "./User.js";  // ✅ Correcto
import { User } from "./User";     // ❌ Incorrecto
```

### Carga de Módulos
Solo se carga el módulo principal en el HTML:

```html
<script type="module" src="./dist/app.js"></script>
```

Los demás módulos se cargan automáticamente mediante `import`.

## 🔄 Migración Futura a Angular

Este proyecto está diseñado con arquitectura preparada para Angular:
- **ApiService** → Injectable Service (sin cambios)
- **StorageService** → Injectable Service (sin cambios)
- **ViewService** → Componentes Angular
- **Interfaces** → Models de Angular

## 📜 Licencia

ISC License - Proyecto educativo para el curso de Frameworks

## 👨‍💻 Autor

**Mikel Arroyo**  
Desarrollo de Aplicaciones Web - Framework JavaScript  
2025-2026

---

> **Nota educativa**: Las contraseñas se almacenan en texto plano en localStorage únicamente con fines educativos. En producción, siempre se deben usar técnicas de hash y autenticación segura.
