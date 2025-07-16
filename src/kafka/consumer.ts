import type { Consumer } from 'kafkajs';

import { appLogger } from '../configs/logger';
import { transporter } from '../configs/nodemailer';
import type { IEmailDto } from '../dtos';
import { kafka } from './configs/kafka';

const emailConsumer: Consumer = kafka.consumer({ groupId: 'email-group' });

class KafkaConsumer {
  static async consumeEmailMessage(emailData: IEmailDto) {
    try {
      await transporter.sendMail({
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      });

      appLogger.info('Email sent', emailData);
    } catch (error) {
      appLogger.error('Error sending email', error);
    }
  }
}

export const runKafkaConsumer = async () => {
  await emailConsumer.connect();
  await emailConsumer.subscribe({ topic: 'send-email' });

  await emailConsumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) {
        return;
      }

      const emailData: IEmailDto = JSON.parse(message.value.toString());
      appLogger.info('Email received', emailData);
      await KafkaConsumer.consumeEmailMessage(emailData);
    },
  });
};
