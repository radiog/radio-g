/**
 * This is the View
 * @class JsPlayerView
 * @module JsPlayer
 */
var JsPlayerView = Backbone.View.extend({
    /**
     * template to use for the view
     */
    template: null,

    /**
     * automatically called by Backbone at initialisation
     */
    initialize: function() {
        console.log('player ' + this.model.get('id') + ' : JsPlayerView.initialize()');

        this.template = _.template($('#' + this.model.get('template_id')).html());
        this.$el.html(this.template(this.model.toJSON()));

        if (jembe.info.platform == "samsung_tv_2012") {
            console.log('player ' + this.model.get('id') + ' : samsung player');
            this.audio = new JsPlayerSamsung2012View({
                'model' : this.model
            });
        }
        else if (jembe.info.platform == "lg_tv_2012") {
            console.log('player ' + this.model.get('id') + ' : lg player');
            this.audio = new JsPlayerLgNetcastView({
                'model' : this.model,
                'el': this.$el.find(".audio")
            });
        }
        else if (jembe.info.platform == "Windows Phone") {
            console.log('player ' + this.model.get('id') + ' : Windows Phone');
            this.audio = new JsPlayerWp7View({
                'model' : this.model
            });
        }
        else {
            console.log('player ' + this.model.get('id') + ' : web or app player');
            if (JsPlayer.canPlayMp3()) {
                console.log('player ' + this.model.get('id') + ' : can play mp3');

                if (jembe.info.platform == "server") {
                    this.audio = new JsPlayerHtmlView({
                        'model' : this.model,
                        'el': this.$el.find(".audio")
                    });
                }
                else {
                    this.audio = new JsPlayerJembeView({
                        'model' : this.model
                    });
                }
            }
            else {
                console.log('player ' + this.model.get('id') + ' : cannot play mp3');
                this.audio = new JsPlayerFlashView({
                    'model' : this.model,
                    'el': this.$el.find(".audio")
                });
            }
        }

        /**
         * define jQuery object of the view
         */
        this.$div_info = this.$el.find(".info");
        this.$div_buffering = this.$el.find(".buffering");
        this.$div_buffering_percent = this.$el.find(".buffering_percent");
        this.$btn_play = this.$el.find(".btn_play");
        this.$btn_pause = this.$el.find(".btn_pause");
        this.$btn_mute = this.$el.find(".btn_mute");
        this.$btn_unmute = this.$el.find(".btn_unmute");
        this.$btn_backward = this.$el.find(".btn_backward");
        this.$btn_forward = this.$el.find(".btn_forward");
        this.$btn_volume_moins = this.$el.find(".btn_volume_moins");
        this.$btn_volume_plus = this.$el.find(".btn_volume_plus");
        this.$div_volume = this.$el.find(".volume");
        this.$div_volume_bar = this.$el.find(".volume").find(".bar");
        this.$div_volume_handle = this.$el.find(".volume").find(".handle");
        this.$div_loading = this.$el.find(".loading");
        this.$div_slider = this.$el.find(".slider");
        this.$div_slider_bar = this.$el.find(".slider").find(".bar");
        this.$div_slider_handle = this.$el.find(".slider").find(".handle");
        this.$div_seektime = this.$el.find(".seektime");
        this.$div_time_start = this.$el.find(".time_start");
        this.$div_time_playing = this.$el.find(".time_playing");
        this.$div_time_now = this.$el.find(".time_now");
        this.$div_time_end = this.$el.find(".time_end");
        this.$div_track_name = this.$el.find(".track_name");


        /**
         * make timeline slider handle draggable
         */
        this.$div_slider_handle.draggable({
            scroll: false,
            axis: "x"
        });
        this.$div_slider_handle.draggable("option", "containment", [
            this.getSliderOffset().left,
            this.getSliderOffset().top,
            this.getSliderOffset().left,
            this.getSliderOffset().top
        ]);


        /**
         * make volume slider handle draggable
         */
        this.$div_volume_handle.draggable({
            scroll: false,
            axis: "x"
        });
        this.$div_volume_handle.draggable("option", "containment", [
            this.getVolumeOffset().left,
            this.getVolumeOffset().top,
            this.getVolumeOffset().left,
            this.getVolumeOffset().top
        ]);


        this.btns_play = [];
        this.btns_pause = [];

        this.states =  {
            loading: new LoadingState(this),
            playing: new PlayingState(this),
            stopping: new StoppingState(this),
            pausing: new PausingState(this),
            buffering: new BufferingState(this)
        };

        this.modes = {
            init: new InitMode(this),
            idle: new IdleMode(this),
            direct: new DirectMode(this),
            ts: new TsMode(this),
            aod: new AodMode(this)
        };


        this.state = this.states.stopping;

        this.mode = new BaseMode(this);
        this.init();


        _.bindAll(this, 'onKeyDown', 'onClickPlay', 'onClickPause', 'onAudioLoadedMetadata', 'onAudioCanPlay', 'onAudioPlay', 'onAudioPause', 'onAudioPlaying', 'onAudioWaiting', 'onAudioTimeUpdate', 'onAudioEnded', 'onAudioError', 'onAudioVolumeChange', 'onAudioDurationChange');

        /**
         * listen for keyboard
         */
        $(document).on('keydown', this.onKeyDown);

        /**
         * listen for player's view events
         */
        this.audio.on('loadedmetadata', this.onAudioLoadedMetadata);
        this.audio.on('canplay', this.onAudioCanPlay);
        this.audio.on('play', this.onAudioPlay);
        this.audio.on('pause', this.onAudioPause);
        this.audio.on('playing', this.onAudioPlaying);
        this.audio.on('waiting', this.onAudioWaiting);
        this.audio.on('timeupdate', this.onAudioTimeUpdate);
        this.audio.on('ended', this.onAudioEnded);
        this.audio.on('error', this.onAudioError);
        this.audio.on('volumechange', this.onAudioVolumeChange);
        this.audio.on('durationchange', this.onAudioDurationChange);


        /**
         * listen for model values change
         */
        this.model.bind('change:ready', this.onReadyChanged, this);
        this.model.bind('change:time_shift', this.onTimeShiftChanged, this);
        this.model.bind('change:time_start', this.onTimeStartChanged, this);
        this.model.bind('change:time_playing', this.onTimePlayingChanged, this);
        this.model.bind('change:time_now', this.onTimeNowChanged, this);
        this.model.bind('change:time_end', this.onTimeEndChanged, this);
        this.model.bind('change:volume', this.onVolumeChanged, this);
        this.model.bind('change:track_name', this.onTrackNameChanged, this);
        this.model.bind('change:track_src', this.onTrackSrcChanged, this);
        this.model.bind('change:time_event_timestamp', this.onTimeEventTimestampChanged, this);
        this.model.bind('change:time_event_timecode', this.onTimeEventTimecodeChanged, this);
        this.model.bind('change:time_event_percent', this.onTimeEventPercentChanged, this);
        this.model.bind('change:buffering_percent', this.onBufferingPercentChanged, this);
        this.model.bind('change:show_play_btn', this.onShowPlayBtnChanged, this);
        this.model.bind('change:show_pause_btn', this.onShowPauseBtnChanged, this);
        this.model.bind('change:show_extra_play_btn', this.onShowExtraPlayBtnChanged, this);
        this.model.bind('change:show_extra_pause_btn', this.onShowExtraPauseBtnChanged, this);
        this.model.bind('change:show_slider', this.onShowSliderChanged, this);
        this.model.bind('change:show_seektime', this.onShowSeekTimeChanged, this);
        this.model.bind('change:show_loading', this.onShowLoadingChanged, this);
        this.model.bind('change:show_buffering_percent', this.onShowBufferingPercentChanged, this);
        this.model.bind('change:show_mute_btn', this.onShowMuteBtnChanged, this);
        this.model.bind('change:show_forward_btn', this.onShowForwardBtnChanged, this);
        this.model.bind('change:show_backward_btn', this.onShowBackwardBtnChanged, this);
        this.model.bind('change:show_volume_moins_btn', this.onShowVolumeMoinsBtnChanged, this);
        this.model.bind('change:show_volume_plus_btn', this.onShowVolumePlusBtnChanged, this);
        this.model.bind('change:show_volume_slider', this.onShowVolumeSliderChanged, this);
        this.model.bind('change:show_mode', this.onShowModeChanged, this);
        this.model.bind('change:show_track_name', this.onShowTrackNameChanged, this);
        this.model.bind('change:show_time_start', this.onShowTimeStartChanged, this);
        this.model.bind('change:show_time_playing', this.onShowTimePlayingChanged, this);
        this.model.bind('change:show_time_now', this.onShowTimeNowChanged, this);
        this.model.bind('change:show_time_end', this.onShowTimeEndChanged, this);
    },


    /**
     * transform a jQuery object into an extra play button
     * @param $e jQuery object
     */
    addBtnPlay: function($e) {
        var exist = false;
        for (var i in this.btns_play) {
            if (this.btns_play.hasOwnProperty(i)) {
                if (this.btns_play[i].is($e)) {
                    exist = true;
                    break;
                }
            }
        }

        if (!exist) {
            console.log('player ' + this.model.get('id') + ' : add new play button');
            this.btns_play.push($e);
            $e.on('click', this.onClickPlay );
        }
    },

    /**
     * remove extra play button
     * @param $e
     */
    removeBtnPlay: function($e) {
        for (var i in this.btns_play) {
            if (this.btns_play.hasOwnProperty(i)) {
                if (this.btns_play[i].is($e)) {
                    console.log('player ' + this.model.get('id') + ' : remove play button');
                    this.btns_play[i].off('click', this.onClickPlay);
                    this.btns_play[i].splice(i, 1);
                }
            }
        }
    },

    /**
     * transform a jQuery object into an extra pause button
     * @param $e jQuery object
     */
    addBtnPause: function($e) {
        var exist = false;
        for (var i in this.btns_pause) {
            if (this.btns_pause.hasOwnProperty(i)) {
                if (this.btns_pause[i].is($e)) {
                    exist = true;
                    break;
                }
            }
        }

        if (!exist) {
            console.log('player ' + this.model.get('id') + ' : add new pause button');
            this.btns_pause.push($e);
            $e.on('click', this.onClickPause );
        }
    },

    /**
     * remove extra pause button
     * @param $e jQuery object
     */
    removeBtnPause: function($e) {
        for (var i in this.btns_pause) {
            if (this.btns_pause.hasOwnProperty(i)) {
                if (this.btns_pause[i].is($e)) {
                    console.log('player ' + this.model.get('id') + ' : remove pause button');
                    this.btns_pause[i].off('click', this.onClickPause);
                    this.btns_pause[i].splice(i, 1);
                }
            }
        }
    },


    /**
     * show all play buttons
     */
    showPlayBtn: function() {
        this.showDefaultPlayBtn();
        this.showExtraPlayBtn();
    },

    /**
     * show default play button
     */
    showDefaultPlayBtn: function() {
        this.$btn_play.show();
    },

    /**
     * show extra play buttons
     */
    showExtraPlayBtn: function() {
        for (var i in this.btns_play) {
            if (this.btns_play.hasOwnProperty(i)) {
                this.btns_play[i].show();
            }
        }
    },


    /**
     * show all pause buttons
     */
    showPauseBtn: function() {
        this.showDefaultPauseBtn();
        this.showExtraPauseBtn();
    },

    /**
     * show default pause button
     */
    showDefaultPauseBtn: function() {
        this.$btn_pause.show();
    },

    /**
     * show extra pause buttons
     */
    showExtraPauseBtn: function() {
        for (var i in this.btns_pause) {
            if (this.btns_pause.hasOwnProperty(i)) {
                this.btns_pause[i].show();
            }
        }
    },



    /**
     * hide all play buttons
     */
    hidePlayBtn: function() {
        this.hideDefaultPlayBtn();
        this.hideExtraPlayBtn();
    },

    /**
     * hide default play button
     */
    hideDefaultPlayBtn: function() {
        this.$btn_play.hide();
    },

    /**
     * hide extra play buttons
     */
    hideExtraPlayBtn: function() {
        for (var i in this.btns_play) {
            if (this.btns_play.hasOwnProperty(i)) {
                this.btns_play[i].hide();
            }
        }
    },


    /**
     * hide all pause buttons
     */
    hidePauseBtn: function() {
        this.hideDefaultPauseBtn();
        this.hideExtraPauseBtn();
    },

    /**
     * hide default pause button
     */
    hideDefaultPauseBtn: function() {
        this.$btn_pause.hide();
    },

    /**
     * hide extra pause buttons
     */
    hideExtraPauseBtn: function() {
        for (var i in this.btns_pause) {
            if (this.btns_pause.hasOwnProperty(i)) {
                this.btns_pause[i].hide();
            }
        }
    },


    /**
     * handle changing state
     * @param state
     */
    changeState:function (state) {
        if (this.state) {
            this.state.exit();
        }
        this.state = state;
        this.state.enter();
    },

    /**
     * return the name of the current state : loading | playing | stopping | pausing
     * @return {*|String}
     */
    getStateName: function() {
        return this.state.getName()
    },

    /**
     * change to init mode
     */
    init:function() {
        this.mode.init();
    },

    /**
     * change to idle mode
     */
    idle:function() {
        this.mode.idle();
    },

    /**
     * change to direct mode
     * if options.url_ts == "" timeshifting won't be available
     * @param options
     */
    direct:function(options) {
        if (options) {
            for (var i in options) {
                if (options.hasOwnProperty(i)) {
                    this.model.set(i, options[i]);
                }
            }
        }

        this.mode.direct();
    },

    /**
     * change to timeshifting mode
     * if options.url_ts == "" timeshifting won't be available
     * @param options
     */
    ts:function(options) {
        if (options) {
            for (var i in options) {
                if (options.hasOwnProperty(i)) {
                    this.model.set(i, options[i]);
                }
            }
        }

        this.mode.ts();
    },

    /**
     * change to Aod mode
     * @param options
     */
    aod:function(options) {
        if (options) {
            for (var i in options) {
                if (options.hasOwnProperty(i)) {
                    this.model.set(i, options[i]);
                }
            }
        }

        this.mode.aod();
    },


    /**
     * change to loading state
     */
    load:function() {
        this.mode.load();
    },

    /**
     * change to playing state
     */
    play:function() {
        this.mode.play();
    },

    /**
     * change to stopping state
     */
    stop:function() {
        this.mode.stop();
    },

    /**
     * change to pausing state
     */
    pause:function() {
        this.mode.pause();
    },

    /**
     * change to buffering state
     */
    buffer:function() {
        this.state.buffer();
    },

    /**
     * mute
     */
    mute:function() {
        this.audio.mute();
    },

    /**
     * unmute
     */
    unmute:function() {
        this.audio.unmute();
    },

    /**
     * toggle mute/unmute
     */
    mute_unmute:function() {
        if (this.audio.getMute()) {
            this.audio.unmute();
        }
        else {
            this.audio.mute();
        }
    },

    /**
     * move playhead forward
     */
    forward:function() {
        this.mode.forward();
    },

    /**
     * move playhead backward
     */
    backward:function() {
        this.mode.backward();
    },

    /**
     * handle changing mode
     * @param mode
     */
    changeMode:function (mode) {
        if (this.mode) {
            this.mode.exit();
        }
        this.mode = mode;
        this.mode.enter();
    },

    /**
     * returns actual mode name
     * @return {*}
     */
    getModeName: function() {
        return this.mode.getName()
    },


    /**
     * define events handlers
     */
    events: {
        'click .btn_play': 'onClickPlay',
        'click .btn_pause': 'onClickPause',
        'click .btn_mute': 'onClickMute',
        'click .btn_unmute': 'onClickUnmute',
        'click .btn_backward': 'onClickBackward',
        'click .btn_forward': 'onClickForward',
        'click .btn_volume_moins': 'onClickVolumeMoins',
        'click .btn_volume_plus': 'onClickVolumePlus',

        'mousedown .slider': 'onSliderClick',
        'dragstart .slider .handle': 'onSliderDragStart',
        'drag .slider .handle': 'onSliderDrag',
        'dragstop .slider .handle': 'onSliderDragStop',

        'mousedown .volume': 'onVolumeClick',
        'dragstart .volume .handle': 'onVolumeDragStart',
        'drag .volume .handle': 'onVolumeDrag',
        'dragstop .volume .handle': 'onVolumeDragStop'
 	},


    /**
     *
     */
    onAudioLoadedMetadata: function() {
        this.state.onAudioLoadedMetadata();
 	},

    /**
     *
     */
    onAudioCanPlay: function() {
        this.state.onAudioCanPlay();
 	},

    /**
     *
     */
    onAudioPlay: function() {
        this.state.onAudioPlay();
 	},

    /**
     *
     */
    onAudioPause: function() {
        this.state.onAudioPause();
 	},

    /**
     *
     */
    onAudioPlaying: function() {
        this.mode.onAudioPlaying();
 	},

    /**
     *
     */
    onAudioWaiting: function() {
        this.mode.onAudioWaiting();
 	},

    /**
     *
     */
    onAudioTimeUpdate: function() {
        this.mode.onAudioTimeUpdate();
 	},

    /**
     *
     */
    onAudioEnded: function() {
		console.log('view.jembe.js >> onAudioEnded >> trigger ended')
        this.mode.onAudioEnded();
 	},

    /**
     *
     */
    onAudioError: function(event, code, message) {
        this.mode.onAudioError(event, code, message);
    },

    /**
     *
     */
    onAudioVolumeChange: function() {
        this.model.set('volume', this.audio.getVolume());
 	},

    /**
     *
     */
    onAudioDurationChange: function() {
        this.mode.onAudioDurationChange();
 	},

    /**
     *
     */
    onAudioSpeedChange: function () {
        this.mode.onAudioSpeedChange();
    },

    /**
     *
     */
    //onAudioBufferingStart: function () {
    //    this.mode.onAudioBufferingStart();
    //},

    /**
     *
     */
    //onAudioBufferingEnd: function () {
    //    this.mode.onAudioBufferingEnd();
    //},


    /**
     *
     */
    onClickPlay: function() {
        console.log('player ' + this.model.get('id') + ' : event = onClickPlay');
        this.play();
 	},

    /**
     *
     */
    onClickPause: function() {
        console.log('player ' + this.model.get('id') + ' : event = onClickPause');
        this.pause();
 	},

    /**
     *
     */
    onClickMute: function() {
        console.log('player ' + this.model.get('id') + ' : event = onClickMute');
        this.mute();
 	},

    /**
     *
     */
    onClickUnmute: function() {
        console.log('player ' + this.model.get('id') + ' : event = onClickUnmute');
        this.unmute();
 	},

    /**
     *
     */
    onClickMuteUnmute: function() {
        console.log('player ' + this.model.get('id') + ' : event = onClickMuteUnmute');
        this.mute_unmute();
    },

    /**
     *
     */
    onClickBackward: function() {
        console.log('player ' + this.model.get('id') + ' : event = onClickBackward');
        this.mode.backward();
    },

    /**
     *
     */
    onClickForward: function() {
        console.log('player ' + this.model.get('id') + ' : event = onClickForward');
        this.mode.forward();
    },

    /**
     *
     */
    onClickVolumeMoins: function() {
        console.log('player ' + this.model.get('id') + ' : event = onClickVolumeMoins');
        this.mode.volumeMoins();
    },

    /**
     *
     */
    onClickVolumePlus: function() {
        console.log('player ' + this.model.get('id') + ' : event = onClickVolumePlus');
        this.mode.volumePlus();
    },


    /**
     *
     */
    onSliderClick: function() {
        this.mode.updateSliderDrag();
    },

    /**
     *
     */
    onSliderDragStart: function(event, ui) {
        this.mode.onSliderDragStart(event, ui);
    },

    /**
     *
     */
    onSliderDrag: function(event, ui) {
        this.mode.onSliderDrag(event, ui);
    },

    /**
     *
     */
    onSliderDragStop: function(event, ui) {
        this.mode.onSliderDragStop(event, ui);
    },


    /**
     *
     */
    onVolumeClick: function() {
        this.mode.updateVolumeDrag();
    },

    /**
     *
     */
    onVolumeDragStart: function(event, ui) {
        //
    },

    /**
     *
     */
    onVolumeDrag: function(event, ui) {
        var v = ui.position.left / this.getVolumeWidth();
        this.audio.setVolume(v);
    },

    /**
     *
     */
    onVolumeDragStop: function(event, ui) {
        //
    },

    /**
     *
     */
    onKeyDown: function(event) {
        var key_code = event.keyCode;

        if (this.audio.keys && this.audio.keys[key_code]) {
            var action = this.audio.keys[key_code];

            if (action == "play") {
                this.onClickPlay();
            }
            else if (action == "pause") {
                this.onClickPause();
            }
            else if (action == "stop") {
                this.onClickPause();
            }
            else if (action == "backward") {
                this.onClickBackward();
            }
            else if (action == "forward") {
                this.onClickForward();
            }
            else if (action == "mute-unmute") {
                this.onClickMuteUnmute();
            }
            else if (action == "volume_moins") {
                this.onClickVolumeMoins();
            }
            else if (action == "volume_plus") {
                this.onClickVolumePlus();
            }
        }
    },


    /**
     * called by the player
     * launch on_ready function if the player is ready
     */
    onReadyChanged: function() {
        // jsPlayerView and JsplayerHtmlView|JsPlayerFlashView are ready
        if (this.model.get('ready') == 2) {
            this.idle();
        }
        // just after first idle() after ready
        else if (this.model.get('ready') == 3) {
            this.isReady();
            if (this.model.get('on_ready')) {
				this.model.get('on_ready').call(this, this);
                /*
                // no autoplay on mobile devices -> transform on_ready into on_start
 				if (!DetectTierIphone()) {
                    console.log(">>>>>> NOT mobile");
                    this.model.get('on_ready').call(this, this);
                }
                else {
                    this.model.set('on_start', this.model.get('on_ready'));

                    console.log(">>>>>> mobile");
                    console.log(this.model.get('on_ready'));
                    console.log(this.model.get('on_start'));

                }
*/
            }
        }
    },

    /**
     * called when the player is ready
     */
    isReady: function() {
        this.model.set("volume", this.audio.getVolume());
        this.refreshDisplay();
    },

    /**
     * render default values
     */
    refreshDisplay : function () {
        this.onTimeShiftChanged();
        this.onTimeStartChanged();
        this.onTimePlayingChanged();
        this.onTimeNowChanged();
        this.onTimeEndChanged();
        this.onVolumeChanged();
        this.onTrackNameChanged();
        this.onTrackSrcChanged();
        this.onShowPlayBtnChanged();
        this.onShowPauseBtnChanged();
        this.onShowSliderChanged();
        this.onShowSeekTimeChanged();
        this.onShowLoadingChanged();
        this.onShowBufferingPercentChanged();
        this.onShowMuteBtnChanged();
        this.onShowForwardBtnChanged();
        this.onShowBackwardBtnChanged();
        this.onShowVolumeMoinsBtnChanged();
        this.onShowVolumePlusBtnChanged();
        this.onShowVolumeSliderChanged();
        this.onShowModeChanged();
        this.onShowTrackNameChanged();
        this.onShowTimeStartChanged();
        this.onShowTimePlayingChanged();
        this.onShowTimeNowChanged();
        this.onShowTimeEndChanged();
    },


    /**
     *
     */
    onTimeShiftChanged: function() {
        //
    },

    /**
     *
     */
    onTimeStartChanged: function() {
        if (this.model.get('show_slider')) {
            this.mode.updateSliderDrag();
            this.renderSlider();
        }

        if (this.model.get('show_time_start')) {
            this.mode.renderTimeStart();
        }
    },

    /**
     *
     */
    onTimeNowChanged: function() {
        if (this.model.get('show_slider')) {
            this.mode.updateSliderDrag();
            this.renderSlider();
        }

        if (this.model.get('show_time_now')) {
            this.mode.renderTimeNow();
        }
    },

    /**
     *
     */
    onTimePlayingChanged: function() {
        this.checkTimeEvents();

        if (this.model.get('show_slider')) {
            this.mode.updateSliderDrag();
            this.renderSlider();
        }

        if (this.model.get('show_time_playing')) {
            this.mode.renderTimePlaying();
        }
    },

    /**
     *
     */
    onTimeEndChanged: function() {
        if (this.model.get('show_slider')) {
            this.mode.updateSliderDrag();
            this.renderSlider();
        }

        if (this.model.get('show_time_end')) {
            this.mode.renderTimeEnd();
        }
    },

    /**
     *
     */
    onTrackNameChanged: function() {
        this.renderTrackName();
    },

    /**
     *
     */
    onTrackSrcChanged: function() {
        console.log('player ' + this.model.get('id') + ' : track_src = ' + this.model.get("track_src"));
        this.audio.setSrc(this.model.get('track_src'));
    },

    /**
     *
     */
    onTimeEventTimestampChanged : function () {
        this.initTimeEvents();
    },

    /**
     *
     */
    onTimeEventTimecodeChanged : function () {
        this.initTimeEvents();
    },

    /**
     *
     */
    onTimeEventPercentChanged : function () {
        this.initTimeEvents();
    },

    /**
     *
     */
    onBufferingPercentChanged : function () {
        this.$div_buffering_percent.html(this.model.get("buffering_percent") + "%");
    },

    /**
     * handle time_event_* events
     */
    initTimeEvents : function() {
        var time_event_timestamp = this.model.get('time_event_timestamp');
        time_event_timestamp.sort(function(a, b) {return b - a});
        this.model.set('time_event_timestamp', time_event_timestamp);

        var time_event_timecode = this.model.get('time_event_timecode');
        time_event_timecode.sort(function(a, b) {return b - a});
        this.model.set('time_event_timecode', time_event_timecode);

        var time_event_percent = this.model.get('time_event_percent');
        time_event_percent.sort(function(a, b) {return b - a});
        this.model.set('time_event_percent', time_event_percent);
    },

    /**
     * handle time_event_* events
     */
    resetTimeEvents : function () {
        this.model.set('time_event_sent', []);
    },

    /**
     * handle time_event_* events
     */
    checkTimeEvents : function () {
        var i, t, e, et;

        var time_event_timestamp = this.model.get('time_event_timestamp');
        var time_event_timecode = this.model.get('time_event_timecode');
        var time_event_percent = this.model.get('time_event_percent');

        var sent = this.model.get('time_event_sent');

        for (i in time_event_timestamp) {
            t = time_event_timestamp[i];
            e = 'TIME_EVENT_TIMESTAMP';
            et = e + "_" + t;

            if (inArray(et, sent)) {
                break;
            }
            else if (this.model.get('time_playing') >= t) {
                sent.push(et);
                this.model.set('time_event_sent', sent);
                console.log(e + " : " + t);
                this.trigger(e, t);
                break;
            }
        }

        for (i in time_event_timecode) {
            t = time_event_timecode[i];
            e = 'TIME_EVENT_TIMECODE';
            et = e + "_" + t;

            if (inArray(et, sent)) {
                break;
            }
            else if (this.model.get('time_playing') - this.model.get('time_start') >= t) {
                sent.push(et);
                this.model.set('time_event_sent', sent);
                console.log(e + " : " + t);
                this.trigger(e, t);
                break;
            }
        }

        for (i in time_event_percent) {
            t = time_event_percent[i];
            e = 'TIME_EVENT_PERCENT';
            et = e + "_" + t;

            if (inArray(et, sent)) {
                break;
            }
            else if (this.model.getTimePlayingPercent() >= t) {
                sent.push(et);
                this.model.set('time_event_sent', sent);
                console.log(e + " : " + t);
                this.trigger(e, t);
                break;
            }
        }
    },


    /**
     *
     */
    onVolumeChanged: function() {
        //console.log('player ' + this.model.get('id') + ' : volume = ' + this.model.get("volume"));
        this.state.displayMuteBtn();
        this.renderVolume();
        this.trigger('volume_change');
    },


    /**
     *
     */
    onShowPlayBtnChanged: function() {
        this.state.displayPlayBtn();
    },

    /**
     *
     */
    onShowPauseBtnChanged: function() {
        this.state.displayPauseBtn();
    },

    /**
     *
     */
    onShowExtraPlayBtnChanged: function() {
        this.state.displayExtraPlayBtn();
    },

    /**
     *
     */
    onShowExtraPauseBtnChanged: function() {
        this.state.displayExtraPauseBtn();
    },

    /**
     *
     */
    onShowSliderChanged: function() {
        this.state.displaySlider();
    },

    /**
     *
     */
    onShowSeekTimeChanged: function() {
        //
    },

    /**
     *
     */
    onShowLoadingChanged: function() {
        this.state.displayLoading();
    },

    /**
     *
     */
    onShowBufferingPercentChanged: function() {
        this.state.displayBufferingPercent();
    },

    /**
     *
     */
    onShowMuteBtnChanged: function() {
        this.state.displayMuteBtn();
    },

    /**
     *
     */
    onShowBackwardBtnChanged: function() {
        this.state.displayBackwardBtn();
    },

    /**
     *
     */
    onShowForwardBtnChanged: function() {
        this.state.displayForwardBtn();
    },

    /**
     *
     */
    onShowVolumeMoinsBtnChanged: function() {
        this.state.displayVolumeMoinsBtn();
    },

    /**
     *
     */
    onShowVolumePlusBtnChanged: function() {
        this.state.displayVolumePlusBtn();
    },

    /**
     *
     */
    onShowVolumeSliderChanged: function() {
        this.state.displayVolumeSlider();
    },

    /**
     *
     */
    onShowModeChanged: function() {
        if (this.model.get('show_mode')) {
            this.$div_info.show();
        }
        else {
            this.$div_info.hide();
        }
    },

    /**
     *
     */
    onShowTrackNameChanged: function() {
        if (this.model.get('show_track_name')) {
            this.$div_track_name.show();
        }
        else {
            this.$div_track_name.hide();
        }
    },

    /**
     *
     */
    onShowTimeStartChanged: function() {
        if (this.model.get('show_time_start')) {
            this.$div_time_start.show();
        }
        else {
            this.$div_time_start.hide();
        }
    },

    /**
     *
     */
    onShowTimePlayingChanged: function() {
        if (this.model.get('show_time_playing')) {
            this.$div_time_playing.show();
        }
        else {
            this.$div_time_playing.hide();
        }
    },

    /**
     *
     */
    onShowTimeNowChanged: function() {
        if (this.model.get('show_time_now')) {
            this.$div_time_now.show();
        }
        else {
            this.$div_time_now.hide();
        }
    },

    /**
     *
     */
    onShowTimeEndChanged: function() {
        if (this.model.get('show_time_end')) {
            this.$div_time_end.show();
        }
        else {
            this.$div_time_end.hide();
        }
    },


    /**
     * render timeline slider view
     */
    renderSlider: function() {
        this.$div_slider_bar.css("width", this.model.getTimeNowPercent() + "%");

        if (!this.$div_slider_handle.hasClass('ui-draggable-dragging')) {
            this.$div_slider_handle.css("left", this.model.getTimePlayingPercent() + "%");
        }
    },


    /**
     * render volume slider view
     */
    renderVolume: function() {
        this.$div_volume_bar.css("width", this.model.getVolumePercent() + "%");

        if (!this.$div_volume_handle.hasClass('ui-draggable-dragging')) {
            this.$div_volume_handle.css("left", this.model.getVolumePercent() + "%");
        }
    },


    /**
     * render track_name div
     */
    renderTrackName: function() {
        this.$div_track_name.html(this.model.get('track_name'));
    },

    /**
     *
     */
    render: function() {

    },


    /**
     * get timeline slider view boundaries
     * @return {*}
     */
    getSliderOffset: function() {
        return this.$div_slider.offset();
    },

    /**
     * get timeline slider view width
     * @return {*}
     */
    getSliderWidth: function() {
        return this.$div_slider.width();
    },


    /**
     * get volume slider view boundaries
     * @return {*}
     */
    getVolumeOffset: function() {
        return this.$div_volume.offset();
    },

    /**
     * get volume slider view width
     * @return {*}
     */
    getVolumeWidth: function() {
        return this.$div_volume.width();
    }

});

