// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

type FontSizeOption = 'small' | 'normal' | 'large' | 'xlarge';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div [ngClass]="appClasses" class="app-root-wrapper">

      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
          <a class="navbar-brand" routerLink="/inicio">Colegio</a>

          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="mainNavbar">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLink="/inicio"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: true }"
                >
                  Inicio
                </a>
              </li>

              <li class="nav-item">
                <a class="nav-link" routerLink="/docentes" routerLinkActive="active">
                  Docentes
                </a>
              </li>

              <li class="nav-item">
                <a class="nav-link" routerLink="/noticias" routerLinkActive="active">
                  Noticias
                </a>
              </li>

              <!-- ⭐ NUEVA PESTAÑA MENSAJES -->
              <li class="nav-item">
                <a class="nav-link" routerLink="/mensajes" routerLinkActive="active">
                  Mensajes
                </a>
              </li>

              <li class="nav-item">
                <a class="nav-link" routerLink="/contacto" routerLinkActive="active">
                  Contacto
                </a>
              </li>
            </ul>

            <!-- CONTROLES DE ACCESIBILIDAD -->
            <div class="d-flex align-items-center gap-2 me-3">
              <!-- Tamaño de letra -->
              <button
                class="btn btn-sm btn-light"
                type="button"
                (click)="changeFontSize(-1)"
                title="Disminuir tamaño de letra"
              >
                A-
              </button>
              <button
                class="btn btn-sm btn-light"
                type="button"
                (click)="resetFontSize()"
                title="Restablecer tamaño"
              >
                A
              </button>
              <button
                class="btn btn-sm btn-light"
                type="button"
                (click)="changeFontSize(1)"
                title="Aumentar tamaño de letra"
              >
                A+
              </button>

              <!-- Letra más legible -->
              <button
                class="btn btn-sm btn-outline-light"
                type="button"
                (click)="toggleReadableFont()"
                [class.active]="readableFont"
                title="Fuente más legible"
              >
                🅰️
              </button>

              <!-- Modo oscuro -->
              <button
                class="btn btn-sm btn-outline-light"
                type="button"
                (click)="toggleDarkMode()"
                [class.active]="darkMode"
                title="Modo oscuro"
              >
                🌙
              </button>

              <!-- Modo alto contraste / daltonismo -->
              <button
                class="btn btn-sm btn-outline-warning"
                type="button"
                (click)="toggleColorBlindMode()"
                [class.active]="colorBlindMode"
                title="Modo alto contraste"
              >
                👁️
              </button>
            </div>

            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" routerLink="/login" routerLinkActive="active">
                  Login
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main class="py-4">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {

  // estado de accesibilidad
  fontSize: FontSizeOption = 'normal';
  darkMode = false;
  colorBlindMode = false;
  readableFont = false;

  private fontSizes: FontSizeOption[] = ['small', 'normal', 'large', 'xlarge'];

  get appClasses(): string[] {
    const classes = [`font-size-${this.fontSize}`];

    if (this.darkMode) {
      classes.push('theme-dark');
    }

    if (this.colorBlindMode) {
      classes.push('theme-colorblind');
    }

    if (this.readableFont) {
      classes.push('readable-font');
    }

    return classes;
  }

  changeFontSize(delta: number): void {
    const currentIndex = this.fontSizes.indexOf(this.fontSize);
    let newIndex = currentIndex + delta;

    if (newIndex < 0) newIndex = 0;
    if (newIndex > this.fontSizes.length - 1) newIndex = this.fontSizes.length - 1;

    this.fontSize = this.fontSizes[newIndex];
  }

  resetFontSize(): void {
    this.fontSize = 'normal';
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
  }

  toggleColorBlindMode(): void {
    this.colorBlindMode = !this.colorBlindMode;
  }

  toggleReadableFont(): void {
    this.readableFont = !this.readableFont;
  }
}
