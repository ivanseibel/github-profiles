import React, { Component } from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

// import { Container } from './styles';
import api from '../../services/api';

export default class User extends Component {
  state = {
    stars: [],
  };

  static propTypes = {
    route: PropTypes.shape({
      params: PropTypes.shape(),
    }).isRequired,
  };

  async componentDidMount() {
    const { route } = this.props;
    const { user } = route.params;

    try {
      const response = await api.get(`/users/${user.login}/starred`);
      this.setState({ stars: response.data });
    } catch (error) {
      console.tron.log(error);
    }
  }

  render() {
    const { stars } = this.state;
    return (
      <View>
        <Text>User</Text>
      </View>
    );
  }
}
