import React from 'react'
import { Component } from 'react'
import { Link } from 'react-router'
import './EventView.scss'

class EventView extends Component {
  constructor() {
    super()
    this.state = {}
  }

  componentDidMount() {
    const eventId = this.props.params.id;
    if (!this.props.events[eventId]) {
      this.props.getEvent(eventId)
        .then(() => {
          this.props.getAllTickets(this.props.events[eventId]);
        })
    }
  }

  showTickets() {
    return this.props.tickets.map((ticket, i) => {
      return (
        <div key={i} className="">
          <Link to="/">
            <span>Seat: {ticket.seat}</span> <span>Cost: {ticket.cost}</span>
          </Link>

        </div>
      )
    })

  }

  createTickets(numTickets = 20) {
    const { params, events } = this.props

    const seats = [];
    const costs = [];
    for (let i = 0; i < numTickets; i++) {
      // uint[] _seat, uint[] _cost
      seats.push(i)
      costs.push(100 - Math.random())
    }

    this.props.printTickets(events[params.id], seats, costs)
  }

  render() {
    return (
      <div className="">
        <h1>Owner: </h1>
        <button onClick={() => this.createTickets(5)}>Print 5 Tickets</button>
        { this.props.tickets && this.showTickets() }
      </div>
    )
  }
}

export default EventView
