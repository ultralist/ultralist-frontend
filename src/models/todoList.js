// @flow
import { parseISO } from "date-fns"
import TodoItemModel from "./todoItem"
import utils from "../utils"

type ConstructorArgs = {
  name?: string,
  uuid?: string,
  updatedAt?: Date,
  todos?: Array<TodoItemModel>
}

export default class TodoList {
  name: string
  uuid: string
  updatedAt: Date
  todos: Array<TodoItemModel>

  constructor(args: ConstructorArgs) {
    this.name = args.name || "New List"
    this.uuid = args.uuid || utils.generateUuid()
    this.updatedAt = args.updatedAt || new Date()
    this.todos = args.todos || []
  }

  addTodo(todo: TodoItemModel) {
    todo.id = findLowestUnusedID(this.todos)
    this.todos.push(todo)
  }

  updateTodo(todo: TodoItemModel) {
    this.deleteTodo(todo)
    this.addTodo(todo)
  }

  deleteTodo(todo: TodoItemModel) {
    this.todos = this.todos.filter(t => t.uuid !== todo.uuid)
  }

  toJSON() {
    return {
      name: this.name,
      uuid: this.uuid,
      updatedAt: this.updatedAt,
      todos: this.todos.map(todo => todo.toJSON())
    }
  }
}

export const findLowestUnusedID = (todos: Array<TodoItemModel>) => {
  if (todos.length === 0) return 1

  const todoIds = todos.map(t => t.id || -1)
  const maxId = Math.max(...todoIds)

  for (let i = 1; i < maxId; i++) {
    if (i !== -1 && !todoIds.includes(i)) {
      return i
    }
  }
  return maxId + 1
}

export const createTodoListFromBackend = (backendJSON: Object) => {
  return new TodoList({
    name: backendJSON.name,
    todos: backendJSON.todo_items_attributes.map(i => new TodoItemModel(i)),
    updatedAt: parseISO(backendJSON.updated_at),
    uuid: backendJSON.uuid
  })
}

export const createTodoListFromJSON = (storageJSON: Object) => {
  return new TodoList({
    name: storageJSON.name,
    todos: storageJSON.todos.map(i => new TodoItemModel(i)),
    updatedAt: parseISO(storageJSON.updatedAt),
    uuid: storageJSON.uuid
  })
}
