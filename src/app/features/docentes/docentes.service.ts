import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {
  DocentePerfil,
  FormacionAcademica,
  ExperienciaProfesional,
  Reconocimiento
} from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class DocentesService {
  private base = `${environment.apiBase}/docentes`;

  constructor(private http: HttpClient) {}

  // ===== CRUD principal de Docentes =====
  listar(): Observable<DocentePerfil[]> {
    return this.http.get<DocentePerfil[]>(this.base);
  }

  obtener(id: number): Observable<DocentePerfil> {
    return this.http.get<DocentePerfil>(`${this.base}/${id}`);
  }

  // Alias más explícito para usar en el detalle
  obtenerPorId(id: number): Observable<DocentePerfil> {
    return this.obtener(id);
  }

  create(body: Partial<DocentePerfil>): Observable<DocentePerfil> {
    return this.http.post<DocentePerfil>(this.base, body);
  }

  update(id: number, payload: Partial<DocentePerfil>): Observable<DocentePerfil> {
    return this.http.put<DocentePerfil>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  // ===== Subrecursos: formaciones / experiencias / reconocimientos =====
  formaciones(id: number): Observable<FormacionAcademica[]> {
    return this.http.get<FormacionAcademica[]>(`${this.base}/${id}/formaciones`);
  }

  experiencias(id: number): Observable<ExperienciaProfesional[]> {
    return this.http.get<ExperienciaProfesional[]>(`${this.base}/${id}/experiencias`);
  }

  reconocimientos(id: number): Observable<Reconocimiento[]> {
    return this.http.get<Reconocimiento[]>(`${this.base}/${id}/reconocimientos`);
  }

  addFormacion(idDocente: number, f: Partial<FormacionAcademica>): Observable<FormacionAcademica> {
    return this.http.post<FormacionAcademica>(`${this.base}/${idDocente}/formaciones`, f);
  }

  deleteFormacion(formacionId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/formaciones/${formacionId}`);
  }

  addExperiencia(idDocente: number, x: Partial<ExperienciaProfesional>): Observable<ExperienciaProfesional> {
    return this.http.post<ExperienciaProfesional>(`${this.base}/${idDocente}/experiencias`, x);
  }

  deleteExperiencia(experienciaId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/experiencias/${experienciaId}`);
  }

  addReconocimiento(idDocente: number, r: Partial<Reconocimiento>): Observable<Reconocimiento> {
    return this.http.post<Reconocimiento>(`${this.base}/${idDocente}/reconocimientos`, r);
  }

  deleteReconocimiento(reconocimientoId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/reconocimientos/${reconocimientoId}`);
  }
}
