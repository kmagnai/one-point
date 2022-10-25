import { Container, Card, Button, Box, Divider, Drawer } from '@mui/material';
import Scrollbar from '../../components/Scrollbar';
import useResponsive from '../../hooks/useResponsive';
import { NAVBAR } from '../../config';

import { useContext } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import TextField from '@mui/material/TextField';
import collectionContext from '../../hooks/collection.stm';
const Bar = () => {
	var {
		name,
		setName,
		collections,
		addCollection,
		disabled,
		filteredCollections,
		setSelected,
		selected,
	} = useContext(collectionContext);
	const handleChange = e => {
		setName(e.target.value);
	}
	const handleSelect= (selected) => () => {
		setSelected(selected)
	}
	return (
		<Scrollbar>
			<Box sx={{ p: 3 }}>
				<TextField
					sx={{ mb: 2 }}
					required
					id="outlined-required"
					value={name}
					label="Collection name"
					onChange={handleChange}
				/>
				<Button fullWidth variant="contained" onClick={addCollection} disabled={disabled}>
					+ Үүсгэх
				</Button>
			</Box>
			<Divider />
			<List>
				{filteredCollections.map((collection, index) => (
						<ListItem
							selected={collection === selected}
							onClick={handleSelect(collection)}
							key={index}
							sx={{ m: 0, p: 0 }}
						>
							<ListItemButton sx={{ pl: 2 }}>
								<ListItemText primary={collection} />
							</ListItemButton>
						</ListItem>
					)
				)}

			</List>
		</Scrollbar>
	);
};
export default function CollectionSide() {
	const isDesktop = useResponsive('up', 'md')
	return <>
						{isDesktop
						? <Drawer
								variant="permanent"
								PaperProps={{ sx: { width: NAVBAR.BASE_WIDTH, position: 'relative' } }}
							>
								<Bar/>
						</Drawer>
						: <Drawer PaperProps={{ sx: { width: NAVBAR.BASE_WIDTH } }}>
								<Bar/>
						</Drawer>}
	</>
}

