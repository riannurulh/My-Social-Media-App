import { ApolloClient, InMemoryCache, ApolloProvider, gql, createHttpLink } from '@apollo/client';
import {setContext} from'@apollo/client/link/context'
import * as SecureStore from 'expo-secure-store'

const httpLink = createHttpLink({
  // uri: 'https://9736-139-228-111-126.ngrok-free.app',
  uri: 'https://p3gc1.vexus.my.id',
  // uri:'http://localhost:3000'
})

const authLink = setContext(async (_,{headers})=>{
  const token = await SecureStore.getItemAsync('access_token')
  console.log(token);
  
  return{
    headers:{
      ...headers,
      authorization: token? `Bearer ${token}`:''
    }
  }
})

const client = new ApolloClient({
    link:authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  export default client