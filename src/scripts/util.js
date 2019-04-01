import { defaultTools } from './tools'
import Styles from './style_loader'
import { getStyles } from './styles'
import { STYLE_ID } from './constants'

export const appendChild = (parent, child) => parent.appendChild(child)

export const createElement = tag => document.createElement(tag)

export const queryCommandState = command => document.queryCommandState(command)

export const queryCommandValue = command => document.queryCommandValue(command)

export const exec = (command, value = null) => document.execCommand(command, false, value)

export const removeEventListener = (parent, type, listener) =>
  parent.removeEventListener(type, listener)

export const addEventListener = (parent, type, listener) =>
  parent.addEventListener(type, listener)

export const getMutationObserver = (elementSelector, callback) => {
  const observer = new MutationObserver(callback)
  const config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  }
  observer.observe(elementSelector, config)

  return observer
}

export const debounce = (func, wait = 250, immediate = false) => {
  let timeout
  return (...args) => {
    let context = this
    let later = () => {
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }
    let callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) {
      func.apply(context, args)
    }
  }
}

export const noContent = el => Boolean(!el || !el.innerHTML || el.innerHTML === '<br>')

/**
 * Checks the current list state for UL or OL
 * If in list state, then disable tools not allowed for list items
 * @return {void}
 */
export const checkListDisable = (buttons) => {
  const isUl = queryCommandState('insertUnorderedList')
  const isOl = queryCommandState('insertOrderedList')
  const state = isUl != false || isOl != false

  const disableIds = Object
    .entries(buttons)
    .reduce((ids, [ id, { tool } ]) => {
      id && tool && tool.listDisable && ids.push(id)
      return ids
    }, [])

  return { disableIds, state }
}
