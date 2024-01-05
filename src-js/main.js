"use strict";

const { OrderBook, Order, CommandType } = require("./orderBook");
const { link, port: client, service, peerClient } = require("./connection");
const { getRandom } = require("./utils");

// Creating an instance of OrderBook to manage orders
const orderBook = new OrderBook();

// Defining the service name for Grenache announcement
const serviceName = "orderBook";

let isLoading=false

// load orderbook from a peer
initOrder();

// Handling incoming requests to the service
service.on("request", (rid, key, payload, handler) => {    
  const reply = handleRequest(key, payload);
  handler.reply(null, reply);    
});

// Periodically sending new orders to the order book
setInterval(() => {
  console.log("send", isLoading)
  if (!isLoading) sendNewOrder();
}, 5000);


// handle request: newOrder and initialBook
function handleRequest(key, payload) {
  if (key === "initialBook" ) {      
    return orderBook.getAllOrders();
  }
  console.log("New order:", payload?.order);

  // Adding the received order from others to the OrderBook
  if (payload.order && payload?.order?.client !== client) {

    console.log('radio',orderBook.orders.length>0&&payload.lastUpdate/orderBook.lastUpdate )
    if (orderBook.orders.length>0&&payload.lastUpdate/orderBook.lastUpdate>1.01) {      
      initOrder()
      return 'reload'
    } else {
      const result = orderBook.addOrder(payload.order);
      // Sending a reply back to the requester
      console.table( orderBook.getAllOrders());
      return result;
    }
  } else {
     console.table(orderBook.getAllOrders());
     return 'skipped'
  }
}

// load orderbook from a peer
 async function initOrder() {
   isLoading = true;
   await peerClient.request("initialBook", {}, { timeout: 10000 }, (err, result) => {
     if (result && result.length > 0) {
       console.log("loading.... ", result);
       orderBook.orders = result;
     }
   });
   isLoading = false;
 }

// Function to generate and send a new order to the order book
function sendNewOrder() {
  
  const newOrder=createRandomNewOrder()

  const lastUpdate = orderBook.lastUpdate

  // Adding NewOrder to local OrderBook
  orderBook.addOrder(newOrder)
  
  // Making a broadcast call with the new order   
  const payload = { order: newOrder , lastUpdate:lastUpdate};
  peerClient.map(serviceName, payload, { timeout: 10000 }, (err, result) => {
    if (result !== undefined) {
      console.log(result);
      // if (result.includes('reload')) isLoading=true
      // else isLoading=false
   }
  });
}

 // Creating a new order with random values
function createRandomNewOrder(){
  const commands = [CommandType.Ask,CommandType.Ask, CommandType.Bid];
  const command = commands[getRandom(0, 3)];

  return  {
    client: client,
    asset: "BTCUSD",
    quantity: getRandom(2, 11),
    command: command,
    price: getRandom(40, 43),
  }    
}