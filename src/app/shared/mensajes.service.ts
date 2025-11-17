// src/app/shared/mensajes.service.ts
import { Injectable } from '@angular/core';

export interface Mensaje {
  id: number;
  texto: string;
  fecha: string; // ISO
  leido: boolean;
}

@Injectable({ providedIn: 'root' })
export class MensajesService {
  private readonly KEY = 'colegio.mensajes';

  private cargar(): Mensaje[] {
    const raw = localStorage.getItem(this.KEY);
    if (!raw) return [];
    try {
      const arr = JSON.parse(raw) as Mensaje[];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  private guardarTodos(lista: Mensaje[]) {
    localStorage.setItem(this.KEY, JSON.stringify(lista));
  }

  private nextId(lista: Mensaje[]): number {
    return lista.length ? Math.max(...lista.map(m => m.id)) + 1 : 1;
  }

  obtenerTodos(): Mensaje[] {
    return this.cargar().sort((a, b) => (b.fecha.localeCompare(a.fecha)));
  }

  obtenerPendientes(): Mensaje[] {
    return this.cargar().filter(m => !m.leido);
  }

  contarPendientes(): number {
    return this.obtenerPendientes().length;
  }

  agregar(texto: string) {
    const lista = this.cargar();
    const nuevo: Mensaje = {
      id: this.nextId(lista),
      texto: texto.trim(),
      fecha: new Date().toISOString(),
      leido: false
    };
    lista.push(nuevo);
    this.guardarTodos(lista);
  }

  marcarLeido(id: number) {
    const lista = this.cargar();
    const idx = lista.findIndex(m => m.id === id);
    if (idx >= 0) {
      lista[idx].leido = true;
      this.guardarTodos(lista);
    }
  }

  marcarTodosLeidos() {
    const lista = this.cargar().map(m => ({ ...m, leido: true }));
    this.guardarTodos(lista);
  }

  eliminar(id: number) {
    const lista = this.cargar().filter(m => m.id !== id);
    this.guardarTodos(lista);
  }
}
