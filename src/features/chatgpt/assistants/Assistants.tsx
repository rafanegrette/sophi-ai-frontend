import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Assistant, useFetchAssistantQuery } from './assistant-api-slice';

interface Props {
  onSelectAssistant: (assistant: Assistant) => void;
}

export default function Assistants (props: Props){

  const defaultAssistant: Assistant = {
    id: 'jk',
    title: "Helpful Assistant",
    description: "You are a helpful assistant"
  };

  const [ currentAssistant, setCurrentAssitant ] = useState<Assistant>(defaultAssistant);
  const { data: asistants = [], isFetching} = useFetchAssistantQuery();  

  const handleSelectAssistant = (assistant: Assistant) => {
    setCurrentAssitant(assistant);
    props.onSelectAssistant(assistant);
  };

  return (
      <List>
      {asistants.map((assistant, index) => (
        <ListItem 
          key={assistant.id} 
          onClick = {(event) => handleSelectAssistant(assistant)}
          disablePadding>
          <ListItemButton selected={assistant.id === currentAssistant.id}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={assistant.title} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

}