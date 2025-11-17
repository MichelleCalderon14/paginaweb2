// src/app/features/docentes/docente-home.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  standalone: true,
  selector: 'app-docente-home',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-4 border rounded-3 shadow-sm">

      <!-- 🔹 Título + botón salir -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h4 mb-0">Panel del Docente</h2>

        <button class="btn btn-outline-danger btn-sm" (click)="logout()">
          Cerrar sesión
        </button>
      </div>

      <!-- Botones del panel -->
      <div class="d-flex gap-2 flex-wrap">
        <button class="btn btn-primary" routerLink="/docente/crear">
          Crear alumno
        </button>

        <button class="btn btn-outline-primary" routerLink="/docente/alumnos">
          Ver alumnos
        </button>

        <button class="btn btn-warning" routerLink="/docente/calificaciones">
          Registro Calificaciones
        </button>
      </div>

      <p class="text-muted mt-3 mb-0">
        Aquí podrás gestionar tus alumnos y sus calificaciones.
      </p>
    </div>
  `
})
export class DocenteHomeComponent {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  logout() {
    this.auth.logout();          // borra el usuario del localStorage
    this.router.navigate(['/login']);   // te lleva al login
  }
}
