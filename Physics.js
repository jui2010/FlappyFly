import Matter from 'matter-js'
import { Dimensions } from 'react-native'

const Physics = (entities, {touches, time}) => {

    let engine = entities.physics.engine
    let butterfly = entities.butterfly.body
    const PIPE_WIDTH = 100
    const MAX_WIDTH = Dimensions.get("screen").width
    const MAX_HEIGHT= Dimensions.get("screen").height

    touches.filter(t => t.type === "press").forEach(t => {
        Matter.Body.applyForce(butterfly, butterfly.position , {x : 0.0 , y : -0.1})
    })

    for(let i = 1; i<=4 ; i++){
        if(entities["pipe" + i].body.position.x <= -1 * PIPE_WIDTH/2){
            Matter.Body.setPosition(entities["pipe" + i].body , {x : MAX_WIDTH * 2 - PIPE_WIDTH/2, y : entities["pipe" + i].body.position.y })
        }else{
            Matter.Body.translate(entities["pipe" + i].body, {x : -1, y : 0})
        }
    }

    Matter.Engine.update(engine, time.delta)
    return entities
}

export default Physics