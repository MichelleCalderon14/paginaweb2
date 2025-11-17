// src/app/features/notas/notas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alumno } from '../../shared/models';
import { Evaluacion } from '../evaluaciones/evaluaciones.service';

export interface Nota {
  id_nota: number;
  calificacion: number;
  alumno?: Alumno;
  evaluacion?: Evaluacion;
}

@Injectable({
  providedIn: 'root'
})
export class NotasService {

  // ajusta la URL si tu backend usa otra ruta
  private baseUrl = '/api/notas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Nota[]> {
    return this.http.get<Nota[]>(this.baseUrl);
  }

  actualizar(id_nota: number, body: Partial<Nota>): Observable<Nota> {
    return this.http.put<Nota>(`${this.baseUrl}/${id_nota}`, body);
  }
}
