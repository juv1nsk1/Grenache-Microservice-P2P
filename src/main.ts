'use strict'

const { PeerRPCServer , PeerRPCClient}  = require('grenache-nodejs-ws')
const Link = require('grenache-nodejs-link')

import { Order, CommandType } from './order'
import { OrderBook } from './orderBook'


// Creating an instance of OrderBook to manage orders
const orderBook = new OrderBook()

// Defining the service name for Grenache announcement
const serviceName='orderBook'


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
const port = getRandom(1024,2048)
service.listen(port)
console.log('running on port', port)


// Periodically announcing the service 
setInterval(() => {
  link.announce(serviceName, service.port, {})
}, 1000)

// Handling incoming requests to the service
service.on('request', (  rid:any, key:any, payload:any, handler:any) => {
  console.log("New roder:", payload.order)
   // Adding the received order to the OrderBook
  const result = orderBook.addOrder(payload.order)  
  // Sending a reply back to the requester
  handler.reply(null, result)
  console.log("OrderBook:", orderBook.getAllOrders()) 
})

// Function to generate and send a new order to the order book
function sendNewOrder() {
  const commands=[CommandType.Ask,CommandType.Bid]
  const command=commands[getRandom(0,1)]
  
  // Creating a new order with random values
  const newORder: Order = {
    client: 1,
    asset: 'BTCUSD',
    quantity: getRandom(1,11),
    command: command,
    price: getRandom(40,43),
  }      
      
  const payload = { order: newORder}   
  // Making a request to the order book service with the new order
  peerClient.map(serviceName,  payload,   { timeout: 50000 }, (err:any, result:string) => {    
    if (err) throw err
    console.log(result)    
  })

  
}


// Periodically sending new orders to the order book
setInterval(() => {
  sendNewOrder()
  //broadcast()
}, 5000)


// Return a random number
function getRandom (min:number,max:number) : number {
  return Math.floor( Math.random() * (max - min + 1)) + min
}

