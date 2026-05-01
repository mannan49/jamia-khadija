import { BaseEntity } from './base-entity.model';

export class RefreshToken extends BaseEntity {
  Token: string;
  UserId: string;
  ExpiresAt: Date;
  CreatedByIp: string;
  IsRevoked: boolean;
  RevokedAt: Date;
  ReplacedByToken: string;
}
