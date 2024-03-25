import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Book } from '../../models/Book';

interface Title {
    id : string;
    title : string;
    label: string;
}

export const readingApiSlice = createApi({
    reducerPath: 'apiBooks',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_HOST}/api/books`,
        prepareHeaders(headers) {
            headers.set('Accept', 'application/json');
        },
        redirect: 'follow',
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
            fetchTitles: builder.query<Title[], boolean>({
                query() {
                    return `/titles`;
                }
            }),
            fetchBook: builder.query<Book, string>({
                query(bookId) {
                    return `/${bookId}`;
                }
            })  
        }
    }
});

export const { useFetchTitlesQuery, useFetchBookQuery } = readingApiSlice;