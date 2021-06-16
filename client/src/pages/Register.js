import React, {useContext, useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";

export const Register = () => {

    const auth = useContext(AuthContext)

    const {loading, request} = useHttp()

    const [form, setForm] = useState({
        name: '',
        surname: '',
        login: '',
        password: '',
        regDateTime: ''
    })

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        try{
            const register = await request('/api/auth/register', 'POST', {...form})
            if(register.message != "Такой пользователь уже существует"){
                const data = await request('/api/auth/login', 'POST', {...form})
                auth.login(data.token, data.userId)
            }

        }catch (e) {
        }
    }

    let reg_pass = document.getElementById('reg_pass')
    let showPass = document.getElementById('showPass')
    let hidePass = document.getElementById('hidePass')

    const showPassword = () => {
        if(reg_pass.type == "password" && hidePass.style.display == 'none'){
            reg_pass.type = "text"
            hidePass.style.display = 'block'
            showPass.style.display = 'none'
        }
    }

    const hidePassword = () => {
        if(reg_pass.type == "text"){
            reg_pass.type = "password"
            hidePass.style.display = 'none'
            showPass.style.display = 'block'
        }
    }
    return(
        <>
            <div className="auth_form">
                <h1 style={{textAlign: 'center'}}>Register</h1>
                <Form className="p-3">
                    <Form.Group>
                        <Form.Label>Имя</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Введите имя"
                            name="name"
                            onChange={changeHandler}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Фамилия</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Введите фамилию"
                            name="surname"
                            onChange={changeHandler}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Login</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Введите login"
                            onChange={changeHandler}
                            name="login"
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Пароль</Form.Label>
                        <div className="d-flex">
                            <Form.Control
                                id="reg_pass"
                                type="password"
                                placeholder="Введите пароль"
                                onChange={changeHandler}
                                name="password"
                                style={{width: '95%'}}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor"
                                 className="bi bi-eye ml-2" viewBox="0 0 16 16" style={{display: 'none', cursor: 'pointer'}} id="hidePass" onClick={hidePassword}>
                                <path
                                    d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                <path
                                    d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor"
                                 className="bi bi-eye-slash ml-2" viewBox="0 0 16 16" style={{display: 'block', cursor: 'pointer'}} id="showPass" onClick={showPassword}>
                                <path
                                    d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                                <path
                                    d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                                <path
                                    d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                            </svg>
                        </div>
                    </Form.Group>



                    <Form.Group className="d-flex justify-content-center">
                        <Button
                            className="reg_button"
                            variant="primary"
                            type="submit"
                            onClick={registerHandler} disabled={loading}
                            style={{justifyContent: 'space-between'}}
                        >
                            Зарегистрироваться
                        </Button>
                    </Form.Group>
                    <Form.Group className="d-flex justify-content-center">
                        <p style={{margin: '0', color: '#333'}}>Уже есть аккаунт?</p>
                        <a className="ml-2" href="/sign" style={{color: '#333'}}>Войти</a>
                    </Form.Group>
                </Form>
            </div>
        </>
    )
}