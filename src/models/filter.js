// @flow

type ConstructorArgs = {
  contexts: Array<string> | null,
  projects: Array<string> | null,
  subjectContains: string | null,
  archived: boolean | null,
  isPriority: boolean | null,
  completed: boolean | null
}

export default class Filter {
  contexts: Array<string> | null
  projects: Array<string> | null
  subjectContains: string | null
  archived: boolean | null
  isPriority: boolean | null
  completed: boolean | null

  constructor(args: ConstructorArgs) {
    this.contexts = args.contexts
    this.projects = args.projects
    this.subjectContains = args.subjectContains
    this.archived = args.archived
    this.isPriority = args.isPriority
    this.completed = args.completed
  }
}
