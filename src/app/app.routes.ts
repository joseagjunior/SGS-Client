import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'solicitacoes', pathMatch: 'full' },
    { path: 'solicitacoes', loadComponent: () => import('./pages/listagem/listagem').then(m => m.Listagem) },
    { path: 'solicitacoes/nova', loadComponent: () => import('./pages/cadastro/cadastro').then(m => m.Cadastro) },
    { path: 'solicitacoes/:id', loadComponent: () => import('./pages/detalhe/detalhe').then(m => m.Detalhe) },
];