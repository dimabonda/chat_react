export function chatReducer (state={}, {type, data, id}){
	if(type === 'CHATS'){


		let chats                               ////new chats

		for(const value of data){
			chats = {
				...chats, 
				[value._id]:{...value}
			}
		}

        let newState

        // if(Object.values(state).length == 1 && Object.values(state)[0].title === 'loading'){
        //     newState = {
        //         ...chats, [Object.keys(state)[0]] : {...chats[Object.keys(state)[0]],
        //              messages:{...chats[Object.keys(state)[0]]?.messages, ...Object.values(state)[0].messages }}
        //     }
        // }

        for (let prop in chats){
            newState = {
                ...newState, ...state, [prop] : {...state[prop], ...chats[prop]}
            }
        }

        // newState = {...state, ...chats}
        let arr = Object.entries(newState);
        arr.sort((a,b) => a[1].lastModified > b[1].lastModified ? -1 : 1)
		return {
			...Object.fromEntries(arr)
		}

	}

    if(type === 'MSG'){
        let newMessages
        for(const value of data){
			newMessages = {
				...newMessages, 
				[value._id]:{...value}
			}
		}
        // console.log(newState)
		return {
			...state, [id] : {...(state[id] || {_id: id, title: "loading"}),
             messages: Object.fromEntries(Object.entries({...(state[id]?.messages || {}), ...newMessages}).sort((a,b) => a[0] < b[0] ? 1 : -1))}
		}
	}
    

    	

	// if(type === 'CHATS'){
		
	// 	return [...state, ...data].sort((a,b) => a.lastModified > b.lastModified ? -1 : 1)

	// }

    // if(type === 'CHATS'){
	// 	let chats 

	// 	for(const value of data){
	// 		chats = {
	// 			...chats, 
	// 			[value._id]:{...value}
	// 		}
	// 	}
    //     let newState = {...state, ...chats}
    //     let arr = Object.entries(newState);
    //     arr.sort((a,b) => a[1].lastModified > b[1].lastModified ? -1 : 1)
	// 	return {
	// 		...Object.fromEntries(arr)
	// 	}

	// }

	if(type === 'LEFTCHAT'){
        let newState = {...state};
        let arr = Object.entries(newState);

        return {
            ...Object.fromEntries(arr.filter((chat) => chat[0] != data._id))
        }
	// 	// console.log(data);
	// 	// console.log(data._id);
	// 	return [...state].filter((chat) => chat._id !== data._id)
		 
	}

	// if (type === 'LASTMSG'){
	// 	let newState = [...state].filter((item) => item._id != data[0]._id);
	// 	return [...newState, ...data].sort((a,b) => a.lastModified > b.lastModified ? -1 : 1)
	// }

	// if(type === 'MSG'){
	// 	let newState = [...state];

	// 	let currindex = newState.findIndex((item) => item._id === id)
		
	// 	const arr = newState.map((obj, index) =>{
	// 		if(index == currindex){
	// 			return ({...obj, messages: data})
	// 		}
	// 		return obj
	// 	})
	// 	return arr
		
	


	return state 
}