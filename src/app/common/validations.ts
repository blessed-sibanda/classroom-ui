import { Validators } from '@angular/forms';

export const NameValidation = [
  Validators.required,
  Validators.minLength(3),
  Validators.maxLength(30),
];

export const EmailValidation = [Validators.required, Validators.email];

export const OptionalPasswordValidation = [Validators.minLength(6)];

export const PasswordValidation = OptionalPasswordValidation.concat([
  Validators.required,
]);
