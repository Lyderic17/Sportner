import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../../service/user-profile.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visit-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './visit-profile.component.html',
  styleUrl: './visit-profile.component.scss'
})
export class VisitProfileComponent {
  userId: string = "";
  userProfile: any; // Update with your user profile model
  private apiUrl = 'http://localhost:3000/user';
  constructor(
    private route: ActivatedRoute,
    private userProfileService: UserProfileService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      this.getUserProfile();
    });
  }

  getUserProfile(): void {
    this.userProfileService.getUserProfile(this.userId).subscribe(
      userProfile => {
        this.userProfile = userProfile;
      },
      error => {
        console.error('Error fetching user profile:', error);
        // Handle error
      }
    );
  }

  getImageUrl(filename: string): string {
    return `${this.apiUrl}/${filename}`; // Update this line with your API URL
  }
}
