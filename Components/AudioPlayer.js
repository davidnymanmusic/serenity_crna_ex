import React, { Component } from 'react';
import {
	Dimensions,
	Image,
	Slider,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
	ScrollView
} from 'react-native';
import { Asset, Audio, Font, Video } from 'expo';

import Icon from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Feather';

import { Analytics, Event } from 'expo-analytics';

const analytics = new Analytics('UA-116377550-1');

Animatable.initializeRegistryWithDefinitions({
	load: {
		from: {
			opacity: 0.45
		},
		to: {
			opacity: 1
		}
	}
});

class ICON {
	constructor(module, width, height) {
		this.module = module;
		this.width = width;
		this.height = height;
		Asset.fromModule(this.module).downloadAsync();
	}
}

class PlaylistItem {
	constructor(name, uri, isVideo) {
		this.name = name;
		this.uri = uri;
		this.isVideo = isVideo;
	}
}
const PLAYLIST = [
	new PlaylistItem(
		'Invisible',
		'https://s3.amazonaws.com/davidnymancapstone/Invisibilia.mp3',
		false
	),
	new PlaylistItem(
		'Outlet',
		'https://s3.amazonaws.com/davidnymancapstone/Outlet.mp3',
		false
	),
	new PlaylistItem(
		'Wool',
		'https://s3.amazonaws.com/davidnymancapstone/Wool.mp3',
		false
	),
	new PlaylistItem(
		'White Waltz',
		'https://s3.amazonaws.com/davidnymancapstone/White+Waltz.mp3',
		false
	)
];

const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;
const LOOPING_TYPE_ICONS = {
	0: <Ionicons name="refresh-cw" size={50} color="#fff" />,
	1: <Ionicons name="rotate-cw" size={50} color="#fff" />
};

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const BG_COLOR = '#9dc6d1';
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;
const LOADING_STRING = 'loading';
const BUFFERING_STRING = 'buffering';
const RATE_SCALE = 3.0;
const VIDEO_CONTAINER_HEIGHT = DEVICE_HEIGHT * 2.0 / 5.0 - FONT_SIZE * 2;

export default class AudioPlayer extends Component {
	constructor(props) {
		super(props);
		this.index = 0;
		this.isSeeking = false;
		this.shouldPlayAtEndOfSeek = false;
		this.playbackInstance = null;
		this.state = {
			showVideo: false,
			playbackInstanceName: LOADING_STRING,
			loopingType: LOOPING_TYPE_ALL,
			muted: false,
			playbackInstancePosition: null,
			playbackInstanceDuration: null,
			shouldPlay: false,
			isPlaying: false,
			isBuffering: false,
			isLoading: true,
			fontLoaded: false,
			shouldCorrectPitch: true,
			volume: 1.0,
			rate: 1.0,
			videoWidth: DEVICE_WIDTH,
			videoHeight: VIDEO_CONTAINER_HEIGHT,
			poster: false,
			useNativeControls: false,
			fullscreen: false
		};
		this.selectTrack = this.selectTrack.bind(this);
	}

	componentDidMount() {
		Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
			playsInSilentModeIOS: true,
			shouldDuckAndroid: true,
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
		});
	}

	async _loadNewPlaybackInstance(playing) {
		if (this.playbackInstance != null) {
			await this.playbackInstance.unloadAsync();
			this.playbackInstance.setOnPlaybackStatusUpdate(null);
			this.playbackInstance = null;
		}

		const source = { uri: PLAYLIST[this.index].uri };
		const initialStatus = {
			shouldPlay: playing,
			rate: this.state.rate,
			volume: this.state.volume,
			isMuted: this.state.muted,
			isLooping: this.state.loopingType === LOOPING_TYPE_ONE
		};

		if (PLAYLIST[this.index].isVideo) {
			this._video.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate);
			await this._video.loadAsync(source, initialStatus);
			this.playbackInstance = this._video;
			const status = await this._video.getStatusAsync();
		} else {
			const { sound, status } = await Audio.Sound.create(
				source,
				initialStatus,
				this._onPlaybackStatusUpdate
			);
			this.playbackInstance = sound;
		}

		this._updateScreenForLoading(false);
		this.selectTrack();
	}

	_mountVideo = component => {
		this._video = component;
		this._loadNewPlaybackInstance(false);
	};

	_updateScreenForLoading(isLoading) {
		if (isLoading) {
			this.setState({
				showVideo: false,
				isPlaying: false,
				playbackInstanceName: LOADING_STRING,
				playbackInstanceDuration: null,
				playbackInstancePosition: null,
				isLoading: true
			});
		} else {
			this.setState({
				playbackInstanceName: PLAYLIST[this.index].name,
				isLoading: false
			});
		}
	}
	selectTrack() {
		analytics
			.event(new Event('track', String(this.state.playbackInstanceName)))
			.then(() => console.log(String(this.state.playbackInstanceName)))
			.catch(e => console.log(e.message));
	}

	_onPlaybackStatusUpdate = status => {
		if (status.isLoaded) {
			this.setState({
				playbackInstancePosition: status.positionMillis,
				playbackInstanceDuration: status.durationMillis,
				shouldPlay: status.shouldPlay,
				isPlaying: status.isPlaying,
				isBuffering: status.isBuffering,
				rate: status.rate,
				muted: status.isMuted,
				volume: status.volume,
				loopingType: status.isLooping ? LOOPING_TYPE_ONE : LOOPING_TYPE_ALL
			});
			if (status.didJustFinish && !status.isLooping) {
				this._advanceIndex(true);
				this._updatePlaybackInstanceForIndex(true);
			}
		} else {
			if (status.error) {
				console.log(`FATAL PLAYER ERROR: ${status.error}`);
			}
		}
	};

	_onFullscreenUpdate = event => {
		console.log(
			`FULLSCREEN UPDATE : ${JSON.stringify(event.fullscreenUpdate)}`
		);
	};

	_advanceIndex(forward) {
		this.index =
			(this.index + (forward ? 1 : PLAYLIST.length - 1)) % PLAYLIST.length;
	}

	async _updatePlaybackInstanceForIndex(playing) {
		this._updateScreenForLoading(true);

		this._loadNewPlaybackInstance(playing);
	}

	_onPlayPausePressed = () => {
		if (this.playbackInstance != null) {
			if (this.state.isPlaying) {
				this.playbackInstance.pauseAsync();
			} else {
				this.playbackInstance.playAsync();
			}
		}
	};

	_onStopPressed = () => {
		if (this.playbackInstance != null) {
			this.playbackInstance.stopAsync();
		}
	};

	_onForwardPressed = () => {
		if (this.playbackInstance != null) {
			this._advanceIndex(true);
			this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
		}
	};

	_onBackPressed = () => {
		if (this.playbackInstance != null) {
			this._advanceIndex(false);
			this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
		}
	};

	_onMutePressed = () => {
		if (this.playbackInstance != null) {
			this.playbackInstance.setIsMutedAsync(!this.state.muted);
		}
	};

	_onLoopPressed = () => {
		if (this.playbackInstance != null) {
			this.playbackInstance.setIsLoopingAsync(
				this.state.loopingType !== LOOPING_TYPE_ONE
			);
		}
	};

	_onVolumeSliderValueChange = value => {
		if (this.playbackInstance != null) {
			this.playbackInstance.setVolumeAsync(value);
		}
	};

	_onSeekSliderValueChange = value => {
		if (this.playbackInstance != null && !this.isSeeking) {
			this.isSeeking = true;
			this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
			this.playbackInstance.pauseAsync();
		}
	};

	_onSeekSliderSlidingComplete = async value => {
		if (this.playbackInstance != null) {
			this.isSeeking = false;
			const seekPosition = value * this.state.playbackInstanceDuration;
			if (this.shouldPlayAtEndOfSeek) {
				this.playbackInstance.playFromPositionAsync(seekPosition);
			} else {
				this.playbackInstance.setPositionAsync(seekPosition);
			}
		}
	};

	_getSeekSliderPosition() {
		if (
			this.playbackInstance != null &&
			this.state.playbackInstancePosition != null &&
			this.state.playbackInstanceDuration != null
		) {
			return (
				this.state.playbackInstancePosition /
				this.state.playbackInstanceDuration
			);
		}
		return 0;
	}

	_getMMSSFromMillis(millis) {
		const totalSeconds = millis / 1000;
		const seconds = Math.floor(totalSeconds % 60);
		const minutes = Math.floor(totalSeconds / 60);

		const padWithZero = number => {
			const string = number.toString();
			if (number < 10) {
				return '0' + string;
			}
			return string;
		};
		return padWithZero(minutes) + ':' + padWithZero(seconds);
	}

	_getTimestamp() {
		if (
			this.playbackInstance != null &&
			this.state.playbackInstancePosition != null &&
			this.state.playbackInstanceDuration != null
		) {
			return `${this._getMMSSFromMillis(
				this.state.playbackInstancePosition
			)} / ${this._getMMSSFromMillis(this.state.playbackInstanceDuration)}`;
		}
		return '';
	}

	_onPosterPressed = () => {
		this.setState({ poster: !this.state.poster });
	};

	_onUseNativeControlsPressed = () => {
		this.setState({ useNativeControls: !this.state.useNativeControls });
	};

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.nameContainer}>
					<Text style={styles.text2}>{this.state.playbackInstanceName}</Text>
				</View>
				<View style={styles.space} />
				<View style={styles.videoContainer}>
					<Video
						ref={this._mountVideo}
						style={[
							styles.video,
							{
								opacity: 1.0
							}
						]}
						onPlaybackStatusUpdate={this._onPlaybackStatusUpdate}
						onLoadStart={this._onLoadStart}
						onLoad={this._onLoad}
						onError={this._onError}
						onReadyForDisplay={this._onReadyForDisplay}
						useNativeControls={this.state.useNativeControls}
					/>
				</View>
				<View
					style={[
						styles.playbackContainer,
						{
							opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0
						}
					]}>
					<Slider
						style={styles.playbackSlider}
						value={this._getSeekSliderPosition()}
						onValueChange={this._onSeekSliderValueChange}
						onSlidingComplete={this._onSeekSliderSlidingComplete}
						disabled={this.state.isLoading}
						maximumTrackTintColor={'rgba(255, 255, 255, 0.5)'}
						minimumTrackTintColor={'#fff'}
						step={0.1}
					/>
					<View style={styles.timestampRow}>
						<Text style={[styles.text, styles.buffering]}>
							{this.state.isBuffering ? BUFFERING_STRING : ''}
						</Text>
						<Text style={[styles.text, styles.timestamp]}>
							{this._getTimestamp()}
						</Text>
					</View>
				</View>
				<View
					style={[
						styles.buttonsContainerBase,
						styles.buttonsContainerTopRow,
						{
							opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0
						}
					]}>
					<TouchableHighlight
						underlayColor={BG_COLOR}
						style={styles.wrapper}
						onPress={this._onBackPressed}
						disabled={this.state.isLoading}>
						<Ionicons name="arrow-left" size={40} color="#fff" />
					</TouchableHighlight>
					<TouchableHighlight
						underlayColor={BG_COLOR}
						style={styles.wrapper}
						onPress={this._onPlayPausePressed}
						disabled={this.state.isLoading}>
						{this.state.isPlaying ? (
							<Ionicons name="pause-circle" size={40} color="#fff" />
						) : (
							<Ionicons name="play-circle" size={40} color="#fff" />
						)}
					</TouchableHighlight>
					<TouchableHighlight
						underlayColor={BG_COLOR}
						style={styles.wrapper}
						onPress={this._onStopPressed}
						disabled={this.state.isLoading}>
						<Ionicons name="stop-circle" size={40} color="#fff" />
					</TouchableHighlight>
					<TouchableHighlight
						underlayColor={BG_COLOR}
						style={styles.wrapper}
						onPress={this._onForwardPressed}
						disabled={this.state.isLoading}>
						<Ionicons name="arrow-right" size={40} color="#fff" />
					</TouchableHighlight>
				</View>
				<View
					style={[
						styles.buttonsContainerBase,
						styles.buttonsContainerMiddleRow
					]}>
					<View style={styles.volumeContainer}>
						<TouchableHighlight
							underlayColor={BG_COLOR}
							style={styles.wrapper}
							onPress={this._onMutePressed}>
							{this.state.muted ? (
								<Ionicons name="volume-x" size={40} color="#fff" />
							) : (
								<Ionicons name="volume" size={40} color="#fff" />
							)}
						</TouchableHighlight>
						<Slider
							style={styles.volumeSlider}
							maximumTrackTintColor={'rgba(255, 255, 255, 0.5)'}
							minimumTrackTintColor={'#fff'}
							value={1}
							onValueChange={this._onVolumeSliderValueChange}
						/>
					</View>
					<TouchableHighlight
						underlayColor={BG_COLOR}
						style={styles.wrapper}
						onPress={this._onLoopPressed}>
						<Image
							style={styles.button}
							source={LOOPING_TYPE_ICONS[this.state.loopingType].module}
						/>
					</TouchableHighlight>
				</View>

				<View />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	emptyContainer: {
		alignSelf: 'stretch',
		backgroundColor: BG_COLOR
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		alignSelf: 'stretch',
		backgroundColor: BG_COLOR,
		paddingTop: 20
	},
	wrapper: {
		padding: 10
	},
	nameContainer: {
		height: 50,

		marginTop: 40
	},
	space: {
		height: FONT_SIZE
	},
	playbackContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		alignSelf: 'stretch'
	},
	playbackSlider: {
		minWidth: DEVICE_WIDTH / 1.3
	},
	timestampRow: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		minHeight: FONT_SIZE
	},
	text: {
		fontSize: FONT_SIZE,
		minHeight: FONT_SIZE,
		color: '#f5f5f5',
		fontSize: 20
	},
	buffering: {
		textAlign: 'left',
		paddingRight: 20
	},
	timestamp: {
		textAlign: 'center',
		paddingRight: 20
	},
	button: {
		backgroundColor: BG_COLOR,
		tintColor: 'rgba(255, 255, 255, 0.9)'
	},
	buttonsContainerBase: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-between'
	},
	buttonsContainerTopRow: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'stretch',
		marginLeft: 10,
		marginRight: 10,
		minWidth: DEVICE_WIDTH / 1.15,
		maxWidth: DEVICE_WIDTH / 1.15
	},
	buttonsContainerMiddleRow: {
		alignSelf: 'stretch',
		padding: 3
	},
	volumeContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	volumeSlider: {
		width: 220
	},
	buttonsContainerBottomRow: {
		alignSelf: 'stretch',
		paddingRight: 20,
		paddingLeft: 20
	},
	rateSlider: {
		width: DEVICE_WIDTH / 2.0
	},
	buttonsContainerTextRow: {
		maxHeight: FONT_SIZE,
		alignItems: 'center',
		paddingRight: 20,
		paddingLeft: 20,
		minWidth: DEVICE_WIDTH,
		maxWidth: DEVICE_WIDTH
	},
	text2: {
		color: 'rgba(255, 255, 255, 0.8)',
		fontSize: 20,
		fontFamily: 'Avenir-Book'
	}
});
