import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ type: 'number', example: 0 })
  @IsNumber()
  @IsOptional()
  skip = 0;

  @ApiProperty({ type: 'number', example: 10 })
  @IsNumber()
  @IsOptional()
  take = 10;
}
