import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../../shared/baseUrl';

export const fetchStudios = createAsyncThunk(
    'studios/fetchStudios',
    async () => {
        const response = await fetch(baseUrl + 'studios');
        return response.json();
    }
);

const studiosSlice = createSlice({
    name: 'studios',
    initialState: { isLoading: true, errMess: null, studiosArray: [] },
    reducers: {},
    extraReducers: {
        [fetchStudios.pending]: (state) => {
            state.isLoading = true;
        },
        [fetchStudios.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.errMess = null;
            state.studiosArray = action.payload;
        },
        [fetchStudios.rejected]: (state, action) => {
            state.isLoading = false;
            state.errMess = action.error ? action.error.message : 'Fetch failed';
        }
    }
});

export const studiosReducer = studiosSlice.reducer;