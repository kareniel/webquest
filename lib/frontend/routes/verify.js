var html = require('choo/html')

module.exports = function (state, emit) {
  var exercise = state.exercises.find(function (e) {
    return e.slug === state.params.slug
  })
}
