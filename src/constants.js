// Groupings

export const backendUrl = () => {
  if (window.location.hostname === "app.ultralist.io") {
    return "https://api.ultralist.io"
  }
  if (window.location.hostname === "staging.ultralist.io") {
    return "https://api-stag.ultralist.io"
  }
  return "http://localhost:3000"
}
