import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-simple-dialog',
  templateUrl: './simple-dialog.component.html',
})
export class SimpleDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SimpleDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
}
