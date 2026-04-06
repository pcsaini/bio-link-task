import { plainToInstance, Transform } from 'class-transformer';

export function ToTimestamp(): PropertyDecorator {
  return Transform(({ value }) => {
    if (value === null || value === undefined) return null;
    const date = value instanceof Date ? value : new Date(value);
    return Math.floor(date.getTime() / 1000);
  });
}

export abstract class BaseResource {
  static transform<T>(this: new () => T, data: any): T {
    return plainToInstance(this, data, {
      excludeExtraneousValues: true,
    });
  }

  static collection<T>(this: new () => T, data: any[]): T[] {
    return plainToInstance(this, data, {
      excludeExtraneousValues: true,
    });
  }
}
