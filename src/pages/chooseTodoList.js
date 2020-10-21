// @flow
import React from "react"
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@material-ui/core"
import { withSnackbar } from "notistack"
import { makeStyles } from "@material-ui/styles"
import AddIcon from "@material-ui/icons/Add"

import CreateTodoList from "../components/topBar/createTodoList"

import grey from "@material-ui/core/colors/grey"

import UserContext from "../components/utils/userContext"
import EventCacheContext from "../components/utils/eventCacheContext"

import TodoEvent from "../shared/models/todoEvent"

import TopBar from "../components/topBar"
import UserIcon from "../components/userIcon"

const useStyles = makeStyles(theme => ({
  chooseListArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  chooseListLabel: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20
  },
  greyBackground: {
    backgroundColor: grey[50],
    height: "100vh"
  },
  todoLists: {
    backgroundColor: theme.palette.background.paper,
    minWidth: 350,
    maxWidth: "90wv"
  }
}))

const ChooseTodoList = props => {
  const classes = useStyles()
  const { user, setUser } = React.useContext(UserContext)
  const eventCache = React.useContext(EventCacheContext)
  const [
    isCreateTodoListDialogOpen,
    setIsCreateTodoListDialogOpen
  ] = React.useState(false)

  const onCloseCreateTodoListDialog = () => {
    setIsCreateTodoListDialogOpen(false)
  }

  const onChooseTodoList = (todoListUUID: string) => {
    props.history.push(`/todolist/${todoListUUID}`)
  }

  const onCreateTodoList = (tl: TodoListModel) => {
    user.todoLists.push(tl)
    setUser(user)
    props.enqueueSnackbar("Todolist created.")
    eventCache.addItem(new TodoEvent("EventAdded", "TodoList", tl))
    props.history.push(`/todolist/${tl.uuid}`)
  }

  return (
    <React.Fragment>
      <div className={classes.greyBackground}>
        <TopBar>
          <UserIcon />
        </TopBar>

        <div className={classes.chooseListArea}>
          <Typography
            component="h4"
            variant="h4"
            className={classes.chooseListLabel}
          >
            Choose a list
          </Typography>

          <List className={classes.todoLists}>
            <ListItem
              button
              onClick={() => setIsCreateTodoListDialogOpen(true)}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>

              <ListItemText primary="Create a new list..." />
            </ListItem>

            <Divider />

            {user.todoLists.map((list, idx) => (
              <React.Fragment key={idx}>
                <ListItem button onClick={() => onChooseTodoList(list.uuid)}>
                  <ListItemText primary={list.name} />
                </ListItem>
                {idx === user.todoLists.length - 1 ? null : <Divider />}
              </React.Fragment>
            ))}
          </List>
        </div>
      </div>
      <CreateTodoList
        onCreateTodoList={onCreateTodoList}
        isOpen={isCreateTodoListDialogOpen}
        onClose={onCloseCreateTodoListDialog}
      />
    </React.Fragment>
  )
}

export default withSnackbar(ChooseTodoList)
