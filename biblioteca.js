"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Biblioteca = void 0;
var fs = require("fs");
var clases_1 = require("./clases");
var interfaces_1 = require("./interfaces");
var Biblioteca = /** @class */ (function () {
    function Biblioteca(nombre) {
        this.nombre = nombre;
        this.usuarios = new Map();
        this.libros = new Map();
        this.prestamos = new Map();
        this.reservas = new Map();
        this.contadorPrestamos = 1;
        this.contadorReservas = 1;
    }
    // Métodos de Gestión de Usuarios
    Biblioteca.prototype.registrarUsuario = function (nombre, email, tipo) {
        var id = this.usuarios.size + 1;
        var nuevoUsuario = new clases_1.Usuario(id, nombre, email, tipo);
        this.usuarios.set(id, nuevoUsuario);
        console.log("Usuario ".concat(nuevoUsuario.nombre, " registrado. (ID: ").concat(id, ")"));
        return nuevoUsuario;
    };
    Biblioteca.prototype.obtenerUsuario = function (id) {
        return this.usuarios.get(id);
    };
    // Métodos de Gestión de Libros
    Biblioteca.prototype.agregarLibro = function (isbn, titulo, autor, categoria, año, copias) {
        var nuevoLibro = new clases_1.Libro(isbn, titulo, autor, categoria, año, copias);
        this.libros.set(isbn, nuevoLibro);
        console.log("Libro \"".concat(titulo, "\" agregado."));
        return nuevoLibro;
    };
    Biblioteca.prototype.obtenerLibro = function (isbn) {
        return this.libros.get(isbn);
    };
    Biblioteca.prototype.buscarLibrosPorCategoria = function (categoria) {
        return Array.from(this.libros.values()).filter(function (libro) { return libro.categoria === categoria; });
    };
    Biblioteca.prototype.buscarLibrosPorAutor = function (autorBusqueda) {
        var autor = autorBusqueda.toLowerCase();
        return Array.from(this.libros.values()).filter(function (libro) {
            return libro.autor.toLowerCase().includes(autor);
        });
    };
    // Métodos de Gestión de Préstamos
    Biblioteca.prototype.realizarPrestamo = function (usuarioId, isbn, dias) {
        if (dias === void 0) { dias = 14; }
        var usuario = this.obtenerUsuario(usuarioId);
        var libro = this.obtenerLibro(isbn);
        // Validaciones para el préstamo
        if (!usuario) {
            console.error("Error: Usuario no encontrado.");
            return null;
        }
        if (!libro) {
            console.error("Error: Libro no encontrado.");
            return null;
        }
        if (!usuario.puedeRealizarPrestamo()) {
            console.error("Error: El usuario ".concat(usuario.nombre, " alcanz\u00F3 su l\u00EDmite de pr\u00E9stamos y no puede realizar un nuevo pr\u00E9stamo."));
            return null;
        }
        if (!libro.estaDisponible()) {
            console.warn("El libro \"".concat(libro.titulo, "\" no tiene copias disponibles."));
            console.log("Tip: Puedes reservar el libro para apartarlo.");
            return null;
        }
        var nuevoPrestamo = new clases_1.Prestamo(this.contadorPrestamos, usuario, libro, dias);
        this.prestamos.set(this.contadorPrestamos, nuevoPrestamo);
        libro.prestarCopia();
        usuario.prestamosActivos++;
        console.log("Pr\u00E9stamo #".concat(this.contadorPrestamos, " realizado con \u00E9xito. Fecha de devoluci\u00F3n: ").concat(nuevoPrestamo.fechaDevolucionEsperada.toDateString()));
        this.contadorPrestamos++;
        return nuevoPrestamo;
    };
    Biblioteca.prototype.devolverPrestamo = function (idPrestamo) {
        var prestamo = this.prestamos.get(idPrestamo);
        if (!prestamo) {
            console.error("Error: Préstamo no encontrado.");
            return;
        }
        if (prestamo.estado === interfaces_1.EstadoPrestamo.Devuelto) {
            console.error("Error: Este préstamo ya fue devuelto.");
            return;
        }
        prestamo.realizarDevolucion();
        var libro = prestamo.material;
        libro.devolverCopia();
        prestamo.usuario.prestamosActivos--;
        console.log("Libro \"".concat(libro.titulo, "\" devuelto por: ").concat(prestamo.usuario.nombre, "."));
        var multa = prestamo.calcularMulta();
        if (multa > 0) {
            console.log("ATENCI\u00D3N: Se gener\u00F3 una multa de $".concat(multa, " d\u00F3lares por retraso."));
        }
    };
    Biblioteca.prototype.reservarLibro = function (usuarioId, isbn) {
        var usuario = this.obtenerUsuario(usuarioId);
        var libro = this.obtenerLibro(isbn);
        if (usuario && libro) {
            if (libro.copiasDisponibles > 0) {
                console.log("No es necesario reservar, hay copias disponibles para préstamo.");
                return;
            }
            var nuevaReserva = {
                id: this.contadorReservas++,
                usuario: usuario,
                material: libro,
                fechaReserva: new Date(),
                estado: interfaces_1.EstadoReserva.Pendiente
            };
            this.reservas.set(nuevaReserva.id, nuevaReserva);
            console.log("Reserva #".concat(nuevaReserva.id, " creada para el libro: \"").concat(libro.titulo, "\". Te avisaremos cuando haya copias."));
        }
    };
    // Métodos de Reportes
    Biblioteca.prototype.generarReporteLibrosMasPrestados = function (top) {
        var _this = this;
        if (top === void 0) { top = 5; }
        console.log("\n--- TOP ".concat(top, " LIBROS M\u00C1S PRESTADOS ---"));
        var conteo = new Map();
        this.prestamos.forEach(function (prestamo) {
            var isbn = prestamo.material.id;
            var actual = conteo.get(isbn) || 0;
            conteo.set(isbn, actual + 1);
        });
        var ordenados = Array.from(conteo.entries()).sort(function (a, b) { return b[1] - a[1]; }).slice(0, top);
        ordenados.forEach(function (item, index) {
            var libro = _this.obtenerLibro(item[0]);
            if (libro) {
                console.log("".concat(index + 1, ". ").concat(libro.titulo, " - ").concat(item[1], " pr\u00E9stamos"));
            }
        });
    };
    Biblioteca.prototype.generarReportePrestamosActivos = function () {
        console.log("\n--- REPORTES DE PRÉSTAMOS ACTIVOS ---");
        var activos = Array.from(this.prestamos.values()).filter(function (p) { return p.estado === interfaces_1.EstadoPrestamo.Activo || p.estado === interfaces_1.EstadoPrestamo.Vencido; });
        if (activos.length === 0) {
            console.log("No hay préstamos activos.");
        }
        activos.forEach(function (p) {
            console.log(p.obtenerInformacion());
        });
    };
    Biblioteca.prototype.generarReportePrestamosVencidos = function () {
        console.log("\n--- REPORTES DE PRÉSTAMOS VENCIDOS ---");
        var vencidos = Array.from(this.prestamos.values()).filter(function (p) { return p.estado === interfaces_1.EstadoPrestamo.Vencido; });
        if (vencidos.length === 0) {
            console.log("No hay préstamos vencidos.");
            return;
        }
        var totalMultas = 0;
        vencidos.forEach(function (p) {
            var multa = p.calcularMulta();
            totalMultas += multa;
            console.log("El usuario: ".concat(p.usuario.nombre, " tiene el libro \"").concat(p.material.titulo, "\" con retraso. La multa es de: $").concat(multa, " d\u00F3lares"));
        });
        console.log("-----------------------------------------");
        console.log("La deuda total es de: $".concat(totalMultas));
    };
    Biblioteca.prototype.generarEstadisticasGenerales = function () {
        var totalLibros = this.libros.size;
        var copiasTotales = Array.from(this.libros.values()).reduce(function (sum, l) { return sum + l.copiasTotales; }, 0);
        var copiasDisp = Array.from(this.libros.values()).reduce(function (sum, l) { return sum + l.copiasDisponibles; }, 0);
        console.log("\n            \uD83D\uDCCA ESTAD\u00CDSTICAS GENERALES:\n\n            \uD83D\uDC65 Usuarios Registrados: ".concat(this.usuarios.size, "\n\n            \uD83D\uDCDA T\u00EDtulos Diferentes:   ").concat(totalLibros, "\n\n            \uD83D\uDCD6 Copias (Total/Disp):  ").concat(copiasTotales, " / ").concat(copiasDisp, "\n\n            \uD83D\uDD04 Pr\u00E9stamos Totales:    ").concat(this.prestamos.size, "\n        "));
    };
    Biblioteca.prototype.guardarDatos = function () {
        var datos = {
            usuarios: Array.from(this.usuarios.entries()),
            libros: Array.from(this.libros.entries()),
            prestamos: Array.from(this.prestamos.entries())
        };
        fs.writeFileSync('datos_biblioteca.json', JSON.stringify(datos, null, 2));
        console.log("Los datos fueron guardados de manera exitosa en 'datos_biblioteca.json'");
    };
    Biblioteca.prototype.cargarDatos = function () {
        var _this = this;
        if (!fs.existsSync('datos_biblioteca.json'))
            return;
        var rawData = fs.readFileSync('datos_biblioteca.json', 'utf-8');
        var datos = JSON.parse(rawData);
        // ====== USUARIOS ======
        this.usuarios = new Map();
        datos.usuarios.forEach(function (_a) {
            var id = _a[0], u = _a[1];
            var usuario = new clases_1.Usuario(u.id, u._nombre, u._email, u.tipo);
            usuario.prestamosActivos = u.prestamosActivos;
            _this.usuarios.set(Number(id), usuario);
        });
        // ====== LIBROS ======
        this.libros = new Map();
        datos.libros.forEach(function (_a) {
            var isbn = _a[0], l = _a[1];
            var libro = new clases_1.Libro(l.isbn, l.titulo, l.autor, l.categoria, l.añoPublicacion, l.copiasTotales);
            // restaurar copias disponibles
            libro._copiasDisponibles = l._copiasDisponibles;
            _this.libros.set(isbn, libro);
        });
        // ====== PRÉSTAMOS ======
        this.prestamos = new Map();
        datos.prestamos.forEach(function (_a) {
            var id = _a[0], p = _a[1];
            var usuario = _this.usuarios.get(p.usuario.id);
            var libro = _this.libros.get(p.material.isbn);
            if (usuario && libro) {
                var prestamo = new clases_1.Prestamo(Number(id), usuario, libro, 14 // días por defecto (no importa porque luego restauramos fechas)
                );
                prestamo.fechaPrestamo = new Date(p.fechaPrestamo);
                prestamo.fechaDevolucionEsperada = new Date(p.fechaDevolucionEsperada);
                prestamo._estado = p._estado;
                _this.prestamos.set(Number(id), prestamo);
            }
        });
        // restaurar contador
        this.contadorPrestamos = this.prestamos.size + 1;
        console.log("Datos cargados correctamente.");
    };
    return Biblioteca;
}());
exports.Biblioteca = Biblioteca;
