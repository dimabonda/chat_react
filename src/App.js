import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { Provider,connect } from 'react-redux';
import './App.scss';
import { backendURL, gql } from './helpers/gql';
import { useEffect, useState, useRef } from 'react';
import { authReducer } from './reducers/authReducer';
import {promiseReducer } from './reducers/promiseReducer';
import React, { Component } from 'react';
import {Router, Route, Link,  Navigate, Switch, Redirect} from 'react-router-dom';
import { createBrowserHistory } from 'history'


import LoginForm from './components/LoginForm';
import { actionAuthLogout } from './actions/actionLogin';

import { actionPromise } from './actions/actionsPromise';
import { socket } from './actions/actionLogin';
import { actionAboutMe } from './actions/actionAboutMe';
import SearchAppBar from './components/AppBar';
import UserMenu from './components/UserMenu';
import {Avatar, Grid, List, ListItem} from '@mui/material';
import { messageReducer } from './reducers/messageReducer';
import {chatReducer} from './reducers/chatReducer';

// import { uploadFile } from '../helpers/uploadFile';

export const history = createBrowserHistory();




// function DropZMessage({onLoad, nick, url}) {
// 	const {acceptedFiles, getRootProps, getInputProps} = useDropzone();

// 	useEffect(()=>{
// 		console.log(acceptedFiles)
// 		acceptedFiles[0] && onLoad(acceptedFiles[0])
		
// 	}, [acceptedFiles])

// 	return (
// 		<div className="DropZMessage">
// 			<div {...getRootProps({className: 'dropzone'})}>
// 				<input {...getInputProps()} />
// 			</div>
// 		</div>
// 	);
//   }
  
//   <DropZ />



export const actionAddChats = (data) => ({type: 'CHATS', data})
const actionAddChat = (chat) => ({type: 'CHATS', data: [chat]})

const actionAddMessages = (data, id) => ({type: 'MSG', data, id});
const actionAddMessage = (message, id) => ({type: 'MSG', data: [message], id});
const actionClearMessage = (data) => ({type: 'CLEARMSG', data})

const actionAddLastMessage = (chat) => ({type: 'LASTMSG', data: [chat]})

const actionLeftChat = (data) => ({type: 'LEFTCHAT', data})
const actionFindChat = () => 
actionPromise('Chat', gql(`query FindChat($q: String) {
	MessageFind(query: $q) {
	  _id  text
	  
	}
  }`, {q: JSON.stringify([{}])}))

const actionCreateChat = () => 
actionPromise('newChat', gql(`mutation createChat($chat: ChatInput) {
	ChatUpsert(chat: $chat) {
	  _id
	  members {
		_id
		login
	  }
	}
  }`, ))


// const actionFindChatsByUserId = (_id) => 
// actionPromise('chatsByUserId', gql(`query findUserOne($q1: String) {
// 	UserFindOne(query: $q1) {
// 	  nick
// 	  login
// 	  _id
// 	  chats {
// 		_id
// 		lastMessage {
// 			text
// 			createdAt
// 		  }
// 	  }
	  
// 	}
//   }`, {q1: JSON.stringify([{_id}])}))


// export const actionGetFullInfo = (_id) => 
//  	async dispatch => {
// 		 let user = await dispatch(
// 			 actionFindChatsByUserId(_id)
// 		 )
// 		 if(user){
// 			//  console.log(user.chats)
// 			 dispatch(actionAddChats([...user.chats]))
// 		 }
// 	 }



export const actionGetMessageForChat = (_id) => 
	async (dispatch,getState) => {
		let messages = await dispatch(
			actionPromise('messages', gql(`query FindMessChat($chat: String) {
				MessageFind(query: $chat) {
				  _id
				  text
				  createdAt
				  owner {
					nick
					avatar {
					  url
					}
				  }
				}
			  }`, {chat: JSON.stringify([{"chat._id": _id}, {sort: [{_id: -1}]}])}))
		)
		if(messages){
			//getState().

			dispatch(actionAddMessages([...messages], _id))
		}
	}
const actionGetOneChat = (_id) => 
	async dispatch => {
		let chat = await dispatch(
			actionPromise('oneChat', gql(`query findChatById($chatId: String) {
				ChatFindOne(query: $chatId) {
				  _id
				  title
				  lastModified
				  lastMessage {
					text
					createdAt
				  }
				}
			  }`, {chatId: JSON.stringify([{_id}])}))
		)
		if(chat){
			// dispatch(actionAddChat(chat))
			console.log(chat)
		}
	}

const actionSentOrUpdateMSG = (chatId, text, msgId) => 
	actionPromise('updateMSG', gql(`mutation MessageUpsert($message: MessageInput) {
		MessageUpsert(message: $message) {
		  _id
		  createdAt
		  text
		  owner {
			nick
			avatar {
			  url
			}
		  }
		  chat{
			_id
		  }
		}
	  }`, {
		  message : {
			  _id: msgId,
			  chat: {_id: chatId},
			  text
		  }
	  }))

const store = createStore(combineReducers({promise: promiseReducer, auth: authReducer, chats: chatReducer}), applyMiddleware(thunk))
console.log(store.getState())
store.subscribe(() => console.log(store.getState()));
// store.dispatch(actionFindChat())
// store.dispatch(actionAuthLogout())

// store.dispatch(actionGetFullInfo("6200314536a19525919c0402")) //////////////полная инфа после логина 

// let newChat = {_id: '620214de36a1952', title: 'newc2', messages: null}
// let newChat2  = {_id: '620214de36a19523', title: 'newc2', messages: null}
// store.dispatch(actionAddChat(newChat))
// store.dispatch(actionAddChat(newChat2))            //один чат с сокета

if (localStorage.authToken) socket.emit('jwt', localStorage.authToken)

socket.on('jwt_ok',   data => console.log(data))
socket.on('jwt_fail', error => console.log(error))
socket.on('msg', msg => {console.log(msg); store.dispatch(actionAddMessage(msg, msg.chat._id)); store.dispatch(actionAddChat(msg.chat))})
socket.on('chat', chat => {console.log(chat); store.dispatch(actionAddChat(chat))})
socket.on('chat_left', data => {console.log(data); store.dispatch(actionLeftChat(data)); });

// socket.on("connect", () => {
// 	console.log(socket.id)
// })
// socket.disconnect(true)
// socket.connect()




const Message = ({mes}) => {
	return (
		<div className='Message'>
			<div>{mes.text}</div>
			<div>{mes.createdAt}</div>
		</div>
	)
}

const WrapperPageChat = ({children}) => {
	return (
		<div className='WrapperPageChat'>{children}</div>
	)
} 

const InputMessage = ({onclick, chatId}) => {

	const [inputValue, setValue] = useState('')

	return (
		<div className='InputMessage'>
			<input value={inputValue} onChange={(e) => setValue(e.target.value)} type="text"/>	
			<button onClick={() => onclick(chatId, inputValue)}>Отправить</button>
		</div>
	)
}

const CInputMessage = connect(null, {onclick: actionSentOrUpdateMSG})(InputMessage)

const PageChat = ({chats, chatId}) => {
	
	// console.log(chats[chatId].messages)
	const messagesByChat = Object.values(chats[chatId]?.messages || {})
	return (
		<div className='PageChat'>
			{messagesByChat.map((item) => <Message key={item._id} mes={item}/>)}
		</div>
	)
}

const CPageChat = connect(state=>({chats: state.chats || {}}))(PageChat)


const ChatGetData = ({match:{params:{_id}}, getData}) => {
	useEffect(() => {
		getData(_id)
	}, [_id])

	return (
		<WrapperPageChat>
			
			<CPageChat chatId={_id}/>
			<CInputMessage chatId={_id}/>
		</WrapperPageChat>
	)
}

const CChatGetData = connect(null, {getData: actionGetMessageForChat})(ChatGetData)

const ChatItem = ({chat, handleSet, activeElementId}) => {
	
	return (
			<ListItem  className='ChatItem' onClick={() => handleSet(chat._id)}>
				<Link className='ChatItem-Link' style={{display: 'flex', textDecoration: 'none', padding: '10px', backgroundColor: 'rgb(245, 245, 245)'}}  to={`/main/${chat._id}`}>
					<div>
						<Avatar
							alt={chat.title}
							// src={`${backendURL}/${chat}`}
							sx={{ width: 50, height: 50, mr: '20px'}}
						/>
					</div>
					<div>
						<div >{chat.title}</div>
						<div>{chat.lastMessage?.text || 'пусто'}</div>
					</div>
				</Link> 
			</ListItem>
	)
}

const Chats = ({chats}) => {

	let [stateId, setStateId] = useState(null)

	useEffect(() => {
		console.log(stateId)
	},[stateId])

	

	let chatsArr = Object.values(chats)
	return (
		<div className='Chats'>
			<List sx={{p: '0'}}>
				{chatsArr.map((item, index) => <ChatItem key={item._id} activeElementId={stateId} chat={item} handleSet={setStateId}/>)}
			</List>
		</div>
	)
}

const CChats = connect(state => ({chats: state.chats || []}))(Chats)


const Aside = () => {
	const [isOpen, setOpen] = useState(false);
	
	return (
		<aside className='Aside'>
			<SearchAppBar openUserMenu={() => setOpen(true)}/>
			<CChats/>
			<UserMenu open={isOpen} closeUserMenu={() => setOpen(false)}/>
		</aside>
	)
}

const BackgroundPage = ({children}) => 
	<div className='BackgroundPage'>{children}</div> 

const Alert = () => 
<div>нет чата</div>

const Main = () => {
	
useEffect(() => {
	store.dispatch(actionAboutMe())
},[])

	return(
		<main className='Main'>
			<Grid container columns={12}>
				<Grid item xs={4} >
					<Aside/>
				</Grid>
				<Grid item xs={8}>
					<BackgroundPage>
						<Switch>
							<Route path="/main/delete" exact component={Alert}/>
							<Route path="/main/:_id" exact component={CChatGetData}/>
						</Switch>
					</BackgroundPage>
				</Grid>
			</Grid>
		</main>
	)	
	
}

const AllRoutes = ({auth}) => {
	return (
				<Switch>
					<Route path="/login" component={LoginForm} />
					<Route path="/main" component={Main} />
					{/* <Route exact path="/">{auth ? <Redirect to="/main"/> : <Redirect to="/login" /> }</Route> */}
				</Switch>
	)
}

const CAllRoutes = connect(state => ({auth : state.auth?.payload}))(AllRoutes)




function App() {
	
  return (
	<Router history={history}>
		<Provider store={store}>
			<div className="App">
				
				<CAllRoutes />
			</div>
			<button onClick={()=> store.dispatch(actionAuthLogout())}>выйти</button>
			<button >click</button>
			
		</Provider>
 	</Router>
  );
}

export default App;










// по промису чатов делать акшончат