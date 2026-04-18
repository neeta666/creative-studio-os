/* ─── HAMBURGER ──────────────────────────────── */
const hamburgerBtn    = document.getElementById('hamburgerBtn');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const sidebar         = document.querySelector('.sidebar');

function openSidebar() {
  sidebar.classList.add('is-open');
  sidebarBackdrop.classList.add('is-open');
}

function closeSidebar() {
  sidebar.classList.remove('is-open');
  sidebarBackdrop.classList.remove('is-open');
}

hamburgerBtn.addEventListener('click', openSidebar);
sidebarBackdrop.addEventListener('click', closeSidebar);

/* ─── PERSONA RESTORE ────────────────────────── */
/*
  Reads the persona saved by persona.js and updates:
  - Sidebar avatar letter
  - Sidebar persona name
  - Header pill label
*/
const savedPersona = localStorage.getItem('activePersona');
const savedLabel   = localStorage.getItem('activePersonaLabel');

if (savedLabel) {
  const avatarEl      = document.querySelector('.sidebar__persona-avatar');
  const nameEl        = document.querySelector('.sidebar__persona-name');
  const pillPersonaEl = document.querySelector('.pill--persona');

  if (avatarEl)      avatarEl.textContent      = savedLabel.charAt(0).toUpperCase();
  if (nameEl)        nameEl.textContent         = savedLabel;
  if (pillPersonaEl) pillPersonaEl.lastChild.textContent = ' ' + savedLabel;
}