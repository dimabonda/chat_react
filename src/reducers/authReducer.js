const jwtDecode = token => {
	try{
		return JSON.parse(atob(token.split('.')[1]));
		
	}
	catch(e){
		console.log(e.name, e.message);
	}
  }
  
export function authReducer(state, {type, token}){                                 
    if (state === undefined){
        if(localStorage.authToken){
            type = 'AUTH_LOGIN';
            token = localStorage.authToken
        }
    }
    if(type === 'AUTH_LOGIN'){
        let payload = jwtDecode(token);
        if (payload){
            localStorage.authToken = token
                return {token, payload}
        }       
    } 
    if(type === 'AUTH_LOGOUT'){
        localStorage.removeItem("authToken")
        return {}
    } 
    return state || {}
}