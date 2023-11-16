import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";
import mongoose, { set } from "mongoose";
import { OrderCancelledEvent, OrderStatus } from "@premwhlolipop/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: "asldkfj",
    version: 0,
  });
  await order.save();
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "asldkfj",
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, order };
};

it("updates the status of the order", async () => {
  const { data, listener, msg, order } = await setup();
  await listener.onMessage(data, msg);
  const updateOrder = await Order.findById(order.id);

  expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
  const { data, listener, msg, order } = await setup();

  await listener.onMessage(data,msg);

  expect(msg.ack).toHaveBeenCalled();
});
