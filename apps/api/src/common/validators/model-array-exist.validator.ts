/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { PrismaService } from '@common/services/db/prisma.service';
import { Prisma } from '@database/generated/prisma';
import { Injectable } from '@nestjs/common';
import { PRISMA_FIELD_TYPES } from './model-exist.validator';

@Injectable()
@ValidatorConstraint({ name: 'modelArrayExist', async: true })
export class ModelArrayExistValidator implements ValidatorConstraintInterface {
  private message: string;
  constructor(private readonly prisma: PrismaService) {}
  lowerCaseFirst = (str: string) => {
    return str.charAt(0).toLowerCase() + str.slice(1);
  };

  async validate(value: any, args: ValidationArguments) {
    //If the value is optional or required, should handle by another validator
    if (value == undefined) return true;
    const isArray = Array.isArray(value);
    if (!isArray) {
      this.message = 'Invalid value type, only array is allowed';
      return false;
    }
    if (value.length === 0) return true;
    const [model, field = 'id'] = args.constraints as [
      Prisma.ModelName,
      string,
    ];
    const modelFields = Prisma.dmmf.datamodel.models.find(
      (_model) => _model.name === model,
    ).fields;
    if (!modelFields) {
      this.message = `Model ${model} does not exist`;
      return false;
    }

    if (
      !modelFields.find(
        (_field) =>
          _field.name === field &&
          PRISMA_FIELD_TYPES[_field.type] === typeof value[0], //We assume that all items in the array are of the same type due previous validation
      )
    ) {
      this.message = `Field ${field} does not exist in ${model} or is not of type ${typeof value}`;
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const modelClient = this.prisma[this.lowerCaseFirst(model)];
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const records = await modelClient.findMany({
        where: {
          [field]: {
            in: value,
          },
        },
      });
      const result = records.length === value.length;
      if (!result) {
        this.message = `Some of the ${field} provided does not exist`;
      }
      return result;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientUnknownRequestError ||
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientValidationError
      ) {
        this.message = `Validation error: ${error.message}`;
      } else {
        this.message = `Validation error: something went wrong`;
      }
      return false;
    }
  }

  defaultMessage() {
    return this.message;
  }
}

export function ModelArrayExist(
  model: Prisma.ModelName,
  field?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'modelArrayExist',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [model, field],
      options: validationOptions,
      validator: ModelArrayExistValidator,
    });
  };
}
