import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  RouterProvider,
  createBrowserRouter
} from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";
import { store } from './app/store';
import "./index.css";
import { Navigation } from "./features/navigation/Navigation";
import { ErrorPage } from "./ErrorPage";
import { Home } from "./features/home/Home";
import { Reading } from "./features/reading/Reading";
import { Upload } from "./features/upload/Upload";
import { Books } from "./features/reading/Books";
import { Contents } from "./features/contentAdmin/Contents";
import { Chat } from "./features/chatgpt/Chat";

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
    element: <Books />,
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
    element: <Chat />,
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
