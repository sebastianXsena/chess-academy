// ============================================================
// === MÓDULO DE FORMULARIOS — Registro y Login
// ============================================================

const FormulariosModule = {
  // ============================================================
  // Crear modal de registro
  // ============================================================
  crearModalRegistro() {
    const html = `
      <div id="register-modal" class="modal" style="display: none;">
        <div class="modal-content" style="max-width: 600px;">
          <div class="modal-header">
            <h2>Crear Cuenta</h2>
            <button class="modal-close" onclick="FormulariosModule.cerrarRegistro()">&times;</button>
          </div>
          <form id="register-form" onsubmit="FormulariosModule.manejarRegistro(event)">
            <div class="form-row">
              <div class="form-group">
                <label for="reg-nombre">Nombre *</label>
                <input type="text" id="reg-nombre" name="nombre" required>
              </div>
              <div class="form-group">
                <label for="reg-apellido">Apellido *</label>
                <input type="text" id="reg-apellido" name="apellido" required>
              </div>
            </div>

            <div class="form-group">
              <label for="reg-usuario">Nombre de Usuario *</label>
              <input type="text" id="reg-usuario" name="usuario" required>
            </div>

            <div class="form-group">
              <label for="reg-correo">Correo Electrónico *</label>
              <input type="email" id="reg-correo" name="correo" required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="reg-edad">Edad *</label>
                <input type="number" id="reg-edad" name="edad" min="1" max="120" required>
              </div>
              <div class="form-group">
                <label for="reg-ciudad">Ciudad *</label>
                <input type="text" id="reg-ciudad" name="ciudad" required>
              </div>
            </div>

            <div class="form-group">
              <label for="reg-telefono">Teléfono *</label>
              <input type="tel" id="reg-telefono" name="telefono" required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="reg-password">Contraseña *</label>
                <input type="password" id="reg-password" name="password" required>
              </div>
              <div class="form-group">
                <label for="reg-password-confirm">Confirmar Contraseña *</label>
                <input type="password" id="reg-password-confirm" name="passwordConfirm" required>
              </div>
            </div>

            <div id="register-error" class="error-message" style="display: none;"></div>
            <div id="register-success" class="success-message" style="display: none;"></div>

            <button type="submit" class="btn-primary" style="width: 100%; margin-top: 20px;">
              Registrarse
            </button>

            <p style="text-align: center; margin-top: 15px;">
              ¿Ya tienes cuenta? 
              <a href="#" onclick="FormulariosModule.cambiarALogin(); return false;">Inicia Sesión</a>
            </p>
          </form>
        </div>
      </div>
    `;
    return html;
  },

  // ============================================================
  // Crear modal de login
  // ============================================================
  crearModalLogin() {
    const html = `
      <div id="login-modal" class="modal" style="display: none;">
        <div class="modal-content" style="max-width: 400px;">
          <div class="modal-header">
            <h2>Iniciar Sesión</h2>
            <button class="modal-close" onclick="FormulariosModule.cerrarLogin()">&times;</button>
          </div>
          <form id="login-form" onsubmit="FormulariosModule.manejarLogin(event)">
            <div class="form-group">
              <label for="login-correo">Correo Electrónico *</label>
              <input type="email" id="login-correo" name="correo" required>
            </div>

            <div class="form-group">
              <label for="login-password">Contraseña *</label>
              <input type="password" id="login-password" name="password" required>
            </div>

            <div id="login-error" class="error-message" style="display: none;"></div>
            <div id="login-success" class="success-message" style="display: none;"></div>

            <button type="submit" class="btn-primary" style="width: 100%; margin-top: 20px;">
              Iniciar Sesión
            </button>

            <p style="text-align: center; margin-top: 15px;">
              ¿No tienes cuenta? 
              <a href="#" onclick="FormulariosModule.cambiarARegistro(); return false;">Registrate aquí</a>
            </p>
          </form>
        </div>
      </div>
    `;
    return html;
  },

  // ============================================================
  // Inicializar modales
  // ============================================================
  inicializarModales() {
    // Inyectar modales al body si no existen
    if (!document.getElementById('register-modal')) {
      document.body.insertAdjacentHTML('beforeend', this.crearModalRegistro());
    }
    if (!document.getElementById('login-modal')) {
      document.body.insertAdjacentHTML('beforeend', this.crearModalLogin());
    }

    // Cerrar modal al hacer click fuera
    document.addEventListener('click', (e) => {
      const registerModal = document.getElementById('register-modal');
      const loginModal = document.getElementById('login-modal');
      
      if (e.target === registerModal) {
        this.cerrarRegistro();
      }
      if (e.target === loginModal) {
        this.cerrarLogin();
      }
    });
  },

  // ============================================================
  // Abrir/Cerrar modales
  // ============================================================
  abrirLogin() {
    this.inicializarModales();
    document.getElementById('login-modal').style.display = 'flex';
  },

  cerrarLogin() {
    const modal = document.getElementById('login-modal');
    if (modal) {
      modal.style.display = 'none';
      document.getElementById('login-form').reset();
      document.getElementById('login-error').style.display = 'none';
    }
  },

  abrirRegistro() {
    this.inicializarModales();
    document.getElementById('register-modal').style.display = 'flex';
  },

  cerrarRegistro() {
    const modal = document.getElementById('register-modal');
    if (modal) {
      modal.style.display = 'none';
      document.getElementById('register-form').reset();
      document.getElementById('register-error').style.display = 'none';
    }
  },

  cambiarALogin() {
    this.cerrarRegistro();
    this.abrirLogin();
  },

  cambiarARegistro() {
    this.cerrarLogin();
    this.abrirRegistro();
  },

  // ============================================================
  // Manejar envío de formulario de registro
  // ============================================================
  async manejarRegistro(event) {
    event.preventDefault();

    const form = document.getElementById('register-form');
    const errorDiv = document.getElementById('register-error');
    const successDiv = document.getElementById('register-success');
    const submitBtn = form.querySelector('button[type="submit"]');

    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Registrando...';

      const formData = {
        nombre: document.getElementById('reg-nombre').value,
        apellido: document.getElementById('reg-apellido').value,
        usuario: document.getElementById('reg-usuario').value,
        correo: document.getElementById('reg-correo').value,
        edad: document.getElementById('reg-edad').value,
        ciudad: document.getElementById('reg-ciudad').value,
        telefono: document.getElementById('reg-telefono').value,
        password: document.getElementById('reg-password').value,
        passwordConfirm: document.getElementById('reg-password-confirm').value,
      };

      const resultado = await window.registrarUsuario(formData);

      if (resultado.success) {
        successDiv.textContent = '✓ Registro exitoso. Iniciando sesión...';
        successDiv.style.display = 'block';

        // Cerrar modal y hacer login automático
        setTimeout(() => {
          this.cerrarRegistro();
          // Redirigir al dashboard
          window.location.href = 'dashboard.html';
        }, 1500);
      }
    } catch (error) {
      errorDiv.textContent = '✗ ' + (error.message || 'Error al registrar');
      errorDiv.style.display = 'block';
      console.error('Error:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Registrarse';
    }
  },

  // ============================================================
  // Manejar envío de formulario de login
  // ============================================================
  async manejarLogin(event) {
    event.preventDefault();

    const form = document.getElementById('login-form');
    const errorDiv = document.getElementById('login-error');
    const successDiv = document.getElementById('login-success');
    const submitBtn = form.querySelector('button[type="submit"]');

    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Iniciando sesión...';

      const correo = document.getElementById('login-correo').value;
      const password = document.getElementById('login-password').value;

      const resultado = await window.loginUsuario(correo, password);

      if (resultado.success) {
        successDiv.textContent = '✓ Sesión iniciada. Redirigiendo...';
        successDiv.style.display = 'block';

        setTimeout(() => {
          this.cerrarLogin();
          window.location.href = 'dashboard.html';
        }, 1000);
      }
    } catch (error) {
      errorDiv.textContent = '✗ ' + (error.message || 'Error al iniciar sesión');
      errorDiv.style.display = 'block';
      console.error('Error:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Iniciar Sesión';
    }
  }
};

// Alias globales para compatibilidad
function openRegister() {
  FormulariosModule.abrirRegistro();
}

function openLogin() {
  FormulariosModule.abrirLogin();
}

// Alias para logout
async function logoutUser() {
  await window.logoutUsuario();
}

// Exportar al scope global
window.FormulariosModule = FormulariosModule;
window.openRegister = openRegister;
window.openLogin = openLogin;
window.logoutUser = logoutUser;
