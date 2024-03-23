import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Book } from '../../models/Book';
import { ContentIndex } from '../../models/ContentIndex';
import { PreviewBookState } from '../../models/PreviewBookState';

const initialState: Book = {
    id: 'dfsdf',
    title: '',
    label: '',
    contentTable: [
        {
            index: 0,
            title: 'Chapter placeholder'
        }
    ],
    chapters: [
        {
            id: 1,
            title: 'Chapter holder',
            pages: [
                {
                    number: 0,
                    paragraphs:[
                        {
                            id: 0,
                            sentences:[
                                {
                                    id: 0,
                                    text: "Text placeholder, sentence number one."
                                },
                                {
                                    id: 1,
                                    text: "Sentence number two."
                                }
                            ]
                        }
                    ]
                }
                
            ]
        }
    ]
}

const previewBookSlice = createSlice({
    name: 'previewBook',
    initialState,
    reducers: {
        load(state, action: PayloadAction<Book>) {
            state.title = action.payload.title;
            state.label = action.payload.label;
            state.chapters = action.payload.chapters;
            state.contentTable = action.payload.contentTable;
        },
        resetState(state) {
            console.log("debug state preview");
            state.title = initialState.title;
            state.label = initialState.label;
            state.chapters = initialState.chapters;
            state.contentTable = initialState.contentTable;
        },
        deleteChapter(state, action: PayloadAction<number>) {
            const chapterNo = action.payload;
            state.chapters.splice(chapterNo, 1);
            const leftContentTable = chapterNo < state.contentTable.length - 1 ? state.contentTable.slice(chapterNo + 1)
                .map(item => {
                    const contentIndex:ContentIndex = {
                        index: item.index -1,
                        title: item.title
                    }
                    return contentIndex;
                }) : [];
            state.contentTable = state.contentTable.splice(0, chapterNo)
                                    .concat(leftContentTable);
        },
        deletePage(state, action: PayloadAction<PreviewBookState>) {
            const bookState = action.payload;
            state.chapters[bookState.currentChapterNo].pages.splice(bookState.currentPageNo - 1, 1);
        },
        deleteParagraph(state, action: PayloadAction<PreviewBookState>) {
            const bookState = action.payload;
            state.chapters[bookState.currentChapterNo].pages[bookState.currentPageNo - 1].paragraphs.splice(bookState.currentParagraphNo, 1);
            state.chapters[bookState.currentChapterNo].pages[bookState.currentPageNo - 1].paragraphs
                .filter(para => para.id >= bookState.currentParagraphNo)
                .forEach(para => para.id = para.id - 1);
            console.log(state.chapters[bookState.currentChapterNo].pages[bookState.currentPageNo - 1].paragraphs);
        }
    }
});

export const { load, resetState, deleteChapter, deletePage, deleteParagraph } = previewBookSlice.actions;
export default previewBookSlice.reducer;