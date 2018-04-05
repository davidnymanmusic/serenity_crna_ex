import React, { Component } from 'react';
import {
	Text,
	View,
	StyleSheet,
	TouchableHighlight,
	TouchableOpacity,
	Button,
	Image,
	Dimensions,
	Slider,
	ScrollView,
	Modal
} from 'react-native';

import { TabNavigator, TabBarBottom, DrawerNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import Ripple from 'react-native-material-ripple';

import AudioPlayer from './AudioPlayer';
import TimerCountdown from 'react-native-timer-countdown';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

const MAIN_COLOR = '#9dc6d1';
const MAIN_WHITE = 'rgba(255, 255, 255, 0.8)';

export default class MusicScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			count: 0,
			timeElapsed: 0,
			pressed: false,
			test: 'Hello',
			timer: '0:00',
			modalVisible: false,
			isNew: true
		};
		this.buttonPress = this.buttonPress.bind(this);
		this.timePicker = this.timePicker.bind(this);
		this.timeReducer = this.timeReducer.bind(this);
		this.msToTime = this.msToTime.bind(this);
		this.startTimer = this.startTimer.bind(this);
	}
	buttonPress() {
		this.setState({
			pressed: false
		});
	}
	startTimer() {
		this.setState({
			pressed: true
		});
	}
	msToTime(s) {
		var ms = s % 1000;
		s = (s - ms) / 1000;
		var secs = s % 60;
		s = (s - secs) / 60;
		var mins = s % 60;
		var hrs = (s - mins) / 60;
		return `${hrs}:${('0' + mins).slice(-2)}:00`;
	}
	timeReducer() {
		this.setState(state => ({
			count: state.count - 60000 * 5,
			timer: this.msToTime(state.count - 60000 * 5)
		}));
	}
	timePicker() {
		this.setState(state => ({
			count: state.count + 60000,
			timer: this.msToTime(state.count + 60000)
		}));
		console.log('hi');
	}
	setModalVisible(visible) {
		this.setState({
			modalVisible: visible,
			count: this.state.count
		});
	}
	tickTime() {
		this.timeElapsed = this.timeElapsed || 0;
		this.timeElapsed += 1000;
	}
	render() {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: MAIN_COLOR
				}}>
				{/* <TouchableHighlight
					onPress={() => {
						this.setModalVisible(true);
					}}>
					<Ionicons name="menu" size={35} color="#fff" />
				</TouchableHighlight> */}
				<AudioPlayer />

				{/* <View style={styles.timer}>
					<View
						style={{
							flexWrap: 'wrap',
							alignItems: 'flex-start',
							flexDirection: 'row'
						}}>
						<TouchableOpacity onPress={this.timeReducer}>
							<Ionicons name="minus-circle" size={35} color="#fff" />
						</TouchableOpacity>
						<Text style={styles.textTimer}>Timer</Text>
						<TouchableOpacity onPress={this.timePicker}>
							<Ionicons name="plus-circle" size={35} color="#fff" />
						</TouchableOpacity>
					</View>
					<TouchableHighlight
						underlayColor="rgba(255, 255, 255, 0)"
						onPress={this.startTimer}>
						<Text style={styles.start}>Start</Text>
					</TouchableHighlight>

					{this.state.pressed && this.state.timer !== 0 ? (
						<TimerCountdown
							initialSecondsRemaining={this.state.count}
							onTick={this.tickTime.bind(this)}
							onTimeElapsed={() => {
								this.timeElapsed = 0;
								this.setState({ count: 0, timeElapsed: 0 });
							}}
							allowFontScaling={true}
							style={{ fontSize: 20, color: MAIN_WHITE, marginTop: 20 }}
						/>
					) : (
						<Text style={{ fontSize: 20, marginTop: 20, color: MAIN_WHITE }}>
							{this.state.timer}
						</Text>
					)}
				</View>

				<View style={{ marginTop: 22 }}>
					<Modal
						animationType="fade"
						transparent={false}
						visible={this.state.modalVisible}
						onRequestClose={() => {
							alert('Modal has been closed.');
						}}>
						<View style={(styles.container, { marginTop: 22 })}>
							<View style={{ backgroundColor: MAIN_COLOR }} />
						</View>
						<View style={styles.container}>
							<ScrollView
								style={{
									flex: 1,
									width: width / 1.1,
									backgroundColor: MAIN_COLOR,
									borderColor: 'rgba(255, 255, 255, 0.5)',
									borderWidth: 2,
									margin: 2
								}}>
								<Text style={styles.playlist}>Hello</Text>
								<Text style={styles.playlist}>Hello</Text>
								<Text style={styles.playlist}>Hello</Text>
								<Text style={styles.playlist}>Hello</Text>
								<Text style={styles.playlist}>Hello</Text>
								<Text style={styles.playlist}>Hello</Text>
								<Text style={styles.playlist}>Hello</Text>
								<Text style={styles.playlist}>Hello</Text>
								<Text style={styles.playlist}>Hello</Text>
								<Text style={styles.playlist}>Hello</Text>
								<Text style={styles.playlist}>Hello</Text>
								<Text style={styles.playlist}>Hello</Text>
								<Text style={styles.playlist}>Hello</Text>
							</ScrollView>

							<TouchableHighlight
								onPress={() => {
									this.setModalVisible(!this.state.modalVisible);
									this.setState(state => {
										const newTime = this.state.count - this.timeElapsed;

										return {
											count: newTime > 0 ? newTime : 0,
											timeElapsed: newTime > 0 ? this.timeElapsed : 0
										};
									});
								}}>
								<Ionicons name="x" size={45} color={MAIN_WHITE} />
							</TouchableHighlight>
						</View>
					</Modal>
				</View> */}
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
	timer: {
		backgroundColor: MAIN_COLOR,
		alignItems: 'center',
		justifyContent: 'center',
		width: width,
		paddingTop: 30
	},
	start: {
		alignItems: 'center',
		padding: 10,
		paddingLeft: 60,
		paddingRight: 60,
		color: 'rgba(255, 255, 255, 0.8)',
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		fontFamily: 'Avenir-Book',
		fontSize: 20,
		borderWidth: 1,
		borderRadius: 25,
		borderColor: 'rgba(255, 255, 255, 0.8)',
		overflow: 'hidden'
	},
	text: {
		color: 'rgba(255, 255, 255, 0.8)',
		fontSize: 50,
		fontFamily: 'Avenir-Book'
	},
	textTimer: {
		color: 'rgba(255, 255, 255, 0.8)',
		fontSize: 35,
		fontFamily: 'Avenir-Book',
		paddingHorizontal: 35
	},
	playlist: {
		fontSize: 20,
		backgroundColor: MAIN_COLOR,
		borderColor: MAIN_WHITE,
		borderWidth: 1,
		color: MAIN_WHITE,
		textAlign: 'center',
		fontFamily: 'Avenir-Book',
		margin: 5,
		padding: 5
	}
});
