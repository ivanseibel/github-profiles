import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Keyboard, ActivityIndicator } from 'react-native';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';
import api from '../../services/api';

export default class Main extends Component {
  state = {
    newUser: '',
    loading: false,
    users: [],
  };

  handleAddUser = async () => {
    const { users, newUser } = this.state;
    this.setState({ loading: true });
    try {
      const response = await api.get(`/users/${newUser}`);
      const data = {
        name: response.data.name,
        login: response.data.login,
        bio: response.data.bio,
        avatar: response.data.avatar_url,
      };

      this.setState({
        users: [...users, data],
        loading: false,
        newUser: '',
      });

      Keyboard.dismiss();
    } catch (error) {
      Keyboard.dismiss();
      this.setState({
        newUser: error.message,
        loading: false,
      });
    }
  };

  render() {
    const { newUser, users, loading } = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Add user"
            value={newUser}
            onChangeText={(text) => this.setState({ newUser: text })}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="FFF" />
            ) : (
                <Icon name="add" size={20} color="#FFF" />
              )}
          </SubmitButton>
        </Form>

        <List
          data={users}
          keyExtractor={(user) => user.login}
          renderItem={({ item }) => (
            <User>
              <Avatar source={{ uri: item.avatar }} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>

              <ProfileButton onPress={() => { }}>
                <ProfileButtonText>Profile details</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}
