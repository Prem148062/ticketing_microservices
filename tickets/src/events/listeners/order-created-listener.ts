import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from '@premwhlolipop/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class OrderCreatedListerner extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        const ticket = await Ticket.findById(data.ticket.id);
        //check ticket
        if(!ticket) throw new Error('Ticket not found');
        // set orderId from publish order
        ticket.set({orderId: data.id })
        //save
        await ticket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        });
        //ack the message
        msg.ack();
    }
}