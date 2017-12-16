var html = require('choo/html')

module.exports = function (state, view) {
  if (state.initialized) {
    return view()
  }
  return html`<body>loading</body>`
}
