
export class Monitor {
    ws: WebSocket = new WebSocket('ws://localhost:9876')
    connected: boolean = false
    devices: [] = []
    spyConfigs: {} = {}
    backlightConfigs: {} = {}
    wheelConfigs: {} = {}
    thumbWheelConfigs: {} = {}
    specialKeys: {} = {}
    specialKeyConfigs: {} = {}
    events: [] = []

    constructor() {
        this.reset();
    }

    close() {
        this.ws && this.ws.close();
    }

    reset() {
        this.connected = false;
        this.devices = [];
        this.spyConfigs = {};
        this.backlightConfigs = {};
        this.wheelConfigs = {};
        this.thumbWheelConfigs = {};
        this.specialKeys = {};
        this.specialKeyConfigs = {};
        this.events = [];
    }

    connect() {
        this.disconnect();
        this.ws = new WebSocket('ws://localhost:9876');
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onclose = this.onClose.bind(this);
        this.ws.onerror = this.onError.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
    }

    disconnect() {
        this.ws && this.ws.close();
    }

    onOpen() {
        console.log('Connected to server');
        this.connected = true;
        this.getDevices();
    }

    onClose() {
        console.log('Disconnected from server');
        this.reset();
    }

    onError(error: any) {
        console.error(error);
    }

    onMessage(messageJson: any) {
        const message = JSON.parse(messageJson.data);
        if (message.success) {
            switch (message.verb) {
                case 'event':
                    console.log('EVENT')
                    break;
                case 'get':
                    this.onResponse(message.path, message.value);
                    break;
                default:
                    break;
            }
        } else {
            console.error(message.value);
        }
    }
    onResponse(path: string, value: any) {
        switch (path) {
            case 'devices':
                console.log('devices', value)
                break;
            case 'device':
                console.log('device', value)
                break;
            case 'spyConfig':
                console.log('spyConfig', value)
                break;
            case 'backlightConfig':
                console.log('backlightConfig', value)
                break;
            case 'wheelConfig':
                console.log('wheelConfig', value)
                break;
            case 'thumbWheelConfig':
                console.log('thumbWheelConfig', value)
                break;
            case 'specialKeys':
                console.log('specialKeys', value)
                break;
            case 'specialKeyConfig':
                console.log('specialKeyConfig', value)
                break;
            default:
                break;
        }
    }

    getDevices() {
        this.ws.send(JSON.stringify({
            verb: 'get',
            path: 'devices'
        }));
    }

    getDevice(unitId: any) {
        this.ws.send(JSON.stringify({
            verb: 'get',
            path: 'device',
            args: { unitId }
        }));
    }

    getSpyConfig(unitId: any) {
        this.ws.send(JSON.stringify({
            verb: 'get',
            path: 'spyConfig',
            args: { unitId }
        }));
    }

    setSpyConfig(config: any) {
        this.ws.send(JSON.stringify({
            verb: 'set',
            path: 'spyConfig',
            args: { value: config }
        }));
    }

    getBacklightConfig(unitId: any) {
        this.ws.send(JSON.stringify({
            verb: 'get',
            path: 'backlightConfig',
            args: { unitId }
        }));
    }

    setBacklightConfig(config: any) {
        this.ws.send(JSON.stringify({
            verb: 'set',
            path: 'backlightConfig',
            args: { value: config }
        }));
    }

    getWheelConfig(unitId: any) {
        this.ws.send(JSON.stringify({
            verb: 'get',
            path: 'wheelConfig',
            args: { unitId }
        }));
    }

    setWheelConfig(config: any) {
        this.ws.send(JSON.stringify({
            verb: 'set',
            path: 'wheelConfig',
            args: { value: config }
        }));
    }

    getThumbWheelConfig(unitId: any) {
        this.ws.send(JSON.stringify({
            verb: 'get',
            path: 'thumbWheelConfig',
            args: { unitId }
        }));
    }

    setThumbWheelConfig(config: any) {
        this.ws.send(JSON.stringify({
            verb: 'set',
            path: 'thumbWheelConfig',
            args: { value: config }
        }));
    }

    getSpecialKeys(unitId: any) {
        this.ws.send(JSON.stringify({
            verb: 'get',
            path: 'specialKeys',
            args: { unitId }
        }));
    }

    getSpecialKeyConfig(unitId: any, controlId: any) {
        this.ws.send(JSON.stringify({
            verb: 'get',
            path: 'specialKeyConfig',
            args: { unitId, controlId }
        }));
    }

    setSpecialKeyConfig(config: any) {
        this.ws.send(JSON.stringify({
            verb: 'set',
            path: 'specialKeyConfig',
            args: { value: config }
        }));
    }
};