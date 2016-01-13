import {funca} from './liba'
funca()
console.log('haha from entry1')

function test() {
  let a = 1
  if (a) {
    let a = 2
    console.log(a)
  }
  console.log(a)
}

test()

;(async function () {
  const data = await fetch('/subfolder/a.html').then(r => r.text())
  console.log(`Got async data: ${data}`)
})()
