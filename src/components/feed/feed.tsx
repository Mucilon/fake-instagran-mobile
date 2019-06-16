import React, {Component} from 'react';
import { Text, View, TouchableOpacity, Image, FlatList, StyleSheet} from 'react-native';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import {IProps,IState,IPost,IParams} from './interface';
import api from '../../services/api';
import io from 'socket.io-client';


import camera from '../../assets/camera.png';
import more from '../../assets/more.png';
import like from '../../assets/like.png';
import comment from '../../assets/comment.png';
import send from '../../assets/send.png';

class Feed extends Component<IProps,IState>{

  state:IState = { feed: [] }
  
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute<IParams>, IParams>}) => ({

    headerRight:(
      <TouchableOpacity style={ {marginRight: 20} }onPress={() => navigation.navigate('New') }>
        <Image source={camera} />
      </TouchableOpacity>
    ),

  });


  
  async componentDidMount() {
      
      const response = await api.get('/api/post/all');
     
    //  this.state.feed = [...response.data];
       this.setState({ feed: response.data.payload});

       console.log(response.data.payload);

       this.registerToSocket();

  }


  handleLike = async (id:string) => {
    console.log(id);
    await api.post(`/api/post/${id}/like`)
  }


  registerToSocket = () => {
      const socket = io('http://192.168.1.102:3333');

      socket.on('post', (newPost:IPost) => {

        console.log(newPost);
        this.setState(  { feed: [newPost, ...this.state.feed]   } )
      });


      socket.on('like', (likedPost:IPost) => {

        console.log(likedPost);
        this.setState(  { feed: this.state.feed.map(post => 
          post._id === likedPost._id ? likedPost : post
          )  
        });
      });
    }


  
    render() {


      return (
        <View style={styles.container}>
          <FlatList 
            data={this.state.feed}
            keyExtractor={post => post._id}
            renderItem={({item}) => (
              <View style={styles.feedItem}>

                <View style={styles.feedItemHeader}>

                  <View>
                    <Text style={styles.name}>{item.author}</Text>
                    <Text style={styles.place}>{item.place}</Text>
                  </View>  
                  
                  <Image source={more} />
                </View>
                <Image style={styles.feedImage} source={ { uri:`http://192.168.1.102:3333/files/${item.image}` } } /> 


                <View style={styles.feedItemFooter}>

                  <View style={styles.actions}>

                  <TouchableOpacity style={styles.action} onPress={() => this.handleLike(item._id) }>
                    <Image source={like} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.action}  onPress={() => {} }>
                    <Image source={comment} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.action}  onPress={() => {} }>
                    <Image source={send} />
                  </TouchableOpacity>

                  </View>  
                  
                  <Text style={styles.likes}>{item.likes} curtidas</Text>
                  <Text style={styles.description}>{item.description} curtidas</Text>
                  <Text style={styles.hashtags}>{item.hashtags} curtidas</Text>
                  
                </View> 


              </View>
            )}
          />
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },

    feedItem: {
      marginTop: 20
    },

    feedItemHeader: {
      paddingHorizontal: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    name: {
      fontSize: 14,
      color: '#000'
    },

    place: {
      fontSize: 13,
      color: '#666',
      marginTop: 2
    },

    feedImage: {
      width: '100%',
      height: 400,
      marginVertical: 15,
    },

    feedItemFooter: {
      paddingHorizontal: 15,
    },

    actions: {
      flexDirection: 'row'
    },

    action: {
      marginRight: 2
    },

    likes: {
      marginTop: 15,
      fontWeight: 'bold',
      color: '#000'
    },

    description: {
      lineHeight: 18,
      color: '#000'
    },

    hashtags: {
      color: '#7160c0'
    }





  });


  export default Feed;