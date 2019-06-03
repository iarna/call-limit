'use strict'
const test = require('tap').test
const limit = require('../call-limit.js')


test('limit', function (t) {
  t.plan(5)
  let called = 0
  let completed = 0
  const finishers = []
  const limited = limit(function (num, cb) {
    ++ called
    finishers.push(cb)
  }, 2)
  ;[1,2,3].forEach(function (num) { limited(num, function () { ++ completed }) })
  setImmediate(function () {
    t.is(called, 2, 'Immediately queued 2 callbacks')
    t.is(completed, 0, 'With no completion yet')
    // immediately complete one of them...
    finishers.shift()()
    setImmediate(afterCompletion)
  })
  function afterCompletion () {
    t.is(completed, 1, 'Calling the finisher completed the first one')
    t.is(called, 3,'Third action was started')
    finishers.shift()()
    finishers.shift()()
    setImmediate(afterAllDone)
  }
  function afterAllDone () {
    t.is(completed, 3, 'All completed')
  }
})

test('limit-obj-method', function (t) {
  t.plan(5)
  let called = 0
  let completed = 0
  const finishers = []
  const example = {
    test: function (num, cb) {
      ++ called
      finishers.push(cb)
    }
  }
  limit.method(example, 'test', 2)
  ;[1,2,3].forEach(function (num) { example.test(num, function () { ++ completed }) })
  setImmediate(function () {
    t.is(called, 2, 'Immediately queued 2 callbacks')
    t.is(completed, 0, 'With no completion yet')
    // immediately complete one of them...
    finishers.shift()()
    setImmediate(afterCompletion)
  })
  function afterCompletion () {
    t.is(completed, 1, 'Calling the finisher completed the first one')
    t.is(called, 3,'Third action was started')
    finishers.shift()()
    finishers.shift()()
    setImmediate(afterAllDone)
  }
  function afterAllDone () {
    t.is(completed, 3, 'All completed')
  }
})

test('limit-class-method', function (t) {
  t.plan(5)
  let called = 0
  let completed = 0
  const finishers = []
  function Example () {}
  Example.prototype = {
    test: function (num, cb) {
      ++ called
      finishers.push(cb)
    }
  }
  limit.method(Example, 'test', 2)
  const example = new Example()
  ;[1,2,3].forEach(function (num) { example.test(num, function () { ++ completed }) })
  setImmediate(function () {
    t.is(called, 2, 'Immediately queued 2 callbacks')
    t.is(completed, 0, 'With no completion yet')
    // immediately complete one of them...
    finishers.shift()()
    setImmediate(afterCompletion)
  })
  function afterCompletion () {
    t.is(completed, 1, 'Calling the finisher completed the first one')
    t.is(called, 3,'Third action was started')
    finishers.shift()()
    finishers.shift()()
    setImmediate(afterAllDone)
  }
  function afterAllDone () {
    t.is(completed, 3, 'All completed')
  }
})

test('promise', function (t) {
  if (!global.Promise) return
  t.plan(5)
  let called = 0
  let completed = 0
  const finishers = []
  const limited = limit.promise(function (num) {
    ++ called
    return new Promise(function (resolve) {
      finishers.push(resolve)
    })
  }, 2)
  for (let ii = 0; ii < 3; ++ii) {
    limited(ii + 1).then(function () {
      ++ completed
    })
  }
  setImmediate(function () {
    t.is(called, 2, 'Immediately queued 2 callbacks')
    t.is(completed, 0, 'With no completion yet')
    // immediately complete one of them...
    finishers.shift()()
    setImmediate(afterCompletion)
  })
  function afterCompletion () {
    t.is(completed, 1, 'Calling the finisher completed the first one')
    t.is(called, 3,'Third action was started')
    finishers.shift()()
    finishers.shift()()
    setImmediate(afterAllDone)
  }
  function afterAllDone () {
    t.is(completed, 3, 'All completed')
  }
})

test('limit-promiseobj-method', function (t) {
  t.plan(5)
  let called = 0
  let completed = 0
  const finishers = []
  const example = {
    test: function (num) {
      ++ called
      return new Promise(resolve => {
        finishers.push(resolve)
      })
    }
  }
  limit.promise.method(example, 'test', 2)
  for (let ii = 0; ii < 3; ++ii) {
    example.test(ii + 1).then(function () {
      ++ completed
    })
  }
  setImmediate(function () {
    t.is(called, 2, 'Immediately queued 2 callbacks')
    t.is(completed, 0, 'With no completion yet')
    // immediately complete one of them...
    finishers.shift()()
    setImmediate(afterCompletion)
  })
  function afterCompletion () {
    t.is(completed, 1, 'Calling the finisher completed the first one')
    t.is(called, 3,'Third action was started')
    finishers.shift()()
    finishers.shift()()
    setImmediate(afterAllDone)
  }
  function afterAllDone () {
    t.is(completed, 3, 'All completed')
  }
})

test('limit-promiseclass-method', function (t) {
  t.plan(5)
  let called = 0
  let completed = 0
  const finishers = []
  function Example () {}
  Example.prototype = {
    test: function (num, cb) {
      ++ called
      return new Promise(resolve => {
        finishers.push(resolve)
      })
    }
  }
  limit.promise.method(Example, 'test', 2)
  const example = new Example()
  for (let ii = 0; ii < 3; ++ii) {
    example.test(ii + 1).then(function () {
      ++ completed
    })
  }
  setImmediate(function () {
    t.is(called, 2, 'Immediately queued 2 callbacks')
    t.is(completed, 0, 'With no completion yet')
    // immediately complete one of them...
    finishers.shift()()
    setImmediate(afterCompletion)
  })
  function afterCompletion () {
    t.is(completed, 1, 'Calling the finisher completed the first one')
    t.is(called, 3,'Third action was started')
    finishers.shift()()
    finishers.shift()()
    setImmediate(afterAllDone)
  }
  function afterAllDone () {
    t.is(completed, 3, 'All completed')
  }
})
