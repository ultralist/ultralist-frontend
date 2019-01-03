// @flow
import TodoItemNote from "./todoItemNote"
import utils from "../utils"
import { format, addDays, setDay, toDate } from "date-fns"

type ConstructorArgs = {
  id?: number,
  uuid?: string,
  completed?: boolean,
  archived?: boolean,
  contexts?: Array<string>,
  projects?: Array<string>,
  isPriority?: boolean,
  completedDate?: string | null,
  subject?: string,
  due?: string | null,
  notes?: Array<string>
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
    if (args.id) this.id = args.id
    this.uuid = args.uuid || utils.generateUuid()
    this.completed = args.completed || false
    this.archived = args.archived || false
    this.isPriority = args.isPriority || false
    this.completedDate = args.completedDate || null
    this.subject = args.subject || ""
    this.contexts = args.contexts || []
    this.projects = args.projects || []
    this.due = args.due || null
    this.notes = args.notes || []
  }

  dueDate(): Date | null {
    return this.due ? toDate(this.due || "") : null
  }

  setDue(date: Date | null) {
    if (date === null) {
      this.due = null
    } else {
      this.due = format(date, "yyyy-MM-dd")
    }
  }

  toggleCompleted() {
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
    if (monday < new Date()) monday = addDays(monday, 7)
    this.due = format(monday, "yyyy-MM-dd")
  }

  setSubject(subject: string) {
    this.subject = subject
    this.projects = []
    this.contexts = []

    subject.split(" ").forEach(word => {
      if (word.startsWith("+")) this.projects.push(word.substring(1))
      if (word.startsWith("@")) this.contexts.push(word.substring(1))
    })
  }

  deleteNote(note: string) {
    this.notes = this.notes.filter(n => n !== note)
  }
}
