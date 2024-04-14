import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessagingService } from '../../service/messaging.service'; // Import your message service
import { CommonModule } from '@angular/common';
import { UserProfileService } from '../../service/user-profile.service';
import { AuthService } from '../../service/authentication/auth.service';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss'
})
export class MessageListComponent {
  matchedUsers: any[] = []; // Update variable name
  userId: string | null = null;
  constructor(private router: Router, private messagingService: MessagingService, private userProfileService: UserProfileService, private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchMatchedUsers(); // Update method name
    
  }

  fetchMatchedUsers(): void { // Update method name
    this.userId = this.authService.getUserId();
    if(this.userId !==null ){
    this.userProfileService.getMatchedUsers(this.userId).subscribe(
      (users: any[]) => {
        this.matchedUsers = users;
        // Fetch last message for each user
        this.matchedUsers.forEach(user => {
          console.log(user," algerie");
          this.messagingService.getLastMessage(this.userId!, user._id).subscribe(
            (lastMessage: any) => {
              console.log(user, " user logs");
              console.log(lastMessage, " last message");
              user.lastMessage = lastMessage;
              //this.isMessageSeen(user.lastMessage,this.userId!);
              
            },
            (error) => {
              console.error('Error fetching last message NO:', error);
            }
          );
        });
      },
      (error) => {
        console.error('Error fetching matched users:', error);
      }
    );
    }
  }
  isMessageSeen(latestMessage: any, recipient: any): boolean {
    if(latestMessage && latestMessage.readBy.includes(recipient)){
    return true;
}else{
  return false;
}
}
  navigateToChatRoom(recipientId: string): void {
    
    this.userId = this.authService.getUserId();

    const chatId = this.messagingService.generateChatId(this.userId, recipientId);
  this.messagingService.setRecipientId(recipientId);
      // Leave previously joined chat room
  if (chatId !== '') {
    this.messagingService.disconnectFromChat(chatId);
  }
  this.messagingService.joinChat({ userId: this.authService.getUserId(), chatId });
    this.router.navigate(['/messages']);
  //I put this.userId here, but it's not logical, because this.userId is not necessarily the recipient ID.... but it works to make
  // recipient ONLY mark as read the message.
    this.messagingService.markMessageAsRead(chatId,this.userId!);
    
  }
}
