import Redis from "ioredis"

class Client {
  constructor() {
    throw new Error("Use Singleton.getInstance()")
  }

  static getInstance(url) {
    if (!Client.instance) {
      Client.instance = new Redis(url)
    }
    return Client.instance
  }
}

export { Client }
