// @flow
import React from "react"
import { Redirect } from "react-router-dom"

import { parseISO, differenceInSeconds } from "date-fns"
import { withSnackbar } from "notistack"
import { makeStyles } from "@material-ui/styles"
import grey from "@material-ui/core/colors/grey"

import BackendContext from "../shared/backendContext"
import TodoListBackend from "../shared/backend/todoListBackend"

import TopBar from "../components/topBar"
import UserIcon from "../components/userIcon"
import TodoList from "../components/todoList/todoList"
import TodoListChooser from "../components/topBar/todoListChooser"
import CreateTodoListIcon from "../components/topBar/createTodoListIcon"
import TodoEvent from "../shared/models/todoEvent"
import { WebsocketProcessor } from "../config/websocket"

import TodoListModel from "../shared/models/todoList"
import FilterModel from "../shared/models/filter"

import UserContext from "../components/utils/userContext"
import EventCacheContext from "../components/utils/eventCacheContext"
import TodoListContext from "../components/utils/todoListContext"

import UserBackend from "../shared/backend/userBackend"

const useStyles = makeStyles({
  greyBackground: {
    backgroundColor: grey[50],
    height: "100vh"
  }
})

type Props = {
  match: any
}

const TodoListApp = (props: Props) => {
  const classes = useStyles()

  const { user, setUser } = React.useContext(UserContext)
  const eventCache = React.useContext(EventCacheContext)

  const userBackend = new UserBackend(
    user.token,
    React.useContext(BackendContext)
  )

  const backend = new TodoListBackend(
    user ? user.token : "",
    React.useContext(BackendContext)
  )

  const [todoList, setTodoList] = React.useState(() => {
    const list = user.todoLists.find(l => l.uuid === props.match.params.id)

    if (!list) {
      return null
    }

    const tl = new TodoListModel(list)
    tl.eventCache = eventCache
    return tl
  })

  const [view, setView] = React.useState(
    todoList ? todoList.defaultView() : null
  )

  const onSetView = (v: FilterModel) => {
    setView(new FilterModel(v))
  }

  const processSocketUpdate = data => {
    const updatedAt = parseISO(data.data.updated_at)
    const updatedList = user.todoLists.find(
      list => list.uuid === data.data.uuid
    )

    if (
      updatedList &&
      differenceInSeconds(updatedAt, parseISO(updatedList.updatedAt)) > 10
    ) {
      fetchList(updatedList.uuid)
    }
  }

  const fetchList = (updatedListUUID: string) => {
    if (!navigator.onLine) return

    backend.fetchTodoList(updatedListUUID).then(list => {
      const idx = user.todoLists.findIndex(l => l.uuid === list.uuid)
      user.todoLists.splice(idx, 1, list)
      setUser(user)
      if (list.uuid === props.match.params.id) {
        setTodoList(new TodoListModel({ ...list, eventCache: eventCache }))
        window.localStorage.setItem(
          "focusUpdate",
          JSON.stringify({ time: new Date().getTime() })
        )
      }
    })
  }

  const onFocus = () => {
    const lastUpdateTime = JSON.parse(
      window.localStorage.getItem("focusUpdate")
    ).time
    const currentTime = new Date().getTime()
    if (currentTime - lastUpdateTime > 600000) {
      fetchList(todoList.uuid)
    }
    window.socket.deregisterProcessor("todolist_update")
    window.socket.registerProcessor(socketProcessor)
  }

  const socketProcessor = new WebsocketProcessor(
    "todolist_update",
    processSocketUpdate
  )

  React.useEffect(() => {
    if (!props.match.params.id) return
    if (!todoList) return

    window.addEventListener("focus", onFocus)
    window.socket.registerProcessor(socketProcessor)
    window.socket.registerSocket(user)
    fetchList(todoList.uuid) // Fetch the list on page load / reload

    return () => {
      window.removeEventListener("focus", onFocus)
    }
  }, [])

  const onChangeTodoList = (t: TodoListModel) => {
    if (!t) {
      onDeleteTodoList()
      return
    }
    t.eventCache = eventCache
    t.updatedAt = new Date().toISOString()

    //update user cache so processSocketUpdate has fresh data
    const idx = user.todoLists.findIndex(l => l.uuid === t.uuid)
    user.todoLists.splice(idx, 1, t)
    setUser(user)

    setTodoList(t)
  }

  const onDeleteTodoList = () => {
    const idx = user.todoLists.findIndex(l => l.uuid === todoList.uuid)
    user.todoLists.splice(idx, 1)
    setUser(user)
    eventCache.addItem(new TodoEvent("EventDeleted", "TodoList", todoList))

    props.history.push("/todolist")
  }

  const onChooseTodoList = (newList: TodoListModel) => {
    props.history.push(`/todolist/${newList.uuid}`)
    const list = new TodoListModel({ ...newList, eventCache })
    setTodoList(list)
    onSetView(list.defaultView())
  }

  const onCreateTodoList = (tl: TodoListModel) => {
    // add to the event cache, and publish event cache
    user.todoLists.push(tl)
    setUser(user)
    setTodoList(tl)
    onSetView(tl.defaultView())
    props.history.push(`/todolist/${tl.uuid}`)
    props.enqueueSnackbar("Todolist created.")
    eventCache.addItem(new TodoEvent("EventAdded", "TodoList", tl))
  }

  if (!props.match.params.id) {
    props.history.push(`/todolist/${todoList.uuid}`)
    return null
  }

  if (!user) {
    return <Redirect to="/login" />
  }

  if (!todoList) {
    props.enqueueSnackbar("A todolist doesn't exist with this id!")
    return <Redirect to="/todolist" />
  }

  return (
    <React.Fragment>
      <div className={classes.greyBackground}>
        <TopBar>
          <CreateTodoListIcon onCreateTodoList={onCreateTodoList} />
          <TodoListChooser
            todoLists={user.todoLists}
            onSelectTodoList={onChooseTodoList}
          />
          <UserIcon />
        </TopBar>

        <TodoListContext.Provider
          value={{
            todoList,
            setTodoList: onChangeTodoList,
            view,
            setView: onSetView
          }}
        >
          <TodoList />
        </TodoListContext.Provider>
      </div>
    </React.Fragment>
  )
}
export default withSnackbar(TodoListApp)
