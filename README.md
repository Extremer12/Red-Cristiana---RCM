# 🌟 Red Cristiana - RCM 🌟

<div align="center">

![Red Cristiana Logo](https://img.shields.io/badge/Red%20Cristiana-RCM-blue?style=for-the-badge&logo=cross&logoColor=white)

**Una red social moderna diseñada para unir a la comunidad cristiana** ✨

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

[🚀 Demo en Vivo](#) • [📖 Documentación](#) • [🐛 Reportar Bug](https://github.com/Extremer12/Red-Cristiana-RCM/issues) • [💡 Solicitar Feature](https://github.com/Extremer12/Red-Cristiana-RCM/issues)

</div>

---

## 🎯 ¿Qué es Red Cristiana - RCM?

**Red Cristiana - RCM** es una plataforma social innovadora que conecta a creyentes de todo el mundo en un espacio seguro y edificante. Nuestra misión es fortalecer la fe, fomentar la comunión y compartir el amor de Cristo a través de la tecnología moderna.

### 🌈 ¿Por qué elegir Red Cristiana?

- 🙏 **Enfoque espiritual**: Contenido centrado en valores cristianos
- 🔒 **Ambiente seguro**: Moderación y respeto mutuo
- 🌍 **Comunidad global**: Conecta con hermanos de fe worldwide
- 💝 **Completamente gratuito**: Sin anuncios, sin costos ocultos

---

## ✨ Características Destacadas

<table>
<tr>
<td width="50%">

### 🔐 **Autenticación Segura**
- Inicio de sesión con Google
- Protección de datos personales
- Sesiones seguras con Firebase

### 📝 **Compartir Contenido**
- Publicaciones con texto e imágenes
- Editor intuitivo y fácil de usar
- Soporte para contenido multimedia

### 💬 **Interacción Social**
- Sistema de likes en tiempo real
- Comentarios constructivos
- Notificaciones instantáneas

</td>
<td width="50%">

### 👤 **Perfiles Personalizados**
- Información personal editable
- Foto de perfil personalizable
- Historial de publicaciones

### ⚡ **Tiempo Real**
- Sincronización instantánea
- Actualizaciones automáticas
- Sin necesidad de recargar

### 📱 **Diseño Responsive**
- Optimizado para móviles
- Interfaz moderna y atractiva
- Experiencia fluida en todos los dispositivos

</td>
</tr>
</table>

---

## 🛠️ Stack Tecnológico

<div align="center">

| Frontend | Backend | Base de Datos | Autenticación |
|:--------:|:-------:|:-------------:|:-------------:|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) | ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black) | ![Firestore](https://img.shields.io/badge/Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black) | ![Google](https://img.shields.io/badge/Google-4285F4?style=for-the-badge&logo=google&logoColor=white) |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) | ![Cloud Functions](https://img.shields.io/badge/Cloud%20Functions-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white) | ![Storage](https://img.shields.io/badge/Cloud%20Storage-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white) | ![Auth](https://img.shields.io/badge/Firebase%20Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black) |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) | | | |

</div>

---

## 📋 Requisitos del Sistema

### 🖥️ **Para Usuarios**
```
✅ Navegador moderno (Chrome 70+, Firefox 65+, Safari 12+, Edge 79+)
✅ Conexión a internet estable
✅ JavaScript habilitado
✅ Cuenta de Google (para autenticación)
```

### 👨‍💻 **Para Desarrolladores**
```
✅ Node.js 14+ (opcional)
✅ Git para control de versiones
✅ Editor de código (VS Code recomendado)
✅ Cuenta de Firebase/Google Cloud
✅ Conocimientos básicos de JavaScript
```

---

## 🚀 Guía de Instalación Rápida

### 📥 **Paso 1: Clonar el Repositorio**
```bash
git clone https://github.com/Extremer12/Red-Cristiana-RCM.git
cd Red-Cristiana-RCM
```

### 🔥 **Paso 2: Configurar Firebase**

1. **Crear proyecto en Firebase**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuevo proyecto
   - Habilita Google Analytics (opcional)

2. **Configurar Authentication**
   ```
   Authentication → Sign-in method → Google → Habilitar
   ```

3. **Crear base de datos Firestore**
   ```
   Firestore Database → Crear base de datos → Modo producción
   ```

### ⚙️ **Paso 3: Configurar Credenciales**

Edita `firebase.js` con tu configuración:

```javascript
const firebaseConfig = {
  apiKey: "tu-api-key-aqui",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};
```

### 🌐 **Paso 4: Ejecutar la Aplicación**

**Opción A: Python Server**
```bash
python -m http.server 8000
# Visita: http://localhost:8000
```

**Opción B: Node.js Server**
```bash
npx http-server .
# Visita: http://localhost:8080
```

**Opción C: VS Code Live Server**
```
1. Instala extensión "Live Server"
2. Clic derecho en index.html
3. "Open with Live Server"
```

---

## 🔒 Configuración de Seguridad

### 🛡️ **Reglas de Firestore**

Copia estas reglas en Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 👤 Reglas para usuarios
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 📝 Reglas para publicaciones
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                   request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
    }
    
    // 💬 Reglas para comentarios
    match /comments/{commentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                   request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
    }
  }
}
```

### 🌐 **Dominios Autorizados**

En Authentication → Settings → Authorized domains:
```
✅ localhost (desarrollo)
✅ tu-dominio.com (producción)
```

---

## 📱 Guía de Uso

### 🔑 **1. Iniciar Sesión**
```
1. Abre login.html
2. Clic en "Iniciar sesión con Google"
3. Autoriza la aplicación
4. ¡Listo! Serás redirigido al feed principal
```

### ✍️ **2. Crear Publicaciones**
```
1. En el feed principal, encuentra el composer
2. Escribe tu mensaje inspiracional
3. Agrega una imagen (opcional)
4. Clic en "Publicar"
5. Tu contenido aparecerá instantáneamente
```

### 💝 **3. Interactuar con la Comunidad**
```
❤️ Like: Clic en el corazón para mostrar apoyo
💬 Comentar: Comparte tus pensamientos
✏️ Editar: Solo tus publicaciones (menú de 3 puntos)
🗑️ Eliminar: Solo tus publicaciones (menú de 3 puntos)
```

### 👤 **4. Gestionar Perfil**
```
1. Ve a perfil.html
2. Edita tu información personal
3. Cambia tu foto de perfil
4. Guarda los cambios
```

---

## 📁 Arquitectura del Proyecto

```
🏗️ Red-Cristiana-RCM/
├── 🏠 index.html              # Página principal (Feed)
├── 🔐 login.html              # Autenticación
├── 👤 perfil.html             # Gestión de perfil
├── 🎨 styles.css              # Estilos principales
├── 🎨 perfil.css              # Estilos del perfil
├── ⚡ app.js                  # Lógica principal
├── 🔄 actions.js              # Interacciones (likes, comentarios)
├── 👤 perfil.js               # Funcionalidad del perfil
├── 🔥 firebase.js             # Configuración Firebase
└── 📖 README.md               # Documentación
```

---

## 🔧 Funcionalidades Técnicas Avanzadas

<details>
<summary>🔍 <strong>Haz clic para ver detalles técnicos</strong></summary>

### 🔐 **Sistema de Autenticación**
- Integración completa con Firebase Auth
- Manejo de estados de sesión
- Redirección automática inteligente
- Protección de rutas

### 💾 **Base de Datos**
- **Colección `users`**: Perfiles y configuraciones
- **Colección `posts`**: Publicaciones con metadata completa
- **Colección `comments`**: Sistema de comentarios anidados

### ⚡ **Sincronización en Tiempo Real**
- Listeners con `onSnapshot` para actualizaciones instantáneas
- Optimización de consultas para mejor rendimiento
- Manejo eficiente de la memoria

### 🛡️ **Seguridad**
- Validación tanto en frontend como backend
- Reglas de seguridad granulares en Firestore
- Sanitización de datos de entrada
- Protección contra XSS y injection

</details>

---

## 🐛 Solución de Problemas Comunes

<details>
<summary>❌ <strong>Error de Autenticación</strong></summary>

**Síntomas:** No puedo iniciar sesión

**Soluciones:**
```
✅ Verifica dominios autorizados en Firebase Console
✅ Revisa la configuración en firebase.js
✅ Confirma que Google Sign-In esté habilitado
✅ Limpia caché del navegador
```
</details>

<details>
<summary>🌐 <strong>Problemas de CORS</strong></summary>

**Síntomas:** Errores de CORS en consola

**Soluciones:**
```
✅ Usa servidor HTTP local (no abras archivos directamente)
✅ Configura dominios autorizados correctamente
✅ Verifica protocolo HTTPS en producción
```
</details>

<details>
<summary>💾 <strong>Base de Datos No Responde</strong></summary>

**Síntomas:** No se cargan publicaciones

**Soluciones:**
```
✅ Verifica reglas de seguridad de Firestore
✅ Confirma autenticación del usuario
✅ Revisa consola del navegador para errores
✅ Verifica conexión a internet
```
</details>

---

## 🤝 Contribuir al Proyecto

¡Nos encanta recibir contribuciones de la comunidad! 💝

### 🌟 **Formas de Contribuir**

- 🐛 **Reportar bugs** → [Issues](https://github.com/Extremer12/Red-Cristiana-RCM/issues)
- 💡 **Sugerir features** → [Discussions](https://github.com/Extremer12/Red-Cristiana-RCM/discussions)
- 📝 **Mejorar documentación** → Pull Requests
- 🔧 **Contribuir código** → Fork & Pull Request

### 📋 **Proceso de Contribución**

1. **Fork** el repositorio
2. **Crea** una rama para tu feature
   ```bash
   git checkout -b feature/mi-nueva-caracteristica
   ```
3. **Commit** tus cambios
   ```bash
   git commit -m 'Añadir nueva característica increíble'
   ```
4. **Push** a la rama
   ```bash
   git push origin feature/mi-nueva-caracteristica
   ```
5. **Abre** un Pull Request

### 📏 **Estándares de Código**

- ✅ Código limpio y comentado
- ✅ Nombres de variables descriptivos
- ✅ Funciones pequeñas y específicas
- ✅ Pruebas para nuevas funcionalidades

---

## 📄 Licencia

<div align="center">

**MIT License** 📜

*Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles*

```
Copyright (c) 2024 Cristian Bordon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

</div>

---

## 📞 Contacto y Soporte

<div align="center">

### 👨‍💻 **Cristian Bordon**
*Desarrollador Full Stack & Siervo de Cristo*

[![Email](https://img.shields.io/badge/Email-zioncode25@gmail.com-red?style=for-the-badge&logo=gmail&logoColor=white)](mailto:zioncode25@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-Extremer12-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Extremer12)
[![Project](https://img.shields.io/badge/Proyecto-Red--Cristiana--RCM-blue?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Extremer12/Red-Cristiana-RCM)

### 💬 **¿Necesitas Ayuda?**

- 🐛 **Bugs**: [Reportar Issue](https://github.com/Extremer12/Red-Cristiana-RCM/issues/new?template=bug_report.md)
- 💡 **Features**: [Solicitar Feature](https://github.com/Extremer12/Red-Cristiana-RCM/issues/new?template=feature_request.md)
- ❓ **Preguntas**: [Discussions](https://github.com/Extremer12/Red-Cristiana-RCM/discussions)
- 📧 **Contacto Directo**: [zioncode25@gmail.com](mailto:zioncode25@gmail.com)

</div>

---

<div align="center">

## 🌟 ¡Apoya el Proyecto!

**Si Red Cristiana - RCM te ha sido útil, considera:**

⭐ **Dar una estrella** al repositorio
🔄 **Compartir** con tu comunidad
🤝 **Contribuir** al desarrollo
🙏 **Orar** por el proyecto

---

### 💝 Versículo de Inspiración

*"Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres"*

**Colosenses 3:23** ✨

---

**Desarrollado con ❤️ y 🙏 para la gloria de Dios y el crecimiento de Su reino**

© 2024 Red Cristiana - RCM. Todos los derechos reservados.


        