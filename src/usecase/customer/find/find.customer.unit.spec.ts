import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import InputFindCustomerDto, { OutputFindCustomerDto } from "./find.customer.dto";
import FindCustomerUseCase from "./find.customer.usecase";

const customer = new Customer('123', 'john');
const address = new Address('street', 123, '12345-123', 'city')
customer.changeAddress(address);

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }
}
describe('Unit Test find customer use case', () => {

  it('should find a customer', async () => {
      const customerRepository = MockRepository();
    const useCase = new FindCustomerUseCase(customerRepository);
    await customerRepository.create(customer);

    const input: InputFindCustomerDto = {
        id: '123'
    }

    const output: OutputFindCustomerDto = {
        id: '123',
        name: 'john',
        address: {
            street: 'street',
            number: 123,
            city: 'city',
            zip: '12345-123'
        }
    }

    const result = await useCase.execute(input)
    expect(result).toStrictEqual(output);
  })

  it('should not find a customer', async() => {
    const customerRepository = MockRepository();
    const useCase = new FindCustomerUseCase(customerRepository);
    customerRepository.find.mockImplementation(() => {
      throw new Error('Customer not found');
    })

    const input: InputFindCustomerDto = {
        id: '123'
    }
    expect(() => {
      return useCase.execute(input);
    }).rejects.toThrow("Customer not found")
  })
})