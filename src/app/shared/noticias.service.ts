import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Noticia } from './models';

@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private base = `${environment.apiBase}/noticias`;
  constructor(private http: HttpClient) {}

  listar(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(this.base);
  }

  crear(n: Partial<Noticia>): Observable<Noticia> {
    return this.http.post<Noticia>(this.base, n);
  }

  actualizar(id: number, n: Partial<Noticia>): Observable<Noticia> {
    return this.http.put<Noticia>(`${this.base}/${id}`, n);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
