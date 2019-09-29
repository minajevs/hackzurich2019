import * as React from 'react'
import GestureDetector, { Device } from './gestureDetector'
import createStoreContext from 'react-concise-state'

type Gesture = {
    description: string,
    direction: string,
    bindTo: string
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
    gestures: [] as Gesture[],
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
        meta.detector.events.addListener('open', () => {
            this.loadDevices()
        })
        meta.detector.events.addListener('tap', (props: { touch: boolean, mouseId: number }) => {
            this.setTouch(props.touch)
        })
        meta.detector.events.addListener('pointer', (props: { x: number, y: number }) => {
            pos = { x: props.x, y: props.y, time: Date.now() }
        });
        meta.detector.events.addListener('connectionChanged', (props: { unitId: number, isConnected: boolean }) => {
            console.log('LOAD ONCE AGAIN')
            this.loadDevices()
        });

        (window as any).ipcRenderer.on('gestures-list', (event: any, gestures: any) => {
            console.log(gestures)
            setState(prev => ({ ...prev, gestures }))
        })

    },
    setTouch: (touch: boolean) => {
        setState(prev => {
            if (touch && !prev.tap) {
                return { ...prev, tap: touch, begin: pos, end: null }
            }
            if (!touch && prev.tap) {
                const direction = getDirection(prev.begin!, pos)
                const gesture = prev.gestures.find(x => x.direction === direction)
                if (gesture) {
                    const keys = gesture.bindTo
                    if (keys) meta.detector.sendKeys(keys)
                }
                return { ...prev, tap: touch, end: pos, swipe: getDirection(prev.begin!, pos) || '' }
            }
            return { ...prev, tap: touch }
        })
    },
    loadDevices: async () => {
        meta.detector.loadDevices()
    },
    bindGesture: (direction: string, keys: string) => {
        (window as any).ipcRenderer.send('gesture-bind', { direction, keys })
        setState(prev => {
            const newGestures = prev.gestures.map(x => {
                if (x.direction === direction) return { ...x, bindTo: keys }
                return { ...x }
            })
            return { ...prev, gestures: [...newGestures] }
        })
    },
    unbindGesture: (direction: string) => {
        (window as any).ipcRenderer.send('gesture-unbind', direction)
        setState(prev => {
            const newGestures = prev.gestures.map(x => {
                if (x.direction === direction) return { ...x, bindTo: '' }
                return { ...x }
            })
            return { ...prev, gestures: [...newGestures] }
        })
    }
}), {
    meta: { detector: new GestureDetector() }
})

export { context, Provider }
