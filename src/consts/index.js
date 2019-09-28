const KEY_CODES = {
  CONTROL: { code: 29, value: 'control' },
  SHIFT: { code: 42, value: 'shift' },
  OPEN_SQ_BRACKET: { code: 26, value: '[' },
  I: { code: 23, value: 'i' },
  X: { code: 45, value: 'x' },
};

const SHORTCUTS = {
  FOLD: [KEY_CODES.CONTROL, KEY_CODES.SHIFT, KEY_CODES.OPEN_SQ_BRACKET],
  SELECT_LINE: [KEY_CODES.CONTROL, KEY_CODES.I],
  CUT_LINE: [KEY_CODES.CONTROL, KEY_CODES.X],
};

module.exports = { KEY_CODES, SHORTCUTS };
