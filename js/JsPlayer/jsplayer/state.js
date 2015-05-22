/**
 * Abstract class for the different states in which the player can be.
 * The player use the State Pattern to describe the different states : loading | playing | stopping | pausing
 * @class BaseState
 * @module JsPlayer
 * @extends Backbone.Model
 */
var BaseState = Backbone.Model.extend({

    /**
     * automatically called by Backbone at initialisation
     * @param player
     */
    initialize:function (player) {
        this.player = player;
    },

    /**
     * return the mode name : loading | playing | stopping | pausing
     */
    getName:function() {
        //
    },

    /**
     * called before everything else when entering this state
     */
    enter:function() {
        //
    },

    /**
     * change to loading state
     */
    load:function() {
        console.log('player ' + this.player.model.get('id') + ' : changing to the load state...');
        this.player.changeState(this.player.states.loading);
    },

    /**
     * change to playing state
     */
    play:function() {
        console.log('player ' + this.player.model.get('id') + ' : changing to the playing state...');
        this.player.changeState(this.player.states.playing);
    },

    /**
     * change to stopping state
     */
    stop:function() {
        console.log('player ' + this.player.model.get('id') + ' : changing to the stopping state...');
        this.player.changeState(this.player.states.stopping);
    },

    /**
     * change to pausing state
     */
    pause:function() {
        console.log('player ' + this.player.model.get('id') + ' : changing to the pausing state...');
        this.player.changeState(this.player.states.pausing);
    },

    /**
     * change to buffering state
     */
    buffer:function() {
        console.log('player ' + this.player.model.get('id') + ' : changing to the buffering state...');
        this.player.changeState(this.player.states.buffering);
    },

    /**
     * called just before leaving this state for another one
     */
    exit:function() {
        //
    },

    /**
     * called when receiving the "loadedmetadata" event from the audio player
     */
    onAudioLoadedMetadata: function() {
        console.log('player ' + this.player.model.get('id') + ' : event = onAudioLoadedMetadata');
 	},

    /**
     * called when receiving the "canplay" event from the audio player
     */
    onAudioCanPlay: function() {
        //
 	},

    /**
     * called when receiving the "play" event from the audio player
     */
    onAudioPlay: function() {
        this.play();
 	},

    /**
     * called when receiving the "play" event from the audio player
     */
    onAudioPause: function() {
        this.pause();
 	},

    /**
     * called when receiving the "playing" event from the audio player
     */
    onAudioPlaying: function() {
        //
 	},

    /**
     * called when receiving the "waiting" event from the audio player
     */
    onAudioWaiting: function() {
        //
 	},

    /**
     * called when receiving the "speedchange" event from the audio player
     */
    onAudioSpeedChange: function() {
        //
 	},

    /**
     * show or hide the play button
     */
    displayPlayBtn: function() {
        //
    },

    /**
     * show or hide the pause button
     */
    displayPauseBtn: function() {
        //
    },

    /**
     * show or hide the timeline slider
     */
    displaySlider: function() {
        if (this.player.model.get('show_slider')) {
            this.player.$div_slider.show();
        }
        else {
            this.player.$div_slider.hide();
        }
    },

    /**
     * show or hide the loading div
     */
    displayLoading: function() {
        if (this.player.model.get('show_loading')) {
            this.player.$div_loading.show();
        }
        else {
            this.player.$div_loading.hide();
        }
    },

    /**
     * show or hide the buffering_percent div
     */
    displayBufferingPercent: function() {
        if (this.player.model.get('show_buffering_percent')) {
            this.player.$div_buffering_percent.show();
        }
        else {
            this.player.$div_buffering_percent.hide();
        }
    },

    /**
     * show or hide the mute/unmute buttons
     */
    displayMuteBtn: function() {
        if (this.player.model.get('volume') > 0) {
            if (this.player.model.get('show_mute_btn')) {
                this.player.$btn_mute.show();
            }
            else {
                this.player.$btn_mute.hide();
            }

            this.player.$btn_unmute.hide();
        }
        else {
            this.player.$btn_mute.hide();

            if (this.player.model.get('show_mute_btn')) {
                this.player.$btn_unmute.show();
            }
            else {
                this.player.$btn_unmute.hide();
            }
        }
    },

    /**
     * show or hide the backward button
     */
    displayBackwardBtn: function() {
        //
    },

    /**
     * show or hide the forward button
     */
    displayForwardBtn: function() {
        //
    },

    /**
     * show or hide the volume down button
     */
    displayVolumeMoinsBtn: function() {
        if (this.player.model.get('show_volume_moins_btn')) {
            this.player.$btn_volume_moins.show();
        }
        else {
            this.player.$btn_volume_moins.hide();
        }
    },

    /**
     * show or hide the volume up button
     */
    displayVolumePlusBtn: function() {
        if (this.player.model.get('show_volume_plus_btn')) {
            this.player.$btn_volume_plus.show();
        }
        else {
            this.player.$btn_volume_plus.hide();
        }
    },

    /**
     * show or hide the volume slider
     */
    displayVolumeSlider: function() {
        if (this.player.model.get('show_volume_slider')) {
            this.player.$div_volume.show();
        }
        else {
            this.player.$div_volume.hide();
        }
    }
});


/**
 * loading state : the player is in this state when it's loading the medias
 * @class LoadingState
 * @module JsPlayer
 * @extends BaseState
 */
var LoadingState = BaseState.extend({
    getName:function() {
        return "loading";
    },

    /**
     * dispatch event "load_enter"
     */
    enter:function() {
        console.log('player ' + this.player.model.get('id') + ' : entering the loading state...');

        JsPlayer.idleOthers(this.player.model.get('id'));

        this.player.$div_info.html("");

        this.player.$div_buffering.hide();
        this.player.$div_buffering_percent.hide();
        this.player.hidePlayBtn();
        this.player.hidePauseBtn();
        this.player.$btn_backward.hide();
        this.player.$btn_forward.hide();

        this.displayMuteBtn();
        this.displayLoading();
        this.displaySlider();

        this.player.audio.load();

        this.player.trigger('load_enter');

    },

    /**
     * dispatch event "load_exit"
     */
    exit:function() {
        this.player.trigger('load_exit');
        console.log('player ' + this.player.model.get('id') + ' : exiting the loading state ...');
    },
    onAudioCanPlay: function() {
        console.log('player ' + this.player.model.get('id') + ' : event = onCanPlay');

        this.player.play();
 	},
    displayPlayBtn: function() {
        this.player.hidePlayBtn();
    },
    displayPauseBtn: function() {
        this.player.hidePauseBtn();
    },
    displayLoading: function() {
        if (this.player.model.get('show_loading')) {
            this.player.$div_loading.show();
        }
        else {
            this.player.$div_loading.hide();
        }
    },
    displayBackwardBtn: function() {
        this.player.$btn_backward.hide();
    },
    displayForwardBtn: function() {
        this.player.$btn_forward.hide();
    }
});


/**
 * playing state : the player is in this state when it's playing the media
 * @class PlayingState
 * @module JsPlayer
 * @extends BaseState
 */
var PlayingState = BaseState.extend({
    getName:function() {
        return "playing";
    },

    /**
     * dispatch event "play_enter"
     */
    enter:function() {
        console.log('A>> player ' + this.player.model.get('id') + ' : entering the playing state...');

        JsPlayer.idleOthers(this.player.model.get('id'));

        this.player.hidePlayBtn();

        this.displayPauseBtn();
        this.displayMuteBtn();
        this.player.$div_loading.hide();
        this.player.$div_buffering.hide();
        this.displayBufferingPercent();
        this.displaySlider();

        if (this.player.model.get('show_forward_btn')) {
            this.player.$btn_forward.show();
        }

        if (this.player.model.get('show_backward_btn')) {
            this.player.$btn_backward.show();
        }

        this.player.audio.play();

        this.player.trigger('play_enter');

    },
    play:function() {
        console.log('player ' + this.player.model.get('id') + ' : already playing!');
    },

    /**
     * dispatch event "play_exit"
     */
    exit:function() {
        this.player.trigger('play_exit');
        console.log('player ' + this.player.model.get('id') + ' : exiting the playing state ...');
    },
    displayPlayBtn: function() {
        this.player.hidePlayBtn();
    },
    displayPauseBtn: function() {
        if (this.player.model.get('show_pause_btn')) {
            this.player.showDefaultPauseBtn();
        }
        else {
            this.player.hideDefaultPauseBtn();
        }

        this.player.showExtraPauseBtn();
    },
    displayLoading: function() {
        this.player.$div_loading.hide();
    },
    displayBackwardBtn: function() {
        if (this.player.model.get('show_backward_btn')) {
            this.player.$btn_backward.show();
        }
        else {
            this.player.$btn_backward.hide();
        }
    },
    displayForwardBtn: function() {
        if (this.player.model.get('show_forward_btn')) {
            this.player.$btn_forward.show();
        }
        else {
            this.player.$btn_forward.hide();
        }
    },
    onAudioWaiting: function() {
        this.buffer();
 	},
    onAudioSpeedChange: function() {
        if (Math.round(this.player.speed) == 0) {
            this.buffer();
        }
 	}
});


/**
 * stopping state : the player is in this state when it stopped playing the media
 * @class StoppingState
 * @module JsPlayer
 * @extends BaseState
 */
var StoppingState = BaseState.extend({
    getName:function() {
        return "stopping";
    },

    /**
     * dispatch event "stop_enter"
     */
    enter:function() {
        console.log('player ' + this.player.model.get('id') + ' : entering the stopping state...');

        this.displayPlayBtn();

        this.player.hidePauseBtn();

        this.displayMuteBtn();
        this.player.$div_loading.hide();
        this.player.$div_buffering.hide();
        this.player.$div_buffering_percent.hide();
        this.displaySlider();
        this.player.$btn_backward.hide();
        this.player.$btn_forward.hide();

        this.player.audio.pause();

        this.player.trigger('stop_enter');

    },
    stop:function() {
        console.log('player ' + this.player.model.get('id') + ' : already stopped!');
    },

    /**
     * dispatch event "stop_exit"
     */
    exit:function() {
        this.player.trigger('stop_exit');
        console.log('player ' + this.player.model.get('id') + ' : exiting the stopping state ...');
    },
    displayPlayBtn: function() {
        if (this.player.model.get('show_play_btn')) {
            this.player.showDefaultPlayBtn();
        }
        else {
            this.player.hideDefaultPlayBtn();
        }

        this.player.showExtraPlayBtn();
    },
    displayPauseBtn: function() {
        this.player.hidePauseBtn();
    },
    displayExtraPlayBtn: function() {
        if (this.player.model.get('show_play_btn')) {
            this.player.showDefaultPlayBtn();
        }
        else {
            this.player.hideDefaultPlayBtn();
        }

        this.player.showExtraPlayBtn();
    },
    displayExtraPauseBtn: function() {
        this.player.hidePauseBtn();
    },
    displayLoading: function() {
        this.player.$div_loading.hide();
    },
    displayBackwardBtn: function() {
        this.player.$btn_backward.hide();
    },
    displayForwardBtn: function() {
        this.player.$btn_forward.hide();
    }
});


/**
 * pausing state : the player is in this state when it stopped playing the media
 * @class PausingState
 * @module JsPlayer
 * @extends BaseState
 */
var PausingState = BaseState.extend({
    getName:function() {
        return "pausing";
    },

    /**
     * dispatch event "pause_enter"
     */
    enter:function() {
        console.log('player ' + this.player.model.get('id') + ' : entering the pausing state...');

        this.displayPlayBtn();

        this.player.hidePauseBtn();

        this.displayMuteBtn();
        this.player.$div_loading.hide();
        this.player.$div_buffering.hide();
        this.player.$div_buffering_percent.hide();
        this.displaySlider();
        this.player.$btn_backward.hide();
        this.player.$btn_forward.hide();

        this.player.audio.pause();

        this.player.trigger('pause_enter');

    },
    pause:function() {
        console.log('player ' + this.player.model.get('id') + ' : already paused!');
    },

    /**
     * dispatch event "pause_exit"
     */
    exit:function() {
        this.player.trigger('pause_exit');
        console.log('player ' + this.player.model.get('id') + ' : exiting the pausing state ...');
    },
    displayPlayBtn: function() {
        if (this.player.model.get('show_play_btn')) {
            this.player.showDefaultPlayBtn();
        }
        else {
            this.player.hideDefaultPlayBtn();
        }

        this.player.showExtraPlayBtn();
    },
    displayPauseBtn: function() {
        this.player.hidePauseBtn();
    },
    displayLoading: function() {
        this.player.$div_loading.hide();
    },
    displayBackwardBtn: function() {
        this.player.$btn_backward.hide();
    },
    displayForwardBtn: function() {
        this.player.$btn_forward.hide();
    }
});


/**
 * buffering state : the player is in this state when it's buffering
 * @class BufferingState
 * @module JsPlayer
 * @extends BaseState
 */
var BufferingState = BaseState.extend({
    getName:function() {
        return "buffering";
    },

    /**
     * dispatch event "buffer_enter"
     */
    enter:function() {
        console.log('player ' + this.player.model.get('id') + ' : entering the buffering state...');

        this.player.hidePlayBtn();
        this.player.hidePauseBtn();

        this.displayMuteBtn();
        this.player.$div_loading.hide();
        this.player.$div_buffering.show();
        this.displayBufferingPercent();
        this.player.$div_slider.hide();
        this.player.$btn_backward.hide();
        this.player.$btn_forward.hide();

        this.player.trigger('buffering_enter');

    },
    buffer:function() {
        console.log('player ' + this.player.model.get('id') + ' : already buffering!');
    },

    /**
     * dispatch event "buffer_exit"
     */
    exit:function() {
        this.player.trigger('buffer_exit');
        console.log('player ' + this.player.model.get('id') + ' : exiting the buffer state ...');
    },
    displayPlayBtn: function() {
        this.player.hidePlayBtn();
    },
    displayPauseBtn: function() {
        this.player.hidePauseBtn();
    },
    displayLoading: function() {
        this.player.$div_loading.hide();
    },
    displayBackwardBtn: function() {
        this.player.$btn_backward.hide();
    },
    displayForwardBtn: function() {
        this.player.$btn_forward.hide();
    },
    onAudioPlaying: function() {
        this.play();
 	},
    onAudioSpeedChange: function() {
        if (Math.round(this.player.speed) == 1) {
            this.play();
        }
 	}
});