/**
 * This is the Model
 * @class JsPlayerModel
 * @module JsPlayer
 */
var JsPlayerModel = Backbone.GSModel.extend({

    /**
     * private variable with their default values
     * they all have a getter and a setter
     */
    defaults : {
        /**
         *
         */
        ready: 0,

        /**
         *
         */
        template_id: 'player-template',

        /**
         * if not null this function is called (with the player as parameter) when the player is ready.
         */
        on_ready: null,

        /**
         * if not null this function is called (with the player as parameter) when the player click the play button in IDLE mode
         */
        on_start: null,

        /**
         *
         */
        swf_path: 'flash/JsPlayer/jsplayer.swf',

        /**
         * player's unique id
         */
        id : "",

        /**
         * track name
         */
        track_name: "?",

        /**
         * Url of the track
         */
        track_src: "",

        /**
         * Url of the track
         */
        track_url: "",

        /**
         * Url of the timeshifting track
         * Append ?date=%HMS% and HMS will be replaced by time_shift
         */
        track_url_ts: "",

        /**
         * function used to format %HMS%
         * @param timestamp
         * @return {String}
         */
        ts_hms_render: function(timestamp) {
            var d = new Date(timestamp * 1000);
            return paddingZero(d.getHours()) + ':' + paddingZero(d.getMinutes()) + ':' + paddingZero(d.getSeconds());
        },

        /**
         *
         */
        track_duration: 0,

        /**
         * difference in seconds with the direct timecode
         */
        time_shift: 0,

        /**
         * timestamp of the start of the track
         */
        time_start: 0,

        /**
         *
         */
        time_start_play: 0,

        /**
         * timestamp of the position of the playhead
         */
        time_playing: 0,

        /**
         * actual timestamp
         */
        time_now: 0,

        /**
         * timestamp of the end of the track
         */
        time_end: 0,

        /**
         *
         */
        volume: 0.5,

        /**
         * step in seconds for the forward and backward buttons
         */
        seek_step: 30,

        /**
         * steps for the volume
         */
        volume_step: 0.02,

        /**
         *
         */
        clock: false,

        /**
         * difference in minutes betwwen the server time and GMT
         */
        server_delta_time: 0,

        time_event_sent: [],

        /**
         * array of timestamps for which the event TIME_EVENT_TIMESTAMP will be sent
         */
        time_event_timestamp: [],

        /**
         * array of timecodes for which the event TIME_EVENT_TIMECODE will be sent
         */
        time_event_timecode: [],

        /**
         * array of percents for which the event TIME_EVENT_PERCENT will be sent
         */
        time_event_percent: [],

        /**
         * show or hide the play button
         */
        show_play_btn: true,

        /**
         *
         */
        show_pause_btn: true,

        /**
         *
         */
        show_slider: true,

        /**
         *
         */
        show_seektime: true,

        /**
         *
         */
        show_loading: true,

        /**
         *
         */
        show_mute_btn: true,

        /**
         *
         */
        show_forward_btn: false,

        /**
         *
         */
        show_backward_btn: false,

        /**
         *
         */
        show_volume_slider: true,

        /**
         *
         */
        show_volume_moins_btn: false,

        /**
         *
         */
        show_volume_plus_btn: false,

        /**
         *
         */
        show_mode: false,

        /**
         *
         */
        show_track_name: false,

        /**
         *
         */
        show_time_start: false,

        /**
         *
         */
        show_time_playing: false,

        /**
         *
         */
        show_time_now: false,

        /**
         *
         */
        show_time_end: false,

        /**
         *
         */
        show_buffering_percent: false,

        /**
         * set to true to switch to TS if time_playing is more than default_to_ts_limit seconds late (only in direct mode)
         */
        default_to_ts : false,

        /**
         * time limit (in seconds) if default_to_ts == true
         */
        default_to_ts_limit : 10,

        /**
         * function to render time_start
         * used if the corresponding render_time_start_* function is null
         * @param timestamp
         * @param timecode
         * @return {String}
         */
        render_time_start: function(timestamp, timecode) { return "start : " + timestamp },

        /**
         * function to render time_start in idle mode
         * @param timestamp
         * @param timecode
         * @return {String}
         */
        render_time_start_idle: function(timestamp, timecode) { return "--" },

        /**
         * function to render time_start in direct mode
         * @param timestamp
         * @param timecode
         * @return {String}
         */
        render_time_start_direct: null,

        /**
         * function to render time_start in ts mode
         * @param timestamp
         * @param timecode
         * @return {String}
         */
        render_time_start_ts: null,

        /**
         * function to render time_start in aod mode
         * @param timestamp
         * @param timecode
         * @return {String}
         */
        render_time_start_aod: null,

        /**
         * idem render_time_start
         * @param timestamp
         * @param timecode
         * @param percent
         * @return {String}
         */
        render_time_playing: function(timestamp, timecode, percent) { return "playing : " + timestamp },

        /**
         * @param timestamp
         * @param timecode
         * @param percent
         * @return {String}
         */
        render_time_playing_idle: function(timestamp, timecode, percent) { return "--" },

        /**
         * @param timestamp
         * @param timecode
         * @param percent
         * @return {String}
         */
        render_time_playing_direct: null,

        /**
         * @param timestamp
         * @param timecode
         * @param percent
         * @return {String}
         */
        render_time_playing_ts: null,

        /**
         * @param timestamp
         * @param timecode
         * @param percent
         * @return {String}
         */
        render_time_playing_aod: null,

        /**
         * idem render_time_start
         * @param timestamp
         * @param timecode
         * @param percent
         * @return {String}
         */
        render_time_now: function(timestamp, timecode, percent) { return "now : " + timestamp },

        /**
         * @param timestamp
         * @param timecode
         * @param percent
         * @return {String}
         */
        render_time_now_idle: function(timestamp, timecode, percent) { return "--" },

        /**
         * @param timestamp
         * @param timecode
         * @param percent
         * @return {String}
         */
        render_time_now_direct: null,

        /**
         * @param timestamp
         * @param timecode
         * @param percent
         * @return {String}
         */
        render_time_now_ts: null,

        /**
         * @param timestamp
         * @param timecode
         * @param percent
         * @return {String}
         */
        render_time_now_aod: null,

        /**
         * idem render_time_start
         * @param timestamp
         * @param timecode
         * @return {String}
         */
        render_time_end: function(timestamp, timecode) { return "end : " + timestamp },

        /**
         * @param timestamp
         * @param timecode
         * @return {String}
         */
        render_time_end_idle: function(timestamp, timecode) { return "--" },

        /**
         * @param timestamp
         * @param timecode
         * @return {String}
         */
        render_time_end_direct: null,

        /**
         * @param timestamp
         * @param timecode
         * @return {String}
         */
        render_time_end_ts: null,

        /**
         * @param timestamp
         * @param timecode
         * @return {String}
         */
        render_time_end_aod: null,

        /**
         * Title for the alert box
         * @param timestamp
         * @param timecode
         * @return {String}
         */
        message_alert_title: 'Info',

        /**
         * message when timeshifting is not available
         * @param timestamp
         * @param timecode
         * @return {String}
         */
        message_ts_not_available: 'Timeshifting not available'
    },

    /**
     * setters
     * @param attrs
     * @return {String}
     */
    setters: {
        track_duration : function (value) {
            return parseInt(value);
        },
        time_shift : function (value) {
            return parseInt(value);
        },
        time_start_play : function (value) {
            return parseInt(value);
        },
        time_playing : function (value) {
            return parseInt(value);
        },
        time_now : function (value) {
            return parseInt(value);
        },
        time_end : function (value) {
            return parseInt(value);
        },
        volume : function (value) {
            return parseFloat(value);
        },
        seek_step : function (value) {
            return parseInt(value);
        },
        volume_step : function (value) {
            return parseFloat(value);
        }
    },

    /**
     * validates the values (automatically called by BackboneJs)
     * @param attrs
     * @return {String}
     */
    validate: function(attrs) {
        if (attrs.time_end < attrs.time_start) {
            console.log('player ' + this.get('id') + ' : error! : time_end < time_start');
            return "error! : time_end < time_start";
        }
    },

    /**
     *
     */
    initialize: function() {
        _.bindAll(this, 'tictac');
    },

    /**
     *
     */
    startClock: function() {
        if (!this.clock) {
            this.clock = window.setInterval(this.tictac, 250);
        }
    },

    /**
     *
     */
    stopClock: function() {
        clearInterval(this.clock);
        this.clock = false;
    },

    /**
     * update time_now every 1/250 dec
     */
    tictac: function() {
        this.set({time_now: getTimeStamp()});
    },


    /**
     * get track duration
     * @return {*}
     */
    getDuration: function() {
        var p = this.get('time_end') - this.get('time_start');
        p = Math.max(0, p);
        return isFinite(p) ? p : 0;
    },

    /**
     * get time_now in percent
     * @return {Number}
     */
    getTimeNowPercent: function() {
        var p = ((this.get('time_now') - this.get('time_start')) * 100) / this.getDuration();
        p = Math.round(Math.max(0, Math.min(100, p)));
        return isFinite(p) ? p : 0;
    },

    /**
     * get time_playing in percent
     * @return {Number}
     */
    getTimePlayingPercent: function() {
        var p = ((this.get('time_playing') - this.get('time_start')) * 100) / this.getDuration();
        p = Math.round(Math.max(0, Math.min(100, p)));
        return isFinite(p) ? p : 0;
    },

    /**
     * get volume in percent
     * @return {Number}
     */
    getVolumePercent: function() {
        return Math.round(this.get('volume') * 100);
    },


    /**
     * get function to render time_start in Idle mode
     * @return {*}
     */
    getRenderTimeStartIdle: function() {
        return this.get('render_time_start_idle') ? this.get('render_time_start_idle') : this.get('render_time_start');
    },

    /**
     * get function to render time_playing in Idle mode
     * @return {*}
     */
    getRenderTimePlayingIdle: function() {
        return this.get('render_time_playing_idle') ? this.get('render_time_playing_idle') : this.get('render_time_playing');
    },

    /**
     * get function to render time_now in Idle mode
     * @return {*}
     */
    getRenderTimeNowIdle: function() {
        return this.get('render_time_now_idle') ? this.get('render_time_now_idle') : this.get('render_time_now');
    },

    /**
     * get function to render time_end in Idle mode
     * @return {*}
     */
    getRenderTimeEndIdle: function() {
        return this.get('render_time_end_idle') ? this.get('render_time_end_idle') : this.get('render_time_end');
    },
    

    /**
     * get function to render time_start in Direct mode
     * @return {*}
     */
    getRenderTimeStartDirect: function() {
        return this.get('render_time_start_direct') ? this.get('render_time_start_direct') : this.get('render_time_start');
    },

    /**
     * get function to render time_playing in Direct mode
     * @return {*}
     */
    getRenderTimePlayingDirect: function() {
        return this.get('render_time_playing_direct') ? this.get('render_time_playing_direct') : this.get('render_time_playing');
    },

    /**
     * get function to render time_now in Direct mode
     * @return {*}
     */
    getRenderTimeNowDirect: function() {
        return this.get('render_time_now_direct') ? this.get('render_time_now_direct') : this.get('render_time_now');
    },

    /**
     * get function to render time_end in Direct mode
     * @return {*}
     */
    getRenderTimeEndDirect: function() {
        return this.get('render_time_end_direct') ? this.get('render_time_end_direct') : this.get('render_time_end');
    },
    

    /**
     * get function to render time_start in Ts mode
     * @return {*}
     */
    getRenderTimeStartTs: function() {
        return this.get('render_time_start_ts') ? this.get('render_time_start_ts') : this.get('render_time_start');
    },

    /**
     * get function to render time_playing in Ts mode
     * @return {*}
     */
    getRenderTimePlayingTs: function() {
        return this.get('render_time_playing_ts') ? this.get('render_time_playing_ts') : this.get('render_time_playing');
    },

    /**
     * get function to render time_now in Ts mode
     * @return {*}
     */
    getRenderTimeNowTs: function() {
        return this.get('render_time_now_ts') ? this.get('render_time_now_ts') : this.get('render_time_now');
    },

    /**
     * get function to render time_end in Ts mode
     * @return {*}
     */
    getRenderTimeEndTs: function() {
        return this.get('render_time_end_ts') ? this.get('render_time_end_ts') : this.get('render_time_end');
    },
    

    /**
     * get function to render time_start in Aod mode
     * @return {*}
     */
    getRenderTimeStartAod: function() {
        return this.get('render_time_start_aod') ? this.get('render_time_start_aod') : this.get('render_time_start');
    },

    /**
     * get function to render time_playing in Aod mode
     * @return {*}
     */
    getRenderTimePlayingAod: function() {
        return this.get('render_time_playing_aod') ? this.get('render_time_playing_aod') : this.get('render_time_playing');
    },

    /**
     * get function to render time_now in Aod mode
     * @return {*}
     */
    getRenderTimeNowAod: function() {
        return this.get('render_time_now_aod') ? this.get('render_time_now_aod') : this.get('render_time_now');
    },

    /**
     * get function to render time_end in Aod mode
     * @return {*}
     */
    getRenderTimeEndAod: function() {
        return this.get('render_time_end_aod') ? this.get('render_time_end_aod') : this.get('render_time_end');
    }
});

