import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import deviceReducer from './features/device/deviceSlice'

export default function configureAppStore(preloadedState) {
  return configureStore({
    reducer: {
      device: deviceReducer
    },
    middleware: [...getDefaultMiddleware()],
    preloadedState,
  })

  // if (process.env.NODE_ENV !== 'production' && module.hot) {
  //   module.hot.accept('./features/config/', () => store.replaceReducer(rootReducer))
  // }
}