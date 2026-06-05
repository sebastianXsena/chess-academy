// ============================================================
// === API DE PAGOS - Integración con WilloPay ===
// ============================================================

// Configuración de la API
const API_CONFIG = {
  // Backend local para procesar pagos
  LOCAL_BASE_URL: 'http://localhost:3000/api',
  // Endpoint de WilloPay (procesamiento directo)
  WILLIPAY_ENDPOINT: 'https://unissued-unblenchingly-clarine.ngrok-free.dev/api/v1/payments/process',
  ENDPOINTS: {
    PROCESS_PAYMENT: '/payments/process',
    GET_STATUS: '/payments/status'
  }
};

/**
 * Procesar pago con WilloPay
 * @param {Object} paymentData - Datos del pago
 * @param {string} paymentData.firstName - Nombre del cliente
 * @param {string} paymentData.lastName - Apellido del cliente
 * @param {string} paymentData.documentId - Documento de identidad
 * @param {string} paymentData.phone - Teléfono
 * @param {string} paymentData.email - Email
 * @param {string} paymentData.cardNumber - Número de tarjeta
 * @param {string} paymentData.expiryDate - Fecha de vencimiento (MM/YY)
 * @param {string} paymentData.cvv - CVV
 * @param {number} paymentData.amount - Monto del pago
 * @param {string} paymentData.sessionId - ID de sesión único
 */
export async function processPaymentWithWilloPay(paymentData) {
  try {
    // Validar datos requeridos
    const requiredFields = ['firstName', 'lastName', 'documentId', 'phone', 'email', 
                            'cardNumber', 'expiryDate', 'cvv', 'amount', 'sessionId'];
    
    for (const field of requiredFields) {
      if (!paymentData[field]) {
        throw new Error(`Campo requerido faltante: ${field}`);
      }
    }

    // Enviar a través del backend local (recomendado por seguridad)
    const response = await fetch(`${API_CONFIG.LOCAL_BASE_URL}${API_CONFIG.ENDPOINTS.PROCESS_PAYMENT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    const data = await response.json();
    console.log('Respuesta de WilloPay:', data);
    return data;
  } catch (error) {
    console.error('Error procesando pago con WilloPay:', error);
    throw error;
  }
}

/**
 * Obtener estado del pago procesado
 * @param {string} sessionId - ID de la sesión de pago
 */
export async function validatePayment(sessionId) {
  try {
    const response = await fetch(
      `${API_CONFIG.LOCAL_BASE_URL}${API_CONFIG.ENDPOINTS.GET_STATUS}?sessionId=${sessionId}`
    );

    if (!response.ok) {
      throw new Error(`Error obteniendo estado: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error validando pago:', error);
    throw error;
  }
}

/**
 * Obtener estado del pago en WilloPay
 * @param {string} sessionId - ID de la sesión
 */
export async function getPaymentStatus(sessionId) {
  try {
    const response = await fetch(
      `${API_CONFIG.LOCAL_BASE_URL}${API_CONFIG.ENDPOINTS.GET_STATUS}?sessionId=${sessionId}`
    );

    if (!response.ok) {
      throw new Error(`Error obteniendo estado: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error obteniendo estado del pago:', error);
    throw error;
  }
}

/**
 * Generar ID de sesión único
 */
export function generateSessionId() {
  return `SESSION_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

/**
 * Iniciar proceso de pago con WilloPay (función expuesta globalmente)
 * Ejemplo de uso en HTML:
 * <button onclick="window.initWilloPayment('Juan', 'Pérez', '123456789', '3001234567', 'juan@email.com', '4242424242424242', '12/28', '123', 100.00)">Pagar</button>
 */
window.initWilloPayment = async function(firstName, lastName, documentId, phone, email, cardNumber, expiryDate, cvv, amount) {
  try {
    // Validar datos
    if (!firstName || !lastName || !documentId || !phone || !email || !cardNumber || !expiryDate || !cvv || !amount) {
      if (window.showToast) {
        window.showToast('⚠️ Por favor completa todos los datos');
      }
      console.error('Faltan datos requeridos');
      return;
    }

    if (window.showToast) {
      window.showToast('⏳ Procesando pago con WilloPay...');
    }

    // Generar ID de sesión único
    const sessionId = generateSessionId();

    // Preparar datos del pago
    const paymentData = {
      firstName,
      lastName,
      documentId,
      phone,
      email,
      cardNumber: cardNumber.replace(/\s/g, ''), // Remover espacios
      expiryDate,
      cvv,
      amount: parseFloat(amount),
      sessionId
    };

    // Procesar pago
    const response = await processPaymentWithWilloPay(paymentData);

    if (response.status === 'APPROVED') {
      if (window.showToast) {
        window.showToast('✅ ' + response.message);
      }
      console.log('✅ Pago aprobado:', response);
      
      // Guardar en localStorage para referencia
      localStorage.setItem('lastPaymentSession', sessionId);
      localStorage.setItem('lastPaymentStatus', 'APPROVED');
      
      // Opcional: redirigir o mostrar confirmación
      if (window.location.search.includes('redirect=true')) {
        setTimeout(() => {
          window.location.href = '/?payment=success';
        }, 1500);
      }
    } else {
      if (window.showToast) {
        window.showToast('❌ ' + (response.message || 'Error al procesar el pago'));
      }
      console.error('❌ Pago rechazado:', response);
    }
  } catch (error) {
    if (window.showToast) {
      window.showToast('❌ Error: ' + error.message);
    }
    console.error('❌ Error al procesar pago:', error);
  }
};

/**
 * Formulario de pago simplificado (función auxiliar)
 * Uso: window.showPaymentForm()
 */
window.showPaymentForm = function() {
  const formHTML = `
    <div id="paymentFormOverlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999;">
      <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%;">
        <h2>Formulario de Pago - WilloPay</h2>
        <form id="willoPayForm">
          <div style="margin-bottom: 15px;">
            <input type="text" placeholder="Nombre" id="firstName" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
          </div>
          <div style="margin-bottom: 15px;">
            <input type="text" placeholder="Apellido" id="lastName" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
          </div>
          <div style="margin-bottom: 15px;">
            <input type="text" placeholder="Documento" id="documentId" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
          </div>
          <div style="margin-bottom: 15px;">
            <input type="tel" placeholder="Teléfono" id="phone" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
          </div>
          <div style="margin-bottom: 15px;">
            <input type="email" placeholder="Email" id="email" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
          </div>
          <div style="margin-bottom: 15px;">
            <input type="text" placeholder="Número de Tarjeta" id="cardNumber" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            <input type="text" placeholder="MM/YY" id="expiryDate" required style="padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            <input type="text" placeholder="CVV" id="cvv" required style="padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
          </div>
          <div style="margin-bottom: 15px;">
            <input type="number" placeholder="Monto" id="amount" step="0.01" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <button type="button" onclick="document.getElementById('paymentFormOverlay').remove()" style="padding: 10px; background: #ccc; border: none; border-radius: 5px; cursor: pointer;">Cancelar</button>
            <button type="submit" style="padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Pagar</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', formHTML);
  
  document.getElementById('willoPayForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const documentId = document.getElementById('documentId').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const amount = document.getElementById('amount').value;
    
    document.getElementById('paymentFormOverlay').remove();
    window.initWilloPayment(firstName, lastName, documentId, phone, email, cardNumber, expiryDate, cvv, amount);
  });
};

export function initPaymentAPI() {
  // Verificar si hay parámetro de pago en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment');

  if (paymentStatus === 'success') {
    if (window.showToast) {
      window.showToast('✅ ¡Pago realizado con éxito!', 'success');
    }
    // Limpiar URL
    window.history.replaceState({}, document.title, window.location.pathname);
  } else if (paymentStatus === 'cancelled') {
    if (window.showToast) {
      window.showToast('⚠️ Pago cancelado', 'warning');
    }
    // Limpiar URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}
