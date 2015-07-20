"use strict"

const defaultMaxRunning = 50

var limit = module.exports = function (func, maxRunning) {
  let running = 0
  const queue = []
  if (!maxRunning) maxRunning = defaultMaxRunning
  return function limited () {
    const self = this
    const args = Array.prototype.slice.call(arguments)
    if (running >= maxRunning) {
      queue.push(args)
      return
    }
    const cb = typeof args[args.length-1] === 'function' && args.pop()
    ++ running
    args.push(function () {
      const cbargs = arguments
      -- running
      cb && process.nextTick(function() {
        cb.apply(self, cbargs)
      })
      if (queue.length) {
        const next = queue.shift()
        limited.apply(self, next)
      }
    })
    func.apply(self, args)
  }
}

module.exports.method = function (classOrObj, method, maxRunning) {
  if (typeof classOrObj === 'function') {
    var func = classOrObj.prototype[method]
    classOrObj.prototype[method] = limit(func, maxRunning)
  } else {
    var func = classOrObj[method]
    classOrObj[method] = limit(func, maxRunning)
  }
}
