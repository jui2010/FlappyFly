import Matter from 'matter-js'

const Physics = (entities, {touches, time}) => {

    let engine = entities.physics.engine
    let butterfly = entities.butterfly.body

    touches.filter(t => t.type === "press").forEach(t => {
        Matter.Body.applyForce(butterfly, butterfly.u, {x : 0.0 , y : -0.1})
    })
    Matter.Engine.update(engine, time.delta)
    return entities
}

export default Physics