import { PartialType } from '@nestjs/swagger';
import { CreateProgressScoreDto } from './create-progress-score.dto';

export class UpdateProgressScoreDto extends PartialType(CreateProgressScoreDto) {}
