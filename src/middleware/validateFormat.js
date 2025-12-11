const allowed = new Set(['hex', 'rgb', 'hsl']);
module.exports = function (req, res, next) {
  const format = req.query.format || req.body.format || req.params.format;
  if (!format) return next();
  if (!allowed.has(format.toLowerCase())) {
    return res.status(400).json({ error: 'Неверный формат. Разрешено: hex,rgb,hsl' });
  }
  next();
};
