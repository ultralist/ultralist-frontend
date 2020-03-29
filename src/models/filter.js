// @flow
import TodoItemModel from "./todoItem"
import TodoListGroup from "./todoListGroup"
import { FILTER_KEY } from "../constants"

import filterTodos from "./logic/filterTodos"
import applyGrouping from "./logic/grouper"

type ConstructorArgs = {
  contexts?: Array<string>,
  projects?: Array<string>,
  subjectContains?: string,
  archived?: boolean,
  isPriority?: boolean,
  completed?: boolean,
  due?: string,
  group?: string,
  filterString?: string
}

export default class Filter {
  contexts: Array<string> | null
  projects: Array<string> | null
  subjectContains: string | null
  archived: boolean | null
  isPriority: boolean | null
  completed: boolean | null
  due: string | null
  group: string | null

  constructor(args: ConstructorArgs) {
    this.contexts = args.contexts || null
    this.projects = args.projects || null
    this.subjectContains = args.subjectContains || null
    this.archived = args.archived || null
    this.isPriority = args.isPriority || null
    this.completed = args.completed || null
    this.due = args.due || null
    this.group = args.group || null

    if (args.isPriority === undefined) {
      this.isPriority = null
    } else {
      this.isPriority = args.isPriority
    }

    if (args.completed === undefined) {
      this.completed = null
    } else {
      this.completed = args.completed
    }

    if (args.archived === undefined) {
      this.archived = null
    } else {
      this.archived = args.archived
    }
  }

  toggleCompleted() {
    if (this.completed) {
      this.completed = !this.completed
      return
    }
    this.completed = true
  }

  toggleUseCompleted() {
    this.completed = this.completed === null ? true : null
  }

  toggleIsPriority() {
    if (this.isPriority) {
      this.isPriority = !this.isPriority
      return
    }
    this.isPriority = true
  }

  toggleUseIsPriority() {
    this.isPriority = this.isPriority === null ? true : null
  }

  toggleArchived() {
    if (this.archived) {
      this.archived = !this.archived
      return
    }
    this.archived = true
  }

  toggleUseArchived() {
    this.archived = this.archived === null ? true : null
  }

  addSubjectContains(s: string) {
    if (this.subjectContains) {
      this.subjectContains += ` ${s}`
    } else {
      this.subjectContains = s
    }
  }

  applyFilter(todos: Array<TodoItemModel>): Array<TodoListGroup> {
    const filteredTodos = filterTodos(todos, this)
    return applyGrouping(filteredTodos, this.group)
  }

  toFilterStrings(): Array<string> {
    const str = []
    if (this.subjectContains) str.push(this.subjectContains)

    if (this.archived === true) str.push("is:archived")
    if (this.archived === false) str.push("not:archived")

    if (this.isPriority === true) str.push("is:priority")
    if (this.isPriority === false) str.push("not:priority")

    if (this.completed === true) str.push("is:completed")
    if (this.completed === false) str.push("not:completed")

    if (this.due !== null) str.push(`due:${this.due}`)

    return str
  }

  removeFilterString(str: string) {
    switch (true) {
      case str == "is:archived" || str == "not:archived":
        this.archived = null
        break
      case str == "is:priority" || str == "not:priority":
        this.isPriority = null
        break
      case str == "is:completed" || str == "not:completed":
        this.completed = null
        break
      case str.startsWith("due:"):
        this.due = null
        break
      default:
        this.subjectContains = null
    }
  }

  save() {
    window.localStorage.setItem(FILTER_KEY, JSON.stringify(this))
  }

  toJSON() {
    return {
      contexts: this.contexts,
      projects: this.projects,
      subjectContains: this.subjectContains,
      archived: this.archived,
      isPriority: this.isPriority,
      completed: this.completed,
      due: this.due,
      group: this.group
    }
  }
}

export const LoadFromStorage = (): Filter => {
  const storedFilter = window.localStorage.getItem(FILTER_KEY)
  if (!storedFilter) return new Filter({ archived: false, completed: false })
  return new Filter(JSON.parse(storedFilter))
}
