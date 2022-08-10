import type { MutableRefObject } from 'react'

export type TargetElement = HTMLElement | Window | null | undefined

function getTargetRect(target: TargetElement): DOMRect {
  return target !== window
    ? (target as HTMLElement).getBoundingClientRect()
    : ({ top: 0, bottom: window.innerHeight } as DOMRect)
}

type TargetValue<T> = T | undefined | null

type TargetType = HTMLElement | Element | Window | Document
export type BasicTarget<T extends TargetType = Element> =
  | (() => TargetValue<T>)
  | TargetValue<T>
  | MutableRefObject<TargetValue<T>>

export function getTargetElement<T extends TargetType>(target: BasicTarget<T>, defaultElement?: T) {
  if (!window) {
    return undefined
  }

  if (!target) {
    return defaultElement
  }

  let targetElement: TargetValue<T>

  if (typeof target === 'function') {
    targetElement = target()
  } else if ('current' in target) {
    targetElement = target.current
  } else {
    targetElement = target
  }

  return targetElement
}
