import { actionPromise } from "./actionsPromise";
import { gql } from "../helpers/gql";
import { history } from '../App';
import { actionAboutMe } from "./actionAboutMe";

export const socket = window.io("ws://chat.fs.a-level.com.ua")


const actionAuthLogin = (token) => ({type: 'AUTH_LOGIN', token});
export const actionAuthLogout = () => ({type: 'AUTH_LOGOUT'});

export const actionFullLogin = (log, pass) => 
async (dispatch) => {
	let token = await dispatch(
	  actionPromise('login', gql(`query login($login: String, $password: String) {
	  login(login: $login, password: $password)
	  }`, {login: log, password: pass}))
  )
  if(token){
	  socket.emit('jwt', token)
	  dispatch(actionAuthLogin(token))
	  history.push("/");
	  
  }
  return token
}