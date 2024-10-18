import Address from "./domain/customer/entity/address";
import Customer from "./domain/customer/entity/customer";
import Order from "./domain/customer/entity/order";
import OrderItem from "./domain/customer/entity/order_item";

let customer =  new Customer("123", "rafa");
const address = new Address('Rua dois', 2, '12345-678', 'São Paulo');

customer.Address = address;
customer.activate();

const item1 = new OrderItem('1', 'Item1', 10);
const item2 = new OrderItem('2', 'Item2', 15);
const item3 = new OrderItem('3', 'Item3', 20);
const order = new Order('1', '123', [item1, item2, item3]);