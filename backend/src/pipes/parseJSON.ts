import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class JSONParsePipe implements PipeTransform {
  async transform(value: any) {
    if (value.details && typeof value.details === 'string') {
      if (value.details === 'undefined') {
        return value;
      }

      try {
        value.details = JSON.parse(value.details);

        return value;
      } catch (error) {
        throw new BadRequestException('details is not a JSON');
      }
    }

    return value;
  }
}
