const API_BASE = '/api/juegos';
const state = {
  juegos: [],
  filtro: {
    texto: '',
    estado: 'Todos'
  },
  editingId: null
};

function setFeedback(message, type = '') {
  const feedback = document.getElementById('feedback');
  if (!feedback) return;
  feedback.textContent = message;
  feedback.className = `feedback${type ? ` ${type}` : ''}`;
}

async function fetchJuegos() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Error al obtener juegos');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
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

async function updateJuego(id, payload) {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Error al actualizar juego');
  }

  return res.json();
}

async function deleteJuego(id) {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Error al eliminar juego');
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function applyFilters(juegos) {
  return juegos.filter((juego) => {
    const titulo = (juego.titulo || '').toLowerCase();
    const texto = state.filtro.texto.toLowerCase();
    const estado = juego.estado || '';
    const matchesTexto = texto === '' || titulo.includes(texto);
    const matchesEstado = state.filtro.estado === 'Todos' || estado === state.filtro.estado;
    return matchesTexto && matchesEstado;
  });
}

function getStatusPill(estado) {
  const safeValue = escapeHtml(estado);
  return `<span class="status-pill" data-state="${safeValue}">${safeValue}</span>`;
}

function renderCards(juegos) {
  const grid = document.getElementById('library-grid');
  grid.innerHTML = '';

  if (!juegos.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No se encontraron juegos con estos criterios.';
    grid.appendChild(empty);
    return;
  }

  juegos.forEach((juego) => {
    const card = document.createElement('article');
    card.className = 'game-card';
    card.innerHTML = `
      <div class="game-card-top">
        <div>
          <p class="game-meta">ID ${escapeHtml(juego.id)}</p>
          <h3 class="game-title">${escapeHtml(juego.titulo)}</h3>
          <p class="game-platform">${escapeHtml(juego.plataforma)}</p>
        </div>
        ${getStatusPill(juego.estado)}
      </div>
      <div class="game-card-actions">
        <button type="button" class="text-button edit-btn" data-id="${escapeHtml(juego.id)}">Editar</button>
        <button type="button" class="text-button danger-btn delete-btn" data-id="${escapeHtml(juego.id)}">Eliminar</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function updateLibrary() {
  const juegosFiltrados = applyFilters(state.juegos);
  renderCards(juegosFiltrados);
  const countText = juegosFiltrados.length === 0
    ? 'No hay resultados para los filtros actuales.'
    : `Mostrando ${juegosFiltrados.length} juego${juegosFiltrados.length === 1 ? '' : 's'}.`;
  setFeedback(countText);
}

function setControls(enabled) {
  document.querySelectorAll('button, input, select').forEach((control) => {
    control.disabled = !enabled;
  });
}

function wrapAction(fn) {
  return async (...args) => {
    setControls(false);
    try {
      await fn(...args);
    } finally {
      setControls(true);
    }
  };
}

async function load() {
  setFeedback('Cargando juegos...');
  setControls(false);

  try {
    state.juegos = await fetchJuegos();
    updateLibrary();
  } catch (err) {
    console.error(err);
    setFeedback('No se pudieron cargar los juegos.', 'error');
  } finally {
    setControls(true);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-juego');
  const searchInput = document.getElementById('filtro-titulo');
  const estadoSelect = document.getElementById('filtro-estado');
  const submitButton = document.getElementById('submit-button');
  const cancelButton = document.getElementById('cancel-edit');
  const grid = document.getElementById('library-grid');

  function setFormMode(editing, juego = null) {
    const formTitle = document.getElementById('form-title');
    const gameIdInput = document.getElementById('juego-id');

    if (editing && juego) {
      formTitle.textContent = 'Editar juego';
      submitButton.textContent = 'Guardar cambios';
      cancelButton.classList.remove('hidden');
      gameIdInput.value = juego.id;
      form.titulo.value = juego.titulo;
      form.plataforma.value = juego.plataforma;
      form.estado.value = juego.estado;
      state.editingId = juego.id;
    } else {
      formTitle.textContent = 'Agregar juego';
      submitButton.textContent = 'Agregar juego';
      cancelButton.classList.add('hidden');
      gameIdInput.value = '';
      form.reset();
      state.editingId = null;
    }
  }

  form?.addEventListener('submit', wrapAction(async (event) => {
    event.preventDefault();
    const titulo = form.titulo.value.trim();
    const plataforma = form.plataforma.value;
    const estado = form.estado.value;

    if (!titulo) {
      setFeedback('Por favor, agrega un título válido.', 'error');
      return;
    }

    setFeedback(state.editingId ? 'Guardando cambios...' : 'Guardando juego...');

    try {
      if (state.editingId) {
        await updateJuego(state.editingId, { titulo, plataforma, estado });
        setFeedback('Juego actualizado correctamente.', 'success');
      } else {
        await postJuego({ titulo, plataforma, estado });
        setFeedback('Juego agregado correctamente.', 'success');
      }
      await load();
      setFormMode(false);
    } catch (err) {
      console.error(err);
      setFeedback(err.message || 'No se pudo guardar el juego.', 'error');
    }
  }));

  cancelButton?.addEventListener('click', () => {
    setFormMode(false);
    setFeedback('Edición cancelada. Puedes agregar un nuevo juego.');
  });

  searchInput?.addEventListener('input', () => {
    state.filtro.texto = searchInput.value.trim();
    updateLibrary();
  });

  estadoSelect?.addEventListener('change', () => {
    state.filtro.estado = estadoSelect.value;
    updateLibrary();
  });

  grid?.addEventListener('click', wrapAction(async (event) => {
    const editButton = event.target.closest('.edit-btn');
    const deleteButton = event.target.closest('.delete-btn');

    if (editButton) {
      const id = Number(editButton.dataset.id);
      const juego = state.juegos.find((item) => item.id === id);
      if (!juego) return;
      setFormMode(true, juego);
      setFeedback('Editando juego seleccionado. Haz tus cambios y guarda.');
      return;
    }

    if (deleteButton) {
      const id = Number(deleteButton.dataset.id);
      const juego = state.juegos.find((item) => item.id === id);
      if (!juego) return;
      const confirmed = window.confirm(`¿Eliminar "${juego.titulo}"? Esta acción no se puede deshacer.`);
      if (!confirmed) return;

      setFeedback('Eliminando juego...');
      try {
        await deleteJuego(id);
        await load();
        setFeedback('Juego eliminado correctamente.', 'success');
      } catch (err) {
        console.error(err);
        setFeedback(err.message || 'No se pudo eliminar el juego.', 'error');
      }
    }
  }));

  load();
});
