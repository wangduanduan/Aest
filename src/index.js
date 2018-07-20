const axios = require('axios')
const {struct} = require('superstruct')
const Mustache = require('mustache')
const _ = require('lodash')
const AestDefaultConfig = require('./default.js')

const ReqScheme = struct({
  method: 'string',
  url: 'string',
  headers: 'object',
  data: 'any?',
  params: 'object?',
  resBodyStruct: 'object?',
  resHeadersStruct: 'object?'
})

var shareData = {}

function share (key, value) {
  shareData[key] = value
}

function getShare () {
  return _.cloneDeep(shareData)
}

function _render (conf, context) {
  conf = JSON.stringify(conf)
  conf = Mustache.render(conf, context)
  return JSON.parse(conf)
}

function _setDefault (defaultConf) {
  let _conf = _.cloneDeep(AestDefaultConfig)
  _.merge(_conf, defaultConf)
  return _conf
}

function init (data, defaultConf = {}) {
  defaultConf = _setDefault(defaultConf)

  if (!data.$baseUrl) {
    throw new Error('$baseUrl not exits')
  }

  Object.keys(data).forEach((key) => {
    if (key !== '$baseUrl') {
      let _defaultConf = _.cloneDeep(defaultConf)
      _.merge(_defaultConf, data[key].req)
      data[key].req = _defaultConf

      if(!data[key].req.baseURL){
        data[key].req.url = data.$baseUrl + data[key].req.path
      }
      
      delete data[key].req.path
      ReqScheme(data[key].req)
    }
  })

  return data
}

function _mergeSendConf (conf, context = {}) {
  conf = _.cloneDeep(conf)
  context = _.cloneDeep(context)

  let _conf = _.cloneDeep(shareData)
  context = _.merge(_conf, context)
  return _render(conf, context)
}

function validateStruct (data, scheme) {
  return struct(scheme).validate(data)
}

function createError (result) {
  var error = {
    msg: [],
    type: 'StructError'
  }
  result.errors.forEach((item) => {
    error.msg.push(`Expected a value of type "${item.type}" for "${item.path[0]}" but received "${item.value}"`)
  })

  return error
}

function _validateStruct (data, scheme, reject) {
  let result = validateStruct(data, scheme)

  if (result.length === 1) {
    reject(createError(result[0]))
    // reject(result[0])
    // throw result[0]
  }
}

function _validateReq (req) {
  var result = ReqScheme.validate(req)

  if (result.length === 1) {
    throw new Error('Req struct error, have you call Ae.init() before Ae.send()? ')
  }
}

function send (conf, context = {}) {
  _validateReq(conf.req)

  conf = _mergeSendConf(conf, context)

  return new Promise(function (resolve, reject) {
    axios(conf.req)
    .then(function (res) {
      if (conf.resBodyStruct) {
        _validateStruct(res.data, conf.resBodyStruct, reject)
      }

      if (conf.resHeadersStruct) {
        _validateStruct(res.data, conf.resHeadersStruct, reject)
      }

      resolve(res.data)
    })
    .catch(function (error) {
      reject(error.response)
    })
  })
}

module.exports = {
  send,
  init,
  share,
  getShare,
  validateStruct,
  _mergeSendConf,
  _render,
  _validateReq
}
