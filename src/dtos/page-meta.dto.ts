import { ApiProperty } from '@nestjs/swagger';

export class PageMetaDto {
  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly totalPage: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly hasPrevious: boolean;

  @ApiProperty()
  readonly hasNext: boolean;

  constructor({ pageOptionDto, itemCount }) {
    this.page = pageOptionDto.page;
    this.take = pageOptionDto.take;
    this.itemCount = itemCount;
    this.totalPage = Math.ceil(this.itemCount / this.take);
    this.hasPrevious = this.page > 1;
    this.hasNext = this.page < this.totalPage;
  }
}
