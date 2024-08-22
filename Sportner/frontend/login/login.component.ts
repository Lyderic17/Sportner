import { Component } from '@angular/core';
import { AuthService } from '../../src/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  errorMessage: string | undefined;
  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.credentials).subscribe(response => {
      // Handle successful login
      console.log('Login successful', response);
      // Redirect to dashboard or show a success message
    }, error => {
      // Handle login error
      console.log(error, "not no no ")
      this.errorMessage = error.error.message; // Assuming your backend sends error messages in the response
    });
  } 
}
