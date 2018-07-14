/* global expect, test, beforeAll, afterAll */
const Ae = require('../src/index.js')
const app = require('./server.js')
const serverPort = 3000
var serverInstance = null
var testData = require('./test-data.js')

testData = Ae.init(testData)

beforeAll(() => {
  serverInstance = app.listen(serverPort)
})

afterAll(() => {
  serverInstance.close()
})

test('Get User Info without sessionId', async () => {
  await expect(Ae.send(testData.getOneUser, {id: '1'})).rejects.toHaveProperty('status', 403)
})

test('loginByEmail Success Test', async () => {
  const data = await Ae.send(testData.loginByEmail, {password: '000'})
  Ae.share('sessionId', data.sessionId)
})

test('loginByEmail Fail Test', async () => {
  await expect(Ae.send(testData.loginByEmail, {password: '111'})).rejects.toHaveProperty('status', 401)
})

test('Get User Info', async () => {
  await Ae.send(testData.getOneUser, {id: '1'})
})
