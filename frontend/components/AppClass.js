import React from 'react'
import axios from 'axios'

const URL = "http://localhost:9000/api/result"

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
let newStepValue = 0

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  state = {
    message: initialMessage,
    email: initialEmail,
    steps: initialSteps,
    index: initialIndex,
  }

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const coordArray = [
      "(1, 1)", "(2, 1)", "(3, 1)",
      "(1, 2)", "(2, 2)", "(3, 2)",
      "(1, 3)", "(2, 3)", "(3, 3)",
    ]
    const xy = coordArray[this.state.index]
    return xy
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({...this.state, ...initialState});
    newStepValue = 0
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const {index} = this.state
    const directionIndex = {"left": -1, "right": 1, "up": -3, "down": 3}
    const newIndex = index + directionIndex[direction]
    if((index===2 || index===5) && direction==="right"){
      return(this.setState({...this.state, message: `You can't go ${direction}`}))
    }
    else if((index===3 || index===6) && direction==="left"){
      return(this.setState({...this.state, message: `You can't go ${direction}`}))
    }
    else if(newIndex >= 0 && newIndex <= 8){
      newStepValue++
      return(this.setState({...this.state, index: newIndex, steps: newStepValue}))
    }
    return(this.setState({...this.state, message: `You can't go ${direction}`}))
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    evt.preventDefault()
    this.getNextIndex(evt.target.id)

  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    const {value} = evt.target
    this.setState({...this.state, email: value})
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const {steps, email} = this.state
    const xCoord = this.getXY()[1]
    const yCoord = this.getXY()[4]
    console.log(xCoord)
    console.log(yCoord)
    axios.post(URL,{"x": xCoord, "y": yCoord, "steps": steps, "email": email})
    .then(res => {
      console.log(res)
      this.setState({...this.state, message: res.data.message, email: initialEmail})

      
    })
    .catch(err => {
      console.error(err)
      this.setState({...this.state, message: err.response.data.message})
    })
  }

  render() {
    const { className } = this.props
    const {message, email, steps, index} = this.state
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXY()}</h3>
          <h3 id="steps">{`You moved ${steps} times`}</h3>
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
          <button onClick={this.move}id="left">LEFT</button>
          <button onClick={this.move}id="up">UP</button>
          <button onClick={this.move}id="right">RIGHT</button>
          <button onClick={this.move}id="down">DOWN</button>
          <button onClick={this.reset}id="reset">reset</button>
        </div>
        <form onSubmit={this.onSubmit} >
          <input id="email" onChange={this.onChange} value={email} type="email" placeholder="type email"></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
