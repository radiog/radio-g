/**
 * This is the view for the the Jembe version of the player
 * @class JsPlayerJembeView
 * @module JsPlayer
 */

var JsPlayerJembeView = Backbone.View.extend({

    /**
     *
     */
    duration: 0,

    /**
     *
     */
    time: 0,

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
     *
     */
    buffering: 0,

    /**
     *
     */
    volume: 0,


    /**
     * automatically called by Backbone at initialisation
     */
    initialize:function () {
        this.volume = this.model.get("volume");

        // listen to events sent by jembe.audio
        _.bindAll(this, 'onAudioCanPlay', 'onAudioPlay', 'onAudioPause', 'onAudioPlaying', 'onAudioWaiting', 'onAudioTimeUpdate', 'onAudioEnded', 'onAudioDurationChange', 'onAudioBuffering', 'onAudioVolumeChange', 'mute', 'mute2', 'onAudioVolumeChange2');
        jembe.audio.listen({ event: 'canplay', callback: this.onAudioCanPlay });
        jembe.audio.listen({ event: "play", callback: this.onAudioPlay });
        jembe.audio.listen({ event: "pause", callback: this.onAudioPause });
        jembe.audio.listen({ event: "playing", callback: this.onAudioPlaying });
        jembe.audio.listen({ event: "waiting", callback: this.onAudioWaiting });
        jembe.audio.listen({ event: "timeupdate", callback: this.onAudioTimeUpdate });
        jembe.audio.listen({ event: "ended", callback: this.onAudioEnded });
        jembe.audio.listen({ event: "durationchange", callback: this.onAudioDurationChange });
        jembe.audio.listen({ event: "buffering", callback: this.onAudioBuffering });
        jembe.audio.listen({ event: "error", callback: this.onAudioError });
        jembe.multimedia.listenForVolume(this.onAudioVolumeChange);

        this.model.set('ready', this.model.get('ready') + 1);
        console.log("A>> initialize > ready");
    },


    /**
     *
     * @return {String}
     */
    getName:function () {
        return 'JsPlayerJembeView';
    },


    /**
     *
     */
    onAudioCanPlay:function () {
        this.trigger('canplay');
    },

    /**
     *
     */
    onAudioPlay:function () {
        this.trigger('play');
    },

    /**
     *
     */
    onAudioPause:function () {
        this.trigger('pause');
    },

    /**
     *
     */
    onAudioPlaying:function () {
        console.log("trigger event PLAYING");
        this.trigger('playing');
    },

    /**
     *
     */
    onAudioWaiting:function () {
        console.log("trigger event WAITING");
        this.trigger('waiting');
    },

    /**
     *
     */
    onAudioTimeUpdate:function (timeObj) {
        this.time = timeObj.currentTime;
        this.calculateSpeed();

        this.trigger('timeupdate');
    },

    calculateSpeed: function () {
        var speed_time = this.time;
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
                console.log("trigger event SPEEDCHANGE");
            }

            this.speed_time = speed_time;
            this.speed_ts = speed_ts;
            this.speed = speed;
        }
    },

    /**
     *
     */
    onAudioEnded:function () {
		console.log('view.jembe.js >> onAudioEnded >> trigger ended')
        this.trigger('ended');
    },

    /**
     *
     */
    onAudioDurationChange:function (durationObj) {
        this.duration = durationObj.duration;
        this.trigger('durationchange');
    },

    /**
     *
     */
    onAudioBuffering:function (obj) {
        this.buffering = obj.buffer;
    },

    /**
     *
     */
    onAudioError:function (obj) {
        this.trigger('error', [obj.code, obj.message]);
    },

    /**
     *
     */
    onAudioVolumeChange:function () {
        jembe.multimedia.currentVolume({onSuccess:this.onAudioVolumeChange2 });
    },

    /**
     *
     */
    onAudioVolumeChange2:function (content) {
        this.volume = content;
        this.trigger('volumechange');
    },


    /**
     *
     */
    setSrc:function (src) {
	if(src) {
     	    var a = document.createElement('a');
            a.href = src;
            jembe.audio.load({src:a.href});
	}
    },

    /**
     *
     */
    setCurrentTime:function (t) {
        jembe.audio.seek({newTime:t});
    },

    /**
     *
     */
    getCurrentTime:function () {
        return this.time;
    },

    /**
     *
     */
    load:function () {
        jembe.audio.load({});
    },

    /**
     *
     */
    play:function () {
        jembe.audio.play({});
    },

    /**
     *
     */
    pause:function () {
        jembe.audio.pause({});
    },

    /**
     *
     */
    mute:function () {
        jembe.multimedia.currentVolume({onSuccess:this.mute2 });
    },

    /**
     *
     */
    mute2:function (content) {
        console.log(">>> mute2");
        this.model.defaults.volume = content;
        console.log(">>> content = " + content);
        jembe.multimedia.volume(0);
    },

    /**
     *
     */
    unmute:function () {
        jembe.multimedia.volume(this.model.defaults.volume);
    },

    /**
     *
     */
    setVolume:function (volume) {
        volume = Math.min(Math.max(volume, 0), 1);
        jembe.multimedia.volume(volume);
    },

    /**
     *
     */
    getVolume:function () {
        return this.volume;
    },

    /**
     *
     */
    getMute:function () {
        return this.getVolume() == 0;
    },

    /**
     *
     */
    getDuration:function () {
        return this.duration;
    },

    /**
     *
     */
    getBuffering:function () {
        return this.buffering;
    }
});

