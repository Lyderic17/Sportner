// partner-request.model.ts

export interface PartnerRequest {
    userId: string;
    username: string;
    profilePicture: string;
    sport: string;
    dateTime: string;
    location: string;
    additionalInfo?: string;
  }
  