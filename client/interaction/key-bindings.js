var KEY_CODES = require('./key-codes')

module.exports = {
  'rewind':      [KEY_CODES.REWIND,KEY_CODES.REWIND,KEY_CODES.REWIND],
  'forward':     [KEY_CODES.FAST_FORWARD,KEY_CODES.FAST_FORWARD,KEY_CODES.FAST_FORWARD],
  'play':        [KEY_CODES.PLAY],
  'pause':       [KEY_CODES.PAUSE],
  'back':        [KEY_CODES.BACK],
  'stop':        [KEY_CODES.STOP],
  'home':        [KEY_CODES.HOME],
  'replay':      [KEY_CODES.REWIND,null,null,null,null]
}