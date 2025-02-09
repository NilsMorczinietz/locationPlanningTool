import React from 'react'
import { ActionIcon } from '@mantine/core';

import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import { IoMdCompass } from "react-icons/io";

export default function MapControls() {
    return (
        <div style={{ position: "absolute", bottom: "0", right: "0", margin: "30px", backgroundColor: "" }}>
            <ActionIcon.Group orientation="vertical">
                <ActionIcon variant="default" size="lg" aria-label="Gallery">
                    <FiPlus size={20} color="black"/>
                </ActionIcon>

                <ActionIcon variant="default" size="lg" aria-label="Settings">
                    <FiMinus size={20} color="black" />
                </ActionIcon>

                <ActionIcon variant="default" size="lg" aria-label="Likes">
                    <IoMdCompass size={20} color="black" />
                </ActionIcon>
            </ActionIcon.Group>
        </div>
    )
}
