import { Component } from '@angular/core';
import { UserProfileService } from '../../service/user-profile.service'; // Import your user service
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/authentication/auth.service';
@Component({
  selector: 'app-matched-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matched-user-list.component.html',
  styleUrl: './matched-user-list.component.scss'
})
export class MatchedUserListComponent {
  matchedUsers: any[] = [];

  constructor(private router: Router, private userService: UserProfileService, private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchMatchedUsers();
  }

  fetchMatchedUsers(): void {
    const userId = this.authService.getUserId(); // Replace 'your_user_id' with the actual user ID
    if(userId !== null){
    this.userService.getMatchedUsers(userId).subscribe(
      (users: any[]) => {
        this.matchedUsers = users;
      },
      (error) => {
        console.error('Error fetching matched users:', error);
      }
    );
  }
  }

  navigateToChatRoom(userId: string): void {
    this.router.navigate(['/chat', userId]); // Navigate to chat room with user ID
  }
}