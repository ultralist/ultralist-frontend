// @flow
import React from "react"

import { withSnackbar } from "notistack"

import BackendContext from "../../shared/backendContext"
import UserBackend from "../../shared/backend/userBackend"

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from "@material-ui/core"

import { makeStyles } from "@material-ui/styles"

import UserContext from "../utils/userContext"
import TimeZones from "./timeZones"

const useStyles = makeStyles({
  section: {
    marginTop: 15,
    marginBottom: 15
  },
  margined: {
    padding: 20
  },
  flexed: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%"
  }
})

const Profile = props => {
  const classes = useStyles()
  const { user, setUser } = React.useContext(UserContext)

  const backend = new UserBackend(user.token, React.useContext(BackendContext))

  const [timeZone, setTimeZone] = React.useState(user.timeZone)
  const [name, setName] = React.useState(user.name)

  const onSetTimeZone = ev => {
    setTimeZone(ev.target.value)
  }

  const onChangeName = ev => {
    setName(ev.target.value)
  }

  const onSave = () => {
    user.timeZone = timeZone
    user.name = name
    setUser(user)

    backend.updateUser(user).then(() => {
      props.enqueueSnackbar("Profile info saved.")
    })
  }

  return (
    <Paper elevation={2} className={classes.section}>
      <div className={classes.margined}>
        <Typography variant="h5">Your Profile</Typography>

        <div className={classes.flexed}>
          <TextField label="Name" value={name} onChange={onChangeName} />

          <FormControl>
            <InputLabel>Time Zone</InputLabel>
            <Select value={timeZone} onChange={onSetTimeZone}>
              {TimeZones.map(tz => (
                <MenuItem key={tz} value={tz}>
                  {tz}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={onSave}>
            Save
          </Button>
        </div>
      </div>
    </Paper>
  )
}

export default withSnackbar(Profile)
