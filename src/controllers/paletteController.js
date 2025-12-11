let palettes = [];
let nextId = 1;

function findIndex(id) {
  return palettes.findIndex(p => p.id === Number(id));
}

exports.listPalettes = (req, res) => {
  const q = req.query.name;
  if (q) return res.json(palettes.filter(p => p.name && p.name.includes(q)));
  res.json(palettes);
};

exports.getPalette = (req, res) => {
  const i = findIndex(req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Not found' });
  res.json(palettes[i]);
};

exports.createPalette = (req, res) => {
  const body = req.body || {};
  const p = { id: nextId++, name: body.name || `palette-${Date.now()}`, colors: Array.isArray(body.colors) ? body.colors : [] };
  palettes.push(p);
  res.status(201).json(p);
};

exports.updatePalette = (req, res) => {
  const i = findIndex(req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Not found' });
  const body = req.body || {};
  palettes[i].name = body.name || palettes[i].name;
  if (Array.isArray(body.colors)) palettes[i].colors = body.colors;
  res.json(palettes[i]);
};

exports.deletePalette = (req, res) => {
  const i = findIndex(req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Not found' });
  const removed = palettes.splice(i, 1)[0];
  res.json({ deleted: removed });
};
