/**
 * Abstract class for the different modes in which the player can be
 * The player use the State Pattern to describe the different modes : init | idle | direct | ts | aod
 * @class BaseMode
 * @module JsPlayer
 * @extends Backbone.Model
 */
var BaseMode = Backbone.Model.extend({
    /**
     * automatically called by Backbone at initialisation
     * @param player
     */
    initialize:function (player) {
        this.player = player;
    },

    /**
     * return the mode name : init | idle | direct | ts | aod
     */
    getName:function() {
        //
    },

    /**
     * called before everything else when entering this mode
     */
    enter:function() {
        //
    },

    /**
     * changing to init mode
     */
    init:function() {
        console.log('player ' + this.player.model.get('id') + ' : changing to init mode...');
        this.player.changeMode(this.player.modes.init);
    },

    /**
     * changing to idle mode
     */
    idle:function() {
        console.log('player ' + this.player.model.get('id') + ' : changing to idle mode...');
        this.player.changeMode(this.player.modes.idle);
    },

    /**
     * changing to direct mode
     */
    direct:function() {
        console.log('player ' + this.player.model.get('id') + ' : changing to direct mode...');
        this.player.changeMode(this.player.modes.direct);
    },

    /**
     * changing to timeshifting mode
     */
    ts:function() {
        if (this.player.model.get("track_url_ts") != "") {
            console.log('player ' + this.player.model.get('id') + ' : changing to timeshifting mode...');
            this.player.changeMode(this.player.modes.ts);
        }
        else {
            console.log('player ' + this.player.model.get('id') + ' : timeshifting not available');
            var title = this.player.model.get('message_alert_title');
            var message = this.player.model.get('message_ts_not_available');
            setTimeout(function() {
                jembe.alert.show({message : message, title : title, buttons:'Fermer'})
            }, 200);
        }
    },

    /**
     * changing to AOD mode
     */
    aod:function() {
        console.log('player ' + this.player.model.get('id') + ' : changing to audio on demand mode...');
        this.player.changeMode(this.player.modes.aod);
    },

    /**
     * called just before leaving this mode for another one
     */
    exit:function() {
        //
    },

    /**
     * change to load state
     */
    load:function() {
        this.player.state.load();
    },

    /**
     * change to play state
     */
    play:function() {
        this.player.state.play();
    },

    /**
     * change to stop state
     */
    stop:function() {
        this.player.state.stop();
    },

    /**
     * change to pause state
     */
    pause:function() {
        this.player.state.pause();
    },

    /**
     * called when receiving the "timeupdate" event from the audio player
     */
    onAudioTimeUpdate: function() {
        //
 	},

    /**
     * called when receiving the "durationchange" event from the audio player
     */
    onAudioDurationChange: function() {
        var d = this.player.audio.getDuration();
        if (!isNaN(d) && isFinite(d) && d > 0) {
            var end = this.player.model.get('time_start_play') + parseInt(d);
            this.player.model.set('time_end', end);
        }
 	},

    /**
     * called when receiving the "playing" event from the audio player
     */
    onAudioPlaying: function () {
        console.log('player ' + this.player.model.get('id') + ' :  event = onAudioPlaying');
        this.player.state.onAudioPlaying();
    },

    /**
     * called when receiving the "waiting" event from the audio player
     */
    onAudioWaiting: function () {
        console.log('player ' + this.player.model.get('id') + ' :  event = onAudioWaiting');
        this.player.state.onAudioWaiting();
    },

    /**
     * called when receiving the "speedchange" event from the audio player
     */
    onAudioSpeedChange: function () {
        console.log('player ' + this.player.model.get('id') + ' :  event = onAudioSpeedChange');
        this.player.state.onAudioSpeedChange();
    },

    /**
     * called when receiving the "ended" event from the audio player
     */
    onAudioEnded: function() {
        console.log('player ' + this.player.model.get('id') + ' :  event = onAudioEnded');
        this.player.$div_info.html('Ended');
        this.idle();
 	},

    /**
     * called when receiving the "error" event from the audio player
     */
    onAudioError: function(event, code, message) {
        console.log('player ' + this.player.model.get('id') + ' :  event = onAudioError : ' + code + " - " + message);
        this.player.$div_info.html('Error : ' + code + " - " + message);
        this.idle();
    },

    /**
     * updates the timeline slider
     */
    updateSliderDrag: function() {
        this.player.$div_slider_handle.draggable("option", "disabled", false);
        this.player.$div_slider_handle.draggable("option", "containment", [
            this.player.getSliderOffset().left,
            this.player.getSliderOffset().top,
            this.player.getSliderOffset().left + this.player.getSliderWidth(),
            this.player.getSliderOffset().top
        ]);
    },

    /**
     * updates the volume slider
     */
    updateVolumeDrag: function() {
        this.player.$div_volume_handle.draggable("option", "disabled", false);
        this.player.$div_volume_handle.draggable("option", "containment", [
            this.player.getVolumeOffset().left,
            this.player.getVolumeOffset().top,
            this.player.getVolumeOffset().left + this.player.getVolumeWidth(),
            this.player.getVolumeOffset().top
        ]);
    },

    /**
     * called when receiving the "onSliderDragStart" event from the timeline slider
     * @param event
     * @param ui
     */
    onSliderDragStart: function(event, ui) {
        //
    },

    /**
     * called when receiving the "onSliderDrag" event from the timeline slider
     * @param event
     * @param ui
     */
    onSliderDrag: function(event, ui) {
        //
    },

    /**
     * called when receiving the "onSliderDragStop" event from the timeline slider
     * @param event
     * @param ui
     */
    onSliderDragStop: function(event, ui) {
        //
    },

    /**
     * seek backward
     */
    backward: function() {
        //
    },

    /**
     * seek forward
     */
    forward: function() {
        //
    },

    /**
     * volume down
     */
    volumeMoins: function() {
        var volume = parseFloat(this.player.model.get("volume")) - parseFloat(this.player.model.get("volume_step"));
        volume = Math.min(Math.max(volume, 0), 1);
        this.player.audio.setVolume(volume);
    },

    /**
     * volume up
     */
    volumePlus: function() {
        var volume = parseFloat(this.player.model.get("volume")) + parseFloat(this.player.model.get("volume_step"));
        volume = Math.min(Math.max(volume, 0), 1);
        this.player.audio.setVolume(volume);
    },

    /**
     * render the time_start view
     */
    renderTimeStart: function() {
        this.player.$div_time_start.html(this.player.model.getRenderTimeStartIdle().call());
    },

    /**
     * render the time_playing view
     */
    renderTimePlaying: function() {
        this.player.$div_time_playing.html(this.player.model.getRenderTimePlayingIdle().call());
    },

    /**
     * render the time_now view
     */
    renderTimeNow: function() {
        this.player.$div_time_now.html(this.player.model.getRenderTimeNowIdle().call());
    },

    /**
     * render the time_end view
     */
    renderTimeEnd: function() {
        this.player.$div_time_end.html(this.player.model.getRenderTimeEndIdle().call());
    }
});


/**
 * init mode : the player is in this mode at start during initialisation
 * @class InitMode
 * @module JsPlayer
 * @extends BaseMode
 */
var InitMode = BaseMode.extend({
    getName:function() {
        return "init";
    },
    init:function() {
        //
    },

    /**
     * dispatch event "init_enter"
     */
    enter:function() {
        console.log('player ' + this.player.model.get('id') + ' : entering the init mode...');
        this.player.trigger('init_enter');

        this.player.$div_info.html("");

        this.player.hidePlayBtn();
        this.player.hidePauseBtn();

        this.player.$btn_mute.hide();
        this.player.$btn_unmute.hide();
        this.player.$div_loading.hide();
        this.player.$div_buffering.hide();
        this.player.$div_slider_handle.hide();
        this.player.$div_seektime.hide();
        this.player.$div_slider_bar.hide();
        this.player.state.displayMuteBtn();
        this.player.state.displaySlider();
        this.player.$btn_backward.hide();
        this.player.$btn_forward.hide();
        this.player.$btn_volume_moins.hide();
        this.player.$btn_volume_plus.hide();

        this.player.onShowModeChanged();
        this.player.onShowTrackNameChanged();
        this.player.onShowTimeStartChanged();
        this.player.onShowTimePlayingChanged();
        this.player.onShowTimeNowChanged();
        this.player.onShowTimeEndChanged();
    },
    idle:function() {
        if (this.player.model.get('ready') > 1) {
            console.log('player ' + this.player.model.get('id') + ' : changing to idle mode...');
            this.player.changeMode(this.player.modes.idle);
        }
        else {
            console.log('player ' + this.player.model.get('id') + ' : changing to idle mode forbidden (not ready)');
        }
    },
    direct:function() {
        //
    },
    ts:function() {
        //
    },
    aod:function() {
        //
    },

    /**
     * dispatch event "init_exit"
     * dispatch event "ready"
     */
    exit:function() {
        this.player.trigger('init_exit');
        this.player.trigger('ready');
    },
    load:function() {
        //
    },
    play:function() {
        //
    },
    stop:function() {
        //
    },
    pause:function() {
        //
    },
    onAudioTimeUpdate: function() {
        //
 	},
    onAudioPlaying: function () {
        //
    },
    onAudioWaiting: function () {
        //
    },
    onAudioSpeedChange: function () {
        //
    },
    onAudioEnded: function() {
        //
 	},
    updateSliderDrag: function() {
        //
    }
});


/**
 * idle mode : the player is doing nothig (equivalent to stop)
 * @class IdleMode
 * @module JsPlayer
 * @extends BaseMode
 */
var IdleMode = BaseMode.extend({
    getName:function() {
        return "idle";
    },
    init:function() {
        //
    },

    /**
     * dispatch event "idle_enter"
     */
    enter:function() {
        console.log('player ' + this.player.model.get('id') + ' : entering the idle mode...');
        this.player.trigger('idle_enter');

        this.player.model.set('track_src', this.player.model.defaults.track_src);
        this.player.model.set('time_shift', this.player.model.defaults.time_shift);
        this.player.model.set('time_start_play', this.player.model.defaults.time_start_play);
        this.player.model.set('time_start', this.player.model.defaults.time_start);
        this.player.model.set('time_now', this.player.model.defaults.time_now);
        this.player.model.set('time_playing', this.player.model.defaults.time_playing);
        this.player.model.set('time_end', this.player.model.defaults.time_end);

        this.player.model.stopClock();

        this.player.hidePlayBtn();
        this.player.hidePauseBtn();

        this.player.$div_loading.hide();
        this.player.$div_buffering.hide();
        this.player.$div_slider_handle.hide();
        this.player.$div_slider_bar.hide();

        this.player.refreshDisplay();

        // first idle() after ready
        if (this.player.model.get('ready') == 2) {
            this.player.model.set('ready', this.player.model.get('ready') + 1);
        }

        // HTML : needed to cancel mp3 loading : audio.src = ""; audio.load();
        // FLASH : be sure not to load an empty URL
        this.player.audio.load();

        // !! FIREFOX : nothing is executed after this.player.audio.load(), don't know why ...

    },
    idle:function() {
        console.log('player ' + this.player.model.get('id') + ' : already in idle mode!');
    },

    /**
     * dispatch event "idle_exit"
     */
    exit:function() {
        console.log('player ' + this.player.model.get('id') + ' : exiting the idle mode ...');
        this.player.trigger('idle_exit');
    },
    load:function() {
        console.log('player ' + this.player.model.get('id') + ' : nothing to load');
    },
    play:function() {
        console.log('player ' + this.player.model.get('id') + ' : start');
        if (this.player.model.get('on_start')) {
            this.player.model.get('on_start').call(this, this.player);
        }
    },
    stop:function() {
        console.log('player ' + this.player.model.get('id') + ' : nothing to stop');
    },
    pause:function() {
        console.log('player ' + this.player.model.get('id') + ' : nothing to pause');
    },
    updateSliderDrag: function() {
        this.player.$div_slider_handle.draggable("option", "disabled", true);
        this.player.$div_slider_handle.draggable("option", "containment", [
            this.player.getSliderOffset().left,
            this.player.getSliderOffset().top,
            this.player.getSliderOffset().left,
            this.player.getSliderOffset().top
        ]);
    },
    onAudioPlaying: function () {
        //
    },
    onAudioWaiting: function () {
        //
    },
    onAudioSpeedChange: function () {
        //
    }
});


/**
 * direct mode : the player is playing a live stream
 * @class DirectMode
 * @module JsPlayer
 * @extends BaseMode
 */
var DirectMode = BaseMode.extend({
    getName:function() {
        return "direct";
    },
    init:function() {
        //
    },

    /**
     * dispatch event "direct_enter"
     */
    enter:function() {
        console.log('player ' + this.player.model.get('id') + ' : entering the direct mode...');
        this.player.trigger('direct_enter');

        JsPlayer.idleOthers(this.player.model.get('id'));

        this.player.model.set('track_src', this.player.model.get('track_url'));
        this.player.model.set('time_shift', 0);
        this.player.model.set('time_start_play', getTimeStamp());
        this.player.model.set('time_playing', getTimeStamp());
        this.player.model.set('time_now', getTimeStamp());

        this.player.resetTimeEvents();

        this.player.model.startClock();

        this.player.$div_slider_handle.show();
        this.player.$div_slider_bar.show();

        this.player.refreshDisplay();

        this.player.load();

    },

    /**
     * dispatch event "direct_exit"
     */
    exit:function() {
        console.log('player ' + this.player.model.get('id') + ' : exiting the direct mode ...');
        this.player.trigger('direct_exit');
        this.player.stop();
        this.player.model.set('track_src', this.player.model.defaults.track_src);
    },
    play:function() {
        if (this.player.model.get('default_to_ts')) {
            var diff = this.player.model.get('time_now') - this.player.model.get('time_playing');
            if (diff > this.player.model.get('default_to_ts_limit')) {
                console.log('player ' + this.player.model.get('id') + ' : time_playing is ' + diff + ' seconds late : switch to TS');
                this.player.ts({ 'time_shift': diff });
            }
            else {
                this.player.state.play();
            }
        }
        else {
            this.player.state.play();
        }
    },
    onAudioTimeUpdate: function() {
        var time_start = this.player.model.get('time_start');
        var time_start_play = this.player.model.get('time_start_play');
        var time_playing = time_start_play + Math.floor(this.player.audio.getCurrentTime());
        var time_end = this.player.model.get('time_end');
        var dt;

        if (time_playing > time_end) {
            dt = time_end - time_start;
            time_end += dt;
            time_start += dt;
        }

        this.player.model.set('time_end', time_end);
        this.player.model.set('time_start_play', time_start_play);
        this.player.model.set('time_playing', time_playing);
        this.player.model.set('time_start', time_start);
 	},
    onAudioDurationChange: function() {
        //
 	},
    updateSliderDrag: function() {
        this.player.$div_slider_handle.draggable("option", "disabled", false);
        this.player.$div_slider_handle.draggable("option", "containment", [
            this.player.getSliderOffset().left,
            this.player.getSliderOffset().top,
            this.player.getSliderOffset().left + this.player.getSliderWidth() * this.player.model.getTimeNowPercent() / 100,
            this.player.getSliderOffset().top
        ]);
    },
    onSliderDragStart: function(event, ui) {
        if (this.player.model.get("show_seektime")) {
            this.player.$div_seektime.show();
        }
    },
    onSliderDrag: function(event, ui) {
        this.player.trigger('seeking');

        if (this.player.model.get("show_seektime")) {
            var p = ui.position.left / this.player.getSliderWidth();
            var t = Math.round(this.player.model.get('time_start') + (p * this.player.model.getDuration()));
            t = Math.max(Math.min(t, this.player.model.get('time_end')), this.player.model.get('time_start'));

            this.player.$div_seektime.html(toHMS(t));
            this.player.$div_seektime.css("left", ui.position.left);
        }
    },
    onSliderDragStop: function(event, ui) {
        this.player.$div_seektime.hide();

        var p = ui.position.left / this.player.getSliderWidth();
        var t = Math.round(this.player.model.get('time_start') + (p * this.player.model.getDuration()));
        t = Math.max(Math.min(t, this.player.model.get('time_end')), this.player.model.get('time_start'));

        var shift = t - this.player.model.get('time_playing');
        if (shift < 0) {
            if (shift < -this.player.model.get('default_to_ts_limit')) {
                console.log('player ' + this.player.model.get('id') + ' : seek > ' + this.player.model.get('default_to_ts_limit') + 'seconds : switch to TS');
                this.player.ts({ 'time_shift': -shift });
            }
            else {
                console.log('player ' + this.player.model.get('id') + ' : seek : < ' + this.player.model.get('default_to_ts_limit') + 'seconds : do nothing');
            }
        }
        else {
            if (this.player.model.get('time_playing') + shift < this.player.model.get('time_now')) {
                //console.log('player ' + this.player.model.get('id') + ' : getCurrentTime() =  ' + this.player.audio.getCurrentTime());
                //console.log('player ' + this.player.model.get('id') + ' : seek to ' + t);
                //this.player.audio.setCurrentTime(t - this.player.model.get('time_start'));
            }
        }
    },
    backward: function() {
        var t = this.player.model.get('time_playing') - this.player.model.get('seek_step');
        if (t > this.player.model.get('time_start')) {
            console.log('player ' + this.player.model.get('id') + ' : backward : switch to TS');
            this.player.ts({ 'time_shift': this.player.model.get('seek_step') });
        }
    },
    forward: function() {
        var t = this.player.model.get('time_playing') + this.player.model.get('seek_step');
        if (t < this.player.model.get('time_now')) {
            console.log('player ' + this.player.model.get('id') + ' : seek to ' + t);
            this.player.audio.setCurrentTime(t);
        }
    },
    renderTimeStart: function() {
        this.player.$div_time_start.html(this.player.model.getRenderTimeStartDirect().call(
            this.player,
            this.player.model.get('time_start'),
            this.player.model.get('time_start') - this.player.model.get('time_start')
        ));
    },

    renderTimePlaying: function() {
        this.player.$div_time_playing.html(this.player.model.getRenderTimePlayingDirect().call(
            this.player,
            this.player.model.get('time_playing'),
            this.player.model.get('time_playing') - this.player.model.get('time_start'),
            this.player.model.getTimePlayingPercent()
        ));
    },

    renderTimeNow: function() {
        this.player.$div_time_now.html(this.player.model.getRenderTimeNowDirect().call(
            this.player,
            this.player.model.get('time_now'),
            this.player.model.get('time_now') - this.player.model.get('time_start'),
            this.player.model.getTimeNowPercent()
        ));
    },

    renderTimeEnd: function() {
        this.player.$div_time_end.html(this.player.model.getRenderTimeEndDirect().call(
            this.player,
            this.player.model.get('time_end'),
            this.player.model.get('time_end') - this.player.model.get('time_start')
        ));
    }
});


/**
 * timeshifting mode : the player is playing a timeshifting stream
 * @class TsMode
 * @module JsPlayer
 * @extends BaseMode
 */
var TsMode = BaseMode.extend({
    getName:function() {
        return "ts";
    },
    init:function() {
        //
    },

    /**
     * dispatch event "ts_enter"
     */
    enter:function() {
        console.log('player ' + this.player.model.get('id') + ' : entering the TS mode...');
        this.player.trigger('ts_enter');

        if (this.player.model.get('time_shift') == 0) {
            this.player.direct();
        }

        JsPlayer.idleOthers(this.player.model.get('id'));

        var time_shift_ts = getTimeStamp() - this.player.model.get('time_shift');
        var time_shift_ts_corrected = time_shift_ts + this.player.model.get('server_delta_time') * 60;
        var time_shift_hms_corrected = this.player.model.get('ts_hms_render')(time_shift_ts_corrected);
        var track_src = this.player.model.get('track_url_ts').replace('%HMS%', time_shift_hms_corrected);

        this.player.model.set('track_src', track_src);
        this.player.model.set('time_start_play', time_shift_ts);
        this.player.model.set('time_playing', time_shift_ts);
        this.player.model.set('time_now', time_shift_ts);

        this.player.resetTimeEvents();

        this.player.model.startClock();

        this.player.$div_slider_handle.show();
        this.player.$div_slider_bar.show();

        this.player.refreshDisplay();

        this.player.load();
    },

    /**
     * dispatch event "ts_exit"
     */
    exit:function() {
        console.log('player ' + this.player.model.get('id') + ' : exiting the TS mode ...');
        this.player.trigger('ts_exit');
        this.player.stop();
        this.player.model.set('track_src', this.player.model.defaults.track_src);
    },
    onAudioTimeUpdate: function() {
        var time_start = this.player.model.get('time_start');
        var time_start_play = this.player.model.get('time_start_play');
        var time_playing = time_start_play + Math.floor(this.player.audio.getCurrentTime());
        var time_end = this.player.model.get('time_end');
        var dt;

        if (time_playing > time_end) {
            dt = time_end - time_start;
            time_end += dt;
            time_start += dt;
        }

        this.player.model.set('time_end', time_end);
        this.player.model.set('time_start_play', time_start_play);
        this.player.model.set('time_playing', time_playing);
        this.player.model.set('time_start', time_start);
 	},
    onAudioDurationChange: function() {
        //
 	},
    updateSliderDrag: function() {
        this.player.$div_slider_handle.draggable("option", "disabled", false);
        this.player.$div_slider_handle.draggable("option", "containment", [
            this.player.getSliderOffset().left,
            this.player.getSliderOffset().top,
            this.player.getSliderOffset().left + this.player.getSliderWidth() * this.player.model.getTimeNowPercent() / 100,
            this.player.getSliderOffset().top
        ]);
    },
    onSliderDragStart: function(event, ui) {
        if (this.player.model.get("show_seektime")) {
            this.player.$div_seektime.show();
        }
    },
    onSliderDrag: function(event, ui) {
        this.player.trigger('seeking');

        if (this.player.model.get("show_seektime")) {
            var p = ui.position.left / this.player.getSliderWidth();
            var t = Math.round(this.player.model.get('time_start') + (p * this.player.model.getDuration()));
            t = Math.max(Math.min(t, this.player.model.get('time_end')), this.player.model.get('time_start'));

            this.player.$div_seektime.html(toHMS(t));
            this.player.$div_seektime.css("left", ui.position.left);
        }
    },
    onSliderDragStop: function(event, ui) {
        this.player.$div_seektime.hide();

        var p = ui.position.left / this.player.getSliderWidth();
        var t = Math.round(this.player.model.get('time_start') + (p * this.player.model.getDuration()));
        t = Math.max(Math.min(t, this.player.model.get('time_end')), this.player.model.get('time_start'));

        // if goto t > 10 secondes from playing time
        if (Math.abs(this.player.model.get('time_playing') - t) > 10) {
            // if goto t > 10 secondes from direct time
            var shift = Math.abs(this.player.model.get('time_now') - t);
            if (shift > 10) {
                console.log('player ' + this.player.model.get('id') + ' : seek : different timeshifting');
                this.player.ts({ 'time_shift': shift });
            }
            else {
                console.log('player ' + this.player.model.get('id') + ' : seek : switch to Direct');
                this.player.direct();
            }
        }
        else {
            console.log('player ' + this.player.model.get('id') + ' : seek : < 10sec = do nothing');
        }
    },
    backward: function() {
        var t = Math.round(this.player.model.get('time_playing') - this.player.model.get('seek_step'));
        t = Math.max(Math.min(t, this.player.model.get('time_end')), this.player.model.get('time_start'));

        // if goto t > 10 secondes from playing time
        if (Math.abs(this.player.model.get('time_playing') - t) > 10) {
            // if goto t > 10 secondes from direct time
            var shift = Math.abs(this.player.model.get('time_now') - t);
            if (shift > 10) {
                console.log('player ' + this.player.model.get('id') + ' : seek : different timeshifting');
                this.player.ts({ 'time_shift': shift });
            }
            else {
                console.log('player ' + this.player.model.get('id') + ' : seek : switch to Direct');
                this.player.direct();
            }
        }
        else {
            console.log('player ' + this.player.model.get('id') + ' : seek : < 10sec = do nothing');
        }
    },
    forward: function() {
        var t = Math.round(this.player.model.get('time_playing') + this.player.model.get('seek_step'));
        t = Math.max(Math.min(t, this.player.model.get('time_end')), this.player.model.get('time_start'));

        // if goto t > 10 secondes from playing time
        if (Math.abs(this.player.model.get('time_playing') - t) > 10) {
            // if goto t > 10 secondes from direct time
            var shift = Math.abs(this.player.model.get('time_now') - t);
            if (shift > 10) {
                console.log('player ' + this.player.model.get('id') + ' : seek : different timeshifting');
                this.player.ts({ 'time_shift': shift });
            }
            else {
                console.log('player ' + this.player.model.get('id') + ' : seek : switch to Direct');
                this.player.direct();
            }
        }
        else {
            console.log('player ' + this.player.model.get('id') + ' : seek : < 10sec = do nothing');
        }
    },
    renderTimeStart: function() {
        this.player.$div_time_start.html(this.player.model.getRenderTimeStartTs().call(
            this.player,
            this.player.model.get('time_start'),
            this.player.model.get('time_start') - this.player.model.get('time_start')
        ));
    },

    renderTimePlaying: function() {
        this.player.$div_time_playing.html(this.player.model.getRenderTimePlayingTs().call(
            this.player,
            this.player.model.get('time_playing'),
            this.player.model.get('time_playing') - this.player.model.get('time_start'),
            this.player.model.getTimePlayingPercent()
        ));
    },

    renderTimeNow: function() {
        this.player.$div_time_now.html(this.player.model.getRenderTimeNowTs().call(
            this.player,
            this.player.model.get('time_now'),
            this.player.model.get('time_now') - this.player.model.get('time_start'),
            this.player.model.getTimeNowPercent()
        ));
    },

    renderTimeEnd: function() {
        this.player.$div_time_end.html(this.player.model.getRenderTimeEndTs().call(
            this.player,
            this.player.model.get('time_end'),
            this.player.model.get('time_end') - this.player.model.get('time_start')
        ));
    }
});


/**
 * AOD mode : the player is playing an AOD track
 * @class AodMode
 * @module JsPlayer
 * @extends BaseMode
 */
var AodMode = BaseMode.extend({
    getName:function() {
        return "aod";
    },
    init:function() {
        //
    },

    /**
     * dispatch event "aod_enter"
     */
    enter:function() {
        console.log('player ' + this.player.model.get('id') + ' : entering the AOD mode...');
        this.player.trigger('aod_enter');

        JsPlayer.idleOthers(this.player.model.get('id'));

        this.player.model.set('track_src', this.player.model.get('track_url'));
        this.player.model.set('track_url_ts', "");
        this.player.model.set('time_shift', 0);
        this.player.model.set('time_start_play', getTimeStamp());
        this.player.model.set('time_playing', getTimeStamp());
        this.player.model.set('time_now', getTimeStamp());
        this.player.model.set('time_end', getTimeStamp());

        this.player.resetTimeEvents();

        this.player.model.stopClock();

        this.player.$div_slider_handle.show();
        this.player.$div_slider_bar.show();

        this.player.refreshDisplay();

        this.player.load();
    },

    /**
     * dispatch event "aod_exit"
     */
    exit:function() {
        console.log('player ' + this.player.model.get('id') + ' : exiting the AOD mode ...');
        this.player.trigger('aod_exit');
        this.player.stop();
        this.player.model.set('track_src', this.player.model.defaults.track_src);
    },
    onAudioTimeUpdate: function() {
        var t = this.player.model.get('time_start_play') + Math.floor(this.player.audio.getCurrentTime());
        this.player.model.set('time_playing', t);
        this.player.model.set('time_now', t);
 	},
    onSliderDragStart: function(event, ui) {
        if (this.player.model.get("show_seektime")) {
            this.player.$div_seektime.show();
        }
    },
    onSliderDrag: function(event, ui) {
        this.player.trigger('seeking');

        if (this.player.model.get("show_seektime")) {
            var p = ui.position.left / this.player.getSliderWidth();
            var t = Math.round(p * this.player.model.getDuration());

            this.player.$div_seektime.html(secondsToHMS(t));
            this.player.$div_seektime.css("left", ui.position.left);
        }
    },
    onSliderDragStop: function(event, ui) {
        this.player.$div_seektime.hide();

        var p = ui.position.left / this.player.getSliderWidth();
        var t = Math.round(p * this.player.model.getDuration());

        console.log('player ' + this.player.model.get('id') + ' : seek to ' + t);
        this.player.audio.setCurrentTime(t);

        this.player.resetTimeEvents();
    },
    backward: function() {
        var t = this.player.model.get('time_playing') - this.player.model.get('seek_step');
        t = Math.max(Math.min(t, this.player.model.get('time_end')), this.player.model.get('time_start'));
        t -= this.player.model.get('time_start');
        console.log('player ' + this.player.model.get('id') + ' : backward : seek to ' + t);
        this.player.audio.setCurrentTime(t);
    },
    forward: function() {
        var t = this.player.model.get('time_playing') + this.player.model.get('seek_step');
        t = Math.max(Math.min(t, this.player.model.get('time_end')), this.player.model.get('time_start'));
        t -= this.player.model.get('time_start');
        console.log('player ' + this.player.model.get('id') + ' : forward : seek to ' + t);
        this.player.audio.setCurrentTime(t);
    },
    renderTimeStart: function() {
        this.player.$div_time_start.html(this.player.model.getRenderTimeStartAod().call(
            this.player,
            this.player.model.get('time_start'),
            this.player.model.get('time_start') - this.player.model.get('time_start')
        ));
    },

    renderTimePlaying: function() {
        this.player.$div_time_playing.html(this.player.model.getRenderTimePlayingAod().call(
            this.player,
            this.player.model.get('time_playing'),
            this.player.model.get('time_playing') - this.player.model.get('time_start'),
            this.player.model.getTimePlayingPercent()
        ));
    },

    renderTimeNow: function() {
        this.player.$div_time_now.html(this.player.model.getRenderTimeNowAod().call(
            this.player,
            this.player.model.get('time_now'),
            this.player.model.get('time_now') - this.player.model.get('time_start'),
            this.player.model.getTimeNowPercent()
        ));
    },

    renderTimeEnd: function() {
        this.player.$div_time_end.html(this.player.model.getRenderTimeEndAod().call(
            this.player,
            this.player.model.get('time_end'),
            this.player.model.get('time_end') - this.player.model.get('time_start')
        ));
    }
});
