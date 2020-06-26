// @flow
import React from "react"

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography
} from "@material-ui/core"

import SlackUserModel from "../../shared/models/slackUser"
import TodoListModel from "../../shared/models/todoList"

type Props = {
  slackUser: SlackUserModel,
  todoLists: TodoListModel[],
  show: boolean,
  onClose: () => void,
  onSave: (slackUser: SlackUserModel) => void
}

const EditSlackUserDialog = (props: Props) => {
  const [selectedTodoListID, setSelectedTodoListID] = React.useState(
    props.slackUser.todoListID
  )
  const [receivesAgenda, setReceivesAgenda] = React.useState(
    props.slackUser.receivesAgenda
  )

  const onSetReceivesAgenda = ev => {
    setReceivesAgenda(ev.target.checked)
  }

  const onSetTodoListID = ev => {
    setSelectedTodoListID(ev.target.value)
  }
  const onSave = () => {
    props.slackUser.todoListID = selectedTodoListID
    props.slackUser.receivesAgenda = receivesAgenda
    props.onSave(props.slackUser)
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={props.show} onClose={props.onClose}>
      <DialogTitle>Edit Slack user</DialogTitle>

      <DialogContent>
        <Typography></Typography>
        <FormControl>
          <InputLabel>Todo List to use</InputLabel>
          <Select
            autoWidth
            value={selectedTodoListID}
            onChange={onSetTodoListID}
          >
            {props.todoLists.map(l => (
              <MenuItem key={l.uuid} value={l.uuid}>
                {l.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            Choose the task list you'd like to use when interacting with
            Ultralist on the {props.slackUser.slackTeamDomain} workspace.
          </FormHelperText>
        </FormControl>

        <FormControl>
          <FormControlLabel
            control={
              <Switch checked={receivesAgenda} onChange={onSetReceivesAgenda} />
            }
            label={"Receive agenda at 9am"}
          />

          <FormHelperText>
            Ultralist will DM you your list at 9am each work morning.
          </FormHelperText>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={onSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditSlackUserDialog
