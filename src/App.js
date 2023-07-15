import './App.css';
import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    ChakraProvider,
    Container,
    Flex,
    Heading,
    Input, InputGroup,
    InputRightElement,
    ListItem,
    UnorderedList
} from "@chakra-ui/react";
import Home from "./home/Home";
import {AddIcon, ArrowForwardIcon, ArrowRightIcon} from "@chakra-ui/icons";


function App() {
    const [value, setValue] = useState(null)
    const [message, setMessage] = useState(null)
    const [previousChats, setPreviousChats] = useState([])
    const [currentTitle, setcurrentTitle] = useState(null)

    useEffect(() => {
        if (!currentTitle && value && message) {
            setcurrentTitle(value)
        }
        if (currentTitle && value && message) {
            setPreviousChats(previousChats => (
                [...previousChats,
                    {
                        title: currentTitle,
                        role: "User",
                        content: value
                    },
                    {
                        title: currentTitle,
                        role: "Assistant",
                        content: message.content
                    }]
            ))
        }
    }, [message, currentTitle])

    const getMessages = async () => {
        const options = {
            method: "POST",
            body: JSON.stringify(
                {
                    message: value
                }
            ),
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await fetch("http://localhost:3002/completion", options)
            const data = await response.json()
            const responseMessage = data.body.choices[0].message
            setMessage(responseMessage)
        } catch (err) {
            console.error(err)
        }
    }

    const createNewChat = () => {
        setMessage(null)
        setValue("")
        setcurrentTitle(null)
    }

    const handleHistoryClick = (title) => {
        setcurrentTitle(title)
    }

    const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
    const uniqueChat = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))

    return (
        <ChakraProvider>
            <Flex className={"app"}>
                <Flex className={"side-bar"} direction={"column"} justify={"space-between"}
                      sx={{backgroundColor: "#202123", height: "100vh", width: "250px"}}>
                    <Button onClick={createNewChat} colorScheme={"white"} variant={"outline"} margin={"10px"} leftIcon={<AddIcon/>}>New
                        Chat</Button>
                    <Box margin={"5px"} borderBottom={"1px"} textAlign={"center"}>History</Box>
                    <UnorderedList margin={"10px"} padding={"10px"} height={"100%"} listStyleType={"none"}>
                        {uniqueChat.map((title, idx) => (
                            <ListItem onClick={() => handleHistoryClick(title)}  margin={"10px 2px"}
                                      padding={"5px"} border={"solid 1px"}  borderRadius={"5px"} cursor={"pointer"} key={idx}>{title}</ListItem>
                        ))}
                    </UnorderedList>
                    <Box style={{borderTop: "solid 1px white"}} padding={"10px"} margin={"10px"}
                         className={"navigation"}>
                        Made By Irfan
                    </Box>
                </Flex>
                <Flex className={"main"} direction={"column"} alignItems={"center"} justifyContent={"space-between"}
                      sx={{height: "100vh", width: "100%"}}>
                    {!currentTitle && <Heading as={"h2"}>GPT Clone</Heading>}
                    <Flex height={"100%"} overflow={"scroll"} width={"100%"}>
                        <UnorderedList width={"100%"}>
                            {currentChat.map((chatMessage, idx) => (
                                <ListItem fontSize={"14px"} display={"flex"} backgroundColor={"#444654"}
                                          padding={"20px"} margin={"20px"} borderRadius={"5px"} key={idx}>
                                    <Box color={"rgba(255, 255, 255, 0.8)"} textAlign={"left"}>{chatMessage.role}: {" "}</Box>
                                    <Box color={"rgba(255, 255, 255, 0.8)"} textAlign={"left"} >{chatMessage.content}</Box>
                                </ListItem>
                            ))}
                        </UnorderedList>
                    </Flex>
                    <Flex width={"100%"} maxWidth={"650px"}>
                        <InputGroup  margin={"20px"}>
                            <Input value={value} onChange={e => setValue(e.target.value)}
                                   backgroundColor={"rgba(255,255,255,0.05)"} focusBorderColor={"none"}
                                   border={"none"}/>
                            <InputRightElement>
                                <ArrowForwardIcon onClick={getMessages} cursor={"pointer"}/>
                            </InputRightElement>
                        </InputGroup>
                    </Flex>
                    <Box padding={"10px"} margin={"10px"}>
                        A clone of Chat GPT made with React And Chakra UI
                    </Box>
                </Flex>
            </Flex>
        </ChakraProvider>
    )
        ;
}

export default App;
