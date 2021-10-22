import { createNewTodo, getEventObj, deleteTodo, todoList, currentColours, filterTodos } from './logic.js';
import { createCategoryGroup, createListElem } from './render.js';
import { format } from 'date-fns';

function showModal() {
    document.querySelector('.modal').style.display = 'block';
}

function closeModal() {
    document.querySelector('.modal').style.display = 'none';
}

function showDetails(obj) {
    document.querySelector('.title-details').innerText=`${obj.title}`;
    document.querySelector('.notes-details').innerText = `${obj.notes}`;
    document.querySelector('.date-details').innerText = `Due date: ${obj.date}`;
    let status;
    if (obj.done) { status = 'done' }
    else if (!obj.done) { status = 'To-do' };
    document.querySelector('.status-details').innerText = `Status: ${status}`;
    document.querySelector('.details').style.display = 'block';
    document.querySelector('.details-card').style.backgroundColor = `var(--${obj.colour})`;
}
//wrapper function to avoid sharing todoList with render.js
function showRecent() {
    renderListView(todoList);
}

function closeDetails() {
    document.querySelector('.details').style.display = 'none';
}

function getColour(div) {
    return div.classList[0];
}

function resetColour() {
    if (document.querySelector('.selected')) {
        document.querySelector('.selected').classList.remove('selected');
    }
}

function resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = format(new Date(), 'yyyy-MM-dd');
    resetColour();
    //reset default colour
    document.querySelector('.colour-div').firstChild.classList.add('selected');
    document.getElementById('add-new-submit').value = 'Add To-do';
}

function renderListView(project) {
    const mainContainer = document.querySelector('.main-container');
    mainContainer.innerHTML = '';
    if (project.length >0) {
        for (let i=0;i<project.length;i++) {
            mainContainer.appendChild(createListElem(project[i]));
        }
    }
    document.querySelector('.group-container').innerHTML ='';
    const colours = currentColours();
    colours.forEach(colour => createCategoryGroup(colour));
}

function renderEditMenu(obj) {
    document.getElementById('title').value=`${obj.title}`;
    document.getElementById('description').value= `${obj.notes}`;
    document.getElementById('date').value = obj.date;
    resetColour();
    const selectedColour = Array.from(document.querySelector('.colour-div').childNodes).find(x => x.classList[0] == obj.colour);
    selectedColour.classList.add('selected');
    document.getElementById('add-new-submit').value = 'Edit To-do';
}

function markStatus(e) {
    //find current obj using id
    objTarget = getEventObj(e.target.parentElement.parentElement.id);
    if (e.target.checked) { objTarget.done = true; }
    else { objTarget.done = false; }
    window.localStorage.setItem('todoList', JSON.stringify(todoList));
}

function deleteEvent(e) {
    objTarget = getEventObj(e.currentTarget.parentElement.parentElement.id);
    deleteTodo(objTarget);
    renderListView(todoList);
    window.localStorage.setItem('todoList', JSON.stringify(todoList));
}

let isEdit = false;

function addEditTodo(e, isEdit, objTarget) {
    //prevent page from refreshing after submit
    e.preventDefault();

    const title = document.getElementById('title').value;
    const notes = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const colour = getColour(document.querySelector('.selected'));
    //check if is edit or not and delegate
    if (!isEdit) {
        createNewTodo(title, notes, date, colour);
    }
    else if (isEdit) { 
        editTodo(objTarget, title, notes, date, colour);
    }
    renderListView(todoList);
    closeModal();
    resetForm();
    window.localStorage.setItem('todoList', JSON.stringify(todoList));
}

function editTodo(obj, title, notes, date, colour) {
    //modify object with new info
    obj.title = title;
    obj.notes = notes;
    obj.date = date;
    obj.colour = colour;
}

//stores event target object from listview clicks in module variable
let objTarget;

function editEvent(e) {
    //set isEdit to true
    isEdit = true;

    objTarget = getEventObj(e.currentTarget.parentElement.parentElement.id);
    renderEditMenu(objTarget);
    showModal();
}

function categoryEvent(e) {
    const colourTarget = e.target.classList[1];
    renderListView(filterTodos('colour', colourTarget));
}
function searchEvent(searchString) {
    renderListView(filterTodos('title', searchString.toLowerCase()));
}
//default event listener function for elements already on the page
function displayController() {
    //searchbar event listener
    const searchbar = document.getElementById('searchbar');
    searchbar.addEventListener("keyup", e => {
        const searchString = e.target.value;
        searchEvent(searchString);
    });
    //modal event listeners
    const addNewButton = document.querySelector('.addnew-button');
    addNewButton.addEventListener('click', () => {
        isEdit = false;
        showModal();
    });

    document.querySelector('.close-modal').addEventListener('click', () => {
        resetForm();
        closeModal();
    });

    //details event listener
    document.querySelector('.close-details').addEventListener('click', closeDetails);

    //store colour chosen by adding class on div
    let colours = document.querySelector('.colour-div').childNodes;
    colours.forEach(colour => {
        colour.addEventListener('click', () => {
            resetColour();
            colour.classList.add('selected');
        });
    });
    //add new todo and render list of recently added
    document.querySelector('.form').addEventListener('submit', (e) => {
        addEditTodo(e, isEdit, objTarget);
    })

}

export { displayController, markStatus, editEvent, deleteEvent, renderListView, getEventObj, showDetails, showRecent, categoryEvent }