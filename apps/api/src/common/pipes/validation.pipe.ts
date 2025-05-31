import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

export const ValidationPipeProvider = {
  provide: APP_PIPE,
  useFactory: () => {
    return new ValidationPipe({
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new UnprocessableEntityException(result);
      },
    });
  },
};
