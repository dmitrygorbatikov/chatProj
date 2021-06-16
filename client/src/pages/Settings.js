import React, {useCallback, useContext, useEffect, useState} from "react"
import {Button, Form, InputGroup, Row, Col, Card, Toast} from "react-bootstrap";
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook";
import {Loader} from "../components/Loader";
import {useHistory} from "react-router-dom";

export const Settings = () => {
    const [show, setShow] = useState(false);
    const history = useHistory()
    const auth = useContext(AuthContext)
    const {loading, request} = useHttp()

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

    const [name,setName] = useState(user.name)
    const [surname,setSurname] = useState(user.surname)
    const [login,setLogin] = useState(user.login)
    const [oldPassword,setOldPassword] = useState('')
    const [newPassword,setNewPassword] = useState('')



    const [message, setMessage] = useState()

    const updateUserData = async () => {
        try{
            let body = {
                'password': oldPassword,
                'newPassword': newPassword,
                'login': login,
                'name': name,
                'surname': surname
            }
            const fetched = await request('/api/auth/update-user-data', 'PATCH', body, {
                Authorization: `Bearer ${auth.token}`
            })
            setMessage(fetched)
            setShow(true)
        }
        catch (e) {
        }
    }
    if(loading){
        return <Loader/>
    }



    return(
        <>

            <Row>
                <Col xs={12}>
                    <Toast style={{float: 'right'}} onClose={() => setShow(false)} show={show} delay={3000} autohide>
                        <Toast.Header>
                            <strong className="mr-auto">Изменение профиля</strong>
                        </Toast.Header>
                        {!loading && message && show &&
                            <Toast.Body>{message.message}</Toast.Body>
                        }
                    </Toast>
                </Col>
            </Row>
            <Card className="mt-3">
                <Card.Header>Редактирование профиля</Card.Header>
            </Card>

            <Form className="mt-3">
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="validationCustom01">
                        <Form.Label>Имя</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Имя"
                            defaultValue={user.name}
                            onChange={e => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="6" controlId="validationCustom02">
                        <Form.Label>Фамилия</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Фамилия"
                            defaultValue={user.surname}
                            onChange={e => setSurname(e.target.value)}
                        />
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                        <Form.Label>Login</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Login"
                            defaultValue={user.login}
                            onChange={e => setLogin(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Старый пароль</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="Введите старый пароль"
                            onChange={e => setOldPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Новый пароль</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="Введите новый пароль"
                            onChange={e => setNewPassword(e.target.value)}
                        />
                    </Form.Group>
                </Row>
                <Button variant="success" style={{float: 'right'}} onClick={updateUserData}>Сохранить изменения</Button>
                <Button variant="warning" onClick={() => {
                    history.push('/')
                }}>Назад</Button>
            </Form>
        </>
    )
}