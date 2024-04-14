import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewInit {
  data: any[] | undefined;
  playerData: any[] | undefined;
  playerStats: any[] | undefined;
  constructor() {}

  ngOnInit(): void {
  }



  ngAfterViewInit(): void {

}
}