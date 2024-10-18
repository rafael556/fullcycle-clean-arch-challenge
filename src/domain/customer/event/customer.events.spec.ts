import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerFactory from "../factory/customer.factory";
import Address from "../value-object/address";
import ChangeAddressEvent from "./change-address.event";
import CustomerCreatedEvent from "./customer-created.event";
import ConsoleLogWhenChangeAddressHandler from "./handler/consolelog-when-change-address.handler";
import ConsoleLogWhenCustomerCreated1Handler from "./handler/consolelog-when-customer-created-1.handler";
import ConsoleLogWhenCustomerCreated2Handler from "./handler/consolelog-when-customer-created-2.handler";

describe("Customer Domain Events", () => {
  it("should send an event when create a new Customer", () => {
    CustomerFactory.create("John");

    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new ConsoleLogWhenCustomerCreated1Handler();
    const eventHandler2 = new ConsoleLogWhenCustomerCreated2Handler();
    const event = new CustomerCreatedEvent(null);
    const eventDispatcherSpy1 = jest.spyOn(eventHandler1, "handle");
    const eventDispatcherSpy2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    eventDispatcher.notify(event);

    expect(eventDispatcherSpy1).toHaveBeenCalled();
    expect(eventDispatcherSpy2).toHaveBeenCalled();
  });

  it("should send an event when change a customer address", () => {
    const address = new Address('s1', 1, '123', 'c1');
    const customer = CustomerFactory.createWithAddress("John", address);

    const newAddress = new Address('street 1', 1, '12345-123', 'city 1');
    customer.changeAddress(newAddress);

    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new ConsoleLogWhenChangeAddressHandler();
    
    const eventResponse = {
        id: customer.id,
        name: customer.name,
        address: newAddress.toString()
    }
    const event = new ChangeAddressEvent(eventResponse);
    const eventDispatcherSpy1 = jest.spyOn(eventHandler1, "handle");

    eventDispatcher.register("ChangeAddressEvent", eventHandler1);

    eventDispatcher.notify(event);

    expect(eventDispatcherSpy1).toHaveBeenCalled();
  });
});
