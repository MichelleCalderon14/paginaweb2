import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AlumnosService } from './alumnos.service';
import { Alumno } from '../../shared/models';
import { AuthService } from '../../shared/auth.service';

@Component({
  standalone: true,
  selector: 'app-docente-alumnos',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="p-4 border rounded-3 shadow-sm">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="h4 mb-0">Mis alumnos</h2>
      <input class="form-control" style="max-width:260px" placeholder="Buscar…"
             [(ngModel)]="filtro">
    </div>

    <div *ngIf="cargando" class="alert alert-info">Cargando alumnos…</div>
    <div *ngIf="error" class="alert alert-danger">No se pudieron cargar los alumnos.</div>

    <div *ngIf="!cargando && !error">
      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Cédula</th>
              <th>Apellidos</th>
              <th>Nombres</th>
              <th>Fecha nac.</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of alumnosFiltrados(); let i = index">
              <td>{{ i + 1 }}</td>
              <td>{{ a.cedula }}</td>
              <td>{{ a.apellidos }}</td>
              <td>{{ a.nombres }}</td>
              <td>{{ a.fecha_nacimiento || '—' }}</td>
              <td>{{ a.email || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!alumnos?.length" class="alert alert-warning mb-0">
        No hay alumnos registrados para este docente.
      </div>
    </div>
  </div>
  `
})
export class DocenteAlumnosPage implements OnInit {
  alumnos: Alumno[] = [];
  cargando = false;
  error = false;
  filtro = '';

  constructor(
    private alumnosSrv: AlumnosService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = this.auth.currentUser;

    // 🔧 Map rápido: “mariacabrera” corresponde al docente con ID 1
    // (cuando tengas endpoint para resolver docId por usuario, lo reemplazamos)
    let idDocente = 0;
    if (usuario?.username?.toLowerCase() === 'mariacabrera') {
      idDocente = 1;
    } else {
      // Si te logueas con otro docente: ajusta aquí el mapeo o pon el real.
      console.warn('Usuario distinto a mariacabrera; ajusta el idDocente aquí.');
      idDocente = 1; // de momento lo dejamos en 1 para probar
    }

    this.cargar(idDocente);
  }

  cargar(idDocente: number) {
    this.cargando = true;
    this.error = false;

    this.alumnosSrv.listarPorDocente(idDocente).subscribe({
      next: (data) => { this.alumnos = data || []; this.cargando = false; },
      error: () => { this.error = true; this.cargando = false; }
    });
  }

  alumnosFiltrados(): Alumno[] {
    const q = this.filtro.trim().toLowerCase();
    if (!q) return this.alumnos;
    return this.alumnos.filter(a =>
      (a.cedula || '').toLowerCase().includes(q) ||
      (a.nombres || '').toLowerCase().includes(q) ||
      (a.apellidos || '').toLowerCase().includes(q) ||
      (a.email || '').toLowerCase().includes(q)
    );
    }
}
