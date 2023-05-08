import { createSlice } from '@reduxjs/toolkit';

export interface FormState {
    file: Blob;
    bookName: String;
    paragraphSeparator: String;
    chapterTitleType: String;
    firstPgeOffset: number;
}

const initialState : FormState = {
    file: new Blob([JSON.stringify({})]),
    bookName: "",
    paragraphSeparator: "",
    chapterTitleType: "",
    firstPgeOffset: 0
}

const formSlice = createSlice({
    name: "form",
    initialState,
    reducers: {
        attach(state, action) {
            state.file = action.payload;
        },
        setName(state, action) {
            state.bookName = action.payload;
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
        resetForm(state) {
            state.file = initialState.file;
            state.bookName = initialState.bookName;
            state.paragraphSeparator = initialState.paragraphSeparator;
            state.chapterTitleType = initialState.chapterTitleType;
            state.firstPgeOffset = initialState.firstPgeOffset;
        }
    }
});

export const {attach, setName, setParagraphSeparator, setChapterTitleType, setFirstPageOffset, resetForm} = formSlice.actions;
export default formSlice.reducer;