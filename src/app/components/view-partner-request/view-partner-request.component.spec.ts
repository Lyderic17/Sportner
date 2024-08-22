import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPartnerRequestComponent } from './view-partner-request.component';

describe('ViewPartnerRequestComponent', () => {
  let component: ViewPartnerRequestComponent;
  let fixture: ComponentFixture<ViewPartnerRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPartnerRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewPartnerRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
