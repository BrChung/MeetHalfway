import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDestinationPageComponent } from './add-destination-page.component';

describe('AddDestinationPageComponent', () => {
  let component: AddDestinationPageComponent;
  let fixture: ComponentFixture<AddDestinationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDestinationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDestinationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
