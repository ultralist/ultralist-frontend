# Plan

**Todo list actions**

1. Add todo
2. edit todolist name
3. group todos by context/project/none
4. search/filter todos

## Todo item actions

**All actions**
* [ ] complete/uncomplete
* [ ] archive/unarchive
* [ ] prioritize/unprioritize
* [ ] Due today/tomorrow/set due date
* [ ] edit title
* [ ] list notes


**desktop actions**
* [ ] left side - complete/uncomplete
* [ ] left side - Prioritize/unprioritize
* [ ] right - due today || archive (depending if complete)
* [ ] right - edit
* [ ] right - show notes

**mobile actions**
* left - complete/uncomplete
* right - actions menu
  * prioritize/unprioritize
  * due today || archive (depending if complete)
  * show notes
  * open edit modal
    * set title
    * set due date

---

!archived


search bar:
```
is:priority is:archived @bob

group:context is:priority @bob completedAt no:context
```

that generates this JSON, which can be fed into a searching class
```
{
  contexts: ["bob],
  projects: [],
  subjectContains: ["bob"]
  group: "context"
  isArchived: true,
  isPriority: false,
  completed: false
}

```

# next

1. Be able to fetch todos from server using service worker (explore how service workers work)
2. Todo list switcher component
3. Introduce routes - login page, logout page, signup page, todo list page
4. create the actual app, host frontend on netlify


## TODO

* show app bar
* todo list switcher component
* login page
* [ ] need a control to show notes in responsive mode
*
