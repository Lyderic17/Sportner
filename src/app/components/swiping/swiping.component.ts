import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserProfileService } from '../../service/user-profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/authentication/auth.service';
import { NotificationService } from '../../service/notifications/notifications.service';

@Component({
  selector: 'app-swiping',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './swiping.component.html',
  styleUrl: './swiping.component.scss'
})
export class SwipingComponent implements OnInit, AfterViewInit {
  profilesToSwipe: any[] = [];
  currentProfileIndex: number = 0;
  userSportsInterests: string[] = [];
  likedProfiles: any[] = [];
  matches: any[] = [];
  notifications: any[] = [];
  allSports: string[] = ['Football', 'Basketball', 'Tennis', 'Golf', 'Cricket', 'Baseball', 'Swimming', 'Cycling', 'Running', 'Hiking' ];
  userLocation: { latitude: number, longitude: number } | null = null; // Define userLocation property
  constructor(private userProfileService: UserProfileService, private authService: AuthService, private notificationService: NotificationService) { }

  @ViewChild('sportFilterContainer') sportFilterContainer: ElementRef | undefined;
 
  ngAfterViewInit(): void{
    this.adjustContainerWidth();
  }
  ngOnInit(): void {
    console.log(this.getUserGeolocation()," my geolocation");
    const userId = this.authService.getUserId();

    // Retrieve user sports interests
    this.authService.getUserSportsInterests().subscribe(
      (userSportsInterests) => {
        console.log('User sports interests:', userSportsInterests);
        this.userSportsInterests = userSportsInterests;
        this.getProfilesToSwipe(userSportsInterests); // Call getProfilesToSwipe() after getting user sports interests
      },
      (error) => {
        console.error('Error fetching user sports interests:', error);
      }
    );
      if(userId !== null){
/*     this.userProfileService.getLikedProfiles(userId).subscribe(
      (likedProfiles) => {
        this.likedProfiles = likedProfiles;
        console.log('Liked profiles:', this.likedProfiles);
        // Handle liked profiles in the UI
      },
      (error) => {
        console.error('Error fetching liked profiles:', error);
        // Handle error in the UI
      }
    ); */

    // Fetch matches
    this.userProfileService.getMatches(userId).subscribe(
      (matches) => {
        this.matches = matches;
        console.log('Matches:', this.matches);
        // Handle matches in the UI
      },
      (error) => {
        console.error('Error fetching matches:', error);
        // Handle error in the UI
      }
    );
      }
      if (userId !== null) {
        this.notificationService.getUserNotifications(userId).subscribe(
          (notifications) => {
            this.notifications = notifications;
            console.log('Notifications:', this.notifications);
          },
          (error) => {
            console.error('Error fetching notifications:', error);
          }
        );
      }
  }

  // Méthode pour récupérer les profils à swiper
  async getProfilesToSwipe(userSportsInterests: string[]): Promise<void> {
    try {
      const userId = this.authService.getUserId();
      const userLocation =  await this.getUserGeolocation();
      console.log(userLocation, "HE BA AALORS")
      this.userLocation = userLocation; // Assign userLocation
      const profiles = await this.userProfileService.getProfilesToSwipe(userSportsInterests, userId!).toPromise();
      console.log(profiles," BIG MAN")
      if (!profiles || profiles.length === 0) {
        console.log('No profiles to swipe.');
        return;
      }
  
      const likedProfiles = await Promise.all(profiles.map(profile => this.isProfileLiked(profile)));
      // Filter nearby profiles within 10 km radius
      this.profilesToSwipe = profiles.filter(profile => {
        const distance = this.calculateDistance(profile.latitude, profile.longitude, this.userLocation!.latitude, this.userLocation!.longitude);
        console.log(profile.distance," distancia de ", profile.username)
        return  distance <= 10;
      }).filter((profile, index) => {
        const hasCommon = this.hasCommonInterests(profile, userSportsInterests);
        const isNotLiked = !likedProfiles[index];
        return profile.userId !== this.authService.getUserId() && hasCommon && isNotLiked ;
      });
      console.log('Profiles to swipe with common interests:', this.profilesToSwipe);
    } catch (error) {
      console.error('Error fetching profiles to swipe:', error);
    }
  }
// Method to calculate distance between two points on Earth (Haversine formula)
calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = this.deg2rad(lat2 - lat1);
  const dLon = this.deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  console.log(distance, "hello you bb")
  return distance;
}

deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
// Vérifie si le profil a des intérêts sportifs communs avec l'utilisateur actuel
hasCommonInterests(profile: any, userSportsInterests: string[]): boolean {
  // Get the sports interests of the profile being checked
  console.log(profile)
  const profileSportsInterests = profile.sportsInterests.map((interest: any) => interest.sport);
  console.log(profileSportsInterests," profileddd", userSportsInterests, " comparison")
  // Check if there's at least one common sports interest between the profile and the current user
  const hasCommon = profileSportsInterests.some((profileInterest: string) =>
    userSportsInterests.some((userInterest: any) => userInterest.sport === profileInterest)
  );
  console.log(userSportsInterests , ' should have or include : ', profileSportsInterests," hascommon dafuq")
  console.log(`Does profile ${profile.username} have common sports interests with the user? ${hasCommon}`);
  return hasCommon;
}

  swipeLeft(): void {
    if (this.currentProfileIndex >= 0 && this.currentProfileIndex < this.profilesToSwipe.length) {
      // Supprimer le profil actuel de la liste (dislike)
      console.log('Profil non apprécié:', this.profilesToSwipe[this.currentProfileIndex]);
      this.profilesToSwipe.splice(this.currentProfileIndex, 1);
    }
  }

  swipeRight(): void {
    if (this.currentProfileIndex >= 0 && this.currentProfileIndex < this.profilesToSwipe.length) {
      // Ajouter le profil actuel à la liste des likes (actions supplémentaires peuvent être ajoutées ici)

      console.log('Profil apprécié:', this.profilesToSwipe[this.currentProfileIndex]);

      // Supprimer le profil actuel de la liste (optionnel)
      this.profilesToSwipe.splice(this.currentProfileIndex, 1);
    }
  }



onSwipe(event: any): void {
  // Logic to detect swipe gesture type (left, right, etc.) and trigger appropriate methods
  // You can use external libraries like Hammer.js to detect swipe gestures
  const swipeDirection = event.direction;
  if (swipeDirection === 'left') {
    this.swipeLeft();
  } else if (swipeDirection === 'right') {
    this.swipeRight();
  }
}
likeProfile(): void {
  // Handle like action
  console.log('Liked profile:', this.profilesToSwipe[this.currentProfileIndex]);
  this.likedProfile(this.profilesToSwipe[this.currentProfileIndex]);
  // Remove the liked profile from the list
  this.profilesToSwipe.splice(this.currentProfileIndex, 1);
  if (this.currentProfileIndex >= this.profilesToSwipe.length) {
    this.currentProfileIndex = this.profilesToSwipe.length - 1;
  }
}

dislikeProfile(): void {
  // Handle dislike action
  console.log('Disliked profile:', this.profilesToSwipe[this.currentProfileIndex]);
  // Remove the disliked profile from the list
  this.profilesToSwipe.splice(this.currentProfileIndex, 1);
  if (this.currentProfileIndex >= this.profilesToSwipe.length) {
    this.currentProfileIndex = this.profilesToSwipe.length - 1;
  }
}

likedProfile(profile: any): void {
  const userId = this.authService.getUserId();
  if (userId) {
    const likedUserId = profile.userId;
    this.userProfileService.likeProfile(userId, likedUserId).subscribe(
      () => {
        console.log('Profile liked successfully');
        // Optionally, remove the liked profile from the list
         //this.profilesToSwipe = this.profilesToSwipe.filter(p => p.userId !== likedUserId);
      },
      (error) => {
        console.error('Error liking profile:', error);
      }
    );
  } else {
    console.error('User is not authenticated.');
  }
}
markAsRead(notificationId: string): void {
  this.notificationService.markNotificationAsRead(notificationId).subscribe(
    () => {
      console.log('Notification marked as read successfully');
      // Update UI to reflect the notification as read
      const notificationIndex = this.notifications.findIndex(notification => notification._id === notificationId);
      if (notificationIndex !== -1) {
        this.notifications[notificationIndex].read = true;
      }
    },
    (error) => {
      console.error('Error marking notification as read:', error);
    }
  );
}

async isProfileLiked(profile: any): Promise<boolean> {
  const userId = this.authService.getUserId();
  if (!userId) {
    console.error('User is not authenticated.');
    return false;
  }

  try {
    const likedProfiles = await this.userProfileService.getLikedProfiles(userId).toPromise();
    if (likedProfiles === undefined) {
      console.error('Liked profiles not found.');
      return false;
    }
    this.likedProfiles = likedProfiles;
    console.log('Liked profiles:', this.likedProfiles);
    return this.likedProfiles.some(likedProfile => likedProfile.likedUserId === profile.userId);
  } catch (error) {
    console.error('Error fetching liked profiles:', error);
    return false;
  }
}

deleteNotification(notificationId: string): void {
  this.notificationService.deleteNotification(notificationId).subscribe(
    () => {
      console.log('Notification deleted successfully');
      // Remove the notification from the UI
      this.notifications = this.notifications.filter(notification => notification._id !== notificationId);
    },
    (error) => {
      console.error('Error deleting notification:', error);
    }
  );
}

// Method to retrieve user's geolocation
// Method to retrieve user's geolocation
getUserGeolocation(): Promise<{ latitude: number, longitude: number }> { // Change return type to Promise
  return new Promise((resolve, reject) => { // Return a Promise
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log('User location:', latitude, longitude);
          // Call method to save user's geolocation
          this.saveUserGeolocation(latitude, longitude);
          // Resolve the promise with user's location
          resolve({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting user geolocation:', error);
          reject(error); // Reject the promise if there's an error
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      reject('Geolocation not supported'); // Reject the promise if geolocation is not supported
    }
  });
}

  // Method to save user's geolocation
  saveUserGeolocation(latitude: number, longitude: number): void {
    const userId = this.authService.getUserId();
    if (userId) {
      // Make HTTP request to update user's profile with geolocation data
      this.userProfileService.updateUserGeolocation(userId, latitude, longitude).subscribe(
        () => {
          console.log('User geolocation saved successfully.');
        },
        (error) => {
          console.error('Error saving user geolocation:', error);
        }
      );
    } else {
      console.error('User is not authenticated.');
    }
  }

  //filter based on sport clicked: 
  filterProfilesBySport(sport: string): void {
    // Fetch profiles based on the selected sport
    this.userProfileService.getProfilesBySport(sport).subscribe(
      (profiles) => {
        console.log('Profiles for sport', sport, ':', profiles);
        // Assign the fetched profiles to profilesToSwipe
        this.profilesToSwipe = profiles;
      },
      (error) => {
        console.error('Error fetching profiles:', error);
      }
    );
  }

  //css styling js
  adjustContainerWidth(): void {
    // Get the width of the sport filter container
    const containerWidth = this.sportFilterContainer?.nativeElement.offsetWidth;

    // Set the width of the sport filter container as the same width of its contents
    this.sportFilterContainer!.nativeElement.style.width = `${containerWidth}px`;
  }
}