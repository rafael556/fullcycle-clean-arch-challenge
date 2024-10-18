import RepositoryInterface from "../../../../domain/@shared/repository/repository.interface";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import CustomerModel from "./customer.model";

export default class CustomerRepository implements RepositoryInterface<Customer> {
  async create(entity: Customer): Promise<void> {
    await CustomerModel.create({
        id: entity.id,
        name: entity.name,
        street: entity.address.street,
        number: entity.address.number,
        zipcode: entity.address.zipcode,
        city: entity.address.city,
        active: entity.isActive(),
        rewardPoints: entity.rewardPoints,
    });
  }

  async update(entity: Customer): Promise<void> {
    await CustomerModel.update(
      {
        id: entity.id,
        name: entity.name,
        street: entity.address.street,
        number: entity.address.number,
        zipcode: entity.address.zipcode,
        city: entity.address.city,
        active: entity.isActive(),
        rewardPoints: entity.rewardPoints,
      },
      { where: { id: entity.id } }
    );
  }

  async find(id: string): Promise<Customer> {
    let customerModel;
    try {
        customerModel = await CustomerModel.findOne({ where: { id }, rejectOnEmpty: true });
    } catch (error) {
        throw new Error('Customer not found');
    }
    const customer = new Customer(customerModel.id, customerModel.name);
    
    customer.addRewardPoints(customerModel.rewardPoints);

    if(!customerModel.active) {
        customer.deactivate()
    }

    const address = new Address(customerModel.street, customerModel.number, customerModel.zipcode, customerModel.city);
    customer.changeAddress(address);
    return customer;
  }

  async findAll(): Promise<Customer[]> {
    const customers = await CustomerModel.findAll();

    return customers.map((customerFound) => {
        const customer = new Customer(customerFound.id, customerFound.name);
    
        customer.addRewardPoints(customerFound.rewardPoints);
    
        if(!customerFound.active) {
            customer.deactivate()
        }
    
        const address = new Address(customerFound.street, customerFound.number, customerFound.zipcode, customerFound.city);
        customer.changeAddress(address);
        return customer;
      }
    );
  }
}
