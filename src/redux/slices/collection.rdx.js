import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
const axios = require('axios');

const initialState = {
	name: '',
	disabled: 1,
	error: null,
	collections: [],
	allCollections: [],
};
const slice = createSlice({
	name: 'collection',
	initialState,
	reducers: {
		setName(state, action) {
			state.name = action.payload;
			var filtered = state.allCollections.filter(collection => {
				return collection.indexOf(state.name) !== -1;
			});
			var equalItem = state.allCollections.filter(collection => {
				return collection == state.name;
			});

			if (equalItem.length == 0 && state.name != '') {
				state.disabled = 0;
			} else {
				state.disabled = 1;
			}
			state.collections = filtered;
		},
		setCollections(state, action) {
			state.collections = action.payload;
		},
		setAllCollections(state, action) {
			state.allCollections = action.payload;
		},
		addCollection(state, action) {
			var name=state.name
			axios.post('/api/collection/add', {
					name: state.name,
				})
				.then(res => {
					if (res.data == '1') {
						dispatch(getCollections())
						dispatch(setName(''))
					}
				});
		},
	},
});

export function getCollections() {
	return async () => {
		try {
			axios.get('/api/collection/get').then(res => {
				dispatch(slice.actions.setCollections(res.data));
				dispatch(slice.actions.setAllCollections(res.data));
			});
		} catch (error) {
			console.log('error');
		}
	};
}

export default slice.reducer;
export const { setName, addCollection } = slice.actions;
