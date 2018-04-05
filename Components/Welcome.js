import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';

Animatable.initializeRegistryWithDefinitions({
  intro: {
    0: {
      opacity: 0,
      translateY: -200
    },
		0.8: {
			opacity: .7,
			translateY: -50
		},
    1: {
      opacity: 1,
      translateY: 0
    },
  }
});

const styles = StyleSheet.create({
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9dc6d1',
    paddingTop: 18,
    paddingBottom: 40
  },
  text2: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 50,
    fontFamily: 'Avenir-Book'
  }
});

const Welcome = ({text}) => <Animatable.View style={styles.slide1} animation="fadeIn" duration={400}>
  <Animatable.Text animation="intro" iterationCount={1} direction="alternate" delay={200} duration={2000}>
    <Text style={styles.text2}>{text}</Text>
  </Animatable.Text>

  <Animatable.Text animation="intro" iterationCount={1} direction="alternate" duration={2000}>
    <Icon name="circle" size={250} color="rgba(255, 255, 255, 0.63)"/></Animatable.Text>
</Animatable.View>

export default Welcome
