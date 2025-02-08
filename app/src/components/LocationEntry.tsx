import { useState } from 'react';
import './LocationEntry.css';
import { Checkbox } from '@mantine/core';
import { HiDotsVertical } from "react-icons/hi";
import { TextInput } from '@mantine/core';
import { Button } from '@mantine/core';
import { Input } from '@mantine/core';
import { MdDelete } from "react-icons/md";

export default function LocationEntry() {

    const [title, setTitle] = useState<string>('Leitstelle der Feuerwehr');
    const [identifier, setIdentifier] = useState<string>('Kurzbez.: LST');
    const [number, setNumber] = useState<string>('Nr.: L');
    const [address, setAddress] = useState<string>('Hüttenstraße 68');

    const [isEditing, setIsEditing] = useState<boolean>(false);

    function updateLocationEntry() {
        setIsEditing(false);
    }

    function cancleEditing() {
        setIsEditing(false);
    }

    return (
        <>
            {isEditing ? (
                <div>
                    <div className="locationEntry-content">

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <div className="locationEntry-info">
                                <div>
                                    <Checkbox
                                        defaultChecked={true}
                                        color="red"
                                    />
                                </div>
                                <div style={{ display: "flex", width: "100%" }}>
                                    <Input
                                        placeholder='Titel'
                                        value={title}
                                        onChange={(event) => setTitle(event.currentTarget.value)}
                                    />
                                </div>
                                <div></div>

                                <div></div>
                                <div>
                                    <TextInput
                                        placeholder='Kurzbezeichnung'
                                        value={identifier}
                                        onChange={(event) => setIdentifier(event.currentTarget.value)}
                                    />
                                </div>
                                <div>
                                    <TextInput
                                        placeholder='Kennnummer'
                                        value={number}
                                        onChange={(event) => setNumber(event.currentTarget.value)}
                                    />
                                </div>

                                <div></div>
                                <div>
                                    <TextInput
                                        placeholder='Addresse'
                                        value={address}
                                        onChange={(event) => setAddress(event.currentTarget.value)}
                                    />
                                </div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", gap: "10px", padding: "10px", alignItems:"center"}}>
                        <Button fullWidth variant="default" color="red" onClick={()=>cancleEditing()}>Abbrechen</Button>
                        <Button fullWidth color="green" onClick={()=>updateLocationEntry()}>Speichern</Button>
                        <MdDelete color='black' size={50} style={{marginLeft:"10px", marginRight:"10px"}}/>
                    </div>
                </div>

            ) : (
                <div className="locationEntry-content">
                    <div className="locationEntry-info">
                        <div>
                            <Checkbox
                                defaultChecked={true}
                                color="red"
                            />
                        </div>
                        <div>{title}</div>
                        <div></div>

                        <div></div>
                        <div> {identifier} </div>
                        <div> {number} </div>

                        <div></div>
                        <div> {address} </div>
                        <div></div>
                    </div>
                    <div className="locationEntry-edit" onClick={() => setIsEditing(true)}>
                        <HiDotsVertical size={20} style={{ cursor: "pointer" }} />
                    </div>
                </div>
            )}
        </>
    )
}
