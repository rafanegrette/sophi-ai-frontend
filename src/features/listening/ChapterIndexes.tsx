import ListItem from '@mui/material/ListItem';
import { List, ListItemButton, ListItemText } from "@mui/material";
import { styled, useTheme } from '@mui/material/styles';

import { ContentIndex } from "../../models/ContentIndex";

interface ContentIndexesProps {
    chapterIndexes: ContentIndex[];
    onChapterChange: (childIndex: number) => void;
    currentChapterIndex: number;
}

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

export function ChapterIndexes ({chapterIndexes, onChapterChange, currentChapterIndex}: ContentIndexesProps) {
    
    return (
        <nav className="sidebar">
                <List>
                {chapterIndexes.map((indexContent, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton selected={index === currentChapterIndex}
                            onClick={() => onChapterChange(index)}
                            >
                            <ListItemText primary={indexContent.title} />
                        </ListItemButton>
                    </ListItem>
                ))}
                </List>
        </nav>


    );
}