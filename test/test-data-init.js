module.exports = {
  $baseUrl: 'http://localhost:3000',
  loginByEmail: {
    desc: 'login',
    req: {
      method: 'post',
      url: 'http://localhost:3000/login',
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
      method: 'get',
      url: 'http://localhost:3000/users/{{id}}',
      headers: {
        'sessionId': '{{sessionId}}',
        'content-type': 'application/json; charset=UTF-8'
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
      url: 'http://localhost:3000/users',
      headers: {
        'sessionId': '{{sessionId}}',
        'content-type': 'application/json; charset=UTF-8'
      }
    }
  },
  updateOneUser: {
    desc: 'update user',
    req: {
      method: 'put',
      url: 'http://localhost:3000/users/{{id}}',
      headers: {
        'sessionId': '{{sessionId}}',
        'content-type': 'application/json; charset=UTF-8'
      }
    }
  },
  deleteOneUser: {
    desc: '获取用户信息接口',
    req: {
      method: 'delete',
      url: 'http://localhost:3000/users/{{id}}',
      headers: {
        'sessionId': '{{sessionId}}',
        'content-type': 'application/json; charset=UTF-8'
      }
    }
  }
}
