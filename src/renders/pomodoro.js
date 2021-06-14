const { ipcRenderer } = require('electron')
const Timer = require('timer.js')
const Progress = require('../../renders/progress.js')
const {
  DURATION_TIME_MAP,
  DURATION_COLOR_MAP
} = require('../../config/consts.js')

let workCount = 0
let isCurrentWork = true

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
  document.querySelector('#progress-btn').style.display = 'none'
  if (workCount % 4 === 0) {
    type = type === 'rest' ? 'long_rest' : type
  }
  const duration = DURATION_TIME_MAP[type]
  progress = makeProgressInstance(type)
  makeTimerInstance({
    ontick: (ms) => updateTime(ms, duration),
    onend: () => {
      progress.update(1)
      notification(type)
    }
  })
    .start(duration)
}

const pauseClock = () => {
  if (!timer) return
  const status = timer.getStatus()
  if (status === 'paused') {
    timer.start()
  } else if (status === 'started') {
    timer.pause()
  }
}

const updateTime = (ms, total) => {
  const progressPencent = 1 - ms / total / 1000
  let s = (ms / 1000).toFixed(0)
  let mm = Math.floor(s / 60)
  let ss = (s - mm * 60).toFixed(0)
  progress.update(progressPencent, `${mm.toString().padStart(2, 0)}:${ss.toString().padStart(2, 0)}`)
}

const notification = async (type) => {
  const btn = document.querySelector('#progress-btn')
  btn.style.display = 'block'

  if (type === 'work') {
    addPomodoroResult()
    isCurrentWork = false
    btn.innerHTML = 'Done'
    let res = await ipcRenderer.invoke('work-notification')
    if (res === 'rest') {
      startClock('rest')
    }
  } else {
    isCurrentWork = true
    btn.innerHTML = 'GO'
    let res = await ipcRenderer.invoke('rest-notification')
    if (res === 'work') {
      startClock('work')
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
  const progressBtn = document.querySelector('#progress-btn')
  const workBtn = document.querySelector('#work')
  const restBtn = document.querySelector('#rest')
  const pauseBtn = document.querySelector('#pause')
  const resetBtn = document.querySelector('#reset')

  progressBtn.addEventListener('click', function () {
    console.log('🚀 ~ file: pomodoro.js ~ line 109 ~ isCurrentWork', isCurrentWork)
    if (isCurrentWork) {
      startClock('work')
    } else {
      startClock('rest')
    }
  })
  workBtn.addEventListener('click', function () {
    startClock('work')
  })
  pauseBtn.addEventListener('click', function () {
    pauseClock()
    pauseBtn.innerHTML = pauseBtn.innerHTML === 'pause' ? 'start' : 'pause'
  })
  restBtn.addEventListener('click', function () {
    startClock('rest')
  })
  resetBtn.addEventListener('click', function () {
    if (timer) {
      timer.stop()
    }
    if (progress) {
      progress = makeProgressInstance('work')
      // progress.update(1)
    }
    progressBtn.innerHTML = 'GO'
    progressBtn.style.display = 'block'
  })
}