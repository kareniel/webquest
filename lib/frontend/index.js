var choo = require('choo')
var html = require('choo/html')
var css = require('sheetify')

css('tachyons')

var app = choo()

app.route('/', function () {
  return html`<body class="sans-serif">hi</body>`
})

app.mount('body')
