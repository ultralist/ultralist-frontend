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
import { makeStyles } from "@material-ui/styles"
import AddIcon from "@material-ui/icons/Add"

import grey from "@material-ui/core/colors/grey"

import UserContext from "../components/utils/userContext"

import TopBar from "../components/topBar"
import UserIcon from "../components/userIcon"
import CreateTodoList from "../components/topBar/createTodoList"

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
  const { user } = React.useContext(UserContext)

  const onChooseTodoList = (todoListUUID: string) => {
    props.history.push(`/todolist/${todoListUUID}`)
  }

  const onCreateTodoList = () => {}

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
            <ListItem button onClick={onCreateTodoList}>
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
    </React.Fragment>
  )
}

export default ChooseTodoList
