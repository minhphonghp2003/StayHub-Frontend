import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface DemoState {
    value: number;
    secValue: string;
}
const initialState: DemoState = {
    value: 0,
    secValue: '',
};

const demoSlice = createSlice({
    name: 'demo',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        setSecValue: (state, action: PayloadAction<string>) => {
            state.secValue = action.payload;
        },
    },
});

export const { increment, decrement, setSecValue } = demoSlice.actions;
export default demoSlice.reducer;