import React from 'react'
import { useState } from 'react'
import axios from 'axios'

const URL = "http://localhost:9000/api/result"

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at


export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const coordArray = [
      "(1, 1)", "(2, 1)", "(3, 1)",
      "(1, 2)", "(2, 2)", "(3, 2)",
      "(1, 3)", "(2, 3)", "(3, 3)",
    ]
    const xy = coordArray[index]
    return xy
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
   
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const directionIndex = {"left": -1, "right": 1, "up": -3, "down": 3}
    const newIndex = index + directionIndex[direction]
    if((index===2 || index===5) && direction==="right"){
      return(setMessage(`You can't go ${direction}`))
    }
    else if((index===3 || index===6) && direction==="left"){
      return(setMessage(`You can't go ${direction}`))
    }
    else if(newIndex >= 0 && newIndex <= 8){
      
      return( setIndex(newIndex), setSteps(steps+1))
    }
    return(setMessage(`You can't go ${direction}`))
  }

  

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    evt.preventDefault()
    getNextIndex(evt.target.id);
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    const {value} = evt.target
    setEmail(value);
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const xCoord = getXY()[1]
    const yCoord = getXY()[4]
    console.log(xCoord)
    console.log(yCoord)
    axios.post(URL,{"x": xCoord, "y": yCoord, "steps": steps, "email": email})
    .then(res => {
      console.log(res)
      setMessage(res.data.message), setEmail(initialEmail)

      
    })
    .catch(err => {
      console.error(err)
      setMessage(err.response.data.message)
    })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates {getXY()}</h3>
        <h3 id="steps">You moved {steps} time{steps===1? null : 's'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={move}id="left">LEFT</button>
        <button onClick={move}id="up">UP</button>
        <button onClick={move}id="right">RIGHT</button>
        <button onClick={move}id="down">DOWN</button>
        <button onClick={reset}id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" onChange={onChange} value={email} type="email" placeholder="type email"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
