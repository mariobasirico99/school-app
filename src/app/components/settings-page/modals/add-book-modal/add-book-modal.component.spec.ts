import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookModalComponent } from './add-book-modal.component';

describe('AddBookModalComponent', () => {
  let component: AddBookModalComponent;
  let fixture: ComponentFixture<AddBookModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBookModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBookModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
