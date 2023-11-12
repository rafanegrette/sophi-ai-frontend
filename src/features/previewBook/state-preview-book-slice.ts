import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PreviewBookState } from '../../models/PreviewBookState';

const initialState: PreviewBookState = {
    currentChapterNo: 0,
    currentPageNo: 1,
    currentParagraphNo: 1
}

const statePreviewBookSlice = createSlice({
    name: 'statePreviewBookSlice',
    initialState,
    reducers: {
        setChapterNo(state, action: PayloadAction<number>){
            state.currentChapterNo = action.payload;
        },
        setPageNo(state, action: PayloadAction<number>) {
            state.currentPageNo = action.payload;
        },
        resetPreview(state) {
            state.currentChapterNo = 0;
            state.currentPageNo = 1;
            console.log("review resetPreview")
        }
    }
});

export const {setChapterNo, setPageNo, resetPreview } = statePreviewBookSlice.actions;
export default statePreviewBookSlice.reducer;