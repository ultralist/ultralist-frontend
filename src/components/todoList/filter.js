// @flow

import TodoItemModel from "../../models/todoItem"
import FilterModel from "../../models/filter"

const filter = (todos: Array<TodoItemModel>, filter: FilterModel): Array<TodoItemModel> => {
  const filterSubject = (subject: string | null, todo): boolean => {
    if (!subject) return false
    return todo.subject.toLowerCase().includes(subject.toLowerCase())
  }
  const contexts = filter.contexts || []
  const projects = filter.projects || []

  return todos.filter(todo => {
    if (contexts.length > 0)
      if (!contexts.some(c => todo.contexts.includes(c))) return false

    if (projects.length > 0)
      if (!projects.some(c => todo.projects.includes(c))) return false

    if (filter.subjectContains)
      if (!filterSubject(filter.subjectContains, todo)) return false

    if (filter.archived !== null)
      if (todo.archived !== filter.archived) return false

    if (filter.isPriority !== null)
      if (todo.isPriority !== filter.isPriority) return false

    if (filter.completed !== null)
      if (todo.completed !== filter.completed) return false

    return true
  })
}

export default filter
