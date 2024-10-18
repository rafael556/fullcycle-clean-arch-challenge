import { InputCreateCustomerDto, OutputCreateCustomerDto } from "./create.customer.dto"
import CustomerCreateUseCase from "./create.customer.usecase"

const input: InputCreateCustomerDto = {
    name: 'John',
    address: {
        street: 'street',
        number: 123,
        zip: 'zip',
        city: 'city'
    }
}

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe('Unit Test create customer use case', () => {
    it('should create a customer', async () => {
        const customerRepository = MockRepository();
        const customerCreateUseCase = new CustomerCreateUseCase(customerRepository);

        const output = await customerCreateUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            address: {
                street: input.address.street,
                number: input.address.number,
                zip: input.address.zip,
                city: input.address.city
            }
        })
    })

    it('should throw an error when name is missing', async () => {
        const customerRepository = MockRepository();
        const customerCreateUseCase = new CustomerCreateUseCase(customerRepository);

        input.name = '';
        
        expect(async () => {
            const output = await customerCreateUseCase.execute(input);
        }).rejects.toThrow('Name is Required')
    })

    it('should throw an error when street is missing', async () => {
        const customerRepository = MockRepository();
        const customerCreateUseCase = new CustomerCreateUseCase(customerRepository);

        input.address.street = '';
        
        expect(async () => {
            const output = await customerCreateUseCase.execute(input);
        }).rejects.toThrow('Street is required')
    })
})