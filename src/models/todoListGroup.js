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
    return this.todos.sort((t1, t2) => {
      if (t1.isPriority) return -1
      if (t2.isPriority) return 1
      if (t1.dueDate() < t2.dueDate()) return 1
      return -1
    })
  }
}
