// @flow
import TodoItemNote from "./todoItemNote"
import { format, addDays, setDay, isPast } from "date-fns"

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

  toggleArchived() {
    this.archived = !this.archived
  }

  setDueToday() {
    this.due = format(new Date(), "YYYY-MM-DD")
  }

  setDueTomorrow() {
    this.due = format(addDays(new Date(), 1), "YYYY-MM-DD")
  }

  setDueMonday() {
    let monday = setDay(new Date(), 1)
    if (isPast(monday)) monday = addDays(monday, 7)
    this.due = format(monday, "YYYY-MM-DD")
  }

  deleteNote(note: string) {
    this.notes = this.notes.filter(n => n !== note)
  }
}
