/* global expect, test, beforeAll, afterAll, describe*/
const Ae = require('../src/index.js')
const app = require('./server.js')
const serverPort = 3000
var serverInstance = null
var testData = require('./test-data.js')
var _ = require('lodash')

testData = Ae.init(testData)

beforeAll(() => {
  serverInstance = app.listen(serverPort)
})

afterAll(() => {
  serverInstance.close()
})

describe('4XX 5XX error response test', () => {
  test('Get User Info without sessionId', async () => {
    await expect(Ae.send(testData.getOneUser, {id: '1'})).rejects.toHaveProperty('status', 403)
  })

  test('loginByEmail Fail Test', async () => {
    await expect(Ae.send(testData.loginByEmail, {password: '111'})).rejects.toHaveProperty('status', 401)
  })
})

describe('2XX success response test', () => {
  test('loginByEmail Success Test', async () => {
    const data = await Ae.send(testData.loginByEmail, {password: '000'})
    Ae.share('sessionId', data.sessionId)
  })

  test('Get User Info', async () => {
    await Ae.send(testData.getOneUser, {id: '1'})
  })
})

describe('2XX success response with error body struct', () => {
  test('StructError test', async () => {
    var data = _.cloneDeep(testData.getOneUser)
    data.resBodyStruct.test = 'number' // set a error struct

    await expect(Ae.send(data, {id: '1'})).rejects.toHaveProperty('type', 'StructError')
  })
})