import { Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login/login.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SwipingComponent } from './components/swiping/swiping.component';
//import { MatchedUserListComponent } from './components/matched-user-list/matched-user-list.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { MessagingComponent } from './components/messaging/messaging.component';

export const routes: Routes = [
  { path: 'profile', component: UserProfileComponent},
  { path: 'swiping', component: SwipingComponent},
    { path: 'dashboard', component: DashboardComponent},
    { path: 'register', component: RegistrationComponent},
    { path: 'login', component:LoginComponent},
    { path: 'message-rooms', component: MessageListComponent },
    { path: 'messages', component: MessagingComponent },

    // ... other routes
  ]
