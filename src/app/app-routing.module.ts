import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login/login.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SwipingComponent } from './components/swiping/swiping.component';
import { MatchedUserListComponent } from './components/matched-user-list/matched-user-list.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { MessagingComponent } from './components/messaging/messaging.component';
import { ViewPartnerRequestComponent } from './components/view-partner-request/view-partner-request.component';
import { PostPartnerRequestComponent } from './components/post-partner-request/post-partner-request.component';
import { VisitProfileComponent } from './components/visit-profile/visit-profile.component';


const routes: Routes = [
/*   { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent }, */
  { path: 'profile', component: UserProfileComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'register', component: RegistrationComponent},
  { path: 'login', component:LoginComponent},
  { path: 'swiping', component:SwipingComponent},
  { path: 'message-rooms', component: MessagingComponent },
  { path: 'messages', component: MessageListComponent },
  { path: 'partner-requests', component: ViewPartnerRequestComponent },
  { path: 'partner-requests/new', component: PostPartnerRequestComponent }, // Add a route for posting partner requests
  { path: 'view-profile/:userId', component: VisitProfileComponent},

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    RegistrationComponent,
    LoginComponent,
    UserProfileComponent,
    SwipingComponent
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
