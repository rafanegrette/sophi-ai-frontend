import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Book } from '../../../models/Book';
import { FormState } from './form-slice';


export const formApiSlice = createApi({
    reducerPath: 'apiUploadForm',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_HOST}/api/books`,
        prepareHeaders(headers) {
            headers.set('Accept', 'multipart/form-data, application/json');
        },
        credentials: 'include',
        fetchFn: async(url, args) => {
            const response = await fetch(url, {...args, redirect: "manual"});
            if(response.type === "opaqueredirect") {
                document.location = response.url;
            }
            return response;
        }
    }),
    endpoints(builder) {
        return {
            uploadPreview: builder.mutation<Book, FormState>({
                query: (form: FormState) => {
                    //const { bookName, paragraphSeparator, file} = form;
                    //const requestBody = new FormData();
                    //requestBody.append('file', file);
                    //requestBody.append('bookName', bookName);
                    return {
                        url: '/preview',
                        method: 'POST',
                        body: form
                    };
                },
            }),
            saveBook: builder.mutation<void,Book>({
                query: (book: Book) => {
                    return {
                        url: '/save',
                        method: 'POST',
                        body: book
                    }
                }
            })
        }
    }
});

export const { useUploadPreviewMutation, useSaveBookMutation } = formApiSlice;