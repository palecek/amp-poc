var fs = require('fs')
var path = require('path')

module.exports = {
  cert: fs.readFileSync(path.join(__dirname, 'https-server.crt')),
  key: fs.readFileSync(path.join(__dirname, 'https-server.key')),
  passphrase: '12345'
}
