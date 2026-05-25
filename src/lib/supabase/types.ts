export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      perfiles: {
        Row: { id: string; nombre: string; created_at: string };
        Insert: { id: string; nombre: string; created_at?: string };
        Update: { nombre?: string };
        Relationships: [];
      };
      grupos: {
        Row: { id: string; nombre: string; codigo: string; creado_por: string; created_at: string };
        Insert: { id?: string; nombre: string; codigo: string; creado_por: string; created_at?: string };
        Update: { nombre?: string };
        Relationships: [];
      };
      invitaciones: {
        Row: { id: string; token: string; grupo_id: string; creado_por: string; activa: boolean; created_at: string };
        Insert: { id?: string; token: string; grupo_id: string; creado_por: string; activa?: boolean; created_at?: string };
        Update: { activa?: boolean };
        Relationships: [];
      };
      miembros_grupo: {
        Row: { id: string; grupo_id: string; usuario_id: string; created_at: string };
        Insert: { id?: string; grupo_id: string; usuario_id: string; created_at?: string };
        Update: { id?: string; grupo_id?: string; usuario_id?: string };
        Relationships: [];
      };
      figuritas: {
        Row: { id: string; usuario_id: string; numero: string; repetidas: number; created_at: string };
        Insert: { id?: string; usuario_id: string; numero: string; repetidas?: number; created_at?: string };
        Update: { repetidas?: number };
        Relationships: [];
      };
      catalogo_figuritas: {
        Row: { codigo: string; descripcion: string; seccion: string };
        Insert: { codigo: string; descripcion: string; seccion: string };
        Update: { descripcion?: string; seccion?: string };
        Relationships: [];
      };
      me_faltan: {
        Row: { id: string; usuario_id: string; numero: string; created_at: string };
        Insert: { id?: string; usuario_id: string; numero: string; created_at?: string };
        Update: { numero?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
