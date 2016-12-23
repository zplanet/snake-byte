import React from 'react'
import Rx from 'rxjs'
import * as CONST from './constants'

class App extends React.Component {
    constructor(props) {
        super(props)

        const range = n => Array.from(Array(n).keys())

        let scene = range(CONST.NUM_ROWS).map(x => range(CONST.NUM_COLS).map(y => 0))
        scene[0][0] = 1

        this.state = {
            direaction: CONST.DIRECTION_RIGHT,
            snake: [{x:0, y:0}],
            scene: scene
        }
        
        this.update = this.update.bind(this)
    }
    update(seq) {
        let currentScene = this.state.scene
        
        // clear snake
        this.state.snake.forEach(({x,y}) => currentScene[y][x] = 0)

        switch (this.state.direaction) {
            case CONST.DIRECTION_UP:
                break;
            case CONST.DIRECTION_DOWN:
                break;
            case CONST.DIRECTION_RIGHT:
                break;
            case CONST.DIRECTION_LEFT:
                break;
        }
    }
    componentDidMount() {
        this.state.snake.forEach(({x, y}) => console.log(x, y))
        // Rx.Observable.timer(1000, 1000)
        //     .subscribe(this.update)
    }
    render() {
        return  <div>
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