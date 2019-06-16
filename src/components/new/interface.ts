
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';

interface IImage {
  uri: string,
  type: string | undefined,
  name: string
}

interface IPreview {
  uri: string
}


export interface IPost{

    author: string,
    place: string,
    description: string,
    hashtags: string,
    image: IImage,
    preview: IPreview
  }

  export interface IState extends IPost {

  }

  export interface IProps{
     navigation: NavigationScreenProp<NavigationRoute<IParams>, IParams>
  }

  export interface IParams {
    otherId: string;
    otherName: string;
    otherPic: string;
    id: string;
  }
