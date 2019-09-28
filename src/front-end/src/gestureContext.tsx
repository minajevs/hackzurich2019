import * as React from 'react'
import GestureDetector, { Device } from './gestureDetector'
import createStoreContext from 'react-concise-state'

type Gesture = {
    desc: string,
    id: number
}

type Pos = {
    x: number
    y: number
    time: number
}

let pos: Pos = { x: 0, y: 0, time: 0 }

const timeThreshold = 1000
const distThreshold = 150
const distRestraint = 150

const getDirection = (begin: Pos, end: Pos) => {
    const dx = end.x - begin.x
    const dy = end.y - begin.y
    const dt = end.time - begin.time
    // dt threshold
    if (dt <= timeThreshold) {
        if (Math.abs(dx) >= distThreshold && Math.abs(dy) <= distRestraint) {
            return (dx < 0) ? 'left' : 'right'
        }
        else if (Math.abs(dy) >= distThreshold && Math.abs(dx) <= distRestraint) {
            return (dy < 0) ? 'up' : 'down'
        }
    }

    console.log(begin, end)
}

const [context, Provider] = createStoreContext({
    gestures: [
        {
            id: 0,
            desc: "Wheel + ⟶"
        },
        {
            id: 1,
            desc: "Wheel + ⟵"
        },
        {
            id: 2,
            desc: "Wheel + ↑"
        },
        {
            id: 3,
            desc: "Wheel + ↓"
        },
    ] as Gesture[],
    loading: false,
    devices: null as Device[] | null,
    tap: false,
    begin: null as Pos | null,
    end: null as Pos | null,
    swipe: ""
}, ({ state, setState, meta }) => ({
    init() {
        meta.detector.events.addListener('devices', (devices: Device[]) => {
            setState(prev => ({ ...prev, devices, loading: false }))
            const mouse = devices.find(x => x.type === 'mouse')
            if (mouse === undefined) return
            meta.detector.startTrackingTap(mouse.unitId)
            meta.detector.startTrackingPointer(mouse.unitId)
        })
        meta.detector.events.addListener('tap', (props: { touch: boolean, mouseId: number }) => {
            this.setTouch(props.touch)
        })
        meta.detector.events.addListener('pointer', (props: { x: number, y: number }) => {
            pos = { x: props.x, y: props.y, time: Date.now() }
        })
    },
    setTouch: (touch: boolean) => {
        setState(prev => {
            if (touch && !prev.tap) {
                return { ...prev, tap: touch, begin: pos, end: null }
            }
            if (!touch && prev.tap) {
                return { ...prev, tap: touch, end: pos, swipe: getDirection(prev.begin!, pos) || '' }
            }
            return { ...prev, tap: touch }
        })
    },
    loadDevices: async () => {
        setState(prev => ({ ...prev, loading: true }))
        meta.detector.loadDevices()
    }
}), {
    meta: { detector: new GestureDetector() }
})

export { context, Provider }
