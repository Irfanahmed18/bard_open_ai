import React, {useRef, useState} from "react";
import {Button, Input} from "@chakra-ui/react";
import postData from "../util/restUtils";

export default function Home() {
    const inputText = useRef("")
    const handleOnClick = () => {
        postData("http://localhost:3002/users",{prompt:inputText.current.value})
    }
    return (
        <>
            <Input placeholder='Basic usage' size={"md"} width={'50%'} ref={inputText}/>
            <div>
                <Button onClick={handleOnClick}>Click Me</Button>
            </div>

        </>
    );
}