import { TextField, Stack, Typography, Button, MenuItem, FormControl, Select, Menu, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState, useContext } from 'react';
import collectionContext from '../../hooks/collection.stm';
import Text from './Text'
const LabelStyle = styled(Typography)(({ theme }) => ({
	...theme.typography.body2,
	width: 140,
	fontSize: 13,
	flexShrink: 0,
	color: theme.palette.text.secondary,
}));

var relationTypes={
    "integer":["OneToOne","OneToMany"],
    "Array":["ManyToMany","ManyToOne"],
    "Object":["OneToOne","OneToMany"]
}
// function OneToOne() {
// 	return (
// 		<SvgIcon>
// 			<path
// 				fillRule="evenodd"
// 				clipRule="evenodd"
// 				d="M7.128 12.321a3.601 3.601 0 110-1.44H18.72v-2.4L24 11.6l-5.28 3.12v-2.4H7.128zM6 11.6a2.4 2.4 0 11-4.8 0 2.4 2.4 0 014.8 0z"
// 				fill="#212134"
// 			/>
// 		</SvgIcon>
// 	);
// }
function OneToOne() {
	return (
		<SvgIcon>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3.6 14a2.4 2.4 0 100-4.8 2.4 2.4 0 000 4.8zm0 1.2a3.6 3.6 0 100-7.2 3.6 3.6 0 000 7.2zM20.4 14a2.4 2.4 0 100-4.8 2.4 2.4 0 000 4.8zm0 1.2a3.6 3.6 0 100-7.2 3.6 3.6 0 000 7.2z"
				fill="#212134"
			/>
			<path d="M6.24 10.881H18v1.44H6.24v-1.44z" fill="#212134" />
		</SvgIcon>
	);
}
function OneToMany() {
	return (
		<SvgIcon>
			<path d="M6.24 11.28H18v1.44H6.24v-1.44z" fill="#212134" />
			<path
				d="M5.871 10.699l8.347-6.176.86 1.162-8.347 6.177-.86-1.163zM5.899 13.354l8.346 6.176.864-1.167-8.347-6.176-.863 1.167z"
				fill="#212134"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3.6 14.399a2.4 2.4 0 100-4.8 2.4 2.4 0 000 4.8zm0 1.2a3.6 3.6 0 100-7.2 3.6 3.6 0 000 7.2zM20.4 14.399a2.4 2.4 0 100-4.8 2.4 2.4 0 000 4.8zm0 1.2a3.6 3.6 0 100-7.2 3.6 3.6 0 000 7.2zM16.8 22.8a2.4 2.4 0 100-4.8 2.4 2.4 0 000 4.8zm0 1.2a3.6 3.6 0 100-7.2 3.6 3.6 0 000 7.2zM16.8 6a2.4 2.4 0 100-4.8 2.4 2.4 0 000 4.8zm0 1.2a3.6 3.6 0 100-7.2 3.6 3.6 0 000 7.2z"
				fill="#212134"
			/>
		</SvgIcon>
	);
}
function ManyToOne() {
	return (
		<SvgIcon>
			<path d="M17.76 11.28H6v1.44h11.76v-1.44z" fill="#212134" />
			<path
				d="M18.129 10.699L9.782 4.523l-.86 1.162 8.347 6.177.86-1.163zM18.101 13.354L9.755 19.53l-.864-1.167 8.347-6.176.863 1.167z"
				fill="#212134"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M20.4 14.399a2.4 2.4 0 110-4.8 2.4 2.4 0 010 4.8zm0 1.2a3.6 3.6 0 110-7.2 3.6 3.6 0 010 7.2zM3.6 14.399a2.4 2.4 0 110-4.8 2.4 2.4 0 010 4.8zm0 1.2a3.6 3.6 0 110-7.2 3.6 3.6 0 010 7.2zM7.2 22.8a2.4 2.4 0 110-4.8 2.4 2.4 0 010 4.8zm0 1.2a3.6 3.6 0 110-7.2 3.6 3.6 0 010 7.2zM7.2 6a2.4 2.4 0 110-4.8 2.4 2.4 0 010 4.8zm0 1.2a3.6 3.6 0 110-7.2 3.6 3.6 0 010 7.2z"
				fill="#212134"
			/>
		</SvgIcon>
	);
}
function ManyToMany() {
	return (
		<SvgIcon>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M20.4 14.4a2.4 2.4 0 100-4.8 2.4 2.4 0 000 4.8zm0 1.2a3.6 3.6 0 100-7.2 3.6 3.6 0 000 7.2zM3.6 14.4a2.4 2.4 0 100-4.8 2.4 2.4 0 000 4.8zm0 1.2a3.6 3.6 0 100-7.2 3.6 3.6 0 000 7.2zM20.4 22.8a2.4 2.4 0 100-4.8 2.4 2.4 0 000 4.8zm0 1.2a3.6 3.6 0 100-7.2 3.6 3.6 0 000 7.2zM20.4 6a2.4 2.4 0 100-4.8 2.4 2.4 0 000 4.8zm0 1.2a3.6 3.6 0 100-7.2 3.6 3.6 0 000 7.2z"
				fill="#212134"
			/>
			<path d="M6.24 11.28H18v1.44H6.24v-1.44z" fill="#212134" />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3.6 22.8a2.4 2.4 0 110-4.8 2.4 2.4 0 010 4.8zm0 1.2a3.6 3.6 0 110-7.2 3.6 3.6 0 010 7.2zM3.6 6a2.4 2.4 0 110-4.8 2.4 2.4 0 010 4.8zm0 1.2a3.6 3.6 0 110-7.2 3.6 3.6 0 010 7.2z"
				fill="#212134"
			/>
			<path
				d="M18.328 13.863L6.49 19.765l-.652-1.307 11.838-5.902.652 1.307zM18.358 10.078L6.398 4.115l-.646 1.294 11.961 5.963.645-1.294z"
				fill="#212134"
			/>
			<path
				d="M18.323 18.83L6.252 12.813l-.643 1.29 12.071 6.019.643-1.29zM18.136 5.228L6.207 11.176l-.653-1.311 11.928-5.948.654 1.311z"
				fill="#212134"
			/>
		</SvgIcon>
	);
}
// function OneToMany() {
// 	return (
// 		<SvgIcon>
// 			<path
// 				fillRule="evenodd"
// 				clipRule="evenodd"
// 				d="M3.6 14.132a2.4 2.4 0 100-4.8 2.4 2.4 0 000 4.8zm0 1.2a3.6 3.6 0 100-7.2 3.6 3.6 0 000 7.2z"
// 				fill="#212134"
// 			/>
// 			<path d="M6.24 11.011h13.44v1.44H6.24v-1.44z" fill="#212134" />
// 			<path
// 				d="M5.872 10.43l8.347-6.176.86 1.163-8.347 6.176-.86-1.162zM5.9 13.087l8.346 6.177.864-1.168-8.347-6.176-.864 1.167zM18.72 8.613l5.28 3.12-5.28 3.12v-6.24z"
// 				fill="#212134"
// 			/>
// 			<path
// 				d="M12.72 2.633L18.82 2 16.43 7.649 12.72 2.633zM12.72 21.307l6.1.633-2.389-5.649-3.711 5.016z"
// 				fill="#212134"
// 			/>
// 		</SvgIcon>
// 	);
// }

export default function Relation(probs) {
	var {
		formValues,setFormValues,
		selected,collections
	} = useContext(collectionContext);
	
	const setFieldName=(e)=>{
		formValues.fieldName=e.target.value
		setFormValues({...formValues})
	}
	const setSettings=(e)=>{

		formValues.settings[e.target.name] =e.target.value
		
	}
	return (<>
		<Stack direction="row" spacing={2}>
			<Box sx={{ width: 160 }}>
				<FormControl sx={{ width: 160 }}>
					<Select value={selected} disabled={1}>
						<MenuItem value={selected}>{selected}</MenuItem>
					</Select>
				</FormControl>
				<TextField  value={formValues.fieldName} onChange={setFieldName} variant="outlined" sx={{ mt: 1, width: 160 }} />
			</Box>
			<Box sx={{ width: 75 }}>
				<FormControl sx={{ mt: 4, width: 75 }}>
					<Select name='relType' onChange={setSettings}>
						{formValues.settings.type=="integer" || formValues.settings.type=="object" ?<MenuItem value="OneToOne"><OneToOne /></MenuItem>:<></>}
						{formValues.settings.type=="array" ?<MenuItem value="OneToMany"><OneToMany /></MenuItem>:<></>}
						{formValues.settings.type=="integer" || formValues.settings.type=="object"  ?<MenuItem value="ManyToOne"><ManyToOne /></MenuItem>:<></>}
						{formValues.settings.type=="array"?<MenuItem value="ManyToMany"><ManyToMany /></MenuItem>:<></>}
					
					</Select>
				</FormControl>
			</Box>
			<Box sx={{ width: 160 }}>
				<FormControl sx={{ width: 160 }}>
					<Select name="foreignCollection" value={formValues.settings.foreignCollection} onChange={setSettings}>
						{collections.map(collection=>{
							if(collection!=selected)
							return <MenuItem value={collection}>{collection}</MenuItem>
							
						})}
					</Select>
				</FormControl>
				
			  <TextField name='foreignField' onChange={setSettings}  sx={{ mt: 1, width: 160 }} />
				
			</Box>
		</Stack>
	
		</>
	);
}
