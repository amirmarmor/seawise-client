import {createSlice} from "@reduxjs/toolkit"

const initialState = {id: 0}
const api = `localhost:5000`

export const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    updateCurrent: (state, action) => {
      state.current = action.payload
    },
    updateDevices: (state, action) => {
      state.list = action.payload
    },
    updateConfig: (state, action) => {
      state.config = action.payload
    },
    configUpdated: (state, action) => {
      state.updated = action.payload
    },
    updateRealtime: (state, action) => {
      state.realtime = action.payload
    },
    default: state => state
  }
})

export const getDevicesAsync = () => {
  return async (dispatch) => {
    try {
      const result = await fetch(`http://${api}/api/devices`)
      const json = await result.json()
      dispatch(updateDevices(json))
    } catch (err) {
      console.log(err)
    }
  }
}

export const getConfigAsync = (id) => {
  return async (dispatch, state) => {
    if (state.current !== id) {
      try {
        const result = await fetch(`http://${api}/api/device/${id}`)
        const config = await result.json()
        dispatch(updateConfig(config))
        dispatch(updateCurrent(id))
      } catch (err) {
        console.log(err)
      }
    }
  }
}

export const getRealtimeAsync = (id) => {
  return async (dispatch) => {
    try {
      const result = await fetch(`http://${api}/api/realtime/${id}`)
      const realtime = await result.json()
      dispatch(updateRealtime(realtime))
    } catch (err) {
      console.log(err)
    }
  }
}

export const setConfigAsync = (config) => {
  return async (dispatch) => {
    try {
      await fetch(`http://${api}/api/device`, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(config)
      })
      dispatch(configUpdated(true))
    } catch (err) {
      console.log(err)
    }
  }
}

export const {
  updateCurrent,
  updateDevices,
  updateConfig,
  updateRealtime,
  configUpdated,
} = deviceSlice.actions
export const selectDevices = state => state.device.list
export const selectCurrent = state => state.device.current
export const selectConfig = state => state.device.config
export const selectRealtime = state => state.device.realtime
export const selectUpdated = state => state.device.updated

export default deviceSlice.reducer

