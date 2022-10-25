import { TextField, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles'
const LabelStyle = styled(Typography)(({ theme }) => ({
	...theme.typography.body2,
	width: 140,
	fontSize: 13,
	flexShrink: 0,
	color: theme.palette.text.secondary,
}));
export default function Itext(props){
	var changed=(e)=>{
		console.log(e.target.tagName)
	}
	return <Text value="asdasdff" onChange={changed}></Text>
}


function Text(props) {
	return (
		<Stack direction="row" spacing={2}>
			<LabelStyle>Текст:</LabelStyle>
			<TextField {...props} sx={{ m: 1, width: 300 }}/>
		</Stack>
	);
}