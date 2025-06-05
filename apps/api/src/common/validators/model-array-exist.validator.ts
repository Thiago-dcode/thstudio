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

const PRISMA_FIELD_TYPES = {
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
@ValidatorConstraint({ name: 'modelArrayExist', async: true })
export class ModelArrayExistValidator implements ValidatorConstraintInterface {
  private message: string;
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: any, args: ValidationArguments) {
    //If the value is optional or required, should handle by another validator
    if (value == undefined) return true;
    const isArray = Array.isArray(value);
    if (!isArray) {
      this.message = 'Invalid value type, only array is allowed';
      return false;
    }
    if (value.length === 0) return true;
    const [model, field = 'id'] = args.constraints;
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
          value.every(
            (item: any) => PRISMA_FIELD_TYPES[_field.type] === typeof item,
          ),
      )
    ) {
      this.message = `Field ${field} does not exist in ${model} or is not of type ${typeof value}`;
      return false;
    }
    const modelClient = this.prisma[model.toLowerCase()];
    try {
      const records = await Promise.all(
        value.map(async (item: any) => {
          return await (modelClient as any).count({
            where: { [field]: item },
          });
        }),
      );
      return records.every((record) => record > 0);
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

  defaultMessage(args: ValidationArguments) {
    return this.message;
  }
}

export function ModelArrayExist(
  model: Prisma.ModelName,
  field?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
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
