import { DateTime } from 'luxon';

export class TimeUtils {
  static now(): Date {
    return DateTime.now().setZone('Asia/Jakarta').toJSDate();
  }
}
