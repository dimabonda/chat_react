 export function messageReducer (state = {}, {type, data, id}){
	// if(type === 'MSG'){
	// 	console.log(data);
	// 	console.log(id);
	// 	return {
	// 		...state, [id] : data.sort((a,b) => a.createdAt < b.createdAt ? -1 : 1)
	// 	}
		
	// // 	for(const value of data){
	// // 		newState = {
	// // 			...newState, 
	// // 			[value._id]:{...value}
	// // 		}
	// // 	}

	// // 	return {
	// // 		...state, [id] : {...state[id], messages: {...state[id].messages, ...newState}}
	// // 	}
	// }

	if(type === 'MSG'){
		
		let messages
		for(const value of data){
			messages = {
				...messages, 
			[value._id]:{...value}
			}
		}
		let newState = {
			...state, [id]: {...state[id], ...messages}
		}
		let arr = Object.entries(newState[id])
		arr.sort((a,b) => a[0] < b[0] ? 1 : -1)
		newState = {...newState, [id] : Object.fromEntries(arr)}
		return newState
	}
	if(type === 'CLEARMSG'){
		let newState = {...state};
		delete newState[data._id]
		return newState
	}

	return state
}