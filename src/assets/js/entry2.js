import * as libb from './libb'
import Promise from 'bluebird'
libb.funcc()
console.log('haha from entry 2')
// Configure
Promise.config({
    longStackTraces: true,
    warnings: true
})
console.log(Promise.resolve('test promise'))
