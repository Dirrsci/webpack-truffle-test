import async from 'async';

// ------------------------------------
// Constants
// ------------------------------------
export const GET_EVENT = 'GET_EVENT'
export const PRINT_TICKETS = 'PRINT_TICKETS'
export const GET_OWNED_TICKET_IDS = 'GET_OWNED_TICKET_IDS'
export const GET_ALL_TICKETS = 'GET_ALL_TICKETS'

function getEventInstance(eventId, state) {
  const { terrapin, eventAbi, web3 } = state.init
  const { events } = state.event
  // return event if it's already cached
  return events[eventId] || new Promise((resolve, reject) => {
    terrapin.getEventAddress.call(eventId, (err, eventAddress) => {
      if (err) return reject(err)

      const EventContract = web3.eth.contract(eventAbi)
      const event = EventContract.at(eventAddress)
      events[eventId] = event

      resolve(events);
    })
  })
}

// ------------------------------------
// Actions
// ------------------------------------
export const getEvent = (eventId) => {
  return (dispatch, getState) => {
    return getEventInstance(eventId, getState())
      .then((events) => {
        dispatch({
          type: GET_EVENT,
          events
        })
      })
  }
}

export const printTickets = (event, seats, costs) => {
  return (dispatch, getState) => {
    const { coinbase } = getState().init
    return new Promise((res, rej) => {
      event.printTickets(seats, costs, { from: coinbase, gas: 4476768 }, (err) => {
        if (err) return rej(err);
        let lock = 0;
        event.TicketsPrinted({ from: coinbase }, (err, e) => { // eslint-disable-line
          if (lock) return;
          lock = 1;
          console.log(e.address);
          console.log('after printed tickets', e);
          if (err) return rej(err);
          const seats = e.args._seat;
          const costs = e.args._cost;

          let tickets = []
          for (var i = 0; i < seats.length; i++) {
            tickets.push({
              seat: seats[i].toString(),
              cost: costs[i].toString()
            })
          }

          tickets = tickets.concat(getState().event.tickets);
          dispatch({
            type: GET_ALL_TICKETS,
            tickets
          })
          res()
        })
        // res();
      })
    })
  }
}

export const getAllTickets = (event) => {
  return (dispatch) => {
    event.numTickets.call((err, num) => {
      // console.log('called');
      const work = [];
      for (let i = 0; i < parseInt(num); i++) {
        work.push((cb) => {
          event.getTicketById.call(i, (err, ticket) => {
            cb(err, {
              owner: ticket[0],
              seat: ticket[1].toString(),
              cost: ticket[2].toString()
            })
          })
        })
      }
      async.series(work, (err, tickets) => {
        console.log('calle');
        dispatch({
          type: GET_ALL_TICKETS,
          tickets
        })
      });
    })
  }
}

export const ownedTickets = (event) => {
  return (dispatch, getState) => {
    const { coinbase } = getState().init
    event.ownedTickets.call(coinbase, (err, owned) => {
      const ownedIds = owned.map((val) => parseInt(val))
      const tickets = [];
      for (var i = 0; i < owned.length; i++) {
        let ticket = {
          seat: parseInt(owned[i]),
          cost: parseInt(owned[i])
        }
        tickets.push(ticket)
      }
      dispatch({
        type: GET_OWNED_TICKET_IDS,
        ownedIds
      })
    })
  }
}

export const actions = {
  ownedTickets,
  printTickets,
  getEvent
}


// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_EVENT]: (state, action) => {
    return {
      ...state,
      events: action.events
    }
  },
  [GET_OWNED_TICKET_IDS]: (state, action) => {
    return {
      ...state,
      ownedIds: action.ownedIds
    }
  },
  [GET_ALL_TICKETS]: (state, action) => {
    return {
      ...state,
      tickets: action.tickets
    }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  events: {}
}
export default function counterReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
