"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prestamo = exports.Libro = exports.Usuario = void 0;
var interfaces_1 = require("./interfaces");
var Usuario = /** @class */ (function () {
    function Usuario(id, nombre, email, tipo) {
        this.id = id;
        this._nombre = "";
        this._email = "";
        this.nombre = nombre;
        this.email = email;
        this.tipo = tipo;
        this.fechaRegistro = new Date();
        this.prestamosActivos = 0;
    }
    Object.defineProperty(Usuario.prototype, "nombre", {
        get: function () {
            return this._nombre;
        },
        set: function (valor) {
            if (valor.length >= 3) {
                this._nombre = valor;
            }
            else {
                console.error("Error: El nombre '".concat(valor, "' debe tener al menos 3 caracteres."));
                this._nombre = valor;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Usuario.prototype, "email", {
        get: function () {
            return this._email;
        },
        set: function (valor) {
            var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (regexEmail.test(valor)) {
                this._email = valor;
            }
            else {
                console.error("Error: El email '".concat(valor, "' no tiene un formato v\u00E1lido."));
                this._email = valor;
            }
        },
        enumerable: false,
        configurable: true
    });
    Usuario.prototype.obtenerInformacion = function () {
        return "Usuario #".concat(this.id, ": ").concat(this.nombre, " (").concat(this.tipo, ") - ").concat(this.email);
    };
    Usuario.prototype.puedeRealizarPrestamo = function () {
        var limite = 0;
        switch (this.tipo) {
            case interfaces_1.TipoUsuario.Estudiante:
                limite = 3;
                break;
            case interfaces_1.TipoUsuario.Profesor:
                limite = 5;
                break;
            case interfaces_1.TipoUsuario.Administrador:
                limite = 10;
                break;
        }
        return this.prestamosActivos < limite;
    };
    return Usuario;
}());
exports.Usuario = Usuario;
var Libro = /** @class */ (function () {
    function Libro(isbn, titulo, autor, categoria, añoPublicacion, copiasTotales) {
        this.id = isbn;
        this.tipo = interfaces_1.TipoMaterial.Libro;
        this.isbn = isbn;
        this.titulo = titulo;
        this.autor = autor;
        this.categoria = categoria;
        this.añoPublicacion = añoPublicacion;
        this.copiasTotales = copiasTotales;
        this._copiasDisponibles = copiasTotales;
        this.estado = interfaces_1.EstadoLibro.Disponible;
    }
    Object.defineProperty(Libro.prototype, "copiasDisponibles", {
        get: function () {
            return this._copiasDisponibles;
        },
        enumerable: false,
        configurable: true
    });
    Libro.prototype.estaDisponible = function () {
        return this._copiasDisponibles > 0;
    };
    Libro.prototype.prestarCopia = function () {
        if (this.estaDisponible()) {
            this._copiasDisponibles--;
            if (this._copiasDisponibles === 0) {
                this.estado = interfaces_1.EstadoLibro.Prestado;
            }
            return true;
        }
        return false;
    };
    Libro.prototype.devolverCopia = function () {
        if (this._copiasDisponibles < this.copiasTotales) {
            this._copiasDisponibles++;
            this.estado = interfaces_1.EstadoLibro.Disponible;
        }
    };
    Libro.prototype.obtenerInformacion = function () {
        return "\uD83D\uDCD6 Libro: ".concat(this.titulo, " | \u270D\uFE0F Autor: ").concat(this.autor, " | \uD83D\uDCDA Categor\u00EDa: ").concat(this.categoria, " | \u25FB Estado: ").concat(this.estado, " (").concat(this.copiasDisponibles, "/").concat(this.copiasTotales, " disponible.)");
    };
    return Libro;
}());
exports.Libro = Libro;
var Prestamo = /** @class */ (function () {
    function Prestamo(id, usuario, material, diasPrestamo) {
        if (diasPrestamo === void 0) { diasPrestamo = 14; }
        this.id = id;
        this.usuario = usuario;
        this.material = material;
        this.fechaPrestamo = new Date();
        this.fechaDevolucionEsperada = new Date(this.fechaPrestamo);
        this.fechaDevolucionEsperada.setDate(this.fechaDevolucionEsperada.getDate() + diasPrestamo);
        this._estado = interfaces_1.EstadoPrestamo.Activo;
    }
    Object.defineProperty(Prestamo.prototype, "estado", {
        get: function () {
            this.actualizarEstado();
            return this._estado;
        },
        enumerable: false,
        configurable: true
    });
    Prestamo.prototype.actualizarEstado = function () {
        var hoy = new Date();
        if (this._estado === interfaces_1.EstadoPrestamo.Activo && hoy > this.fechaDevolucionEsperada) {
            this._estado = interfaces_1.EstadoPrestamo.Vencido;
        }
    };
    Prestamo.prototype.realizarDevolucion = function () {
        this.fechaDevolucionReal = new Date();
        this._estado = interfaces_1.EstadoPrestamo.Devuelto;
    };
    Prestamo.prototype.diasRetraso = function () {
        var fechaComparacion = this.fechaDevolucionReal || new Date();
        if (fechaComparacion > this.fechaDevolucionEsperada) {
            var milisegundosRetraso = fechaComparacion.getTime() - this.fechaDevolucionEsperada.getTime();
            return Math.floor(milisegundosRetraso / (1000 * 60 * 60 * 24));
        }
        return 0;
    };
    Prestamo.prototype.calcularMulta = function (tarifaDiaria) {
        if (tarifaDiaria === void 0) { tarifaDiaria = 5; }
        return this.diasRetraso() * tarifaDiaria;
    };
    Prestamo.prototype.obtenerInformacion = function () {
        var resumen = "Pr\u00E9stamo #".concat(this.id, " | Usuario: ").concat(this.usuario.nombre, " | Material: ").concat(this.material.titulo, " | Estado: ").concat(this.estado);
        var multa = this.calcularMulta();
        if (multa > 0) {
            resumen += " | Multa acumulada de: $".concat(multa, " d\u00F3lares por esar retradado ").concat(this.diasRetraso(), " d\u00EDas.");
        }
        return resumen;
    };
    return Prestamo;
}());
exports.Prestamo = Prestamo;
