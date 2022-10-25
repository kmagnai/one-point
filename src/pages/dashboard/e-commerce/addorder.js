import Layout from '../../../layouts';

import react, { useState, useEffect } from 'react';
import { getModel } from '../../../models/mongo/getModel';
import {
	Box,
	Card,
	Button,
	Switch,

	Container,
	TextField,
	FormControlLabel,
} from '@mui/material';

// import {postValidator} from '../models/mongo/validation/post.val.js'
var pm = getModel('order')

addOrder.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
export default function addOrder() {
	var [ order, setOrder ] = useState({ total_price: 0, order_details: [] }); //pm.getInsertDefaults() gedeg function bolgovol arai deer
	var [ process, setProcess ] = useState(0);
	var [ errors, setValErrors ] = useState({});
	var [ insertedId, setInsertedId ] = useState(0);
	return <Container>
        <TextField></TextField>

        <Button>asdf</Button>
    </Container> 
}
