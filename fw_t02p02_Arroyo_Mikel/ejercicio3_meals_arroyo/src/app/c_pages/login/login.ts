import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  errorMessage: string = '';
  successMessage: string = '';

  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  public registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  public handleLogin(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor completa el formulario correctamente';
      return;
    }

    const { email, password } = this.loginForm.value;
    const success = this.auth.login(email ?? '', password ?? '');

    if (success) {
      this.errorMessage = '';
      this.router.navigate(['/']);
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  }
  public handleRegister(): void {
  if (this.registerForm.invalid) {
    this.errorMessage = 'Por favor completa el formulario correctamente';
    return;
  }

  const { name, email, password } = this.registerForm.value;
  const success = this.auth.register(name ?? '', email ?? '', password ?? '');

  if (success) {
    this.errorMessage = '';
    this.successMessage = 'Usuario registrado correctamente. Inicia sesión.';
    this.registerForm.reset();
  } else {
    this.errorMessage = 'El email ya está registrado';
  }
}

}
