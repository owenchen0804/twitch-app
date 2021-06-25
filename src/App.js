import React from 'react';
import {Button, Col, Layout, Menu, message, Row} from 'antd';
import Login from './components/Login';
import Register from './components/Register';
import { getFavoriteItem, getRecommendations, getTopGames, logout, searchGameById } from './utils';
import Favorites from './components/Favorites';
import {LikeOutlined, FireOutlined} from '@ant-design/icons';
import CustomSearch from './components/CustomSearch';
import Home from './components/Home';
import SubMenu from 'antd/lib/menu/SubMenu';

const {Header, Content, Sider} = Layout;

class App extends React.Component {
  state = {
    loggedIn: false,
    topGames: [],
    resources: {
      VIDEO: [],
      STREAM: [],
      CLIP: [],
    },
    favoriteItems: {
      VIDEO: [],
      STREAM: [],
      CLIP: [],
    }
  }

  favoriteOnChange = () => {
    getFavoriteItem().then((data) => {
      this.setState({
        favoriteItems: data,
        loggedIn: true
      })
    }).catch((err) => {
      message.error(err.message);
    })
  }

  // When a user clicks on a “Game” in the menu list on the left side bar, we need to send a request
  // with that “Game”’s ID to one of our backend apis and get relevant twitch resources of that game.
  // Then we pass that data to the “Home” component to display it properly.
  // pass onSelect={this.onGameSelect} to Menu in side bar
  // render data/resources in home component, pass data/resources to home
  onGameSelect = ({ key }) => {
    console.log(key);
    if (key === 'Recommendation') {
      getRecommendations().then((data) => {
        console.log(data);
        this.setState({
          resources: data
        })
      })
      return; // quick return
    }

    searchGameById(key).then((data) => {
      console.log(data);
      this.setState({
        resources: data,
      })
    })
  }

  // need to pass this function to custom search in side bar
  // render data/resources in home component, pass data/resources to home
  customSearchOnSuccess = (data) => {
    console.log(this.state.resources);
    console.log(data);
    this.setState({
      // set data as resources in the state
      resources: data
    })
    console.log(this.state.resources);
  }

  signinOnSuccess = () => {
    getFavoriteItem().then((data) => {
      console.log(data);
      this.setState({
        favoriteItems: data,
        loggedIn: true
      })
      console.log(this.favoriteItems);
    }).catch((err) => {
      message.error(err.message);
    })
  }

  signoutOnClick = () => {
    logout()
        .then(() => {
          this.setState({
            loggedIn: false
          })
          message.success(`Successfull signed out`);
        }).catch((err) => {
      message.error(err.message);
    })
  }

  componentDidMount = () => {
    getTopGames()
        .then((data) => {
          console.log('componentDidMount -> ', data);
          this.setState({
            topGames: data,
          })
        })
        .catch((err) => {
          message.error(err.message);
        })
  }

  render = () => (
      <Layout>
        <Header>
          <Row justify="space-between">
            <Col>
              // user logged in: favorite
              {
                this.state.loggedIn &&
                <Favorites data = { this.state.favoriteItems }/>
              }
            </Col>
            <Col>
              {/*会有2种login的状态： user logged in: logout*/}
              {/*user not logged in: login & register*/}
              {
                this.state.loggedIn ?
                    <Button shape="round" onClick={this.signoutOnClick}> Logout </Button> :
                    <>
                      {/*pass signinOnSuccess as onSuccess to Login component*/}
                      <Login onSuccess={this.signinOnSuccess}/>
                      <Register/>
                    </>
              }
            </Col>
          </Row>
        </Header>
        <Layout>
          <Sider width={300} className="site-layout-background">
            {/*pass customSearchOnSuccess as onSuccess to custom search as props*/}
            <CustomSearch onSuccess={this.customSearchOnSuccess}/>
            {/*pass onGameSelect as onSelect to Menu as props*/}
            <Menu
                mode="inline"
                onSelect={this.onGameSelect}
                style={{ marginTop: '10px' }}
            >
              <Menu.Item icon={<LikeOutlined />} key="Recommendation">
                Recommend for you!
              </Menu.Item>
              <SubMenu icon={<FireOutlined />} key="Popular Games" title="Popular Games">
                {
                  this.state.topGames.map((game) => {
                    return (
                        <Menu.Item key={game.id}>
                          <img
                              alt="Placeholder"
                              src={game.box_art_url.replace('{height}', '40').replace('{width}', '40')}
                              // style = {{borderRadius: '50%'}}
                          />
                          <span style = {{marginLeft: '10px'}}>
                                                {game.name}
                                            </span>
                        </Menu.Item>
                    )
                  })
                }
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '24px' }}>
            <Content
                className="site-layout-background"
                style={{
                  padding: 24,
                  margin: 0,
                  height: 800,
                  overflow: 'auto'
                }}
            >
              {/*render resources in home component, need to pass resources to home*/}
              <Home
                  resources={this.state.resources}
                  loggedIn={this.state.loggedIn}
                  favoriteItems={this.state.favoriteItems}
                  favoriteOnChange={this.favoriteOnChange}
              />
            </Content>
          </Layout>
        </Layout>
      </Layout>
  )
}

export default App;