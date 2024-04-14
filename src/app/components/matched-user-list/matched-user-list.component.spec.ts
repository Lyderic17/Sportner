import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchedUserListComponent } from './matched-user-list.component';

describe('MatchedUserListComponent', () => {
  let component: MatchedUserListComponent;
  let fixture: ComponentFixture<MatchedUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchedUserListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatchedUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
