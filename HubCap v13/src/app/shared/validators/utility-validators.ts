import { AbstractControl, ValidatorFn } from '@angular/forms';

import * as moment from 'moment';

import { convertDate, hasData, validateDateIsGreaterThanOrEqualToCurrent, validateDatesMatch, validateNumberRange } from '../utilities/utilities';

export interface AbstractControlWarn extends AbstractControl {
  warnings: any;
}

export function characterLengthValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (hasData(control.value) === true) {
      if (control.value.length > max || control.value.length < min) {
        return { characterLengthOutOfRange: false };
      }
    }
    return null;
  };
}

export function checkBoxTrueValidator(): ValidatorFn {

  return (control: AbstractControl): { [key: string]: any } | null => {

    if (control.value !== true && control.value !== 'true') {

      return { 'checkBoxRequired': false };

    }

    return null;

  };

}

export function compareValuesValidator(compareValue: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (hasData(control.value) === true && control.value !== compareValue) {
      return { 'valuesDontMatch': false };
    }
    return null;
  };
}

export function dateIsGreaterThanOrEqualToCurrentValidator(): ValidatorFn {

  return (control: AbstractControl): { [key: string]: boolean } | null => {

    if (validateDateIsGreaterThanOrEqualToCurrent(control.value) === false) {

      return { 'dateIsGreaterThanOrEqualToCurrentValidator': true };

    }

    return null;

  };

}

export function dateIsWithinRangeValidator(start: any, end: any): ValidatorFn {

  return (control: AbstractControl): { [key: string]: boolean } | null => {

    if (hasData(control.value) === true) {

      const controlDate = convertDate(control.value);
      const startDate = convertDate(start);
      const endDate = convertDate(end);

      if (controlDate.isBefore(startDate) || controlDate.isAfter(endDate)) {

        return { 'dateIsWithinRange': false };

      }
    }

    return null;

  };

}

export function datesMatchValidator(data: any, enabled = false): ValidatorFn {

  return (control: AbstractControl): { [key: string]: boolean } | null => {

    if (hasData(control.value) === true && enabled === true) {
      if (validateDatesMatch(control.value, data) === false) {
        return { datesDoNotMatch: false };
      }
    }

    return null;

  };

}

export function numberRangeValidator(min: number, max: number): ValidatorFn {

  return (control: AbstractControl): { [key: string]: any } | null => {

    if (validateNumberRange(min, max, control.value) === false) {

      return { 'numberRange': true, 'min': min, 'max': max, 'value': Number(control.value) };

    }

    return null;

  };

}

export function startDateIsLessThanEndDateValidator(dates: any): ValidatorFn {

  return (control: AbstractControl): { [key: string]: string } | null => {

    if (hasData(control.value) === true) {
      if (moment(dates.effectiveDate).isAfter(moment(dates.expirationDate))
        || moment(dates.effectiveDate).isSame(moment(dates.expirationDate))) {
        return { 'startDateIsLessThanEndDate': 'Expiration date must be greater than effective date.' };
      }
    }

    return null;

  };

}

export function valueIsObjectValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (hasData(control.value) === true && typeof control.value !== 'object') {
      return { 'dataIsObject': false };
    }
    return null;
  };
}





export function inputSpacesBeforeOrAfterValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const controlValue = control.value;
    if (typeof controlValue === 'string') {
      if (controlValue.startsWith(' ') === true || controlValue.endsWith(' ') === true) {
        return {
          inputSpacesBeforeOrAfter: true
        };
      }
    }
    return null;
  };
}
