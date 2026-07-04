const API_BASE = '/api/juegos';

async function fetchJuegos() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Error al obtener juegos');
  return res.json();
}

async function postJuego(payload) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Error al crear juego');
  }
  return res.json();
}

function renderTable(juegos) {
  const tbody = document.querySelector('#tabla-juegos tbody');
  tbody.innerHTML = '';
  juegos.forEach(j => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${j.id}</td><td>${escapeHtml(j.titulo)}</td><td>${escapeHtml(j.plataforma)}</td><td>${escapeHtml(j.estado)}</td>`;
    tbody.appendChild(tr);
  });
}

function escapeHtml(s){
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-juego');

  async function load() {
    try {
      const juegos = await fetchJuegos();
      renderTable(juegos);
    } catch (err) {
      console.error(err);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      titulo: form.titulo.value.trim(),
      plataforma: form.plataforma.value,
      estado: form.estado.value
    };
    try {
      await postJuego(data);
      form.reset();
      load();
    } catch (err) {
      alert(err.message);
    }
  });

  load();
});
