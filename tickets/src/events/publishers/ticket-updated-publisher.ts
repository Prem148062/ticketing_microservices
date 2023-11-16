import { Publisher, Subjects, TicketUpdatedEvent } from '@premwhlolipop/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

