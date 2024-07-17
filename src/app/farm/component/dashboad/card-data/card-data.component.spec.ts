import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDataComponent } from './card-data.component';

describe('CardDataComponent', () => {
  let component: CardDataComponent;
  let fixture: ComponentFixture<CardDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardDataComponent]
    });
    fixture = TestBed.createComponent(CardDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
