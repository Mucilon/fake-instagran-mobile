import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import io from 'socket.io-client';
import {
 IProps, IState, IPost, IParams,
} from './interface';
import api from '../../services/api';
import { styles } from './styles';

import camera from '../../assets/camera.png';
import more from '../../assets/more.png';
import like from '../../assets/like.png';
import comment from '../../assets/comment.png';
import send from '../../assets/send.png';


class Feed extends Component<IProps, IState> {
  static navigationOptions =
  ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute<IParams>, IParams>}) => ({
    headerRight: (
      <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate('New')}>
        <Image source={camera} />
      </TouchableOpacity>
    ),

  });

  state:IState = {
    feed: [],
  }


  async componentDidMount() {
      const response = await api.get('/api/post/all');

    //  this.state.feed = [...response.data];
       this.setState({ feed: response.data.payload });

       this.registerToSocket();
  }


  handleLike = async (id:string) => {
    await api.post(`/api/post/${id}/like`);
  }


  registerToSocket = () => {
      const socket = io('http://192.168.1.102:3333');

      socket.on('post', (newPost:IPost) => {
        this.setState({ feed: [newPost, ...this.state.feed] });
      });


      socket.on('like', (likedPost:IPost) => {
        this.setState({
 feed: this.state.feed.map(post => (post._id === likedPost._id ? likedPost : post)),
        });
      });
    }


    render() {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.state.feed}
            keyExtractor={post => post._id}
            renderItem={({ item }) => (
              <View style={styles.feedItem}>

                <View style={styles.feedItemHeader}>

                  <View>
                    <Text style={styles.name}>{item.author}</Text>
                    <Text style={styles.place}>{item.place}</Text>
                  </View>

                  <Image source={more} />
                </View>
                <Image style={styles.feedImage} source={{ uri: `http://192.168.1.102:3333/files/${item.image}` }} />


                <View style={styles.feedItemFooter}>

                  <View style={styles.actions}>

                    <TouchableOpacity style={styles.action} onPress={() => this.handleLike(item._id)}>
                      <Image source={like} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.action} onPress={() => {}}>
                      <Image source={comment} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.action} onPress={() => {}}>
                      <Image source={send} />
                    </TouchableOpacity>

                  </View>

                  <Text style={styles.likes}>{`${item.likes}curtidas`}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.hashtags}>{item.hashtags}</Text>

                </View>


              </View>
            )}
          />
        </View>
      );
    }
  }

  export default Feed;
