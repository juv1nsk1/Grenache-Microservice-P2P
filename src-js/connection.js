'use strict'

const { PeerRPCServer, PeerRPCClient } = require('grenache-nodejs-ws')
const Link = require('grenache-nodejs-link')
const { getRandom } = require('./utils')

// Defining the service name for Grenache announcement
const serviceName = 'orderBook'

// Creating grape connection for service and client peers
const link = new Link({
  grape: 'http://127.0.0.1:30001'
})

link.start()
const peer = new PeerRPCServer(link, {})
peer.init()
const peerClient = new PeerRPCClient(link, {})
peerClient.init()
const service = peer.transport('server')

// Using a rand port to allow multiple instance execution
const port = getRandom(1024, 2048)
service.listen(port)
console.log('running on port', port)


// Periodically announcing the service
setInterval(() => {
    link.announce(serviceName,  service.port, {})    
    link.announce('initialBook',  service.port, {})    
  }, 1000)

module.exports = { link, port, service,peerClient }