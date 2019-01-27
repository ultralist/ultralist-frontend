// @flow
import React from "react"
import { BY_ALL, BY_CONTEXT, BY_PROJECT } from "../../constants"

import FilterModel from "../filter"

// group:context
// @context
// +project
// no:context
// no:project
// dingleberries <- subject search
// is:priority
// is:completed
// is:archived
// not:priority
// not:completed
// not:archived
const textFilter = {
  filter: (input: string): FilterModel => {
    const filter = {}

    input.split(" ").forEach(word => {
      if (word.startsWith("group:")) {
        filter.group = byGroup(word)
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
      } else if (word === "due:agenda") {
        filter.due = "agenda"
      } else {
        filter.subjectContains = word
      }
    })

    return new FilterModel(filter)
  },
  textFilterHasPrefix: (searchRef: React.ElementRef, prefix: string) => {
    if (!searchRef.current) return false
    const words = searchRef.current.value.split(" ")
    return words.some(word => word.startsWith(prefix))
  },
  isPriority: (searchRef: React.ElementRef) => {
    if (!searchRef.current) return false
    let words = searchRef.current.value.split(" ")
    return words.some(word => word === "is:priority")
  },
  isArchived: (searchRef: React.ElementRef) => {
    if (!searchRef.current) return false
    let words = searchRef.current.value.split(" ")
    return words.some(word => word === "is:archived")
  },
  isCompleted: (searchRef: React.ElementRef) => {
    if (!searchRef.current) return false
    let words = searchRef.current.value.split(" ")
    return words.some(word => word === "is:completed")
  },
  currentGrouping: (searchRef: React.ElementRef) => {
    if (!searchRef.current) return BY_ALL
    let words = searchRef.current.value.split(" ")
    const group = words.filter(word => word.startsWith("group:"))
    if (group.length === 0) {
      return BY_ALL
    } else {
      return group[0].split(":")[1]
    }
  },
  removeTextFilter: (
    searchRef: React.ElementRef,
    prefix: string,
    filter: string | null
  ): string => {
    let currentFilter = []
    if (searchRef.current) currentFilter = searchRef.current.value.split(" ")
    const cFilter = filter ? filter : ""
    return currentFilter
      .filter(word => !word.startsWith(`${prefix}:${cFilter}`))
      .join(" ")
  },
  changeTextFilter: (
    searchRef: React.ElementRef,
    prefix: string,
    filter: string
  ): string => {
    let currentFilter = []
    if (searchRef.current) currentFilter = searchRef.current.value.split(" ")

    if (textFilter.textFilterHasPrefix(searchRef, prefix)) {
      currentFilter = currentFilter.filter(
        word => !word.startsWith(`${prefix}:`)
      )
    }

    currentFilter.push(`${prefix}:${filter}`)

    return currentFilter.join(" ")
  },
  addTextFilter: (
    searchRef: React.ElementREf,
    prefix: string,
    filter: string
  ): string => {
    let currentFilter = []
    if (searchRef.current) currentFilter = searchRef.current.value.split(" ")

    currentFilter.push(`${prefix}:${filter}`)

    return currentFilter.join(" ")
  }
}

const byGroup = word => {
  if (word.split(":")[1] === BY_CONTEXT) {
    return BY_CONTEXT
  } else if (word.split(":")[1] === BY_PROJECT) {
    return BY_PROJECT
  }
}

export default textFilter
