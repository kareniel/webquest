var choo = require('choo')
var html = require('choo/html')

var app = choo()

app.route('/', function () {
  return html`<body>hi</body>`
})

app.mount('body')
