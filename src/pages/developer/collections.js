import { useEffect,useContext } from 'react';
// @mui
import { Container, Card, Divider } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store'; // routes
import { PATH_DASHBOARD } from '../../routes/paths';
// layouts
import Layout from '../../layouts';

import Page from '../../components/Page';

import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

import Fields from '../../sections/collection/Fields.sec';
// sections
// ----------------------------------------------------------------------
import { styled } from '@mui/material/styles';
import CollectionSide from '../../sections/collection/CollectionSide.sec';
import collectionContext,{ CollectionProvider } from '../../hooks/collection.stm';

const RootStyle = styled('div')({
	flexGrow: 1,
	display: 'flex',
	overflow: 'hidden',
	flexDirection: 'column',
});
Provided.getLayout = function getLayout(page) {
	return <Layout variant='developer'>{page}</Layout>;
};

// ----------------------------------------------------------------------

function Collection() {
	var {
		selected,
	} = useContext(collectionContext);
	return (
	
		<Page title="Collections" sx={{ height: 1 }}>
			<Container maxWidth={false}>
				<HeaderBreadcrumbs
					heading="Collections"
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root,
						},
						{ name: 'Collections' },
					]}
				/>
				<Card
					sx={{
						minHeight: 480,
						height: { md: '72vh' },
						display: { md: 'flex' },
					}}
				>
						<CollectionSide />
						<RootStyle>
							{selected ? <Fields />:<></> }
							
						</RootStyle>
				</Card>

			</Container>
		</Page>
	);
}
export default function Provided(){
	return (<CollectionProvider><Collection></Collection></CollectionProvider>)
}