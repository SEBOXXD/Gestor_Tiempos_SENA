export interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  contrasena: string;
  estado_usuario: boolean;
  id_rol: number;
  id_sede: number;
}