import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebtitleComponent } from './webtitle.component';

describe('WebtitleComponent', () => {
  let component: WebtitleComponent;
  let fixture: ComponentFixture<WebtitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebtitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebtitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
