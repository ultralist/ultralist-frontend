// @flow
import utils from "../utils"

export default class TodoItemNote {
  uuid: string
  note: string

  constructor() {
    this.uuid = utils.generateUuid()
  }
}
