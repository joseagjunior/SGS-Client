import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HistoricoSolicitacao, Solicitacao, SolicitacaoListagem } from '../../models/solicitacao';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SolicitacaoService {
  private api = 'http://localhost:8080/solicitacoes';
  constructor(private http: HttpClient) { }

  listar(filtros?: any): Observable<SolicitacaoListagem[]> {
    let params = new HttpParams();
    if (filtros?.status) params = params.set('status', filtros.status);
    if (filtros?.categoriaId) params = params.set('categoriaId', filtros.categoriaId);
    if (filtros?.dataInicio) params = params.set('dataInicio', filtros.dataInicio);
    if (filtros?.dataFim) params = params.set('dataFim', filtros.dataFim);
    return this.http.get<SolicitacaoListagem[]>(this.api, { params });
  }

  buscarPorId(id: number): Observable<Solicitacao> {
    return this.http.get<Solicitacao>(`${this.api}/${id}`);
  }

  cadastrar(solicitacao: Solicitacao): Observable<Solicitacao> {
    return this.http.post<Solicitacao>(this.api, solicitacao);
  }

  atualizarStatus(id: number, status: string): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.api}/${id}/status`, { status });
  }

  buscarHistorico(id: number): Observable<HistoricoSolicitacao[]> {
    return this.http.get<HistoricoSolicitacao[]>(`${this.api}/${id}/historico`);
  }
}