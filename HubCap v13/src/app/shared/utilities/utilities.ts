import { FormArray, FormGroup } from '@angular/forms';
import * as moment from 'moment';

import { UUID } from 'angular2-uuid';

export function convertDate(date: any) {
  date = moment.utc(new Date(date));
  date.hour(0);
  date.minute(0);
  date.second(0);
  date.millisecond(0);
  return date;
}

export function generateUUID() {
  return UUID.UUID();
}

export function getFormattedDate(date: Date) {
  let formattedDate = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2) + " " + ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2);
  return formattedDate;
}

export function getMappedQueueTableData(data: any) {
  const mappedTableData: any[] = [];
  data.rows.forEach((row: any) => {
    const rowObj: any = new Object();
    row.cells.forEach((cell: any) => {
      const columnResult = data.columns.find((column: any) => column.id === cell.columnId);
      const fieldName: string = columnResult.title.replace(/\s+/g, '').replace(/[{()}]/g, '').toLowerCase();
      const value = fieldName === 'boxid' ? (hasData(cell.value) === true ? cell.value.toString().split('|') : []) : cell.value;
      rowObj[fieldName] = value;
    });
    mappedTableData.push(rowObj);
  });
  return mappedTableData;
}

export function getUniqueArrayByField(array: Array<any>, field: string) {
  const result = array.map(item => item[field]);
  const unique = result.filter((item, i, ar) => ar.indexOf(item) === i);

  return hasData(unique) === true ? unique : [];
}

export function hasData(value: any) {
  const isValid = value === undefined || value === null || value === '' ? false : true;
  return isValid;
}

export function isInStringArray(array: string[], value: string) {
  let isInArray = false;
  const results = array.find(item => item === value);
  if (hasData(results) === true) {
    isInArray = true;
  }
  return isInArray;
}

export function validateDateIsGreaterThanOrEqualToCurrent(date: Date): boolean {
  const today = new Date();
  if (date >= today) {
    return true;
  }
  return false;
}

export function validateDatesMatch(value1: any, value2: any) {
  const date1 = convertDate(value1).format('LL');
  const date2 = convertDate(value2).format('LL');
  if (date1 !== date2) {
    return false;
  }
  return true;
}

export function validateNumberRange(min: number, max: number, value: number): Boolean {
  if (value !== undefined && (isNaN(value) || value < min || value > max)) {
    return false;
  }
  return true;
}
