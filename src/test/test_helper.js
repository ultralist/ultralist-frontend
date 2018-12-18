import { format, addDays } from "date-fns"
import utils from "../utils"

export const todos = [
  {
    id: 1,
    uuid: utils.generateUuid(),
    subject: "Call with @Bob and @Frank about +bigProject",
    projects: ["bigProject"],
    contexts: ["Bob", "Frank"],
    due: format(addDays(new Date(), 1), "YYYY-MM-DD"),
    notes: ["here is note 1", "here is note 2"],
    completed: false,
    archived: false
  },
  {
    id: 2,
    uuid: utils.generateUuid(),
    subject: "Strategy for +mobile @pomodoro",
    projects: ["mobile"],
    contexts: [],
    due: format(new Date(), "YYYY-MM-DD"),
    notes: ["here is note 1", "here is note 2"],
    completed: false,
    archived: false
  },
  {
    id: 3,
    uuid: utils.generateUuid(),
    subject: "Send phone udid to @Marty to test +mobile projects",
    projects: ["mobile"],
    contexts: ["marty"],
    due: format(new Date(), "YYYY-MM-DD"),
    notes: [],
    completed: false,
    archived: false
  },
  {
    id: 4,
    uuid: utils.generateUuid(),
    subject: "Did @john call me back about the +testProject?",
    projects: ["testProject"],
    contexts: ["john"],
    due: format(new Date(), "YYYY-MM-DD"),
    notes: [],
    completed: true,
    archived: false
  },
  {
    id: 5,
    uuid: utils.generateUuid(),
    subject: "Follow up with @nick about 6-month salary increase",
    projects: [],
    contexts: ["Nick"],
    due: format(addDays(new Date(), -2), "YYYY-MM-DD"),
    notes: [],
    completed: true,
    archived: true
  },
  {
    id: 6,
    uuid: utils.generateUuid(),
    subject: "Work on +budget presentation for leadership team, sell to @Nick first",
    projects: ["budget"],
    contexts: ["Nick"],
    due: format(addDays(new Date(), -2), "YYYY-MM-DD"),
    notes: [],
    completed: false,
    archived: false
  }
]
