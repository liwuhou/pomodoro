const { ipcRenderer } = require('electron')
const Timer = require('timer.js')
const Progress = require('./progress.js')

const workDuration = 25 * 60
const progress = new Progress('#progress')

function startWork() {
  let workTimer = new Timer({
    tick: .1,
    ontick: (ms) => {
      updateTime(ms)
    },
    onend: () => {
      notification()
    }
  })
  workTimer.start(workDuration)
}

function updateTime(ms) {
  let timerContainer = document.getElementById('progress_text')
  let s = (ms / 1000).toFixed(0)
  let ss = s % 60
  let mm = (s / 60 - 1).toFixed(0)
  timerContainer.innerText = `${mm.toString().padStart(2, 0)}: ${ss.toString().padStart(2, 0)}`
  progress.update(1 - ms / workDuration / 1000)
}

async function notification() {
  let res = await ipcRenderer.invoke('work-notification')
  if (res === 'rest') {
    setTimeout(() => {
      alert('休息')
    }, 5 * 1000)
  } else if (res === 'work') {
    startWork()
  }
}

startWork()