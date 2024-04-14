import { Component, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list'
import {MatIconModule} from '@angular/material/icon'
import { AuthService } from './service/authentication/auth.service';
import { SwipingComponent } from './components/swiping/swiping.component';
import { NotificationService } from './service/notifications/notifications.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule, HeaderComponent, MatSidenavModule, MatSidenav, MatListModule,
      MatIconModule, RouterModule, SwipingComponent ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  yourLoggedInCheck: boolean = false; // Set it to the actual value based on your authentication logic
  yourUsername: string | null = null; // Set it to the actual username or null based on your authentication logic

  @ViewChild('sidenav') sidenav: MatSidenav | undefined;
  title = 'DataFoot';

  constructor(private authService: AuthService, private notificationService: NotificationService) {
    
  }

  ngOnInit() {
    // Subscribe to authentication state changes
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      this.yourLoggedInCheck = loggedIn;
    });

    this.authService.username.subscribe((username) => {
      this.yourUsername = username;
    });
  }

  toggleSidenav() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  logout() {
    this.authService.logout();
  }
}
