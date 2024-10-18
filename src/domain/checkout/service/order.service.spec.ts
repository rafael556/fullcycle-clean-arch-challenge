import Customer from "../../customer/entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item"
import OrderService from "./order.service";

describe('Order Service unit tests', () => {

    it('should get total of all orders', () => {

        const orderItem1 = new OrderItem('1', 'o1', 100, 'p1', 1);
        const orderItem2 = new OrderItem('2', 'o2', 200, 'p2', 2);
        
        const order1 = new Order('o1', 'c1', [orderItem1]);
        const order2 = new Order('o2', 'c2', [orderItem2]);

        const total = OrderService.total([order1, order2]);

        expect(total).toBe(500);
    })

    it('should throw error when placing order with no items', () => {
        const customer = new Customer('c1', 'customer1');

        expect(() => {
            OrderService.placeOrder(customer, []);
        }).toThrow('Order must have as least one item');
    })

    it('should place an order', () => {
        const customer = new Customer('c1', 'customer1');
        const item1 = new OrderItem('i1', 'item1', 10, 'p1', 1);

        const order = OrderService.placeOrder(customer, [item1]);

        expect(customer.rewardPoints).toBe(5);
        expect(order.total()).toBe(10);
    })
})