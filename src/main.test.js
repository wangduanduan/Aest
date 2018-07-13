/* global expect, test */
const Aest = require('./index.js')
var testData = require('./test-data.js')

testData = Aest.format(testData)

test('登录测试', async () => {
  const data = await Aest.send(testData.loginByEmail, {password: 'Aa111111'})
  Aest.setContext('sessionId', data.sessionId)
})

test('登录失败测试', async () => {
  await expect(Aest.send(testData.loginByEmail, {password: 'Aa123456'})).rejects.toHaveProperty('status', 401)
})

test('获取租户信息测试', async () => {
  await Aest.send(testData.session, {sessionId: Aest.getContext('sessionId')})
})
