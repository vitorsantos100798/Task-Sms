import { parse, isDate } from 'date-fns';

export function parseDateString(_: any, originalValue: string) {
  const parsedDate = isDate(originalValue) ? originalValue : parse(originalValue, 'yyyy-MM-dd', new Date());

  return parsedDate;
}
