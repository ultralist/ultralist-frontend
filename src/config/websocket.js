// @flow
import { SOCKET_URL } from "../constants"
import UserModel from "../models/user"

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

    this.socket = new WebSocket(SOCKET_URL)

    this.socket.onopen = () => {
      this.socket.send(JSON.stringify(msg))
    }

    this.socket.onmessage = event => {
      const data = JSON.parse(event.data)
      this.processors.forEach(processor => processor.processorFn(data))
    }

    this.socket.onclose = event => {
      setTimeout(this.registerSocket.bind(this), 5000)
    }
  }

  registerProcessor(processor: WebsocketProcessor) {
    this.processors.push(processor)
  }

  deregisterProcessor(name: string) {
    this.processors = this.processors.filter(p => p.name !== name)
  }
}
window.socket = new WebsocketHandler()
