// @flow
import { ALL, BY_CONTEXT, BY_PROJECT } from "../../constants"
import TodoItemModel from "../../models/todoItem"
import TodoListGroup from "../../models/todoListGroup"

const grouper = {
  grouped(todos: Array<TodoItemModel>, grouping: string): Array<TodoListGroup> {
    switch (grouping) {
      case BY_CONTEXT:
        return priv.sort(this.byContext(todos))
      case BY_PROJECT:
        return priv.sort(this.byProject(todos))
      default:
        return this.byAll(todos)
    }
  },
  byContext(todos: Array<TodoItemModel>): Array<TodoListGroup> {
    const grouped = []
    priv.getContexts(todos).forEach(context => {
      grouped.push(
        new TodoListGroup({
          name: context,
          todos: priv.todosWithContext(todos, context)
        })
      )
    })
    return grouped
  },
  byProject(todos: Array<TodoItemModel>): Array<TodoListGroup> {
    const grouped = []
    priv.getProjects(todos).forEach(project => {
      grouped.push(
        new TodoListGroup({
          name: project,
          todos: priv.todosWithProject(todos, project)
        })
      )
    })
    return grouped
  },
  byAll(todos: Array<TodoItemModel>): Array<TodoListGroup> {
    return [
      new TodoListGroup({
        name: "All todos",
        todos: todos
      })
    ]
  }
}

const priv = {
  getContexts(todos: Array<TodoItemModel>) {
    const contexts = []
    todos.forEach(todo => {
      todo.contexts.forEach(context => {
        if (!contexts.includes(context)) contexts.push(context)
      })
      if (todo.contexts.length === 0) contexts.push("No contexts")
    })
    return contexts
  },
  todosWithContext(todos: Array<TodoItemModel>, context: string) {
    const ret = []
    todos.forEach(todo => {
      if (todo.contexts.includes(context)) ret.push(todo)
      if (context === "No contexts" && todo.contexts.length === 0)
        ret.push(todo)
    })
    return ret
  },
  sort(groups: Array<TodoListGroup>): Array<TodoListGroup> {
    return groups.sort((g1, g2) => {
      if (g1.name.toLowerCase() < g2.name.toLowerCase()) return -1
      if (g1.name.toLowerCase() > g2.name.toLowerCase()) return 1
      return 0
    })
  },
  getProjects(todos: Array<TodoItemModel>) {
    const projects = []
    todos.forEach(todo => {
      todo.projects.forEach(project => {
        if (!projects.includes(project)) projects.push(project)
      })
      if (todo.projects.length === 0) projects.push("No projects")
    })
    return projects
  },
  todosWithProject(todos: Array<TodoItemModel>, project: string) {
    const ret = []
    todos.forEach(todo => {
      if (todo.projects.includes(project)) ret.push(todo)
      if (project === "No projects" && todo.projects.length === 0)
        ret.push(todo)
    })
    return ret
  }
}

export default grouper
