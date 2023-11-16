import { Subjects, Publisher, PaymentCreatedEvent } from '@premwhlolipop/common';
import { queueGroupName } from '../listeners/queue-group-name';



export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated
}