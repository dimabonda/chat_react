const getGQL = url =>
(query, variables) => fetch(url, {
    method: 'POST',
    headers: {
        "Content-Type": "application/json",
        // 'Accept' : 'application/json',
        ...(localStorage.authToken ? {"Authorization": "Bearer " + localStorage.authToken} : {})
    },
    body: JSON.stringify({query, variables})
}).then(res => res.json())
    .then(data => {
        if (data.data){
            return Object.values(data.data)[0] 
        } 
        else throw new Error(JSON.stringify(data.errors))
    })

export const backendURL = 'http://chat.fs.a-level.com.ua';
export const gql = getGQL(backendURL + '/graphql');