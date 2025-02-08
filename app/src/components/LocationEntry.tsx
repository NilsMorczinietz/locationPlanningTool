import { useState } from 'react';
import './LocationEntry.css';
import { Checkbox } from '@mantine/core';
import { HiDotsVertical } from "react-icons/hi";

export default function LocationEntry() {

    const [title, setTitle] = useState<string>('Leitstelle der Feuerwehr');
    const [identifier, setIdentifier] = useState<string>('Kurzbez.: LST');
    const [number, setNumber] = useState<string>('Nr.: L');
    const [address, setAddress] = useState<string>('Hüttenstraße 68');

    return (
        <>
            <div className="locationEntry-content">
                <div className="locationEntry-info">
                    <div>
                        <Checkbox
                            defaultChecked={true}
                            color="red"
                        />
                    </div>
                    <div> {title} </div>
                    <div></div>

                    <div></div>
                    <div> {identifier} </div>
                    <div> {number} </div>

                    <div></div>
                    <div> {address} </div>
                    <div></div>
                </div>
                <div className="locationEntry-edit">
                    <HiDotsVertical size={20}/>
                </div>
            </div>
        </>
    )
}
