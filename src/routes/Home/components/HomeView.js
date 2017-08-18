import _ from 'lodash'
import React from 'react'
import DuckImage from '../assets/Duck.jpg'
import { Component } from 'react'
import { Link } from 'react-router'
import './HomeView.scss'

// or send default account ether

class HomeView extends Component {
  createEventList(eventMatrix) {
    // eventMatrix [0,0,1,0,0,1]. indexes are ids (owns id 2 and 5)
    return _.compact(eventMatrix.map((hasTicket, eventId) => {
      if (!hasTicket) return;
      return (
        <div key={eventId} className="">
          EventID: <Link to={`/event/${eventId}`}>#{eventId}</Link>
        </div>
      )
    }));
  }

  render() {
    const { coinbase, eventMatrix } = this.props;
    return (
      <div>
        <h4>Coinbase: {coinbase}</h4>
        <button onClick={() => {
          this.props.getEvents();
        }}>GET EVENTS</button>
        <button onClick={() => {
          this.props.createEvent();
        }}>Create Event</button>
        {/* <h4>Ether: {balance}</h4> */}
        <img
          alt='This is a duck, because Redux!'
          className='duck'
          src={DuckImage} />

        { eventMatrix && this.createEventList(eventMatrix) }
      </div>
    )
  }
}

export default HomeView
