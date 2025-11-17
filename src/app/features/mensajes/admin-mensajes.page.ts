// src/app/features/mensajes/admin-mensajes.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MensajesService, Mensaje } from '../../shared/mensajes.service';

@Component({
  standalone: true,
  selector: 'app-admin-mensajes',
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2 class="h4 mb-3">Mensajes de usuarios</h2>

      <div class="d-flex justify-content-between align-items-center mb-3">
        <p class="mb-0 text-muted">
          Aquí se muestran los mensajes que los usuarios han enviado
          desde la sección de sugerencias.
        </p>
        <button
          class="btn btn-sm btn-outline-secondary"
          type="button"
          (click)="marcarTodosLeidos()"
          [disabled]="!hayPendientes()">
          Marcar todos como leídos
        </button>
      </div>

      <div *ngIf="!mensajes.length" class="alert alert-info">
        No hay mensajes registrados.
      </div>

      <div class="row g-3" *ngIf="mensajes.length">
        <div class="col-md-6" *ngFor="let m of mensajes">
          <div class="card shadow-sm h-100">
            <div class="card-body d-flex flex-column">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <span class="badge"
                      [ngClass]="m.leido ? 'bg-secondary' : 'bg-success'">
                  {{ m.leido ? 'Leído' : 'Nuevo' }}
                </span>
                <small class="text-muted">
                  {{ m.fecha | date:'short' }}
                </small>
              </div>

              <p class="mb-3" style="white-space: pre-line;">
                {{ m.texto }}
              </p>

              <div class="mt-auto d-flex gap-2">
                <button
                  class="btn btn-sm btn-outline-success"
                  type="button"
                  (click)="marcarLeido(m)"
                  [disabled]="m.leido">
                  Marcar como leído
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  type="button"
                  (click)="eliminar(m)">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminMensajesPage implements OnInit {
  mensajes: Mensaje[] = [];

  constructor(private mensajesSrv: MensajesService) {}

  ngOnInit(): void {
    // Al entrar, cargamos y marcamos como leídos
    this.cargar();
    this.mensajesSrv.marcarTodosLeidos();
    this.cargar();
  }

  private cargar() {
    this.mensajes = this.mensajesSrv.obtenerTodos();
  }

  hayPendientes(): boolean {
    return this.mensajes.some(m => !m.leido);
  }

  marcarLeido(m: Mensaje) {
    this.mensajesSrv.marcarLeido(m.id);
    this.cargar();
  }

  eliminar(m: Mensaje) {
    if (!confirm('¿Eliminar este mensaje?')) return;
    this.mensajesSrv.eliminar(m.id);
    this.cargar();
  }
}
