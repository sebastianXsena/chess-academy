// ============================================================
// === CONFIGURACIÓN DE API BASE ===
// ============================================================

export const API_CONFIG = {
  // Cambia esto a la URL de tu servidor en producción
  BASE_URL: 'http://localhost:3000/api',
};

// ============================================================
// Funciones de utilidad para tokens y sesión
// ============================================================
export const TokenManager = {
  getToken() {
    return localStorage.getItem('chessmaster_token');
  },
  setToken(token) {
    localStorage.setItem('chessmaster_token', token);
  },
  removeToken() {
    localStorage.removeItem('chessmaster_token');
  },

  getUser() {
    try {
      return JSON.parse(localStorage.getItem('chessmaster_user') || 'null');
    } catch {
      return null;
    }
  },
  setUser(user) {
    localStorage.setItem('chessmaster_user', JSON.stringify(user));
  },
  removeUser() {
    localStorage.removeItem('chessmaster_user');
  },

  clearSession() {
    this.removeToken();
    this.removeUser();
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  // Función helper para hacer peticiones con el token automáticamente
  async fetchWithAuth(endpoint, options = {}) {
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // NestJS puede devolver message como array (class-validator)
      const msg = Array.isArray(errorData.message)
        ? errorData.message.join(', ')
        : (errorData.message || `HTTP error! status: ${response.status}`);
      throw new Error(msg);
    }

    return response.json();
  }
};
