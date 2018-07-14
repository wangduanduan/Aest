/* global expect, test */
const Ae = require('../src/index.js')
var testData = require('./test-data.js')
var testDataInit = require('./test-data-init.js')

test('Ae _render()', () => {
  expect(Ae._render({name: '{{name}}', token: '{{token}}', addr: 'hh'}, {name: 'wdd', token: '123'}))
  .toEqual({name: 'wdd', token: '123', addr: 'hh'})
})

test('Ae share() getShare', () => {
  Ae.share('token', '1234')
  expect(Ae.getShare().token).toBe('1234')
})

test('Ae _mergeSendConf', () => {
  let test1 = {
    desc: 'get user info',
    req: {
      method: 'get',
      url: 'http://localhost:3000/users/{{id}}',
      headers: {
        'sessionId': '{{sessionId}}',
        'content-type': 'application/json; charset=UTF-8'
      }
    }
  }

  // Ae.send() with one argument
  expect(Ae._mergeSendConf(test1)).toEqual({
    desc: 'get user info',
    req: {
      method: 'get',
      url: 'http://localhost:3000/users/',
      headers: {
        'sessionId': '',
        'content-type': 'application/json; charset=UTF-8'
      }
    }
  })

  // Ae.send() with two argument
  expect(Ae._mergeSendConf(test1, {sessionId: 123, id: 456})).toEqual({
    desc: 'get user info',
    req: {
      method: 'get',
      url: 'http://localhost:3000/users/456',
      headers: {
        'sessionId': '123',
        'content-type': 'application/json; charset=UTF-8'
      }
    }
  })
})

test('Ae init()', () => {
  let data = Ae.init(testData)
  expect(data).toEqual(testDataInit)
})
