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

export enum EstadoReserva {
    Pendiente = "Pendiente",
    Completada = "Completada",
    Cancelada = "Cancelada"
}

export interface IUsuario {
    id: number;
    nombre: string;
    email: string;
    tipo: TipoUsuario;
    fechaRegistro: Date;
    prestamosActivos: number;
}

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

export interface ILibro extends IMaterial {
    isbn: string;
    categoria: CategoriaLibro;
}

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