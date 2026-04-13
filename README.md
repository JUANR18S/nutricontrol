# 🥗 NutriControl

**Sistema profesional de registro y seguimiento nutricional.**  
Gestiona perfiles de pacientes, controles y evolución nutricional de manera eficiente.

---

## 📋 Descripción

NutriControl es una aplicación web de página única (SPA) diseñada para nutricionistas y sus pacientes. Permite registrar, gestionar y hacer seguimiento de controles nutricionales, incluyendo peso, composición corporal, planes de alimentación y evolución en el tiempo.

No requiere servidor ni base de datos: toda la información se almacena en el navegador mediante `localStorage`.

---

## ✨ Funcionalidades

### Administrador (Nutricionista)
- 📊 **Dashboard** con estadísticas generales (pacientes, controles, actividad reciente)
- 👥 **Gestión de pacientes**: crear, editar, ver perfil completo y eliminar
- 📋 **Controles nutricionales**: registrar y editar controles con:
  - Peso, talla e IMC (calculado automáticamente)
  - Porcentaje de grasa corporal y masa muscular
  - Circunferencia de cintura
  - Notas clínicas y plan de alimentación
- 🔐 **Gestión de administradores**: agregar y administrar otros nutricionistas

### Paciente
- 🏠 **Dashboard personal** con resumen de su último control
- 👤 **Mi Perfil**: datos personales y cambio de contraseña
- 📈 **Mis Controles**: historial completo de controles con evolución

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura de la aplicación |
| CSS3 | Estilos y diseño responsivo |
| JavaScript (ES6+) | Lógica de la aplicación, enrutamiento y datos |
| localStorage | Persistencia de datos en el navegador |
| sessionStorage | Manejo de sesión de usuario |
| Google Fonts (Inter) | Tipografía |

> Sin frameworks, sin dependencias externas, sin servidor. Solo HTML, CSS y JS puro.

---

## 🚀 Cómo usar

1. **Clonar o descargar** el repositorio:
   ```bash
   git clone https://github.com/JUANR18S/nutricontrol.git
   ```

2. **Abrir** el archivo `index.html` en cualquier navegador moderno.  
   *(También puede servirse con cualquier servidor estático como Live Server en VS Code)*

3. **Iniciar sesión** con las credenciales de prueba:

   | Rol | Correo | Contraseña |
   |---|---|---|
   | Administrador | `admin@nutricontrol.com` | `Admin123` |
   | Paciente | `maria@ejemplo.com` | `Paciente123` |
   | Paciente | `carlos@ejemplo.com` | `Paciente123` |

> La primera vez que se abre la aplicación, se cargan datos de ejemplo automáticamente.

---

## 📁 Estructura del proyecto

```
nutricontrol/
├── index.html              # Entrada de la aplicación
├── css/
│   └── styles.css          # Estilos globales
├── js/
│   ├── app.js              # Router SPA (hash-based)
│   ├── auth.js             # Autenticación y manejo de sesión
│   ├── store.js            # Capa de datos (localStorage)
│   └── utils.js            # Utilidades (ID, hash, IMC, etc.)
├── components/
│   ├── layout.js           # Estructura general de páginas
│   ├── navbar.js           # Barra de navegación superior
│   ├── sidebar.js          # Menú lateral
│   ├── modal.js            # Componente de modales
│   └── toast.js            # Notificaciones tipo toast
└── pages/
    ├── login.js            # Página de inicio de sesión
    ├── admin/
    │   ├── dashboard.js    # Dashboard del administrador
    │   ├── patients.js     # Listado de pacientes
    │   ├── new-patient.js  # Formulario nuevo paciente
    │   ├── edit-patient.js # Formulario editar paciente
    │   ├── patient-detail.js # Perfil del paciente
    │   ├── new-control.js  # Formulario nuevo control
    │   ├── edit-control.js # Formulario editar control
    │   ├── admins.js       # Listado de administradores
    │   └── admin-form.js   # Formulario de administrador
    └── patient/
        ├── dashboard.js    # Dashboard del paciente
        ├── profile.js      # Perfil y cambio de contraseña
        └── history.js      # Historial de controles
```

---

## 🔀 Rutas de la aplicación

| Ruta | Rol requerido | Descripción |
|---|---|---|
| `#/login` | Público | Inicio de sesión |
| `#/admin/dashboard` | Admin | Dashboard principal |
| `#/admin/patients` | Admin | Listado de pacientes |
| `#/admin/patients/new` | Admin | Crear nuevo paciente |
| `#/admin/patients/:id` | Admin | Perfil del paciente |
| `#/admin/patients/:id/edit` | Admin | Editar paciente |
| `#/admin/controls/new` | Admin | Nuevo control nutricional |
| `#/admin/controls/:id/edit` | Admin | Editar control nutricional |
| `#/admin/admins` | Admin | Gestión de administradores |
| `#/patient/dashboard` | Paciente | Dashboard del paciente |
| `#/patient/profile` | Paciente | Mi perfil |
| `#/patient/history` | Paciente | Mis controles |

---

## ⚙️ Consideraciones técnicas

- **Datos**: todos los datos se guardan en `localStorage` del navegador. Limpiar el almacenamiento del sitio borrará todos los registros.
- **Sesión**: la sesión de usuario se maneja con `sessionStorage` (se cierra al cerrar la pestaña).
- **Compatibilidad**: funciona en navegadores modernos (Chrome, Firefox, Edge, Safari).
- **Sin instalación**: no requiere Node.js, npm ni ninguna herramienta de construcción.

---

## 📄 Licencia

Este proyecto es de uso educativo/personal.
