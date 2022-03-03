import { actionPromise } from "./actionsPromise";
import { gql } from "../helpers/gql";



export const actionGetAllChats = (userId) => (
    actionPromise('getAllChats', gql(`query getAll($q: String){
       ChatFind (query: $q){
             _id
             title
             avatar {
                _id
                url
             }
             
             members {
                _id
                login
                avatar {
                   _id
                   url
                }
             }
             lastModified
       }         
    }`, { 
          q: JSON.stringify([ { 'members._id': userId } ])
          }
    ))
 )