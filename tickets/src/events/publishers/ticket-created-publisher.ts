import { Publisher, Subjects, TicketCreatedEvent } from '@premwhlolipop/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
