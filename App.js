import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

//COMPONENTS
import TabNavigator from './Components/TabBar.js';
import Welcome from './Components/Welcome';

console.disableYellowBox = true;


export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			splash: false,
			home: false
		};
	}
	componentDidMount() {
		setTimeout(() => {
			this.setState({ splash: true });
		}, 4000);
	}
	render() {
		return !this.state.splash ? (
			<Welcome text={'Serenity Now'} />
		) : (
			<TabNavigator />
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	}
});
