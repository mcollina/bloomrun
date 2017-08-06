const Benchmark = require('benchmark')
const suite = new Benchmark.Suite()

const patrun = require('patrun')({ gex: true })
const bloomrun = require('..')()

patrun.add({ role: 'test', action: 'other', id: '*' }, 'result')
bloomrun.add({ role: 'test', action: 'other', id: /.*/ }, 'result')

suite.add('patrun#add', () => {
  patrun.add({test: 'pattern'}, 'test pattern')
})
suite.add('bloomrun#add', () => {
  bloomrun.add({test: 'pattern'}, 'test pattern')
})

suite.add('patrun#find', () => {
  patrun.find({ role: 'test', action: 'other', id: 'qwe', payload: { qwe: 'asd', zxc: 'xxx' } })
})

suite.add('bloomrun#lookup', () => {
  bloomrun.lookup({ role: 'test', action: 'other', id: 'qwe', payload: { qwe: 'asd', zxc: 'xxx' } })
})

suite.add('bloomrun#list', () => {
  bloomrun.lookup({ role: 'test', action: 'other', id: 'qwe', payload: { qwe: 'asd', zxc: 'xxx' } })
})

suite.on('cycle', event => console.log(String(event.target))).run()
