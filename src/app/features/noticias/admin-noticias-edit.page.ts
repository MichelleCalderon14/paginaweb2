import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoticiasService } from '../../shared/noticias.service';
import { Noticia } from '../../shared/models';

@Component({
  standalone: true,
  selector: 'app-admin-noticias-edit',
  imports: [CommonModule, FormsModule],
  template: `
  <h2 class="h4 mb-3">Editar noticias</h2>

  <div class="row g-3" *ngIf="noticias?.length; else vacio">
    <div class="col-md-6 col-lg-4" *ngFor="let n of noticias">
      <div class="card shadow-sm h-100">
        <img *ngIf="n.imagen" [src]="n.imagen" class="card-img-top" alt="">
        <div class="card-body">
          <div class="mb-2">
            <label class="form-label">Título</label>
            <input class="form-control" [(ngModel)]="n.titulo">
          </div>

          <div class="mb-2">
            <label class="form-label">Texto</label>
            <textarea class="form-control" rows="3" [(ngModel)]="n.texto"></textarea>
          </div>

          <div class="mb-2">
            <label class="form-label">Fecha</label>
            <input type="date" class="form-control" [(ngModel)]="n.fecha">
          </div>

          <div class="mb-2">
            <label class="form-label d-block">Cambiar imagen</label>

            <!-- URL directa -->
            <input class="form-control mb-2"
                   placeholder="URL de imagen (opcional)"
                   [(ngModel)]="n.imagen">

            <div class="text-center my-2">— o —</div>

            <!-- Archivo -> base64 -->
            <input type="file" (change)="onFile($event, n)" class="form-control">
          </div>

          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-success" (click)="guardar(n)">Guardar</button>
            <button class="btn btn-sm btn-outline-danger" (click)="borrar(n)">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ng-template #vacio>
    <div class="alert alert-info">No hay noticias cargadas.</div>
  </ng-template>
  `
})
export class AdminNoticiasEditPage implements OnInit {
  noticias: Noticia[] = [];

  constructor(private srv: NoticiasService){}

  ngOnInit(){
    this.srv.listar().subscribe(d => this.noticias = d || []);
  }

  onFile(ev: Event, n: Noticia){
    const f = (ev.target as HTMLInputElement).files?.[0]; if(!f) return;
    const r = new FileReader();
    r.onload = () => n.imagen = r.result as string; // base64
    r.readAsDataURL(f);
  }

  guardar(n: Noticia){
  const payload: Partial<Noticia> = {
    titulo: n.titulo?.trim(),
    texto: n.texto?.trim(),
    fecha: n.fecha || undefined,   // yyyy-MM-dd o undefined
    imagen: n.imagen || undefined  // URL/base64 o undefined
  };
  this.srv.actualizar(n.id, payload).subscribe({
    next: () => alert('Noticia actualizada ✔'),
    error: err => { console.error(err); alert('No se pudo actualizar la noticia'); }
  });
}

  borrar(n: Noticia){
    if(!confirm(`¿Eliminar "${n.titulo}"?`)) return;
    this.srv.eliminar(n.id).subscribe({
      next: () => this.noticias = this.noticias.filter(x => x.id !== n.id),
      error: err => { console.error(err); alert('No se pudo eliminar la noticia'); }
    });
  }
}
