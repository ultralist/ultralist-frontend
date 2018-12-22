// @flow
import { BY_ALL, BY_CONTEXT, BY_PROJECT } from "../../constants"

import TodoItemModel from "../../models/todoItem"
import FilterModel from "../../models/filter"

// group:context
// @context
// +project
// no:context
// no:project
// dingleberries <- subject search
// is:priority
// is:completed
// is:archived
const textFilter = (input: string): [FilterModel, string] => {
  const filter = {}
  let group = BY_ALL

  input.split(" ").forEach(word => {
    if (word.startsWith("group:")) {
      group = byGroup(word)
    } else if (word === "no:context") {
      filter.contexts = []
    } else if (word === "no:project") {
      filter.projects = []
    } else if (word === "is:priority") {
      filter.isPriority = true
    } else if (word === "is:completed") {
      filter.completed = true
    } else if (word === "is:archived") {
      filter.archived = true
    } else if (word === "not:priority") {
      filter.isPriority = false
    } else if (word === "not:completed") {
      filter.completed = false
    } else if (word === "not:archived") {
      filter.archived = false
    } else {
      filter.subjectContains = word
    }
  })

  const filterModel = new FilterModel(filter)
  return [filterModel, group]
}

const byGroup = word => {
  if (word.split(":")[1] === BY_CONTEXT) {
    return BY_CONTEXT
  } else if (word.split(":")[1] === BY_PROJECT) {
    return BY_PROJECT
  }
}

export default textFilter
