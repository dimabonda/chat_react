import { actionFullLogin } from '../actions/actionLogin';


import TextField from '@mui/material/TextField';
import { IconButton, InputAdornment, Typography  } from '@mui/material';
import {BrowserRouter as Router, Route, Link, Routes, Navigate} from 'react-router-dom';

import { useState, useEffect, useRef } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { connect } from 'react-redux';
import { history } from '../App';





function LoginForm({onLogin, }){

    const [values, setValues] = useState({
        login: '', 
        password: '',
        showPassword: false, 
        error: false
    })

    const [errorLogin, setErrorLogin] = useState(false);
    const [errorPass, setErrorPass] = useState(false);


    const validate = () => {
        values.login.length < 3 ? setErrorLogin(true) : setErrorLogin(false);
        values.password.length < 3 ? setErrorPass(true) : setErrorPass(false);
        values.password.length < 3 || values.login.length < 3 ? setValues({...values, error: true}) : setValues({...values, error: false})
        
    }


    const handleChange = (prop) => (event) => {
        setValues({...values, [prop] : event.target.value})
    }

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword
        })
    }


    return (
        <form className='LoginForm' noValidate autoComplete='off'>
            <Typography sx={{mb: '30px'}} variant='h4'>Вход</Typography>
			<TextField 
                error={errorLogin}
                sx={{width: '100%', mb: '30px'}} 
                required  
                label="Логин" 
                variant="outlined" 
                helperText="минимум 3" 
                value={values.login}
                autoFocus
                onChange={handleChange('login')}/>

            <TextField
                error={errorPass}
                sx={{width: '100%'}}
                helperText="минимум 3" 
                required  
                variant="outlined" 
                label="Пароль"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={(event) => event.preventDefault()}
                                edge="end"
                            >
                                {values.showPassword ? <VisibilityOff/> : <Visibility/>}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                
            />

            {/* {values.error && <div>неверный {errorLogin && <span>логин </span>}{errorPass && <span>пароль</span>}</div>} */}
            <Button 
            onClick={
                (e) => {
                    if (values.password.length >= 3 && values.login.length >= 3){
                         onLogin(values.login, values.password);
                    }
                }
            } 
            sx={{width: '200px', mt: '30px'}} 
            variant="contained">
                Войти
            </Button><br/>
            <Link className='RegisterBtn' to='/register'>Зарегистрироваться</Link>
		</form>
    )
}

export default connect(null, {onLogin: actionFullLogin})(LoginForm)