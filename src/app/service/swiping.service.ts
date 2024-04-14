/* import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { userProfile } from '../../../backend/models'
@Injectable({
  providedIn: 'root'
})
export class SwipingService {

  private profiles: UserProfile[] = [
    { id: '1', name: 'User 1', imageUrl: 'assets/user1.jpg', bio: 'Bio of User 1' },
    { id: '2', name: 'User 2', imageUrl: 'assets/user2.jpg', bio: 'Bio of User 2' },
    // Add more user profiles as needed
  ];
  private currentIndex = 0;

  constructor() { }

  getNextProfile(): Observable<UserProfile> {
    const profile = this.profiles[this.currentIndex];
    this.currentIndex++;
    return of(profile);
  }
}

 */