// @flow
import React from "react"

type Props = {
  val: string,
  onClick: (str: string) => void,
  classes: { project: string, context: string }
}

const isProject = word => {
  return word.startsWith("+")
}

const isContext = word => {
  return word.startsWith("@")
}

export const TodoText = (props: Props) => {
  const words = props.val.split(" ")

  const parsedWords = words.map(word => {
    word = word + " "

    if (isContext(word)) {
      return (
        <a
          className={props.classes.context}
          onClick={() => props.onClick(word.trim())}
        >
          {word}
        </a>
      )
    } else if (isProject(word)) {
      return (
        <a
          className={props.classes.project}
          onClick={() => props.onClick(word.trim())}
        >
          {word}
        </a>
      )
    } else {
      return word
    }
  })

  return <div>{parsedWords}</div>
}

export default TodoText
