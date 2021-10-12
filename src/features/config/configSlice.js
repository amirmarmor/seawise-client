import {createSlice} from "@reduxjs/toolkit"

const initialState = {offset: 0, cleanup: false, rules: [], device: 0}

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    updateConfig: (state, action) => {
      state.config = action.payload
    },
    default: state => state
  }
})

export const getConfigAsync = () => {
  return async (dispatch) => {
    try {
      const result = await fetch(`http://${window.backendHost}/config`)
      const config = await result.json()
      dispatch(updateConfig(config))
    } catch (err) {
      console.log(err)
    }
  }
}

export const actionAsync = (action) => {
  return async dispatch => {
    try {
      let body = JSON.stringify(action)
      const result = await fetch(`${window.backendHost}/action`, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body
      })
      const config = await result.json()
      dispatch(updateConfig(config))
    } catch (err) {
      console.log(err)
    }
  }
}


export const setConfigAsync = (config) => {
  return async (dispatch) => {
    try {
      const result = await fetch(`${window.backendHost}/config`, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(config)
      })
      const newConfig = await result.json()
      dispatch(updateConfig(newConfig))
    } catch (err) {
      console.log(err)
    }
  }
}

export const {updateConfig} = configSlice.actions
export const selectConfig = state => state.config.config

export default configSlice.reducer

