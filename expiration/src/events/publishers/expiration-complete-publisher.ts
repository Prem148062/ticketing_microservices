import { Subjects, Publisher, ExpirationCompleteEvent } from '@premwhlolipop/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;
}