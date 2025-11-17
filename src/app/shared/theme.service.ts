import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private dark = false;
  private text = '#212529';
  private scale = 1;

  constructor(@Inject(DOCUMENT) private doc: Document) {
    this.load();
    this.apply();
  }

  toggleDark() { this.dark = !this.dark; this.apply(); this.persist(); }
  setTextColor(hex: string) {
    if (!/^#([0-9a-f]{3}){1,2}$/i.test(hex)) return;
    this.text = hex; this.apply(); this.persist();
  }
  incFont() { this.setScale(this.scale + 0.1); }
  decFont() { this.setScale(this.scale - 0.1); }
  reset() { this.dark = false; this.text = '#212529'; this.scale = 1; this.apply(); this.persist(); }

  private setScale(v: number) {
    this.scale = Math.max(0.8, Math.min(1.6, Number(v.toFixed(2))));
    this.apply(); this.persist();
  }
  private apply() {
    const root = this.doc.documentElement;
    root.classList.toggle('app-theme-dark', this.dark);
    root.style.setProperty('--app-text', this.text);
    root.style.setProperty('--bs-body-color', this.text);
    root.style.setProperty('--app-font-scale', String(this.scale));
  }
  private persist() {
    localStorage.setItem('app.theme.dark', String(this.dark));
    localStorage.setItem('app.theme.text', this.text);
    localStorage.setItem('app.theme.scale', String(this.scale));
  }
  private load() {
    const d = localStorage.getItem('app.theme.dark');
    const t = localStorage.getItem('app.theme.text');
    const s = localStorage.getItem('app.theme.scale');
    if (d !== null) this.dark = d === 'true';
    if (t) this.text = t;
    if (s && !isNaN(+s)) this.scale = +s;
  }
}
