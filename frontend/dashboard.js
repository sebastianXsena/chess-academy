// ============================================================
// dashboard.js — ChessMaster Academy Dashboard Logic
// ============================================================

// --- Auth Guard ---
const token = localStorage.getItem('chessmaster_token');
const user  = JSON.parse(localStorage.getItem('chessmaster_user') || 'null');

if (!token || !user) {
  window.location.href = 'index.html';
}

// --- Constants ---
const BACKEND_URL = 'http://localhost:3000';
const API_BASE = `${BACKEND_URL}/api`;

function getFullUrl(url) {
  if (!url) return '#';
  if (url.startsWith('/uploads')) {
    return `${BACKEND_URL}${url}`;
  }
  return url;
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initUserUI();
  initRoleBasedUI();
  loadProfileData();

  // Admin: cargar usuarios y materiales
  if (user.role === 'ADMIN') {
    loadAdminUsers();
    loadAdminMaterials();
  }
});

// ============================================================
// USER UI — nombre, avatar, rol
// ============================================================
function initUserUI() {
  const fullName  = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Usuario';
  const initials  = getInitials(fullName);
  const roleLabel = getRoleLabel(user.role);

  // Sidebar
  document.getElementById('sidebar-avatar').textContent         = initials;
  document.getElementById('sidebar-user-name').textContent      = fullName;
  const roleBadge = document.getElementById('sidebar-user-role-badge');
  roleBadge.textContent  = roleLabel;
  roleBadge.className    = `sidebar-user-role role-${user.role?.toLowerCase()}`;

  // Topbar
  document.getElementById('topbar-avatar').textContent = initials;
  document.getElementById('topbar-name').textContent   = user.firstName || fullName;

  // Welcome
  document.getElementById('welcome-name').textContent    = user.firstName || fullName;
  document.getElementById('welcome-subtitle').textContent = getWelcomeSubtitle(user.role);
}

// ============================================================
// ROLE-BASED UI
// ============================================================
function initRoleBasedUI() {
  const role = user.role; // 'ADMIN' | 'STUDENT' | 'USER'

  if (role === 'ADMIN') {
    document.getElementById('nav-premium').style.display  = '';
    document.getElementById('nav-admin').style.display    = '';
    document.getElementById('stat-card-premium').style.display = '';
    document.getElementById('quick-lock').style.display   = 'none';
  } else if (role === 'STUDENT') {
    document.getElementById('nav-premium').style.display  = '';
    document.getElementById('stat-card-premium').style.display = '';
    document.getElementById('upgrade-card').style.display = 'none';
    document.getElementById('quick-lock').style.display   = 'none';
    // Activar paso de journey
    const jStep = document.getElementById('journey-student');
    if (jStep) {
      jStep.classList.add('completed');
      document.getElementById('badge-student').textContent = '✓';
      document.getElementById('progress-student').style.width = '100%';
    }
  } else {
    // USER normal
    document.getElementById('upgrade-card').style.display = '';
  }

  // Materiales locked/unlocked
  const locked = document.getElementById('materials-locked');
  const grid   = document.getElementById('materials-grid');
  if (role === 'ADMIN' || role === 'STUDENT') {
    if (locked) locked.style.display = 'none';
    if (grid)   grid.style.display   = 'grid';
  }
}

// ============================================================
// PROFILE DATA
// ============================================================
function loadProfileData() {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || '—';
  const initials = getInitials(fullName);

  document.getElementById('profile-avatar-big').textContent = initials;
  document.getElementById('profile-full-name').textContent  = fullName;
  document.getElementById('profile-email').textContent      = user.email || '—';

  const roleBadge = document.getElementById('profile-role-badge');
  roleBadge.textContent = getRoleLabel(user.role);
  roleBadge.className   = `profile-role-badge role-${user.role?.toLowerCase()}`;

  document.getElementById('pf-username').textContent = user.username || '—';
  document.getElementById('pf-email').textContent    = user.email    || '—';
  document.getElementById('pf-age').textContent      = user.age      ? `${user.age} años` : '—';
  document.getElementById('pf-city').textContent     = user.city     || '—';
  document.getElementById('pf-phone').textContent    = user.phone    || '—';
  document.getElementById('pf-role').textContent     = getRoleLabel(user.role);
}

// ============================================================
// ADMIN — cargar usuarios desde la API
// ============================================================
async function loadAdminUsers() {
  try {
    const res = await fetch(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('No se pudo cargar usuarios');

    const users = await res.json();
    renderUsersTable(users);

    // Stats
    document.getElementById('admin-total-users').textContent    = users.length;
    document.getElementById('admin-total-students').textContent = users.filter(u => u.role === 'STUDENT').length;
    document.getElementById('admin-stat-users').textContent     = users.length;

  } catch (err) {
    console.warn('Admin usuarios:', err.message);
    document.getElementById('users-table-body').innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; color: var(--color-text-muted); padding: 2rem;">
          No se pudo cargar la lista de usuarios. Verifica que el endpoint esté disponible.
        </td>
      </tr>`;
  }
}

function renderUsersTable(users) {
  const tbody = document.getElementById('users-table-body');
  if (!users.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--color-text-muted); padding: 2rem;">No hay usuarios registrados</td></tr>`;
    return;
  }

  tbody.innerHTML = users.map(u => `
    <tr>
      <td>
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <div style="width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg, var(--color-accent), #a8822e); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.78rem; color:#080c14; flex-shrink:0;">
            ${getInitials(`${u.firstName || ''} ${u.lastName || ''}`)}
          </div>
          <div>
            <div style="font-weight:600; font-size:0.88rem;">${u.firstName || ''} ${u.lastName || ''}</div>
            <div style="font-size:0.75rem; color:var(--color-text-muted);">@${u.username || '—'}</div>
          </div>
        </div>
      </td>
      <td style="color:var(--color-text-muted); font-size:0.85rem;">${u.email || '—'}</td>
      <td style="color:var(--color-text-muted); font-size:0.85rem;">${u.city || '—'}</td>
      <td><span class="role-pill ${u.role}">${u.role}</span></td>
      <td><span class="status-dot ${u.active ? '' : 'inactive'}">${u.active ? 'Activo' : 'Inactivo'}</span></td>
    </tr>
  `).join('');
}

// ============================================================
// ADMIN — cargar materiales desde la API
// ============================================================
async function loadAdminMaterials() {
  try {
    const res = await fetch(`${API_BASE}/materials`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('No se pudo cargar materiales');

    const materials = await res.json();
    renderMaterialsTable(materials);
  } catch (err) {
    console.warn('Admin materiales:', err.message);
    document.getElementById('admin-materials-tbody').innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; color: var(--color-text-muted); padding: 2rem;">
          No se pudo cargar la lista de materiales. Verifica que el endpoint esté disponible.
        </td>
      </tr>`;
  }
}

let currentMaterials = [];

function renderMaterialsTable(materials) {
  currentMaterials = materials;
  const tbody = document.getElementById('admin-materials-tbody');
  if (!materials.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--color-text-muted); padding: 2rem;">No hay materiales registrados</td></tr>`;
    return;
  }

  tbody.innerHTML = materials.map(m => `
    <tr>
      <td>
        <div style="font-weight:600; font-size:0.88rem;">${m.title}</div>
        <div style="font-size:0.75rem; color:var(--color-text-muted); max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${m.description || '—'}</div>
      </td>
      <td>
        <a href="${m.contentUrl || '#'}" target="_blank" style="color:var(--color-accent); text-decoration:none;">Enlace</a>
      </td>
      <td><span class="role-pill ${m.isPremium ? 'STUDENT' : 'USER'}">${m.isPremium ? 'Premium' : 'Gratis'}</span></td>
      <td style="color:var(--color-text-muted); font-size:0.85rem;">${m.author ? (m.author.firstName + ' ' + m.author.lastName) : '—'}</td>
      <td>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="openMaterialModal('${m.id}')">Editar</button>
          <button class="btn" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.25);" onclick="deleteMaterial('${m.id}')">Eliminar</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openMaterialModal(id = null) {
  document.getElementById('material-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const form = document.getElementById('material-form');
  form.reset();

  const titleEl = document.getElementById('material-modal-title');

  if (id) {
    titleEl.textContent = 'Editar Material';
    const mat = currentMaterials.find(m => m.id === id);
    if (mat) {
      document.getElementById('mat-id').value = mat.id;
      document.getElementById('mat-title').value = mat.title || '';
      document.getElementById('mat-description').value = mat.description || '';
      document.getElementById('mat-url').value = mat.contentUrl || '';
      document.getElementById('mat-premium').checked = !!mat.isPremium;
    }
  } else {
    titleEl.textContent = 'Nuevo Material';
    document.getElementById('mat-id').value = '';
  }
}

function closeMaterialModal() {
  document.getElementById('material-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

async function saveMaterial(event) {
  event.preventDefault();
  const btn = document.getElementById('btn-save-material');
  const originalText = btn.textContent;
  btn.textContent = '⏳ Guardando...';
  btn.disabled = true;

  const id = document.getElementById('mat-id').value;
  const fileInput = document.getElementById('mat-file');
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append('title', document.getElementById('mat-title').value);
  formData.append('description', document.getElementById('mat-description').value);
  formData.append('isPremium', document.getElementById('mat-premium').checked);
  
  if (file) {
    formData.append('file', file);
  } else {
    formData.append('contentUrl', document.getElementById('mat-url').value);
  }

  try {
    const url = id ? `${API_BASE}/materials/${id}` : `${API_BASE}/materials`;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Error al guardar material');
    }

    showToastMsg('✅ Material guardado exitosamente');
    closeMaterialModal();
    loadAdminMaterials();
  } catch (err) {
    showToastMsg('❌ ' + err.message);
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

async function deleteMaterial(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este material?')) return;

  try {
    const res = await fetch(`${API_BASE}/materials/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Error al eliminar material');
    }

    showToastMsg('🗑️ Material eliminado');
    loadAdminMaterials();
  } catch (err) {
    showToastMsg('❌ ' + err.message);
  }
}

// ============================================================
// APRENDIZAJE GRATUITO — cargar materiales libres
// ============================================================
async function loadFreeMaterials() {
  try {
    const res = await fetch(`${API_BASE}/materials`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('No se pudo cargar los materiales gratuitos');

    const materials = await res.json();
    const freeMaterials = materials.filter(m => m.isPremium === false);
    renderFreeMaterialsGrid(freeMaterials);
  } catch (err) {
    console.warn('Free materiales:', err.message);
    document.getElementById('free-materials-grid').innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; color: var(--color-text-muted); padding: 2rem;">
        No se pudo cargar el material gratuito.
      </div>`;
  }
}

function renderFreeMaterialsGrid(materials) {
  const grid = document.getElementById('free-materials-grid');
  if (!materials.length) {
    grid.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; color: var(--color-text-muted); padding: 2rem;">No hay materiales gratuitos disponibles por el momento.</div>`;
    return;
  }

  grid.innerHTML = materials.map(m => `
    <div class="material-card">
      <div class="material-type-badge ${m.contentUrl && (m.contentUrl.includes('youtube') || m.contentUrl.includes('youtu.be')) ? 'video' : ''}">
        ${m.contentUrl && (m.contentUrl.includes('youtube') || m.contentUrl.includes('youtu.be')) ? 'VIDEO' : 'DOC'}
      </div>
      <div class="material-icon">📚</div>
      <h4>${m.title}</h4>
      <p>${m.description || 'Sin descripción'}</p>
      <a href="${getFullUrl(m.contentUrl)}" target="_blank" class="btn btn-primary" style="margin-top:auto; text-align:center;">Abrir Material</a>
    </div>
  `).join('');
}

// ============================================================
// NAVIGATION — switch de vistas
// ============================================================
const viewTitles = {
  'overview':        'Inicio',
  'courses':         'Mis Cursos',
  'progress':        'Mi Progreso',
  'free-materials':  'Aprendizaje Gratuito',
  'materials':       'Materiales',
  'sessions':        'Sesiones en Vivo',
  'profile':         'Mi Perfil',
  'admin-users':     'Panel de Usuarios',
  'admin-materials': 'Gestión de Materiales',
  'admin-stats':     'Estadísticas',
  'play':            'Jugar Ajedrez',
};

function switchView(viewId, linkEl) {
  // Ocultar todas las vistas
  document.querySelectorAll('.dash-view').forEach(v => v.classList.remove('active'));

  // Mostrar la vista seleccionada
  const target = document.getElementById(`view-${viewId}`);
  if (target) target.classList.add('active');

  // Actualizar título
  document.getElementById('page-title').textContent = viewTitles[viewId] || 'Dashboard';

  // Actualizar links activos
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  if (linkEl) linkEl.classList.add('active');

  // Cerrar sidebar en mobile
  if (window.innerWidth <= 900) {
    document.getElementById('sidebar').classList.remove('open');
  }

  // Cargar datos según vista
  if (viewId === 'admin-users' && user.role === 'ADMIN') {
    loadAdminUsers();
  }
  if (viewId === 'admin-materials' && user.role === 'ADMIN') {
    loadAdminMaterials();
  }
  if (viewId === 'free-materials') {
    loadFreeMaterials();
  }
  if (viewId === 'play') {
    // Dar un pequeño tiempo para que la vista sea visible y el tablero calcule su tamaño
    setTimeout(() => {
      if (typeof initChessBoard === 'function') initChessBoard();
    }, 50);
  }
}

// ============================================================
// SIDEBAR TOGGLE (mobile)
// ============================================================
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ============================================================
// LOGOUT
// ============================================================
function handleLogout() {
  localStorage.removeItem('chessmaster_token');
  localStorage.removeItem('chessmaster_user');
  window.location.href = 'index.html';
}

// ============================================================
// TOAST
// ============================================================
function showToastMsg(msg) {
  const toast = document.getElementById('dash-toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============================================================
// HELPERS
// ============================================================
function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0]?.[0]?.toUpperCase() || 'U';
}

function getRoleLabel(role) {
  const labels = { ADMIN: 'Administrador', STUDENT: 'Estudiante', USER: 'Usuario' };
  return labels[role] || role || 'Usuario';
}

function getWelcomeSubtitle(role) {
  if (role === 'ADMIN')   return 'Tienes acceso total a la plataforma y gestión de usuarios.';
  if (role === 'STUDENT') return 'Tienes acceso Premium. Sigue aprendiendo y mejorando tu juego.';
  return 'Continúa tu camino hacia el dominio del ajedrez.';
}
