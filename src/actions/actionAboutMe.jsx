import { actionPromise } from "./actionsPromise";
import { gql } from "../helpers/gql";
import { actionAddChats } from "../App";

export const actionFindUser = (_id) => (
    actionPromise('aboutMe', gql(`query findUserOne($q: String) {
       UserFindOne (query: $q){
          _id
          createdAt
          login
          nick
          avatar {
             _id
             url
          }
          chats {
             _id
             title
             createdAt
             lastModified
             lastMessage {
                text 
                createdAt
              }
          }
       }     
    }`, { 
          q: JSON.stringify([  {_id: _id}  ])
       }
    ))
 )

export const actionAboutMe = () => 
        async (dispatch, getState) => {
            const{auth} = getState();
            const id = auth?.payload?.sub?.id
            if(id){
                let user = await dispatch(actionFindUser(id))
                console.log(user)
                if (user){
                    dispatch(actionAddChats([...user.chats]));
                    
                }
            }
        } 