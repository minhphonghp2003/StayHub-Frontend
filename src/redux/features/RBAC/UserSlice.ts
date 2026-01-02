import { AuthModel } from '@/core/model/RBAC/Auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface UserState {
    value: AuthModel | null;
}
const initialState: UserState = {
    value: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<AuthModel>) => {
            state.value = action.payload;
        },
        removeUser: (state) => {
            state.value = null;
        }

    },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;