const { ipcRenderer } = require('electron')
const Timer = require('timer.js')
const Progress = require('../../renders/progress.js')
const {
  DURATION_TIME_MAP,
  DURATION_COLOR_MAP
} = require('../../config/consts.js')

let workCount = 0

const makeProgressInstance = (type) => {
  const themeColor = DURATION_COLOR_MAP[type]

  return new Progress('#progress', { themeColor })
}

const makeTimerInstance = ({ tick = .01, ontick, onend } = {}) => {
  // 中止上一个时钟
  if (timer && (timer.getStatus() === 'started' || timer.getStatus() === 'paused')) timer.stop()

  timer = new Timer({
    tick,
    ontick,
    onend
  })

  return timer
}

// 进度圈
let progress = makeProgressInstance('work')
let timer = null

const startClock = (type) => {
  if (workCount % 4 === 0) {
    type = type === 'rest' ? 'long_rest' : type
  }
  const duration = DURATION_TIME_MAP[type]
  progress = makeProgressInstance(type)
  makeTimerInstance({
    ontick: (ms) => updateTime(ms, duration),
    onend: () => {
      progress.update(1, 'done!')
      notification(type)
    }
  })
    .start(duration)
}

const pauseClose = () => {
  if (!timer) return
  const status = timer.getStatus()
  if (status === 'paused') {
    timer.start()
  } else if (status === 'started') {
    timer.pause()
  }
}

const updateTime = (ms, total) => {
  const progressValue = 1 - ms / total / 1000
  let timerContainer = document.getElementById('progress_text')
  let s = (ms / 1000).toFixed(0)
  let ss = s % 60
  let mm = (s / 60 - 1).toFixed(0)
  progress.update(progressValue, `${mm.toString().padStart(2, 0)}:${ss.toString().padStart(2, 0)}`)
}

const notification = async (type) => {
  if (type === 'work') {
    addPomodoroResult()
    let res = await ipcRenderer.invoke('work-notification')
    if (res === 'rest') {
      startClock('rest')
    }
  } else if (type === 'rest') {
    let res = await ipcRenderer.invoke('rest-notification')
    if (res === 'work') {
      startClose('work')
    }
  }
}

const addPomodoroResult = () => {
  const wrap = document.querySelector('.timer-result')
  const item = document.createElement('div')
  item.classList.add('timer-result-item')
  wrap.appendChild(item)
  workCount++
}

window.onload = function () {
  const workBtn = document.querySelector('#work')
  const restBtn = document.querySelector('#rest')
  const pauseBtn = document.querySelector('#pause')
  const resetBtn = document.querySelector('#reset')

  workBtn.addEventListener('click', function () {
    startClock('work')
  })
  pauseBtn.addEventListener('click', function () {
    pauseClose()
    pauseBtn.innerHTML = pauseBtn.innerHTML === 'pause' ? 'start' : 'pause'
  })
  restBtn.addEventListener('click', function () {
    startClock('rest')
  })
}