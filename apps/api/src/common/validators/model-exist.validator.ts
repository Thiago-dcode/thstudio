/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

export const PRISMA_FIELD_TYPES = {
  BigInt: 'number',
  Boolean: 'boolean',
  Bytes: 'string',
  DateTime: 'Date',
  Decimal: 'number',
  Float: 'number',
  Int: 'number',
  JSON: 'object',
  String: 'string',
} as const;

@Injectable()
@ValidatorConstraint({ name: 'modelExist', async: true })
export class ModelExistValidator implements ValidatorConstraintInterface {
  private message: string;
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: any, args: ValidationArguments) {
    //If the value is optional or required, should handle by another validator
    if (value == undefined) return true;
    if (typeof value === 'object') {
      this.message = 'Invalid value type, only primitive value is allowed';
      return false;
    }
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
          PRISMA_FIELD_TYPES[_field.type] === typeof value,
      )
    ) {
      this.message = `Field ${field} does not exist in ${model} or is not of type ${typeof value}`;
      return false;
    }
    const modelClient = this.prisma[model.toLowerCase()];
    if (!modelClient) {
      this.message = `Model ${model} does not exist`;
      return false;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const record = await modelClient.count({
        where: { [field]: value },
      });
      if (record == 0) {
        this.message = `${field}: ${value} does not exist in ${model}`;
        return false;
      }
      return true;
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

export function ModelExist(
  model: Prisma.ModelName,
  field?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'modelExist',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [model, field],
      options: validationOptions,
      validator: ModelExistValidator,
    });
  };
}
