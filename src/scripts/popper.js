import Popper from 'popper.js'
import { setCaretPosition } from './selection'
import { addEventListener } from './util'

const buildPopperOpts = (settings, cb) => ({
  removeOnDestroy: true,
  placement: 'bottom-start',
  onCreate: cb(settings),
  ...settings.popper,
  modifiers: {
    offset: { offset: 5 },
    keepTogether: { enabled: true },
    preventOverflow: {
      enabled: true,
      padding: 10,
      escapeWithReference: false,
    },
    ...(settings.popper && settings.popper.modifiers || {})
  },
})

/**
 * Callback called when a popper.js instance is created
 * @param  { object } settings - props that define how WYSIWYG editor functions
 * @return { function }
 */
const onPopperCreate = (settings, onSelChange) => {
  return (instance) => {
    const { Editor, element, popper } = settings
    const caretEl = element.firstChild || element
    setCaretPosition(caretEl, 0)
    popper && popper.onCreate && popper.onCreate(popper, settings)
    element.focus()
  }
}

/**
 * Add Popper to the editor with the joined default and passed int popper settings
 * @param { object } settings - props that define how WYSIWYG editor functions
 * @param  { dom node } rootEl - root element of the editor
 * @return { void }
 */
export default (settings, rootEl, cb) => {
  const { Editor, element, isStatic, offset } = settings
  if (isStatic) return null

  if (Editor.popper){
    Editor.popper.destroy()
    Editor.popper = null
  }

  Editor.caretPos = element.getBoundingClientRect()
  Editor.caretPos.y = Editor.caretPos.y + offset.y || 0
  Editor.caretPos.x = Editor.caretPos.x + offset.x || 0
  // Set the def caret pos
  // Will be updated separately, but the popper holds a reference to this object
  // When updating this object it also updates the reference in the popper object
  const ref = {
    getBoundingClientRect: () => ({
      top: Editor.caretPos.y,
      right: Editor.caretPos.x,
      bottom: Editor.caretPos.y,
      left: Editor.caretPos.x,
      width: Editor.caretPos.width,
      height: Editor.caretPos.height,
    }),
    clientWidth: element.clientWidth,
    clientHeight: element.clientHeight,
  }

  const popperProps = buildPopperOpts(settings, onPopperCreate)
  Editor.popper = new Popper(ref, rootEl, popperProps)
  cb(settings)
}

