import {createSlice} from "@reduxjs/toolkit"

const initialState = {}
const api = process.env.REACT_APP_API_HOST || ``

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
      const result = await fetch(`${api}/api/devices`)
      const json = await result.json()
      const list = json.map(device => {
        let ips = JSON.parse(device.ip)
        return {
          id: device.id,
          local: ips.local,
          external: ips.external,
          channels: device.channels
        }
      })
      dispatch(updateDevices(list))
    } catch (err) {
      console.log(err)
    }
  }
}

export const getConfigAsync = (id) => {
  return async (dispatch, getState) => {
    let state = getState()
    if (state.device.current !== id) {
      try {
        const result = await fetch(`${api}/api/device/${id}`)
        const config = await result.json()
        dispatch(updateConfig(config))
        dispatch(updateCurrent(id))
      } catch (err) {
        console.log(err)
      }
    }
  }
}

export const getRealtimeAsync = () => {
  return async (dispatch, getState) => {
    let state = getState()
    if(state.device.current === undefined){
      return
    }
    try {
      const result = await fetch(`${api}/api/realtime/${state.device.current}`)
      const realtime = await result.json()
      let ips = JSON.parse(realtime.ip)
      const device = {
        channels: realtime.channels,
        local: ips.local,
        external: ips.external
      }
      dispatch(updateRealtime(device))
    } catch (err) {
      console.log(err)
    }
  }
}

export const setConfigAsync = (config, id) => {
  id = parseInt(id)
  return async (dispatch) => {
    try {
      await fetch(`${api}/api/device`, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({...config, id})
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

