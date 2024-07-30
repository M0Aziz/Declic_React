import { AppBar, Layout } from 'react-admin';
import MyAppBar from './MyAppBar';
import { MyError } from './MyError';
import { MyMenu } from './MyMenu';

const MyLayout = props => (
    <Layout {...props} appBar={MyAppBar} error={MyError} menu={MyMenu}  />
);

export default MyLayout;
