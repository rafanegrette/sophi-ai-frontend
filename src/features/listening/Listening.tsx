import { useState, useEffect } from 'react';
import { useParams  } from 'react-router-dom';
import { useFetchBookQuery } from "../reading/reading-api-slice";
import { Book } from "../../models/Book";
import bookDummyData from '../reading/harry-1.json';
import { ChapterIndexes } from './ChapterIndexes';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';


import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { CurrentChapter } from './CurrentChapter';
import { BookWriteState } from '../../models/BookWriteState';
import { useFetchBookStateQuery } from './listening-api-slice';

import "./Listening.scss";

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const initialBook: Book =  bookDummyData;

const initialBookState: BookWriteState = {
  "bookId": '',
  "chapterId": 0,
  "pageNo": 0,
  "paragraphId": 0,
  "sentenceId": 0,
  "finished": false
};

export function Listening() {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [currentChapter, setCurrentChapter] = useState(0);
    
    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };

    const handleChapterChange = (childIndex: number) => {
      setCurrentChapter(childIndex);
    }

    const { bookId = "-"} = useParams();
    const [ skip, setSkip] = useState(true);
    const { data: currentBook = initialBook, isFetching: isFetchingBook, 
        isUninitialized: isUninitializedBook, isSuccess: isSuccessFetchingBook } = useFetchBookQuery(bookId, {skip});
    const { data: currentBookState = initialBookState } = useFetchBookStateQuery(bookId, {skip});
    
    useEffect(() => {
          if (bookId !== "-") {
              setSkip(false);
          }
    }, [bookId]);

    useEffect(()=> {
      var currentChapterId = currentBook.chapters.findIndex(c => c.id === currentBookState.chapterId)
      if (currentChapterId >= 0) {
        setCurrentChapter(currentChapterId);
      }      
    }, [isSuccessFetchingBook])

    return (
        <div className="ebook">

        
        <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <div className='title-container'>
              <div className='title-left-contents'>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{ mr: 2, ...(open && { display: 'none' }) }}
                >
                  <MenuIcon />
                </IconButton>
              </div>
              <div className='title-left-contents'>
                <Typography variant="h6" noWrap component="div">
                  {currentBook.title}
                </Typography>
              </div>

              <div className='exit-buttom'>
                <IconButton 
                  size="large"
                  aria-label="return to listening list"
                  aria-contorls="menu-return"
                  color="inherit">
                  <ExitToAppIcon/>
                </IconButton>
              </div>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <ChapterIndexes chapterIndexes={currentBook.contentTable} 
                          currentChapterIndex={currentChapter} 
                          onChapterChange={handleChapterChange}/>
        </Drawer>
        <Main open={open}>        
          
          <DrawerHeader />
          {
            currentBookState.finished ?
            <div className="book-finished"><CheckCircleTwoToneIcon className='okresult'/>Finished</div>
            :
            <div></div>
          }
          {
            
            isSuccessFetchingBook ?
            <CurrentChapter chapter={currentBook.chapters[currentChapter]} bookWriteState={currentBookState}/>
            :
            <div></div>
          }
        </Main>
      </Box>
      </div>
    );
}