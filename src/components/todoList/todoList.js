// @flow
import React from "react"

import { Container, Fab, Tooltip, Typography } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import SettingsIcon from "@material-ui/icons/Settings"

import { makeStyles } from "@material-ui/styles"
import { withSnackbar } from "notistack"

import FilterContext from "../utils/filterContext"

import TodoItemModel from "../../shared/models/todoItem"
import TodoListModel from "../../shared/models/todoList"
import UserModel from "../../shared/models/user"

import StorageContext from "../../shared/storageContext"
import UserStorage from "../../shared/storage/userStorage"
import SlackStorage from "../../shared/storage/slackStorage"

import AddTodoDialog from "./addTodoDialog"
import TodoGroup from "./todoGroup"
import View from "./views/view"
import BottomBar from "../bottomBar"

import CLIAuthCompletedDialog from "../initialDialogs/CLIAuthCompletedDialog"
import WelcomeDialog from "../initialDialogs/welcomeDialog"
import SlackAppInstalledDialog from "../initialDialogs/slackAppInstalledDialog"
import SlackAddUserDialog from "../initialDialogs/slackAddUserDialog"

import KanbanTodoList from "./kanbanTodoList"

type Props = {
  todoList: TodoListModel,
  user: UserModel,
  onAddTodoItem: (todoItem: TodoItemModel) => void,
  onChangeTodoItem: (todoItem: TodoItemModel) => void,
  onDeleteTodoItem: (todoItem: TodoItemModel) => void
}

const useStyles = makeStyles({
  mainContainer: {
    overflow: "auto",
    maxHeight: "calc(100vh - 134px)"
  },
  listName: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20
  },
  filterChips: {
    display: "flex",
    margin: 15,
    border: "1px solid #ddd",
    borderRadius: "3px",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  fab: {
    position: "fixed",
    zIndex: 1101,
    bottom: 30,
    left: 0,
    right: 0,
    margin: "0 auto"
  },
  settingsIcon: {
    color: "#aaa"
  }
})

const TodoList = (props: Props) => {
  const classes = useStyles()

  const { filter, setFilter } = React.useContext(FilterContext)

  const [showAddTodoItemDialog, setShowAddTodoItemDialog] = React.useState(
    false
  )
  const [newTodoItemAttrs, setNewTodoItemAttrs] = React.useState({})
  const storageContext = React.useContext(StorageContext)

  const userStorage = new UserStorage(storageContext)
  const slackStorage = new SlackStorage(storageContext)

  const filteredTodos = filter.applyFilter(
    props.todoList.todos.map(t => new TodoItemModel(t))
  )

  const onAddTodo = (todo: TodoItemModel) => {
    props.enqueueSnackbar("Todo Added.")
    props.onAddTodoItem(todo)
  }

  const onChangeTodo = (todo: TodoItemModel) => {
    setTimeout(() => props.onChangeTodoItem(todo), 500)
    props.enqueueSnackbar("Todo updated.")
  }

  const onDeleteTodo = (todo: TodoItemModel) => {
    props.enqueueSnackbar("Todo deleted.")
    props.onDeleteTodoItem(todo)
  }

  const onSubjectClick = (subject: string) => {
    filter.addSubjectContains(subject)
    setFilter(filter)
  }

  const onSetTodoItemStatus = (uuid: string, status: string) => {
    const todo = props.todoList.todos.find(t => t.uuid === uuid)
    todo.setStatus(status)
    props.onChangeTodoItem(todo)
  }

  const onShowAddTodoItemDialog = (attrs: Object) => {
    setNewTodoItemAttrs(attrs || {})
    setShowAddTodoItemDialog(true)
  }

  const onCloseAddTodoItemDialog = () => {
    setShowAddTodoItemDialog(false)
  }

  const GroupView = () => {
    const groups = filter.applyGrouping(filteredTodos)

    return (
      <Container maxWidth="md">
        {groups.map(g => (
          <TodoGroup
            key={g.uuid}
            selectedTodoUUID={null}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
            onSubjectClick={onSubjectClick}
            group={g}
            kanbanView={false}
          />
        ))}
      </Container>
    )
  }

  return (
    <React.Fragment>
      <div className={classes.mainContainer}>
        <div>
          <Typography component="h4" variant="h4" className={classes.listName}>
            {props.todoList.name}{" "}
            <span className={classes.settingsIcon}>
              <SettingsIcon />
            </span>
          </Typography>
        </div>

        <View todoListUUID={props.todoList.uuid} />

        {filter.group !== "kanban" && <GroupView />}
        {filter.group === "kanban" && (
          <KanbanTodoList
            groups={filter.applyKanbanGrouping(filteredTodos)}
            onChangeTodo={onChangeTodo}
            onDeleteTodo={onDeleteTodo}
            onSubjectClick={onSubjectClick}
            onSetTodoItemStatus={onSetTodoItemStatus}
            onShowAddTodoItemDialog={onShowAddTodoItemDialog}
          />
        )}
      </div>

      {userStorage.getCLIAuthCompleted() && !userStorage.getSignup() && (
        <CLIAuthCompletedDialog />
      )}

      {userStorage.getSignup() && <WelcomeDialog />}
      {userStorage.getSlackAppInstalled() && <SlackAppInstalledDialog />}
      {slackStorage.userAuth && <SlackAddUserDialog />}

      <Fab onClick={onShowAddTodoItemDialog} className={classes.fab}>
        <Tooltip disableFocusListener={true} title="Add a task">
          <AddIcon />
        </Tooltip>
      </Fab>
      <BottomBar todoListUUID={props.todoList.uuid} />
      <AddTodoDialog
        show={showAddTodoItemDialog}
        onClose={onCloseAddTodoItemDialog}
        onAddTodoItem={onAddTodo}
        todoItemAttrs={newTodoItemAttrs}
      />
    </React.Fragment>
  )
}

export default withSnackbar(TodoList)
