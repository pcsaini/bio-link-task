import { Expose } from 'class-transformer';
import { BaseResource, ToTimestamp } from './base.resource';

export class UserResource extends BaseResource {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  bio: string | null;

  @Expose()
  avatar: string | null;

  @Expose()
  @ToTimestamp()
  createdAt: number;

  @Expose()
  @ToTimestamp()
  updatedAt: number;
}
