import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

import { commonTestingModules, commonTestingProviders } from '../common.testing'
import { SimpleDialogComponent } from './simple-dialog.component'

describe('SimpleDialogComponent', () => {
  let component: SimpleDialogComponent
  let fixture: ComponentFixture<SimpleDialogComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        ...commonTestingProviders,
        {
          provide: MAT_DIALOG_DATA,
          useValue: jasmine.createSpyObj('MAT_DIALOG_DATA', ['']),
        },
        {
          provide: MatDialogRef,
          useValue: jasmine.createSpyObj('MatDialogRef', ['']),
        },
      ],
      imports: commonTestingModules,
      declarations: [SimpleDialogComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
