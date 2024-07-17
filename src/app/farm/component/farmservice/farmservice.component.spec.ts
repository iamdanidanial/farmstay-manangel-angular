import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmserviceComponent } from './farmservice.component';

describe('FarmserviceComponent', () => {
  let component: FarmserviceComponent;
  let fixture: ComponentFixture<FarmserviceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FarmserviceComponent]
    });
    fixture = TestBed.createComponent(FarmserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
