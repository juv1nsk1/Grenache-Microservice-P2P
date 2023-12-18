// orderBook.ts
import { Order } from "./order";
import { CommandType } from "./order";

// Defining a class to represent an order book
export class OrderBook {

  // Private array to store orders
  private orders: Order[] = [];

  // Method to add a new order to the order book
  addOrder(newOrder: Order): string {

    // Try execute the order before add it 
    newOrder = this.executeOrder(newOrder);

    // Check for the remaining quantity
    if (newOrder.quantity > 0) {
      // If yes, add the order to the order book
      this.orders.push(newOrder);
      return 'added';
    } else {
      // If no remaining quantity, reply to the order with executed status
      return 'executed';
    }
    // backlog inform partial execution
  }


  // Execute an order by matching it with existing orders in the order book
  private executeOrder(newOrder: Order): Order {

    let matchedOrders=[];

    if (newOrder.command == CommandType.Bid) {
        // Filter orders that are Ask and match the criteria of asset, and price
        matchedOrders = this.orders.filter((askOrder) => askOrder.command === CommandType.Ask && askOrder.asset === newOrder.asset && askOrder.price <= newOrder.price);                   
        // sort it to put the lowest price first
        if (matchedOrders.length > 0) matchedOrders.sort((a, b) => a.price - b.price);

    } else { 
       //  Filter Bid
        matchedOrders = this.orders.filter((bidOrder) => bidOrder.command === CommandType.Bid && bidOrder.asset === newOrder.asset && bidOrder.price >= newOrder.price);
        if (matchedOrders.length > 0) matchedOrders.sort((a, b) => a.price + b.price);
    }
      
    if (matchedOrders.length >0) {
      const otherpartOrder: Order = matchedOrders[0];

      // Get the index of the selected order in the original order book
      const otherpartPosition = this.getOrderIndex(otherpartOrder);

      // Check if the quantities of the two orders match
      if (otherpartOrder.quantity === newOrder.quantity) {
        // If yes, remove the matched order from the order book
        this.orders.splice(otherpartPosition, 1);
        // Update the quantity of the new order to 0, indicating full execution
        newOrder.quantity = 0;

      } else if (otherpartOrder.quantity > newOrder.quantity) {
        // If the matched order has a greater quantity, reduce its quantity
        this.orders[otherpartPosition].quantity -= newOrder.quantity;
        // Update the quantity of the new order to 0, indicating full execution
        newOrder.quantity = 0;

      } else if (otherpartOrder.quantity < newOrder.quantity) {
        // If the new order has a greater quantity, reduce its quantity
        newOrder.quantity -= this.orders[otherpartPosition].quantity;
        // Remove the matched order from the order book
        this.orders.splice(otherpartPosition, 1);
      }

      // Execute continuously as long as there are suitable open offers that match the current order criteria
      if (newOrder.quantity > 0 && matchedOrders.length > 1) {
        newOrder = this.executeOrder(newOrder);
      }
    }

    // Return the updated order
    return newOrder;

  }

  // Private method to get the index of an order in the order book
  private getOrderIndex(orderToFind: Order): number {
    return this.orders.findIndex((order) => order.asset === orderToFind.asset && order.price === orderToFind.price && order.command === orderToFind.command && order.client === orderToFind.client && order.quantity === orderToFind.quantity);
  }

  // Public method to get all orders in the order book
  getAllOrders(): Order[] {
    return this.orders;
  }
}
