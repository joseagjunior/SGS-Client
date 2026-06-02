import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { SolicitacaoListagem, STATUS_LIST } from '../../models/solicitacao';
import { Categoria } from '../../models/categoria';
import { CategoriaService } from '../../core/services/categoria';
import { SolicitacaoService } from '../../core/services/solicitacao';
import { StatusDialogComponent } from '../../shared/components/status-dialog/status-dialog';

@Component({
  selector: 'app-listagem',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatSelectModule,
    MatInputModule, MatFormFieldModule, MatDatepickerModule,
    MatNativeDateModule, MatIconModule, MatDialogModule, MatChipsModule
  ],
  templateUrl: './listagem.html',
  styleUrl: './listagem.scss',
})
export class Listagem implements OnInit {
  solicitacoes: SolicitacaoListagem[] = [];
  categorias: Categoria[] = [];
  statusList = STATUS_LIST;
  filtroForm: FormGroup;

  colunas = ['id', 'solicitanteNome', 'categoriaNome', 'valor', 'dataSolicitacao', 'status', 'acoes'];

  constructor(
    private solicitacaoService: SolicitacaoService,
    private categoriaService: CategoriaService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.filtroForm = this.fb.group({
      status: [null],
      categoriaId: [null],
      dataInicio: [null],
      dataFim: [null]
    });
  }
  
  ngOnInit(): void {
    this.carregarCategorias();
    setTimeout(() => this.listar());
  }

  carregarCategorias(): void {
    this.categoriaService.listar().subscribe(data => {
      this.categorias = data;
      this.cdr.markForCheck();
    });
  }

  listar(): void {
    const raw = this.filtroForm.value;
    const filtros: any = {};

    if (raw.status) filtros.status = raw.status;
    if (raw.categoriaId) filtros.categoriaId = raw.categoriaId;
    if (raw.dataInicio) filtros.dataInicio = this.formatarData(raw.dataInicio);
    if (raw.dataFim) filtros.dataFim = this.formatarData(raw.dataFim);

    this.solicitacaoService.listar(filtros).subscribe(data => {
      this.solicitacoes = data;
      this.cdr.markForCheck();
    });
  }

  limparFiltros(): void {
    this.filtroForm.reset();
    this.listar();
  }

  abrirDialogStatus(solicitacao: SolicitacaoListagem): void {
    const ref = this.dialog.open(StatusDialogComponent, {
      width: '400px',
      data: { id: solicitacao.id, statusAtual: solicitacao.status }
    });

    ref.afterClosed().subscribe(resultado => { if (resultado) this.listar(); });
  }

  formatarData(data: Date): string {
    const d = new Date(data);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  corStatus(status: string): string {
    const cores: any = {
      'SOLICITADO': 'primary',
      'LIBERADO': 'accent',
      'APROVADO': 'warn',
      'REJEITADO': '',
      'CANCELADO': ''
    };
    return cores[status] || '';
  }
}