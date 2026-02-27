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
const readline = __importStar(require("readline"));
const biblioteca_1 = require("./biblioteca");
const interfaces_1 = require("./interfaces");
console.log("\n============================================");
console.log(" Biblioteca Central Universidad TEC ");
console.log("============================================\n");
const biblioteca = new biblioteca_1.Biblioteca("Biblioteca Central Universidad TEC");
biblioteca.cargarDatos();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function mostrarMenu() {
    console.log("\n--------------------------------------------------------");
    console.log(" Menú interactivo de la Biblioteca Central Universidad TEC");
    console.log("----------------------------------------------------------\n");
    console.log("1. Registrar usuario");
    console.log("2. Agregar libro");
    console.log("3. Realizar préstamo");
    console.log("4. Devolver préstamo");
    console.log("5. Ver préstamos activos");
    console.log("6. Ver préstamos vencidos");
    console.log("7. Top 3 libros más prestados");
    console.log("8. Ver estadísticas generales");
    console.log("9. Buscar libros por categoría");
    console.log("10. Buscar libros por autor");
    console.log("11. Salir");
    rl.question("Seleccione una opción: ", (opcion) => {
        switch (opcion) {
            case "1":
                rl.question("Nombre del usuario: ", (nombre) => {
                    rl.question("Email del usuario: ", (email) => {
                        rl.question("Tipo de usuario (Estudiante, Profesor, Administrador): ", (tipoStr) => {
                            const tipo = interfaces_1.TipoUsuario[tipoStr];
                            if (!tipo) {
                                console.log("Tipo de usuario inválido.");
                            }
                            else {
                                biblioteca.registrarUsuario(nombre, email, tipo);
                            }
                            mostrarMenu();
                        });
                    });
                });
                break;
            case "2":
                rl.question("ISBN del libro: ", (isbn) => {
                    rl.question("Título del libro: ", (titulo) => {
                        rl.question("Autor del libro: ", (autor) => {
                            rl.question("Categoría (Ficcion, NoFiccion, Ciencia, Tecnologia, Historia, Arte): ", (catStr) => {
                                const categoria = interfaces_1.CategoriaLibro[catStr];
                                if (!categoria) {
                                    console.log("Categoría inválida.");
                                    mostrarMenu();
                                    return;
                                }
                                rl.question("Año de publicación: ", (añoStr) => {
                                    const año = Number(añoStr);
                                    rl.question("Número de copias: ", (copiasStr) => {
                                        const copias = Number(copiasStr);
                                        biblioteca.agregarLibro(isbn, titulo, autor, categoria, año, copias);
                                        mostrarMenu();
                                    });
                                });
                            });
                        });
                    });
                });
                break;
            case "3":
                rl.question("ID del usuario: ", (idStr) => {
                    const usuarioId = Number(idStr);
                    rl.question("ISBN del libro: ", (isbn) => {
                        rl.question("Días de préstamo (por defecto 14): ", (diasStr) => {
                            const dias = Number(diasStr) || 14;
                            const prestamo = biblioteca.realizarPrestamo(usuarioId, isbn, dias);
                            if (!prestamo) {
                                console.log("No se pudo realizar el préstamo.");
                            }
                            mostrarMenu();
                        });
                    });
                });
                break;
            case "4":
                rl.question("ID del préstamo a devolver: ", (idStr) => {
                    const idPrestamo = Number(idStr);
                    biblioteca.devolverPrestamo(idPrestamo);
                    mostrarMenu();
                });
                break;
            case "5":
                biblioteca.generarReportePrestamosActivos();
                mostrarMenu();
                break;
            case "6":
                biblioteca.generarReportePrestamosVencidos();
                mostrarMenu();
                break;
            case "7":
                biblioteca.generarReporteLibrosMasPrestados(3);
                mostrarMenu();
                break;
            case "8":
                biblioteca.generarEstadisticasGenerales();
                mostrarMenu();
                break;
            case "9":
                rl.question("Categoría a buscar (Ficcion, NoFiccion, Ciencia, Tecnologia, Historia, Arte): ", (catStr) => {
                    const categoria = interfaces_1.CategoriaLibro[catStr];
                    if (!categoria) {
                        console.log("❌ Categoría inválida.");
                    }
                    else {
                        const librosEncontrados = biblioteca.buscarLibrosPorCategoria(categoria);
                        console.log(`\n--- 🔎 Libros encontrados en la categoría: ${categoria} ---`);
                        if (librosEncontrados.length === 0) {
                            console.log("No se encontraron libros en esta categoría.");
                        }
                        else {
                            librosEncontrados.forEach((libro) => console.log(`📖 ${libro.titulo}`));
                        }
                    }
                    mostrarMenu();
                });
                break;
            case "10":
                rl.question("Nombre del autor a buscar (ej. 'Robert C. Martin'): ", (autorStr) => {
                    const librosEncontrados = biblioteca.buscarLibrosPorAutor(autorStr);
                    console.log(`\n---Libros encontrados del autor: ${autorStr} ---`);
                    if (librosEncontrados.length === 0) {
                        console.log("No se encontraron libros de este autor.");
                    }
                    else {
                        librosEncontrados.forEach((libro) => console.log(`📖 ${libro.titulo}`));
                    }
                    mostrarMenu();
                });
                break;
            case "11":
                console.log("Guardando datos y saliendo del sistema...");
                biblioteca.guardarDatos();
                rl.close();
                break;
            default:
                console.log("Opción inválida.");
                mostrarMenu();
        }
    });
}
// Inicia el menú
mostrarMenu();
