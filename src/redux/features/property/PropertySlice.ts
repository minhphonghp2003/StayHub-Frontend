import { Property } from '@/core/model/pmm/property';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface PropertyState {
    value: Property[] | null;
    selectedPropertyId?: number | null;
}

// cookie used to remember the last selected property across page reloads
const COOKIE_NAME = 'selected_property_id';

function readSelectedPropertyIdFromCookie(): number | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)'));
    if (!match) return null;
    const parsed = parseInt(decodeURIComponent(match[1]), 10);
    return isNaN(parsed) ? null : parsed;
}

function writeSelectedPropertyIdToCookie(id: number | null) {
    if (typeof document === 'undefined') return;
    if (id === null) {
        document.cookie = `${COOKIE_NAME}=; Max-Age=0; path=/; SameSite=Lax`;
    } else {
        document.cookie = `${COOKIE_NAME}=${encodeURIComponent(id.toString())}; path=/; SameSite=Lax`;
    }
}

const initialState: PropertyState = {
    value: null,
    // try to hydrate from cookie when running in the browser
    selectedPropertyId: readSelectedPropertyIdFromCookie(),
};

const propertySlice = createSlice({
    name: 'property',
    initialState,
    reducers: {
        setPropertyList: (state, action: PayloadAction<Property[]>) => {
            state.value = action.payload;

            if (action.payload.length > 0) {
                // if current selection doesn't exist in the list or is null, pick first available
                if (state.selectedPropertyId == null || !action.payload.some(p => p.id === state.selectedPropertyId)) {
                    state.selectedPropertyId = action.payload[0]?.id ?? null;
                    writeSelectedPropertyIdToCookie(state.selectedPropertyId);
                }
            } else {
                // if the list is empty, clear selection
                state.selectedPropertyId = null;
                writeSelectedPropertyIdToCookie(null);
            }
        },
        removePropertyList: (state) => {
            state.value = null;
            state.selectedPropertyId = null;
            writeSelectedPropertyIdToCookie(null);
        },
        setSelectedPropertyId: (state, action: PayloadAction<number | null>) => {
            state.selectedPropertyId = action.payload;
            writeSelectedPropertyIdToCookie(action.payload);
        }
    },
});

export const { setPropertyList, removePropertyList, setSelectedPropertyId } = propertySlice.actions;
export default propertySlice.reducer;