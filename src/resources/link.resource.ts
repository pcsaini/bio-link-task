import { Expose } from 'class-transformer';
import { BaseResource, ToTimestamp } from './base.resource';

export class LinkResource extends BaseResource {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  url: string;

  @Expose()
  active: boolean;

  @Expose()
  order: number;

  @Expose()
  @ToTimestamp()
  startTime: number | null;

  @Expose()
  @ToTimestamp()
  endTime: number | null;

  @Expose()
  @ToTimestamp()
  createdAt: number;

  @Expose()
  @ToTimestamp()
  updatedAt: number;
}
