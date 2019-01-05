// @flow
import TodoItemModel from "./todoItem"
import utils from "../utils"

type ConstructorArgs = {
  name?: string,
  uuid?: string,
  todos?: Array<TodoItemModel>
}

export default class TodoList {
  name: string
  uuid: string
  todos: Array<TodoItemModel>

  constructor(args: ConstructorArgs) {
    this.name = args.name || "New List"
    this.uuid = args.uuid || utils.generateUuid()
    this.todos = args.todos || []
  }

  addTodo(todo: TodoItemModel) {
    todo.id = findLowestUnusedID(this.todos)
    this.todos.push(todo)
  }

  updateTodo(todo: TodoItemModel) {
    this.todos = this.todos.filter(t => t.uuid !== todo.uuid)
    this.addTodo(todo)
  }
}

export const findLowestUnusedID = (todos: Array<TodoItemModel>) => {
  const todoIds = todos.map(t => t.id || -1)
  const maxId = Math.max(...todoIds)

  for (let i = 1; i < maxId; i++) {
    if (i !== -1 && !todoIds.includes(i)) {
      return i
    }
  }
  return maxId + 1
}
