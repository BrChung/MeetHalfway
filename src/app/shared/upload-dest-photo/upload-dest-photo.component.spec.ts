import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDestPhotoComponent } from './upload-dest-photo.component';

describe('UploadDestPhotoComponent', () => {
  let component: UploadDestPhotoComponent;
  let fixture: ComponentFixture<UploadDestPhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDestPhotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDestPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
