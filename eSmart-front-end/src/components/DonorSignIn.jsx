import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment, Input } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import binImg from '../esmartbin.png';
import { getAuth, } from 'firebase/auth';
import axios from 'axios';
import DonorAuth from '../utils/DonorAuth';
import { Redirect } from 'react-router';

const auth = getAuth();
export default class DonorSignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isError: false,
            errorMsg: '',
            isAuthenticated: false
        };
    };

    async componentDidMount() {
        await DonorAuth.check();
        this.setState({ isAuthenticated: DonorAuth.getAuth() });
    }

    loginSubmit = async (e) => {
        e.preventDefault();
        console.log("sending log in");
        this.setState({ isLoading: true });
        let password = e.target.password.value;
        let phone = e.target.phone.value;
        let newPhone = phone.trim();
        newPhone = newPhone.slice(1, newPhone.length);
        newPhone = '+27' + newPhone.trim();
        const user = auth.currentUser;
        console.log(user);
        if (user !== null) {
            const firebasePhone = user.phoneNumber;
            if (newPhone !== '+27') {
                console.log(newPhone);
                if (newPhone === firebasePhone) {
                    let body = { phone: newPhone, password }
                    axios.post('/donor/signin', body).then(async response => {
                        const data = response.data;
                        console.log(data);
                        if (data.auth) {
                            window.localStorage.setItem('sudo', data.token);
                            this.setState({ isLoading: false, isAuthenticated: true });
                        } else {
                            this.setState({ isLoading: false, isError: true, errorMsg: 'You password or phone number is incorrect' });
                        }
                    });
                } else {
                    console.log('phone not found in firebase');
                    this.setState({ isLoading: false, isError: true, errorMsg: 'There is no account linked with this phone number' });
                }
            } else {
                this.setState({ isLoading: false, isError: true, errorMsg: 'Please enter your password and phone number' });
                console.log('please enter phone');
            }
        } else if (!password && !phone) {
            this.setState({ isLoading: false, isError: true, errorMsg: 'Please enter your password and phone number' });
        } else {

            let body = { phone: newPhone, password }
            axios.post('/donor/signin', body).then(async response => {
                const data = response.data;
                console.log(data);
                if (data.auth) {
                    window.localStorage.setItem('sudo', data.token);
                    this.setState({ isLoading: false, isAuthenticated: true });
                } else {
                    this.setState({ isLoading: false, isError: true, errorMsg: data.reason });
                }
            });
        }
    }


    render() {
        const { isAuthenticated } = this.state;
        if (isAuthenticated) {
            return <Redirect to='/donor/app' />
        }
        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='teal' textAlign='center'>
                        <Image src={binImg} /> Sign-in as a donor
                    </Header>
                    <Form size='large' onSubmit={this.loginSubmit} >
                        <Segment stacked>
                            <Form.Input fluid icon='lock' type='password' autoComplete='false' iconPosition='left' placeholder='Password' name='password' />
                            <Input label='+27' fluid type='text' autoComplete='false' placeholder='Phone' name='phone' pattern='[0-9]{10}' title='example: 0622635825' />
                            <div style={{ paddingTop: '5%' }}></div>
                            <Button loading={this.state.isLoading} id='sendCode' color='teal' fluid size='large' type='submit'>
                                Sign In
                            </Button>
                        </Segment>
                    </Form>
                    {!this.state.isError ? ('') : (
                        <Message attached='bottom' negative>
                            {this.state.errorMsg}
                        </Message>
                    )}
                    <Message>
                        New to us? <a href='/#/donor/register'>Sign Up</a>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}