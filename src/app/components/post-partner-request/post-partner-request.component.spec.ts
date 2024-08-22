import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPartnerRequestComponent } from './post-partner-request.component';

describe('PostPartnerRequestComponent', () => {
  let component: PostPartnerRequestComponent;
  let fixture: ComponentFixture<PostPartnerRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostPartnerRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostPartnerRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
