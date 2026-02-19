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

// --- INTERFACES ---

export interface IUsuario {
    id: number;
    nombre: string;
    email: string;
    tipo: TipoUsuario;
    fechaRegistro: Date;
    prestamosActivos: number;
}

export interface ILibro {
    isbn: string;
    titulo: string;
    autor: string;
    categoria: CategoriaLibro;
    añoPublicacion: number;
    copiasDisponibles: number;
    copiasTotales: number;
    estado: EstadoLibro;
}

export interface IPrestamo {
    id: number;
    usuario: IUsuario; // Referencia al objeto usuario
    libro: ILibro;     // Referencia al objeto libro
    fechaPrestamo: Date;
    fechaDevolucionEsperada: Date;
    fechaDevolucionReal?: Date; // opcional
    estado: EstadoPrestamo;
}

