// --- Enums ---

export enum TipoUsuario {
    Estudiante = "Estudiante",
    Profesor = "Profesor",
    Administrador = "Administrador"
}

export enum CategoriaLibro {
    Ficcion = "Ficción",
    NoFiccion = "No Ficción",
    Ciencia = "Ciencia",
    Tecnologia = "Tecnología",
    Historia = "Historia",
    Arte = "Arte"
}

// Punto Extra: Tipos de materiales para la clase abstracta
export enum TipoMaterial {
    Libro = "Libro",
    Revista = "Revista",
    Tesis = "Tesis",
    Video = "Video"
}

export enum EstadoLibro {
    Disponible = "Disponible",
    Prestado = "Prestado",
    Reservado = "Reservado",
    Mantenimiento = "Mantenimiento"
}

export enum EstadoPrestamo {
    Activo = "Activo",
    Devuelto = "Devuelto",
    Vencido = "Vencido"
}

// Punto Extra: Estados para el sistema de reservas
export enum EstadoReserva {
    Pendiente = "Pendiente",
    Completada = "Completada",
    Cancelada = "Cancelada"
}

// --- INTERFACES ---

export interface IUsuario {
    id: number;
    nombre: string;
    email: string;
    tipo: TipoUsuario;
    fechaRegistro: Date;
    prestamosActivos: number;
}

/** * PUNTO EXTRA: Base para la clase abstracta Material
 * Aquí definimos lo que TODO material (libro, revista, etc) debe tener.
 */

export interface IMaterial {
    readonly id: string; 
    titulo: string;
    autor: string;
    tipo: TipoMaterial;
    añoPublicacion: number;
    copiasDisponibles: number;
    copiasTotales: number;
    estado: EstadoLibro;
}

/** * ILibro ahora hereda de IMaterial. 
 * Solo le agregamos lo que es exclusivo de un libro.
 */
export interface ILibro extends IMaterial {
    isbn: string;
    categoria: CategoriaLibro;
}

/**
 * PUNTO EXTRA: Interfaz para el Sistema de Reservas.
*/

export interface IReserva {
    id: number;
    usuario: IUsuario;
    material: IMaterial;
    fechaReserva: Date;
    estado: EstadoReserva;
}

export interface IPrestamo {
    id: number;
    usuario: IUsuario;
    material: IMaterial;   
    fechaPrestamo: Date;
    fechaDevolucionEsperada: Date;
    fechaDevolucionReal?: Date;
    estado: EstadoPrestamo;
}