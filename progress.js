const TOMATO_COLOR = '#bc251a'
class Progress {
  constructor(selector, { bgColor, strokeColor } = {}) {
    const ratio = (window.devicePixelRatio || 1) + 1
    const canvas = document.querySelector(selector)
    canvas.style.width = canvas.width + 'px'
    canvas.style.height = canvas.height + 'px'
    canvas.width *= ratio
    canvas.height *= ratio
    this.origin = { x: canvas.width / 2, y: canvas.height / 2 }
    this.radius = Math.min(canvas.width, canvas.height) / 2 - 1
    this.ctx = canvas.getContext('2d')

    this.init()
  }
  init() {
    const { ctx, radius, origin: { x, y } } = this
    //  先绘制一个白色背景的圆
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = TOMATO_COLOR
    ctx.fillStyle = TOMATO_COLOR
    ctx.fill()
    ctx.closePath()
    // 再绘制一个小白色圆圈来遮盖
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.arc(x, y, radius - 20, 0, 2 * Math.PI, false)
    ctx.strokeStyle = '#fff'
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.stroke()
  }
  update(progress) {
    const { ctx, radius, origin: { x, y } } = this
    const startAngel = -0.5 * Math.PI
    const endAngel = (progress * 2 - 0.5) * Math.PI
    ctx.beginPath()
    // 当前进度
    ctx.moveTo(x, y)
    ctx.arc(x, y, radius, startAngel, endAngel, false)
    ctx.strokeStyle = '#fff'
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.closePath()

    // 再绘制一个小白色圆圈来遮盖
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.arc(x, y, radius - 20, 0, 2 * Math.PI, false)
    ctx.strokeStyle = '#fff'
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.stroke()
  }
}

module.exports = Progress