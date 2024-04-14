// registration.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../service/authentication/auth.service'; // Update with the correct path
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  user = { username: '', password: '' };
  registrationError: string | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.user).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/login']);
        // Handle success as needed
      },
      (error) => {
        console.error('Registration error:', error);
        this.registrationError = 'Registration failed. Please try again.';
        // Handle error
      }
    );
  }
}
