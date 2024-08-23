import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../../service/user-profile.service';
import { AuthService } from '../../service/authentication/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, FormControlDirective, ReactiveFormsModule } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { MatFormFieldModule, MatFormFieldControl } from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, ReactiveFormsModule  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  userProfile: any; // Variable to store user profile data
  errorMessage: string | undefined;
  userId: string | null = null;
  profileData: any = {};
  profilePicture: File | null = null;
  selectedSport: string = '';
  selectedLevel: string = '';
  filteredSports: Observable<string[]> | null = null;
  backendUrl: string = '';
  private apiUrl = 'http://localhost:6000/user';

  sports: string[] = ['Football', 'Basketball', 'Tennis', 'Golf', 'Cricket', 'Baseball', 'Swimming', 'Cycling', 'Running', 'Hiking'];
  levels: string[] = ['Beginner', 'Intermediate', 'Advanced'];
  sportControl = new FormControl();
  constructor(private userProfileService: UserProfileService, private authService: AuthService) {
    this.filteredSports = this.sportControl.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filterSports(value))
    );
    console.log(this.filteredSports, " filtered constructor");
   }

  ngOnInit(): void {
    // Call a method to retrieve the user profile when the component initializes
    this.userId = this.authService.getUserId();
    this.backendUrl = window.location.origin;
    if (this.userId) {
      console.log("having the user yes", this.userId); 
      this.getUserProfile(this.userId);
    }
    console.log(this.filteredSports," filteration")
  }

  private _filterSports(value: string): string[] {
    const filterValue = value;
    console.log(filterValue, " filtervalue dafuq is that");
    console.log(this.sports.filter(sport => sport.toLowerCase().includes(filterValue)), " BIG BIG BIG BIG BIG BIG ")
    return this.sports.filter(sport => sport.toLowerCase().includes(filterValue));
  }

 /*  get sportControl(): FormControl {
    return new FormControl();
  } */

  onSportSelected(event: any): void {
    this.selectedSport = event.option.value;
  }
  getImageUrl(filename: string): string {
    return `${this.apiUrl}/${filename}`;
  }
  // Method to retrieve the user profile
getUserProfile(userId: string): void {
  this.userProfileService.getUserProfile(userId).subscribe(
    (response) => {
      console.log(response, " response inside getddd")
      this.userProfile = response;
      // Set the profile picture if available
      this.profilePicture = this.userProfile.profilePicture ? new File([], this.userProfile.profilePicture) : null;
    },
    (error) => {
      console.log(error, " error here ? but ", userId)
      this.errorMessage = error.message;
    }
  );
}

  // Method to handle file selection for profile picture
  onFileSelected(event: any): void {
    this.profilePicture = event.target.files[0];
  }

  // Method to create a user profile
  createUserProfile(): void {
    console.log('User ID:', this.userId);
    console.log('Profile Data:', this.profileData);
    console.log(this.profileData.sportsInterests);
    if (this.userId && this.profileData) {
      const formData = new FormData();
      formData.append('userId', this.userId);
      formData.append('username', this.profileData.username);
      formData.append('age', this.profileData.age.toString()); // Ensure age is converted to string
      formData.append('location', this.profileData.location);
      
      // Convert sports interests string to an array
      const sportsInterestsArray = this.profileData.sportsInterests.split(/[,\s]+/);
      const serializedInterests = sportsInterestsArray.map((sport: string) => {
        return { sport, level: this.profileData.level }; // Use the selected level for all interests
      });
      
      // Append each serialized interest as a separate field
      serializedInterests.forEach((interest: { sport: string | Blob; level: string | Blob; }, index: any) => {
        formData.append(`sportsInterests[${index}][sport]`, interest.sport);
        formData.append(`sportsInterests[${index}][level]`, interest.level);
      });
  
      formData.append('bio', this.profileData.bio);
  
      if (this.profilePicture) {
        formData.append('profilePicture', this.profilePicture, this.profilePicture.name);
      }
  
      console.log('Form Data:', formData);
      
      this.userProfileService.createUserProfile(formData).subscribe(
        (response) => {
          console.log('Response:', response);
          console.log('Profile created successfully');
        },
        (error) => {
          this.errorMessage = error.message;
        }
      );
    }
  }

  updateUserProfile(): void {
    if (this.userId && this.userProfile) {
      const formData = new FormData();
      formData.append('username', this.userProfile.username);
      formData.append('age', this.userProfile.age);
      formData.append('location', this.userProfile.location);
      // Split the sports interests string by commas and/or spaces
    // Serialize sports interests with levels
    const serializedInterests = this.userProfile.sportsInterests.map((interest: { sport: string, level: string }) => {
      return { sport: interest.sport, level: interest.level }; // Serialize each interest as an object
    });

    // Append each serialized interest as a separate field
    serializedInterests.forEach((interest: { sport: string | Blob; level: string | Blob; }, index: any) => {
      formData.append(`sportsInterests[${index}][sport]`, interest.sport);
      formData.append(`sportsInterests[${index}][level]`, interest.level);
    });
      formData.append('bio', this.userProfile.bio);
      if (this.profilePicture) {
        formData.append('profilePicture', this.profilePicture, this.profilePicture.name);
      }
      this.userProfileService.updateUserProfile(this.userId, formData).subscribe(
        () => {
          console.log('Profile updated successfully');
          if (this.userId) {
            this.getUserProfile(this.userId);
          }
        },
        (error) => {
          this.errorMessage = error.message;
        }
      );
    }
  }
  addSportInterest(): void {
    console.log("hey added");
    // Check if the selected sport interest and level are not empty
    const selectedSport = this.sportControl.value;
  if (this.sportControl.value && this.userProfile.level) {
    
    // Create a new object to represent the selected sport interest and level
    const interest = {
      sport: this.sportControl.value,
      level: this.userProfile.level
    };

    // Check if the sport interest is not already added
    if (!this.isInterestAdded(interest)) {
      // Add the selected sport interest to the userProfile.sportsInterests array
      this.userProfile.sportsInterests.push(interest);
    }

    // Clear the selected sport and level
    this.sportControl.reset();
    this.userProfile.level = '';
  }
}

  removeSportInterest(index: number): void {
    // Remove the sport interest at the specified index from the userProfile.sportsInterests array
    this.userProfile.sportsInterests.splice(index, 1);
  }

  // Helper method to check if the sport interest is already added
isInterestAdded(interest: { sport: string, level: string }): boolean {
  return this.userProfile.sportsInterests.some((item: { sport: string, level: string }) => {
    return item.sport === interest.sport && item.level === interest.level;
  });
}

  // Method to delete the user profile
  deleteUserProfile(): void {
    if (this.userId) {
      this.userProfileService.deleteUserProfile(this.userId).subscribe(
        () => {
          console.log('Profile deleted successfully');
          // Optionally, you can navigate the user to a different page after deleting the profile
        },
        (error) => {
          this.errorMessage = error.message;
        }
      );
    }
  }
}