'use strict'
var test = require('tap').test
var limit = require('../index.js')


test('limit', function (t) {
  t.plan(4)
  var called = 0
  var completed = 0
  var limited = limit(function (num, cb) {
    ++ called
    setTimeout(cb, 10)
  }, 2)
  ;[1,2,3].forEach(function (num) { limited(num, function () { ++ completed }) })
  setImmediate(function () {
    t.is(called, 2, 'Immediately queued 2 callbacks')
    t.is(completed, 0, 'With no completion yet')
  })
  setTimeout(function () {
    t.is(called, 3, 'And ran final callback after waiting')
    t.is(completed, 2, 'And two complete')
  }, 11)
})

test('limit-obj-method', function (t) {
  t.plan(4)
  var called = 0
  var completed = 0
  var example = {
    sleep: function (num, cb) {
      ++ called
      setTimeout(cb, 10)
    }
  }
  limit.method(example, 'sleep', 2)
  ;[1,2,3].forEach(function (num) { example.sleep(num, function () { ++ completed }) })
  setImmediate(function () {
    t.is(called, 2, 'Immediately queued 2 callbacks')
    t.is(completed, 0, 'With no completion yet')
  })
  setTimeout(function () {
    t.is(called, 3, 'And ran final callback after waiting')
    t.is(completed, 2, 'And two complete')
  }, 11)
})

test('limit-class-method', function (t) {
  t.plan(4)
  var called = 0
  var completed = 0
  function Example () {}
  Example.prototype = {
    sleep: function (num, cb) {
      ++ called
      setTimeout(cb, 10)
    }
  }
  limit.method(Example, 'sleep', 2)
  var example = new Example()
  ;[1,2,3].forEach(function (num) { example.sleep(num, function () { ++ completed }) })
  setImmediate(function () {
    t.is(called, 2, 'Immediately queued 2 callbacks')
    t.is(completed, 0, 'With no completion yet')
  })
  setTimeout(function () {
    t.is(called, 3, 'And ran final callback after waiting')
    t.is(completed, 2, 'And two complete')
  }, 11)
})
