import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
    value: number;
}

const initialState: CounterState  = {
    value: 0
}

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        incremented(state) {
            // immer makes this immutable
            state.value++;
        },
        incrementByAmount(state, action : PayloadAction<number>) {
            state.value += action.payload;
        }
    }
});

export const { incremented, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;