const formatEl = document.getElementById('format');
const randBtn = document.getElementById('rand');
const seedBtn = document.getElementById('seedBtn');
const seedInput = document.getElementById('seed');
const info = document.getElementById('info');

async function applyColorFrom(url) {
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json.color) {
      document.body.style.background = json.color;
      info.textContent = `color: ${json.color} (${json.format || ''})`;
    } else {
      info.textContent = JSON.stringify(json);
    }
  } catch (e) {
    info.textContent = 'Ошибка: ' + e.message;
  }
}

randBtn.addEventListener('click', () => {
  const f = formatEl.value;
  applyColorFrom(`/api/color/random?format=${encodeURIComponent(f)}`);
});

seedBtn.addEventListener('click', () => {
  const f = formatEl.value;
  const seed = seedInput.value || 'demo';
  applyColorFrom(`/api/color/seed/${encodeURIComponent(seed)}?format=${encodeURIComponent(f)}`);
});

const palettesListEl = document.getElementById('palettesList');
const createForm = document.getElementById('createPaletteForm');
const nameInput = document.getElementById('paletteName');
const colorsInput = document.getElementById('paletteColors');

async function fetchPalettes() {
  try {
    const res = await fetch('/api/palettes');
    const data = await res.json();
    renderPalettes(data);
  } catch (e) {
    palettesListEl.textContent = 'Не удалось загрузить палитры';
  }
}

function renderPalettes(palettes) {
  palettesListEl.innerHTML = '';
  if (!Array.isArray(palettes) || palettes.length === 0) {
    palettesListEl.textContent = 'Палитр нет';
    return;
  }
  palettes.forEach(p => {
    const card = document.createElement('div');
    card.className = 'palette-card';

    const infoBlock = document.createElement('div');
    infoBlock.className = 'palette-info';

    const title = document.createElement('div');
    title.textContent = p.name || `palette-${p.id}`;

    const swatches = document.createElement('div');
    swatches.className = 'swatches';
    (Array.isArray(p.colors) ? p.colors : []).slice(0,6).forEach(c => {
      const s = document.createElement('div');
      s.className = 'swatch';
      s.style.background = c;
      swatches.appendChild(s);
    });

    infoBlock.appendChild(title);
    infoBlock.appendChild(swatches);

    const actions = document.createElement('div');
    actions.className = 'palette-actions';

    const applyBtn = document.createElement('button');
    applyBtn.textContent = 'Apply';
    applyBtn.addEventListener('click', () => {
      if (Array.isArray(p.colors) && p.colors.length) {
        if (p.colors.length === 1) document.body.style.background = p.colors[0];
        else document.body.style.background = `linear-gradient(90deg, ${p.colors.join(',')})`;
        info.textContent = `Палитра: ${p.name}`;
      }
    });

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', async () => {
      const newName = prompt('Новое имя', p.name) || p.name;
      const newColors = prompt('Цвета через запятую', (Array.isArray(p.colors) ? p.colors.join(',') : '')) || (Array.isArray(p.colors) ? p.colors.join(',') : '');
      const payload = { name: newName, colors: newColors.split(',').map(s=>s.trim()).filter(Boolean) };
      try {
        const res = await fetch(`/api/palettes/${p.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) fetchPalettes();
        else alert('Ошибка при обновлении');
      } catch (e) {
        alert('Ошибка при обновлении');
      }
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', async () => {
      if (!confirm('Удалить палитру?')) return;
      try {
        const res = await fetch(`/api/palettes/${p.id}`, { method: 'DELETE' });
        if (res.ok) fetchPalettes();
        else alert('Ошибка при удалении');
      } catch (e) {
        alert('Ошибка при удалении');
      }
    });

    actions.appendChild(applyBtn);
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    card.appendChild(infoBlock);
    card.appendChild(actions);

    palettesListEl.appendChild(card);
  });
}

createForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const colors = colorsInput.value.split(',').map(s => s.trim()).filter(Boolean);
  try {
    const res = await fetch('/api/palettes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, colors })
    });
    if (res.status === 201) {
      nameInput.value = '';
      colorsInput.value = '';
      fetchPalettes();
    } else {
      alert('Ошибка при создании палитры');
    }
  } catch (err) {
    alert('Ошибка при создании палитры');
  }
});

fetchPalettes();
