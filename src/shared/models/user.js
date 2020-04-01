// @flow

type ConstructorArgs = {
  name?: string,
  token?: string,
  email?: string,
  imageUrl?: string,
  uuid?: string
}

export default class User {
  name: string
  token: string
  email: string
  imageUrl: string
  uuid: string

  constructor(args: ConstructorArgs) {
    this.name = args.name || ""
    this.token = args.token || ""
    this.email = args.email || ""
    this.imageUrl = args.imageUrl || ""
    this.uuid = args.uuid || ""
  }

  save() {
    window.localStorage.setItem("user", JSON.stringify(this.toJSON()))
  }

  toJSON() {
    return {
      name: this.name,
      token: this.token,
      email: this.email,
      uuid: this.uuid,
      imageUrl: this.imageUrl
    }
  }
}

export const loadUser = (): User => {
  const json = JSON.parse(window.localStorage.getItem("user"))
  return new User(json || {})
}

export const logoutUser = (): User => {
  window.localStorage.clear()
}

export const isUserLoggedIn = (): boolean => {
  const user = JSON.parse(window.localStorage.getItem("user"))
  if (user === null) return false
  return true
}
