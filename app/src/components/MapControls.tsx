import React from 'react'
import { ActionIcon } from '@mantine/core';

import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import { IoMdCompass } from "react-icons/io";

export default function MapControls() {
    return (
        <div style={{ position: "absolute", bottom: "0", right: "0", margin: "30px", backgroundColor: "" }}>
            <ActionIcon.Group orientation="vertical">
                <ActionIcon variant="filled" color="rgb(10, 10, 10)" radius="xs" size="lg" aria-label="zoomIn">
                    <FiPlus size={20} color="white"/>
                </ActionIcon>

                <ActionIcon variant="filled" color="rgb(10, 10, 10)" radius="xs" size="lg" aria-label="zoomOut">
                    <FiMinus size={20} color="white" />
                </ActionIcon>

                <ActionIcon variant="filled" color="rgb(10, 10, 10)" radius="xs" size="lg" aria-label="zoomOut">
                    <IoMdCompass size={20} color="white" />
                </ActionIcon>
            </ActionIcon.Group>
        </div>
    )
}
