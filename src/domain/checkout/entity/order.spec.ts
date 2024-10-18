import Order from "./order";
import OrderItem from "./order_item";

describe('Order unit tests', () => {
    it('should throw error when id is empty', () => {
        expect(() => {
            new Order('', '1', [])
        }).toThrow('Id is required');
    })

    it('should throw error when customerId is empty', () => {
        expect(() => {
            new Order('1', '', [])
        }).toThrow('CustomerId is required');
    })

    it('should throw error when items are empty', () => {
        expect(() => {
            new Order('1', '123', [])
        }).toThrow('Items are required');
    })

    it('should calculate total', () => {
        const item1 = new OrderItem('i1', 'item1', 100, 'p1', 2);
        const item2 = new OrderItem('i2', 'item2', 200, 'p2', 5);
        const item3 = new OrderItem('i3', 'item3', 300, 'p2', 5);
        const order = new Order('o1', 'c1', [item1, item2, item3]);

        const total = order.total();

        expect(total).toBe(2700);
    })

    it('should throw error if item qtd is less than zero', () => {
        
        expect(() => {
            const item1 = new OrderItem('i1', 'item1', 100, 'p1', -2);
            new Order('o1', 'c1', [item1]);
        }).toThrow('Item quantity should be greater or equal to zero');
    })
})