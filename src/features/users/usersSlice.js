import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { client } from '../../mocks/client'

const initialState = []

export const fetchUsers = createAsyncThunk('users/fetchUsers', async() => {
    const response = await client.get('/myApi/users')
    return response.data
})

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchUsers.fulfilled, (state, action) => {
                return action.payload
            })
    }
})

export default usersSlice.reducer

// ToDo fetch userById
export const getUserById = (state, userId) =>
  {
    return state.users.find(user => user.id === Number(userId))
  }

export const getUserColors = (state) =>
    {
        var userColors = state.users.reduce(
            (obj, item) => {
                obj[item.id] = item.userColor; 
                return obj
            }, {}
        )
        return userColors
    }