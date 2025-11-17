import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticiasService } from '../../shared/noticias.service';
import { Noticia } from '../../shared/models';

@Component({
  standalone: true,
  selector: 'app-admin-noticias-delete',
  imports: [CommonModule],
  template: `
  <h2 class="h4 mb-3">Borrar noticias</h2>
  <div *ngIf="!noticias?.length" class="alert alert-info">No hay noticias cargadas.</div>
  <div class="row g-3" *ngIf="noticias?.length">
    <div class="col-md-6 col-lg-4" *ngFor="let n of noticias">
      <div class="card shadow-sm h-100">
        <img *ngIf="n.imagen" [src]="n.imagen" class="card-img-top">
        <div class="card-body d-flex flex-column">
          <h5 class="h6 mb-1">{{ n.titulo }}</h5>
          <p class="text-muted small mb-2" *ngIf="n.fecha">{{ n.fecha | date:'mediumDate' }}</p>
          <button class="btn btn-sm btn-outline-danger mt-auto" (click)="eliminar(n)">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
  `
})
export class AdminNoticiasDeletePage implements OnInit {
  noticias: Noticia[] = [];
  constructor(private srv: NoticiasService) {}
  ngOnInit(){ this.srv.listar().subscribe(d => this.noticias = d || []); }
  eliminar(n: Noticia){
    if(!confirm(`¿Eliminar "${n.titulo}"?`)) return;
    this.srv.eliminar(n.id).subscribe(()=> this.noticias = this.noticias.filter(x => x.id !== n.id));
  }
}
