pragma solidity ^0.4.10;
// Terrapin.sol is the main entry file

contract EventManager {
  mapping (uint => address) events;

  address public owner;
  uint public numEvents = 0;

  function EventManager() {
    owner = msg.sender;
  }

  function getNumEvents() constant returns (uint) {
    return numEvents;
  }

  function createEvent() {
    // EVM Event: Event Created
    events[numEvents++] = new Event(msg.sender);
  }

  function getEventAddress(uint _id) constant returns (address _event) {
    return events[_id];
  }

  function getEvents(address _holder) constant returns (uint[] _ids) {
    // change to something that won't run out of gas
    uint[] memory ids = new uint[](numEvents);

    for (uint id = 0; id < numEvents; id++) {
      if (Event(events[id]).owner() == _holder) {
        // set ticket index to "true"
        ids[id] = 1;
      }
    }
    return ids;
  }

  function getEventHolder(uint _id) constant returns (address _holder){
    Event e = Event(events[_id]);
    return e.getOwner();
  }
}

contract Event {
  event TicketsPrinted(uint[] _seat, uint[] _cost);

  struct Ticket {
    address owner;
    uint seat;
    uint cost;
    bool redeemed;
  }

  address public owner;
  uint public numTickets = 0;
  /*uint expireDate;*/

  // ticketId -> ticket
  mapping(uint => Ticket) tickets;

  function Event(address _owner) {
    owner = _owner;
  }

  function printTickets(uint[] _seat, uint[] _cost) {
    if (msg.sender != owner) throw;
    uint sl = _seat.length;
    uint cl = _cost.length;

    // skip if lengths are not equal
    if (sl != cl) throw;
    for (uint i = 0; i < sl; i++) {
      Ticket memory t = Ticket(owner, _seat[i], _cost[i], false);
      tickets[numTickets++] = t;
    }
    TicketsPrinted(_seat, _cost);
  }

  function buyTicket(uint _id) payable returns (uint _ticketId) {
    Ticket t = tickets[_id];
    // can only buy from original owner
    if (t.owner != owner) throw;
    if (msg.value < t.cost) throw;

    tickets[_id].owner = msg.sender;
    bool success = owner.send(msg.value);
    if (!success) throw;
  }

  function redeemTicket(uint _id) {
    // this will have to include affiliate accounts as well to
    if (msg.sender != owner) throw;
    tickets[_id].redeemed = true;
  }

  function getTicketById(uint _id) constant returns (address _owner, uint _seat, uint _price) {
    Ticket t = tickets[_id];
    return (t.owner, t.seat, t.cost);
  }

  function validateOwner(address addr, uint _id) constant returns (bool) {
    return tickets[_id].owner == addr;
  }

  function ownedTickets(address addr) constant returns (uint[] _ids) {
    // change to something that won't run out of gas
    uint[] memory ids = new uint[](numTickets);

    for (uint id = 0; id < numTickets; id++) {
      if (tickets[id].owner == addr) {
        // set ticket index to "true"
        ids[id] = 1;
      }
    }
    return ids;
  }

  function getOwner() returns (address) {
    return owner;
  }

  function health() returns (bool) {
    return true;
  }
}
