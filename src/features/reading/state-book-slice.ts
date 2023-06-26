import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BookState } from "./BookState";

const initialState: BookState = {
    currentChapterNo: 0,
    currentPageNo: 1
}

const stateBookSlice = createSlice({
    name: 'stateBookSlice',
    initialState,
    reducers: {
        setChapterNo(state, action: PayloadAction<number>) {
            state.currentChapterNo = action.payload;
        },
        setPageNo(state, action: PayloadAction<number>) {
            state.currentPageNo = action.payload;
        },
        resetBookState(state) {
            state.currentChapterNo = 0;
            state.currentPageNo = 1;
        }
    }
});

export const {setChapterNo, setPageNo, resetBookState } = stateBookSlice.actions;
export default stateBookSlice.reducer;