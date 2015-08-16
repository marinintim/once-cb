module.exports = function(real) {
    var ret = function() {
        if (!ret.called) {
            ret.called = true
            real.apply(this, arguments)
        }
    }

    return ret
}
