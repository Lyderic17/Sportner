import { Component } from '@angular/core';
import { AuthService } from '../../src/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, HttpClientModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  user = { username: '', email: '', password: '' };
  errorMessage: string | undefined;
  constructor(private authService: AuthService) {}

  signup() {
    this.authService.signup(this.user).subscribe(
      response => {
        console.log("Successfully created account");
      },
      error => {
        console.log("Signup failed:", error);
        this.errorMessage = error.error.message; // Assuming your backend sends error messages in the response
      }
    );
  }
}