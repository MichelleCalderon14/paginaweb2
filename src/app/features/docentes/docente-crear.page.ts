// src/app/features/docentes/docente-crear.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AlumnosService } from '../alumnos/alumnos.service';
import { AuthService } from '../../shared/auth.service';
import { Alumno } from '../../shared/models';

@Component({
  standalone: true,
  selector: 'app-docente-crear',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 border rounded-3 shadow-sm">
      <h2 class="h4 mb-3">Crear alumno</h2>

      <form (ngSubmit)="guardar()">
        <div class="mb-2">
          <label class="form-label">Cédula*</label>
          <input class="form-control"
                 [(ngModel)]="form.cedula"
                 name="cedula"
                 required>
        </div>

        <div class="mb-2 row">
          <div class="col-md-6">
            <label class="form-label">Nombres*</label>
            <input class="form-control"
                   [(ngModel)]="form.nombres"
                   name="nombres"
                   required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Apellidos*</label>
            <input class="form-control"
                   [(ngModel)]="form.apellidos"
                   name="apellidos"
                   required>
          </div>
        </div>

        <div class="mb-2 row">
          <div class="col-md-6">
            <label class="form-label">Fecha de nacimiento</label>
            <input type="date"
                   class="form-control"
                   [(ngModel)]="form.fecha_nacimiento"
                   name="fecha_nacimiento">
          </div>
          <div class="col-md-6">
            <label class="form-label">Email</label>
            <input type="email"
                   class="form-control"
                   [(ngModel)]="form.email"
                   name="email">
          </div>
        </div>

        <div class="d-flex gap-2 mt-3">
          <button class="btn btn-success" type="submit">Guardar alumno</button>
          <button class="btn btn-outline-secondary" type="button" (click)="volver()">Volver</button>
        </div>
      </form>
    </div>
  `
})
export class DocenteCrearPage {
  // usamos Partial para que todo sea opcional mientras escribes
  form: Partial<Alumno> = {
    cedula: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    email: ''
  };

  constructor(
    private alumnosSrv: AlumnosService,
    private auth: AuthService,
    private router: Router
  ) {}

  /** 🔹 Por ahora mapeamos usuario → idDocente “a mano” */
  private getDocenteId(): number {
    const usuario = this.auth.currentUser;
    const userName = usuario?.username?.toLowerCase() || '';

    if (userName === 'mariacabrera') {
      return 1;
    }
    // aquí luego podrás mapear otros usuarios a otros docentes
    console.warn('getDocenteId: usuario distinto a mariacabrera, usando id_docente=1 por ahora');
    return 1;
  }

  guardar() {
    if (!this.form.cedula?.trim() ||
        !this.form.nombres?.trim() ||
        !this.form.apellidos?.trim()) {
      alert('Cédula, nombres y apellidos son obligatorios');
      return;
    }

    const idDocente = this.getDocenteId();

    const payload: Partial<Alumno> = {
      cedula: this.form.cedula!.trim(),
      nombres: this.form.nombres!.trim(),
      apellidos: this.form.apellidos!.trim(),
      fecha_nacimiento: this.form.fecha_nacimiento || undefined,
      email: this.form.email?.trim() || undefined
    };

    this.alumnosSrv.crearParaDocente(idDocente, payload).subscribe({
      next: (resp: Alumno) => {
        console.log('Alumno creado', resp);
        alert('Alumno creado correctamente ✔');
        // después de crear, te llevo a la lista de alumnos
        this.router.navigate(['/docente/alumnos']);
      },
      error: (err: any) => {
        console.error('[DocenteCrearPage] error al crear alumno', err);
        alert('❌ No se pudo crear el alumno. Revisa que el backend esté levantado.');
      }
    });
  }

  volver() {
    this.router.navigate(['/panel-docente']);
  }
}
