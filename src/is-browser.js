module.exports = new Function(
  "try { return this === window } catch(e) { return false }"
)
