// @flow

import TodoItemModel from "../todoItem"
import FilterModel from "../filter"

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
    if (filter.due == "agenda")
      if (todo.dueDate() !== null && todo.dueDate() > new Date()) return false

    return true
  })
}

export default filterTodos
