import {
	Drawer,
	Stack,
	Typography,
	TextField,
	OutlinedInput,
	Select,
	MenuItem,
	FormControl,
	Button,
} from '@mui/material';
import NumbersIcon from '@mui/icons-material/Numbers';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import Scrollbar from '../../components/Scrollbar';
import { useContext, useState, useEffect } from 'react';
import { types, inputTypes } from '../../components/inputTypes/TYPES';
import collectionContext from '../../hooks/collection.stm';
import InputSettings from '../../components/inputTypes/InputSettings'
const LabelStyle = styled(Typography)(({ theme }) => ({
	...theme.typography.body2,
	width: 140,
	fontSize: 13,
	flexShrink: 0,
	color: theme.palette.text.secondary,
}));
var currentTypes=[]
currentTypes=[]
Object.keys(inputTypes).map(t => {
	inputTypes[t].map(e => {
		currentTypes[currentTypes.length] = e;
	});
});
export default function FieldForm({ isOpen, onClose }) {
	var {
		formValues,
		setFormValues,
		addField,
	} = useContext(collectionContext)
	const changeFormValues = e => {
		formValues[e.target.name] = e.target.value;
		setFormValues({ ...formValues });
	};

	const typeSelect = e => {
		formValues.settings={}
		formValues.settings.type=e.target.value
		setFormValues({ ...formValues })
	
		var selectedType = e.target.value
		var newCurTypes = []
		inputTypes[selectedType].map(it => {
			newCurTypes[newCurTypes.length] = it;
		});
		currentTypes=newCurTypes
		setInputType(-1)
	};

	var [inputType,setInputType]=useState("")

	const componentSelect = e => {
		formValues.settings.component =e.target.value
		setFormValues({ ...formValues })
	};
	useEffect(
		() => {
			setInputType(formValues.settings.component)
		},
		[formValues.settings.component]
	)

	return (
		<Drawer open={isOpen} onClose={onClose} anchor="right" PaperProps={{ sx: { width: { xs: 1, sm: 480 } } }}>
			<Scrollbar>
				<Stack spacing={3} sx={{ px: 2.5, py: 3 }}>
					<h3 style={{color: "#919eab"}}>Шинэ талбар нэмэх</h3>
					<Stack direction="row" spacing={2}>
						<LabelStyle>Нэр:</LabelStyle>
						<TextField name="fieldName" value={formValues.fieldName} onChange={changeFormValues} sx={{ m: 1, width: 300 }} />
					</Stack>
					<Stack direction="row" spacing={2}>
						<LabelStyle>Төрөл:</LabelStyle>
						<FormControl sx={{ m: 1, width: 300 }}>
							<Select name="type" value={formValues.settings.type} onChange={typeSelect} sx={{ textTransform: 'capitalize' }}>
								{types.map((t, i) => (
									<MenuItem key={i} value={t} sx={{ textTransform: 'capitalize' }}>
										{t}
									</MenuItem>
								))}

							</Select>
						</FormControl>
					</Stack>
					<Stack  sx={formValues.settings.type!=-1 ?{display:'inherit'}:{ display: 'none' }} direction="row" spacing={2}>
						<LabelStyle>Компонент:</LabelStyle>
						<FormControl sx={{ m: 1, width: 300 }}>
							<Select name="inputComponent"  onChange={componentSelect} value={formValues.settings.component} >
								{currentTypes.map((t, i) => (
									<MenuItem key={i} value={t} sx={{ textTransform: 'capitalize' }}>
										{t}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Stack>
					<InputSettings inputType={inputType} />
					<Button onClick={addField} variant="contained" style={{ float: 'right' }}>Талбар+</Button>
				</Stack>
			</Scrollbar>
		</Drawer>
	);
}
