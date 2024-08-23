import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = 'http://localhost:6000/user'; // Update with your backend API URL
  private apiUrlSwipe = 'http://localhost:6000/swiping'; // Update with your backend API URL
  private apiUrlLike = 'http://localhost:6000/like';
  constructor(private http: HttpClient) { }

  // Method to create a new user profile
  createUserProfile(profileData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile`, profileData);
  }

  // Method to update an existing user profile
  updateUserProfile(userId: string, profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/profile`, profileData);
  }

  // Method to retrieve a user profile by user ID
  getUserProfile(userId: string): Observable<any> {
    console.log(userId, "userId from getuserpfoilservice");
    return this.http.get(`${this.apiUrl}/${userId}/profile`);
  }

  // Method to delete a user profile by user ID
  deleteUserProfile(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/profile`);
  }

  // Méthode pour récupérer les profils à swiper
  getProfilesToSwipe(userSportsInterests: string[], userId: string): Observable<any[]> {
    // Prepare HTTP parameters with user's sports interests
    let params = new HttpParams();
    userSportsInterests.forEach(interest => {
      params = params.append('sportsInterests', JSON.stringify(interest));
    });
    // Append userId to the params
    params = params.append('userId', userId);
    
    console.log("getting the right api? ");
    // Make HTTP request to fetch profiles to swipe
    return this.http.get<any[]>(`${this.apiUrlSwipe}/profiles-to-swipe`, { params });
  }
  getMatchedUsers(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/matched-users`);
  }
    // Function to like a profile
    likedProfile(userId: string, likedUserId: string): Observable<any> {
        const body = { userId, likedUserId };
        return this.http.post<any>(`${this.apiUrlSwipe}/like`, body);
      }
    
      likeProfile(userId: string, likedUserId: string): Observable<any> {
        console.log(userId, likedUserId, " both liked");
        return this.http.post<any>(`${this.apiUrlLike}/like`, { userId, likedUserId });
      }
      getLikedProfiles(userId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrlLike}/liked-profiles/${userId}`);
      }
    
      getMatches(userId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrlLike}/matches/${userId}`);
      }

      // Method to update user's geolocation
  updateUserGeolocation(userId: string, latitude: number, longitude: number): Observable<any> {
    const body = { latitude, longitude };
    return this.http.put<any>(`${this.apiUrl}/${userId}/geolocation`, body);
  }
    getProfilesBySport(sport: string): Observable<any[]> {
    // Prepare HTTP parameters with the selected sport
    let params = new HttpParams().set('sport', sport);
    
    // Make HTTP request to fetch profiles by sport
    return this.http.get<any[]>(`${this.apiUrlSwipe}/profiles-by-sport`, { params });
  }
}