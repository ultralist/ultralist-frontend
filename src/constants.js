// Groupings
export const BY_ALL = "all"
export const BY_CONTEXT = "context"
export const BY_PROJECT = "project"

// URLs
export const PROD_BACKEND_URL = "https://api.ultralist.io"
export const LOCAL_BACKEND_URL = "http://localhost:3000"
export const BACKEND_URL =
  process.env.NODE_ENV === "production" ? PROD_BACKEND_URL : LOCAL_BACKEND_URL
