import { configureStore } from "@reduxjs/toolkit";
import  counterReducer from '../features/counter/counter-slice';
import formReducer from '../features/upload/form/form-slice';
import previewBookReducer from '../features/previewBook/preview-book-slice';
import stateBookReducer from '../features/reading/state-book-slice';
import { apiSlice} from '../features/dogs/dogs-api-slice';
import { formApiSlice } from "../features/upload/form/form-api-slice";
import statePreviewBookReducer from "../features/previewBook/state-preview-book-slice";
import { readingApiSlice } from "../features/reading/reading-api-slice";
import { signedUrlsApiSlice } from "../features/reading/signedUrls/signed-urls-api-slice";
import { voiceToTextApiSlice } from "../features/reading/wavtovec/voice-to-text-api-slice";
import { deleteBookApiSlice } from "../features/contentAdmin/delete/delete-book-api-slice";

export const store = configureStore({
    reducer: { 
        counter: counterReducer,
        form: formReducer,
        previewBook: previewBookReducer,
        statePreviewBook: statePreviewBookReducer,
        stateBook: stateBookReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        [formApiSlice.reducerPath] : formApiSlice.reducer,
        [readingApiSlice.reducerPath] : readingApiSlice.reducer,
        [signedUrlsApiSlice.reducerPath ] : signedUrlsApiSlice.reducer,
        [voiceToTextApiSlice.reducerPath] : voiceToTextApiSlice.reducer,
        [deleteBookApiSlice.reducerPath] : deleteBookApiSlice.reducer
    },
    middleware:  (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false
        }).concat(apiSlice.middleware)
        .concat(formApiSlice.middleware)
        .concat(readingApiSlice.middleware)
        .concat(signedUrlsApiSlice.middleware)
        .concat(voiceToTextApiSlice.middleware)
        .concat(deleteBookApiSlice.middleware);
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
