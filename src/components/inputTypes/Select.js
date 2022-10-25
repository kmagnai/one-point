import { TextField, Button, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
const LabelStyle = styled(Typography)(({ theme }) => ({
	...theme.typography.body2,
	width: 140,
	fontSize: 13,
	flexShrink: 0,
	color: theme.palette.text.secondary,
}));

export default function BaseCol() {
	return (
		<Stack direction="row" spacing={2}>
			<LabelStyle>Компонент:</LabelStyle>
			<TextField />
			<Button>zasdfasdf</Button>
		</Stack>
	);
}
