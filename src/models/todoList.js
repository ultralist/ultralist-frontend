// @flow
import TodoItem from "./todoItem"

type ConstructorArgs = {
  name: string,
  uuid: string,
  todos: Array<TodoItem>
}

export default class TodoList {
  name: string
  uuid: string
  todos: Array<TodoItem>

  constructor(args: ConstructorArgs) {
    this.name = args.name
    this.uuid = args.uuid
    this.todos = args.todos
  }
}
