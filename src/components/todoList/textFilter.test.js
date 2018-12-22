// @flow
import textFilter from "./textFilter"
import { BY_ALL, BY_CONTEXT, BY_PROJECT } from "../../constants"

it("filters text", () => {
  const [filter, group] = textFilter("@asdf no:context")

  expect(filter.subjectContains).toEqual("@asdf")
  expect(filter.isPriority).toEqual(null)
  expect(filter.archived).toEqual(null)
  expect(filter.completed).toEqual(null)
  expect(group).toEqual(BY_ALL)
})

it("filters by context and priority", () => {
  const [filter, group] = textFilter("@asdf is:priority group:context")

  expect(filter.subjectContains).toEqual("@asdf")
  expect(filter.isPriority).toEqual(true)
  expect(filter.archived).toEqual(null)
  expect(filter.completed).toEqual(null)
  expect(group).toEqual(BY_CONTEXT)
})

it("filters by context and priority", () => {
  const [filter, group] = textFilter("@asdf not:priority group:context")

  expect(filter.subjectContains).toEqual("@asdf")
  expect(filter.isPriority).toEqual(false)
  expect(filter.archived).toEqual(null)
  expect(filter.completed).toEqual(null)
  expect(group).toEqual(BY_CONTEXT)
})

it("filters by context and priority", () => {
  const [filter, group] = textFilter("@asdf not:priority not:archived")

  expect(filter.subjectContains).toEqual("@asdf")
  expect(filter.isPriority).toEqual(false)
  expect(filter.archived).toEqual(false)
  expect(filter.completed).toEqual(null)
  expect(group).toEqual(BY_ALL)
})
