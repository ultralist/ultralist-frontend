// @flow
import UserModel from "../shared/models/user"

export class WebsocketProcessor {
  name: string
  processorFn: (data: Object) => void

  constructor(name: string, processorFn: (data: Object) => void) {
    this.name = name
    this.processorFn = processorFn
  }
}

export class WebsocketHandler {
  processors: Array<WebsocketProcessor>
  socket: WebSocket
  user: UserModel

  constructor() {
    this.processors = []
  }

  registerSocket(user?: UserModel) {
    if (this.socket && this.socket.readyState === this.socket.OPEN) return

    if (user) this.user = user

    const msg = {
      client_id: "frontend",
      channel: this.user.uuid,
      request: "register_listener"
    }

    this.socket = new WebSocket(socketUrl())

    this.socket.onopen = () => {
      this.socket.send(JSON.stringify(msg))
      this.ping()
    }

    this.socket.onmessage = event => {
      const data = JSON.parse(event.data)
      this.processors.forEach(processor => processor.processorFn(data))
    }

    this.socket.onclose = event => {
      setTimeout(this.registerSocket.bind(this), 5000)
    }
  }

  ping() {
    if (!this.socket) return
    if (this.socket.readyState !== this.socket.OPEN) return

    const msg = {
      client_id: "frontend",
      channel: this.user.uuid,
      request: "ping"
    }

    this.socket.send(JSON.stringify(msg))
    setTimeout(this.ping.bind(this), 10000)
  }

  registerProcessor(processor: WebsocketProcessor) {
    this.processors.push(processor)
  }

  deregisterProcessor(name: string) {
    this.processors = this.processors.filter(p => p.name !== name)
  }
}
window.socket = new WebsocketHandler()

export const socketUrl = () => {
  if (window.location.hostname === "app.ultralist.io") {
    return "wss://api.ultralist.io/ws"
  }
  if (window.location.hostname === "staging.ultralist.io") {
    return "wss://api-stag.ultralist.io/ws"
  }
  return "ws://localhost:8080"
}
