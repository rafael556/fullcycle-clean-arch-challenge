import RepositoryInterface from "../../../../domain/@shared/repository/repository.interface";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";


export default class OrderRepository implements RepositoryInterface<Order> {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customerId: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
      { include: [{ model: OrderItemModel }] }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customerId: entity.customerId,
        total: entity.total(),
      },
      {
        where: { id: entity.id },
      }
    );

    await Promise.all(
      entity.items.map(async (item) => {
        await OrderItemModel.update(
          {
            name: item.name,
            price: item.price,
            productId: item.productId,
            quantity: item.quantity,
          },
          {
            where: { id: item.id },
          }
        );
      })
    );
}
  
  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: ["items"],
    });

    const items = orderModel.items.map(item => {
      return new OrderItem(item.id, item.name, item.price, item.productId, item.quantity);
    })

    return new Order(orderModel.id, orderModel.customerId, items);
  }
  
  async findAll(): Promise<Order[]> {
    const orderModel = await OrderModel.findAll({
      include: ["items"],
    });

    return orderModel.map(order => {
      const items = order.items.map(item => {
        return new OrderItem(item.id, item.name, item.price, item.productId, item.quantity);
      })
  
      return new Order(order.id, order.customerId, items);
    });
  }
}
