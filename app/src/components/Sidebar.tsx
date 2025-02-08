import { Button } from '@mantine/core';
import './Sidebar.css';
import LocationEntry from './LocationEntry';
import CategoryEntry from './CategoryEntry';

export default function Sidebar() {
    return (
        <div className='sidebar-container'>
            <div className='location-list'>
                <CategoryEntry />
                <LocationEntry />
                <LocationEntry />
                <LocationEntry />
                <LocationEntry />
                <LocationEntry />
                <LocationEntry />
                <LocationEntry />
                <LocationEntry />
                <LocationEntry />
                <LocationEntry />
            </div>
            {/* <div className='create-location-form'>
                <LocationEntry />
            </div> */}
            <div className='create-location-button'>
                <Button variant="filled" color="rgb(19, 19, 19)" radius="xs">Neuen Standort hinzufügen</Button>
            </div>
        </div>
    )
}
