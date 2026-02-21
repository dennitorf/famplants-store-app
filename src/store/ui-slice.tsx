import { UIState } from "@/models/states/ui-state";
import { createSlice } from "@reduxjs/toolkit";

const uiInitialState : UIState = {
    hasVisitedWelcomeScreen : false
}

const uiSlice = createSlice({
    name : 'ui',
    initialState : uiInitialState,
    reducers : {
        setHasVisitedWelcomeScreen (state, action) {
            state.hasVisitedWelcomeScreen = action.payload;
        }
    }
})

export const uiActions = uiSlice.actions;
export default uiSlice;