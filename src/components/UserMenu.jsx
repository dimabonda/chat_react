import { Accordion, AccordionDetails, AccordionSummary, Avatar, Button, Drawer, IconButton, List, ListItem, ListItemAvatar, Paper, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { connect } from 'react-redux';
import { Box } from '@mui/system';
import { backendURL, gql } from '../helpers/gql';
import { actionPromise } from '../actions/actionsPromise';
import React from 'react';
import {useDropzone} from 'react-dropzone';
import { useEffect} from 'react';
import { uploadFile } from '../helpers/uploadFile';




const actionUploadFile = (file) => 
actionPromise('file', uploadFile(file))

const actionUploadFiles = (files) => 
actionPromise('filesUpload', Promise.all(files.map((file) => uploadFile(file))))





const actionAddAvatar = (userId, avatarId) => 
actionPromise('avatar', gql(`mutation setAvatar($userId: ID, $avatarId: ID){
  UserUpsert(user:{_id: $userId, avatar: {_id: $avatarId}}){
      _id, avatar{
          _id
      }
  }
}`,{userId: userId, avatarId: avatarId}))






const actionSetAvatar = file => 
  async (dispatch, getState) => {
      const userId = getState().auth.payload.sub.id;
    //   console.log(userId)
      let data =  await dispatch(actionUploadFile(file));
      console.log(data._id)
      if (data._id){
         await dispatch(actionAddAvatar(userId, data._id))
      }
  }


    function DropZ({onLoad, nick, url}) {
        const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
    
        useEffect(()=>{
            console.log(acceptedFiles)
            acceptedFiles[0] && onLoad(acceptedFiles[0])
            
        }, [acceptedFiles])
    
        return (
          <section className="container">
            <div {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()} />
                
                <Avatar
                    alt={nick}
                    src={`${backendURL}/${url}`}
                    sx={{ width: 70, height: 70, mr: '20px'}}
                />
            </div>
            
          </section>
        );
      }
      
      <DropZ />
    const CDropZ = connect(null, {onLoad: actionSetAvatar})(DropZ)



const UserMenu = ({open, closeUserMenu, userInfo: {nick, avatar} }) => {
    let url = avatar?.url
    
	
	return (
		<Drawer 
			anchor='left'
			open={open}
			onClose={closeUserMenu}
		>

			<Paper sx={{width: '350px'}}>
			<Accordion>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon/>}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<CDropZ nick={nick} url={url}/>
					<br/>
					<Typography variant='h2' component="h4">{nick}</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<List>
					<ListItem>first</ListItem>
					<ListItem>first</ListItem>
					<ListItem>first</ListItem>
					</List>
				</AccordionDetails>
			</Accordion>
			</Paper>
			
		</Drawer>
	)
}

export default connect(state => ({userInfo: state.promise?.aboutMe?.payload || {}}))(UserMenu)