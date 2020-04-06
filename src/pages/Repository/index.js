import React from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

export default function Repository({ route }) {
  const { htmlUrl } = route.params.repository;
  return <WebView source={{ uri: htmlUrl }} style={{ flex: 1 }} />;
}

Repository.propTypes = {
  route: PropTypes.shape().isRequired,
};
