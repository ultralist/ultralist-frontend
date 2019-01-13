import * as constants from "../constants"
import { createTodoListFromBackend } from "../models/todoList"

export default class Backend {
  token: string

  constructor(token: string) {
    this.token = token
  }

  fetchTodoLists() {
    return this.apiRequest("api/v1/todo_lists", "GET").then(todolists => {
      return todolists.todolists.map(t => createTodoListFromBackend(t))
    })
  }

  apiRequest(path: string, method: string, params: object = {}) {
    return new Promise((resolve, reject) => {
      const headers = new Headers()
      if (this.token) {
        headers.append("Authorization", `Bearer ${this.token}`)
      }
      headers.append("Accept", "application/json")
      headers.append("Content-Type", "application/json")

      interface OptsInterface {
        headers: Headers;
        mode: RequestMode;
        method: string;
        body?: string;
      }
      const opts: OptsInterface = { headers, mode: "cors", method }

      let url = `${constants.BACKEND_URL}/${path}`

      if (process.env.NODE_ENV !== "production") {
        console.log("******************************")
        console.log("API request: ", url)
        console.log("API method: ", method)
        console.log("API params: ", params)
        console.log("Using token: ", this.token)
        console.log("******************************")
      }

      if (method === "GET") {
        url += `?${this.toQueryString(params)}`
      } else {
        opts.body = JSON.stringify(params)
      }

      fetch(url, opts)
        .then(resp => {
          if (resp.status !== 200) {
            reject(resp.statusText)
          }
          return resp.json()
        })
        .then(json => resolve(json))
        .catch(error => {
          reject(error)
        })
    })
  }

  toQueryString(obj: object) {
    const parts = []
    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]))
      }
    }
    return parts.join("&")
  }
}
