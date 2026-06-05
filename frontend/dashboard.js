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
const API_BASE = 'http://localhost:3000/api';

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initUserUI();
  initRoleBasedUI();
  loadProfileData();

  // Admin: cargar usuarios
  if (user.role === 'ADMIN') {
    loadAdminUsers();
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
// NAVIGATION — switch de vistas
// ============================================================
const viewTitles = {
  'overview':        'Inicio',
  'courses':         'Mis Cursos',
  'progress':        'Mi Progreso',
  'materials':       'Materiales',
  'sessions':        'Sesiones en Vivo',
  'profile':         'Mi Perfil',
  'admin-users':     'Panel de Usuarios',
  'admin-materials': 'Gestión de Materiales',
  'admin-stats':     'Estadísticas',
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
