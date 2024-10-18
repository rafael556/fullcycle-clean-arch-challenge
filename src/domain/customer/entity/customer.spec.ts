
import Address from "../value-object/address";
import Customer from "./customer"

describe('Customer unit tests', () => {
    it('should throw error when id is empty', () => {
        expect(() => {
            const customer = new Customer('', 'john');
        }).toThrow("customer: Id is Required");
    })

    it('should throw error when name is empty', () => {
        expect(() => {
            const customer = new Customer('123', '');
        }).toThrow("customer: Name is Required");
    })

    it('should throw error when name and id are empty', () => {
        expect(() => {
            const customer = new Customer('', '');
        }).toThrow("customer: Id is Required,customer: Name is Required");
    })

    it('should change name', () => {
        //Arrange
        let customer = new Customer('123', 'john');

        //Act
        customer.changeName('Rafa');

        //Assert
        expect(customer.name).toBe('Rafa');

    })

    it('should activate customer', () => {
        const customer = new Customer('123', 'Customer 1');
        const address = new Address('street 1', 123, '12345-678', 'São Paulo');
        customer.changeAddress(address);

        customer.activate();

        expect(customer.isActive()).toBe(true);
    })

    it('should throw error when addres is undefined when activate customer', () => {
        const customer = new Customer('123', 'Customer 1');
        
        expect(() => {
            customer.activate();
        }).toThrow("Address is mandatory to activate a customer");
    })

    it('should deactivate customer', () => {
        const customer = new Customer('123', 'Customer 1');

        customer.deactivate();

        expect(customer.isActive()).toBe(false);
    })

    it('should add reward points', () => {
        const customer = new Customer('1', 'c1');
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    })
})