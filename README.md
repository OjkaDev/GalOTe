![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)
![Astro](https://img.shields.io/badge/Astro-5.0-FF5D01?style=flat-square&logo=astro)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=flat-square&logo=javascript)
![License](https://img.shields.io/badge/License-AGPL--3.0-blue?style=flat-square)

# 🚀 GalOTe — Proyecto Astro con React y TailwindCSS

Este proyecto es una prueba técnica desarrollada con Astro 5, React 19 y TailwindCSS 4, creada con el propósito de practicar y profundizar en estas tecnologías. Durante mi primera semana de prácticas en SAGATECH recibí formación intensiva sobre estas herramientas y, tras asimilar la teoría, quise aplicarla en un proyecto real.

Buscaba crear algo útil, no solo un ejercicio más de práctica. La idea surgió de una costumbre que tengo con mi esposa: mientras vemos las galas del programa de televisión Operación Triunfo, nos gusta puntuar a los concursantes y hacer nuestras propias nominaciones, normalmente usando papel y boli. Vi la oportunidad perfecta de convertir esa dinámica en una aplicación práctica mientras experimentaba con estas tecnologías.

---

## 🛠️ Tecnologías utilizadas

* **Astro 5.14.1** — Framework ultrarápido orientado a componentes.
* **React 19** — Para componentes interactivos dentro de Astro.
* **TailwindCSS 4** — Estilos utilitarios modernos.
* **@astrojs/react** — Integración oficial de React en Astro.
* **Vite** — Dev server y bundler de alto rendimiento.

---

## 📘 ¿Qué he aprendido y consolidado?

* **Astro + React** — Cómo combinar componentes `.astro` (estáticos) con componentes `.jsx` (interactivos) para optimizar el rendimiento y la experiencia del usuario.

* **Gestión de estado con React Hooks** — Uso de `useState` y `useEffect` para manejar datos dinámicos, escuchar eventos globales y actualizar vistas en tiempo real.

* **LocalStorage y eventos personalizados** — Almacenar datos en el navegador y usar `window.dispatchEvent()` para comunicar cambios entre componentes sin necesidad de prop drilling.

* **TailwindCSS avanzado** — Clases de transición, animaciones suaves, grid dinámico con `grid-auto-flow: dense`, y estilos responsivos complejos.

* **Integración de componentes Astro con React** — Resolver limitaciones como la imposibilidad de renderizar componentes `.astro` desde React, llevando a la conversión a JSX cuando es necesario.

* **Arquitectura escalable** — Estructurar componentes reutilizables, separar lógica de presentación, y mantener el código limpio y modular.

* **Trabajo con datos dinámicos** — Filtrar, ordenar y clasificar datos en función de criterios complejos (media de votos, estado de concursantes, nominaciones).

* **Diseño Responsive** — Crear un diseño responsive para la correcta visualización tanto en ordenador como en móviles.


## 📦 Instalación y ejecución

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/OjkaDev/GalOTe.git
cd ot-prueba
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Ejecutar en modo desarrollo

```bash
npm run dev
```

### 4️⃣ Generar build para producción

```bash
npm run build
```

### 5️⃣ Previsualizar la build

```bash
npm run preview
```

---

## 📁 Estructura del proyecto

```
/
├─ public/           -> Archivos estáticos
├─ src/
│  ├─ components/    -> Componentes React y Astro
│  ├─ layouts/       -> Plantillas de páginas
│  └─ pages/         -> Rutas del sitio
├─ package.json
├─ astro.config.mjs
└─ tailwind.config.mjs

```
## 📄 Licencia

Este proyecto está licenciado bajo la licencia GNU AFFERO GENERAL PUBLIC LICENSE - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 💬 Contacto

Si quieres contactar conmigo para ver más proyectos o colaborar:

* **GitHub:** [https://github.com/OjkaDev](https://github.com/OjkaDev)
* **LinkedIn:** *www.linkedin.com/in/ojkadev*

---
