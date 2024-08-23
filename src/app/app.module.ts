import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from './service/authentication/auth.service';
import { FontAwesomeModule, FaIconLibrary  } from '@fortawesome/angular-fontawesome';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { faCoffee, fas } from '@fortawesome/free-solid-svg-icons';
import {MatSelectModule} from '@angular/material/select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxFileDropModule } from 'ngx-file-drop';
//import { AvatarModule } from 'ngx-avatar';
import { SwipingComponent } from './components/swiping/swiping.component';
import { MessagingComponent } from './components/messaging/messaging.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { MessagingService } from './service/messaging.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { ViewPartnerRequestComponent } from './components/view-partner-request/view-partner-request.component';
import { PostPartnerRequestComponent } from './components/post-partner-request/post-partner-request.component';
// Configure Socket.IO connection
const config: SocketIoConfig = { url: 'http://localhost:3001/', options: {} };


@NgModule({
  declarations: [
    CommonModule,
    HttpClientModule,
    DashboardComponent,
    RouterModule,
    MessagingService,
    
      ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DashboardComponent,
    HeaderComponent,
    MatSidenavModule,
    NgxDropzoneModule,
    NgxChartsModule,
    MatSelectModule,
    NgxFileDropModule,
    //AvatarModule,
    SwipingComponent,
    MessagingComponent,
    SocketIoModule.forRoot(config),
    MessagingService,
    MatFormFieldModule,
    MatInputModule ,
    ViewPartnerRequestComponent,
    PostPartnerRequestComponent
  ],
  exports: [ 
    AppComponent,
    CommonModule,
    RouterModule,
    HttpClientModule,
    NgxFileDropModule,
    //AvatarModule,
    
  ],
  bootstrap:[AppComponent],
  providers:[AuthService, MessagingService, SocketIoModule]
})
export class AppModule { }
