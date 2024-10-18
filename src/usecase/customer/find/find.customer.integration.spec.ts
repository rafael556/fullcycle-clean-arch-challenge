import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import InputFindCustomerDto, { OutputFindCustomerDto } from "./find.customer.dto";
import FindCustomerUseCase from "./find.customer.usecase";

describe('integration Test find customer use case', () => {
    let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should find a customer', async () => {
      const customerRepository = new CustomerRepository();
    const useCase = new FindCustomerUseCase(customerRepository);
    
    const customer = new Customer('123', 'john');
    const address = new Address('street', 123, '12345-123', 'city')
    customer.changeAddress(address);
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
})