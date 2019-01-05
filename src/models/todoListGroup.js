// @flow
import TodoItem from "./todoItem"
import utils from "../utils"

type ConstructorArgs = {
  name: string,
  todos: Array<TodoItem>
}

export default class TodoListGroup {
  name: string
  uuid: string
  todos: Array<TodoItem>

  constructor(args: ConstructorArgs) {
    this.name = args.name
    this.uuid = utils.generateUuid()
    this.todos = args.todos
  }

  sortedTodos(): Array<TodoItem> {
    return this.todos.sort((t1, t2) => (t1.id || -1) - (t2.id || -1))
  }
}
