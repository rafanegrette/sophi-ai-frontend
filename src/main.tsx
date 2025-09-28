import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from './app/store';
import "./index.css";
import { Navigation } from "./features/navigation/Navigation";
import { ErrorPage } from "./ErrorPage";
import { Home } from "./features/home/Home";
import { Reading } from "./features/reading/Reading";
import { Upload } from "./features/upload/Upload";
import { BookList } from "./features/reading/BookList";
import { ListeningList } from "./features/listening/ListeningList";
import { Contents } from "./features/contentAdmin/Contents";
import ChatFrame from "./features/chatgpt/ChatFrame";
import { Listening } from "./features/listening/Listening";
import { enableMapSet } from 'immer';

  enableMapSet();

const privateMenus = [
  {
    index: true,
    element: <Home/>
  },
  {
    path: "home",
    element: <Home/>
  },
  {
    path: "books",
    element: <BookList />,
  },
  {
    path: "listening",
    element: <ListeningList />,
  },
  {
    path: "listening/:bookId",
    element: <Listening />,
  },
  {
    path: "upload",
    element: <Upload />,
  },
  {
    path: "books/:bookId",
    element: <Reading />,
  },
  {
    path: "contentadmin",
    element: <Contents />,
  },
  {
    path: "chatgpt",
    element: <ChatFrame />,
  },
];

const publicMenus = [
  {
    index: true,
    element: <Home/>
  },
  {
    path: "home",
    element: <Home/>
  }
  
];

const navegator = createBrowserRouter([
  {
    path: "/",
    element:<Navigation />,
    errorElement: <ErrorPage/>,
    children: false ? publicMenus : privateMenus
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={navegator}/>
        
    </Provider>
  </React.StrictMode>
);
