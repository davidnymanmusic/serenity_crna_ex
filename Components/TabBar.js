import React from 'react';
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
import * as Animatable from 'react-native-animatable';
import Ripple from 'react-native-material-ripple';

import TimerCountdown from 'react-native-timer-countdown';

import AudioPlayer from './AudioPlayer';
import Breathe from './Breathe';
import MusicScreen from './MusicScreen';
import Pond from './Pond';
import MainHome from './MainHome'

import { Analytics, PageHit } from 'expo-analytics';
const analytics = new Analytics('UA-116377550-1');


var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

Animatable.initializeRegistryWithDefinitions({
	breathe: {
		from: {
			opacity: 0.45,
			scale: 1
		},
		to: {
			opacity: 1,
			scale: 1.25
		}
	}
});
Animatable.initializeRegistryWithDefinitions({
	breatheText: {
		from: {
			opacity: 0.75
		},
		to: {
			opacity: 1
		}
	}
});

class MyNotificationsScreen extends React.Component {
	static navigationOptions = {
		drawerLabel: 'Activities',
		drawerIcon: ({ tintColor }) => (
			<Ionicons name="circle" size={20} color="#9dc6d1" />
		)
	};

	render() {
		return (
			<View style={styles.container}>
				<Button
					onPress={() => this.props.navigation.goBack()}
					title="Go back home"
				/>
			</View>
		);
	}
}

export default TabNavigator(
	{
		Home: { screen: MainHome },
		Music: { screen: MusicScreen },
		Pond: { screen: Pond }
	},
	{
		navigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused, tintColor }) => {
				const { routeName } = navigation.state;
				let iconName;
				if (routeName === 'Home') {
					iconName = 'anchor';
				} else if (routeName === 'Music') {
					iconName = 'headphones';
				} else if (routeName === 'Pond') {
					iconName = 'droplet';
				}
				return <Ionicons name={iconName} size={25} color={tintColor} />;
			},
			swipeEnabled: false
		}),

		style: {
			backgroundColor: '#9dc6d1',
			shadowColor: 'transparent',
			borderTopColor: 'rgba(0, 0, 0, 0)',
			borderTopWidth: 0
		},
		tabStyle: {
			backgroundColor: '#9dc6d1',
			shadowColor: 'transparent',
			borColor: 'transparent',
			borderTopColor: 'rgba(0, 0, 0, 0)',
			borderTopWidth: 0
		},
		tabBarOptions: {
			activeTintColor: '#9dc6d1',
			inactiveTintColor: 'rgba(255, 255, 255, 0.7)',
			fontFamily: 'Avenir-Book',
			shadowColor: 'transparent',
			inactiveBackgroundColor: '#9dc6d1',
			activeBackgroundColor: '#fff'
		},
		tabBarComponent: TabBarBottom,
		tabBarPosition: 'bottom',
		animationEnabled: true,
		swipeEnabled: false,
		fontFamily: 'Avenir-Book'
	}
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#9dc6d1',
		alignItems: 'center',
		justifyContent: 'center'
	},
	timer: {
		backgroundColor: '#9dc6d1',
		alignItems: 'center',
		justifyContent: 'center',
		width: width
	},
	text: {
		color: 'rgba(255, 255, 255, 0.8)',
		fontSize: 50,
		fontFamily: 'Avenir-Book'
	},
	button: {
		alignItems: 'center',
		backgroundColor: 'rgba(221, 221, 221, 0)',
		padding: 1000
	}
});
