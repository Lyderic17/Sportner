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
import { ViewPartnerRequestComponent } from './components/view-partner-request/view-partner-request.component';
import { PostPartnerRequestComponent } from './components/post-partner-request/post-partner-request.component';
import { VisitProfileComponent } from './components/visit-profile/visit-profile.component';

export const routes: Routes = [
  { path: 'profile', component: UserProfileComponent},
  { path: 'swiping', component: SwipingComponent},
    { path: 'dashboard', component: DashboardComponent},
    { path: 'register', component: RegistrationComponent},
    { path: 'login', component:LoginComponent},
    { path: 'message-rooms', component: MessageListComponent },
    { path: 'messages', component: MessagingComponent },
    { path: 'partner-requests', component: ViewPartnerRequestComponent },
    { path: 'partner-requests/new', component: PostPartnerRequestComponent },
    { path: 'view-profile/:userId', component: VisitProfileComponent}
    // ... other routes
  ]
