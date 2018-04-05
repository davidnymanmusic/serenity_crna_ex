import React, { Component } from 'react';
import {
	Text,
	View,
	StyleSheet,
	Button,
	Image,
	Dimensions
} from 'react-native';

import { TabNavigator, TabBarBottom, DrawerNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Feather';



import Breathe from './Breathe';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

export default class Main extends Component {
	static navigationOptions = {
		drawerLabel: 'Main',
		drawerIcon: ({ tintColor }) => (
			<Ionicons name="circle" size={20} color="#9dc6d1" />
		)
	};
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
		backgroundColor: '#9dc6d1',
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		color: 'rgba(255, 255, 255, 0.8)',
		fontSize: 50,
		fontFamily: 'Avenir-Book'
	}
});
