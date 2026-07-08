# Feature Specification: TakiAway About and Contact Pages

**Feature Branch**: `002-about-contact-pages`

**Created**: 2026-07-07

**Status**: Draft

**Input**: User description: "Agregar dos páginas nuevas al sitio TakiAway, reemplazando \"Música\" y \"Contacto\" en el nav existente: 1. Página \"Nosotros\" (ruta /about): página estática (sin backend) que explica el propósito del proyecto TakiAway - centralizar y difundir el catálogo de artistas musicales de fusión andina/quechua de Ayacucho, dirigido a visibilizar el talento emergente de la región. 2. Página \"Contacto\" (ruta /contact): formulario funcional con campos nombre, correo electrónico y mensaje. Al enviarse, hace POST a un nuevo endpoint del backend (POST /api/v1/contact-messages) que valida los datos (nombre y mensaje no vacíos, correo con formato válido) y guarda el mensaje en una nueva tabla de PostgreSQL (contact_messages, con columnas: id, nombre, email, mensaje, fecha_creacion). No se requiere envío de correo electrónico. El frontend debe mostrar confirmación visual de éxito tras el envío, y un mensaje de error si la validación falla o el servidor no responde. La página también debe mostrar información estática de contacto: enlaces a redes sociales (Facebook, Instagram, YouTube, Spotify) y la ubicación general del proyecto (Ayacucho, Perú). Ambas páginas deben mantener el mismo Header de navegación compartido, actualizando \"Música\" a \"Nosotros\" (Contacto se mantiene con el mismo nombre). Ambas deben conservar la identidad visual ya establecida (tema oscuro, acentos rosa/naranja, fuente Permanent Marker para títulos)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - About Page Navigation and Viewing (Priority: P1)

Como visitante interesado en el proyecto, quiero acceder a una página "Nosotros" que explique de manera clara y atractiva el propósito de TakiAway para comprender su misión de visibilizar el talento emergente de la fusión andina/quechua de Ayacucho.

**Why this priority**: Es fundamental para la identidad y propósito cultural de la plataforma, permitiendo a los visitantes entender la misión y el alcance del catálogo.

**Independent Test**: El usuario puede hacer clic en "Nosotros" en el menú de navegación para abrir la página `/about` y leer la descripción del proyecto sin depender de servicios backend.

**Acceptance Scenarios**:

1. **Given** el visitante carga cualquier página de la plataforma, **When** observa la cabecera (Header), **Then** ve el enlace "Nosotros" en lugar de "Música".
2. **Given** el menú de navegación, **When** el visitante hace clic en "Nosotros", **Then** es redirigido a `/about`, donde el enlace "Nosotros" se resalta como activo y la página muestra la explicación del propósito del proyecto TakiAway.
3. **Given** la página `/about`, **When** se renderiza, **Then** mantiene el tema visual oscuro, acentos rosa/naranja y tipografía "Permanent Marker" para los títulos, de acuerdo con la guía de estilo del sitio.

---

### User Story 2 - Contact Information and Form Submission (Priority: P1)

Como visitante que desea comunicarse o colaborar, quiero enviar un mensaje mediante un formulario en la página de "Contacto" y recibir confirmaciones visuales inmediatas para saber si mi mensaje fue recibido exitosamente o si hubo algún error.

**Why this priority**: Es la única vía de interacción interactiva para que agentes externos se pongan en contacto con los gestores de TakiAway, crucial para la sostenibilidad y crecimiento del catálogo.

**Independent Test**: Rellenar el formulario con datos válidos y enviarlo muestra un mensaje de éxito; un mensaje incompleto o una falla de red muestra un mensaje de error apropiado.

**Acceptance Scenarios**:

1. **Given** el visitante accede a la ruta `/contact` (haciendo clic en "Contacto" en el menú), **When** carga la página, **Then** se visualizan los campos del formulario (Nombre, Correo Electrónico, Mensaje), la información de ubicación general (Ayacucho, Perú) y los enlaces estáticos a las redes sociales (Facebook, Instagram, YouTube, Spotify).
2. **Given** el formulario de contacto con datos válidos en todos los campos, **When** el visitante hace clic en el botón de envío, **Then** el formulario realiza un POST al servidor, guarda los datos en la base de datos PostgreSQL, y el frontend reemplaza o complementa el formulario con un mensaje visual de éxito.
3. **Given** el formulario de contacto, **When** el visitante intenta enviar el formulario sin Nombre o sin Mensaje, o con un formato de Correo Electrónico inválido (ej. sin `@`), **Then** el sistema detiene el envío, resalta el campo afectado y muestra una alerta visual de validación fallida sin enviar datos al backend.
4. **Given** el formulario de contacto, **When** el visitante envía datos válidos pero el backend no responde o experimenta un error de red/servidor, **Then** el frontend muestra un mensaje claro de error invitando a reintentar más tarde sin perder la información escrita.

### Edge Cases

- **Envío Duplicado:** Si el usuario hace clic múltiples veces rápidamente en el botón de envío, el sistema debe deshabilitar el botón de envío y mostrar un estado de carga mientras se procesa la solicitud para evitar guardar el mismo mensaje múltiples veces en la base de datos.
- **Entradas Extremadamente Largas:** ¿Cómo se maneja si el usuario introduce un mensaje extremadamente largo o un nombre muy extenso? El sistema debe contar con validaciones de longitud máxima razonables tanto en el frontend como en el backend.
- **Falta de Conectividad o Timeout:** Si la conexión a internet del usuario se corta durante el envío, el sistema debe capturar el error de red de forma segura y amigable en lugar de provocar un colapso en la aplicación.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an "About Us" page at route `/about` containing static content.
- **FR-002**: "About Us" page MUST detail TakiAway's purpose: centralizing and promoting the musical catalog of andean/quechua fusion artists from Ayacucho, Peru, to make emerging regional talent visible.
- **FR-003**: Header component MUST replace the navigation link "Música" (route `/music`) with "Nosotros" (route `/about`).
- **FR-004**: System MUST provide a Contact page at route `/contact`.
- **FR-005**: Contact page MUST display static project contact details including social media links (Facebook, Instagram, YouTube, Spotify) and the general location (Ayacucho, Perú).
- **FR-006**: Contact page MUST feature a form with input fields for: Name, Email, and Message.
- **FR-007**: Contact form MUST validate that Name and Message are non-empty and that Email has a valid format before accepting submission.
- **FR-008**: System MUST implement a backend endpoint `POST /api/v1/contact-messages` that accepts Name, Email, and Message, and enforces identical validation constraints.
- **FR-009**: Backend MUST persist the validated contact message into a new PostgreSQL table named `contact_messages` with schema columns: `id` (UUID or primary key), `nombre` (string, non-empty), `email` (string, valid email format), `mensaje` (text, non-empty), and `fecha_creacion` (timestamp automatically set to current time). No email sending functionality is required.
- **FR-010**: Frontend MUST show clear visual success feedback upon successful server response, and distinct error feedback when validations fail or when the server is unreachable or responds with an error.
- **FR-011**: Both pages and forms MUST strictly maintain the visual identity: dark theme, pink/orange accents, and "Permanent Marker" font for titles.

### Key Entities

- **ContactMessage**: Represents a message sent through the contact form by a user.
  - **Attributes**:
    - `id`: Unique identifier (UUID/Primary Key).
    - `nombre`: Sender's name (non-empty string).
    - `email`: Sender's email address (string matching standard email format).
    - `mensaje`: The text of the message (non-empty text).
    - `fecha_creacion`: Timestamp of when the message was received and persisted.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Navigation menu allows 100% of visitors to successfully navigate to the `/about` and `/contact` pages.
- **SC-002**: Visual validation of the contact form runs instantly on the client side, preventing any network transmission if fields are incomplete or invalid.
- **SC-003**: Upon submitting a valid message, the user receives a visual confirmation of success in under 2 seconds on a standard connection.
- **SC-004**: 100% of successfully submitted contact messages are correctly stored in the PostgreSQL database with their complete metadata, verifiable by querying the database.
- **SC-005**: Page designs strictly match the existing responsive, mobile-first, dark-themed visual framework with less than 50ms of rendering delay compared to existing pages.

## Assumptions

- No email sending integrations are required; PostgreSQL database persistence is the sole required destination.
- The PostgreSQL database is running and accessible inside the existing Docker Compose environment.
- The new table `contact_messages` will be automatically or manually created within the existing database container structure.
- The existing Header navigation component and App router will be updated to accommodate the new paths `/about` and `/contact`.
