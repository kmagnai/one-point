import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { NextResponse } from 'next/server';
import Page from '../../components/Page';
// var fs = require("fs") 
export default function Provided() {
	const router = useRouter();
	const path = router.query.path.join('/')

	router.query.path.forEach((folder,index)=>{
		console.log(folder);
	})
	const DynamicPage = dynamic(() => import('../../addons/' + path))

	return <DynamicPage />
}
