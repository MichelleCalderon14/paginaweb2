import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoticiasService } from '../../shared/noticias.service';

@Component({
  standalone: true,
  selector: 'app-admin-noticias-create',
  imports: [CommonModule, FormsModule],
  template: `
  <h2 class="h4 mb-3">Crear noticia</h2>
  <div class="card shadow-sm">
    <div class="card-body">
      <div class="mb-2">
        <label class="form-label">Título*</label>
        <input class="form-control" [(ngModel)]="titulo" />
      </div>

      <div class="mb-2">
        <label class="form-label">Texto*</label>
        <textarea class="form-control" rows="4" [(ngModel)]="texto"></textarea>
      </div>

      <div class="mb-2">
        <label class="form-label d-block">Imagen</label>
        <div class="btn-group btn-group-sm mb-2" role="group">
          <button type="button" class="btn"
                  [class.btn-primary]="imageMode==='url'"
                  [class.btn-outline-primary]="imageMode!=='url'"
                  (click)="imageMode='url'">URL</button>
          <button type="button" class="btn"
                  [class.btn-primary]="imageMode==='file'"
                  [class.btn-outline-primary]="imageMode!=='file'"
                  (click)="imageMode='file'">Archivo</button>
        </div>

        <!-- URL -->
        <input *ngIf="imageMode==='url'" class="form-control" placeholder="https://sitio.com/imagen.jpg"
               [(ngModel)]="imagenUrl" />

        <!-- Archivo -->
        <input *ngIf="imageMode==='file'" type="file" (change)="onFile($event)" class="form-control" />

        <!-- Preview -->
        <div class="mt-2" *ngIf="preview() as p">
          <img [src]="p" class="rounded border" style="width:160px;height:120px;object-fit:cover" />
        </div>
      </div>

      <div class="mb-2">
        <label class="form-label">Fecha</label>
        <input type="date" class="form-control" [(ngModel)]="fecha" />
      </div>

      <div class="d-grid">
        <button class="btn btn-success" (click)="crear()">Crear noticia</button>
      </div>
    </div>
  </div>
  `
})
export class AdminNoticiasCreatePage {
  titulo = ''; texto = ''; fecha = '';
  imageMode: 'url' | 'file' = 'url';
  imagenUrl = ''; imagenB64 = '';

  constructor(private srv: NoticiasService) {}

  onFile(ev: Event) {
    const f = (ev.target as HTMLInputElement).files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => this.imagenB64 = r.result as string;
    r.readAsDataURL(f);
  }

  preview() {
    return this.imageMode === 'url' ? (this.imagenUrl?.trim() || null) : (this.imagenB64 || null);
  }

  crear() {
    if (!this.titulo.trim() || !this.texto.trim()) { alert('Falta título o texto'); return; }
    const imagen = this.imageMode === 'url'
      ? (this.imagenUrl?.trim() || undefined)
      : (this.imagenB64 || undefined);

    this.srv.crear({
      titulo: this.titulo.trim(),
      texto: this.texto.trim(),
      fecha: this.fecha || undefined,  // yyyy-MM-dd
      imagen
    }).subscribe({
      next: () => {
        alert('Noticia creada ✔');
        this.titulo = ''; this.texto = ''; this.fecha = '';
        this.imagenUrl = ''; this.imagenB64 = '';
        this.imageMode = 'url';
      },
      error: err => { console.error(err); alert('No se pudo crear la noticia'); }
    });
  }
}
