import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { Logger } from "@nestjs/common";
import { EmailService, ImailOptions } from "../../email.service";
import { EMAIL_MESSAGE_QUEUE } from "./contant";

@Processor(EMAIL_MESSAGE_QUEUE)
export class MessageConsumer {
  private readonly logger = new Logger(MessageConsumer.name);
  constructor(private readonly emailService: EmailService) {}

  @Process(EMAIL_MESSAGE_QUEUE)
  async handleSendEmail(job: Job<ImailOptions>) {
    try {
      const { data } = job;
      await this.emailService.sendMailByBull(data);
    } catch (error) {
      console.log(error);
      this.logger.error("unable to send the user email");
    }
  }
}
