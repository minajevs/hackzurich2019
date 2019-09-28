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

const keyCodes = {
    'ctrl': 17,
    'shift': 16,
    'op_sq_brct': 219,
    'i': 73,
    'x': 88
}

const _combos = {
    'FOLD': ['ctrl', 'shift', 'op_sq_brct'],
    'SELECT_LINE': ['ctrl', 'i'],
    'CUT_LINE': ['ctrl', 'x'],
}

type Keys = keyof typeof keyCodes

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

    sendKeys = (combos: string) => {
        const combosArray = combos.split(',')
        combosArray.map((x) => {
            const keys = _combos[x as keyof typeof _combos]

            keys.map(y => this.sendKey(y as Keys, true))
            keys.reverse().map(y => this.sendKey(y as Keys, false))
        })
    }

    private sendKey = (key: Keys, down: boolean) => {
        this.ws.send(JSON.stringify({
            verb: 'send_input',
            path: 'key',
            args: { vkey: keyCodes[key], pressed: down }
        }));

    }

    loadDevices = () => {
        this.ws.send(JSON.stringify({
            verb: 'get',
            path: 'devices'
        }))
    }
}

export default GestureDetector