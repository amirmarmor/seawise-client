import {createSlice} from "@reduxjs/toolkit"

const initialState = {id: 0}
const api = `localhost:5000`

export const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    updateDevice: (state, action) => {
      console.log(action)
      state.device = action.payload
    },
    updateDevices: (state, action) => {
      state.list
    },
    default: state => state
  }
})

export const getDevicesAsync = () => {
  return async (dispatch) => {
    try {
      const result = await fetch(`http://${api}/api/devices`)
      dispatch()
    }
  }
}

export const setDeviceAsync = (id) => {
  return async (dispatch) => {
    try {
      const result = await fetch(`http://${api}/device/${id}`)
      const device = await result.json()
      dispatch(updateDevice({id, ip: device.ip}))
    } catch (err) {
      console.log(err)
    }
  }
}


export const {updateDevice} = deviceSlice.actions
export const selectDevice = state => state.device.device

export default deviceSlice.reducer

