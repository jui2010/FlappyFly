import React, { Component } from 'react'
import { StyleSheet, Text, View, Dimensions, TouchableHighlightBase } from 'react-native'
import Matter from 'matter-js'
import { GameEngine } from 'react-native-game-engine'
import Butterfly from  './Butterfly'
import Wall from  './Wall'
import Physics from  './Physics'

export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (min - max + 1) + min )
}

export const generatePipes = () => {
  const MAX_HEIGHT= Dimensions.get("screen").height
  const GAP_SIZE = 300

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
  }

  setupGameWorld(){
    const MAX_WIDTH = Dimensions.get("screen").width
    const MAX_HEIGHT= Dimensions.get("screen").height
    let engine = Matter.Engine.create({enableSleeping : false})
    let world = engine.world

    let butterfly = Matter.Bodies.rectangle(MAX_WIDTH/4, MAX_HEIGHT/2, 50, 50)
    let floor = Matter.Bodies.rectangle(MAX_WIDTH/2 , MAX_HEIGHT -25, MAX_WIDTH , 50, {isStatic : true})
    let ceiling = Matter.Bodies.rectangle(MAX_WIDTH/2 , 25, MAX_HEIGHT , 50, {isStatic : true})

    Matter.World.add(world, [butterfly, floor])

    return {
      physics : {engine : engine, butterfly : butterfly},
      butterfly : {body : butterfly, size : [50, 50], color : 'red', renderer : Butterfly},
      floor : {body : floor, size : [MAX_WIDTH, 50], color : 'green', renderer : Wall},
      ceiling : {body : ceiling, size : [MAX_WIDTH, 50], color : 'blue', renderer : Wall}
    }
  }

  render(){
    return (
      <View style={styles.container}>
        <GameEngine ref={(ref) => { this.gameEngine = ref }} 
        style={styles.gameContainer}
        entities={this.entities}
        systems={[Physics]} />
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
})
