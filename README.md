# 1. Aest

![Travis](https://img.shields.io/travis/wangduanduan/Aest.svg)

![](https://img.shields.io/badge/code_style-standard-brightgreen.svg) [![](https://img.shields.io/badge/node-%3E%3D8.0.0-brightgreen.svg)]() ![npm](https://img.shields.io/npm/v/aester.svg) ![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)




功能强大的REST接口测试工具, Power By [Jest](https://jestjs.io/en/), [axios](https://github.com/axios/axios), [superstruct](https://github.com/ianstormtaylor/superstruct), [mustache](https://github.com/janl/mustache.js), [lodash](https://lodash.com/)

# 2. 特点

- `非常简单`: 大部分工作量在于写配置文件
- `请求模板`: 可以在配置文件中加入运行时变量，如`/users/{{id}}`
- `响应体结构验证`: 支持对响应体的字段类型进行严格校验，多字段、少字段、字段类型不符合预期都会报错
- `非常详细的报错提示`: 

# 3. 安装

```
yarn add aester
npm i aester -S
```

# 4. 使用

## 4.1. 编写测试用例

```
// filename 必须以 test.js结尾

const Ae = require('aester')
var testData = require('./test-data.js')

// 初始化配置文件
testData = Ae.init(testData)

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
```

## 4.2. 接口配置文件

```
// test-data.js
module.exports = {
  $baseUrl: 'http://localhost:3000',
  loginByEmail: {
    desc: 'login',
    req: {
      method: 'post',
      path: '/login',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: 'email=wdd@cc.tt&password={{password}}',
      params: {
        _test: 1
      }
    },
    resBodyStruct: {
      sessionId: 'string'
    }
  },
  getOneUser: {
    desc: 'get user info',
    req: {
      path: '/users/{{id}}',
      headers: {
        'sessionId': '{{sessionId}}' // 如果share中有sessionId, 在请求发送时，会自动将{{sessionId}}替换成真正的值，否则会被替换成空字符串
      }
    },
    resBodyStruct: {
      id: 'string',
      email: 'string',
      password: 'string',
      userName: 'string',
      likes: 'array',
      isAdmin: 'boolean'
    }
  },
  createOneUser: {
    desc: 'create user',
    req: {
      method: 'post',
      path: '/users',
      headers: {
        'sessionId': '{{sessionId}}'
      }
    }
  },
  updateOneUser: {
    desc: 'update user',
    req: {
      method: 'put',
      path: '/users/{{id}}',
      headers: {
        'sessionId': '{{sessionId}}'
      }
    }
  },
  deleteOneUser: {
    desc: '获取用户信息接口',
    req: {
      method: 'delete',
      path: '/users/{{id}}',
      headers: {
        'sessionId': '{{sessionId}}'
      }
    }
  }
}

```

## 4.3. 运行测试用例

在package.json加入

```
  "scripts": {
    "test": "jest"
  }
```

然后运行`npm test`

# 5. 参看测试结果

## 5.1. 正常测试结果

```
 PASS  test/unit.test.js
 PASS  test/index.test.js

Test Suites: 2 passed, 2 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        1.864s
```

## 5.2. 接口报错测试结果

```
          "origin": "null",
          "readyState": 4,
          "requestBuffer": null,
          "requestCache": null,
          "responseBuffer": [Buffer],
          "responseCache": null,
          "responseHeaders": [Object],
          "responseTextCache": "Forbidden",
          "responseURL": "http://localhost:3000/users/1",
          "responseXMLCache": null,
          "send": true,
          "status": 403,
          "statusText": "Forbidden",
          "timeoutFn": null,
          "timeoutId": 0,
          "timeoutStart": 0,
          "totalReceivedChunkSize": 9,
          "uploadComplete": true,
          "uploadListener": false,
        },
      },
      "status": 403,
      "statusText": "Forbidden",
    }

      18 | })
      19 |
    > 20 | test('Get User Info', async () => {
         | ^
      21 |   await Ae.send(testData.getOneUser, {id: '1'})
      22 | })
      23 |

      at Env.it (node_modules/jest-jasmine2/build/jasmine_async.js:102:24)
      at Object.<anonymous> (test/index.test.js:20:1)

```

## 5.3. 接口返回响应体不符合预期测试结果

例如，resBodyStruct配置sessionId为number格式，但是返回的格式是字符串，将会如下格式的报错

```
    TypeError: Expected a value of type `number` for `sessionId` but received `"123456"`.

      60 |       if (conf.resBodyStruct) {
      61 |         let Scheme = struct(conf.resBodyStruct)
    > 62 |         let result = Scheme.validate(res.data)
         |                             ^
      63 |         if (result.length === 1) {
      64 |           reject(result[0])
      65 |         }

      at Function.Struct.validate.value [as validate] (node_modules/superstruct/src/superstruct.js:78:17)
      at src/index.js:62:29
```


# 6. Api
## 6.1. Aest.init(apiConfs)

初始化配置文件

```
const Ae = require('aester')

...
var conf = Ae.init(apiConfs)
```

## 6.2. Aest.send(apiConf, options)

初始化配置文件

```
const Ae = require('aester')

...
var conf = Ae.init(apiConfs)
```


## 6.3. Aest.share(key, value)

设置共享变量

```
const Ae = require('aester')

...
var conf = Ae.share('token', '123123')
```


## 6.4. Aest.getShare()

获取所有共享变量

```
const Ae = require('aester')

...
var conf = Ae.getShare() // {token: '123123'}
```


# 7. 配置文件说明

key | 必须？ | 说明
--- | --- | ---
$baseUrl | 是 | 请求baseUrl
desc | 否 | 接口说明
req | 是 | 请求对象
req.method | 否 | 请求方法，默认get
req.path | 是 | 请求路径
req.headers | 是 | 默认为空对象，默认设置'content-type': 'application/json; charset=UTF-8'
resBodyStruct | 否 | 响应体格式校验对象

resBodyStruct字段说明

```
{
  key: keyType
}
```

字段类型支持如下

- any: 任意
- number: 数字
- array: 数组
- string: 字符串
- boolean： 布尔值
- null: null
- undefined: undefined
- object: 对象类型

在字段类型后加上`?`表示字段是否可选

如：
```
{
  sessionId: 'string?' //sessionId是字符串，但是可以没有这个字段
}
```

更多字段类型验证参考：https://github.com/ianstormtaylor/superstruct/blob/master/docs/reference.md

# 8. 测试Aester

```
npm test
```




