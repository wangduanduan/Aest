const axios = require('axios')
const {struct} = require('superstruct')
const Mustache = require('mustache')
const _ = require('lodash')
const AestDefaultConfig = require('./default.js')

var aestContext = {}

function setContext (key, value) {
  aestContext[key] = value
}

function getContext (key) {
  return aestContext[key]
}

function emptyContext () {
  aestContext = {}
}

function mergeConf (conf, context) {
  conf = JSON.stringify(conf)
  conf = Mustache.render(conf, context)
  return JSON.parse(conf)
}

function format (data, defaultConf = {}) {
  defaultConf = _.merge(defaultConf, AestDefaultConfig)

  Object.keys(data).forEach((key) => {
    if (key !== '$baseUrl') {
      _.merge(defaultConf, data[key].req)
      data[key].req.url = data.$baseUrl + data[key].req.path
      delete data[key].req.path
    }
  })

  return data
}

function send (conf, context) {
  // console.log(111)
  if (context) {
    conf = mergeConf(conf, context)
  }

  // console.log(conf)

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
  send, format, setContext, getContext, emptyContext
}
