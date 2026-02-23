import { Property } from '@/core/model/pmm/property';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface PropertyState {
    value: Property[] | null;
    selectedPropertyId?: number | null;
}
const initialState: PropertyState = {
    value: null,
    selectedPropertyId: null,
};

const propertySlice = createSlice({
    name: 'property',
    initialState,
    reducers: {
        setPropertyList: (state, action: PayloadAction<Property[]>) => {
            state.value = action.payload;
            console.log(state.selectedPropertyId);

            if (action.payload.length > 0) {
                if (state.selectedPropertyId == null || !action.payload.some(p => p.id === state.selectedPropertyId)) {
                    state.selectedPropertyId = action.payload[0]?.id ?? null;
                }
            }
        },
        removePropertyList: (state) => {
            state.value = null;
            state.selectedPropertyId = null;
        },
        setSelectedPropertyId: (state, action: PayloadAction<number | null>) => {
            state.selectedPropertyId = action.payload;
        }
    },
});

export const { setPropertyList, removePropertyList, setSelectedPropertyId } = propertySlice.actions;
export default propertySlice.reducer;