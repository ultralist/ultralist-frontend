// @flow
import TodoItemNote from "./todoItemNote"

type ConstructorArgs = {
  id: number,
  uuid: string,
  completed: boolean,
  archived: boolean,
  isPriority: boolean,
  completedDate: string | null,
  subject: string,
  due: string | null,
  notes: Array<string>
}

export default class TodoItem {
  id: number
  uuid: string
  completed: boolean
  archived: boolean
  isPriority: boolean
  completedDate: string | null
  subject: string
  due: string | null
  notes: Array<string>

  constructor(args: ConstructorArgs) {
    this.id = args.id
    this.uuid = args.uuid
    this.completed = args.completed
    this.archived = args.archived
    this.isPriority = args.isPriority
    this.completedDate = args.completedDate
    this.subject = args.subject
    this.due = args.due
    this.notes = args.notes
  }

  toggleComplete() {
    this.completed = !this.completed
  }

  togglePriority() {
    this.isPriority = !this.isPriority
  }
}
