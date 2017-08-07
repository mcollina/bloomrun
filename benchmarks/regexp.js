'use strict'

const Benchmark = require('benchmark')
const suite = new Benchmark.Suite()
const Patrun = require('patrun')
const Bloomrun = require('..')

const patrun = Patrun({ gex: true })
const bloomrun = Bloomrun()

patrun.add({ role: 'test', action: 'other', id: '*' }, 'result')
bloomrun.add({ role: 'test', action: 'other', id: /.*/ }, 'result')

for (var i = 0; i < 10000; i++) {
  patrun.add({test: 'pattern'}, 'test pattern')
  bloomrun.add({test: 'pattern'}, 'test pattern')
}

suite.add('patrun#add', () => {
  var patrun = Patrun({ gex: true })
  patrun.add({ role: 'test', action: 'other', id: '*' }, 'result')

  for (var i = 0; i < 1000; i++) {
    patrun.add({test: 'pattern'}, 'test pattern')
  }
})

suite.add('bloomrun#add', () => {
  var bloomrun = Bloomrun()
  bloomrun.add({ role: 'test', action: 'other', id: /.*/ }, 'result')

  for (var i = 0; i < 1000; i++) {
    bloomrun.add({test: 'pattern'}, 'test pattern')
  }
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
