  import { Component, DoCheck, ElementRef, Injectable, ViewChild } from '@angular/core';
  import { MessagingService } from '../../service/messaging.service';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { ChangeDetectorRef } from '@angular/core';
  import { AuthService } from '../../service/authentication/auth.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../service/notifications/notifications.service';
import { ActivatedRoute } from '@angular/router';
  @Component({
    selector: 'app-messaging',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './messaging.component.html',
    styleUrl: './messaging.component.scss'
  })
  export class MessagingComponent {
    messages: any[] = [];
    newMessage: string = '';
    recipientId: string = '';
    senderId: string | null = '';
    chatId: string = '';
    recipientInfos: any ={};
    lastMessage: any = null;
    private messageSentSubscription: Subscription | null = null;
    messageRead: any = null;
    messageReadStatus: { [messageId: string]: boolean } = {};
    @ViewChild('messagesContainer') messagesContainer!: ElementRef;
    private messageReadByRecipientSubscription: Subscription | null = null;
    ack: any;
    constructor(private messagingService: MessagingService, private cdr: ChangeDetectorRef,
       private authService: AuthService, private notificationService: NotificationService, private route: ActivatedRoute) { }


    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.recipientId = params['recipientId'];
        // Fetch recipient's info and previous messages here
      });
      
      this.notificationService.listenForNewMessages().subscribe((newMessage: any) => {
        // Handle the new message event, such as displaying a notification
        console.log('New message received: give recipient pls in init', newMessage);
        // Add your code here to display a notification to the recipient
        // For example, display a toast notification or update the UI with the new message
      });
     
          // Fetch previous messages when the component initializes
          // Assume you have logic to set recipientId
      const recipientId = this.messagingService.getRecipientId();
      //retrieve recipient's infos : 
      if(recipientId !==null){
      this.messagingService.getRecipientInfo(recipientId).subscribe(
        (response) => {
          this.recipientInfos = response; // Assuming the name is stored in the 'username' field
          console.log(this.recipientInfos," recipient Infos here")
        },
        (error) => {
          console.error('Error fetching recipient name:', error);
        }
      );
    }
      //end retrieve recipient infos 
      this.senderId = this.authService.getUserId();
      if(this.senderId !==null){
      this.chatId = this.messagingService.generateChatId(this.senderId, recipientId);
      
          this.messagingService.getPreviousMessages(this.chatId).subscribe((messages) => {
            this.messages = messages;
          });
          this.messagingService.receiveMessage(this.chatId).subscribe((message) => {
            this.messages.push(message);
            this.scrollToBottom();
            this.messagingService.markMessageAsRead(this.chatId,this.senderId!);
            
          });

          this.messagingService.getMessageReadByRecipient().subscribe((message) => {
            //console.log(`Message ${message._id} has been read by the recipient! from the fucking messaging component`, message);
            console.log(message," full blown message");
              this.messageReadStatus[message.messageId] = true;
              console.log(message,"  read stats mes couilles");
              this.lastMessage = message;
              
               this.messageRead = message;
              this.messageReadStatus[message._id] = true;
 
            
          });

        this.messagingService.getLastMessage(this.senderId!, recipientId).subscribe(
          (lastMessage: any) => {
            console.log(lastMessage, " last message inside the messaging");
            this.lastMessage = lastMessage;
          },
          (error) => {
            console.error('Error fetching last message NO:', error);
          }
        );
    }

    //this.messageRead == false;
    }



    scrollToBottom(): void {
      setTimeout(() => {
        try {
          this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
          console.log(this.messagesContainer.nativeElement.clientHeight," messagecontainer");
        
      } catch (err) {
        console.error(err);
      }
      }, 500);
    
    }
    

    sendMessage(): void {
      this.recipientId = this.messagingService.getRecipientId();
      console.log(this.recipientId," recipient iD")
      if(this.authService.getUserId() !== null ){
        this.senderId = this.authService.getUserId();
      }
        this.chatId = this.messagingService.generateChatId(this.senderId, this.recipientId);
      if (this.newMessage.trim() !== '') {
        // Assuming you have a variable `recipientId` indicating the recipient user's ID
       
        this.messagingService.sendMessage(this.newMessage, this.senderId, this.recipientId, this.chatId).subscribe((ack: any) => {
          if (ack.success) {
            this.ack = ack;
            this.notificationService.emitNewMessageNotification(this.senderId!, this.recipientId);
            console.log(this.ack,' thisacks')
            console.log('Message sent successfully:', ack.message);
            if (ack.isInChatRoom) {
              console.log("eh dis donc tes là ?", this.ack)

              // Handle the case where recipient is in the chat room
            } else {
              console.log(" absent pour le moment")
              // Handle the case where recipient is not in the chat room
            }
          } else {
            console.error('Failed to send message:', ack.message);
            // Handle failure if needed
          }
        });
        console.log("Message sent: ", this.newMessage);
        this.newMessage = '';
      }
      this.scrollToBottom();
    }

    ngAfterViewInit(): void {
        this.scrollToBottom();
    }

    ngOnDestroy(): void {
      // Unsubscribe from 'messageSent' event
      if (this.messageSentSubscription) {
        this.messageSentSubscription.unsubscribe();
      }
      if (this.messageReadByRecipientSubscription) {
        this.messageReadByRecipientSubscription.unsubscribe();
      }
      // Disconnect from the WebSocket server when the component is destroyed
      const recipientId = this.messagingService.getRecipientId();
      const senderId = this.authService.getUserId();
      this.chatId = this.messagingService.generateChatId(senderId, recipientId);
      this.messagingService.disconnectFromChat(this.chatId);
    }
  }
