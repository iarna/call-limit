'use strict'
var test = require('tap').test
var limit = require('../index.js')


test('limit', function (t) {
  t.plan(5)
  var called = 0
  var completed = 0
  var finishers = []
  var limited = limit(function (num, cb) {
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
  var called = 0
  var completed = 0
  var finishers = []
  var example = {
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
  var called = 0
  var completed = 0
  var finishers = []
  function Example () {}
  Example.prototype = {
    test: function (num, cb) {
      ++ called
      finishers.push(cb)
    }
  }
  limit.method(Example, 'test', 2)
  var example = new Example()
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
