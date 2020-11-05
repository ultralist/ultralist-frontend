// @flow
import React from "react"

import {
  Container,
  Fab,
  IconButton,
  Tooltip,
  Typography
} from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import SettingsIcon from "@material-ui/icons/Settings"

import { makeStyles } from "@material-ui/styles"
import { withSnackbar } from "notistack"

import TodoListContext from "../utils/todoListContext"
import UserContext from "../utils/userContext"

import TodoItemModel from "../../shared/models/todoItem"

import StorageContext from "../../shared/storageContext"
import UserStorage from "../../shared/storage/userStorage"
import SlackStorage from "../../shared/storage/slackStorage"

import AddTodoDialog from "./addTodoDialog"
import TodoGroup from "./todoGroup"
import View from "./views/view"
import BottomBar from "../bottomBar"

import WelcomeDialog from "../initialDialogs/welcomeDialog"
import SlackAppInstalledDialog from "../initialDialogs/slackAppInstalledDialog"
import SlackAddUserDialog from "../initialDialogs/slackAddUserDialog"

import ManageTodolistDialog from "./manageTodolistDialog"

import KanbanTodoList from "./kanbanTodoList"

type Props = {}

const useStyles = makeStyles({
  mainContainer: {
    overflow: "auto",
    maxHeight: "calc(100vh - 132px)"
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

  const { todoList, setTodoList, view } = React.useContext(TodoListContext)
  const { user } = React.useContext(UserContext)

  const [showAddTodoItemDialog, setShowAddTodoItemDialog] = React.useState(
    false
  )
  const [
    showManageTodoListDialog,
    setShowManageTodoListDialog
  ] = React.useState(false)

  const [newTodoItemAttrs, setNewTodoItemAttrs] = React.useState({})
  const storageContext = React.useContext(StorageContext)

  const userStorage = new UserStorage(storageContext)
  const slackStorage = new SlackStorage(storageContext)

  const filteredTodos = view.applyFilter(
    todoList.todos.map(t => new TodoItemModel(t))
  )

  const onAddTodo = (todo: TodoItemModel) => {
    todoList.addTodo(todo)
    setTodoList(todoList)
    props.enqueueSnackbar("Todo Added.")
  }

  const onChangeTodo = (todo: TodoItemModel) => {
    setTimeout(() => {
      todoList.updateTodo(todo)
      setTodoList(todoList)
    }, 500)
    props.enqueueSnackbar("Todo updated.")
  }

  const onDeleteTodo = (todo: TodoItemModel) => {
    todoList.deleteTodo(todo)
    setTodoList(todoList)
    props.enqueueSnackbar("Todo deleted.")
  }

  const onSubjectClick = (subject: string) => {
    view.addSubjectContains(subject)
    setTodoList(todoList)
  }

  const onSetTodoItemStatus = (uuid: string, status: string) => {
    const todo = todoList.todos.find(t => t.uuid === uuid)
    todo.setStatus(status)
    todoList.updateTodo(todo)
    setTodoList(todoList)
  }

  const onShowAddTodoItemDialog = (attrs: Object) => {
    setNewTodoItemAttrs(attrs || {})
    setShowAddTodoItemDialog(true)
  }

  const onCloseAddTodoItemDialog = () => {
    setShowAddTodoItemDialog(false)
  }

  const onCloseManageTodoListDialog = () => {
    setShowManageTodoListDialog(false)
  }

  const GroupView = () => {
    const groups = view.applyGrouping(filteredTodos)

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
            {todoList.name}{" "}
            <span className={classes.settingsIcon}>
              <IconButton onClick={() => setShowManageTodoListDialog(true)}>
                <SettingsIcon />
              </IconButton>
            </span>
          </Typography>
        </div>

        <View todoListUUID={todoList.uuid} />

        {view.group !== "kanban" && <GroupView />}
        {view.group === "kanban" && (
          <KanbanTodoList
            groups={view.applyKanbanGrouping(filteredTodos)}
            onChangeTodo={onChangeTodo}
            onDeleteTodo={onDeleteTodo}
            onSubjectClick={onSubjectClick}
            onSetTodoItemStatus={onSetTodoItemStatus}
            onShowAddTodoItemDialog={onShowAddTodoItemDialog}
          />
        )}
      </div>

      {userStorage.getSignup() && <WelcomeDialog />}
      {userStorage.getSlackAppInstalled() && <SlackAppInstalledDialog />}
      {slackStorage.userAuth && <SlackAddUserDialog />}

      <Fab onClick={onShowAddTodoItemDialog} className={classes.fab}>
        <Tooltip disableFocusListener={true} title="Add a task">
          <AddIcon />
        </Tooltip>
      </Fab>
      <BottomBar todoListUUID={todoList.uuid} />
      <AddTodoDialog
        show={showAddTodoItemDialog}
        onClose={onCloseAddTodoItemDialog}
        onAddTodoItem={onAddTodo}
        todoItemAttrs={newTodoItemAttrs}
      />
      <ManageTodolistDialog
        todoList={todoList}
        onClose={onCloseManageTodoListDialog}
        isOpen={showManageTodoListDialog}
      />
    </React.Fragment>
  )
}

export default withSnackbar(TodoList)
