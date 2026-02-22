"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prestamo = exports.Libro = exports.Usuario = void 0;
const interfaces_1 = require("./interfaces");
class Usuario {
    id;
    _nombre;
    _email;
    tipo;
    fechaRegistro;
    prestamosActivos;
    constructor(id, nombre, email, tipo) {
        this.id = id;
        this._nombre = "";
        this._email = "";
        this.nombre = nombre;
        this.email = email;
        this.tipo = tipo;
        this.fechaRegistro = new Date();
        this.prestamosActivos = 0;
    }
    get nombre() {
        return this._nombre;
    }
    set nombre(valor) {
        if (valor.length >= 3) {
            this._nombre = valor;
        }
        else {
            console.error(`Error: El nombre '${valor}' debe tener al menos 3 caracteres.`);
            this._nombre = valor;
        }
    }
    get email() {
        return this._email;
    }
    set email(valor) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (regexEmail.test(valor)) {
            this._email = valor;
        }
        else {
            console.error(`Error: El email '${valor}' no tiene un formato válido.`);
            this._email = valor;
        }
    }
    obtenerInformacion() {
        return `Usuario #${this.id}: ${this.nombre} (${this.tipo}) - ${this.email}`;
    }
    puedeRealizarPrestamo() {
        let limite = 0;
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
    }
}
exports.Usuario = Usuario;
class Libro {
    id;
    tipo;
    isbn;
    titulo;
    autor;
    categoria;
    añoPublicacion;
    _copiasDisponibles;
    copiasTotales;
    estado;
    constructor(isbn, titulo, autor, categoria, añoPublicacion, copiasTotales) {
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
    get copiasDisponibles() {
        return this._copiasDisponibles;
    }
    estaDisponible() {
        return this._copiasDisponibles > 0;
    }
    prestarCopia() {
        if (this.estaDisponible()) {
            this._copiasDisponibles--;
            if (this._copiasDisponibles === 0) {
                this.estado = interfaces_1.EstadoLibro.Prestado;
            }
            return true;
        }
        return false;
    }
    devolverCopia() {
        if (this._copiasDisponibles < this.copiasTotales) {
            this._copiasDisponibles++;
            this.estado = interfaces_1.EstadoLibro.Disponible;
        }
    }
    obtenerInformacion() {
        return `📖 Libro: ${this.titulo} | ✍️ Autor: ${this.autor} | 📚 Categoría: ${this.categoria} | ◻ Estado: ${this.estado} (${this.copiasDisponibles}/${this.copiasTotales} disponible.)`;
    }
}
exports.Libro = Libro;
class Prestamo {
    id;
    usuario;
    material;
    fechaPrestamo;
    fechaDevolucionEsperada;
    fechaDevolucionReal;
    _estado;
    constructor(id, usuario, material, diasPrestamo = 14) {
        this.id = id;
        this.usuario = usuario;
        this.material = material;
        this.fechaPrestamo = new Date();
        this.fechaDevolucionEsperada = new Date(this.fechaPrestamo);
        this.fechaDevolucionEsperada.setDate(this.fechaDevolucionEsperada.getDate() + diasPrestamo);
        this._estado = interfaces_1.EstadoPrestamo.Activo;
    }
    get estado() {
        this.actualizarEstado();
        return this._estado;
    }
    actualizarEstado() {
        const hoy = new Date();
        if (this._estado === interfaces_1.EstadoPrestamo.Activo && hoy > this.fechaDevolucionEsperada) {
            this._estado = interfaces_1.EstadoPrestamo.Vencido;
        }
    }
    realizarDevolucion() {
        this.fechaDevolucionReal = new Date();
        this._estado = interfaces_1.EstadoPrestamo.Devuelto;
    }
    diasRetraso() {
        const fechaComparacion = this.fechaDevolucionReal || new Date();
        if (fechaComparacion > this.fechaDevolucionEsperada) {
            const milisegundosRetraso = fechaComparacion.getTime() - this.fechaDevolucionEsperada.getTime();
            return Math.floor(milisegundosRetraso / (1000 * 60 * 60 * 24));
        }
        return 0;
    }
    calcularMulta(tarifaDiaria = 5) {
        return this.diasRetraso() * tarifaDiaria;
    }
    obtenerInformacion() {
        let resumen = `Préstamo #${this.id} | Usuario: ${this.usuario.nombre} | Material: ${this.material.titulo} | Estado: ${this.estado}`;
        const multa = this.calcularMulta();
        if (multa > 0) {
            resumen += ` | Multa acumulada de: $${multa} dólares por esar retradado ${this.diasRetraso()} días.`;
        }
        return resumen;
    }
}
exports.Prestamo = Prestamo;
