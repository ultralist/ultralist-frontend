
# Ultralist frontend

This is the web frontend for Ultralist pro.

It is based upon `create-react-app`.

### Running it

1. `yarn`
2. `yarn start`


## Auth flow from CLI

**If you do not have an account**

1. head to https://api.ultralist.io/cli_auth
1. set `cli_auth=true` in backend session
2. redirect to `/signup?cli_auth=true` page
3. oauth flow to backend, web keys
4. from backend, redirect to frontend (`/auth`).  pass web token, `cli_auth`, and `signup` codes.
5. frontend requests `cli_token` via an authenticated request to api.
6. frontend redirects to CLI, passing `cli_token`.
7. CLI redirects back to frontend (`/todolist?cli_auth_completed=true`). 
8. frontend displays message saying auth is complete, and they are signed up.

**If you have an account but are not logged in**

1. head to https://api.ultralist.io/cli_auth
1. set `cli_auth=true` in backend session
2. redirect to `/signup?cli_auth=true` page
3. oauth flow to backend, web keys
4. from backend, redirect to frontend (`/auth`).  pass web token, `cli_auth`, and `signup` codes.
5. frontend responds to `cli_auth` param and requests `cli_token` via an authenticated request to api.
6. frontend redirects to CLI, passing `cli_token`.
7. CLI redirects back to frontend (`todolist?cli_auth_completed=true`). 
8. frontend displays message saying auth is complete.

**If you are logged in**

1. head to https://api.ultralist.io/cli_auth to set `cli_auth` session flag (to be used later)
1. set `cli_auth=true` in backend session
2. redirect to `/signup?cli_auth=true` page
5. frontend responds to `cli_auth` param and requests `cli_token` via an authenticated request to api.
6. frontend redirects to CLI, passing `cli_token`.
7. CLI redirects back to frontend (`todolist?cli_auth_completed=true`). 
frontend displays message saying auth is complete.

