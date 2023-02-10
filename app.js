
//Global
const todoList = document.getElementById('todo-list')
let todos = [];
let users = [];
const userSelect = document.getElementById('user-todo')
const form = document.querySelector('form')


//atachEvents
function initApp(){
  Promise.all([getAllToDos(), getAllUsers()]).then(values =>{
    [todos , users] = values;


    //PrintALl
    todos.forEach((todo)=>printToDo(todo))
    users.forEach(user => createUserOption(user))
  })
}

function handleSubmit(event){
  event.preventDefault();

  createToDo({
    userId: Number(form.user.value),
    title:form.todo.value,
    completed: false,
  })

}

function handleToDOChange(){
  const todoId =this.parentElement.dataset.id;
  const completed = this.checked

  ToggleToDoComplete(todoId , completed)
}
function handleClose(){
  const todoId = this.parentElement.dataset.id;
  deleteToDoNow(todoId)

}




//BasicLogick
function getUserName(userId){
  const user = users.find(u => u.id === userId)
  return user.name

}

function printToDo({id , userId , title ,completed}){
  const li = document.createElement('li')
  li.className = 'todo-item'
  li.dataset.id = id
  li.innerHTML = `<span>${title} by <b>${getUserName(userId)} </b> </span>`

  const status = document.createElement('input')
  status.type = 'checkbox'
  status.checked = completed
  status.addEventListener('change' , handleToDOChange)


  const close = document.createElement('span')
  close.innerHTML = '&times'
  close.className = 'close'
  close.addEventListener('click', handleClose)


  li.prepend(status)
  li.append(close)

  todoList.prepend(li)
}

function createUserOption(user){
 const option = document.createElement('option')
 option.value = user.id
 option.innerText = user.name;
 userSelect.append(option)
}

function removeToDo(todoId){
  todos = todos.filter(todo =>todo.id !== todoId )
  const todo =todoList.querySelector(`[data-id = "${todoId}"]`)
  todo.querySelector('input').removeEventListener('change' , handleToDOChange);
  todo.querySelector('.close').removeEventListener('click' , handleClose)
  todo.remove()
}
//event logic
document.addEventListener('DOMContentLoaded', initApp);
form.addEventListener('submit', handleSubmit)


/// async logic
async function getAllToDos(){
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  const data = await response.json();
  return data
}
async function getAllUsers(){
  const response = await fetch('https://jsonplaceholder.typicode.com/users')
  const data = await response.json();
  return data
}

async function createToDo(todo){
  const response = await fetch('https://jsonplaceholder.typicode.com/todos',{
  method:'POST',
  body: JSON.stringify(todo),
  headers:{
    'Content-type': 'application/json',
  },
  })

  const newTodo = await response.json()

  printToDo(newTodo)
}


async function ToggleToDoComplete(todoId , completed){
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,{
    method: 'PATCH',
    body: JSON.stringify({completed:completed}),
    headers:{
      'Content-type': 'application/json',
    },
  })
}



async function deleteToDoNow(todoId){
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,{
    method: 'DELETE',
    headers:{
      'Content-type': 'application/json',
    },
  })
  if(response.ok){
    removeToDo(todoId)
  }
}