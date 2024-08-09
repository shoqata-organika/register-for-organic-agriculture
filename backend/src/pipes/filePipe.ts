import {
  PipeTransform,
  Injectable,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';

@Injectable()
export class OptionalParseFilePipe implements PipeTransform {
  async transform(value: any) {
    if (value === undefined || (Array.isArray(value) && !value.length)) {
      return undefined;
    }

    const parseFilePipe = new ParseFilePipe({
      validators: [new MaxFileSizeValidator({ maxSize: 3145728 })],
      exceptionFactory: (error) => new Error(error),
    });

    return await parseFilePipe.transform(value);
  }
}
