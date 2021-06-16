import React, {useCallback, useContext, useEffect, useState} from "react";
import {Link, useHistory} from 'react-router-dom'
import {Col, ListGroup, Row, Form, Card, Button, Alert} from "react-bootstrap";
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook";

export const Home = () => {
    const {loading, request} = useHttp()
    const [bar, setBar] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const auth = useContext(AuthContext)
    const history = useHistory()
    const [otherId, setOtherId] = useState(localStorage.getItem('otherId'))
    const [otherName, setOtherName] = useState(localStorage.getItem('otherName'))
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')

    const [users, setUsers] = useState([])

    const getUsers = useCallback(async () => {
        try{
            const fetched = await request('/api/auth/get-all-users', 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setUsers(fetched)

        } catch (e) {
        }
    }, [auth.token, request])

    const [chats, setChats] = useState([])
    useEffect(() => {
        getUsers()
    }, [getUsers])

    const getChats = useCallback(async () => {
        try{
            const fetched = await request('/api/chat/get-user-chats', 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setChats(fetched)

        } catch (e) {

        }
    }, [auth.token, request])

    useEffect(() => {
        getChats()
    }, [getChats])

    const filteredUsers = users.filter(user => {
        if(user._id != auth.userId) {
            return user.login.toLowerCase().includes(searchInput.toLowerCase())
        }
    })

    const getChatMessages = useCallback(async () => {
        try{
            const fetched = await request(`/api/chat/get-message?chatId=${localStorage.getItem('userChat')}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setMessages(fetched)

        } catch (e) {
        }
    }, [auth.token, request])

    useEffect(() => {
        getChatMessages()
    }, [getChatMessages])

    const [user,setUser] = useState('')


    const getUserData = useCallback(async () => {
        try{
            const fetched = await request(`/api/auth/get-user-data`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setUser(fetched)
        }
        catch (e) {

        }
    }, [auth.token, request])

    useEffect(() => {
        getUserData()
    }, [getUserData])


    const logoutHandler = event => {
        event.preventDefault()
        auth.logout()
        history.push('/login')
    }
    return(
        <>
            <Card className="mt-3">
                <Card.Header>{user.name} {user.surname} <p style={{float: 'right'}}>{user.login}</p></Card.Header>
            </Card>
            <Row className="mt-3">

                <Col xl={8}>
                    <Card id="chatWithUser" style={{display: `${localStorage.getItem('openChat') == 'true' ? 'block':'none'}`}}>
                        <Card.Header>
                            <div
                                className="closeChatBtn"
                                onClick={() => {
                                    localStorage.setItem('openChat', 'false')
                                    localStorage.removeItem('openChat')
                                    localStorage.removeItem('otherId')
                                    localStorage.removeItem('userChat')
                                    document.getElementById('chatWithUser').style.display = 'none'


                                }}
                            >
                                <svg style={{float: 'right'}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-x-lg" viewBox="0 0 16 16">
                                    <path
                                        d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/>
                                </svg>
                            </div>
                            <div>
                                {localStorage.getItem('otherName')}
                            </div>
                        </Card.Header>
                        <Card.Body style={{height: '700px'}}>
                            {
                                messages.map(message => {
                                    return(
                                        <Alert style={{height: '50px'}} variant={`${message.from == auth.userId ? 'success':'info'}`}>
                                                <p style={{float: `${message.from == auth.userId ? 'right':'left'}`}}>
                                                    {message.text}
                                                </p>
                                                <p style={{float: `${message.from == auth.userId ? 'left':'right'}`, fontSize: '10px'}}>
                                                    {message.regDateTime}
                                                </p>
                                        </Alert>
                                    )
                                })

                            }
                        </Card.Body>
                        <Card.Footer>
                            <Button
                                style={{float: 'right'}}
                                onClick={async (e) => {
                                    e.preventDefault()
                                    document.getElementById('messageInput').value = ""
                                    let body = {
                                        'message': message,
                                        'to': localStorage.getItem('otherId'),
                                        'chatId': localStorage.getItem('userChat'),
                                    }
                                    const fetched = await request('/api/chat/create-message', 'POST', body, {
                                        Authorization: `Bearer ${auth.token}`
                                    })
                                    let a = messages
                                    a.push(fetched)
                                    setMessages(a)
                                    await getUsers()
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                     className="bi bi-reply-fill" viewBox="0 0 16 16">
                                    <path
                                        d="M5.921 11.9 1.353 8.62a.719.719 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z"/>
                                </svg>
                            </Button>
                            <Form.Control onChange={e => {
                                setMessage(e.target.value)
                            }} id="messageInput" style={{width: '93%'}} type="text" placeholder="Write a message..." />
                        </Card.Footer>

                    </Card>
                </Col>
                <Col xl={4}>
                    <ListGroup>
                        <ListGroup.Item>
                            <div className="d-flex align-items-center">
                                <svg style={{cursor: 'pointer'}} xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
                                     className="bi bi-layout-text-sidebar-reverse" viewBox="0 0 16 16" onClick={() => {
                                    setBar(bar ? false : true)
                                }}>
                                    <path
                                        d="M12.5 3a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1h5zm0 3a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1h5zm.5 3.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 .5-.5zm-.5 2.5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1h5z"/>
                                    <path
                                        d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2zM4 1v14H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h2zm1 0h9a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5V1z"/>
                                </svg>
                                <Form.Control id="search-users" className="ml-2" type="text" placeholder="Искать.." onChange={e => setSearchInput(e.target.value)}/>
                            </div>
                            <Form.Text style={{textAlign: 'center'}}>поиск пользователей по логину</Form.Text>
                        </ListGroup.Item>
                        <Card style={{textAlign: 'center', display: `${bar ? 'block':'none'}`}}>
                            <Link style={{color: '#333', textDecoration: 'none'}} to="/settings">
                                <Card.Body className="settings">
                                    <div className="d-flex">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                                             className="bi bi-gear" viewBox="0 0 16 16">
                                            <path
                                                d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                                            <path
                                                d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                                        </svg>
                                        <Card.Text className="ml-3">Настройки</Card.Text>
                                    </div>
                                </Card.Body>
                            </Link>
                            <Card.Body className="logout" onClick={logoutHandler}>
                                <div className="d-flex" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                                         className="bi bi-box-arrow-in-left" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd"
                                              d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0v-2z"/>
                                        <path fill-rule="evenodd"
                                              d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
                                    </svg>
                                    <Card.Text className="ml-3">Выход</Card.Text>
                                </div>
                            </Card.Body>

                        </Card>
                        {
                            !loading && filteredUsers &&
                            filteredUsers.map(user => {
                                return(
                                    <div>
                                        <ListGroup.Item
                                            onClick={async (e) => {
                                                e.preventDefault()
                                                localStorage.setItem('otherId', `${user._id}`)
                                                localStorage.setItem('otherName', `${user.name}`)
                                                setOtherId(localStorage.getItem('otherId'))
                                                document.getElementById('search-users').value = ""
                                                setSearchInput('')
                                                let body = {
                                                    'id': localStorage.getItem('otherId')
                                                }
                                                const fetched = await request('/api/chat/create-chat', 'POST', body,{
                                                    Authorization: `Bearer ${auth.token}`
                                                })
                                                localStorage.setItem('userChat', `${fetched._id}`)
                                                document.location.reload()



                                            }}
                                            className="userSearchButton"
                                            style={{display: `${searchInput.length == 0 ? 'none':'block'}`}}
                                        >
                                            {user.name} {user.surname}
                                            <p style={{fontSize: '12px'}}>login: {user.login}</p>

                                        </ListGroup.Item>
                                    </div>
                                )
                            })
                        }
                        <Card style={{display: `${searchInput.length == 0 ? 'block':'none'}`, background: '#fff'}}>
                            <Card.Header>Ваши чаты</Card.Header>

                            {
                                chats && !loading &&
                                chats.map(chat => {
                                    let secondName = ""
                                    let creatorName = ""
                                    secondName += chat.secondUser.name + " " + chat.secondUser.surname
                                    creatorName += chat.chatCreator.name + " " + chat.chatCreator.surname

                                    return(
                                        <div onClick={() => {
                                            if(chat.chatCreator._id == auth.userId){
                                                setOtherName(chat.secondUser.name)
                                                setOtherId(chat.secondUser._id)
                                                localStorage.setItem('otherName', `${chat.secondUser.name}`)
                                                localStorage.setItem('otherId', `${chat.secondUser._id}`)
                                            }
                                            else {
                                                setOtherName(chat.chatCreator.name)
                                                setOtherId(chat.chatCreator._id)
                                                localStorage.setItem('otherName', `${chat.chatCreator.name}`)
                                                localStorage.setItem('otherId', `${chat.chatCreator._id}`)

                                            }
                                            document.location.reload()
                                            localStorage.setItem('openChat', 'true')
                                            document.getElementById('chatWithUser').style.display = 'block'

                                            localStorage.setItem('userChat', `${chat._id}`)
                                        }}>
                                            <Card.Body className="chatItem">
                                                <Card.Text>{chat.chatCreator._id == auth.userId ? secondName : creatorName}</Card.Text>
                                            </Card.Body>
                                        </div>
                                    )
                                })
                            }
                        </Card>
                    </ListGroup>
                </Col>
            </Row>
        </>
    )
}