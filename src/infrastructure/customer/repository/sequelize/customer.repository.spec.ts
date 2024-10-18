import { Sequelize } from "sequelize-typescript";
import CustomerModel from "./customer.model";
import Customer from "../../../../domain/customer/entity/customer";
import CustomerRepository from "./customer.repository";
import Address from "../../../../domain/customer/value-object/address";

describe("product repository test", () => {
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

  it("should create a customer", async () => {
    const customerRepository = new CustomerRepository();
    const address = new Address("s1", 1, "123", "c1");
    const customer = new Customer("1", "c1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const customerModel = await CustomerModel.findOne({ where: { id: "1" } });

    expect(customerModel.toJSON()).toStrictEqual({
      id: "1",
      name: "c1",
      street: "s1",
      number: 1,
      zipcode: "123",
      city: "c1",
      active: true,
      rewardPoints: 0,
    });
  });

  it("should update a customer", async () => {
    const customerRepository = new CustomerRepository();
    const address = new Address("s1", 1, "123", "c1");
    const customer = new Customer("1", "c1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    customer.addRewardPoints(10);
    customer.deactivate();

    customerRepository.update(customer);

    const customerModel = await CustomerModel.findOne({ where: { id: "1" } });
    expect(customerModel.toJSON()).toStrictEqual({
      id: "1",
      name: "c1",
      street: "s1",
      number: 1,
      zipcode: "123",
      city: "c1",
      active: false,
      rewardPoints: 10,
    });
  });

  it("should find a customer", async () => {
    const customerRepository = new CustomerRepository();
    const address = new Address("s1", 1, "123", "c1");
    const customer = new Customer("1", "c1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const customerModel = await CustomerModel.findOne({ where: { id: "1" } });
    const foundCustomer = await customerRepository.find("1");

    expect(customerModel.toJSON()).toStrictEqual({
      id: foundCustomer.id,
      name: foundCustomer.name,
      street: foundCustomer.address.street,
      number: foundCustomer.address.number,
      zipcode: foundCustomer.address.zipcode,
      city: foundCustomer.address.city,
      active: foundCustomer.isActive(),
      rewardPoints: foundCustomer.rewardPoints,
    });
  });

  it("should throw an error when customer is not found", async () => {
    const customerRepository = new CustomerRepository();

    expect(async () => {
      await customerRepository.find("1");
    }).rejects.toThrow("Customer not found");
  });

  it("should find all customers", async () => {
    const customerRepository = new CustomerRepository();
    const address1 = new Address("s1", 1, "123", "c1");
    const customer1 = new Customer("1", "c1");
    customer1.changeAddress(address1);

    await customerRepository.create(customer1);

    const address2 = new Address("s2", 2, "223", "c2");
    const customer2 = new Customer("2", "c2");
    customer2.changeAddress(address2);

    await customerRepository.create(customer2);

    const foundCustomers = await customerRepository.findAll();
    const customers = [customer1, customer2];

    expect(foundCustomers).toHaveLength(2);
    expect(customers).toStrictEqual(foundCustomers);
  });
});
