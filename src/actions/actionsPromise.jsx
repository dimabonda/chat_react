const actionPending             = name => ({type:'PROMISE',name, status: 'PENDING'})
const actionFulfilled = (name,payload) => ({type:'PROMISE',name, status: 'FULFILLED', payload})
const actionRejected  = (name,error)   => ({type:'PROMISE',name, status: 'REJECTED', error})
export const actionPromise = (name, promise) =>
	async (dispatch) => {
	
	dispatch(actionPending(name))
	try {
		let payload = await promise;
		dispatch(actionFulfilled(name, payload));
		
		return payload
	}
	catch(error){
		dispatch(actionRejected(name, error))
	}
}