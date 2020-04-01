import EventCache from "./eventCache"

export default class Backend {
  token: string

  constructor(token: string) {
    this.token = token
  }

  fetchTodoLists() {
    return this.apiRequest("api/v1/todo_lists", "GET")
  }

  fetchTodoList(uuid: string) {
    return this.apiRequest(`api/v1/todo_lists/${uuid}`, "GET")
  }

  updateTodoList(todolistUUID: string, cache: EventCache) {
    return this.apiRequest(`api/v1/todo_lists/${todolistUUID}`, "PUT", {
      events: cache.toJSON()
    })
  }

  createTodoList(uuid: string, name: string) {
    return this.apiRequest(`api/v1/todo_lists`, "POST", {
      todolist: {
        uuid: uuid,
        name
      }
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

      let url = `${backendUrl()}/${path}`

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

export const backendUrl = () => {
  if (window.location.hostname === "app.ultralist.io") {
    return "https://api.ultralist.io"
  }
  if (window.location.hostname === "staging.ultralist.io") {
    return "https://api-stag.ultralist.io"
  }
  return "http://localhost:3000"
}
