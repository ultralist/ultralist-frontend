// @flow
import React, { useState, useEffect } from "react"
import { parseISO } from "date-fns"
import { withSnackbar } from "notistack"
import { makeStyles } from "@material-ui/styles"
import grey from "@material-ui/core/colors/grey"

import BackendContext from "../shared/backendContext"
import TodoListBackend from "../shared/backend/todoListBackend"

import EventCache from "../shared/backend/eventCache"

import TopBar from "../components/topBar"
import UserIcon from "../components/userIcon"
import TodoList from "../components/todoList/todoList"
import TodoListChooser from "../components/topBar/todoListChooser"
import CreateTodoList from "../components/topBar/createTodoList"
import {
  createAddEvent,
  createUpdateEvent,
  createDeleteEvent
} from "../shared/models/todoEvent"
import TodoItemModel from "../shared/models/todoItem"
import { WebsocketProcessor } from "../config/websocket"

import StorageContext from "../shared/storageContext"
import TodoListStorage from "../shared/storage/todoListStorage"
import UserStorage from "../shared/storage/userStorage"

import TodoListModel, {
  createTodoListFromBackend
} from "../shared/models/todoList"

const eventCache = new EventCache()
const TODOLIST_MRU_KEY = "todolist-mru-id"

const useStyles = makeStyles({
  greyBackground: {
    backgroundColor: grey[200],
    height: "100vh"
  }
})

const TodoListApp = (props: Props) => {
  const classes = useStyles()
  const todoListStorage = new TodoListStorage(React.useContext(StorageContext))
  const userStorage = new UserStorage(React.useContext(StorageContext))

  const todoLists = todoListStorage.loadTodoLists()

  let mostRecentTodoList
  if (props.match.params.id) {
    mostRecentTodoList = todoLists.find(t => t.uuid === props.match.params.id)
    window.localStorage.setItem(TODOLIST_MRU_KEY, mostRecentTodoList.uuid)
  } else {
    mostRecentTodoList = todoLists.find(
      tl => tl.uuid === window.localStorage.getItem(TODOLIST_MRU_KEY)
    )
  }

  const [todoList, setTodoList] = useState(mostRecentTodoList || todoLists[0])

  const user = userStorage.loadUser()
  window.socket.registerSocket(user)

  const backend = new TodoListBackend(
    user.token,
    React.useContext(BackendContext)
  )

  const fetchList = (list: TodoListModel, cb) => {
    if (!navigator.onLine) return

    backend.fetchTodoList(list.uuid).then(l => {
      l = createTodoListFromBackend(l)
      todoListStorage.saveTodoList(l)
      if (cb) cb(l)
    })
  }

  const fetchLists = () => {
    backend.fetchTodoLists().then(todoLists => {
      const lists = todoLists.todolists.map(list =>
        createTodoListFromBackend(list)
      )
      const currentList = lists.find(
        l => l.uuid === window.localStorage.getItem(TODOLIST_MRU_KEY)
      )
      todoListStorage.saveTodoLists(lists)
      setTodoList(currentList)
    })
  }

  const processSocketUpdate = data => {
    setTimeout(() => {
      const updatedAt = parseISO(data.data.updated_at)
      const updatedList = todoListStorage.loadTodoList(data.data.uuid)
      if (updatedAt > updatedList.updatedAt) {
        if (updatedList.uuid === todoList.uuid) {
          fetchList(updatedList, list => setTodoList(list))
        } else {
          fetchList(updatedList)
        }
      }
    }, 500)
  }

  useEffect(() => {
    fetchLists()

    const socketProcessor = new WebsocketProcessor(
      "todolist_update",
      processSocketUpdate
    )
    window.socket.registerProcessor(socketProcessor)

    return () => {
      window.socket.deregisterProcessor("todolist_update")
    }
  }, [])

  const update = () => {
    if (!navigator.onLine) return

    backend.updateTodoList(todoList.uuid, eventCache).then(list => {
      const newTodoList = createTodoListFromBackend(list)
      todoListStorage.saveTodoList(newTodoList)
      setTodoList(newTodoList)
      eventCache.clear()
    })
  }

  const onAddTodoItem = (todoItem: TodoItemModel) => {
    eventCache.addItem(createAddEvent(todoItem))
    update()
  }

  const onChangeTodoItem = (todoItem: TodoItemModel) => {
    eventCache.addItem(createUpdateEvent(todoItem))
    update()
  }

  const onDeleteTodoItem = (todoItem: TodoItemModel) => {
    eventCache.addItem(createDeleteEvent(todoItem))
    update()
  }

  const onChangeTodoList = (newList: TodoListModel) => {
    props.history.push(`/todolist/${newList.uuid}`)
    setTodoList(newList)
    fetchList(newList, list => setTodoList(list))
  }

  const onCreateTodoList = (todoList: TodoListModel) => {
    backend.createTodoList(todoList.uuid, todoList.name).then(todoList => {
      todoList = createTodoListFromBackend(todoList)
      const lists = todoListStorage.loadTodoLists()
      lists.push(todoList)
      todoListStorage.saveTodoLists(lists)
      props.enqueueSnackbar("Todolist created.")
      setTodoList(todoList)
    })
  }

  return (
    <React.Fragment>
      <div className={classes.greyBackground}>
        <TopBar>
          <CreateTodoList onCreateTodoList={onCreateTodoList} />
          <TodoListChooser
            todoLists={todoLists}
            onSelectTodoList={onChangeTodoList}
          />
          <UserIcon />
        </TopBar>

        <TodoList
          todoList={todoList}
          onAddTodoItem={onAddTodoItem}
          onChangeTodoItem={onChangeTodoItem}
          onDeleteTodoItem={onDeleteTodoItem}
        />
      </div>
    </React.Fragment>
  )
}
export default withSnackbar(TodoListApp)
