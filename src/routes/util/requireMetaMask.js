import React, { Component } from 'react'

export default (ComponentToRender) => {
  return class extends Component {
    constructor() {
      super();
      this.state = {}
    }

    render() {
      const { coinbase, web3, terrapin } = this.props;
      if (!coinbase || !web3 || !terrapin) {
        return (
          <div className="">No coinbase found (Log into MetaMask)</div>
        )
      }

      return (<ComponentToRender {...this.props} />)
    }
  }
}
