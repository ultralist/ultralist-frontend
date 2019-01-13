// @flow
import React, { useState } from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import TestBackend from "../backend/testBackend"

import TodoList from "./todoList"

const backend = new TestBackend("fake")

storiesOf("pages/todoList", module).add("Standard", () => (
  <TodoList backend={backend} />
))
