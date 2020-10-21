import React from "react"

const EventCacheContext = React.createContext({
  eventCache: {},
  setEventCache: ec => {}
})

export default EventCacheContext
