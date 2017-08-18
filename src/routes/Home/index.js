// import HomeContainer from './containers/HomeContainer'
import { injectReducer } from '../../store/reducers'

// // Sync route definition
// export default {
//   component: HomeContainer
// }
//


// returns child route object
export default (store) => ({
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const HomeContainer = require('./containers/HomeContainer').default
      const reducer = require('./modules/api').default

      /*  Add the reducer to the store on key 'api'  */
      injectReducer(store, { key: 'api', reducer })

      /*  Return getComponent   */
      cb(null, HomeContainer)

    /* Webpack named bundle   */
    }, 'api')
  }
})
