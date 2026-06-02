import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Solicitante } from '../../models/solicitante';

@Injectable({ providedIn: 'root' })
export class SolicitanteService {
  private api = 'http://localhost:8080/solicitantes';
  constructor(private http: HttpClient) { }
  listar(): Observable<Solicitante[]> {
    return this.http.get<Solicitante[]>(this.api);
  }
}