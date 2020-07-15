import { ValidationErrors, AbstractControl } from '@angular/forms';
export function PasswordMatchValidator(formgroup: AbstractControl): ValidationErrors | null {
  let confirmPassword = '';
  let password = '';

  const _password = formgroup.get('password');
  const _confirmPassword = formgroup.get('confirmPassword');

  if (_password.valid && _confirmPassword.valid) {
    password = _password.value;
    confirmPassword = _confirmPassword.value;
  }

  const response = (password === confirmPassword) ? null : { passwordMatchError: 'The passwords does not match' };

  return response;
}
