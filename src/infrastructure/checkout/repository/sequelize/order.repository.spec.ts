import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Product from "../../../../domain/product/entity/product";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import Address from "../../../../domain/customer/value-object/address";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepository from "./order.repository";
import Order from "../../../../domain/checkout/entity/order";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([
      OrderModel,
      OrderItemModel,
      CustomerModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "customer 1");
    const address = new Address("s1", 1, "123", "c1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "p1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("1", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "1",
      customerId: "1",
      total: 20,
      items: [
        {
          id: "1",
          productId: "p1",
          name: "p1",
          quantity: 2,
          price: 10,
          orderId: "1",
        },
      ],
    });
  });

  it('should update an order', async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "customer 1");
    const address = new Address("s1", 1, "123", "c1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p", "p1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("1", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const newProduct = new Product("p2", "p2", 20);
    await productRepository.create(newProduct);

    const newOrderItem = new OrderItem(
      "1",
      newProduct.name,
      newProduct.price,
      newProduct.id,
      2
    );

    const newOrder = new Order("1", customer.id, [newOrderItem]);

    await orderRepository.update(newOrder);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "1",
      customerId: "1",
      total: 40,
      items: [
        {
          id: "1",
          productId: "p2",
          name: "p2",
          quantity: 2,
          price: 20,
          orderId: "1",
        },
      ],
    });
  })

  it('should find an order', async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "customer 1");
    const address = new Address("s1", 1, "123", "c1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p", "p1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("1", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const foundOrder = await orderRepository.find('1');

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: foundOrder.id,
      customerId: foundOrder.customerId,
      total: foundOrder.total(),
      items: [
        {
          id: foundOrder.items[0].id,
          productId: foundOrder.items[0].productId,
          name: foundOrder.items[0].name,
          quantity: foundOrder.items[0].quantity,
          price: foundOrder.items[0].price,
          orderId: foundOrder.id,
        },
      ],
    });
  })

  it('should find all orders', async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "customer 1");
    const address = new Address("s1", 1, "123", "c1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p", "p1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("1", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const foundOrder = await orderRepository.findAll();

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(foundOrder.length).toBe(1);
    expect(orderModel.toJSON()).toStrictEqual({
      id: foundOrder[0].id,
      customerId: foundOrder[0].customerId,
      total: foundOrder[0].total(),
      items: [
        {
          id: foundOrder[0].items[0].id,
          productId: foundOrder[0].items[0].productId,
          name: foundOrder[0].items[0].name,
          quantity: foundOrder[0].items[0].quantity,
          price: foundOrder[0].items[0].price,
          orderId: foundOrder[0].id,
        },
      ],
    });
  })
});
