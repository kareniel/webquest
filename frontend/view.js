var html = require('choo/html')
var c = require('./common')

module.exports = function (state, view) {
  function errorMessage () {
    if (state.errorMessage.length !== 0) {
      return html`
        <div class="ph3 pv2 bg-red white">
          <span class="b mr1">${c.r(state.errorTranslations.prefix)}</span>
          ${c.r(state.errorTranslations[`${state.errorMessage}`])}
        </div>
      `
    } else {
      return ''
    }
  }

  if (state.initialized) {
    return html`
      <body class="sans-serif mv4 mh5 w-30-l w-70">
        ${errorMessage()}
        ${view()}
      </body>
    `
  }
  return html`<body>loading</body>`
}
