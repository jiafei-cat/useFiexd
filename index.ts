import React from "react"

const { useRef, useState, useEffect, useCallback } = React

function throttle(fn, delay) {
  let timer = null
  let _this = this
  return function (...args) {
    if (timer) {
      return
    }

    timer = setTimeout(() => {
      fn.apply(_this, args)
      timer = null
    }, delay)
  }
}

export default function useFixed(target, options) {
  const timer = useRef(null)
  const placeHolderRef = useRef(null)
  const [targetRect, setTargetRect] = useState({})
  const [placeHolderStyle, setPlaceHolderStyle] = useState({})

  function listenerScroll(e) {
    const { bottom, top } = placeHolderRef.current.getBoundingClientRect()
    console.log(top)
    if (top < 0) {
      console.log(target.current)
      placeHolderRef.current.style.display = 'block'
      target.current.style.setProperty('position', 'fixed')
    } else {
      placeHolderRef.current.style.display = 'none'
      target.current.style.removeProperty('position')
    }
  }

  function addPlacerHolderBlock (_targetRect) {
    const { width, height } = _targetRect
    console.log({
      width: `${width}px`,
      height: `${height}px`
    })
    placeHolderRef.current = document.createElement('div')

    Object.assign(placeHolderRef.current.style, {
      width: `${width}px`,
      height: `${height}px`,
      display: 'none'
    })
    console.log(target.current)
    console.log(target.current.parentNode)
    target.current.parentNode.insertBefore(placeHolderRef.current, target.current)
  }

  useEffect(() => {
    setTargetRect(target.current.getBoundingClientRect())
    addPlacerHolderBlock(target.current.getBoundingClientRect())
    const _throttleListenerScroll = throttle(listenerScroll, 500)
    window.addEventListener("scroll", _throttleListenerScroll)
  }, [])
}