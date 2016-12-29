import React from 'react'
import Rx from 'rxjs'
import * as CONST from './constants'

class App extends React.Component {
    constructor(props) {
        super(props)

        this.setApple = this.setApple.bind(this)
        this.getInitState = this.getInitState.bind(this)      
        this.update = this.update.bind(this)
        this.startGameHandler = this.startGameHandler.bind(this)
        this.stopGameHandler = this.stopGameHandler.bind(this)

        this.state = this.getInitState()
    }
    getInitState() {
        const range = n => Array.from(Array(n).keys())
        let scene = range(CONST.NUM_ROWS).map(x => range(CONST.NUM_COLS).map(y => 0))
        let snake = [{x:0, y:0}, {x:1, y:0}, {x:2, y:0}]
        snake.forEach(({x,y}) => scene[y][x] = 1)

        this.setApple(scene)

        return {
            direction: CONST.DIRECTION_RIGHT,
            isPlaying: false,
            extensionCounter: 0,
            score: 0,
            speed: CONST.SPEED_SLOW,
            keyEvent$: null,
            timer$: null,
            snake,
            scene
        }
    }
    setApple(scene) {
        while(true) {
            const pos = {x: Math.round(Math.random() * (CONST.NUM_COLS - 1)), y: Math.round(Math.random() * (CONST.NUM_ROWS - 1))}
            if (0 == scene[pos.y][pos.x]) {
                scene[pos.y][pos.x] = 2
                return
            }
        }
    }
    calcNewHead(currentHead) {
        switch (this.state.direction) {
            case CONST.DIRECTION_UP:
                return {x: currentHead.x, y: currentHead.y-1}
            case CONST.DIRECTION_DOWN:
                return {x: currentHead.x, y: currentHead.y+1}
            case CONST.DIRECTION_RIGHT:
                return {x: currentHead.x+1, y: currentHead.y}
            case CONST.DIRECTION_LEFT:
                return {x: currentHead.x-1, y: currentHead.y}
        }
    }
    checkCollision(head, scene) {
        return (head.x < 0 || head.y < 0 || CONST.NUM_COLS <= head.x || CONST.NUM_ROWS <= head.y || (1 == scene[head.y][head.x]))
    }
    update(seq) {

        const scene = this.state.scene
        let snake = this.state.snake

        const head = snake[snake.length - 1]
        const tail = snake[0]

        const newHead = this.calcNewHead(head)
        
        // clear tail
        scene[tail.y][tail.x] = 0

        if (this.checkCollision(newHead, scene)) {
            this.setState(this.getInitState())
            return
        }

        snake.push(newHead)

        if (2 == scene[newHead.y][newHead.x]) { // got apple
            this.setApple(scene)
            this.setState({
                extensionCounter: this.state.extensionCounter + 2,
                score: this.state.score + 1
            })
        }
        else {
            if (0 < this.state.extensionCounter) {
                this.setState({extensionCounter: this.state.extensionCounter - 1})
            }
            else {
                snake = snake.slice(1)
            }
        }
        
        scene[newHead.y][newHead.x] = 1

        this.setState({scene, snake})
    }
    startGameHandler() {
        const ke$ = Rx.Observable.fromEvent(document, 'keydown')
                        .filter(e => 36 < e.keyCode && e.keyCode < 41) // arrow keys only
                        .filter(e => CONST.DIRECTION_OPPS[this.state.direction] != e.keyCode)
                        .subscribe(e => this.setState({direction: e.keyCode}))
        
        const tm$ = Rx.Observable.timer(1000, this.state.speed)
                        .subscribe(this.update)

        this.setState({isPlaying: true, keyEvent$: ke$, timer$: tm$})
    }
    stopGameHandler() {
        if (null != this.state.keyEvent$) {
            this.state.keyEvent$.unsubscribe()
        }
        
        if (null != this.state.timer$) {
            this.state.timer$.unsubscribe()
        }

        this.setState({isPlaying: false})
    }
    render() {
        const cellStyle = n => 1 === n ? CONST.STYLE_SNAKE : (2 === n ? CONST.STYLE_APPLE : CONST.STYLE_EMPTY)
        return  <div>
                    <div style={CONST.STYLE_TABLE}>
                        <div style={CONST.STYLE_TABLE_ROW}>
                            <div style={CONST.STYLE_TABLE_CELL}>
                            {
                                this.state.isPlaying
                                ? <button onClick={this.stopGameHandler}>Pause Game</button>
                                : <button onClick={this.startGameHandler}>Start Game</button>
                            }
                            </div>
                            <div style={CONST.STYLE_TABLE_CELL_PAD}>
                                Direction: {CONST.DIRECTION_NAMES[this.state.direction]}
                            </div>
                            <div style={CONST.STYLE_TABLE_CELL_PAD}>
                                Score: {this.state.score}
                            </div>
                            <div style={CONST.STYLE_TABLE_CELL_PAD}>
                                Speed:
                            {
                                this.state.isPlaying
                                ? this.state.speed
                                :   
                                    <select onChange={(e) => this.setState({speed: e.target.value})} value={this.state.speed}>
                                        <option value={CONST.SPEED_FAST}>fast</option>
                                        <option value={CONST.SPEED_MEDIUM}>medium</option>
                                        <option value={CONST.SPEED_SLOW}>slow</option>
                                    </select>
                            }
                            </div>
                        </div>
                    </div>
                    <div style={CONST.STYLE_BOARD}>
                    {
                        this.state.scene.map(function(row, index) {
                            return  <div key={index} style={CONST.STYLE_TABLE_ROW}>
                                    {
                                        row.map(function(col, index2) {
                                            return  <div key={index2} style={cellStyle(col)}>
                                                    </div>
                                        })
                                    }
                                    </div>
                        }.bind(this))
                    }
                    </div>
                </div>
    }
}

export default App