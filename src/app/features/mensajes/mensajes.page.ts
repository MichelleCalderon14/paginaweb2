import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MensajesService, Mensaje } from '../../shared/mensajes.service';

@Component({
  standalone: true,
  selector: 'app-mensajes',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2 class="h4 mb-3">Buzón de mensajes</h2>

      <!-- Formulario -->
      <div class="card mb-3 shadow-sm">
        <div class="card-body">
          <label class="form-label">Escribe tu mensaje para el colegio</label>
          <textarea
            class="form-control mb-2"
            rows="3"
            [(ngModel)]="nuevoTexto"
            placeholder="Ej: Tengo una consulta sobre mis calificaciones..."
          ></textarea>
          <button class="btn btn-primary" (click)="enviar()">
            Enviar mensaje
          </button>
        </div>
      </div>

      <!-- Lista de mensajes enviados desde ESTE navegador -->
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Tus mensajes enviados</h5>
          <div *ngIf="!mensajes.length" class="text-muted small">
            Aún no has enviado mensajes desde este navegador.
          </div>

          <ul class="list-group list-group-flush" *ngIf="mensajes.length">
            <li class="list-group-item" *ngFor="let m of mensajes">
              <div class="small text-muted">
                {{ m.fecha | date:'short' }}
              </div>
              <div>{{ m.texto }}</div>
            </li>
          </ul>
        </div>
      </div>

      <p class="small text-muted mt-2">
        *Estos mensajes se guardan solo en este dispositivo (localStorage);
        son un ejemplo de cómo funcionaría un buzón en producción.
      </p>
    </div>
  `
})
export class MensajesPage implements OnInit {
  mensajes: Mensaje[] = [];
  nuevoTexto = '';

  constructor(private mensajesSrv: MensajesService) {}

  ngOnInit() {
    this.mensajes = this.mensajesSrv.obtenerTodos();
  }

  enviar() {
    const txt = this.nuevoTexto.trim();
    if (!txt) return;

    this.mensajesSrv.agregar(txt);
    this.nuevoTexto = '';
    this.mensajes = this.mensajesSrv.obtenerTodos();
  }
}
