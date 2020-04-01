// @flow

import TodoItemModel from "../todoItem"
import FilterModel from "../filter"
import {
  differenceInDays,
  addDays,
  isSameDay,
  isMonday,
  isTuesday,
  isWednesday,
  isThursday,
  isFriday,
  isSaturday,
  isSunday
} from "date-fns"

const filterTodos = (
  todos: Array<TodoItemModel>,
  filter: FilterModel
): Array<TodoItemModel> => {
  const filterSubject = (subject: string | null, todo): boolean => {
    if (!subject) return false
    return todo.subject.toLowerCase().includes(subject.toLowerCase())
  }

  return todos.filter(todo => {
    if (filter.contexts !== null)
      if (filter.contexts.length === 0) {
        if (todo.contexts.length > 0) return false
      } else {
        if (!filter.contexts.some(c => todo.contexts.includes(c))) return false
      }

    if (filter.projects !== null)
      if (filter.projects.length === 0) {
        if (todo.projects.length > 0) return false
      } else {
        if (!filter.projects.some(c => todo.projects.includes(c))) return false
      }

    if (filter.subjectContains)
      if (!filterSubject(filter.subjectContains, todo)) return false

    if (filter.archived !== null)
      if (todo.archived !== filter.archived) return false

    if (filter.isPriority !== null)
      if (todo.isPriority !== filter.isPriority) return false

    if (filter.completed !== null)
      if (todo.completed !== filter.completed) return false

    // for agenda filtering, we only want to see todos due today or are overdue
    switch (filter.due) {
      case "agenda":
        if (todo.dueDate() !== null && todo.dueDate() > new Date()) return false
        break
      case "nodue":
        if (todo.dueDate() !== null) return false
        break
      case "overdue":
        if (todo.dueDate() === null) return false
        if (todo.dueDate() !== null && todo.dueDate() >= new Date())
          return false
        break
      case "today":
        if (todo.dueDate() === null) return false
        if (!isSameDay(todo.dueDate(), new Date())) return false
        break
      case "tomorrow":
        if (todo.dueDate() === null) return false
        if (!isSameDay(todo.dueDate(), addDays(new Date(), 1))) return false
        break
      case "mon":
        if (todo.dueDate() === null) return false
        if (differenceInDays(todo.dueDate(), new Date()) > 6) return false
        if (!isMonday(todo.dueDate())) return false
        break
      case "tue":
        if (todo.dueDate() === null) return false
        if (differenceInDays(todo.dueDate(), new Date()) > 6) return false
        if (!isTuesday(todo.dueDate())) return false
        break
      case "wed":
        if (todo.dueDate() === null) return false
        if (differenceInDays(todo.dueDate(), new Date()) > 6) return false
        if (!isWednesday(todo.dueDate())) return false
        break
      case "thu":
        if (todo.dueDate() === null) return false
        if (differenceInDays(todo.dueDate(), new Date()) > 6) return false
        if (!isThursday(todo.dueDate())) return false
      case "fri":
        if (todo.dueDate() === null) return false
        if (differenceInDays(todo.dueDate(), new Date()) > 6) return false
        if (!isFriday(todo.dueDate())) return false
      case "sat":
        if (todo.dueDate() === null) return false
        if (differenceInDays(todo.dueDate(), new Date()) > 6) return false
        if (!isSaturday(todo.dueDate())) return false
      case "sun":
        if (todo.dueDate() === null) return false
        if (differenceInDays(todo.dueDate(), new Date()) > 6) return false
        if (!isSunday(todo.dueDate())) return false
        break
    }

    return true
  })
}

export default filterTodos
