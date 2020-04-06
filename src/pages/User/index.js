import React, { Component } from 'react';
import PropTypes from 'prop-types';

// TODO: Add infinite scroll with automatic pagination
// TODO: Add pull to refresh
// TODO: Add a link to open starred repository in a Webview
// TODO: When get an api error, show message in order to starred list

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';
import api from '../../services/api';

export default class User extends Component {
  static propTypes = {
    route: PropTypes.shape({
      params: PropTypes.shape(),
    }).isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: true,
    page: 1,
    perPage: 10,
  };

  async componentDidMount() {
    await this.handleLoadStarred();
    this.setState({ loading: false });
  }

  handleLoadStarred = async () => {
    const { page, perPage, stars } = this.state;
    const { route, navigation } = this.props;
    const { user } = route.params;

    try {
      const response = await api.get(`/users/${user.login}/starred`, {
        params: {
          page,
          per_page: perPage,
        },
      });
      this.setState({
        stars: [...stars, ...response.data],
        loading: false,
        page: page + 1,
      });
    } catch (error) {
      navigation.navigate('Main');
    }
  };

  render() {
    const { route } = this.props;
    const { user } = route.params;
    const { stars, loading } = this.state;

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <Loading loading={loading} />
        ) : (
          <Stars
            onEndReachedThreshold={0.2}
            onEndReached={this.handleLoadStarred}
            data={stars}
            keyExtractor={(star) => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
