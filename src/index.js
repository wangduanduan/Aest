const axios = require('axios')
const {struct} = require('superstruct')
const Mustache = require('mustache')
const _ = require('lodash')
const AestDefaultConfig = require('./default.js')

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

  Object.keys(data).forEach((key) => {
    if (key !== '$baseUrl') {
      let _defaultConf = _.cloneDeep(defaultConf)
      _.merge(_defaultConf, data[key].req)
      data[key].req = _defaultConf
      data[key].req.url = data.$baseUrl + data[key].req.path
      delete data[key].req.path
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

function send (conf, context = {}) {
  conf = _mergeSendConf(conf, context)

  return new Promise(function (resolve, reject) {
    axios(conf.req)
    .then(function (res) {
      if (conf.resBodyStruct) {
        let Scheme = struct(conf.resBodyStruct)
        let result = Scheme.validate(res.data)
        if (result.length === 1) {
          reject(result[0])
        }
      }

      if (conf.resHeadersStruct) {
        let Scheme = struct(conf.resHeadersStruct)
        let result = Scheme.validate(res.headers)
        if (result.length === 1) {
          reject(result[0])
        }
      }

      resolve(res.data)
    })
    .catch(function (error) {
      reject(error.response)
    })
  })
}

module.exports = {
  send, init, share, getShare, _mergeSendConf, _render
}
