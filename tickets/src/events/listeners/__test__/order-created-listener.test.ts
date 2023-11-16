import { OrderCreatedListerner } from "../order-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket";
import { OrderCreatedEvent, OrderStatus } from "@premwhlolipop/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
    // instan listener
    const listener = new OrderCreatedListerner(natsWrapper.client);

    // instan ticket

    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: 'asd'
    })

    await ticket.save();

    // fake event-driver
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: "asdfg",
        expiresAt: "asdfg",
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { msg, listener, ticket, data }
}

it('set the userId of ticket', async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updateTicket = await Ticket.findById(ticket.id);
    
    expect(updateTicket!.orderId).toEqual(data.id);
});


it('call the ack message', async() => {
    const { listener, ticket, data, msg } = await setup();
    
    await listener.onMessage(data, msg);
    
    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket update event', async () => {
    const { listener, data, msg, ticket } = await setup();


    await listener.onMessage(data, msg);


    expect(natsWrapper.client.publish).toHaveBeenCalled();

    //@ts-ignore
    const ticketUpdateData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(data.id).toEqual(ticketUpdateData.orderId);
});