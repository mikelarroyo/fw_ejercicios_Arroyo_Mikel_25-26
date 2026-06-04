import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login-widget',
  imports: [RouterLink],
  templateUrl: './login-widget.html',
  styleUrl: './login-widget.css',
})
export class LoginWidget {
  protected auth = inject(AuthService);
  private router = inject(Router);

  doLogout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
