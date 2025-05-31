import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { PrismaService } from '@common/services/db/PrismaService';
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
@ValidatorConstraint({ name: 'modelExist', async: true })
export class ModelExistValidator implements ValidatorConstraintInterface {
  private message: string;
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: any, args: ValidationArguments) {
    if (value == undefined) return true;
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
          PRISMA_FIELD_TYPES[_field.type] === typeof value,
      )
    ) {
      this.message = `Field ${field} does not exist in ${model} or is not of type ${typeof value}`;
      return false;
    }
    const modelClient = this.prisma[model.toLowerCase()];
    try {
      const record = await (modelClient as any).count({
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

  defaultMessage(args: ValidationArguments) {
    return this.message;
  }
}

export function ModelExist(
  model: Prisma.ModelName,
  field?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
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
