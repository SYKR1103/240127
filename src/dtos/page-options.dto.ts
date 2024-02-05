import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderConstraint } from '../constraint/order.constraint';

export class PageOptionsDto {
  @ApiPropertyOptional({ enum: OrderConstraint, default: OrderConstraint.ASC })
  readonly order?: OrderConstraint = OrderConstraint.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 10,
  })
  readonly take?: number = 10;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  readonly page?: number = 1;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
