export interface Noticia {
  id: number;
  titulo: string;
  texto?: string;
  imagen?: string;
  fecha?: string; // yyyy-MM-dd
}

export interface FormacionAcademica {
  id?: number;
  titulo: string;
  institucion?: string;
  nivel?: string;
  anio?: string;
}

export interface ExperienciaProfesional {
  id?: number;
  institucion: string;
  rol?: string;
  desde?: string;
  hasta?: string | null;
  descripcion?: string;
}

export interface Reconocimiento {
  id?: number;
  nombre: string;
  otorgante?: string;
  anio?: string;
  descripcion?: string;
}

export interface DocentePerfil {
  id: number;
  nombreCompleto: string;
  fotografiaUrl?: string;
  cargo?: string;
  area?: string;
  aniosExperiencia?: number;
  bio?: string;
  formaciones?: FormacionAcademica[];
  experiencias?: ExperienciaProfesional[];
  reconocimientos?: Reconocimiento[];
}
export interface Alumno {
  id_alumno: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento?: string; // ISO yyyy-MM-dd
  email?: string;
}