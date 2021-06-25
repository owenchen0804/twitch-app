import React from 'react';
import {Menu, Button, Drawer, message} from 'antd';
import {EyeOutlined, YoutubeOutlined, VideoCameraOutlined, StarFilled} from '@ant-design/icons';
import {getFavoriteItem} from '../utils';

const {SubMenu} = Menu;

const MenuKey = {
    Streams: 'streams',
    Videos: 'videos',
    Clips: 'clips'
}

class Favorite extends React.Component {
    // both the “Home” component and the “Favorite” component need to know a single source of truth - “user’s favorite items”.
    // So we need to lift this “State” to the common ancestor component of these 2, which is our “App” component.
    // After this change, the “Favorite” component shall expect to see the data thru props instead of loading the data itself.
    state = {
        displayDrawer: false,
        data: {
            VIDEO: [],
            STREAM: [],
            CLIP: []
        }
    }

    onDrawerClose = () => {
        this.setState({
            displayDrawer: false,
        })
    }

    onFavoriteClick = () => {
        getFavoriteItem()
            .then((data) => {
                // data is favorite item list returned from getFavoriteItem
                console.log(data);
                this.setState({
                    data,
                    displayDrawer: true
                })
            }).catch((err) => {
            message.error(err.message);
        })
    }

    render = () => {
        const {VIDEO, STREAM, CLIP} = this.props.data;

        return (
            <>
                <Button type="primary" shape="round" icon={<StarFilled/>} onClick={this.onFavoriteClick}>
                    My Favorite
                </Button>
                <Drawer
                    title="My Favorite"
                    placement="right"
                    width={720}
                    visible={this.state.displayDrawer}
                    onClose={this.onDrawerClose}
                >
                    <Menu mode="inline" style={{height: '100%'}}>
                        <SubMenu key={MenuKey.Streams} title="Stream" icon={<EyeOutlined/>} style={{marginTop: '20px'}}>
                            {

                                STREAM.map((item) => {
                                    return (
                                        <Menu.Item key={item.id}>
                                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                {`${item.broadcaster_name} - ${item.title}`}
                                            </a>
                                        </Menu.Item>
                                    )
                                })
                            }
                        </SubMenu>
                        <SubMenu key={MenuKey.Videos} title="Video" icon={<EyeOutlined/>} style={{marginTop: '20px'}}>
                            {
                                VIDEO.map((item) => {
                                    return (
                                        <Menu.Item key={item.id}>
                                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                {`${item.broadcaster_name} - ${item.title}`}
                                            </a>
                                        </Menu.Item>
                                    )
                                })
                            }
                        </SubMenu>
                        <SubMenu key={MenuKey.CLIP} title="Clip" icon={<EyeOutlined/>} style={{marginTop: '20px'}}>
                            {
                                CLIP.map((item) => {
                                    return (
                                        <Menu.Item key={item.id}>
                                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                {`${item.broadcaster_name} - ${item.title}`}
                                            </a>
                                        </Menu.Item>
                                    )
                                })
                            }
                        </SubMenu>
                    </Menu>
                </Drawer>
            </>
        )
    }
}

export default Favorite;