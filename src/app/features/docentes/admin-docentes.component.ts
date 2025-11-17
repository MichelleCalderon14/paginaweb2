import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocentesService } from './docentes.service';
import { DocentePerfil } from '../../shared/models';
import { forkJoin, of, switchMap } from 'rxjs';

type NuevaFormacion = { titulo:string; institucion?:string; nivel?:string; anio?:string };
type NuevaExperiencia = { institucion:string; rol?:string; desde?:string; hasta?:string|null; descripcion?:string };
type NuevoReconocimiento = { nombre:string; otorgante?:string; anio?:string; descripcion?:string };

@Component({
  standalone: true,
  selector: 'app-admin-docentes',
  imports: [CommonModule, FormsModule],
  template: `
  <h2 class="h4 mb-3">Administración de Docentes</h2>

  <div class="row g-4">
    <!-- ========= LISTA + EDICIÓN ========= -->
    <div class="col-lg-7">
      <div class="row g-3">
        <div class="col-md-12" *ngFor="let d of docentes">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="d-flex gap-3 align-items-start">
                <img *ngIf="d.fotografiaUrl" [src]="d.fotografiaUrl" class="rounded" style="width:120px;height:120px;object-fit:cover" alt="Foto">
                <div class="flex-fill">
                  <h5 class="mb-1">{{ d.nombreCompleto }}</h5>
                  <p class="mb-1 small">{{ d.cargo || '—' }} · {{ d.area || '—' }}</p>
                  <p class="mb-1 small">Años de experiencia: <strong>{{ d.aniosExperiencia || 0 }}</strong></p>
                  <button class="btn btn-sm btn-outline-primary me-2" (click)="startEdit(d)">Editar</button>
                </div>
              </div>

              <!-- Panel de edición -->
              <div *ngIf="editing?.id === d.id" class="mt-3 border rounded p-3 bg-light">
                <form (ngSubmit)="saveEdit(d)">
                  <div class="mb-2">
                    <label class="form-label">Nombre</label>
                    <input class="form-control" [(ngModel)]="editing.nombreCompleto" name="nombre{{d.id}}">
                  </div>

                  <div class="mb-2 row">
                    <div class="col">
                      <label class="form-label">Años de experiencia</label>
                      <input type="number" class="form-control" [(ngModel)]="editing.aniosExperiencia" name="anios{{d.id}}">
                    </div>
                    <div class="col">
                      <label class="form-label">Cargo</label>
                      <input class="form-control" [(ngModel)]="editing.cargo" name="cargo{{d.id}}">
                    </div>
                  </div>

                  <div class="mb-2 row">
                    <div class="col">
                      <label class="form-label">Área</label>
                      <input class="form-control" [(ngModel)]="editing.area" name="area{{d.id}}">
                    </div>
                    <div class="col">
                      <label class="form-label">Imagen (subir)</label>
                      <input type="file" (change)="onFile($event, true)" class="form-control">
                    </div>
                  </div>

                  <div class="mb-2">
                    <label class="form-label">Bio</label>
                    <textarea class="form-control" rows="2" [(ngModel)]="editing.bio" name="bio{{d.id}}"></textarea>
                  </div>

                  <!-- ======= FORMACIONES ======= -->
                  <hr>
                  <h6 class="mb-2">Formación académica</h6>
                  <ul class="list-unstyled">
                    <li *ngFor="let f of editing.formaciones; let i = index" class="mb-2">
                      <div class="d-flex align-items-center gap-2">
                        <div class="flex-fill">
                          <strong>{{ f.titulo }}</strong>
                          <span class="text-muted small"> — {{ f.nivel || '—' }}</span>
                          <div class="text-muted small">{{ f.institucion || '—' }} <span *ngIf="f.anio">· {{ f.anio }}</span></div>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-danger" (click)="removeFormacion(f.id!, i)">Eliminar</button>
                      </div>
                    </li>
                  </ul>

                  <div class="row g-2 align-items-end">
                    <div class="col-12 col-md-4">
                      <label class="form-label">Título*</label>
                      <input class="form-control" [(ngModel)]="nuevaFormacion.titulo" name="nf_titulo{{d.id}}">
                    </div>
                    <div class="col-12 col-md-4">
                      <label class="form-label">Institución</label>
                      <input class="form-control" [(ngModel)]="nuevaFormacion.institucion" name="nf_inst{{d.id}}">
                    </div>
                    <div class="col-6 col-md-2">
                      <label class="form-label">Nivel</label>
                      <input class="form-control" [(ngModel)]="nuevaFormacion.nivel" name="nf_nivel{{d.id}}">
                    </div>
                    <div class="col-6 col-md-2">
                      <label class="form-label">Año</label>
                      <input class="form-control" [(ngModel)]="nuevaFormacion.anio" name="nf_anio{{d.id}}" maxlength="4">
                    </div>
                    <div class="col-12">
                      <button type="button" class="btn btn-sm btn-outline-success" (click)="addFormacion(d)">Agregar formación</button>
                    </div>
                  </div>

                  <!-- ======= EXPERIENCIA ======= -->
                  <hr>
                  <h6 class="mb-2">Experiencia profesional</h6>
                  <ul class="list-unstyled">
                    <li *ngFor="let e of editing.experiencias; let i = index" class="mb-2">
                      <div class="d-flex align-items-center gap-2">
                        <div class="flex-fill">
                          <strong>{{ e.institucion }}</strong>
                          <span *ngIf="e.rol"> — {{ e.rol }}</span>
                          <div class="text-muted small">
                            {{ e.desde || '—' }} <span *ngIf="e.hasta">→ {{ e.hasta }}</span>
                          </div>
                          <div class="small" *ngIf="e.descripcion">{{ e.descripcion }}</div>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-danger" (click)="removeExperiencia(e.id!, i)">Eliminar</button>
                      </div>
                    </li>
                  </ul>

                  <div class="row g-2 align-items-end">
                    <div class="col-12 col-md-6">
                      <label class="form-label">Institución*</label>
                      <input class="form-control" [(ngModel)]="nuevaExperiencia.institucion" name="nx_inst{{d.id}}">
                    </div>
                    <div class="col-12 col-md-6">
                      <label class="form-label">Rol</label>
                      <input class="form-control" [(ngModel)]="nuevaExperiencia.rol" name="nx_rol{{d.id}}">
                    </div>
                    <div class="col-6 col-md-3">
                      <label class="form-label">Desde</label>
                      <input type="date" class="form-control" [(ngModel)]="nuevaExperiencia.desde" name="nx_desde{{d.id}}">
                    </div>
                    <div class="col-6 col-md-3">
                      <label class="form-label">Hasta</label>
                      <input type="date" class="form-control" [(ngModel)]="nuevaExperiencia.hasta" name="nx_hasta{{d.id}}">
                    </div>
                    <div class="col-12 col-md-6">
                      <label class="form-label">Descripción</label>
                      <input class="form-control" [(ngModel)]="nuevaExperiencia.descripcion" name="nx_desc{{d.id}}">
                    </div>
                    <div class="col-12">
                      <button type="button" class="btn btn-sm btn-outline-success" (click)="addExperiencia(d)">Agregar experiencia</button>
                    </div>
                  </div>

                  <!-- ======= RECONOCIMIENTOS ======= -->
                  <hr>
                  <h6 class="mb-2">Reconocimientos</h6>
                  <ul class="list-unstyled">
                    <li *ngFor="let r of editing.reconocimientos; let i = index" class="mb-2">
                      <div class="d-flex align-items-center gap-2">
                        <div class="flex-fill">
                          <strong>{{ r.nombre }}</strong>
                          <div class="text-muted small">
                            {{ r.otorgante || '—' }} <span *ngIf="r.anio">· {{ r.anio }}</span>
                          </div>
                          <div class="small" *ngIf="r.descripcion">{{ r.descripcion }}</div>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-danger" (click)="removeReconocimiento(r.id!, i)">Eliminar</button>
                      </div>
                    </li>
                  </ul>

                  <div class="row g-2 align-items-end">
                    <div class="col-12 col-md-6">
                      <label class="form-label">Nombre*</label>
                      <input class="form-control" [(ngModel)]="nuevoReconocimiento.nombre" name="nr_nom{{d.id}}">
                    </div>
                    <div class="col-12 col-md-6">
                      <label class="form-label">Otorgante</label>
                      <input class="form-control" [(ngModel)]="nuevoReconocimiento.otorgante" name="nr_ot{{d.id}}">
                    </div>
                    <div class="col-6 col-md-2">
                      <label class="form-label">Año</label>
                      <input class="form-control" [(ngModel)]="nuevoReconocimiento.anio" name="nr_anio{{d.id}}" maxlength="4">
                    </div>
                    <div class="col-12 col-md-10">
                      <label class="form-label">Descripción</label>
                      <input class="form-control" [(ngModel)]="nuevoReconocimiento.descripcion" name="nr_desc{{d.id}}">
                    </div>
                    <div class="col-12">
                      <button type="button" class="btn btn-sm btn-outline-success" (click)="addReconocimiento(d)">Agregar reconocimiento</button>
                    </div>
                  </div>

                  <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-success btn-sm" type="submit">Guardar</button>
                    <button class="btn btn-secondary btn-sm" type="button" (click)="cancelEdit()">Cancelar</button>
                  </div>
                </form>
              </div>
              <!-- Fin panel -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========= NUEVO DOCENTE (al lado) ========= -->
    <div class="col-lg-5">
      <div class="card shadow-sm position-sticky" style="top: 1rem;">
        <div class="card-body">
          <h5 class="mb-3">Nuevo docente</h5>

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
              <label class="form-label">Imagen (subir)</label>
              <input type="file" (change)="onFile($event, false)" class="form-control">
            </div>
          </div>
          <div class="mb-2">
            <label class="form-label">Bio</label>
            <textarea rows="2" class="form-control" [(ngModel)]="newDoc.bio" name="new_bio"></textarea>
          </div>

          <hr>
          <h6 class="mb-2">Formaciones a agregar</h6>
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

          <h6 class="mb-2">Experiencias a agregar</h6>
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

          <h6 class="mb-2">Reconocimientos a agregar</h6>
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
    </div>
  </div>
  `
})
export class AdminDocentesComponent implements OnInit {
  docentes: DocentePerfil[] = [];
  editing: DocentePerfil | null = null;
  private pendingEditImage: string | null = null;
  private pendingNewImage: string | null = null;

  // NUEVO docente
  newDoc: Partial<DocentePerfil> = { nombreCompleto: '', aniosExperiencia: 0, cargo: '', area: '', bio: '', fotografiaUrl: '' };
  newFormaciones: NuevaFormacion[] = [];
  newExperiencias: NuevaExperiencia[] = [];
  newReconocimientos: NuevoReconocimiento[] = [];

  // buffers temporales para inputs (nuevo)
  tmpFormacion: NuevaFormacion = { titulo: '' };
  tmpExperiencia: NuevaExperiencia = { institucion: '' };
  tmpReconocimiento: NuevoReconocimiento = { nombre: '' };

  // buffers para edición
  nuevaFormacion: NuevaFormacion = { titulo: '' };
  nuevaExperiencia: NuevaExperiencia = { institucion: '', rol: '', desde: '', hasta: '', descripcion: '' };
  nuevoReconocimiento: NuevoReconocimiento = { nombre: '', otorgante: '', anio: '', descripcion: '' };

  constructor(private srv: DocentesService) {}

  ngOnInit(){ this.srv.listar().subscribe(d => this.docentes = d || []); }

  // ======= EDICIÓN EXISTENTE =======
  startEdit(d: DocentePerfil){
    this.editing = JSON.parse(JSON.stringify(d));
    this.pendingEditImage = null;
    this.srv.formaciones(d.id).subscribe(fs => this.editing && (this.editing.formaciones = fs || []));
    this.srv.experiencias(d.id).subscribe(es => this.editing && (this.editing.experiencias = es || []));
    this.srv.reconocimientos(d.id).subscribe(rs => this.editing && (this.editing.reconocimientos = rs || []));
    this.nuevaFormacion = { titulo: '' };
    this.nuevaExperiencia = { institucion: '', rol: '', desde: '', hasta: '', descripcion: '' };
    this.nuevoReconocimiento = { nombre: '', otorgante: '', anio: '', descripcion: '' };
  }
  cancelEdit(){ this.editing = null; this.pendingEditImage = null; }

  onFile(ev: Event, isEdit: boolean){
    const input = ev.target as HTMLInputElement;
    const f = input.files && input.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = (reader.result as string);
      if(isEdit){
        this.pendingEditImage = b64;
        if(this.editing) this.editing.fotografiaUrl = b64;
      }else{
        this.pendingNewImage = b64;
        this.newDoc.fotografiaUrl = b64;
      }
    };
    reader.readAsDataURL(f);
  }

  saveEdit(orig: DocentePerfil){
    if(!this.editing) return;
    const payload: Partial<DocentePerfil> = {
      nombreCompleto: this.editing.nombreCompleto,
      aniosExperiencia: this.editing.aniosExperiencia,
      cargo: this.editing.cargo,
      area: this.editing.area,
      bio: this.editing.bio,
      fotografiaUrl: this.editing.fotografiaUrl
    };
    this.srv.update(orig.id, payload).subscribe({
      next: (updated) => {
        const idx = this.docentes.findIndex(x => x.id === orig.id);
        if(idx>=0) this.docentes[idx] = updated;
        alert('Docente actualizado ✔');
      },
      error: err => { console.error(err); alert('No se pudo actualizar (PUT).'); }
    });
  }

  // subrecursos en edición
  addFormacion(d: DocentePerfil){
    if(!this.nuevaFormacion.titulo?.trim()){ alert('Título es obligatorio'); return; }
    this.srv.addFormacion(d.id, this.nuevaFormacion).subscribe({
      next: saved => { this.editing?.formaciones?.push(saved); this.nuevaFormacion = { titulo: '' }; },
      error: err => { console.error(err); alert('No se pudo agregar formación.'); }
    });
  }
  removeFormacion(id: number, i: number){
    if(!confirm('¿Eliminar esta formación?')) return;
    this.srv.deleteFormacion(id).subscribe({
      next: () => this.editing?.formaciones?.splice(i,1),
      error: err => { console.error(err); alert('No se pudo eliminar formación.'); }
    });
  }

  addExperiencia(d: DocentePerfil){
    if(!this.nuevaExperiencia.institucion?.trim()){ alert('Institución es obligatoria'); return; }
    this.srv.addExperiencia(d.id, this.nuevaExperiencia).subscribe({
      next: saved => { this.editing?.experiencias?.push(saved); this.nuevaExperiencia = { institucion: '' }; },
      error: err => { console.error(err); alert('No se pudo agregar experiencia.'); }
    });
  }
  removeExperiencia(id: number, i: number){
    if(!confirm('¿Eliminar esta experiencia?')) return;
    this.srv.deleteExperiencia(id).subscribe({
      next: () => this.editing?.experiencias?.splice(i,1),
      error: err => { console.error(err); alert('No se pudo eliminar experiencia.'); }
    });
  }

  addReconocimiento(d: DocentePerfil){
    if(!this.nuevoReconocimiento.nombre?.trim()){ alert('Nombre es obligatorio'); return; }
    this.srv.addReconocimiento(d.id, this.nuevoReconocimiento).subscribe({
      next: saved => { this.editing?.reconocimientos?.push(saved); this.nuevoReconocimiento = { nombre: '' }; },
      error: err => { console.error(err); alert('No se pudo agregar reconocimiento.'); }
    });
  }
  removeReconocimiento(id: number, i: number){
    if(!confirm('¿Eliminar este reconocimiento?')) return;
    this.srv.deleteReconocimiento(id).subscribe({
      next: () => this.editing?.reconocimientos?.splice(i,1),
      error: err => { console.error(err); alert('No se pudo eliminar reconocimiento.'); }
    });
  }

  // ======= NUEVO DOCENTE =======
  pushFormacion(){
    if(!this.tmpFormacion.titulo?.trim()){ alert('Título es obligatorio'); return; }
    this.newFormaciones.push({...this.tmpFormacion});
    this.tmpFormacion = { titulo: '' };
  }
  pushExperiencia(){
    if(!this.tmpExperiencia.institucion?.trim()){ alert('Institución es obligatoria'); return; }
    this.newExperiencias.push({...this.tmpExperiencia});
    this.tmpExperiencia = { institucion: '' };
  }
  pushReconocimiento(){
    if(!this.tmpReconocimiento.nombre?.trim()){ alert('Nombre es obligatorio'); return; }
    this.newReconocimientos.push({...this.tmpReconocimiento});
    this.tmpReconocimiento = { nombre: '' };
  }

  crearDocente(){
    if(!this.newDoc.nombreCompleto?.trim()){ alert('El nombre es obligatorio'); return; }

    const basePayload: Partial<DocentePerfil> = {
      nombreCompleto: this.newDoc.nombreCompleto!,
      aniosExperiencia: this.newDoc.aniosExperiencia ?? 0,
      cargo: this.newDoc.cargo,
      area: this.newDoc.area,
      bio: this.newDoc.bio,
      fotografiaUrl: this.newDoc.fotografiaUrl
    };

    this.srv.create(basePayload).pipe(
      switchMap((created) => {
        const id = created.id;
        const ops = [];

        for(const f of this.newFormaciones) ops.push(this.srv.addFormacion(id, f));
        for(const e of this.newExperiencias) ops.push(this.srv.addExperiencia(id, e));
        for(const r of this.newReconocimientos) ops.push(this.srv.addReconocimiento(id, r));

        return ops.length ? forkJoin(ops) : of(null);
      })
    ).subscribe({
      next: () => {
        alert('Docente creado ✔');
        this.srv.listar().subscribe(d => this.docentes = d || []);
        this.newDoc = { nombreCompleto: '', aniosExperiencia: 0, cargo: '', area: '', bio: '', fotografiaUrl: '' };
        this.pendingNewImage = null;
        this.newFormaciones = [];
        this.newExperiencias = [];
        this.newReconocimientos = [];
        this.tmpFormacion = { titulo: '' };
        this.tmpExperiencia = { institucion: '' };
        this.tmpReconocimiento = { nombre: '' };
      },
      error: err => {
        console.error(err);
        alert('No se pudo crear el docente. Revisa permisos del backend.');
      }
    });
  }
}
