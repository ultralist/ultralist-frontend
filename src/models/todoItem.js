// @flow
import TodoItemNote from "./todoItemNote"
import { format, addDays, setDay, isPast, toDate } from "date-fns"

type ConstructorArgs = {
  id: number,
  uuid: string,
  completed: boolean,
  archived: boolean,
  contexts: Array<string>,
  projects: Array<string>,
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
  contexts: Array<string>
  projects: Array<string>
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
    this.contexts = args.contexts
    this.projects = args.projects
    this.due = args.due
    this.notes = args.notes
  }

  dueDate(): Date | null {
    return (this.due ? toDate(this.due || "") : null)
  }

  setDue(date: Date | null) {
    if (date === null) {
      this.due = null
    } else {
      this.due = format(date, "yyyy-MM-dd")
    }
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
    this.due = format(new Date(), "yyyy-MM-dd")
  }

  setDueTomorrow() {
    this.due = format(addDays(new Date(), 1), "yyyy-MM-dd")
  }

  setDueMonday() {
    let monday = setDay(new Date(), 1)
    if (isPast(monday)) monday = addDays(monday, 7)
    this.due = format(monday, "yyyy-MM-dd")
  }

  deleteNote(note: string) {
    this.notes = this.notes.filter(n => n !== note)
  }
}
