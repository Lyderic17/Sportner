import { Component, EventEmitter, Inject, Input, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AuthService } from '../../service/authentication/auth.service';
import {MatIconModule} from '@angular/material/icon'
import { CommonModule } from '@angular/common';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faUser, faSignOutAlt, faSignInAlt, fas } from '@fortawesome/free-solid-svg-icons';
import { faHome, faPlayCircle, faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterModule, MatIconModule, CommonModule, FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  faBars = faBars;
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;
  faSignInAlt = faSignInAlt;
  faHome = faHome;
  faPlayCircle = faPlayCircle;
  faEnvelope = faEnvelope;
  @Input() isLoggedIn: boolean = false;
  @Input() username: string | null = null;
  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(private authService: AuthService, library: FaIconLibrary) {
    library.addIcons(faBars, faUser, faSignOutAlt, faSignInAlt);
  }

  
  ngOnInit() {
    // Subscribe to authentication state changes
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.username.subscribe((username) => {
      this.username = username;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLoggedIn'] && !changes['isLoggedIn'].firstChange) {
      // Handle changes to the isLoggedIn property (e.g., redirect after login/logout)
      // You can add additional logic based on your requirements
    }

  }
  toggleSidenav() {
    this.sidenavToggle.emit();
  }

  logout() {
    this.authService.logout();
  }
}

