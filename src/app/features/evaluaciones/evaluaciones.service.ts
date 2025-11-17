// src/app/features/evaluaciones/evaluaciones.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Evaluacion {
  id_evaluacion: number;
  nombre: string;
  tipo?: string;
  // agrega más campos si tu API los tiene (fecha, porcentaje, etc.)
}

@Injectable({
  providedIn: 'root'
})
export class EvaluacionesService {

  // ajusta la URL si tu backend usa otra ruta
  private baseUrl = '/api/evaluaciones';

  constructor(private http: HttpClient) {}

  listar(): Observable<Evaluacion[]> {
    return this.http.get<Evaluacion[]>(this.baseUrl);
  }
}
