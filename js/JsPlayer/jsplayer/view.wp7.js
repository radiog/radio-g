/**
 * This is the view for the JEMBE version of the player
 * @class JsPlayerWp7View
 * @module JsPlayer
 */

var JsPlayerWp7View = Backbone.View.extend({

    src : "",
    duration : 100,
    volume : 0.5,

    /**
     * automatically called by Backbone at initialisation
     */
    initialize: function() {
        this.model.set('ready', this.model.get('ready') + 1);
    },


    /**
     *
     * @return {String}
     */
    getName : function() {
        return 'JsPlayerWp7View';
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
    onAudioTimeUpdate: function() {
        this.trigger('timeupdate');
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
        //
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
        this.src = src;
    },

    /**
     *
     */
    setCurrentTime: function(t) {
        //
    },

    /**
     *
     */
    getCurrentTime: function() {
        return 0;
    },

    /**
     *
     */
    load: function() {
        this.onAudioCanPlay();
    },

    /**
     *
     */
    play: function() {
        jembe.audio.play({src: this.src, title: this.model.get("track_name")});
    },

    /**
     *
     */
    pause: function() {
        jembe.audio.pause({});
    },

    /**
     *
     */
    mute: function() {
        //
    },

    /**
     *
     */
    unmute: function() {
        //
    },

    /**
     *
     */
    setVolume: function(volume) {
        this.volume = volume;
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
        return this.duration;
    }
});

