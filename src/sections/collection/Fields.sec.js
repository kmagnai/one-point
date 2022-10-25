import {useContext,useState} from 'react'
import {Button,Box} from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import collectionContext from '../../hooks/collection.stm'
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FieldForm from './FieldForm'
import AddIcon from '@mui/icons-material/Add'
const RootStyle = styled('div')(({ theme }) => ({
	height: 84,
	flexShrink: 0,
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(0, 2),
}));


  
export default function BasicTable() {
	var {
		schema,formOpen,setFormOpen,deleteField,editField
	} = useContext(collectionContext)
	
	var fields={}
	if(schema.properties !==undefined){
		fields=schema.properties
	}else{
	
	}
	var onEditClick=(fieldName)=>{
		editField(fieldName)
		setFormOpen(true);

	}
	var onClose=()=>{
		setFormOpen(false)
	}
	const openFormForAdd=()=>{
		setFormOpen(true)
	}
	return (
		<>
			<RootStyle>
				
			<Box sx={{ flexGrow: 1 }} />
				<Button onClick={openFormForAdd} variant="contained" style={{float: 'right'}}>Талбар+</Button>
			</RootStyle>
			<TableContainer component={Paper}>
				<Table>
				<TableHead>
          <TableRow>
            <TableCell>Талбар</TableCell>
            <TableCell align="right">Төрөл</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
					<TableBody >
						{Object.keys(fields).map((fieldName,i) => (
							<TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<TableCell >
									{fieldName}
								</TableCell>
								<TableCell align="right" sx={{ textTransform: 'capitalize' }}>{fields[fieldName].type}</TableCell>
								<TableCell align="right"><IconButton onClick={()=>onEditClick(fieldName)}><EditIcon/></IconButton> <IconButton  onClick={()=>deleteField(fieldName)}><DeleteIcon/></IconButton></TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<FieldForm isOpen={formOpen} onClose={onClose} />
		</>
	);
}
