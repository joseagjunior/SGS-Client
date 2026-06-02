import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { Categoria } from '../../models/categoria';
import { Solicitante } from '../../models/solicitante';
import { SolicitacaoService } from '../../core/services/solicitacao';
import { CategoriaService } from '../../core/services/categoria';
import { SolicitanteService } from '../../core/services/solicitante';
import { MatCardModule } from '@angular/material/card';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatButtonModule, MatSelectModule, MatInputModule,
    MatFormFieldModule, MatIconModule, MatSnackBarModule,
    MatCardModule, NgxMaskDirective
],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.scss',
})
export class Cadastro implements OnInit {
  form: FormGroup;
  categorias: Categoria[] = [];
  solicitantes: Solicitante[] = [];
  salvando = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private solicitacaoService: SolicitacaoService,
    private categoriaService: CategoriaService,
    private solicitanteService: SolicitanteService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      solicitanteId: [null, Validators.required],
      categoriaId: [null, Validators.required],
      descricao: [''],
      valor: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.categoriaService.listar().subscribe(data => this.categorias = data);
    this.solicitanteService.listar().subscribe(data => this.solicitantes = data);
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.solicitacaoService.cadastrar(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Solicitação cadastrada com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/solicitacoes']);
      },
      error: (err) => {
        this.snackBar.open(err.error?.erro || 'Erro ao cadastrar solicitação.', 'Fechar', { duration: 4000 });
        this.salvando = false;
      }
    });
  }

  cancelar(): void { this.router.navigate(['/solicitacoes']); }
}