import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocentesService } from './docentes.service';
import { DocentePerfil } from '../../shared/models';

@Component({
  standalone: true,
  selector: 'app-admin-docentes-delete',
  imports: [CommonModule],
  template: `
  <h2 class="h4 mb-3">Borrar docentes</h2>
  <div *ngIf="!docentes?.length" class="alert alert-info">No hay docentes cargados.</div>
  <div class="row g-3" *ngIf="docentes?.length">
    <div class="col-md-6" *ngFor="let d of docentes">
      <div class="card shadow-sm h-100"><div class="card-body d-flex gap-3 align-items-start">
        <img *ngIf="d.fotografiaUrl" [src]="d.fotografiaUrl" class="rounded" style="width:96px;height:96px;object-fit:cover">
        <div class="flex-fill">
          <h5 class="h6 mb-1">{{ d.nombreCompleto }}</h5>
          <button class="btn btn-sm btn-outline-danger" (click)="eliminar(d)">Eliminar</button>
        </div>
      </div></div>
    </div>
  </div>
  `
})
export class AdminDocentesDeletePage implements OnInit {
  docentes: DocentePerfil[]=[]; constructor(private srv: DocentesService){}
  ngOnInit(){ this.srv.listar().subscribe(d=>this.docentes=d||[]); }
  eliminar(d: DocentePerfil){
    if(!confirm(`¿Eliminar "${d.nombreCompleto}"?`)) return;
    this.srv.delete(d.id).subscribe(()=> this.docentes = this.docentes.filter(x=>x.id!==d.id));
  }
}
