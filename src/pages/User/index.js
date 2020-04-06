import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
    refreshing: false,
    paginating: false,
    onlyOnePage: true,
  };

  async componentDidMount() {
    await this.loadStarred();
    await this.setState({ loading: false });
  }

  loadStarred = async () => {
    const {
      page,
      perPage,
      stars,
      loading,
      refreshing,
      paginating,
    } = this.state;

    if (!loading && !refreshing && !paginating) {
      return;
    }

    const { route } = this.props;
    const { user } = route.params;

    try {
      const response = await api.get(`/users/${user.login}/starred`, {
        params: {
          page,
          per_page: perPage,
        },
      });

      // If have one page, link property will be undefined
      const { link } = response.headers;

      await this.setState({
        stars: [...stars, ...response.data],
        loading: false,
        onlyOnePage: !link,
      });
    } catch (error) {
      // do nothing for now
    }
  };

  loadMore = async () => {
    const { page, onlyOnePage } = this.state;

    if (!onlyOnePage) {
      await this.setState({ page: page + 1, paginating: true });
      await this.loadStarred();
      await this.setState({ paginating: false });
    }
  };

  refreshStarred = async () => {
    await this.setState({
      page: 1,
      refreshing: true,
      stars: [],
    });

    await this.loadStarred();
    await this.setState({ refreshing: false });
  };

  handleNavigateToRepo = (data) => {
    const { navigation } = this.props;
    const { name, html_url: htmlUrl } = data;

    navigation.navigate('Repository', {
      repository: {
        name,
        htmlUrl,
      },
    });
  };

  render() {
    const { route } = this.props;
    const { user } = route.params;
    const { stars, loading, refreshing } = this.state;

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
            onEndReached={this.loadMore}
            onRefresh={this.refreshStarred}
            refreshing={refreshing}
            data={stars}
            keyExtractor={(star) => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title
                    onPress={() => {
                      this.handleNavigateToRepo(item);
                    }}
                  >
                    {item.name}
                  </Title>
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
