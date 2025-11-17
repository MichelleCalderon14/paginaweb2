// src/app/shared/contacto.component.ts
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-contacto',
  template: `
  <h2 class="mb-4">Contacto</h2>

  <div class="row g-4">
    <!-- Información del colegio -->
    <div class="col-md-5">
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <h5 class="card-title mb-3">Información del colegio</h5>

          <p class="mb-1"><strong>Nombre:</strong> Escuela Rafael Aguilar</p>
          <p class="mb-1"><strong>Dirección:</strong> Sector El Vecino, Cuenca</p>
          <p class="mb-1"><strong>Ciudad:</strong> Cuenca - Ecuador</p>
          <p class="mb-1"><strong>Teléfono:</strong> (07) 000 0000</p>
          <p class="mb-3"><strong>Email:</strong> info@colegioejemplo.edu.ec</p>

          <h6>Horarios de atención</h6>
          <p class="mb-1">Lunes a Viernes: 07h00 - 13h00</p>
          <p class="mb-0">Secretaría y atención a representantes.</p>
        </div>
      </div>
    </div>

    <!-- Mapa -->
    <div class="col-md-7">
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <h5 class="card-title mb-3">Ubicación en el mapa</h5>
          <p class="text-muted">Puedes ubicar fácilmente el colegio en el siguiente mapa interactivo.</p>

          <div class="ratio ratio-16x9 border rounded">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3398.469451463008!2d-79.01776819999999!3d-2.8824908000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91cd17ffbf09c4ab%3A0x2473d7062b0bcc5!2sEscuela%20Rafael%20Aguilar!5e1!3m2!1ses!2sec!4v1763051210572!5m2!1ses!2sec"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>

          <p class="small text-muted mt-2">
            Si deseas cambiar la ubicación, abre el colegio en Google Maps →
            <strong>Compartir</strong> → <strong>Insertar un mapa</strong> y reemplaza el valor del <code>src</code>.
          </p>
        </div>
      </div>
    </div>
  </div>
  `
})
export class ContactoComponent {}
