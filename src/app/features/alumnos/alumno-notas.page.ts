// src/app/features/alumnos/alumno-notas.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';   // 👈 NUEVO

type RegistroAlumno = {
  id_alumno: number;
  nombre: string;
  tareas: string[];
  notas: (number | null)[];
  promedio: number | null;
  estado: string;
};

type RegistroStorage = {
  [idAlumno: string]: RegistroAlumno;
};

const STORAGE_KEY = 'colegio.calificaciones';

@Component({
  standalone: true,
  selector: 'app-alumno-notas',
  imports: [CommonModule],
  template: `
  <div class="container mt-4">

    <!-- 🔹 Título + botón Cerrar sesión -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-0">Mis calificaciones</h2>
      <button class="btn btn-outline-danger btn-sm" (click)="logout()">
        Cerrar sesión
      </button>
    </div>

    <ng-container *ngIf="!sinDatos; else sinNotas">

      <p class="mb-3">
        Alumno: <strong>{{ registro?.nombre }}</strong>
      </p>

      <table class="table table-bordered text-center">
        <thead class="table-primary">
          <tr>
            <th>Tarea</th>
            <th>Nota</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let t of registro?.tareas; let i = index">
            <td class="text-start">{{ t }}</td>
            <td>
              {{ registro?.notas[i] !== null && registro?.notas[i] !== undefined
                  ? registro?.notas[i]
                  : '—' }}
            </td>
          </tr>
          <tr class="table-light">
            <td class="text-end fw-bold">Promedio</td>
            <td>{{ registro?.promedio !== null ? registro?.promedio : '—' }}</td>
          </tr>
          <tr class="table-light">
            <td class="text-end fw-bold">Estado</td>
            <td [ngClass]="registro?.estado === 'Aprueba'
                            ? 'text-success fw-bold'
                            : (registro?.estado === 'Reprueba'
                                ? 'text-danger fw-bold'
                                : '')">
              {{ registro?.estado || '—' }}
            </td>
          </tr>
        </tbody>
      </table>

      <p class="text-muted small mt-2">
        * Estos datos se leen del registro de calificaciones del sistema, actualizado por el docente.
      </p>

    </ng-container>

    <ng-template #sinNotas>
      <div class="alert alert-warning">
        No se encontraron calificaciones para este alumno.
      </div>
    </ng-template>
  </div>
  `
})
export class AlumnoNotasPage implements OnInit {
  registro: RegistroAlumno | null = null;
  sinDatos = false;

  constructor(
    private auth: AuthService,
    private router: Router          // 👈 NUEVO
  ) {}

  ngOnInit(): void {
    const idAlumno = this.getAlumnoIdActual();
    if (!idAlumno) {
      console.warn('AlumnoNotas: no se pudo determinar el id_alumno del usuario');
      this.sinDatos = true;
      return;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.sinDatos = true;
      return;
    }

    let data: RegistroStorage;
    try {
      data = JSON.parse(raw) as RegistroStorage;
    } catch {
      console.error('AlumnoNotas: error parseando localStorage');
      this.sinDatos = true;
      return;
    }

    const reg = data[String(idAlumno)];
    if (!reg) {
      this.sinDatos = true;
      return;
    }

    this.registro = reg;
    this.sinDatos = false;
  }

  /** 🔹 Botón Cerrar sesión */
  logout() {
    this.auth.logout();          // borra el usuario del localStorage
    this.router.navigate(['/login']);  // te manda a la pantalla de login
  }

  /** Mapea usuario (login) → id_alumno real de la tabla alumno */
  private getAlumnoIdActual(): number | null {
    const user = this.auth.currentUser;
    const u = (user?.username || '').toLowerCase().replace(/\s+/g, '');

    if (u === 'pepecabrera')     return 21; // Cabrera Pepe
    if (u === 'sofiagarcia')     return 22; // García Sofía
    if (u === 'mateolopez')      return 23; // Lopez Mateo
    if (u === 'valentinaperez')  return 24; // Perez Valentina
    if (u === 'sebastiantorres') return 25; // Torres Sebastián
    if (u === 'camilarojas')     return 26; // Rojas Camila
    if (u === 'janettarmijos')   return 28; // Armijos Leon Janett Cecilia

    return null;
  }
}
