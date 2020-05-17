// Groupings
export const BY_ALL = "all"
export const BY_CONTEXT = "context"
export const BY_PROJECT = "project"

// filter stuff
export const FILTER_KEY = "filter-key"

export const backendUrl = () => {
  if (window.location.hostname === "app.ultralist.io") {
    return "https://api.ultralist.io"
  }
  if (window.location.hostname === "staging.ultralist.io") {
    return "https://api-stag.ultralist.io"
  }
  return "http://localhost:3000"
}
