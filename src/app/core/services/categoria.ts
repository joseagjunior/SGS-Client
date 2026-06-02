import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categoria } from '../../models/categoria';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private api = 'http://localhost:8080/categorias';
  constructor(private http: HttpClient) { }
  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.api);
  }
}