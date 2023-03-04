import { IsArray } from 'class-validator';
import { PageMetaDto } from './PageMetaDto.js';

export class PageDto<T> {
  @IsArray()
  data: T[];

  meta!: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
