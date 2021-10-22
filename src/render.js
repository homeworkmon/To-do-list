import { colours, reinitializeTodoList, getEventObj, createNewTodo, todoList } from './logic.js';
import { parseISO, format } from 'date-fns';
import { markStatus, editEvent, deleteEvent, renderListView, showDetails, showRecent, categoryEvent } from './dynamicdommethods.js';

function createSearchContainer() {
    const container = document.createElement('div');
    container.classList.add('search-container');

    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.id = 'searchbar';
    searchBar.name = 'searchbar';
    searchBar.placeholder = 'search by title';

    const magnifyingGlass = document.createElement('img');
    magnifyingGlass.src = 'images/search.svg';

    container.appendChild(magnifyingGlass);
    container.appendChild(searchBar);

    return container;
}

function createCategoryContainer() {
    const container = document.createElement('div');
    container.classList.add('category-container');

    const header = document.createElement('h1');
    header.textContent = 'Categories';

    const recent = document.createElement('button');
    recent.classList.add('recent');
    recent.textContent = 'RECENT';
    recent.addEventListener('click', showRecent);

    const groupContainer = document.createElement('div');
    groupContainer.classList.add('group-container');

    container.appendChild(header);
    container.appendChild(recent);
    container.appendChild(groupContainer);
    return container;
}

function createCategoryGroup(colour) {
    const colourGroup = document.createElement('div');
    colourGroup.classList.add('colour-group');
    colourGroup.classList.add(`${colour}`);
    colourGroup.style.backgroundColor = `var(--${colour})`;
    colourGroup.addEventListener('click', (e) => {
        categoryEvent(e);
    })

    document.querySelector('.group-container').appendChild(colourGroup);
}

function createMainContainer() {
    const main = document.createElement('main');
    main.setAttribute('id', 'main');
    
    const container = document.createElement('div');
    container.classList.add('main-container');
    
    main.appendChild(container);
    return main;
}

function createAddContainer() {
    const add = document.createElement('div');
    add.classList.add('add-section');

    const newButton = document.createElement('button');
    newButton.innerHTML = "&#43";
    newButton.classList.add('addnew-button');

    add.appendChild(newButton);
    return add;
}

function createModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalCard = document.createElement('div');
    modalCard.classList.add('modal-card');

    const form = document.createElement('form');
    form.classList.add('form');

    const title = document.createElement('textarea');
    title.id = 'title';
    title.name = 'title';
    title.placeholder = 'title';
    title.setAttribute('maxlength', '40');
    title.required = true;

    const close = document.createElement('span');
    close.classList.add('close-modal'); 
    close.innerHTML ='&times';

    const description = document.createElement('textarea');
    description.id = 'description';
    description.name = 'description';
    description.placeholder = 'notes';
    description.value = '';

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('modal-date');
    const dateLabel = document.createElement('label');
    dateLabel.innerHTML = 'Due date:';
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'date';
    dateInput.name = 'date';
    dateInput.defaultValue = format(new Date(), 'yyyy-MM-dd');
    dateDiv.appendChild(dateLabel);
    dateDiv.appendChild(dateInput);

    function generateColour(colour) {
        const div = document.createElement('div');
        div.classList.add(colour);
        div.style.backgroundColor = `var(--${colour})`;
        colourDiv.append(div);
    }

    const colourDiv = document.createElement('div');
    colourDiv.classList.add('colour-div');
    colours.forEach((colour) => generateColour(colour));
    //set default colour to first one
    colourDiv.firstChild.classList.add('selected');

    const submit = document.createElement('input');
    submit.type = 'submit';
    submit.value = 'Add To-do';
    submit.name = 'add-new-submit';
    submit.id = 'add-new-submit';
    submit.classList.add('add-new-submit');

    form.appendChild(title);
    form.appendChild(close);
    form.append(description);
    form.appendChild(dateDiv);
    form.appendChild(colourDiv);
    form.appendChild(submit);

    modalCard.appendChild(form);
    modal.appendChild(modalCard);

    return modal;
}

function createListElem(obj) {
    const todoContent = document.createElement('div');
    todoContent.classList.add('todo-content');
    //set obj's unique id as html id
    todoContent.id = obj.id;

    const checkboxInput = document.createElement('span');
    checkboxInput.classList.add('checkbox-input');

    const status = document.createElement('input');
    status.type = 'checkbox';
    status.id = 'status';
    status.name = 'status';
    status.checked = obj.done;
    status.addEventListener('click', (e) => {
        markStatus(e);
    });

    const checkboxControl = document.createElement('span');
    checkboxControl.classList.add('checkbox-control');

    const checkboxSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    checkboxSvg.setAttribute("viewBox", "0 0 24 24");
    checkboxSvg.setAttribute("aria-hidden", "true");
    checkboxSvg.setAttribute("focusable", "false");
    const path = document.createElementNS('http://www.w3.org/2000/svg',"path");
    path.setAttributeNS(null, "d", "M1.73 12.91l6.37 6.37L22.79 4.59");
    path.setAttributeNS(null, "fill", "none");
    path.setAttributeNS(null, "stroke", "currentColor");
    path.setAttributeNS(null, "stroke-width", "3");
    
    checkboxSvg.appendChild(path);
    checkboxControl.appendChild(checkboxSvg);
    checkboxInput.appendChild(status);
    checkboxInput.appendChild(checkboxControl);

    const titleDiv = document.createElement('div');
    const title = document.createElement('p')
    titleDiv.classList.add('list-display-title');
    title.textContent = obj.title;
    titleDiv.appendChild(title);

    const details = document.createElement('button');
    details.classList.add('detail-view-button');
    details.textContent = 'DETAILS';
    details.addEventListener('click', (e) => {
        const objTarget = getEventObj(e.target.parentElement.id);
        showDetails(objTarget);
    })

    const date = document.createElement('div');
    date.classList.add('todo-listdisplay-date');
    //convert date string into date in form of "Jan 12th"
    const dateMonth = format(parseISO(obj.date), 'MMM');
    const dateDay = format(parseISO(obj.date), 'do');
    const dateFormatted = `${dateMonth} ${dateDay}`;
    date.textContent = dateFormatted;

    const svgContainer = document.createElement('div');
    svgContainer.classList.add('svg-container');

    const editIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    editIcon.classList.add('icon');
    editIcon.classList.add('to-do-icon');
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'images/icons.svg#edit');
    editIcon.appendChild(use);
    editIcon.addEventListener('click', (e) => {
        editEvent(e);
    });

    const deleteIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    deleteIcon.classList.add('icon');
    deleteIcon.classList.add('to-do-icon');
    const use2 = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use2.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'images/icons.svg#delete');
    deleteIcon.appendChild(use2);
    deleteIcon.addEventListener('click', (e) => {
        deleteEvent(e);
    });
    
    svgContainer.appendChild(editIcon);
    svgContainer.appendChild(deleteIcon);

    todoContent.style.backgroundColor = `var(--${obj.colour})`;

    todoContent.appendChild(checkboxInput);
    todoContent.appendChild(titleDiv);
    todoContent.appendChild(details);
    todoContent.appendChild(date);
    todoContent.appendChild(svgContainer);

    return todoContent;
}

function createDetailsView() {
    const details = document.createElement('div');
    details.classList.add('details');

    const detailsCard = document.createElement('div');
    detailsCard.classList.add('details-card');

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title-details');

    const close = document.createElement('span');
    close.classList.add('close-details'); 
    close.innerHTML ='&times';

    const notesDiv = document.createElement('div');
    notesDiv.classList.add('notes-details');

    const footer = document.createElement('div');
    footer.classList.add('details-footer');

    const date = document.createElement('div');
    date.textContent = 'Due date: ';
    date.classList.add('date-details');

    const status = document.createElement('div');
    status.textContent = 'Status: ';
    status.classList.add('status-details');

    footer.appendChild(date);
    footer.appendChild(status);

    detailsCard.appendChild(titleDiv);
    detailsCard.appendChild(close);
    detailsCard.appendChild(notesDiv);
    detailsCard.appendChild(footer);
    details.appendChild(detailsCard);

    return details;
}

function initializeWebsite() {
    const content = document.createElement('div');
    content.classList.add('content');

    document.body.appendChild(content);

    content.appendChild(createSearchContainer());
    content.appendChild(createCategoryContainer());
    content.appendChild(createMainContainer());
    content.appendChild(createAddContainer());
    document.body.appendChild(createModal());
    document.body.appendChild(createDetailsView());

    reinitializeTodoList();
    if (todoList.length == 0) {
        createNewTodo('Feed cat', 'go to pet value for wet food', format(new Date(), 'yyyy-MM-dd'), 'yellow');
        createNewTodo('Check email', 'check for reply, clear junk mail', format(new Date(), 'yyyy-MM-dd'), 'purple');
        createNewTodo('Groceries', 'carrots, onions, tofu, cookies, tea', format(new Date(),'yyyy-MM-dd'), 'green');
        createNewTodo('call landlord', 'danny 990-009-0909', format(new Date(), 'yyyy-MM-dd'), 'blue');
    }

    renderListView(todoList);
}

export default initializeWebsite
export { createListElem, createCategoryGroup }