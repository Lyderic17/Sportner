import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { MessagingService } from '../messaging.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:6000/notifications'; // Update with your backend API URL

  constructor(private http: HttpClient, private messagingService: MessagingService) {
    console.log(this.listenForNewMessages(), " new message listen")
    this.messagingService.socket.fromEvent('newMessage').subscribe((newMessage: any) => {
      // Handle the new message event, such as displaying a notification
      console.log('New message received FOR THE RECIPIENT:', newMessage);
      // Add your code here to display a notification to the recipient
    });
   }
   // Method to listen for new message notifications using Socket.IO
  listenForNewMessages(): Observable<any> {
    return this.messagingService.socket.fromEvent('newMessage');
  }

  // Method to listen for new like notifications using Socket.IO
  listenForNewLikes(): Observable<any> {
    return this.messagingService.socket.fromEvent('newLike');
  }

  // Method to listen for new match notifications using Socket.IO
  listenForNewMatches(): Observable<any> {
    return this.messagingService.socket.fromEvent('newMatch');
  }

    // Method to emit new message notification event
    emitNewMessageNotification(senderId: string, recipientId: string): void {
      console.log("new message incoming dude");
      this.messagingService.socket.emit('newMessage', { senderId, recipientId });
    }
  
    // Method to emit new like notification event
    emitNewLikeNotification(likerId: string, recipientId: string): void {
      this.messagingService.socket.emit('newLike', { likerId, recipientId });
    }
  
    // Method to emit new match notification event
    emitNewMatchNotification(user1Id: string, user2Id: string): void {
      this.messagingService.socket.emit('newMatch', { user1Id, user2Id });
    }

  // Method to create a new notification
  createNotification(notificationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, notificationData);
  }

  // Method to retrieve notifications for a user
  getUserNotifications(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }

  // Method to mark a notification as read
  markNotificationAsRead(notificationId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${notificationId}/read`, {});
  }

  // Method to delete a notification
  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${notificationId}`);
  }
}
