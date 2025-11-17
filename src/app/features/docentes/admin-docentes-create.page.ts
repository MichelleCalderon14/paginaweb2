import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// ✅ Importa el tipo desde models, y solo el servicio desde el service
import { DocentesService } from './docentes.service';
import { DocentePerfil } from '../../shared/models';
import { forkJoin, of, switchMap } from 'rxjs';

type NuevaFormacion = { titulo:string; institucion?:string; nivel?:string; anio?:string };
type NuevaExperiencia = { institucion:string; rol?:string; desde?:string; hasta?:string|null; descripcion?:string };
type NuevoReconocimiento = { nombre:string; otorgante?:string; anio?:string; descripcion?:string };

@Component({
  standalone: true,
  selector: 'app-admin-docentes-create',
  imports: [CommonModule, FormsModule],
  template: `
  <h2 class="h4 mb-3">Crear docente</h2>

  <div class="card shadow-sm">
    <div class="card-body">
      <div class="mb-2">
        <label class="form-label">Nombre*</label>
        <input class="form-control" [(ngModel)]="newDoc.nombreCompleto" name="new_nombre">
      </div>
      <div class="mb-2 row">
        <div class="col">
          <label class="form-label">Años de experiencia</label>
          <input type="number" class="form-control" [(ngModel)]="newDoc.aniosExperiencia" name="new_anios">
        </div>
        <div class="col">
          <label class="form-label">Cargo</label>
          <input class="form-control" [(ngModel)]="newDoc.cargo" name="new_cargo">
        </div>
      </div>
      <div class="mb-2 row">
        <div class="col">
          <label class="form-label">Área</label>
          <input class="form-control" [(ngModel)]="newDoc.area" name="new_area">
        </div>
        <div class="col">
          <label class="form-label d-block">Imagen</label>

          <div class="btn-group btn-group-sm mb-2" role="group" aria-label="image mode">
            <button type="button" class="btn"
                    [class.btn-primary]="imageMode==='url'"
                    [class.btn-outline-primary]="imageMode!=='url'"
                    (click)="imageMode='url'">URL</button>
            <button type="button" class="btn"
                    [class.btn-primary]="imageMode==='file'"
                    [class.btn-outline-primary]="imageMode!=='file'"
                    (click)="imageMode='file'">Archivo</button>
          </div>

          <!-- Modo URL -->
          <input *ngIf="imageMode==='url'" class="form-control" placeholder="https://sitio.com/foto.jpg"
                 [(ngModel)]="newDoc.fotografiaUrl" name="new_foto_url">

          <!-- Modo Archivo -->
          <input *ngIf="imageMode==='file'" type="file" (change)="onFile($event)" class="form-control">

          <!-- Preview -->
          <div class="mt-2" *ngIf="newDoc.fotografiaUrl">
            <img [src]="newDoc.fotografiaUrl" alt="preview" class="rounded border"
                 style="width:120px;height:120px;object-fit:cover">
          </div>
          <small class="text-muted d-block mt-1">Puedes pegar una URL o subir un archivo; se guardará en el mismo campo.</small>
        </div>
      </div>
      <div class="mb-2">
        <label class="form-label">Bio</label>
        <textarea rows="2" class="form-control" [(ngModel)]="newDoc.bio" name="new_bio"></textarea>
      </div>

      <hr>
      <h6 class="mb-2">Formaciones</h6>
      <ul class="small mb-2">
        <li *ngFor="let f of newFormaciones; let i = index">
          <strong>{{ f.titulo }}</strong> — {{ f.nivel || '—' }}
          <span class="text-muted"> · {{ f.institucion || '—' }} <span *ngIf="f.anio">({{f.anio}})</span></span>
          <button class="btn btn-link btn-sm text-danger" (click)="newFormaciones.splice(i,1)">quitar</button>
        </li>
      </ul>
      <div class="row g-2 align-items-end mb-3">
        <div class="col-12 col-md-4">
          <label class="form-label">Título*</label>
          <input class="form-control" [(ngModel)]="tmpFormacion.titulo" name="t_f_titulo">
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Institución</label>
          <input class="form-control" [(ngModel)]="tmpFormacion.institucion" name="t_f_inst">
        </div>
        <div class="col-6 col-md-2">
          <label class="form-label">Nivel</label>
          <input class="form-control" [(ngModel)]="tmpFormacion.nivel" name="t_f_nivel">
        </div>
        <div class="col-6 col-md-2">
          <label class="form-label">Año</label>
          <input class="form-control" [(ngModel)]="tmpFormacion.anio" name="t_f_anio" maxlength="4">
        </div>
        <div class="col-12">
          <button class="btn btn-sm btn-outline-primary" type="button" (click)="pushFormacion()">Añadir formación</button>
        </div>
      </div>

      <h6 class="mb-2">Experiencias</h6>
      <ul class="small mb-2">
        <li *ngFor="let e of newExperiencias; let i = index">
          <strong>{{ e.institucion }}</strong> — {{ e.rol || '—' }}
          <span class="text-muted"> · {{ e.desde || '—' }} <span *ngIf="e.hasta">→ {{ e.hasta }}</span></span>
          <button class="btn btn-link btn-sm text-danger" (click)="newExperiencias.splice(i,1)">quitar</button>
        </li>
      </ul>
      <div class="row g-2 align-items-end mb-3">
        <div class="col-12 col-md-6">
          <label class="form-label">Institución*</label>
          <input class="form-control" [(ngModel)]="tmpExperiencia.institucion" name="t_x_inst">
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Rol</label>
          <input class="form-control" [(ngModel)]="tmpExperiencia.rol" name="t_x_rol">
        </div>
        <div class="col-6 col-md-3">
          <label class="form-label">Desde</label>
          <input type="date" class="form-control" [(ngModel)]="tmpExperiencia.desde" name="t_x_desde">
        </div>
        <div class="col-6 col-md-3">
          <label class="form-label">Hasta</label>
          <input type="date" class="form-control" [(ngModel)]="tmpExperiencia.hasta" name="t_x_hasta">
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Descripción</label>
          <input class="form-control" [(ngModel)]="tmpExperiencia.descripcion" name="t_x_desc">
        </div>
        <div class="col-12">
          <button class="btn btn-sm btn-outline-primary" type="button" (click)="pushExperiencia()">Añadir experiencia</button>
        </div>
      </div>

      <h6 class="mb-2">Reconocimientos</h6>
      <ul class="small mb-2">
        <li *ngFor="let r of newReconocimientos; let i = index">
          <strong>{{ r.nombre }}</strong>
          <span class="text-muted"> · {{ r.otorgante || '—' }} <span *ngIf="r.anio">({{ r.anio }})</span></span>
          <button class="btn btn-link btn-sm text-danger" (click)="newReconocimientos.splice(i,1)">quitar</button>
        </li>
      </ul>
      <div class="row g-2 align-items-end mb-3">
        <div class="col-12 col-md-6">
          <label class="form-label">Nombre*</label>
          <input class="form-control" [(ngModel)]="tmpReconocimiento.nombre" name="t_r_nom">
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Otorgante</label>
          <input class="form-control" [(ngModel)]="tmpReconocimiento.otorgante" name="t_r_ot">
        </div>
        <div class="col-6 col-md-2">
          <label class="form-label">Año</label>
          <input class="form-control" [(ngModel)]="tmpReconocimiento.anio" name="t_r_anio" maxlength="4">
        </div>
        <div class="col-12 col-md-10">
          <label class="form-label">Descripción</label>
          <input class="form-control" [(ngModel)]="tmpReconocimiento.descripcion" name="t_r_desc">
        </div>
        <div class="col-12">
          <button class="btn btn-sm btn-outline-primary" type="button" (click)="pushReconocimiento()">Añadir reconocimiento</button>
        </div>
      </div>

      <div class="d-grid">
        <button class="btn btn-success" (click)="crearDocente()">Crear docente</button>
      </div>
    </div>
  </div>
  `
})
export class AdminDocentesCreatePage {
  imageMode: 'url' | 'file' = 'url';

  newDoc: Partial<DocentePerfil> = { nombreCompleto: '', aniosExperiencia: 0, cargo: '', area: '', bio: '', fotografiaUrl: '' };
  newFormaciones: NuevaFormacion[] = [];
  newExperiencias: NuevaExperiencia[] = [];
  newReconocimientos: NuevoReconocimiento[] = [];

  // temporales
  tmpFormacion: NuevaFormacion = { titulo: '' };
  tmpExperiencia: NuevaExperiencia = { institucion: '' };
  tmpReconocimiento: NuevoReconocimiento = { nombre: '' };

  constructor(private srv: DocentesService) {}

  onFile(ev: Event){
    const input = ev.target as HTMLInputElement;
    const f = input.files && input.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = () => this.newDoc.fotografiaUrl = reader.result as string; // guarda base64 en el mismo campo
    reader.readAsDataURL(f);
  }

  pushFormacion(){ if(!this.tmpFormacion.titulo?.trim()) return; this.newFormaciones.push({...this.tmpFormacion}); this.tmpFormacion={titulo:''}; }
  pushExperiencia(){ if(!this.tmpExperiencia.institucion?.trim()) return; this.newExperiencias.push({...this.tmpExperiencia}); this.tmpExperiencia={institucion:''}; }
  pushReconocimiento(){ if(!this.tmpReconocimiento.nombre?.trim()) return; this.newReconocimientos.push({...this.tmpReconocimiento}); this.tmpReconocimiento={nombre:''}; }

  crearDocente(){
    if(!this.newDoc.nombreCompleto?.trim()){
      alert('El nombre es obligatorio');
      return;
    }

    const basePayload: Partial<DocentePerfil> = {
      nombreCompleto: this.newDoc.nombreCompleto!,
      aniosExperiencia: this.newDoc.aniosExperiencia ?? 0,
      cargo: this.newDoc.cargo,
      area: this.newDoc.area,
      bio: this.newDoc.bio,
      fotografiaUrl: this.newDoc.fotografiaUrl // puede ser URL o base64
    };

    this.srv.create(basePayload).pipe(
      switchMap((created) => {
        if(!created?.id){ throw new Error('El backend no devolvió ID del docente creado'); }
        const id = created.id;
        const ops = [
          ...this.newFormaciones.map(f => this.srv.addFormacion(id, f)),
          ...this.newExperiencias.map(e => this.srv.addExperiencia(id, e)),
          ...this.newReconocimientos.map(r => this.srv.addReconocimiento(id, r)),
        ];
        return ops.length ? forkJoin(ops) : of(null);
      })
    ).subscribe({
      next: () => {
        alert('Docente creado ✔');
        // limpiar el formulario
        this.newDoc = { nombreCompleto: '', aniosExperiencia: 0, cargo: '', area: '', bio: '', fotografiaUrl: '' };
        this.newFormaciones = [];
        this.newExperiencias = [];
        this.newReconocimientos = [];
        this.tmpFormacion = { titulo: '' };
        this.tmpExperiencia = { institucion: '' };
        this.tmpReconocimiento = { nombre: '' };
      },
      error: (err) => {
        console.error('[CrearDocente] error', err);
        alert('❌ No se pudo crear el docente. Revisa que el backend esté arriba y que el proxy apunte al puerto correcto.');
      }
    });
  }
}
