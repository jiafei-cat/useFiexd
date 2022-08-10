import React from "react"
import throttle from 'lodash/throttle'
import type { TargetElement, BasicTarget } from './utils'
import { getTargetElement } from './utils'

const { useRef, useState, useEffect, useCallback } = React

export interface Options {
  offsetTop?: number
  offsetBottom?: number
  target?: BasicTarget
  onChange?: (fixed?: boolean) => void
}

enum FloatStatus {
  SHOW_TARGET,
  SHOW_PLACE_HOLDER,
}

export default function useFixed(fixedElement: BasicTarget, options: Options) {
  const placeHolderRef = useRef<HTMLDivElement | null>(null)
  const statusRef = useRef(FloatStatus.SHOW_TARGET)
  const fixedElementRef = useRef<ReturnType<typeof getTargetElement> | null>(null)

  function listenerScroll() {
    const isFixedTop = options.offsetBottom === undefined
    const offsetTop = options.offsetTop ?? 0
    const offsetBottom = options.offsetBottom ?? 0
    const isTargetFixed = statusRef.current === FloatStatus.SHOW_TARGET

    const { bottom, top } = isTargetFixed ? fixedElementRef.current.getBoundingClientRect() : placeHolderRef.current.getBoundingClientRect()
    const offsetPosition = isFixedTop ? top - offsetTop : bottom
    console.log(isFixedTop)
    console.log(offsetBottom)
    console.log(bottom)
    console.log(offsetPosition)
    console.log(fixedElementRef.current.getBoundingClientRect())

    if (offsetPosition < 0) {
      statusRef.current = FloatStatus.SHOW_PLACE_HOLDER
      placeHolderRef.current.style.setProperty('display', 'block')
      fixedElementRef.current.style.setProperty('position', 'fixed')
      fixedElementRef.current.style.setProperty(isFixedTop ? 'top' : 'bottom', `${offsetTop}px`)
    } else {
      statusRef.current = FloatStatus.SHOW_TARGET
      placeHolderRef.current.style.setProperty('display', 'none')
      fixedElementRef.current.style.removeProperty('position')
    }
  }

  function addPlacerHolderBlock (fixedElementRect: DOMRect) {
    const { width, height } = fixedElementRect
    placeHolderRef.current = document.createElement('div')

    Object.assign(placeHolderRef.current.style, {
      width: `${width}px`,
      height: `${height}px`,
      display: 'none',
    });

    fixedElementRef.current.parentNode.insertBefore(placeHolderRef.current, fixedElementRef.current)
  }

  useEffect(() => {
    fixedElementRef.current = getTargetElement(fixedElement)

    if (!fixedElementRef.current) {
      return
    }

    addPlacerHolderBlock(fixedElementRef.current.getBoundingClientRect())
    const _throttleListenerScroll = throttle(listenerScroll, 50)
    window.addEventListener('scroll', _throttleListenerScroll)

    return () => {
      _throttleListenerScroll.cancel()
    }
  }, [])
}