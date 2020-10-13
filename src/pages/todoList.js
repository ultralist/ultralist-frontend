// @flow
import React from "react"
import { Redirect } from "react-router-dom"

import { parseISO, differenceInSeconds } from "date-fns"
import { withSnackbar } from "notistack"
import { makeStyles } from "@material-ui/styles"
import grey from "@material-ui/core/colors/grey"

import BackendContext from "../shared/backendContext"
import TodoListBackend from "../shared/backend/todoListBackend"
import EventsBackend from "../shared/backend/eventsBackend"

import EventCache from "../shared/backend/eventCache"

import TopBar from "../components/topBar"
import UserIcon from "../components/userIcon"
import TodoList from "../components/todoList/todoList"
import TodoListChooser from "../components/topBar/todoListChooser"
import CreateTodoList from "../components/topBar/createTodoList"
import TodoEvent from "../shared/models/todoEvent"
import { WebsocketProcessor } from "../config/websocket"

import TodoListModel from "../shared/models/todoList"
import FilterModel from "../shared/models/filter"

import UserContext from "../components/utils/userContext"
import TodoListContext from "../components/utils/todoListContext"

import UserBackend from "../shared/backend/userBackend"
import BrowserStorage from "../shared/storage/browserStorage"
import UserStorage from "../shared/storage/userStorage"

const storage = new BrowserStorage()
const eventCache = new EventCache()
const userStorage = new UserStorage(storage)

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
  const userBackend = new UserBackend(
    user.token,
    React.useContext(BackendContext)
  )

  const backend = new TodoListBackend(
    user ? user.token : "",
    React.useContext(BackendContext)
  )

  const eventsBackend = new EventsBackend(
    user ? user.token : "",
    React.useContext(BackendContext)
  )

  const [todoList, setTodoList] = React.useState(() => {
    const byId = user.todoLists.find(
      list => list.uuid === props.match.params.id
    )
    const todoListUUID = byId ? byId.uuid : user.todoLists[0].uuid
    const tl = new TodoListModel(
      user.todoLists.find(l => l.uuid === todoListUUID)
    )
    tl.eventCache = eventCache

    return tl
  })

  const [view, setView] = React.useState(todoList.defaultView())

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

    window.addEventListener("focus", onFocus)
    window.socket.registerProcessor(socketProcessor)
    window.socket.registerSocket(user)
    fetchList(todoList.uuid) // Fetch the list on page load / reload

    return () => {
      window.removeEventListener("focus", onFocus)
    }
  }, [])

  const onChangeTodoList = (t: TodoListModel) => {
    t.eventCache = eventCache
    t.updatedAt = new Date().toISOString()

    //update user cache so processSocketUpdate has fresh data
    const idx = user.todoLists.findIndex(l => l.uuid === t.uuid)
    user.todoLists.splice(idx, 1, t)
    setUser(user)

    setTodoList(t)
    publishEvents()
  }

  const publishEvents = () => {
    if (!navigator.onLine) return
    if (eventCache.cache.length === 0) return

    eventsBackend.publishEvents(eventCache).then(() => {
      eventCache.clear()
    })
  }

  const onChooseTodoList = (newList: TodoListModel) => {
    props.history.push(`/todolist/${newList.uuid}`)
    const list = new TodoListModel({ ...newList, eventCache })
    setTodoList(list)
    onSetView(list.defaultView())

    if (!navigator.onLine) return

    // do I need this?
    //userBackend.getUser().then(setUser)
  }

  const onCreateTodoList = (todoList: TodoListModel) => {
    // add to the event cache, and publish event cache
    eventCache.addItem(new TodoEvent("EventAdded", todoList, "TodoList"))
    setTodoList(todoList)
    props.enqueueSnackbar("Todolist created.")
    publishEvents()
  }

  if (!props.match.params.id) {
    props.history.push(`/todolist/${todoList.uuid}`)
    return null
  }

  if (!user) {
    return <Redirect to="/login" />
  }

  return (
    <React.Fragment>
      <div className={classes.greyBackground}>
        <TopBar>
          <CreateTodoList onCreateTodoList={onCreateTodoList} />
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
