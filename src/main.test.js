/* global expect, test */
const Aest = require('./index.js')
var testData = require('./test-data.js')

testData = Aest.format(testData)

test('loginByEmail Success Test', async () => {
  const data = await Aest.send(testData.loginByEmail, {password: 'Aa111111'})
  Aest.setContext('sessionId', data.sessionId)
})

test('loginByEmail Fail Test', async () => {
  await expect(Aest.send(testData.loginByEmail, {password: 'Aa123456'})).rejects.toHaveProperty('status', 401)
})

test('Get User Info', async () => {
  await Aest.send(testData.session, {sessionId: Aest.getContext('sessionId')})
})
