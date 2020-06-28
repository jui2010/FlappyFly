import React, { Component } from 'react'
import { StyleSheet, Text, View, Dimensions, TouchableHighlightBase, TouchableOpacity } from 'react-native'
import Matter from 'matter-js'
import { GameEngine } from 'react-native-game-engine'
import Butterfly from  './Butterfly'
import Wall from  './Wall'
import Floor from  './Floor'
import Physics from  './Physics'

export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min )
}

export const generatePipes = () => {
  const MAX_HEIGHT= Dimensions.get("screen").height
  const GAP_SIZE = 300
  const PIPE_WIDTH = 100

  let topPipeHeight = randomBetween(100, MAX_HEIGHT/2 - 100)
  let bottomPipeHeight = MAX_HEIGHT - topPipeHeight - GAP_SIZE

  let sizes = [topPipeHeight, bottomPipeHeight]

  if(Math.random() < 0.5){
    sizes = sizes.reverse()
  }

  return sizes
}

export default class App extends Component{
  constructor(props){
    super(props)
    this.gameEngine = null
    this.entities = this.setupGameWorld()

    this.state = {
      running : true
    }
  }

  setupGameWorld(){
    const MAX_WIDTH = Dimensions.get("screen").width
    const MAX_HEIGHT= Dimensions.get("screen").height
    const GAP_SIZE = 300
    const PIPE_WIDTH = 100

    let engine = Matter.Engine.create({enableSleeping : false})
    let world = engine.world

    let butterfly = Matter.Bodies.rectangle(MAX_WIDTH/4, MAX_HEIGHT/2, 50, 50)
    let floor = Matter.Bodies.rectangle(MAX_WIDTH/2 , MAX_HEIGHT -25, MAX_WIDTH , 50, {isStatic : true})
    let ceiling = Matter.Bodies.rectangle(MAX_WIDTH/2 , 25, MAX_HEIGHT , 50, {isStatic : true})

    let [pipe1Height, pipe2Height] = generatePipes()
    let pipe1 = Matter.Bodies.rectangle(MAX_WIDTH - PIPE_WIDTH/2 , pipe1Height/2 , PIPE_WIDTH, pipe1Height , {isStatic : true})
    let pipe2 = Matter.Bodies.rectangle(MAX_WIDTH - PIPE_WIDTH/2 , MAX_HEIGHT - pipe2Height/2 , PIPE_WIDTH, pipe2Height , {isStatic : true})

    let [pipe3Height, pipe4Height] = generatePipes()
    let pipe3 = Matter.Bodies.rectangle(MAX_WIDTH * 2 - PIPE_WIDTH/2 , pipe3Height/2 , PIPE_WIDTH, pipe3Height , {isStatic : true})
    let pipe4 = Matter.Bodies.rectangle(MAX_WIDTH * 2 - PIPE_WIDTH/2 , MAX_HEIGHT - pipe4Height/2 , PIPE_WIDTH, pipe4Height , {isStatic : true})

    Matter.World.add(world, [butterfly, floor, pipe1, pipe2, pipe3, pipe4])

    Matter.Events.on(engine, "collisionStart" , (event) => {
      let pairs = event.pairs

      this.gameEngine.dispatch({type : "GAME_OVER"})
    })
    return {
      physics : {engine : engine, butterfly : butterfly},
      butterfly : {body : butterfly, size : [50, 50], color : 'red', renderer : Butterfly},
      floor : {body : floor, size : [MAX_WIDTH, 50], color : 'green', renderer : Wall},
      ceiling : {body : ceiling, size : [MAX_WIDTH, 50], color : 'blue', renderer : Wall},
      pipe1 : {body : pipe1, size : [PIPE_WIDTH, pipe1Height], color : 'black', renderer : Wall},
      pipe2 : {body : pipe2, size : [PIPE_WIDTH, pipe2Height], color : 'black', renderer : Wall},
      pipe3 : {body : pipe3, size : [PIPE_WIDTH, pipe3Height], color : 'black', renderer : Wall},
      pipe4 : {body : pipe4, size : [PIPE_WIDTH, pipe4Height], color : 'black', renderer : Wall},
    }
  }

  // will be triggered on collision of the fly and the pipe
  onEvent = (e) => {
    if(e.type === "GAME_OVER"){
      this.setState({
        running : false
      })
    }
  }

  reset = () => {
    this.gameEngine.swap(this.setupGameWorld())
    this.setState({
      running : true
    })
  }

  render(){
    return (
      <View style={styles.container}>
        <GameEngine ref={(ref) => { this.gameEngine = ref }} 
        style={styles.gameContainer}
        running = {this.state.running}
        onEvent = {this.onEvent}
        entities={this.entities}
        systems={[Physics]} />

        {!this.state.running && <TouchableOpacity onPress={this.reset} style={styles.fullScreenButton} >
          <View style={styles.fullScreen} >
            <Text style={styles.gameOverText} >
              Game Over
            </Text>
          </View>
        </TouchableOpacity> }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  gameContainer : {
    position : "absolute",
    top : 0,
    bottom : 0,
    left : 0,
    right : 0
  },
  fullScreen : {
    position : "absolute",
    top : 0,
    bottom : 0,
    left : 0,
    right : 0,
    backgroundColor : "black",
    opacity : 0.8,
    justifyContent : "center",
    alignItems : "center",
  },
  fullScreenButton : {
    position : "absolute",
    top : 0,
    bottom : 0,
    left : 0,
    right : 0,
    flex : 1,
  },
  gameOverText : {
    color : "white",
    fontSize : 48,
  }
})
