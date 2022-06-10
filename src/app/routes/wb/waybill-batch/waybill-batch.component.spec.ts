import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillBatchComponent } from './waybill-batch.component';

describe('WaybillBatchComponent', () => {
  let component: WaybillBatchComponent;
  let fixture: ComponentFixture<WaybillBatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaybillBatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
