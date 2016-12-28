
export const DIRECTION_LEFT = 37
export const DIRECTION_UP = 38
export const DIRECTION_RIGHT = 39
export const DIRECTION_DOWN = 40

export const DIRECTION_NAMES = {
    37: "LEFT",
    38: "UP",
    39: "RIGHT",
    40: "DOWN"
}

export const DIRECTION_OPPS = {
    37: DIRECTION_RIGHT,
    38: DIRECTION_DOWN,
    39: DIRECTION_LEFT,
    40: DIRECTION_UP
}

export const SPEED_FAST = 100
export const SPEED_MEDIUM = 300
export const SPEED_SLOW = 500

export const SIZE_CELL = 10
export const NUM_ROWS = 30
export const NUM_COLS = 80

export const STYLE_PANEL = {width: (SIZE_CELL * NUM_COLS), height: (SIZE_CELL * NUM_ROWS), display: 'table'}
export const STYLE_ROW = {display: 'table-row'}
export const STYLE_CELL = {width: SIZE_CELL, height: SIZE_CELL, backgroundColor: 'white', display: 'table-cell'}
export const STYLE_SNAKE = {width: SIZE_CELL, height: SIZE_CELL, backgroundColor: '#66ff99', display: 'table-cell'}
export const STYLE_APPLE = {width: SIZE_CELL, height: SIZE_CELL, backgroundColor: 'red', display: 'table-cell'}

