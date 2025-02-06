import { Button } from '@mantine/core';
import './Sidebar.css';
import LocationEntry from './LocationEntry';

export default function Sidebar() {
    return (
        <div className='sidebar-container'>
            <LocationEntry />
            <Button variant="filled" color="rgb(19, 19, 19)" radius="xs" style={{top:"20px", bottom:"20px"}}>Neuen Standort hinzufügen</Button>
        </div>
    )
}
