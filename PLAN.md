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
