import { Button, Form, Input, message, Modal } from 'antd';
import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { login } from '../utils';

class Login extends React.Component {
    state = {
        displayModal: false
    }

    handleCancel = () => {
        this.setState({
            displayModal: false,
        })
    }

    signinOnClick = () => {
        this.setState({
            displayModal: true,
        })
    }

    // Collect username and password from form and
    // send data to the server, call login utility function
    onFinish = (data) => {
        login(data)
            .then((data) => {
                console.log(data);
                this.setState({
                    displayModal: false,
                })
                message.success(`Welcome back, ${data.name}`); // 此处是json格式，因为data是json格式的！
                // call signinOnSuccess passed from App component
                this.props.onSuccess();
            }).catch((err) => {
            message.error(err.message);
        })
    }

    render = () => {
        return (
            <>
                <Button shape="round" onClick={this.signinOnClick} style={{ marginRight: '20px' }}>
                    Login</Button>
                <Modal
                    title="Log in"
                    visible={this.state.displayModal}
                    onCancel={this.handleCancel}
                    footer={null}
                    destroyOnClose={true}
                >
                    <Form
                        name="normal_login"
                        onFinish={this.onFinish}
                        preserve={false}
                    >
                        <Form.Item
                            name="user_id"
                            rules={[{ required: true, message: 'Please input your Username!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input
                                prefix={<LockOutlined />}
                                placeholder="Password"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Login</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        )
    }
}

export default Login;
// default export 在被 别的 文件 import 的时候不用加括号