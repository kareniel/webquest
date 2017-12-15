var fetch = window.fetch

module.exports = function (state, emitter) {
  state = Object.assign(state, {
    initialized: false,
    opts: {},
    firstTime: false,
    exercises: [],
    fileList: [],
    currentDir: '',
    userDir: '',
    initialized: false,
    verify: {
      file: '',
      running: false,
      done: false,
      messages: [],
      success: false
    }
  })

  state.events = Object.assign(state.events, {
    REFRESHDIRS: 'refreshDirs',
    SETCURRENTDIR: 'setCurrentDir',
    SETUSERDIR: 'setUserDir',
    SELECTFILE: 'selectFile',
    CLEARSELECTEDFILE: 'clearSelectedFile',
    VERIFY: 'verify'
  })

  emitter.on(state.events.DOMCONTENTLOADED, function () {
    fetch('/api/initialize')
      .then(res => res.json())
      .then(body => {
        Object.assign(state, body)
        state.initialized = true
        if (state.firstTime)
          emitter.emit(state.events.PUSHSTATE, '/setuserdir')
        else
          emitter.emit(state.events.RENDER)
      })
    
    registerEmitters(state, emitter)
  })
}

function registerEmitters (state, emitter) {
  emitter.on(state.events.SETCURRENTDIR, function (dir) {
    state.currentDir = dir
  })

  emitter.on(state.events.REFRESHDIRS, function (args) {
    var dir = args[0]
    var dirsonly = args[1]
    fetch(`/api/scandir?dir=${dir}&dirsonly=${dirsonly}`)
      .then(res => res.json())
      .then(body => {
        state.fileList = body
        emitter.emit(state.events.RENDER)
      })
  })

  emitter.on(state.events.SETUSERDIR, function (dir) {
    var body = JSON.stringify({ dir: dir })
    fetch('/api/setuserdir', {
      method: 'PUT',
      body: body,
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(body => {
        state.userDir = body.dir
        emitter.emit(state.events.PUSHSTATE, '/')
      })
  })

  emitter.on(state.events.SELECTFILE, function (path) {
    state.verify.file = path
    emitter.emit(state.events.RENDER)
  })

  emitter.on(state.events.CLEARSELECTEDFILE, function () {
    state.verify.file = ''
    emitter.emit(state.events.RENDER)
  })

  emitter.on(state.events.VERIFY, function (args) {
    var name = args[0]
    var file = args[1]
    state.verify.running = true
    emitter.emit(state.events.RENDER)
    fetch(`/api/verify?exercise=${name}&file=${file}`)
      .then(res => res.json())
      .then(json => {
        state.verify.messages = json.messages
        state.verify.success = json.success
        state.verify.running = false
        state.verify.done = true
        emitter.emit(state.events.RENDER)
      })
  })
}
