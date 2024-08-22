import { Component } from '@angular/core';
import { AuthService } from '../../src/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(private authService: AuthService, private router: Router) {
    this.authService.logout().subscribe(response => {
      // Handle successful logout
      console.log('Logout successful');
      // Redirect to login page
      this.router.navigate(['/login']);
    }, error => {
      // Handle logout error
      console.error('Logout error:', error);
    });
  }
}
