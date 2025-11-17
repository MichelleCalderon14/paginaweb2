import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocentesService } from './docentes.service';
import { DocentePerfil } from '../../shared/models';

type NuevaFormacion = { titulo:string; institucion?:string; nivel?:string; anio?:string };
type NuevaExperiencia = { institucion:string; rol?:string; desde?:string; hasta?:string|null; descripcion?:string };
type NuevoReconocimiento = { nombre:string; otorgante?:string; anio?:string; descripcion?:string };

@Component({
  standalone: true,
  selector: 'app-admin-docentes-edit',
  imports: [CommonModule, FormsModule],
  template: `
  <h2 class="h4 mb-3">Editar docentes</h2>

  <div class="row g-3" *ngIf="docentes?.length; else vacio">
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

              <div class="mb-2">
                <label class="form-label d-block">Imagen</label>

                <div class="btn-group btn-group-sm mb-2" role="group">
                  <button type="button" class="btn"
                          [class.btn-primary]="editImageMode==='url'"
                          [class.btn-outline-primary]="editImageMode!=='url'"
                          (click)="editImageMode='url'">URL</button>
                  <button type="button" class="btn"
                          [class.btn-primary]="editImageMode==='file'"
                          [class.btn-outline-primary]="editImageMode!=='file'"
                          (click)="editImageMode='file'">Archivo</button>
                </div>

                <!-- URL -->
                <input *ngIf="editImageMode==='url'" class="form-control" placeholder="https://sitio.com/foto.jpg"
                       [(ngModel)]="editing.fotografiaUrl" name="foto_url{{d.id}}">

                <!-- Archivo -->
                <input *ngIf="editImageMode==='file'" type="file" (change)="onFile($event)" class="form-control">

                <div class="mt-2" *ngIf="editing?.fotografiaUrl">
                  <img [src]="editing.fotografiaUrl" alt="preview" class="rounded border"
                       style="width:120px;height:120px;object-fit:cover">
                </div>
              </div>

              <div class="mb-2">
                <label class="form-label">Área</label>
                <input class="form-control" [(ngModel)]="editing.area" name="area{{d.id}}">
              </div>

              <div class="mb-2">
                <label class="form-label">Bio</label>
                <textarea class="form-control" rows="2" [(ngModel)]="editing.bio" name="bio{{d.id}}"></textarea>
              </div>

              <!-- Formaciones -->
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

              <!-- Experiencia -->
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

              <!-- Reconocimientos -->
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

  <ng-template #vacio>
    <div class="alert alert-info">No hay docentes cargados.</div>
  </ng-template>
  `
})
export class AdminDocentesEditPage implements OnInit {
  docentes: DocentePerfil[] = [];
  editing: DocentePerfil | null = null;

  editImageMode: 'url' | 'file' = 'url';

  // buffers
  nuevaFormacion: NuevaFormacion = { titulo: '' };
  nuevaExperiencia: NuevaExperiencia = { institucion: '' };
  nuevoReconocimiento: NuevoReconocimiento = { nombre: '' };

  constructor(private srv: DocentesService) {}
  ngOnInit(){ this.srv.listar().subscribe(d => this.docentes = d || []); }

  startEdit(d: DocentePerfil){
    this.editing = JSON.parse(JSON.stringify(d));
    this.editImageMode = 'url';
    this.srv.formaciones(d.id).subscribe(fs => this.editing && (this.editing.formaciones = fs || []));
    this.srv.experiencias(d.id).subscribe(es => this.editing && (this.editing.experiencias = es || []));
    this.srv.reconocimientos(d.id).subscribe(rs => this.editing && (this.editing.reconocimientos = rs || []));
    this.nuevaFormacion = { titulo: '' };
    this.nuevaExperiencia = { institucion: '' };
    this.nuevoReconocimiento = { nombre: '' };
  }
  cancelEdit(){ this.editing = null; }

  onFile(ev: Event){
    const input = ev.target as HTMLInputElement;
    const f = input.files && input.files[0];
    if(!f || !this.editing) return;
    const reader = new FileReader();
    reader.onload = () => this.editing!.fotografiaUrl = reader.result as string;
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
        const i = this.docentes.findIndex(x => x.id === orig.id);
        if(i>=0) this.docentes[i] = updated;
        alert('Docente actualizado ✔');
      }
    });
  }

  addFormacion(d: DocentePerfil){
    if(!this.nuevaFormacion.titulo?.trim()){ alert('Título es obligatorio'); return; }
    this.srv.addFormacion(d.id, this.nuevaFormacion).subscribe(saved => {
      this.editing?.formaciones?.push(saved); this.nuevaFormacion = { titulo: '' };
    });
  }
  removeFormacion(id: number, i: number){
    if(!confirm('¿Eliminar esta formación?')) return;
    this.srv.deleteFormacion(id).subscribe(() => this.editing?.formaciones?.splice(i,1));
  }

  addExperiencia(d: DocentePerfil){
    if(!this.nuevaExperiencia.institucion?.trim()){ alert('Institución es obligatoria'); return; }
    this.srv.addExperiencia(d.id, this.nuevaExperiencia).subscribe(saved => {
      this.editing?.experiencias?.push(saved); this.nuevaExperiencia = { institucion: '' };
    });
  }
  removeExperiencia(id: number, i: number){
    if(!confirm('¿Eliminar esta experiencia?')) return;
    this.srv.deleteExperiencia(id).subscribe(() => this.editing?.experiencias?.splice(i,1));
  }

  addReconocimiento(d: DocentePerfil){
    if(!this.nuevoReconocimiento.nombre?.trim()){ alert('Nombre es obligatorio'); return; }
    this.srv.addReconocimiento(d.id, this.nuevoReconocimiento).subscribe(saved => {
      this.editing?.reconocimientos?.push(saved); this.nuevoReconocimiento = { nombre: '' };
    });
  }
  removeReconocimiento(id: number, i: number){
    if(!confirm('¿Eliminar este reconocimiento?')) return;
    this.srv.deleteReconocimiento(id).subscribe(() => this.editing?.reconocimientos?.splice(i,1));
  }
}
