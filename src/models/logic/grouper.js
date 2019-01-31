// @flow
import { BY_CONTEXT, BY_PROJECT } from "../../constants"
import TodoItemModel from "../todoItem"
import TodoListGroup from "../todoListGroup"

const applyGrouping = (
  todos: Array<TodoItemModel>,
  grouping: string | null
): Array<TodoListGroup> => {
  switch (grouping) {
    case BY_CONTEXT:
      return sort(byContext(todos))
    case BY_PROJECT:
      return sort(byProject(todos))
    default:
      return byAll(todos)
  }
}

const byContext = (todos: Array<TodoItemModel>): Array<TodoListGroup> => {
  const grouped = []
  getContexts(todos).forEach(context => {
    grouped.push(
      new TodoListGroup({
        name: context,
        todos: todosWithContext(todos, context)
      })
    )
  })
  return grouped
}

const byProject = (todos: Array<TodoItemModel>): Array<TodoListGroup> => {
  const grouped = []
  getProjects(todos).forEach(project => {
    grouped.push(
      new TodoListGroup({
        name: project,
        todos: todosWithProject(todos, project)
      })
    )
  })
  return grouped
}

const byAll = (todos: Array<TodoItemModel>): Array<TodoListGroup> => {
  return [
    new TodoListGroup({
      name: "All todos",
      todos: todos
    })
  ]
}

const getContexts = (todos: Array<TodoItemModel>) => {
  const contexts = []
  todos.forEach(todo => {
    todo.contexts.forEach(context => {
      if (!contexts.includes(context)) contexts.push(context)
    })
    if (todo.contexts.length === 0 && !contexts.includes("No contexts"))
      contexts.push("No contexts")
  })
  return contexts
}

const todosWithContext = (todos: Array<TodoItemModel>, context: string) => {
  const ret = []
  todos.forEach(todo => {
    if (todo.contexts.includes(context)) ret.push(todo)
    if (context === "No contexts" && todo.contexts.length === 0) ret.push(todo)
  })
  return ret
}

const sort = (groups: Array<TodoListGroup>): Array<TodoListGroup> => {
  return groups.sort((g1, g2) => {
    if (g1.name.toLowerCase() < g2.name.toLowerCase()) return -1
    if (g1.name.toLowerCase() > g2.name.toLowerCase()) return 1
    return 0
  })
}

const getProjects = (todos: Array<TodoItemModel>) => {
  const projects = []
  todos.forEach(todo => {
    todo.projects.forEach(project => {
      if (!projects.includes(project)) projects.push(project)
    })
    if (todo.projects.length === 0 && !projects.includes("No projects"))
      projects.push("No projects")
  })
  return projects
}

const todosWithProject = (todos: Array<TodoItemModel>, project: string) => {
  const ret = []
  todos.forEach(todo => {
    if (todo.projects.includes(project)) ret.push(todo)
    if (project === "No projects" && todo.projects.length === 0) ret.push(todo)
  })
  return ret
}

export default applyGrouping
