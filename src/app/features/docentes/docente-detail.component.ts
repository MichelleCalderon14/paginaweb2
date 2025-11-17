// src/app/features/docentes/docente-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { DocentesService } from './docentes.service';
import {
  DocentePerfil,
  FormacionAcademica,
  ExperienciaProfesional,
  Reconocimiento
} from '../../shared/models';

@Component({
  standalone: true,
  selector: 'app-docente-detail',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4" *ngIf="!cargando && docente; else loadingTpl">
      <button
        class="btn btn-link p-0 mb-3"
        routerLink="/docentes"
      >
        ⬅ Volver a docentes
      </button>

      <div class="card shadow-sm">
        <div class="card-body">
          <div class="row">
            <!-- Foto -->
            <div class="col-md-3 text-center mb-3">
              <img
                class="img-fluid rounded mb-2"
                [src]="docente.fotografiaUrl || 'assets/img/docente-placeholder.jpg'"
                alt="Foto de {{ docente.nombreCompleto }}"
                style="max-height: 220px; object-fit: cover;"
              />
            </div>

            <!-- Datos generales -->
            <div class="col-md-9">
              <h3 class="mb-1">{{ docente.nombreCompleto }}</h3>

              <p class="mb-1" *ngIf="docente.cargo || docente.area">
                <strong *ngIf="docente.cargo">{{ docente.cargo }}</strong>
                <span *ngIf="docente.cargo && docente.area">·</span>
                <span *ngIf="docente.area">{{ docente.area }}</span>
              </p>

              <p class="mb-1" *ngIf="docente.aniosExperiencia !== undefined && docente.aniosExperiencia !== null">
                Años de experiencia:
                <strong>{{ docente.aniosExperiencia }}</strong>
              </p>

              <p class="mt-2" *ngIf="docente.bio">
                {{ docente.bio }}
              </p>
            </div>
          </div>

          <hr>

          <!-- Formación académica -->
          <div *ngIf="formaciones?.length">
            <h5>Formación académica</h5>
            <ul class="mb-3">
              <li *ngFor="let f of formaciones">
                <strong>{{ f.titulo }}</strong>
                <span *ngIf="f.nivel" class="text-muted"> — {{ f.nivel }}</span>
                <div class="small text-muted">
                  {{ f.institucion || 'Institución no especificada' }}
                  <span *ngIf="f.anio"> · {{ f.anio }}</span>
                </div>
              </li>
            </ul>
          </div>

          <!-- Experiencia profesional -->
          <div *ngIf="experiencias?.length">
            <h5>Experiencia profesional</h5>
            <ul class="mb-3">
              <li *ngFor="let e of experiencias">
                <strong>{{ e.institucion }}</strong>
                <span *ngIf="e.rol"> — {{ e.rol }}</span>
                <div class="small text-muted">
                  <ng-container *ngIf="e.desde">
                    Desde: {{ e.desde }}
                  </ng-container>
                  <ng-container *ngIf="e.hasta">
                    · Hasta: {{ e.hasta }}
                  </ng-container>
                  <ng-container *ngIf="!e.desde && !e.hasta">
                    (sin fechas registradas)
                  </ng-container>
                </div>
                <div class="small" *ngIf="e.descripcion">
                  {{ e.descripcion }}
                </div>
              </li>
            </ul>
          </div>

          <!-- Reconocimientos -->
          <div *ngIf="reconocimientos?.length">
            <h5>Reconocimientos</h5>
            <ul class="mb-0">
              <li *ngFor="let r of reconocimientos">
                <strong>{{ r.nombre }}</strong>
                <div class="small text-muted">
                  {{ r.otorgante || 'Otorgante no especificado' }}
                  <span *ngIf="r.anio"> · {{ r.anio }}</span>
                </div>
                <div class="small" *ngIf="r.descripcion">
                  {{ r.descripcion }}
                </div>
              </li>
            </ul>
          </div>

          <!-- Por si no tiene info -->
          <div
            *ngIf="!formaciones?.length && !experiencias?.length && !reconocimientos?.length"
            class="mt-3"
          >
            <p class="text-muted mb-0">
              Este docente aún no tiene registrada información de formación, experiencia ni reconocimientos.
            </p>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loadingTpl>
      <div class="container mt-4">
        <div *ngIf="cargando">Cargando información del docente…</div>
        <div *ngIf="error" class="alert alert-danger mt-3">
          No se pudo cargar la información del docente.
        </div>
      </div>
    </ng-template>
  `
})
export class DocenteDetailComponent implements OnInit {
  docente!: DocentePerfil;

  formaciones: FormacionAcademica[] = [];
  experiencias: ExperienciaProfesional[] = [];
  reconocimientos: Reconocimiento[] = [];

  cargando = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private docentesService: DocentesService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      console.error('ID de docente no válido en la URL');
      this.error = true;
      this.cargando = false;
      return;
    }

    // 1) Traemos el perfil del docente
    this.docentesService.obtenerPorId(id).subscribe({
      next: d => {
        this.docente = d;

        // 2) En paralelo, sus formaciones, experiencias y reconocimientos
        this.docentesService.formaciones(id).subscribe(fs => this.formaciones = fs || []);
        this.docentesService.experiencias(id).subscribe(es => this.experiencias = es || []);
        this.docentesService.reconocimientos(id).subscribe(rs => this.reconocimientos = rs || []);

        this.cargando = false;
      },
      error: err => {
        console.error('Error cargando docente', err);
        this.error = true;
        this.cargando = false;
      }
    });
  }
}
