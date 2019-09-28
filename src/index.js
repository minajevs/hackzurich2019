const shortcutTracker = require('./services/shortcutTracker')
const db = require('./db')

module.exports = {
    init: () => {
        console.log('aaaaaaaaaaaaa')
        db.connect()
        shortcutTracker.init()
    }
}