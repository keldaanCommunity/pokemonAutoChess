export default {
  get (name) {
    return parseInt(window.localStorage.getItem(name) || 0, 10)
  },

  set (name, value) {
    window.localStorage.setItem(name, value)
  }
}
