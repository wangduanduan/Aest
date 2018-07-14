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
      sessionId: 'number'
    }
  },
  getOneUser: {
    desc: 'get user info',
    req: {
      path: '/users/{{id}}',
      headers: {
        'sessionId': '{{sessionId}}'
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
