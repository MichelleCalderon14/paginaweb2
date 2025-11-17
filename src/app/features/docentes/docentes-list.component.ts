// src/app/features/docentes/docentes-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { DocentesService } from './docentes.service';
import type { DocentePerfil } from '../../shared/models';

@Component({
  standalone: true,
  selector: 'app-docentes-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <h2 class="h4 mb-3">Docentes</h2>

      <div class="row g-3" *ngIf="docentes?.length; else vacio">
        <div class="col-md-6" *ngFor="let d of docentes">
          <div class="card shadow-sm">
            <div class="card-body d-flex gap-3 align-items-start">
              <img
                *ngIf="d.fotografiaUrl"
                [src]="d.fotografiaUrl"
                class="rounded"
                style="width:96px;height:96px;object-fit:cover"
                alt="Foto de {{ d.nombreCompleto }}"
              />
              <div class="flex-grow-1">
                <h3 class="h6 mb-1">{{ d.nombreCompleto }}</h3>

                <p class="mb-1 small text-muted" *ngIf="d.cargo || d.area">
                  {{ d.cargo }}
                  <span *ngIf="d.cargo && d.area">·</span>
                  {{ d.area }}
                </p>

                <p class="mb-2 small" *ngIf="d.aniosExperiencia !== undefined">
                  Años de experiencia:
                  <strong>{{ d.aniosExperiencia }}</strong>
                </p>

                <!-- Botón Ver más que va al detalle -->
                <a
                  class="btn btn-sm btn-outline-primary"
                  [routerLink]="['/docentes', d.id]"
                >
                  Ver más
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ng-template #vacio>
        <div class="alert alert-info mt-3">
          No hay docentes para mostrar.
        </div>
      </ng-template>
    </div>
  `
})
export class DocentesListComponent implements OnInit {

  docentes: DocentePerfil[] = [];

  constructor(private srv: DocentesService) {}

  ngOnInit(): void {
    this.srv.listar().subscribe({
      next: d => this.docentes = d || [],
      error: err => console.error('Error cargando docentes', err)
    });
  }
}
