const { ipcRenderer } = require('electron')
const Timer = require('timer.js')
const Progress = require('../../renders/progress.js')
const {
  WORK_DURATION,
  REST_DURATION,
  LONG_REST_DURATION,
  DURATION_COLOR_MAP
} = require('../../config/consts.js')

const makeProgressInstance = (type) => {
  const themeColor = DURATION_COLOR_MAP[type]

  return new Progress('#progress', { themeColor })
}

// 进度圈
let progress = makeProgressInstance('work')

const startWork = () => {
  progress = makeProgressInstance('work')
  let workTimer = new Timer({
    tick: .01,
    ontick: (ms) => {
      updateTime(ms, WORK_DURATION)
    },
    onend: () => {
      notification()
      progress.update(1)
    }
  })
  workTimer.start(WORK_DURATION)
}

const startRest = () => {
  progress = makeProgressInstance('rest')
  new Timer({
    tick: .01,
    ontick: (ms) => {
      updateTime(ms, REST_DURATION)
    },
    onend: () => {
      notification()
      progress.update(1)
    }
  }).start(REST_DURATION)
}

const updateTime = (ms, total) => {
  const progressValue = 1 - ms / total / 1000
  let timerContainer = document.getElementById('progress_text')
  let s = (ms / 1000).toFixed(0)
  let ss = s % 60
  let mm = (s / 60 - 1).toFixed(0)
  progress.update(progressValue, `${mm.toString().padStart(2, 0)}: ${ss.toString().padStart(2, 0)}`)
}

const notification = async () => {
  let res = await ipcRenderer.invoke('work-notification')
  if (res === 'rest') {
    startRest()
  } else if (res === 'close') {
    // startWork()
  }
}

window.onload = function () {
  const workBtn = document.querySelector('#work')
  const restBtn = document.querySelector('#rest')
  const resetBtn = document.querySelector('#reset')

  workBtn.addEventListener('click', function () {
    startWork()
  })
  restBtn.addEventListener('click', function () {
    startRest()
  })
}