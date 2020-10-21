import React from "react"

import TodoListModel from "../../shared/models/todoList"
import FilterModel from "../../shared/models/filter"

const TodoListContext = React.createContext({
  todoList: {},
  setTodoList: (t: TodoListModel) => {},
  view: {},
  setView: (v: FilterModel) => {}
})

export default TodoListContext
