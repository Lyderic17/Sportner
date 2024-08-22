import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { RouterModule, Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { LoginComponent } from '../../frontend/login/login.component';
import { SignupComponent } from '../../frontend/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    RouterModule,
    RouterLink,
    HttpClientModule,
    LoginComponent,
    SignupComponent,
    AuthService
    // Other components
  ],
  imports: [
    AppComponent,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    LoginComponent,
    SignupComponent,
    AuthService
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
