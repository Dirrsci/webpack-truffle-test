// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout'
import Home from './Home'
import EventRoute from './Event'


// Folder structure:
//   /assets - any images needed for the route
//   /containers - place to wrap components (connect, higher order, etc)
//   /componets - all jsx componets and scss
//   /modules - actions/reducers needed for route
//
// require train:
// container -> View/Action-Reducer/

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: Home(store), //eslint-disable-line
  childRoutes: [
    EventRoute(store) //eslint-disable-line
  ]
})

 // <Route component={ Layout }>
 //   <Route path='/pricing' component={ requireAuth(requireFree(Pricing)) } onEnter={analytics.logPageView} />
 //   <Route path='survey' component={ requireAuth(Survey) } onEnter={analytics.logPageView} />
 //   <Route path='metrics/:id' component={ requireMetrics(requireAuth(Metrics)) } onEnter={analytics.logPageView} />
 //   <Route path='smartform-edit(/:id)' component={ requireSurvey(requireAuth(SmartformEdit)) } onEnter={analytics.logPageView} />
 // </Route>

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes
