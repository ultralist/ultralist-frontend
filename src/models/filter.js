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
    this.contexts = args.contexts || null
    this.projects = args.projects || null
    this.subjectContains = args.subjectContains || null
    this.archived = args.archived || null

    if (args.isPriority === undefined) {
      this.isPriority = null
    } else {
      this.isPriority = args.isPriority
    }

    if (args.completed === undefined) {
      this.completed = null
    } else {
      this.completed = args.completed
    }

    if (args.archived === undefined) {
      this.archived = null
    } else {
      this.archived = args.archived
    }
  }
}