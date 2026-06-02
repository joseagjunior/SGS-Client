import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HistoricoSolicitacao, Solicitacao } from '../../models/solicitacao';
import { SolicitacaoService } from '../../core/services/solicitacao';
import { StatusDialogComponent } from '../../shared/components/status-dialog/status-dialog';

@Component({
  selector: 'app-detalhe',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, MatButtonModule,
    MatIconModule, MatCardModule, MatDividerModule, MatDialogModule
  ],
  templateUrl: './detalhe.html',
  styleUrl: './detalhe.scss',
})
export class Detalhe implements OnInit {
  solicitacao?: Solicitacao;
  carregando = true;
  historico: HistoricoSolicitacao[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private solicitacaoService: SolicitacaoService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarDetalhe(id);
  }

  carregarDetalhe(id: number): void {
    this.solicitacaoService.buscarPorId(id).subscribe({
      next: (data) => {
        this.solicitacao = data;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.carregando = false;
        this.router.navigate(['/solicitacoes']);
      }
    });

    this.solicitacaoService.buscarHistorico(id).subscribe(data => {
      this.historico = data;
      this.cdr.markForCheck();
    });
  }

  abrirDialogStatus(): void {
    if (!this.solicitacao) return;
    const ref = this.dialog.open(StatusDialogComponent, {
      width: '400px',
      data: { id: this.solicitacao.id, statusAtual: this.solicitacao.status }
    });

    ref.afterClosed().subscribe(resultado => {
      if (resultado) {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.carregarDetalhe(id);
      }
    });
  }

  voltar(): void { this.router.navigate(['/solicitacoes']); }

  statusFinal(): boolean {
    return this.solicitacao?.status === 'REJEITADO' || this.solicitacao?.status === 'CANCELADO';
  }
}