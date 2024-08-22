import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PartnerRequest } from '../../service/models/partner-request.model';
import { PartnerRequestService } from '../../service/partner/partner-request.service';
import { Router, RouterLink } from '@angular/router';
import { MessagingService } from '../../service/messaging.service';

@Component({
  selector: 'app-view-partner-request',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './view-partner-request.component.html',
  styleUrl: './view-partner-request.component.scss'
})
export class ViewPartnerRequestComponent implements OnInit{

  partnerRequests: PartnerRequest[] = [];

  constructor(private partnerRequestService: PartnerRequestService, private router: Router, private messagingService: MessagingService) { }

  ngOnInit(): void {
    this.getAllPartnerRequests();
    
  }

  getAllPartnerRequests(): void {
    this.partnerRequestService.getAllPartnerRequests().subscribe(
      requests => {
        this.partnerRequests = requests;
        console.log(this.partnerRequests, " requests partner things")
      },
      error => {
        console.error('Error fetching partner requests:', error);
        alert('Failed to fetch partner requests. Please try again.');
      }
    );
  }
  discuss(recipientId: string) {
    this.messagingService.setRecipientId(recipientId)
    this.router.navigate(['/messages'], { queryParams: { recipientId } });
  }
}
