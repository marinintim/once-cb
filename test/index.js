var test = require('tape')

var once = require('../')

test('should call callback only once', function(t) {
    t.plan(3)

    var i = 0
    var cb = function() { i++ }
    cb = once(cb)
    t.equal(i, 0, 'wrapping should not cause incidental calling')
    cb()
    t.equal(i, 1, 'should call original callback')
    cb()
    t.equal(i, 1, 'should not call second time')
})

test('should pass arguments', function(t) {
    t.plan(2)

    var cb = function(err, res) {
        t.error(err, 'should preserve null')
        t.ok(res, 'should pass object')
    }

    cb = once(cb)

    cb(null, { value: 'ok' })
})

test('should set property called', function(t) {
    t.plan(2)

    var cb = once(function() {})

    t.notOk(cb.called, 'property should not be truthy until it was called')
    cb()
    t.ok(cb.called, 'property should be truthy after the call')
})

test('should respect context', function(t) {
    t.plan(4)

    var ctx = { okieDokie: true }
    var cb = function(method) {
        t.ok(this.okieDokie, 'context was respected with ' + method)
    }

    var applyCb = once(cb)
    applyCb.apply(ctx, [ 'apply '])

    var bindCb = once(cb)
    bindCb.bind(ctx, 'bind')()

    var callCb = once(cb)
    callCb.call(ctx, 'call')

    ctx.method = once(cb)
    ctx.method('object method')
})

test('in case of emergency should be able to call second time', function(t) {
    t.plan(1)

    var i = 0
    var cb = once(function() { i++ })
    cb()

    cb.called = false

    cb()

    t.equal(i, 2)
})
