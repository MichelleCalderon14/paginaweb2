// src/app/shared/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';

export type RolNombre = 'ADMIN' | 'DOCENTE' | 'ALUMNO';

export type UsuarioAPI = {
  id_usuario: number;
  username: string;
  passwordHash?: string;
  email?: string | null;
  rol: { id_rol: number; nombre: RolNombre } | null;
  activo: boolean;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly KEY = 'app.auth.user';
  private base = `${environment.apiBase}/usuarios`;

  constructor(private http: HttpClient) {}

  // ====== Sesión actual en localStorage ======
  get currentUser(): UsuarioAPI | null {
    const raw = localStorage.getItem(this.KEY);
    return raw ? (JSON.parse(raw) as UsuarioAPI) : null;
  }

  private setSession(u: UsuarioAPI | null) {
    if (u) localStorage.setItem(this.KEY, JSON.stringify(u));
    else localStorage.removeItem(this.KEY);
  }

  isLoggedIn(): boolean { return !!this.currentUser; }

  logout(): void {
    localStorage.removeItem(this.KEY);
  }

  // ====== Roles ======
  hasRole(role: RolNombre): boolean {
    const u = this.currentUser;
    return !!u && u.rol?.nombre === role;
  }

  // Helpers cómodos para guards / componentes
  isAdmin(): boolean   { return this.hasRole('ADMIN'); }
  isDocente(): boolean { return this.hasRole('DOCENTE'); }
  isAlumno(): boolean  { return this.hasRole('ALUMNO'); }

  // ====== Login ======
  login(username: string, password: string): Observable<UsuarioAPI | null> {
    const u = (username || '').trim();
    const p = (password || '').trim();
    if (!u || !p) return of(null);

    // 🔹 MODO FAKE (desarrollo, sin tocar tu API)
    if (environment.useFakeAuth) {
      type FakeUser = {
        username: string;
        password: string;
        rol: RolNombre;
        id: number;
        email?: string;
      };

      const FAKE_USERS: FakeUser[] = [
        // Admin
        { username:'admin',         password:'admin',         rol:'ADMIN',   id:1,  email:'admin@colegio.local' },

        // Docentes
        { username:'carlosmolina',  password:'carlosmolina',  rol:'DOCENTE', id:2,  email:'carlos@colegio.local' },
        { username:'mariacabrera',  password:'mariacabrera',  rol:'DOCENTE', id:3,  email:'maria@colegio.local' },
        { username:'luispacheco',   password:'luispacheco',   rol:'DOCENTE', id:4,  email:'luispacheco@colegio.local' },

        // Alumnos (los que verán solo sus notas)
        { username:'pepecabrera',    password:'pepecabrera',    rol:'ALUMNO', id:10, email:'pepe@colegio.local' },
        { username:'sofiagarcia',    password:'sofiagarcia',    rol:'ALUMNO', id:11, email:'sofia@colegio.local' },
        { username:'mateolopez',     password:'mateolopez',     rol:'ALUMNO', id:12, email:'mateo@colegio.local' },
        { username:'valentinaperez', password:'valentinaperez', rol:'ALUMNO', id:13, email:'valentina@colegio.local' },
        { username:'sebastiantorres',password:'sebastiantorres',rol:'ALUMNO', id:14, email:'sebastian@colegio.local' },
        { username:'camilarojas',    password:'camilarojas',    rol:'ALUMNO', id:15, email:'camila@colegio.local' },
        { username:'janettarmijos',  password:'janettarmijos',  rol:'ALUMNO', id:16, email:'janett@colegio.local' },
      ];

      // 🔧 normalizamos: sin mayúsculas y sin espacios internos
      const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');

      const f = FAKE_USERS.find(
        x => norm(x.username) === norm(username) && x.password === password
      );

      if (f) {
        const usuario: UsuarioAPI = {
          id_usuario: f.id,
          username: f.username,
          email: f.email || null,
          activo: true,
          rol: {
            id_rol: f.rol === 'ADMIN' ? 1 : f.rol === 'DOCENTE' ? 2 : 3,
            nombre: f.rol
          }
        };
        this.setSession(usuario);
        return of(usuario);
      }
      return of(null);
    }

    // 🔹 MODO REAL (cuando uses tu API)
    const url = `${this.base}?_=${Date.now()}`;
    return this.http.get<UsuarioAPI[]>(url).pipe(
      timeout(8000),
      map(users => {
        const found = (users || []).find(
          x =>
            x.username?.toLowerCase() === u.toLowerCase() &&
            x.passwordHash === p &&
            x.activo === true
        );
        if (found) this.setSession(found);
        return found || null;
      }),
      catchError(() => of(null))
    );
  }
}
