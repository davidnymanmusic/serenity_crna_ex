import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { TabNavigator, TabBarBottom, DrawerNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Feather';

import Breathe from './Breathe';

const MAIN_COLOR = '#9dc6d1';

export default class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<View style={styles.container}>
				<Breathe />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: MAIN_COLOR,
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		color: 'rgba(255, 255, 255, 0.8)',
		fontSize: 50,
		fontFamily: 'Avenir-Book'
	}
});
