"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstadoReserva = exports.EstadoPrestamo = exports.EstadoLibro = exports.TipoMaterial = exports.CategoriaLibro = exports.TipoUsuario = void 0;
var TipoUsuario;
(function (TipoUsuario) {
    TipoUsuario["Estudiante"] = "Estudiante";
    TipoUsuario["Profesor"] = "Profesor";
    TipoUsuario["Administrador"] = "Administrador";
})(TipoUsuario || (exports.TipoUsuario = TipoUsuario = {}));
var CategoriaLibro;
(function (CategoriaLibro) {
    CategoriaLibro["Ficcion"] = "Ficci\u00F3n";
    CategoriaLibro["NoFiccion"] = "No Ficci\u00F3n";
    CategoriaLibro["Ciencia"] = "Ciencia";
    CategoriaLibro["Tecnologia"] = "Tecnolog\u00EDa";
    CategoriaLibro["Historia"] = "Historia";
    CategoriaLibro["Arte"] = "Arte";
})(CategoriaLibro || (exports.CategoriaLibro = CategoriaLibro = {}));
var TipoMaterial;
(function (TipoMaterial) {
    TipoMaterial["Libro"] = "Libro";
    TipoMaterial["Revista"] = "Revista";
    TipoMaterial["Tesis"] = "Tesis";
    TipoMaterial["Video"] = "Video";
})(TipoMaterial || (exports.TipoMaterial = TipoMaterial = {}));
var EstadoLibro;
(function (EstadoLibro) {
    EstadoLibro["Disponible"] = "Disponible";
    EstadoLibro["Prestado"] = "Prestado";
    EstadoLibro["Reservado"] = "Reservado";
    EstadoLibro["Mantenimiento"] = "Mantenimiento";
})(EstadoLibro || (exports.EstadoLibro = EstadoLibro = {}));
var EstadoPrestamo;
(function (EstadoPrestamo) {
    EstadoPrestamo["Activo"] = "Activo";
    EstadoPrestamo["Devuelto"] = "Devuelto";
    EstadoPrestamo["Vencido"] = "Vencido";
})(EstadoPrestamo || (exports.EstadoPrestamo = EstadoPrestamo = {}));
var EstadoReserva;
(function (EstadoReserva) {
    EstadoReserva["Pendiente"] = "Pendiente";
    EstadoReserva["Completada"] = "Completada";
    EstadoReserva["Cancelada"] = "Cancelada";
})(EstadoReserva || (exports.EstadoReserva = EstadoReserva = {}));
