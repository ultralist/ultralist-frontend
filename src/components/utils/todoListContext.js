import React from "react"

import TodoListModel from "../../shared/models/todoList"

const TodoListContext = React.createContext({
  todoList: {},
  setTodoList: (t: TodoListModel) => {}
})

export default TodoListContext
