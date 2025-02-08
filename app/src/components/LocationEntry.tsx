import { useState } from 'react';
import './LocationEntry.css';
import { Checkbox } from '@mantine/core';
import { HiDotsVertical } from "react-icons/hi";
import { TextInput } from '@mantine/core';
import { Button } from '@mantine/core';
import { Input } from '@mantine/core';
import { MdDelete } from "react-icons/md";

function LocationView({ location, onEdit }: any) {
    return (
        <div className="locationEntry-static">
            <div className="locationEntry-info">
                <Checkbox defaultChecked color="red" />
                <div>{location.title}</div>
                <div />

                <div />
                <div> Kurzbez.: {location.identifier} </div>
                <div> Nr.: {location.number} </div>

                <div />
                <div> {location.address} </div>
                <div />
            </div>
            <div className="locationEntry-edit" onClick={onEdit}>
                <HiDotsVertical size={20} style={{ cursor: "pointer" }} />
            </div>
        </div>
    );
}

function LocationForm({ location, error, setLocation, onCancel, onSave, onDelete }: any) {
    return (
        <div className="locationEntry-editing">
            <div className="locationEntry-info-editing">

                <div />
                <TextInput
                    label="Titel"
                    error={error.title}
                    radius="xs"
                    variant="default"
                    placeholder="Titel"
                    value={location.title}
                    onChange={(e) => setLocation((prev: any) => ({ ...prev, title: e.target.value }))}
                />
                <div />

                <div />
                <TextInput
                    label="Kurzbezeichnung"
                    error={error.identifier}
                    radius="xs"
                    variant="default"
                    placeholder="Kurzbezeichnung"
                    value={location.identifier}
                    onChange={(e) => setLocation((prev: any) => ({ ...prev, identifier: e.target.value }))}
                />
                <TextInput
                    label="Kennnummer"
                    error={error.number}
                    radius="xs"
                    variant="default"
                    placeholder="Kennnummer"
                    value={location.number}
                    onChange={(e) => setLocation((prev: any) => ({ ...prev, number: e.target.value }))}
                />


                <div />
                <TextInput
                    label="Adresse"
                    error={error.address}
                    radius="xs"
                    variant="default"
                    placeholder="Adresse"
                    value={location.address}
                    onChange={(e) => setLocation((prev: any) => ({ ...prev, address: e.target.value }))}
                />
                <div />
            </div>
            <div className="locationEntry-actions">
                <Button variant="default" color="red" onClick={onCancel}>Abbrechen</Button>
                <Button color="green" onClick={onSave}>Speichern</Button>
                <MdDelete className="delete-icon" color="grey" size={23} onClick={onDelete} style={{ cursor: "pointer" }} />
            </div>
        </div>
    );
}

export default function LocationEntry() {

    const [location, setLocation] = useState({
        title: 'Leitstelle der Feuerwehr',
        identifier: 'LST',
        number: 'L',
        address: 'Hüttenstraße 68',
    });

    const [error, setError] = useState({
        title: '',
        identifier: '',
        number: '',
        address: '',
    });

    const [editLocation, setEditLocation] = useState({
        title: location.title,
        identifier: location.identifier,
        number: location.number,
        address: location.address,
    });

    const [isEditing, setIsEditing] = useState<boolean>(false);

    function resetError() {
        setError({
            title: '',
            identifier: '',
            number: '',
            address: '',
        });
    }

    function handleSave() {
        resetError();
        if (!editLocation.title) {
            setError((prev: any) => ({ ...prev, title: 'Titel darf nicht leer sein' }));
            return;
        }
        if (!editLocation.identifier) {
            setError((prev: any) => ({ ...prev, identifier: 'Kurzbezeichnung darf nicht leer sein' }));
            return;
        }
        if (!editLocation.number) {
            setError((prev: any) => ({ ...prev, number: 'Kennnummer darf nicht leer sein' }));
            return;
        }
        if (!editLocation.address) {
            setError((prev: any) => ({ ...prev, address: 'Adresse darf nicht leer sein' }));
            return;
        }
        setLocation(editLocation);
        setIsEditing(false);
    }

    function handleCancel() {
        resetError();
        setEditLocation(location);
        setIsEditing(false);
    }

    function handleDelete() {
        resetError();
        setIsEditing(false);
    }

    return (
        <div className="locationEntry-content">
            {isEditing ? (
                <LocationForm
                    error={error}
                    location={editLocation}
                    setLocation={setEditLocation}
                    onCancel={() => handleCancel()}
                    onSave={() => handleSave()}
                    onDelete={() => handleDelete()}
                />
            ) : (
                <LocationView location={location} onEdit={() => setIsEditing(true)} />
            )}
        </div>
    )
}
