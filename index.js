"use strict"

function detect() {
  try {
    eval('let a = 1; const b = 2')
    return true
  }
  catch (e) {
    return false
  }
}

module.exports = detect() ? require("./call-limit.js") : require("./es5/call-limit.js")
