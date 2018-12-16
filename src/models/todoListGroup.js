// @flow
import TodoItem from "./todoItem"

type ConstructorArgs = {
  name: string,
  todos: Array<TodoItem>
}

export default class TodoListGroup {
  name: string
  todos: Array<TodoItem>

  constructor(args: ConstructorArgs) {
    this.name = args.name
    this.todos = args.todos
  }
}
