// @flow

type ConstructorArgs = {
  name?: string,
  token?: string,
  email?: string,
  imageUrl?: string
}

export default class User {
  name: string
  token: string
  email: string
  imageUrl: string

  constructor(args: ConstructorArgs) {
    this.name = args.name || ""
    this.token = args.token || ""
    this.email = args.email || ""
    this.imageUrl = args.imageUrl || ""
  }

  save() {
    window.localStorage.setItem("user", JSON.stringify(this.toJSON()))
  }

  toJSON() {
    return {
      name: this.name,
      token: this.token,
      email: this.email,
      imageUrl: this.imageUrl
    }
  }
}

export const loadUser = (): User => {
  const json = JSON.parse(window.localStorage.getItem("user"))
  return new User(json || {})
}
