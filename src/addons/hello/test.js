import Page from '../../components/Page';
import Layout from '../../layouts';

export default function Provided(props){
	return <Layout><Page>{props.children} Hello-test</Page></Layout>
}