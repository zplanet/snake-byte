import React from 'react'
import Rx from 'rxjs'
import * as CONST from './constants'

class App extends React.Component {
    constructor(props) {
        super(props)

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

        return {
            direction: CONST.DIRECTION_RIGHT,
            isPlaying: false,
            snake,
            scene
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

        snake = snake.slice(1)
        scene[newHead.y][newHead.x] = 1

        this.setState({scene, snake})
    }
    startGameHandler() {
        Rx.Observable.fromEvent(document, 'keyup')
            .takeWhile(x => this.state.isPlaying)
            .filter(e => 36 < e.keyCode && e.keyCode < 41) // arrow keys only
            .subscribe(e => this.setState({direction: e.key}))
        
        Rx.Observable.timer(1000, CONST.GAME_SPEED)
            .takeWhile(x => this.state.isPlaying)
            .subscribe(this.update)

        this.setState({isPlaying: true})
    }
    stopGameHandler() {
        this.setState({isPlaying: false})
    }
    render() {
        return  <div>
                    <div>
                    {
                        this.state.isPlaying
                        ? <button onClick={this.stopGameHandler}>Pause Game</button>
                        : <button onClick={this.startGameHandler}>Start Game</button>
                    }
                    {this.state.direction}
                    </div>
                    <div style={CONST.STYLE_PANEL}>
                    {
                        this.state.scene.map(function(row, index) {
                            return  <div key={index} style={CONST.STYLE_ROW}>
                                    {
                                        row.map(function(col, index2) {
                                            return  <div key={index2} style={1 === col ? CONST.STYLE_SNAKE : CONST.STYLE_CELL}>
                                                    {col}
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