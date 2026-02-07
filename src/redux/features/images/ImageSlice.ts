import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface ImageState {
    value: {
        url: string;
        alt: string;    
    }[];
}
const initialState: ImageState = {
    value: [],
};

const imageSlice = createSlice({
    name: 'image',
    initialState,
    reducers: {
        setImage: (state, action: PayloadAction<{url: string, alt: string}[]>) => {
            state.value = action.payload;
        },
        closeImage: (state) => {
            state.value = [];
        },
    },
});

export const { setImage, closeImage } = imageSlice.actions;
export default imageSlice.reducer;