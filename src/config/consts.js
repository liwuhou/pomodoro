
// 工作时钟
// const WORK_DURATION = 25 * 60
const WORK_DURATION = 2
// 休息钟
// const REST_DURATION = 5 * 60
const REST_DURATION = 1
// 长休息钟
const LONG_REST_DURATION = 1.5

module.exports = {
  WORK_DURATION,
  REST_DURATION,
  LONG_REST_DURATION,
  // 时钟类型对应的颜色
  DURATION_COLOR_MAP: {
    work: '#bc251a',
    rest: '#65d979',
    long_rest: '#65d979'
  },
  DURATION_TIME_MAP: {
    work: WORK_DURATION,
    rest: REST_DURATION,
    long_rest: LONG_REST_DURATION
  }
}
