import { Component } from '@angular/core';
import { AuthService } from '../../service/authentication/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  loginError: string | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.credentials).subscribe(
      (response) => {
        console.log(this.credentials,"CRENDIEGTENTE")
        console.log('Login successful:', response);
        this.router.navigate(['/swiping']); // Redirect to dashboard after successful login
      },
      (error) => {
        console.error('Login error:', error);
        this.loginError = 'Login failed. Please check your credentials and try again.';
      }
    );
  }
}
