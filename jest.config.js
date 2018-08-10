module.exports = {
  verbose: true,
  testEnvironment: 'node',
  reporters: [
    'default',
    ['./node_modules/jest-html-reporter', {
      pageTitle: `operation api test ${process.env.testConfigEnv}`,
      includeFailureMsg: true
    }]
  ]
}
