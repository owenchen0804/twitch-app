import React from 'react';
import {Button, Card, Col, List, message, Row, Tabs, Tooltip} from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import Favorites from "./Favorites";
import Login from "./Login";
import Register from "./Register";
import { addFavoriteItem, deleteFavoriteItem } from '../utils';

const { TabPane } = Tabs;

const tabKeys = {
    Streams: 'stream',
    Videos: 'videos',
    Clips: 'clips',
}

const processUrl = (url) => url
    .replace('%{height}', '252')
    .replace('%{width}', '480')
    .replace('{height}', '252')
    .replace('{width}', '480');


const renderCardTitle = (item, loggedIn, favs, favOnChange) => {
    const title = `${item.broadcaster_name}: ${item.title}`;

    const isFav = favs.find((fav) => fav.id === item.id);

    const favOnClick = () => {
        if (isFav) {
            deleteFavoriteItem(item).then(() => {
                favOnChange();
            }).catch(err => {
                message.error(err.message)
            })
            return;
        }

        addFavoriteItem(item).then(() => {
            favOnChange();
        }).catch(err => {
            message.error(err.message)
        })
    }

    return (
        <>
            <Row justify="space-between">
                <Col>
                    {
                        // only if logged in, show favorite icon
                        loggedIn &&
                        <Tooltip title={isFav ? "Remove from favorite list" : "Add to favorite list"}>
                            <Button
                                shape="circle"
                                icon={isFav ? <StarFilled /> : <StarOutlined />}
                                onClick={favOnClick}
                            />
                        </Tooltip>
                    }
                </Col>
                <Col style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: 450, marginLeft: '10px' }}>
                    {
                        <Tooltip title={title}>
                            <span>{title}</span>
                        </Tooltip>
                    }
                </Col>
            </Row>

            {/*<div style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: 450 }}>*/}
            {/*    <Tooltip title={title}>*/}
            {/*        <span>{title}</span>*/}
            {/*    </Tooltip>*/}
            {/*</div>*/}
        </>
    )
}

// const renderCardGrid = (data, loggedIn, favs, favOnChange) => {
//     return (
//         <List
//             grid={{
//                 xs: 1,
//                 sm: 2,
//                 md: 4,
//                 lg: 4,
//                 xl: 6,
//             }}
//             dataSource={data}
//             renderItem={item => (
//                 <List.Item style={{ marginRight: '20px' }}>
//                     <Card
//                         title={renderCardTitle(item, loggedIn, favs, favOnChange)}
//                     >
//                         <a href={item.url} target="_blank" rel="noopener noreferrer">
//                             <img
//                                 alt="Placeholder"
//                                 src={processUrl(item.thumbnail_url)}
//                             />
//                         </a>
//                     </Card>
//                 </List.Item>
//             )}
//         />
//     )
// }



const renderCardGrid = (data, loggedIn, favs, favOnChange) => {
    return (
        <List
            grid={{
                xs: 1,  // 屏幕极小 显示一个
                sm: 2,  // small 2个
                md: 4,
                lg: 4,
                xl: 6,
            }}
            // data 和 item 是 list的props, 查 antdeisgn 的 doc
            // item 是 data 中的一个个 entry
            dataSource={data}
            renderItem={item => (
                <List.Item style={{ marginRight: '20px' }}>
                    <Card
                        title={ renderCardTitle(item, loggedIn, favs, favOnChange) }
                    >
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <img
                                alt="Placeholder"
                                src={processUrl(item.thumbnail_url)}
                            />
                        </a>
                    </Card>
                </List.Item>
            )}
        />
    )
}

// { resources, loggedIn } 是在解构 props
// 没有解构的话直接 传入 props 也行
const Home = ({ resources, loggedIn, favoriteItems, favoriteOnChange }) => {
    const {VIDEO, STREAM, CLIP} = resources;
    const {VIDEO: favVideos, STREAM: favStreams, CLIP: favClips} = favoriteItems;

    return (
        <Tabs>
            <TabPane
                key={tabKeys.Streams} tab="Streams"
                // style = {{height: '800px', overflow: 'auto'}}
                forceRender={true}
            >
                {renderCardGrid(STREAM, loggedIn, favStreams, favoriteOnChange)}
            </TabPane>
            <TabPane key={tabKeys.Videos} tab="Videos" forceRender={true}>
                {renderCardGrid(VIDEO, loggedIn, favVideos, favoriteOnChange)}
            </TabPane>
            <TabPane key={tabKeys.Clips} tab="Clip" forceRender={true}>
                {renderCardGrid(CLIP, loggedIn, favClips, favoriteOnChange)}
            </TabPane>
        </Tabs>
    )
}

export default Home;