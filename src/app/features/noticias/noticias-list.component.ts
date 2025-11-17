import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticiasService } from '../../shared/noticias.service';
import { Noticia } from '../../shared/models';

@Component({
  standalone: true,
  selector: 'app-noticias-list',
  imports: [CommonModule],
  template: `
  <h2 class="h4 mb-3">Noticias</h2>
  <div class="row g-3" *ngIf="noticias?.length; else vacio">
    <div class="col-md-6 col-lg-4" *ngFor="let n of noticias">
      <div class="card h-100 shadow-sm">
        <img *ngIf="n.imagen" [src]="n.imagen" class="card-img-top" alt="">
        <div class="card-body d-flex flex-column">
          <h3 class="h6">{{ n.titulo }}</h3>
          <p class="text-muted small mb-2" *ngIf="n.fecha">{{ n.fecha | date:'mediumDate' }}</p>
          <p class="card-text">{{ (n.texto || '') | slice:0:120 }}{{ (n.texto || '').length > 120 ? '…' : '' }}</p>
          <div class="mt-auto">
            <button class="btn btn-outline-primary btn-sm" (click)="ver(n)">Ver</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ng-template #vacio>
    <div class="alert alert-info">No hay noticias para mostrar.</div>
  </ng-template>
  `
})
export class NoticiasListComponent implements OnInit {
  noticias: Noticia[] = [];
  constructor(private srv: NoticiasService){}
  ngOnInit(){ this.srv.listar().subscribe(d => this.noticias = d || []); }
  ver(n: Noticia){ alert(n.texto || n.titulo); }
}
