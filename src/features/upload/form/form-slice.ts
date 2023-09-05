import { createSlice } from '@reduxjs/toolkit';

export interface FormState {
    file: Blob;
    bookLabel: String;
    paragraphSeparator: String;
    chapterTitleType: String;
    firstPgeOffset: number;
    fixTitleHP1: boolean;
}

const initialState : FormState = {
    file: new Blob([JSON.stringify({})]),
    bookLabel: "",
    paragraphSeparator: "ONE",
    chapterTitleType: "",
    firstPgeOffset: 0,
    fixTitleHP1: false
}

const formSlice = createSlice({
    name: "form",
    initialState,
    reducers: {
        attach(state, action) {
            state.file = action.payload;
        },
        setLabel(state, action) {
            state.bookLabel = action.payload;
        },
        setParagraphSeparator(state, action) {
            state.paragraphSeparator = action.payload;
        },
        setChapterTitleType(state, action) {
            state.chapterTitleType = action.payload;
        },
        setFirstPageOffset(state, action) {
            state.firstPgeOffset = action.payload;
        },
        setFixTitleHP1(state, action) {
            state.fixTitleHP1 = action.payload;
        },
        resetForm(state) {
            state.file = new Blob([JSON.stringify({})]);
            state.bookLabel = "";
            state.paragraphSeparator = "";
            state.chapterTitleType = "";
            state.firstPgeOffset = 0;
        }
    }
});

export const {attach, 
    setLabel, 
    setParagraphSeparator, 
    setChapterTitleType, 
    setFirstPageOffset, 
    resetForm,
    setFixTitleHP1} = formSlice.actions;
export default formSlice.reducer;