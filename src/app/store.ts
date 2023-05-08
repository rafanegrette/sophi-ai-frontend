import { configureStore } from "@reduxjs/toolkit";
import  counterReducer from '../features/counter/counter-slice';
import formReducer from '../features/upload/form/form-slice';
import previewBookReducer from '../features/previewBook/preview-book-slice';
import { apiSlice} from '../features/dogs/dogs-api-slice';
import { formApiSlice } from "../features/upload/form/form-api-slice";
import statePreviewBookReducer from "../features/previewBook/state-preview-book-slice";
import { readingApiSlice } from "../features/reading/reading-api-slice";
 
export const store = configureStore({
    reducer: { 
        counter: counterReducer,
        form: formReducer,
        previewBook: previewBookReducer,
        statePreviewBook: statePreviewBookReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        [formApiSlice.reducerPath] : formApiSlice.reducer,
        [readingApiSlice.reducerPath] : readingApiSlice.reducer
    },
    middleware:  (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false
        });
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
