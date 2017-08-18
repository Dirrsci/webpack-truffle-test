import React from 'react'
import ReactDOM from 'react-dom'
import createStore from './store/createStore'
import AppContainer from './containers/AppContainer'
import { injectReducer } from './store/reducers'

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.__INITIAL_STATE__
// events
const store = createStore(initialState)

// add a reducer to handle initial initiation of web3 and metamask
injectReducer(store, { key: 'init', reducer: (state = {}, action) => {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        coinbase: action.coinbase,
        web3: action.web3,
        terrapin: action.terrapin,
        eventAbi: action.eventAbi
      }
    default:
      return state;
  }
} })


// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

function bootstrap() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider); // eslint-disable-line

    let account = window.web3.eth.accounts[0];
    let accountInterval = setInterval(function() {
      // will be infinite if MetaMask didn't load: undefined !== undefined
      if (window.web3.eth.accounts[0] !== account) {
        clearInterval(accountInterval);
        account = window.web3.eth.accounts[0];

        const contracts = process.env.CONTRACTS;

        const TerrapinAPI = contracts['terrapin:EventManager'].abi;
        const TerrapinContract = window.web3.eth.contract(TerrapinAPI);
        const terrapin = TerrapinContract.at(contracts['terrapin:EventManager'].address);

        store.dispatch({ type: 'INIT',
          web3: window.web3,
          terrapin,
          eventAbi: contracts['terrapin:Event'].abi,
          coinbase: account
        });

      }
    }, 100);

  } else {
    console.log('No web3? You should consider trying MetaMask!')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); // eslint-disable-line
  }

  // connects the store to our routes
  const routes = require('./routes/index').default(store)

  ReactDOM.render(
    <AppContainer store={store} routes={routes} />,
    MOUNT_NODE
  )
}


let render = () => {
  // add listener to load to wait until metamask has loaded web3
  window.addEventListener('load', bootstrap)
}

// This code is excluded from production bundle
if (__DEV__) { // eslint-disable-line
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        console.error(error)
        renderError(error)
      }
    }

    // Setup hot module replacement
    module.hot.accept('./routes/index', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

// ========================================================
// Go!
// ========================================================
render()
