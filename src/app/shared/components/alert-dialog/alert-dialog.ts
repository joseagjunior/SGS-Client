import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [ CommonModule, MatDialogModule, MatButtonModule ],
  templateUrl: './alert-dialog.html',
})
export class AlertDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { titulo: string, mensagem: string }
  ) { }

  fechar(): void { this.dialogRef.close(false); }
}