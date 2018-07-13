# Aest
Api Test Tool, Power By jest, Axiox, superstruct...

# Feature
- simple: just write some config file
- support response body check struct
- support template variate

# Usage

`write test config file`

```
module.exports = {
  $baseUrl: 'http://localhost',
  loginByEmail: {
    desc: '登录接口',
    req: {
      method: 'post',
      path: '/p/api/security/loginByEmail',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: 'email=test@test.com&password={{password}}',
      params: {
        _test: 1
      }
    },
    resBodyStruct: {
      sessionId: 'string'
    }
  },
  session: {
    desc: '获取用户信息接口',
    req: {
      path: '/p/api/security/session',
      headers: {
        'sessionId': '{{sessionId}}'
      }
    },
    resBodyStruct: {
      email: 'string',
      isAdmin: 'boolean',
      org: 'object',
      permissions: 'object',
      roles: 'array',
      tenantId: 'string',
      trustedLogin: 'boolean',
      userId: 'string',
      userName: 'string',
      loginName: 'string',
      isTrustedLogin: 'boolean'
    }
  }
}

```

`write test case`

```
const Aest = require('Aest')
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
```

`Get result`

```

 PASS  src/main.test.js
  ✓ loginByEmail Success Test (276ms)
  ✓ loginByEmail Fail Test (164ms)
  ✓ Get User Info (415ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        2.516s, estimated 5s
Ran all test suites.
```

# Api
## Aest.format()
## Aest.send()
## Aest.setContext()
## Aest.getContext()
## Aest.emptyContext()

