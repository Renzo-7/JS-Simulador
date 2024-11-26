// Calculo de nota final de alumnos ingresados

function agregarAlumno(alumno) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];

      let alumnoRepetido = alumnos.some(
        (element) =>
          element.nombre.toLowerCase() === alumno.nombre.toLowerCase()
      );

      if (alumnoRepetido) {
        reject("El alumno ya existe");
      } else {
        alumnos.push(alumno);
        localStorage.setItem("alumnos", JSON.stringify(alumnos));

        resolve(alumno);
      }
    }, 2000);
  });
}

document.getElementById("calcular").addEventListener("click", () => {
  const nombre = document.getElementById("nombre").value;
  const nota1 = parseFloat(document.getElementById("nota1").value);
  const nota2 = parseFloat(document.getElementById("nota2").value);
  const nota3 = parseFloat(document.getElementById("nota3").value);

  if (isNaN(nota1) || isNaN(nota2) || isNaN(nota3)) {
    alert("Por favor, ingrese todas las notas.");
    return;
  }

  const promedio = (nota1 + nota2 + nota3) / 3;
  const clasificacion = clasificarPromedio(promedio);

  const alumno = {
    id: Date.now(),
    nombre,
    notas: [nota1, nota2, nota3],
    promedio,
    clasificacion,
  };

  agregarAlumno(alumno)
    .then((alumnoAgregado) => {
      Swal.fire({
        icon: "success",
        title: "¡Alumno agregado!",
        text: `${alumnoAgregado.nombre} ha sido agregado con éxito.`,
        confirmButtonText: "Aceptar",
      });

      actualizarLista();
      actualizarPromedioClase();
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: error,
        confirmButtonText: "Aceptar",
      });
    });
});

function calcularPromedio(nota1, nota2, nota3) {
  return (nota1 + nota2 + nota3) / 3;
}

function clasificarPromedio(promedio) {
  if (promedio >= 9) return "Excelente";
  if (promedio >= 8) return "Muy Bien";
  if (promedio >= 6) return "Aprobado";
  return "Desaprobado";
}

function mostrarResultados(alumno) {
  const resultadosDiv = document.getElementById("resultados");

  const alumnoItem = document.createElement("li");
  alumnoItem.classList.add("list-group-item");

  if (alumno.clasificacion === "Desaprobado") {
    alumnoItem.classList.add("list-group-item-danger");
  } else {
    alumnoItem.classList.add("list-group-item-success");
  }

  alumnoItem.innerHTML = `
        <span>
          <strong>Alumno:</strong> ${alumno.nombre} | 
          <strong>Promedio:</strong> ${alumno.promedio.toFixed(2)} | 
          <strong>Clasificación:</strong> ${alumno.clasificacion}
        </span>
      `;

  const botonEliminar = document.createElement("button");
  botonEliminar.classList.add("btn", "btn-danger", "btn-sm");
  botonEliminar.textContent = "Eliminar";
  botonEliminar.onclick = () => {
    eliminarAlumno(alumno.id);
    actualizarPromedioClase();
  };

  alumnoItem.appendChild(botonEliminar);
  resultadosDiv.appendChild(alumnoItem);
}

function guardarEnLocalStorage(alumno) {
  let alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];

  let alumnoRepetido = alumnos.some(
    (element) => element.nombre.toLowerCase() === alumno.nombre.toLowerCase()
  );

  if (alumnoRepetido) {
    Swal.fire({
      icon: "error",
      title: "¡Error!",
      text: "El alumno ya existe",
      confirmbuttonText: "Aceptar",
    });
    return;
  }

  alumnos.push(alumno);
  localStorage.setItem("alumnos", JSON.stringify(alumnos));

  Swal.fire({
    icon: "success",
    title: "¡Alumno agregado!",
    text: `${alumno.nombre} ha sido agregado con éxito.`,
    confirmButtonText: "Aceptar",
  });

  actualizarLista();
  actualizarPromedioClase();
}

function eliminarAlumno(id) {
  const alumno = JSON.parse(localStorage.getItem("alumnos")).find(
    (a) => a.id === id
  );

  Swal.fire({
    title: `¿Estás seguro de eliminar a ${alumno.nombre}?`,
    text: "¡Esta acción no se puede deshacer!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      let alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];
      alumnos = alumnos.filter((alumno) => alumno.id !== id);
      localStorage.setItem("alumnos", JSON.stringify(alumnos));

      Swal.fire({
        icon: "success",
        title: "¡Alumno eliminado!",
        text: `${alumno.nombre} ha sido eliminado.`,
        confirmButtonText: "Aceptar",
      });

      actualizarLista();
      actualizarPromedioClase();
    }
  });
}

function actualizarLista() {
  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = "";
  const alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];

  alumnos.forEach((alumno) => {
    mostrarResultados(alumno);
  });
}

function calcularPromedioClase() {
  const alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];
  if (alumnos.length === 0) return 0;

  const totalPromedios = alumnos.reduce(
    (total, alumno) => total + alumno.promedio,
    0
  );
  return totalPromedios / alumnos.length;
}

function actualizarPromedioClase() {
  const promedioClase = calcularPromedioClase();
  const promedioClaseDiv = document.getElementById("promedio-clase");
  promedioClaseDiv.textContent = `Promedio de la clase: ${promedioClase.toFixed(
    2
  )}`;
}

function obtenerGraduados() {
  const url = "data.json";

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al cargar la lista de graduados");
      }
      return response.json();
    })
    .then((graduados) => {
      mostrarGraduados(graduados);
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    });
}

function mostrarGraduados(graduados) {
  const listaGraduados = document.getElementById("lista-graduados");
  listaGraduados.innerHTML = "";

  graduados.forEach((graduado) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item", "list-group-item-success");
    li.innerHTML = `
      <strong>${graduado.nombre}</strong> - 
      Promedio: ${graduado.promedio.toFixed(2)} 
      (${graduado.clasificacion})
    `;
    listaGraduados.appendChild(li);
  });

  Swal.fire({
    icon: "success",
    title: "Graduados cargados",
    text: "La lista de graduados se cargó correctamente.",
  });
}

document.addEventListener("DOMContentLoaded", () => {
  obtenerGraduados();
  actualizarLista();
  actualizarPromedioClase();
});
