// @flow

import TodoItemModel from "../../models/todoItem"
import FilterModel from "../../models/filter"

const filter = (todos: Array<TodoItemModel>, filter: FilterModel): Array<TodoItemModel> => {
  const filterSubject = (subject: string | null, todo): boolean => {
    if (!subject) return true
    return todo.subject.toLowerCase().includes(subject)
  }
  const contexts = filter.contexts || []
  const projects = filter.projects || []

  return todos.filter(todo => {
    contexts.some(c => todo.contexts.includes(c)) ||
      projects.some(c => todo.projects.includes(c)) ||
      filterSubject(filter.subjectContains, todo) ||
      todo.archived === filter.archived ||
      todo.isPriority === filter.isPriority ||
      todo.completed === filter.completed
  })
}

export default filter
