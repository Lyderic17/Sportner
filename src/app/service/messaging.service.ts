import { Injectable } from '@angular/core';
import { Socket, SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './authentication/auth.service';
@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private apiUrl = 'http://localhost:3000/messages';//was message-rooms previously.
  private apiUrlUsers = 'http://localhost:3000/user'; // to get the user profile infos everywhere, cool.
  private apiUrlRoom = 'http://localhost:3000/message-rooms';
  public socket: Socket;
  private recipientId: string = '';

  private messageReadByRecipientSubject: Subject<any> = new Subject<any>();

  
  constructor(private http: HttpClient, private authService: AuthService) {
    this.socket = new Socket({ url: 'http://localhost:3001' }); // Initialize socket in the constructor
 /*    this.initSocketListeners(); */

  }

  sendMessage(message: string, senderId: string | null, recipientId: string,  chatId: string): Observable<any> {
    if(senderId !== null){
   // const chatId = this.generateChatId(senderId, recipientId);
    
    this.socket.emit('sendMessage', { message, senderId, recipientId, chatId });
  }
     // Assuming you want to handle acknowledgment from the server
    /* this.socket.fromEvent('messageSent').subscribe((ack: any) => {
      if (ack.success) {
        
        console.log('Message sent successfully:', ack.message);
        // Handle success (if needed)
        console.log(ack, " all acnkolslslsl")
      } else {
        console.error('Failed to send message:', ack.message);
        // Handle failure (if needed)
      }
    });  */
    return new Observable(observer => {
      this.socket.fromEvent('messageSent').subscribe((ack: any) => {
        observer.next({ success: ack.success, message: ack.message, isInChatRoom: ack.isInChatRoom });
      });
    });
  }
  public generateChatId(user1Id: string | null, user2Id: string): string {
    // Concatenate user IDs and sort them to ensure consistency
    return [user1Id, user2Id].sort().join('_');
  }
  getMessageRooms(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Fetch previous messages for a chat
  getPreviousMessages(chatId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${chatId}`);
  }
  getPreviousMessagesSocket(chatId: string): Observable<any[]> {
    return this.socket.fromEvent<any[]>('previousMessages');
  }
  joinChat(data: { userId: string | null, chatId: string }): void {
    console.log(data," data from client side");
    this.socket.emit('join', data);
  }
    disconnectFromChat(chatId: string): void {
    console.log("getting disco;");
    this.socket.emit('leave-chat', { chatId });
  } 


  receiveMessage(chatId: string): Observable<any> {
    console.log("Received from service: chatId =", chatId);
    const observable = this.socket.fromEvent('message:' + chatId);
    observable.subscribe(
      (message) => console.log("Received message from server:", message),
      (error) => console.error("Error receiving message from server:", error),
      () => console.log("Completed receiving messages")
    );
    return observable;
  }
  setRecipientId(recipientId: string): void {
    this.recipientId = recipientId;
  }


  // In the frontend, emit this event when a user opens a chat or views a message
markMessageAsRead(chatId: string, recipientId: string): void {

  this.socket.emit('messageRead', chatId, recipientId);
  console.log(chatId, recipientId, " it equals it");
  
}
  getRecipientId(): string {
    return this.recipientId;
  }

  getRecipientInfo(recipientId: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrlUsers}/${recipientId}/profile`);
  }

  getLastMessage(senderId: string, recipientId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlRoom}/last-message?senderId=${senderId}&recipientId=${recipientId}`);
  }


  getMessageReadByRecipient(): Observable<any> {
    console.log("hi youuu from readrecipeient");
    //return this.socket.fromEvent<any>('messageReadByRecipient');
    const observable = this.socket.fromEvent('messageReadByRecipient');
    observable.subscribe(
      (message) => console.log("hi youuu from readrecipeient:", message),
      (error) => console.error("Error readdddding message from server:", error),
      () => console.log("Completed receiving messages")
    );
    return observable;
  }
}
