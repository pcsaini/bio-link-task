import { Expose, Type } from 'class-transformer';
import { BaseResource } from './base.resource';

class PublicLinkResource extends BaseResource {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  url: string;

  @Expose()
  order: number;
}

export class PublicProfileResource extends BaseResource {
  @Expose()
  username: string;

  @Expose()
  bio: string | null;

  @Expose()
  avatar: string | null;

  @Expose()
  @Type(() => PublicLinkResource)
  links: PublicLinkResource[];
}
