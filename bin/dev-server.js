const debug = require('debug')('app:bin:dev-server')
const solidity = require('../solidity/compile');
let project, server;

Promise.resolve()
  .then(() => solidity.compile())
  .then(() => {
    project = require('../config/project.config')
    server = require('../server/main')
  })
  .then(() => {
    server.listen(project.server_port)
    debug(`Server is now running at http://localhost:${project.server_port}.`)
  })
  .catch(console.log)
