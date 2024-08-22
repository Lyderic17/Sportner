import { Component } from '@angular/core';
import { PartnerRequest } from '../../service/models/partner-request.model';
import { PartnerRequestService } from '../../service/partner/partner-request.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/authentication/auth.service';

@Component({
  selector: 'app-post-partner-request',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './post-partner-request.component.html',
  styleUrl: './post-partner-request.component.scss'
})
export class PostPartnerRequestComponent {

  request: PartnerRequest = {
    userId: this.authService.getUserId()!, // You need to set this value based on the logged-in user
    sport: '',
    dateTime: new Date().toISOString().slice(0, 16), // Set default dateTime to current time
    location: '',
    additionalInfo: '',
    username: '', // Provide username here
    profilePicture:'',
  };

  constructor(private partnerRequestService: PartnerRequestService, private authService: AuthService) { }

  onSubmit(): void {
    this.partnerRequestService.createPartnerRequest(this.request).subscribe(
      () => {
        console.log(this.request, "and we have it dafuq.");
        alert('Partner request created successfully');
        this.resetForm();
      },
      error => {
        console.error('Error creating partner request:', error);
        alert('Failed to create partner request. Please try again.');
      }
    );
  }

  private resetForm(): void {
    this.request = {
      userId: '',
      sport: '',
      dateTime: new Date().toISOString().slice(0, 16),
      location: '',
      additionalInfo: '',
      username: '',
      profilePicture:'',
    };
  }
}