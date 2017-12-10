const fetch = window.fetch

module.exports = function (state, emitter) {
  state = Object.assign(state, {
    opts: {},
    firstTime: false,
    exercises: [],
    fileList: [],
    currentDir: '',
    exerciseDir: ''
  })

  state.events = Object.assign(state.events, {
    REFRESHDIRS: 'refreshDirs',
    SETCURRENTDIR: 'setCurrentDir',
    SETEXERCISEDIR: 'setExerciseDir'
  })

  emitter.on(state.events.DOMCONTENTLOADED, function () {
    fetch('/api/initialize')
      .then(res => res.json())
      .then(body => {
        Object.assign(state, body)
        if (state.firstTime)
          emitter.emit(state.events.PUSHSTATE, '/setdir')
        else
          emitter.emit(state.events.RENDER)
      })
  })

  emitter.on(state.events.SETCURRENTDIR, function (dir) {
    state.currentDir = dir
  })

  emitter.on(state.events.REFRESHDIRS, function (dir, dirsonly) {
    fetch(`/api/scandir?dir=${dir}&dirsonly=${dirsonly}`)
      .then(res => res.json())
      .then(body => {
        state.fileList = body
        emitter.emit(state.events.RENDER)
      })
  })

  emitter.on(state.events.SETEXERCISEDIR, function (dir) {
    const body = JSON.stringify({ dir: dir })
    fetch('/api/setexercisedir', {
      method: 'PUT',
      body: body,
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(body => {
        state.exerciseDir = body.dir
        emitter.emit(state.events.RENDER)
      })
  })
}
