"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var biblioteca_1 = require("./biblioteca");
var interfaces_1 = require("./interfaces");
console.log("\n============================================");
console.log(" SISTEMA DE GESTIÓN DE BIBLIOTECA DIGITAL");
console.log(" Biblioteca Central Universidad TEC ");
console.log("============================================\n");
var biblioteca = new biblioteca_1.Biblioteca("Biblioteca Central Universidad TEC");
biblioteca.cargarDatos();
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function mostrarMenu() {
    console.log("\n-----------------------------");
    console.log(" Menú interactivo de Biblioteca");
    console.log("-------------------------------");
    console.log("1. Registrar usuario");
    console.log("2. Agregar libro");
    console.log("3. Realizar préstamo");
    console.log("4. Devolver préstamo");
    console.log("5. Ver préstamos activos");
    console.log("6. Ver préstamos vencidos");
    console.log("7. Top 3 libros más prestados");
    console.log("8. Ver estadísticas generales");
    console.log("9. Salir");
    rl.question("Seleccione una opción: ", function (opcion) {
        switch (opcion) {
            case "1":
                rl.question("Nombre del usuario: ", function (nombre) {
                    rl.question("Email del usuario: ", function (email) {
                        rl.question("Tipo de usuario (Estudiante, Profesor, Administrador): ", function (tipoStr) {
                            var tipo = interfaces_1.TipoUsuario[tipoStr];
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
                rl.question("ISBN del libro: ", function (isbn) {
                    rl.question("Título del libro: ", function (titulo) {
                        rl.question("Autor del libro: ", function (autor) {
                            rl.question("Categoría (Ficcion, NoFiccion, Ciencia, Tecnologia, Historia, Arte): ", function (catStr) {
                                var categoria = interfaces_1.CategoriaLibro[catStr];
                                if (!categoria) {
                                    console.log("Categoría inválida.");
                                    mostrarMenu();
                                    return;
                                }
                                rl.question("Año de publicación: ", function (añoStr) {
                                    var año = Number(añoStr);
                                    rl.question("Número de copias: ", function (copiasStr) {
                                        var copias = Number(copiasStr);
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
                rl.question("ID del usuario: ", function (idStr) {
                    var usuarioId = Number(idStr);
                    rl.question("ISBN del libro: ", function (isbn) {
                        rl.question("Días de préstamo (por defecto 14): ", function (diasStr) {
                            var dias = Number(diasStr) || 14;
                            var prestamo = biblioteca.realizarPrestamo(usuarioId, isbn, dias);
                            if (!prestamo) {
                                console.log("No se pudo realizar el préstamo.");
                            }
                            mostrarMenu();
                        });
                    });
                });
                break;
            case "4":
                rl.question("ID del préstamo a devolver: ", function (idStr) {
                    var idPrestamo = Number(idStr);
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
