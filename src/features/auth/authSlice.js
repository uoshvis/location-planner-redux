import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { client } from '../../mocks/client.js';

const initialState =  { 
    isLoggedIn: false,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed',
    username: 'admin'
 }


export const authSlice = createSlice({
    name: 'auth',
    initialState, 
    reducers: {

    },
    extraReducers(builder) {
        builder
            .addCase(login.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = true
                state.status = 'succeeded'
        
            })
            .addCase(logout.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = false
                state.status = 'succeeded'        
            })
    }
})

export const login = createAsyncThunk('auth/login', async (crediantials) => {
    const response = await client.post('/myApi/login', crediantials)
    return response.data
})

export const logout = createAsyncThunk('auth/logout', async (crediantials) => {
    const response = await client.post('/myApi/logout', crediantials)
    return response.data
})


export default authSlice.reducer