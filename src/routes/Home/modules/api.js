// ------------------------------------
// Constants
// ------------------------------------
export const GET_EVENTS = 'GET_EVENTS'
export const CREATE_EVENT = 'CREATE_EVENT'


// ------------------------------------
// Actions
// ------------------------------------
export const getEvents = () => {
  return (dispatch, getState) => {
    const { terrapin, coinbase } = getState().init;
    return new Promise((resolve, reject) => {
      terrapin.getEvents.call(coinbase, (err, eventMatrix) => {
        if (err) return reject(err)
        // parse ints from events matrix
        eventMatrix = eventMatrix.map((val) => parseInt(val.toString()))
        console.log('dispach get events', eventMatrix);
        dispatch({
          type: GET_EVENTS,
          eventMatrix
        })
        resolve();
      })
    })

  }
}


export const createEvent = () => {
  return (dispatch, getState) => {
    const { terrapin, coinbase } = getState().init

    return new Promise((resolve, reject) => {
      terrapin.createEvent({ from: coinbase, gas: 4476768 }, (err) => {
        if (err) return reject(err)
        console.log('created event returned');
        terrapin.numEvents.call((err, ans) => {
          console.log(err, ans)
          dispatch({ type: CREATE_EVENT }) // TODO: currently no handler
          resolve();
        })
      })
    })

  }
}

export const actions = {
  createEvent,
  getEvents
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_EVENTS]: (state, action) => {
    return {
      ...state,
      eventMatrix: action.eventMatrix
    }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = 0
export default function counterReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
