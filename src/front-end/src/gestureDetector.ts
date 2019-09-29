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

export type ConnectionChangedEvent = {
    unitId: number
    isConnected: boolean
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
    'l': 76,
    'x': 88
}

const _combos = {
    'FOLD': ['ctrl', 'shift', 'op_sq_brct'],
    'SELECT_LINE': ['ctrl', 'l'],
    'CUT_LINE': ['ctrl', 'x'],
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
                case 'deviceConnectionChanged': {
                    console.log('deviceConnectionChanged')
                    const value: ConnectionChangedEvent = message.value
                    this.events.emit('connectionChanged')
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

    sendKeys = async (combos: string) => {
        const combosArray = combos.split(',')
        for (const combo of combosArray) {
            const keys = _combos[combo as keyof typeof _combos]
            for (const key of keys) {
                await this.sendKey(key as Keys, true)
            }
            for (const key of keys.slice().reverse()) {
                await this.sendKey(key as Keys, false)
            }
        }
    }

    private sendKey = (key: Keys, down: boolean) => {
        console.log('send ' + key, down)
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