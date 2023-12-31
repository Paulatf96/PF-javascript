fetch("./info.json")
  .then((respuesta) => respuesta.json())
  .then((months) => printMonths(months))
  .catch((err) => console.log("ERROR", err));

let today = new Date();
let initId = 0;
let saveInitId = localStorage.getItem("id");
if (saveInitId) {
  initId = JSON.parse(saveInitId);
}
let currentGoal = {};
let currentTask = {};
let currentAim = {};
let tasks = [];
let saveTasks = localStorage.getItem("saveTasks");
let aimsMonth = [];
let goals = [];
let saveGoals = localStorage.getItem("save");

if (saveGoals && JSON.parse(saveGoals).length) {
  goals = JSON.parse(saveGoals);
  print(goals);
}

if (saveTasks && JSON.parse(saveTasks).length) {
  tasks = JSON.parse(saveTasks);
}
let saveAimss = localStorage.getItem("saveAims");
if (saveAimss && JSON.parse(saveAimss).length) {
  aimsMonth = JSON.parse(saveAimss);
}

// Obtener inputs de goals
let textGoal = document
  .getElementById("valueVision")
  .addEventListener("change", function () {
    currentGoal["valueVision"] = this.value;
  });
let imgGoal = document
  .getElementById("imgVision")
  .addEventListener("change", function () {
    imgGoal = this.value;

    let urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;

    // validar URL de goals
    if (urlPattern.test(imgGoal)) {
      currentGoal["imgVision"] = this.value;
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No es una URL válida para tu imagen, ingrésala nuevamente!",
      });
    }
  });

let dateGoal = document
  .getElementById("dateVision")
  .addEventListener("input", function () {
    currentGoal["dateGoal"] = this.value;
  });

let inputsCategories = document.querySelectorAll(".categoria");

for (const input of inputsCategories) {
  input.addEventListener("click", {});
}

let saveButon = document
  .getElementById("saveGoal")
  .addEventListener("click", (e) => recorrer(e, inputsCategories, true));

//Función que recorre los input de las categorias  para tomar el valor y se va a la función save ya sea de goal o de task
function recorrer(e, inputsCategories, validation) {
  e.preventDefault();
  inputsCategories.forEach((input) => {
    if (input.checked) {
      if (validation) {
        currentGoal["tittle"] = input.defaultValue;
        currentGoal["category"] = input.id;
        saveGoal();
      }
    }
  });
}

document
  .getElementById("addAims-goalsForm")
  .addEventListener("click", function () {
    let containerCreateAims = document.getElementById("aims-goals-form");
    let divAims = document.createElement("div");
    divAims.innerHTML = `<select
  class="form-select monthSelect"
  id="monthSelect-${aimsMonth.length || 0}"
  aria-label="Floating label select example"
>
  <option selected>Selecciona un mes</option>
  <option value="enero" id="enero">Enero</option>
  <option value="febrero" id="febrero">Febrero</option>
  <option value="marzo" id="marzo">Marzo</option>
  <option value="abril" id="abril">Abril</option>
  <option value="mayo" id="mayo">Mayo</option>
  <option value="junio" id="junio">Junio</option>
  <option value="julio" id="julio">Julio</option>
  <option value="agosto" id="agosto">Agosto</option>
  <option value="septiembre" id="septiembre">Septiembre</option>
  <option value="octubre" id="octubre">Octubre</option>
  <option value="noviembre" id="noviembre">Noviembre</option>
  <option value="diciembre" id="diciembre">Diciembre</option>
</select>
<label for="aim">Objetivo para este mes</label>
<input type="text" id="aim-${
      aimsMonth.length || 0
    }" class="aim" value="" placeholder="4 horas semanales de inglés" disabled/>`;
    containerCreateAims.appendChild(divAims);

    document
      .getElementById(`monthSelect-${aimsMonth.length || 0}`)
      .addEventListener("change", function (option) {
        currentAim["month"] = this.value;
        document.getElementById(
          `aim-${aimsMonth.length || 0}`
        ).disabled = false;
      });
    document
      .getElementById(`aim-${aimsMonth.length || 0}`)
      .addEventListener("change", function (option) {
        currentAim["aimsValue"] = this.value;
        currentAim["vision"] = currentGoal["valueVision"];
        if (currentAim["month"] && currentAim["aimsValue"]) {
          aimsMonth.push(currentAim);
          currentAim = {};
        }
      });
  });
//Guarda metas
function saveGoal() {
  if (
    currentGoal["valueVision"] &&
    currentGoal["imgVision"] &&
    currentGoal["category"] &&
    currentGoal["dateGoal"]
  ) {
    goals.push(currentGoal);
    currentGoal = {};
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No ingresaste todos los datos requeridos!",
    });
  }
  saveInLocalStorage(goals, "save");
  print(goals);
  let containerCreateAims = document.getElementById("aims-goals-form");
  containerCreateAims.innerHTML += "";
  saveInLocalStorage(aimsMonth, "saveAims");
}
//Imprime tarjeta de metas
function print(array) {
  let board = document.getElementById("board");
  board.innerHTML = "";
  let boxTitle = document.createElement("div");
  boxTitle.innerHTML = `<h5>Estas son tus metas actuales</h5>
  <div class="form-floating col-3"><select
    id="floatingSelect"
    aria-label="Floating label select example"
  >
    <option selected>Filtra tu tablero</option>
    <option value="todos" id="todos">Todos</option>
    <option value="crecimientoPersonal" id="crecimientoPersonal">
      Crecimiento Personal
    </option>
    <option value="economia" id="economia">Economía</option>
    <option value="laboral" id="laboral">Laboral</option>
    <option value="social" id="social">Social</option>
  </select>
  </div>`;
  board.appendChild(boxTitle);

  array.forEach(function (elemento) {
    let box = document.createElement("div");
    box.id = "boxGoals";
    box.className = "col";
    box.innerHTML = `<div class="card col" style="width: 8rem">
    <img src=${elemento.imgVision} class="card-img-top" alt=${elemento.valueVision}>
    <div class="card-body">
      <h6 class="card-title">${elemento.valueVision}</h6>
      <p class="card-text">Categoria: ${elemento.tittle}</p>
    </div>
  </div>`;
    board.appendChild(box);
  });

  let divButton = document.createElement("div");
  divButton.innerHTML = `<button id="deleteVisionBoard" class="btn btn-primary">Limpiar Vision Board</button>`;
  divButton.className = "container-button";
  board.appendChild(divButton);

  let deleteVisionBoard = document
    .getElementById("deleteVisionBoard")
    .addEventListener("click", () => deleteBoard());
  document.getElementById("goalsForm").reset();
  initFiltro();
}
//Crea filtro y agrega evento
function initFiltro() {
  const filtro = document.getElementById("floatingSelect");
  filtro.addEventListener("change", function (option) {
    if (option.target.value == "todos") {
      print(goals);
    } else {
      let filtrados = goals.filter(
        (elemento) => elemento.category == option.target.value
      );
      if (filtrados.length === 0) {
        Swal.fire("No hay elementos aún en esta categoría!");
      }
      print(filtrados);
    }
  });
}

//Borrar todo el tablero
function deleteBoard() {
  let board = document.getElementById("board");
  board.innerHTML = "";
  goals = [];
  aimsMonth = [];
  tasks = [];
  saveInLocalStorage(goals, "save");
  saveInLocalStorage(aimsMonth, "saveAims");
  saveInLocalStorage(tasks, "saveTasks");
}
// Obtiene con fetch el JSON de meses y lo imprime en pantalla
function printMonths(months) {
  let container = document.getElementById("months");
  for (let i = 0; i < months.length; i++) {
    let card = document.createElement("div");
    card.classList = "cardMonth col-2 ";
    card.id = months[i].id;
    card.innerHTML = `<div class="card-header"> ${months[i].text}</div>`;
    container.appendChild(card);
  }
  let divsMonths = document.getElementsByClassName("cardMonth");
  for (let div of divsMonths) {
    div.addEventListener("click", (e) => seeMonth(e));
  }
}
function saveInLocalStorage(array, name) {
  let saveInfo = JSON.stringify(array);
  localStorage.setItem(name, saveInfo);
}
//Imprime barra lateral según el mes seleccionado
function seeMonth(e) {
  let container = document.getElementById("sideBar");
  container.innerHTML = "";
  let id = e.target.id;
  let div = document.createElement("div");
  div.innerHTML = ` 
  <div id=aims><div class="headerGoals"> 
    <h3>Objetivos para este mes</h3>
    <!-- modal -->
    <button type="button" class="btn btn-primary"  data-bs-toggle="modal"  data-bs-target="#exampleModal1" id="createAims">Crear Objetivo</button>
    <div
      class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Crear Objetivo</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="aimsForm">
              <label for="valueAims">Ingresa tu objetivo</label>
              <input type="text" id="valueAims" value="" placeholder="Inscribirme al gym" />
            </form>
            <select class="form-select categorySelect" id="categorySelect" aria-label="Floating label select example">
                <option selected>Selecciona una categoría</option>
                <option value="laboral" id="laboral">Laboral</option>
                <option value="social" id="social">Social</option>
                <option value="economia" id="economia">Economía</option>
                <option value="crecimiento" id="crecimiento">Crecimiento</option>
            </select>
          </div>
          <div class="modal-footer">
            <button
              type="button" class="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
            <div class="container-button">
              <button type="button" id="saveAim" class="btn btn-primary" data-bs-dismiss="modal">Guardar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    <div id="aimsOfMonth">
     
      <div id="goalsInProcess"></div>
    </div>
  </div>
  </div>

  <div id="tasks">
    <div class="cardWeek">
      <div class="cardTitle">
        <h5>Semana 1</h5>
        <button id="1" class="buttonTaks">+</button>
        </div>
        <div id="semanaTask1"></div>
        <div id="semana1"></div>
    </div>
    <div class="cardWeek">
      <div class="cardTitle">
        <h5>Semana 2</h5>
        <button id="2" class="buttonTaks">+</button>
      </div>
      <div id="semanaTask2"></div>
      <div id="semana2"></div>
    </div>
    <div class="cardWeek">
      <div class="cardTitle">
        <h5>Semana 3</h5>
        <button id="3" class="buttonTaks">+</button>
      </div>
      <div id="semanaTask3"></div>
      <div id="semana3"></div>
    </div>
    <div class="cardWeek">
      <div class="cardTitle">
        <h5>Semana 4</h5>
        <button id="4" class="buttonTaks">+</button>
      </div>
      <div id="semanaTask4"></div>
      <div id="semana4"></div>
    </div>
 `;
  container.appendChild(div);
  let aimsContainer = document.getElementById("aimsOfMonth");
  let aimsFilter = aimsMonth.filter((aim) => aim["month"] == id);
  if (aimsFilter.length > 0) {
    for (let aim of aimsFilter) {
      aimsContainer.innerHTML += `<li>${aim.aimsValue} - (${
        aim.vision ? aim.vision : aim.category
      })</li>`;
    }
  } else {
    aimsContainer.innerHTML =
      "<p>Este mes no tienes objetivos propuestos pero tienes metas por cumplir </p>";
  }

  document
    .getElementById("valueAims")
    .addEventListener("change", function (option) {
      currentAim["month"] = id;
      currentAim["aimsValue"] = this.value;
    });

  let categoryAim = document.getElementById("categorySelect");
  categoryAim.addEventListener("change", function (option) {
    currentAim["category"] = option.target.value;
  });
  document.getElementById("saveAim").addEventListener("click", function () {
    if (currentAim["category"] && currentAim["aimsValue"]) {
      aimsMonth.push(currentAim);
      saveInLocalStorage(aimsMonth, "saveAims");
      currentAim = [];
      seeMonth(e);
    } else {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: "Aún te faltan datos!",
      });
    }
  });

  let buttonsTask = document.getElementsByClassName("buttonTaks");

  for (let i = 0; i < buttonsTask.length; i++) {
    buttonsTask[i].addEventListener("click", function () {
      let addTaskContainer = document.getElementById(
        `${"semanaTask" + (i + 1)}`
      );
      let divTask = document.createElement("div");
      divTask.innerHTML = `<input type="text" id="task-${
        tasks.length || 0
      }" class="tasks" 
    value="" placeholder="Escribe tu tarea"/>`;
      addTaskContainer.appendChild(divTask);
      document
        .getElementById(`task-${tasks.length || 0}`)
        .addEventListener("change", function () {
          currentTask["month"] = id;
          currentTask["week"] = `${"semana" + (i + 1)}`;
          currentTask["taskValue"] = this.value;
          tasks.push(currentTask);
          currentTask = {};
          addTaskContainer.innerHTML = "";
          saveInLocalStorage(tasks, "saveTasks");
          printTask(id);
        });
    });
  }
  printTask(id);
}

function printTask(id) {
  let containerTask1 = document.getElementById("semana1");
  containerTask1.innerHTML = "";
  let containerTask2 = document.getElementById("semana2");
  containerTask2.innerHTML = "";
  let containerTask3 = document.getElementById("semana3");
  containerTask3.innerHTML = "";
  let containerTask4 = document.getElementById("semana4");
  containerTask4.innerHTML = "";
  let taskMonthFilter = tasks.filter((task) => task.month == id);
  taskMonthFilter.forEach(function (task) {
    switch (task.week) {
      case "semana1":
        containerTask1.innerHTML += `<div class="listTaks"><li>${task.taskValue}</li>
      <input id="${task.taskValue}" class="checkTask" type="checkbox"/> </div>`;
        break;
      case "semana2":
        containerTask2.innerHTML += `<div class="listTaks"><li>${task.taskValue}</li>
      <input id="${task.taskValue}" class="checkTask" type="checkbox"/> </div>`;
        break;
      case "semana3":
        containerTask3.innerHTML += `<div class="listTaks"><li>${task.taskValue}</li>
      <input id="${task.taskValue}" class="checkTask" type="checkbox"/> </div>`;
        break;
      default:
        containerTask4.innerHTML += `<div class="listTaks"><li>${task.taskValue}</li>
      <input id="${task.taskValue}" class="checkTask" type="checkbox"/> </div>`;
        break;
    }
  });
}
