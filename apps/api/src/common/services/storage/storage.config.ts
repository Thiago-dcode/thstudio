export const STORAGE_SERVICE = 'STORAGE_SERVICE';

export type StorageType = 's3' | 'disk';

export interface StorageConfig {
  type: StorageType;
}
