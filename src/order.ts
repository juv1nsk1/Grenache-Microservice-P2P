// Enum defining allowed order types (Bid and Ask)
export enum CommandType {
    Bid = 'bid',
    Ask = 'ask',
  }
  

// Interface defining the structure of an order
export interface Order {
  client: number;       // Unique identifier for the client placing the order
  asset: string;        // Identifier for the asset being traded
  quantity: number;     // Amount or quantity of the asset in the order
  command: CommandType; // Type of order (Bid or Ask)
  price: number;        // Price at which the asset is offered or requested
}