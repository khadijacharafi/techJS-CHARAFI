const todoList = [{
  name: 'tache1',
  dueDate: '24/12/2025'
}];

renderTodoList();

function renderTodoList() {
  let todoListHTML = '';

  // Loop over every toDo object and append it to "todoListHTML"
  // Show the objects inside the class "js-todo-list"
  // Loop over evey delete button and add an eventListener that deletes the toDo and rerender the Tasks
  for (let i = 0; i < todoList.length; i++) {
    const todo = todoList[i];

       todoListHTML += `
      <div class="todo-grid">
        <div>${todo.name}</div>
        <div>${todo.dueDate}</div>
        <button class="delete-todo-button" data-index="${i}">Delete</button>
      </div>
    `;
  }
  
  document.querySelector('.js-todo-list').innerHTML = todoListHTML;
    
  const deleteButtons = document.querySelectorAll('.delete-todo-button');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.target.dataset.index; 
      todoList.splice(index, 1); 
      renderTodoList(); 
    });
  });

}


document.querySelector('.js-add-todo-button')
  .addEventListener('click', () => {
    addTodo();
  }); 

function addTodo() {
  const inputElement = document.querySelector('.js-name-input');
  const name = inputElement.value;

  const dateInputElement = document.querySelector('.js-due-date-input');
  const dueDate = dateInputElement.value;

  // Add these values to the variable "todoList"
  todoList.push({
    name: name,
    dueDate: dueDate
  });


  inputElement.value = '';
  dateInputElement.value = '';



  renderTodoList();
}
