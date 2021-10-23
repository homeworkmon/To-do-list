class todo {
    constructor(title, notes, date, colour, id) {
        this.title = title;
        this.notes = notes;
        this.date = date;
        this.colour = colour;
        this.done = false;
        this.id = id;
    }

}

const todoList = [];

function createNewTodo(title, notes, date, colour) {
    let id;
    if (todoList.length == 0) { id = 0; }
    else {
        const lastTodo = todoList.slice(-1)[0];
        id = lastTodo.id+1;
    }
    const newTodo = new todo(title, notes, date, colour, id);
    todoList.push(newTodo);
    return newTodo;
}

function reinitializeTodoList() {
    const localStorageTodos = JSON.parse(window.localStorage.getItem('todoList'));
    if (localStorageTodos.length > 0) {
        localStorageTodos.forEach(todo => {
            todoList.push(todo);
        })
    }
    return todoList;
}

const colours = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

function currentColours() {
    const current = [];
    for (let i=0;i<todoList.length;i++) {
        if (!current.includes(todoList[i].colour)) {
            current.push(todoList[i].colour);
        }
    }
    return current;
}

function filterTodos(prop, val) {
    return (todoList.filter(i => i[prop].toLowerCase().includes(val)));
}

function getEventObj(id) {
    const obj = todoList.filter(i => i.id == id);
    return obj[0];
}

function deleteTodo(obj) {
    const pos = todoList.map(x => x.id).indexOf(obj.id);
    todoList.splice(pos, 1);
}

export { colours, currentColours, todoList, createNewTodo, getEventObj, deleteTodo, reinitializeTodoList, filterTodos }