import * as readline from "readline";
import { Biblioteca } from "./biblioteca";
import { CategoriaLibro, TipoUsuario } from "./interfaces";

console.log("\n============================================");
console.log(" Biblioteca Central Universidad TEC ");
console.log("============================================\n");

const biblioteca = new Biblioteca("Biblioteca Central Universidad TEC");

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

            rl.question(
              "Tipo de usuario (Estudiante, Profesor, Administrador): ",

              (tipoStr) => {
                const tipo = TipoUsuario[tipoStr as keyof typeof TipoUsuario];

                if (!tipo) {
                  console.log("Tipo de usuario inválido.");
                } else {
                  biblioteca.registrarUsuario(nombre, email, tipo);
                }
                mostrarMenu();
              },
            );
          });
        });
      break;

      case "2":
        rl.question("ISBN del libro: ", (isbn) => {

          rl.question("Título del libro: ", (titulo) => {

            rl.question("Autor del libro: ", (autor) => {

             
              rl.question(
             
                "Categoría (Ficcion, NoFiccion, Ciencia, Tecnologia, Historia, Arte): ",
             
                (catStr) => {
             
                  const categoria =
             
                  CategoriaLibro[catStr as keyof typeof CategoriaLibro];


                  
                  if (!categoria) {
                  
                    console.log("Categoría inválida.");
                  
                    mostrarMenu();
                  
                    return;
                  
                  }


                  
                  rl.question("Año de publicación: ", (añoStr) => {
                  
                    const año = Number(añoStr);


                    
                    rl.question("Número de copias: ", (copiasStr) => {
                    
                      const copias = Number(copiasStr);


                      
                      biblioteca.agregarLibro(
                      
                        isbn,
                      
                        titulo,
                      
                        autor,
                      
                        categoria,
                      
                        año,
                      
                        copias,
                      
                      );
                      
                      mostrarMenu();
                    });
                  });
                },
              );
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
              const prestamo = biblioteca.realizarPrestamo(
                usuarioId,
                isbn,
                dias,
              );

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
        rl.question(
          "Categoría a buscar (Ficcion, NoFiccion, Ciencia, Tecnologia, Historia, Arte): ",
          (catStr) => {
            const categoria =
              CategoriaLibro[catStr as keyof typeof CategoriaLibro];

            if (!categoria) {
              console.log("Categoría inválida.");
            } else {
              const librosEncontrados =
                biblioteca.buscarLibrosPorCategoria(categoria);
              console.log(
                `\nLibros encontrados en la categoría: ${categoria} ---`,
              );

              if (librosEncontrados.length === 0) {
                console.log("No se encontraron libros en esta categoría.");
              } else {
                librosEncontrados.forEach((libro) =>
                  console.log(`${libro.titulo}`),
                );
              }
            }
            mostrarMenu();
          },
        );
      break;

      case "10":
        rl.question(
          "Nombre del autor a buscar: ",
          (autorStr) => {
            const librosEncontrados = biblioteca.buscarLibrosPorAutor(autorStr);
            console.log(`\n-Libros encontrados del autor: ${autorStr}`);

            if (librosEncontrados.length === 0) {
              console.log("No se encontraron libros de este autor.");
            } else {
              librosEncontrados.forEach((libro) =>
                console.log(`${libro.titulo}`),
              );
            }
            mostrarMenu();
          },
        );
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

mostrarMenu();
