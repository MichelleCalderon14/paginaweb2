// src/app/shared/inicio.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-inicio',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">

      <!-- Hero principal -->
      <div class="p-4 p-md-5 mb-4 bg-primary text-white rounded-3 shadow-sm">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h1 class="display-6 fw-bold mb-2">
              Bienvenido al Portal de Notas del Colegio
            </h1>
            <p class="lead mb-3">
              Aquí docentes y estudiantes pueden gestionar calificaciones;
              revisar información académica; mantenerse al día con las noticias
              del colegio.
            </p>
            <div class="d-flex flex-wrap gap-2">
              <a class="btn btn-light" routerLink="/login">
                Iniciar sesión
              </a>
              <a class="btn btn-outline-light" routerLink="/docentes">
                Ver docentes
              </a>
              <a class="btn btn-outline-light" routerLink="/noticias">
                Noticias recientes
              </a>
            </div>
          </div>
          <div class="col-md-4 text-center mt-3 mt-md-0">
            <span class="display-1">📚</span>
            <p class="mt-2 mb-0">
              Aprende; consulta; comparte.
            </p>
          </div>
        </div>
      </div>

      <!-- Tarjetas resumen -->
      <div class="row g-3">
        <div class="col-md-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Para docentes 👩‍🏫👨‍🏫</h5>
              <p class="card-text small">
                Registra alumnos; gestiona sus calificaciones; mantén actualizado
                el registro académico de tus cursos.
              </p>
              <a routerLink="/login" class="btn btn-outline-primary btn-sm">
                Entrar como docente
              </a>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Para estudiantes 🎓</h5>
              <p class="card-text small">
                Consulta tus notas; revisa tu promedio; verifica tu estado
                académico de forma rápida y sencilla.
              </p>
              <a routerLink="/login" class="btn btn-outline-success btn-sm">
                Entrar como estudiante
              </a>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Noticias del colegio 📰</h5>
              <p class="card-text small">
                Entérate de eventos; comunicados; actividades importantes
                que se realizan en la institución.
              </p>
              <a routerLink="/noticias" class="btn btn-outline-secondary btn-sm">
                Ver noticias
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class InicioComponent {}
