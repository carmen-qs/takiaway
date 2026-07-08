<!--
SYNC IMPACT REPORT
==================
- Version change: Initial Template -> v1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] -> I. Verificabilidad de datos
  - [PRINCIPLE_2_NAME] -> II. Integración audiovisual exclusiva con YouTube
  - [PRINCIPLE_3_NAME] -> III. Diseño Mobile-First
  - [PRINCIPLE_4_NAME] -> IV. Enfoque de Simplicidad para MVP
  - [PRINCIPLE_5_NAME] -> V. Stack Tecnológico Definido
  - Added Principle: VI. Persistencia de Datos Mediante Volúmenes Docker
- Added sections:
  - Restricciones y Estándares de Calidad
  - Flujo de Trabajo y Validación
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ updated / no changes needed)
  - .specify/templates/spec-template.md (✅ updated / no changes needed)
  - .specify/templates/tasks-template.md (✅ updated / no changes needed)
- Follow-up TODOs: None
-->

# TakiAway Constitution

## Core Principles

### I. Verificabilidad de datos
Toda la información de cada artista (incluyendo biografía, lugar de origen y canciones) debe provenir obligatoriamente de fuentes documentadas y citables (medios de prensa, redes oficiales del artista o entrevistas). Queda estrictamente prohibida la generación de datos inventados, imprecisos o no respaldados por evidencia real.

### II. Integración audiovisual exclusiva con YouTube
Los videos musicales de los artistas se integrarán de manera única mediante la API pública de YouTube (YouTube Data API v3) para las búsquedas y a través de reproductores incrustados (YouTube embeds) para la reproducción. No se permite el uso de scraping ni integraciones con Spotify u otras plataformas de streaming de terceros.

### III. Diseño Mobile-First
La interfaz de usuario y toda la experiencia interactiva se diseñarán y desarrollarán priorizando los dispositivos móviles como pantalla principal, garantizando una excelente usabilidad y rendimiento en teléfonos móviles, que representan la vía de acceso primordial de los usuarios en la región de Ayacucho.

### IV. Enfoque de Simplicidad para MVP
El alcance del producto para su primera versión (MVP) está estrictamente acotado a un catálogo curado de entre 5 y 8 artistas de la región de Ayacucho. No se implementarán mecanismos de autenticación de usuarios, perfiles personales ni paneles de administración en esta fase para acelerar la entrega y simplificar la arquitectura.

### V. Stack Tecnológico Definido
La arquitectura del proyecto está conformada por FastAPI en el backend, React con Vite en el frontend, y PostgreSQL como sistema de gestión de bases de datos relacionales. Todo el entorno se empaquetará, distribuirá y ejecutará localmente utilizando Docker y Docker Compose para asegurar la reproducibilidad del sistema.

### VI. Persistencia de Datos Mediante Volúmenes Docker
La persistencia de la base de datos PostgreSQL debe gestionarse de forma explícita mediante volúmenes Docker nombrados. Esto previene cualquier pérdida accidental de datos durante los reinicios, paradas o recreaciones de los contenedores del ecosistema de desarrollo o producción.

## Restricciones y Estándares de Calidad

- **Estructura del Proyecto:** El código fuente debe estar separado de forma clara y limpia entre el backend (FastAPI) y el frontend (React/Vite).
- **Consistencia de Datos:** Toda inserción de datos de artistas o canciones debe registrar de forma mandatoria la URL o referencia de la fuente citable que respalde la información.
- **Rendimiento y Ligereza:** La aplicación web debe cargar eficientemente en conexiones móviles estándar de la región de Ayacucho, minimizando el tamaño del bundle del frontend y optimizando las consultas del backend.

## Flujo de Trabajo y Validación

- **Mobile-first en el Diseño:** Toda nueva funcionalidad visual debe maquetarse y testearse inicialmente en resoluciones móviles antes de extender su soporte a pantallas de escritorio.
- **Validación Continua:** Toda modificación del backend debe acompañarse de pruebas de integración para el API de YouTube y el flujo de base de datos.
- **Configuración Local:** El levantamiento del entorno se ejecutará únicamente mediante `docker compose up --build`, garantizando un entorno aislado y sin dependencias externas complejas.

## Governance

Esta Constitución representa la ley fundamental de desarrollo del proyecto TakiAway y prevalece sobre cualquier otra decisión o preferencia individual de los desarrolladores.

- **Enmiendas:** Cualquier propuesta de cambio a los principios fundamentales debe justificarse explícitamente y requerirá la aprobación de los responsables del proyecto, generando un incremento de versión.
- **Versionamiento Semántico:**
  - **MAJOR (vX.0.0):** Cambios incompatibles con la gobernanza actual, remoción o redefinición severa de principios básicos.
  - **MINOR (v1.X.0):** Adición de nuevos principios o secciones que expandan el alcance o directrices del proyecto.
  - **PATCH (v1.0.X):** Clarificaciones de redacción, corrección de tipografías o mejoras no semánticas en la documentación.
- **Revisiones:** Cada propuesta de código (Pull Request) debe comprobar activamente el cumplimiento irrestricto de esta constitución.

**Version**: 1.0.0 | **Ratified**: 2026-07-03 | **Last Amended**: 2026-07-03
