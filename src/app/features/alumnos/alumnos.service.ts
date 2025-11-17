// src/app/features/alumnos/alumnos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Alumno } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {

  private base = `${environment.apiBase}/alumnos`;

  constructor(private http: HttpClient) {}

  /** 🔹 Listar alumnos de un docente */
  listarPorDocente(idDocente: number): Observable<Alumno[]> {
    const url = `${this.base}/docentes/${idDocente}/alumnos`;
    console.log('[AlumnosService] GET', url);
    return this.http.get<Alumno[]>(url);
  }

  /** 🔹 Crear alumno para un docente */
  crearParaDocente(idDocente: number, body: Partial<Alumno>): Observable<Alumno> {
    const url = `${this.base}/docentes/${idDocente}/alumnos`;
    console.log('[AlumnosService] POST', url, body);
    return this.http.post<Alumno>(url, body);
  }
}
