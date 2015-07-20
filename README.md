call-limit
----------

Limit the number of simultaneous executions of a async function.

```javascript
var fs = require('fs')
var limit = require('call-limit')
var limitedStat = limit(fs.stat, 5)
```


### USAGE:

Given that:

```javascript
var limit = require('call-limit')
```

### limit(func, maxRunning) → limitedFunc

The returned function will execute up to maxRunning calls of `func` at once. 
Beyond that they get queued and called when the previous call completes.

`func` must accept a callback as the final argument and must call it when
it completes, or `call-limit` won't know to dequeue the next thing to run.

By contrast, callers to `limitedFunc` do NOT have to pass in a callback, but
if they do they'll be called when `func` calls its callback.

### limit.method(class, methodName, maxRunning)

This is sugar for:

```javascript
class.prototype.methodName = limit(class.prototype.methodName, maxRunning)
```

### limit.method(object, methodName, maxRunning)

This is sugar for:

```javascript
object.methodName = limit(object.methodName, maxRunning)
```
