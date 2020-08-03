// @flow
import React from "react"

import { Container, Typography } from "@material-ui/core"

import { makeStyles } from "@material-ui/styles"
import { withSnackbar } from "notistack"

import TodoItemModel from "../../shared/models/todoItem"
import TodoListModel from "../../shared/models/todoList"
import FilterModel from "../../shared/models/filter"
import UserModel from "../../shared/models/user"
import FilterChips from "./filterChips"

import StorageContext from "../../shared/storageContext"
import FilterStorage from "../../shared/storage/filterStorage"
import UserStorage from "../../shared/storage/userStorage"
import SlackStorage from "../../shared/storage/slackStorage"

import AddTodo from "./addTodo"
import TodoGroup from "./todoGroup"
import BottomBar from "../bottomBar"

import CLIAuthCompletedDialog from "../initialDialogs/CLIAuthCompletedDialog"
import WelcomeDialog from "../initialDialogs/welcomeDialog"
import SlackAppInstalledDialog from "../initialDialogs/slackAppInstalledDialog"
import SlackAddUserDialog from "../initialDialogs/slackAddUserDialog"

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
    marginTop: 20
  },
  filterChips: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  kanbanHolder: {
    display: "flex",
    overflowX: "auto",
    flexDirection: "row",
    height: "calc(100vh - 272px)"
  },
  kanbanColumn: {
    width: 400,
    minWidth: 400,
    marginLeft: 10,
    marginRight: 10
  }
})

const TodoList = (props: Props) => {
  const classes = useStyles()
  const storageContext = React.useContext(StorageContext)
  const filterStorage = new FilterStorage(storageContext)
  const userStorage = new UserStorage(storageContext)
  const slackStorage = new SlackStorage(storageContext)

  const [filterModelAttrs, setFilterModelAttrs] = React.useState(() => {
    const filterFromStorage = filterStorage.loadFilter()
    if (!filterFromStorage.isEmpty()) return filterFromStorage

    return props.user.defaultFilter()
  })

  const filterModel = new FilterModel(filterModelAttrs)
  const filteredTodos = filterModel.applyFilter(
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
    filterModel.addSubjectContains(subject)
    onChangeFilter(filterModel)
  }

  const onChangeFilter = (filter: FilterModel) => {
    filterStorage.saveFilter(filter)
    setFilterModelAttrs(filter.toJSON())
  }

  const onSetTodoItemStatus = (uuid: string, status: string) => {
    const todo = props.todoList.todos.find(t => t.uuid === uuid)
    todo.setStatus(status)
    props.onChangeTodoItem(todo)
  }

  const GroupView = () => {
    const groups = filterModel.applyGrouping(filteredTodos)

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

  const KanbanView = () => {
    const groups = filterModel.applyKanbanGrouping(filteredTodos)

    return (
      <div className={classes.kanbanHolder}>
        {groups.map((g, idx) => (
          <div key={idx} className={classes.kanbanColumn}>
            <TodoGroup
              key={g.uuid}
              selectedTodoUUID={null}
              onChange={onChangeTodo}
              onDelete={onDeleteTodo}
              onSubjectClick={onSubjectClick}
              onSetTodoItemStatus={onSetTodoItemStatus}
              group={g}
              kanbanView={true}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className={classes.mainContainer}>
        <Typography component="h4" variant="h4" className={classes.listName}>
          {props.todoList.name}
        </Typography>

        <div className={classes.filterChips}>
          <FilterChips
            currentFilter={filterModel}
            onChangeFilter={onChangeFilter}
          />
        </div>

        {filterModel.viewType === "list" && <GroupView />}
        {filterModel.viewType === "kanban" && <KanbanView />}
      </div>

      {userStorage.getCLIAuthCompleted() && !userStorage.getSignup() && (
        <CLIAuthCompletedDialog />
      )}

      {userStorage.getSignup() && <WelcomeDialog />}
      {userStorage.getSlackAppInstalled() && <SlackAppInstalledDialog />}
      {slackStorage.userAuth && <SlackAddUserDialog />}

      <AddTodo onAddTodoItem={onAddTodo} />
      <BottomBar currentFilter={filterModel} onChangeFilter={onChangeFilter} />
    </React.Fragment>
  )
}

export default withSnackbar(TodoList)
