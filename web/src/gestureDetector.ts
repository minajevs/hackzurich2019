import { EventEmitter } from 'events'

type GestureType = "swipe-left" | "swipe-right" | "swipe-up" | "swipe-down"

type Message = {
    path: string,
    success: boolean,
    verb: string,
    value: any
}

export type Device = {
    hasBacklight: boolean
    hasSpecialKeys: boolean
    hasThumbWheel: boolean
    hasWheel: boolean
    isConnected: boolean
    name: string
    type: string
    unitId: number
}

export type ThumbWheelEvent = {
    unitId: number
    proxy: boolean
    singleTap: boolean
    touch: boolean
    rotation: number
    rotationStatus: number
}

export type PointerEvent = {
    unitId: number,
    x: number,
    y: number
}

class GestureDetector {
    ws: WebSocket
    events: EventEmitter
    open: boolean = false

    constructor() {
        this.events = new EventEmitter()
        this.ws = new WebSocket('ws://localhost:9876')
        this.ws.onopen = () => {
            this.open = true
            this.events.emit('open')
        }
        this.ws.onerror = () => this.events.emit('error')
        this.ws.onmessage = (messageJson) => {
            const message: Message = JSON.parse(messageJson.data)
            switch (message.path) {
                case 'devices': {
                    this.events.emit('devices', message.value as Device[])
                    break
                }
                case 'thumbWheel': {
                    const value: ThumbWheelEvent = message.value
                    this.events.emit('tap', { touch: value.touch, mouseId: value.unitId })
                    break
                }
                case 'pointer': {
                    const value: PointerEvent = message.value
                    this.events.emit('pointer', { ...value })
                    break
                }
            }

        }
    }

    startTrackingTap = (mouseId: number) => {
        this.ws.send(JSON.stringify({
            "verb": "set",
            "path": "thumbWheelConfig",
            "args":
            {
                "value":
                {
                    "unitId": mouseId,
                    "divert": true,
                    "invert": false
                }
            }
        }))
    }

    startTrackingPointer = (mouseId: number) => {
        this.ws.send(JSON.stringify({
            "verb": "set",
            "path": "spyConfig",
            "args":
            {
                "value":
                {
                    "unitId": mouseId,
                    "spyButtons": false,
                    "spyKeys": false,
                    "spyPointer": true,
                    "spyThumbWheel": false,
                    "spyWheel": false,
                }
            }
        }))
    }

    blockPointer = (mouseId: number, block: boolean) => {
        this.ws.send(JSON.stringify({
            "verb": "set",
            "path": "specialKeyConfig",
            "args":
            {
                "value":
                {
                    "unitId": mouseId,
                    "controlId": 215,
                    "divert": true,
                    "rawXY": true,
                    "forceRawXY": block
                }
            }
        }))
    }

    loadDevices = () => {
        this.ws.send(JSON.stringify({
            verb: 'get',
            path: 'devices'
        }))
    }
}

const getTouch = () => {

}

export default GestureDetector