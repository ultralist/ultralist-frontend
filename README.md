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
3. oauth flow to backend, create CLI and web keys
4. from backend, redirect to CLI.  need to pass both CLI + web tokens
5. CLI app stores CLI token
6. from CLI - redirects back to web view, passing web token along with it.  user is then signed into both places

**If you have an account but are not logged in**

1. head to https://api.ultralist.io/cli_auth
1. set `cli_auth=true` in backend session
2. redirect to `/signup?cli_auth=true` page
3. oauth flow to backend, creates CLI key. web key is already created.
4. from backend, redirect to CLI.  need to pass both CLI + web tokens
5. CLI app stores CLI token
6. from CLI - redirects back to web view, passing web token along with it.  user is then signed into both places

**If you are logged in**

1. head to https://api.ultralist.io/cli_auth
1. set `cli_auth=true` in backend session
2. redirect to `/signup?cli_auth=true` page
3. from webapp - redirect to backend - backend creates or re-uses CLI key.  web key is already created.
4. from backend - redirect to CLI web server that ultralist CLI pops up.  need to pass both CLI + web tokens
5. CLI stores CLI token
6. from CLI - redirects back to web view, passing web token along with it.  user is then signed into both places
