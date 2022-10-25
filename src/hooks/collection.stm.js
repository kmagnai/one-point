import { getFilledInputUtilityClass } from '@mui/material';
import react, { useState, useEffect } from 'react';
import { getCollections } from 'src/redux/slices/collection.rdx';
const axios = require('axios');

const collectionContext = react.createContext();

export const CollectionProvider = props => {
	var [ name, setName ] = useState('');
	var [ disabled, setDisabled ] = useState(1);
	var [ error, setError ] = useState(null);
	const [ collections, setCollections ] = useState([]);
	const [filteredCollections, setFilteredCollections ] = useState([]);
	const [selected, setSelected] = useState('')
    const [schema,setSchema]=useState({})
	const [formOpen,setFormOpen]=useState(false)
	const [formValues,setFormValues]=useState({"settings":{"type":-1,"component":""}})
	const addField=()=>{
		if(selected!='')
		axios.post('/api/collection/'+selected+"/addField", {...formValues})
			.then(res => {
				if (res.data == '1') {
					getSchema()
				}
			});
	}
	const deleteField=(fieldName)=>{
		axios.delete('/api/collection/'+selected+'/deleteField',{ data: {fieldName} }).then(res => {
		
			if (res.data == '1') {
				getSchema()
			}
		});
	}
	const editField=(fieldName)=>{
		formValues.fieldName=fieldName
		formValues.settings=schema.properties[fieldName]
		setFormValues(formValues)
	}
	const addCollection = () => {
		axios
			.post('/api/collection/add', {
				name: name,
			})
			.then(res => {
				if (res.data == '1') {
					getCollections();
				}
			});
	};

	const getCollections = () => {
		axios.get('/api/collection/get').then(res => {
			setCollections(res.data);
		});
	};
	const getSchema = () => {
		if (selected != '') axios.get('/api/collection/' + selected+"/fields").then(res => {
                
				try {
                    setSchema(res.data)
				} catch (e) {
                    setSchema({})
                }
			});
	};
	useEffect(
		() => {
			getCollections();
		},
		[]
	);
	useEffect(
		() => {
			getSchema();
		},
		[ selected ]
	);
	useEffect(
		() => {
			var filtered = collections.filter(collection => {
				return collection.indexOf(name) !== -1 || selected==collection;
			});
			setFilteredCollections(filtered);
			var equalItem = collections.filter(collection => {
				return collection == name;
			});
			if (equalItem.length == 0 && name != '') {
				setDisabled(0);
			} else {
				setDisabled(1);
			}
		},
		[ name, collections ]
	);
	return (
		<collectionContext.Provider
			value={{
				name,
				setName,
				disabled,
				setDisabled,
				error,
				collections,
				filteredCollections,
				addCollection,
				setSelected,
				deleteField,
				selected,
                schema,formOpen,setFormOpen,formValues,setFormValues,addField,editField
			}}
		>{props.children}
		</collectionContext.Provider>
	);
};

export default collectionContext;
