import { v4 as uuidv4 } from 'uuid';

export function generateUiId(): string {
  return uuidv4();
}