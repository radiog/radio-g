/**
 * This is the view for the the HTML5 version of the player
 * @class JsPlayerHtmlView
 * @module JsPlayer
 */

var JsPlayerHtmlView = Backbone.View.extend({

    /**
     *
     */
    speed_time: 0,

    /**
     *
     */
    speed_ts: 0,

    /**
     *
     */
    speed: 0,


    /**
     * template to use for <audio>
     */
    template: _.template($('#player-html-template').html()),

    /**
     * automatically called by Backbone at initialisation
     */
    initialize: function() {
        this.$el.html(this.template(this.model.toJSON()));

        this.$audio = this.$el.find("audio");
        this.audio = this.$audio.get(0);

        this.volume = this.model.get("volume");

        // listen to events sent by <audio>
        _.bindAll(this, 'onAudioLoadedMetadata', 'onAudioCanPlay', 'onAudioPlay', 'onAudioPlaying', 'onAudioWaiting', 'onAudioTimeUpdate', 'onAudioEnded', 'onAudioVolumeChange', 'onAudioVolumeChange2', 'mute2', 'onAudioDurationChange');
        this.audio.addEventListener('loadedmetadata', this.onAudioLoadedMetadata);
        //this.audio.addEventListener('progress', this.onProgress);
        this.audio.addEventListener('canplay', this.onAudioCanPlay);
        //this.audio.addEventListener('canplaythrough', this.onCanPlayThrough);
        this.audio.addEventListener('play', this.onAudioPlay);
        //this.audio.addEventListener('pause', this.onPause);
        this.audio.addEventListener('playing', this.onAudioPlaying);
        this.audio.addEventListener('waiting', this.onAudioWaiting);
        this.audio.addEventListener('timeupdate', this.onAudioTimeUpdate);
        this.audio.addEventListener('ended', this.onAudioEnded);
        this.audio.addEventListener('volumechange', this.onAudioVolumeChange);
        //this.audio.addEventListener('ratechange', this.onPlaybackRateChange);
        this.audio.addEventListener('durationchange', this.onAudioDurationChange);

        this.model.set('ready', this.model.get('ready') + 1);
    },


    /**
     *
     * @return {String}
     */
    getName : function() {
        return 'JsPlayerHtmlView';
    },


    /**
     *
     */
    onAudioLoadedMetadata: function() {
        this.trigger('loadedmetadata');
 	},

    /**
     *
     */
    onAudioCanPlay: function() {
        this.trigger('canplay');
 	},

    /**
     *
     */
    onAudioPlay: function() {
        this.trigger('play');
 	},

    /**
     *
     */
    onAudioPlaying: function() {
        this.trigger('playing');
 	},

    /**
     *
     */
    onAudioWaiting: function () {
        this.trigger('waiting');
    },

    /**
     *
     */
    onAudioTimeUpdate: function() {
        this.calculateSpeed();
        this.trigger('timeupdate');
 	},

    calculateSpeed: function () {
        var speed_time = this.audio.currentTime;
        var speed_ts = new Date().getTime() / 1000;

        var dt = Math.floor(speed_ts - this.speed_ts);

        if (dt > 1) {
            this.speed_time = speed_time;
            this.speed_ts = speed_ts;
        }
        else if (dt > 0) {
            var speed = (speed_time - this.speed_time) / (speed_ts - this.speed_ts);

            if (Math.round(speed) != Math.round(this.speed)) {
                this.trigger('speedchange');
                console.log(">>> trigger event speedchange (speed = " + speed + ")");
            }

            this.speed_time = speed_time;
            this.speed_ts = speed_ts;
            this.speed = speed;
        }
    },

    /**
     *
     */
    onAudioEnded: function() {
        this.trigger('ended');
 	},

    /**
     *
     */
    onAudioVolumeChange: function() {
        jembe.multimedia.currentVolume({onSuccess: this.onAudioVolumeChange2 });
    },

    /**
     *
     */
    onAudioVolumeChange2: function(content) {
        this.volume = content;
        this.trigger('volumechange');
    },

    /**
     *
     */
    onAudioDurationChange: function() {
        this.trigger('durationchange');
    },


    /**
     *
     */
    setSrc: function(src) {
        this.$audio.attr("src", src);
    },

    /**
     *
     */
    setCurrentTime: function(t) {
        this.audio.currentTime = t;
    },

    /**
     *
     */
    getCurrentTime: function() {
        return this.audio.currentTime;
    },

    /**
     *
     */
    load: function() {
        this.audio.load();
    },

    /**
     *
     */
    play: function() {
        this.audio.play();
    },

    /**
     *
     */
    pause: function() {
        this.audio.pause();
    },

    /**
     *
     */
    mute: function() {
        jembe.multimedia.currentVolume({onSuccess: this.mute2 });
    },

    /**
     *
     */
    mute2: function(content) {
        console.log(">>> mute2");
        this.model.defaults.volume = content;
        console.log(">>> content = "+content);
        jembe.multimedia.volume(0);
    },

    /**
     *
     */
    unmute: function() {
        jembe.multimedia.volume(this.model.defaults.volume);
    },

    /**
     *
     */
    setVolume: function(volume) {
        volume = Math.min(Math.max(volume, 0), 1);
        jembe.multimedia.volume(volume);
    },

    /**
     *
     */
    getVolume: function() {
        return this.volume;
    },

    /**
     *
     */
    getMute: function() {
        return this.getVolume() == 0;
    },

    /**
     *
     */
    getDuration: function() {
        return this.audio.duration;
    }


});

