import React, { Component } from 'react';
import {
	Text,
	View,
	StyleSheet,
	Button,
	Image,
	Dimensions,
	Slider,
	TouchableOpacity,
	TouchableHighlight,
	Modal,
	Picker,
	Item
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import Ripple from 'react-native-material-ripple';

import SimplePicker from 'react-native-simple-picker';

import { Analytics, Event } from 'expo-analytics';

const analytics = new Analytics('UA-116377550-1');


const MAIN_COLOR = '#9dc6d1'

Animatable.initializeRegistryWithDefinitions({
	feel: {
		0: {
			opacity: 0.9
		},
		0.05: {
			opacity: 0.5
		},
		1: {
			opacity: 1
		}
	}
});

const labels = ['😀', '😊', '🙂', '😕', '😔', '😩', '😢', '🙃'];
const options = ['grinning 😀', 'smiling 😊', 'slight smile 🙂', 'confused 😕', 'sad 😔', 'weary 😩', 'crying 😢', 'upside down 🙃'];

export default class Breathe extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rate: 0,
			render: false,
			modalVisible: false,
			selectedOption: '',
			selectedLabel: '',
		};
		this.sendFeeling = this.sendFeeling.bind(this);
		this.changeRate = this.changeRate.bind(this);
		this.pageLoad = this.pageLoad.bind(this);
	}
	setModalVisible(visible) {
		this.setState({
			modalVisible: visible
		});
	}
	changeRate() {
		analytics
			.event(new Event('Rate', `${this.state.rate}`))
			.then(() => console.log(`${this.state.rate}`))
			.catch(e => console.log(e.message));
	}
	pageLoad() {
		analytics
			.event(new Event('Load', 'Homepage'))
			.then(() => console.log('home loaded'))
			.catch(e => console.log(e.message));
	}

	componentDidMount() {
		setTimeout(() => {
			this.setState({ rate: 3300 });
		}, 0);
		this.pageLoad();
	}
	sendFeeling() {
		analytics
			.event(new Event('Feeling', String(this.state.selectedOption)))
			.then(() => console.log(String(this.state.selectedOption)))
			.catch(e => console.log(e.message));
	}
	render() {
		return (
			<View style={styles.container}>
				<Animatable.Text
					style={styles.textBreathe}
					animation='breatheText'
					iterationCount={'infinite'}
					direction='alternate'
					duration={parseInt(this.state.rate)}>
					Breathe Deeply
				</Animatable.Text>

				<Animatable.Text
					animation='breathe'
					iterationCount={'infinite'}
					direction='alternate'
					duration={parseInt(this.state.rate)}>
					<Ionicons
						name='circle'
						size={250}
						color='rgba(255, 255, 255, 0.63)'
					/>
				</Animatable.Text>

				<Slider
					style={{ width: 250, bottom: 0, marginTop: 20 }}
					maximumTrackTintColor={'rgba(255, 255, 255, 0.5)'}
					minimumTrackTintColor={'#fff'}
					step={100}
					minimumValue={3300}
					maximumValue={3800}
					value={this.state.rate}
					onValueChange={val => this.setState({ rate: val })}
				/>
				<Text style={styles.text}>Adjust Rate</Text>

				<TouchableHighlight
					underlayColor='rgba(0,0,0, 0)'
					onPress={() => {
						this.refs.picker.show();
					}}>
					<Animatable.Text
						animation={'feel'}
						iterationCount={3}
						duration={3000}
						style={styles.you}>
						How are you feeling? {this.state.selectedOption}
					</Animatable.Text>
				</TouchableHighlight>
				<SimplePicker
					ref={'picker'}
					options={options}
					labels={labels}
					itemStyle={{
						fontSize: 55,
						backgroundColor: MAIN_COLOR
					}}
					onSubmit={option => {
						this.setState({
							selectedOption: option
						});
					}}
					buttonPress={this.sendFeeling()}
				/>
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

	buttons: {
		flex: 1,
		flexDirection: 'row'
	},
	text: {
		color: 'rgba(255, 255, 255, 0.8)',
		fontSize: 20,
		fontFamily: 'Avenir-Book',
		paddingTop: 10
	},
	you: {
		color: 'rgba(255, 255, 255, 0.8)',
		fontSize: 20,
		padding: 10,
		fontFamily: 'Avenir-Book',
		backgroundColor: 'rgba(255, 255, 255, 0)',
		borderWidth: 1,
		borderRadius: 25,
		borderColor: 'rgba(255, 255, 255, 0.8)',
		overflow: 'hidden',
		marginTop: 20
	},
	textBreathe: {
		color: 'rgba(255, 255, 255, 0.8)',
		fontSize: 40,
		fontFamily: 'Avenir-Book',
		paddingBottom: 40
	}
});
