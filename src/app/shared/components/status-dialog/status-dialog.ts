import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { STATUS_LIST } from '../../../models/solicitacao';
import { SolicitacaoService } from '../../../core/services/solicitacao';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog';

@Component({
  selector: 'app-status-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule,
    MatSelectModule, MatFormFieldModule, FormsModule
  ],
  templateUrl: './status-dialog.html',
})
export class StatusDialogComponent {
  novoStatus: string = '';
  statusList = STATUS_LIST;

  constructor(
    private dialogRef: MatDialogRef<StatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; statusAtual: string },
    private solicitacaoService: SolicitacaoService,
    private dialog: MatDialog
  ) { }

  confirmar(): void {
    if (!this.novoStatus) return;
    this.solicitacaoService.atualizarStatus(this.data.id, this.novoStatus).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        const ref = this.dialog.open(AlertDialogComponent, {
          width: '400px',
          data: { titulo: "Atenção!", mensagem: err.error?.erro || 'Erro ao atualizar status' }
        });
      }
    });
  }

  cancelar(): void { this.dialogRef.close(false); }
}