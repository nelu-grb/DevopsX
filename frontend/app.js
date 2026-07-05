const API_BASE = '/api/juegos';

function setFeedback(message, type = '') {
  const feedback = document.getElementById('feedback');
  if (!feedback) return;
  feedback.textContent = message;
  feedback.className = `feedback${type ? ` ${type}` : ''}`;
}

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

  if (!juegos.length) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="4" class="empty-state">Aún no hay juegos en la biblioteca.</td>';
    tbody.appendChild(row);
    return;
  }

  juegos.forEach((j) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${j.id}</td><td>${escapeHtml(j.titulo)}</td><td>${escapeHtml(j.plataforma)}</td><td>${escapeHtml(j.estado)}</td>`;
    tbody.appendChild(tr);
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-juego');
  const submitButton = form?.querySelector('button[type="submit"]');

  async function load() {
    setFeedback('Cargando juegos...');
    try {
      const juegos = await fetchJuegos();
      renderTable(juegos);
      setFeedback(`Mostrando ${juegos.length} juego${juegos.length === 1 ? '' : 's'}.`);
    } catch (err) {
      console.error(err);
      setFeedback('No se pudieron cargar los juegos.', 'error');
    }
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      titulo: form.titulo.value.trim(),
      plataforma: form.plataforma.value,
      estado: form.estado.value
    };

    if (!data.titulo) {
      setFeedback('Por favor, agrega un título.', 'error');
      return;
    }

    submitButton.disabled = true;
    setFeedback('Guardando juego...', '');

    try {
      await postJuego(data);
      form.reset();
      await load();
      setFeedback('Juego agregado correctamente.', 'success');
    } catch (err) {
      console.error(err);
      setFeedback(err.message || 'No se pudo guardar el juego.', 'error');
    } finally {
      submitButton.disabled = false;
    }
  });

  load();
});
