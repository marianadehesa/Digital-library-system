"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Biblioteca = void 0;
const fs = __importStar(require("fs"));
const clases_1 = require("./clases");
const interfaces_1 = require("./interfaces");
class Biblioteca {
    nombre;
    usuarios;
    libros;
    prestamos;
    contadorPrestamos;
    reservas;
    contadorReservas;
    constructor(nombre) {
        this.nombre = nombre;
        this.usuarios = new Map();
        this.libros = new Map();
        this.prestamos = new Map();
        this.reservas = new Map();
        this.contadorPrestamos = 1;
        this.contadorReservas = 1;
    }
    // Métodos de Gestión de Usuarios
    registrarUsuario(nombre, email, tipo) {
        const id = this.usuarios.size + 1;
        const nuevoUsuario = new clases_1.Usuario(id, nombre, email, tipo);
        this.usuarios.set(id, nuevoUsuario);
        console.log(`Usuario ${nuevoUsuario.nombre} registrado. (ID: ${id})`);
        return nuevoUsuario;
    }
    obtenerUsuario(id) {
        return this.usuarios.get(id);
    }
    // Métodos de Gestión de Libros
    agregarLibro(isbn, titulo, autor, categoria, año, copias) {
        const nuevoLibro = new clases_1.Libro(isbn, titulo, autor, categoria, año, copias);
        this.libros.set(isbn, nuevoLibro);
        console.log(`Libro "${titulo}" agregado.`);
        return nuevoLibro;
    }
    obtenerLibro(isbn) {
        return this.libros.get(isbn);
    }
    buscarLibrosPorCategoria(categoria) {
        return Array.from(this.libros.values()).filter(libro => libro.categoria === categoria);
    }
    buscarLibrosPorAutor(autorBusqueda) {
        const autor = autorBusqueda.toLowerCase();
        return Array.from(this.libros.values()).filter(libro => libro.autor.toLowerCase().includes(autor));
    }
    // Métodos de Gestión de Préstamos
    realizarPrestamo(usuarioId, isbn, dias = 14) {
        const usuario = this.obtenerUsuario(usuarioId);
        const libro = this.obtenerLibro(isbn);
        if (!usuario) {
            console.error("Error: Usuario no encontrado.");
            return null;
        }
        if (!libro) {
            console.error("Error: Libro no encontrado.");
            return null;
        }
        if (!usuario.puedeRealizarPrestamo()) {
            console.error(`Error: El usuario ${usuario.nombre} alcanzó su límite de préstamos y no puede realizar un nuevo préstamo.`);
            return null;
        }
        if (!libro.estaDisponible()) {
            console.warn(`El libro "${libro.titulo}" no tiene copias disponibles.`);
            console.log(`Tip: Puedes reservar el libro para apartarlo.`);
            return null;
        }
        const nuevoPrestamo = new clases_1.Prestamo(this.contadorPrestamos, usuario, libro, dias);
        this.prestamos.set(this.contadorPrestamos, nuevoPrestamo);
        libro.prestarCopia();
        usuario.prestamosActivos++;
        console.log(`Préstamo #${this.contadorPrestamos} realizado con éxito. Fecha de devolución: ${nuevoPrestamo.fechaDevolucionEsperada.toDateString()}`);
        this.contadorPrestamos++;
        return nuevoPrestamo;
    }
    devolverPrestamo(idPrestamo) {
        const prestamo = this.prestamos.get(idPrestamo);
        if (!prestamo) {
            console.error("Error: Préstamo no encontrado.");
            return;
        }
        if (prestamo.estado === interfaces_1.EstadoPrestamo.Devuelto) {
            console.error("Error: Este préstamo ya fue devuelto.");
            return;
        }
        prestamo.realizarDevolucion();
        const libro = prestamo.material;
        libro.devolverCopia();
        prestamo.usuario.prestamosActivos--;
        console.log(`Libro "${libro.titulo}" devuelto por: ${prestamo.usuario.nombre}.`);
        const multa = prestamo.calcularMulta();
        if (multa > 0) {
            console.log(`ATENCIÓN: Se generó una multa de $${multa} dólares por retraso.`);
        }
    }
    reservarLibro(usuarioId, isbn) {
        const usuario = this.obtenerUsuario(usuarioId);
        const libro = this.obtenerLibro(isbn);
        if (usuario && libro) {
            if (libro.copiasDisponibles > 0) {
                console.log("No es necesario reservar, hay copias disponibles para préstamo.");
                return;
            }
            const nuevaReserva = {
                id: this.contadorReservas++,
                usuario: usuario,
                material: libro,
                fechaReserva: new Date(),
                estado: interfaces_1.EstadoReserva.Pendiente
            };
            this.reservas.set(nuevaReserva.id, nuevaReserva);
            console.log(`Reserva #${nuevaReserva.id} creada para el libro: "${libro.titulo}". Te avisaremos cuando haya copias.`);
        }
    }
    // Métodos de Reportes
    generarReporteLibrosMasPrestados(top = 5) {
        console.log(`\n--- TOP ${top} LIBROS MÁS PRESTADOS ---`);
        const conteo = new Map();
        this.prestamos.forEach(prestamo => {
            const isbn = prestamo.material.id;
            const actual = conteo.get(isbn) || 0;
            conteo.set(isbn, actual + 1);
        });
        const ordenados = Array.from(conteo.entries()).sort((a, b) => b[1] - a[1]).slice(0, top);
        ordenados.forEach((item, index) => {
            const libro = this.obtenerLibro(item[0]);
            if (libro) {
                console.log(`${index + 1}. ${libro.titulo} - ${item[1]} préstamos`);
            }
        });
    }
    generarReportePrestamosActivos() {
        console.log("\n--- REPORTES DE PRÉSTAMOS ACTIVOS ---");
        const activos = Array.from(this.prestamos.values()).filter(p => p.estado === interfaces_1.EstadoPrestamo.Activo || p.estado === interfaces_1.EstadoPrestamo.Vencido);
        if (activos.length === 0) {
            console.log("No hay préstamos activos.");
        }
        activos.forEach(p => {
            console.log(p.obtenerInformacion());
        });
    }
    generarReportePrestamosVencidos() {
        console.log("\n--- REPORTES DE PRÉSTAMOS VENCIDOS ---");
        const vencidos = Array.from(this.prestamos.values()).filter(p => p.estado === interfaces_1.EstadoPrestamo.Vencido);
        if (vencidos.length === 0) {
            console.log("No hay préstamos vencidos.");
            return;
        }
        let totalMultas = 0;
        vencidos.forEach(p => {
            const multa = p.calcularMulta();
            totalMultas += multa;
            console.log(`El usuario: ${p.usuario.nombre} tiene el libro "${p.material.titulo}" con retraso. La multa es de: $${multa} dólares`);
        });
        console.log("-----------------------------------------");
        console.log(`La deuda total es de: $${totalMultas}`);
    }
    generarEstadisticasGenerales() {
        const totalLibros = this.libros.size;
        const copiasTotales = Array.from(this.libros.values()).reduce((sum, l) => sum + l.copiasTotales, 0);
        const copiasDisp = Array.from(this.libros.values()).reduce((sum, l) => sum + l.copiasDisponibles, 0);
        console.log(`
            📊 ESTADÍSTICAS GENERALES:\n
            👥 Usuarios Registrados: ${this.usuarios.size}\n
            📚 Títulos Diferentes:   ${totalLibros}\n
            📖 Copias (Total/Disp):  ${copiasTotales} / ${copiasDisp}\n
            🔄 Préstamos Totales:    ${this.prestamos.size}
        `);
    }
    guardarDatos() {
        const datos = {
            usuarios: Array.from(this.usuarios.entries()),
            libros: Array.from(this.libros.entries()),
            prestamos: Array.from(this.prestamos.entries())
        };
        fs.writeFileSync('RespaldoBiblioteca.json', JSON.stringify(datos, null, 2));
        console.log("Los datos fueron guardados de manera exitosa en 'RespaldoBiblioteca.json'");
    }
    cargarDatos() {
        if (!fs.existsSync('RespaldoBiblioteca.json'))
            return;
        const rawData = fs.readFileSync('RespaldoBiblioteca.json', 'utf-8');
        const datos = JSON.parse(rawData);
        this.usuarios = new Map();
        datos.usuarios.forEach(([id, u]) => {
            const usuario = new clases_1.Usuario(u.id, u._nombre, u._email, u.tipo);
            usuario.prestamosActivos = u.prestamosActivos;
            this.usuarios.set(Number(id), usuario);
        });
        this.libros = new Map();
        datos.libros.forEach(([isbn, l]) => {
            const libro = new clases_1.Libro(l.isbn, l.titulo, l.autor, l.categoria, l.añoPublicacion, l.copiasTotales);
            libro._copiasDisponibles = l._copiasDisponibles;
            this.libros.set(isbn, libro);
        });
        this.prestamos = new Map();
        datos.prestamos.forEach(([id, p]) => {
            const usuario = this.usuarios.get(p.usuario.id);
            const libro = this.libros.get(p.material.isbn);
            if (usuario && libro) {
                const prestamo = new clases_1.Prestamo(Number(id), usuario, libro, 14);
                prestamo.fechaPrestamo = new Date(p.fechaPrestamo);
                prestamo.fechaDevolucionEsperada = new Date(p.fechaDevolucionEsperada);
                prestamo._estado = p._estado;
                this.prestamos.set(Number(id), prestamo);
            }
            ;
        });
        this.contadorPrestamos = this.prestamos.size + 1;
        console.log("Datos cargados correctamente.");
    }
}
exports.Biblioteca = Biblioteca;
