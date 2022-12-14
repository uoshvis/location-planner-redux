import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { client } from '../../mocks/client.js';
import { jsonDateTimeConverter } from './calendarHelpers.js'

const initialState = {
    items: [],
    currentItem : {},
    currentLocation: 'all',
    showModal: false,
    error: null,
    formType: '' // 'add' | 'update' 
}


export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
      addEvent: {},
      getEvent: {},

      toggleShowModal(state) {
        state.showModal = !state.showModal
        if(!state.showModal) {
          state.currentItem = {}
        }
      },
      setFormType(state, action) {
        state.formType = action.payload
      },
      setCurrentLocation(state, action) {
        state.currentLocation = action.payload
      },
      selectCurrentEvent: (state, action) => {
        state.currentItem = action.payload
      },
      updateCurrentEvent: (state, action) => {        
        const { key, value }  = action.payload
        state.currentItem[key] = value
      },
      deleteEvent: {}
  },
  extraReducers(builder) {
    builder
      .addCase(fetchEventsByLocation.fulfilled, (state, action) => {
        state.items = jsonDateTimeConverter(action.payload)
      })
      .addCase(fetchEventsByLocation.rejected, (state, action) => {
        state.error = action.error.message
      })
      // add
      .addCase(addEventData.fulfilled, (state, action) => {
        const item = jsonDateTimeConverter(action.payload)
        state.items.push(item)
      })
      .addCase(addEventData.rejected, (state, action) => {
        state.error = action.error.message
      })
      // update
      .addCase(updateEventData.fulfilled, (state, action) => {
        const item = jsonDateTimeConverter(action.payload)
        const itemIdx = state.items.findIndex(obj => obj.id === Number(item.id))
        if (itemIdx !== -1) {
          state.items[itemIdx] = item
        }
      })
      .addCase(updateEventData.rejected, (state, action) => {
        state.error = action.error.message
      })
      // delete
      .addCase(deleteEvent.rejected, (state, action) => {
        state.error = action.error.message
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        const itemIdx = state.items.findIndex(obj => obj.id === Number(action.payload.id))
        if (itemIdx !== -1) {
          state.items.splice(itemIdx, 1)
        }
      })
  }
})

export const fetchEventsByLocation = createAsyncThunk('calendar/fetchEventsByLocation', async (location) => {
  const response = await client.get(`/myApi/events/${location}`)
  return response.data
})

export const addEventData = createAsyncThunk('calendar/createEvent', async (event) => {
  const response = await client.post('/myApi/events', event)
  return response.data
})

export const updateEventData = createAsyncThunk('calendar/updateEvent', async (event) => {
    const response = await client.put(`/myApi/events/${event.id}`, event)
    return response.data
})

export const deleteEvent = createAsyncThunk('calendar/deleteEvent', async (event) => {
  const response = await client.delete(`/myApi/events/${event.id}`)
  return response.data
})

export const {
  setFormType,
  toggleShowModal,
  setCurrentLocation,
  selectCurrentEvent,
  updateCurrentEvent,
  updateEvent, 
} = calendarSlice.actions

export default calendarSlice.reducer


export const filterEventsByLocation = (state, location) =>
  {
    const eventsByLocation = state.calendar.items.filter( function(item) {
      if (location === 'all') {
          return item
      }
      else {
          return item.location === location
      }
  })

  return eventsByLocation   

  }



