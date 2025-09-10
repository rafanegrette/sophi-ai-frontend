import { ToggleButton, IconButton, List, ListItemButton, ListItemText, Pagination, Typography, Stack, Chip, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { setChapterNo, setPageNo } from '../../previewBook/state-preview-book-slice';
import { deleteChapter, deletePage, deleteParagraph, updateSentence } from '../../previewBook/preview-book-slice';


import "./Preview.scss";
import { PreviewBookState } from "../../../models/PreviewBookState";

const style = {
    width: '100%',
    maxWidth: 100,
    bgcolor: 'background.paper'
};

export function Preview () {
    
    const dispatch = useAppDispatch();
    
    const [editSelected, setEditSelected] = useState(false);

    const currentBook = useAppSelector((state) => state.previewBook);
    const statePreviewBook = useAppSelector((state) => state.statePreviewBook);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        dispatch(setPageNo(value));
    };
    const handleSelectChapterClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number
    ) => {
        if (index < currentBook.chapters.length) {
            console.log('Chapter index: ' + index);
            dispatch(setChapterNo(index));
            dispatch(setPageNo(1));
        }
    };

    const handleDeleteChapter = (index: number) => {
        dispatch(setPageNo(1));
        dispatch(setChapterNo(0));
        dispatch(deleteChapter(index));
    };

    const handleDeletePage = () => {
        const statePreviewCopy : PreviewBookState = {
            currentChapterNo: statePreviewBook.currentChapterNo,
            currentPageNo: statePreviewBook.currentPageNo,
            currentParagraphNo: 0,
            currentSentenceId: 0,
            currentText: ""
        };
        
        if (statePreviewBook.currentPageNo === currentBook.chapters[statePreviewBook.currentChapterNo].pages.length) {
            dispatch(setPageNo(statePreviewBook.currentPageNo - 1))
        }
        dispatch(deletePage(statePreviewCopy));
    }

    const handleDeleteParagraph = (index: number) => {
        const statePreviewCopy : PreviewBookState = {
            currentChapterNo: statePreviewBook.currentChapterNo,
            currentPageNo: statePreviewBook.currentPageNo,
            currentParagraphNo: index,
            currentSentenceId: 0,
            currentText: ""
        };
        console.log("Paragraph Index: " + index);
        dispatch(deleteParagraph(statePreviewCopy));
    }

    const handleUpdateSentence = (paragraphNo: number, sentenceNo: number, text: string) => {
        const statePreviewCopy : PreviewBookState = {
            currentChapterNo: statePreviewBook.currentChapterNo,
            currentPageNo: statePreviewBook.currentPageNo,
            currentParagraphNo: paragraphNo,
            currentSentenceId: sentenceNo,
            currentText: text
        };
        dispatch(updateSentence(statePreviewCopy));
    }
/*
    useEffect(() =>{
        dispatch(setChapterNo(0));
        dispatch(setPageNo(0));
    }, [currentBook])*/

    return (
        <Grid2 container spacing={1}>
                <Grid2 xs={12} md={12}>
                    <Stack direction="row">
                        <ToggleButton
                            color="error"
                            value="check"
                            selected={editSelected}
                            onChange={() => {
                                if (currentBook.title !== '') {
                                    setEditSelected(!editSelected);
                                }
                            }}>
                            <EditIcon/>
                            Edit
                        </ToggleButton>

                        <Typography variant="h6" component="h4">
                            Preview
                        </Typography>
                    </Stack>

                </Grid2>

                <Grid2 xs={12} md={12}>
                    <div className="previewBackground">
                        <div className="previewBook">
                            <Grid2 container spacing={2}>
                                <Grid2 xs={12}>
                                    <div className="previewBookTitle">
                                        {currentBook.title}
                                    </div>
                                    
                                </Grid2>
                                <Grid2 xs={2} className="previewContentTable">
                                    <List sx={style} component="nav" aria-label="book indexes">
                                        { 
                                            currentBook.contentTable.map((indexContent) => (
                                                <Stack direction="row">
                                                    <ListItemButton 
                                                        selected = {statePreviewBook.currentChapterNo === indexContent.index}
                                                        key={indexContent.index} 
                                                        sx={{padding:0.4}} 
                                                        onClick = {(event) => handleSelectChapterClick(event, indexContent.index)}
                                                        divider>
                    
                                                        <ListItemText primaryTypographyProps={{fontSize: 8}} primary={indexContent.title}/>

                                                    </ListItemButton>
                                                    <IconButton
                                                        sx={{ display: editSelected === false ? 'none' : 'ok'}}
                                                        onClick={() => handleDeleteChapter(indexContent.index)}
                                                        >
                                                        <RemoveCircleIcon 
                                                            
                                                            color="error"
                                                            sx={{fontSize:12}}
                                                            key={indexContent.index}/>
                                                    </IconButton>
                                                </Stack>
                                            ))
                                        }
                                    </List>
                                </Grid2>
                                <Grid2 xs={10} className="previewCurrentPage">
                                    
                                    <Grid2 xs={12}>
                                        
                                        {
                                            currentBook.chapters[statePreviewBook.currentChapterNo].pages.length > 0 &&
                                            !!currentBook.chapters[statePreviewBook.currentChapterNo].pages[statePreviewBook.currentPageNo - 1] &&
                                            currentBook.chapters[statePreviewBook.currentChapterNo].pages[statePreviewBook.currentPageNo - 1].paragraphs.map((paragraph) => (
                                                <div className="previewParagraph" key={paragraph.id}>
                                                    {
                                                        paragraph.sentences.map((sentence) => (
                                                            <div className="previewBorderSentence" key={sentence.id+"1"}>
                                                                
                                                                {
                                                                 editSelected ?    
                                                                    <TextField
                                                                        className="previewSentence"
                                                                        value={sentence.text}
                                                                        size="small"
                                                                        fullWidth
                                                                        style={{
                                                                            width: `${sentence.text.length * 4.4}px`,
                                                                            fontSize: '8px', // Font size of 8
                                                                            height: '12px', // Custom height
                                                                        }}
                                                                        inputProps={{ style: {fontSize: 9, padding: '0px 0px 0px 0px'}}}
                                                                        onChange={(e) => handleUpdateSentence(paragraph.id, sentence.id, e.target.value)}
                                                                        />
                                                                    :
                                                                    <span className="previewSentence" key={sentence.id}>
                                                                        {sentence.text}&nbsp;
                                                                    </span>
                                                                }
                                                            </div>
                                                        ))
                                                    }
                                                    <IconButton
                                                        sx={{ display: editSelected === false ? 'none' : 'ok'}}
                                                        onClick={() => handleDeleteParagraph(paragraph.id)}
                                                        >
                                                        <RemoveCircleIcon 
                                                            
                                                            color="error"
                                                            sx={{fontSize:10}}
                                                            key={paragraph.id}/>
                                                    </IconButton>
                                                </div>
                                            ))
                                        }
                                        
                                    </Grid2>

                                </Grid2>
                                <Grid2 xs={2}>
                                </Grid2>
                                <Grid2 xs={10} className="previewBookPaginator">

                                       
                                    <IconButton
                                        sx = {{ display : editSelected === false ? 'none' : 'ok' ,
                                                fontSize:9}}
                                        onClick={handleDeletePage}
                                        >
                                        Delete Page  
                                        <RemoveCircleIcon 
                                            color="error"
                                            fontSize="medium"/>
                                    </IconButton>
                                    <div >
                                        <Pagination count={currentBook.chapters[statePreviewBook.currentChapterNo].pages.length} page={statePreviewBook.currentPageNo} onChange={handlePageChange}/>
                                    </div>
                                </Grid2>
                            </Grid2>
                        </div>
                    </div>
                </Grid2>
            
        </Grid2>
    );
}