import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagementListComponent } from './file-management-list.component';

describe('FileManagementListComponent', () => {
  let component: FileManagementListComponent;
  let fixture: ComponentFixture<FileManagementListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileManagementListComponent]
    });
    fixture = TestBed.createComponent(FileManagementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
