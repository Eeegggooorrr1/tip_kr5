function rndInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

function randomHex() {
  let s = '#';
  for (let i = 0; i < 6; i++) s += '0123456789abcdef'[rndInt(15)];
  return s;
}

function randomRgb() {
  return `rgb(${rndInt(255)}, ${rndInt(255)}, ${rndInt(255)})`;
}

function randomHsl() {
  return `hsl(${rndInt(360)}, ${rndInt(100)}%, ${rndInt(100)}%)`;
}

function formatColor(fmt) {
  const f = (fmt || 'hex').toLowerCase();
  if (f === 'rgb') return randomRgb();
  if (f === 'hsl') return randomHsl();
  return randomHex();
}

function hashToInt(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

function seedToHex(seed) {
  const n = hashToInt(String(seed));
  const r = (n & 0xff0000) >> 16;
  const g = (n & 0x00ff00) >> 8;
  const b = n & 0x0000ff;
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

exports.getRandomColor = (req, res) => {
  const color = formatColor(req.query.format);
  res.json({ color, format: req.query.format || 'hex' });
};

exports.getSeedColor = (req, res) => {
  const seed = req.params.seed;
  const fmt = (req.query.format || 'hex').toLowerCase();
  if (fmt === 'hex') {
    return res.json({ color: seedToHex(seed), format: 'hex', seed });
  }
  const hex = seedToHex(seed);
  if (fmt === 'rgb') {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return res.json({ color: `rgb(${r}, ${g}, ${b})`, format: 'rgb', seed });
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2 / 255 * 100;
  if (max !== min) {
    const d = max - min;
    s = l > 50 ? d / (510 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
    s = Math.round(s * 100);
    l = Math.round(l);
  } else {
    h = 0;
    s = 0;
    l = Math.round(l);
  }
  res.json({ color: `hsl(${h}, ${s}%, ${l}%)`, format: 'hsl', seed });
};

exports.postColor = (req, res) => {
  const fmt = req.body.format || req.query.format || 'hex';
  const color = formatColor(fmt);
  res.json({ color, format: fmt });
};
