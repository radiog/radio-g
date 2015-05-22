/**
 * This is the view for the flash version of the player
 * @class JsPlayerFlashView
 * @module JsPlayer
 */

var JsPlayerFlashView = Backbone.View.extend({

    /**
     * template to use for jsplayer.swf
     */
    template: _.template($('#player-flash-template').html()),

    /**
     * automatically called by Backbone at initialisation
     */
    initialize: function() {
        this.$el.html(this.template(this.model.toJSON()));

        var audio_container_id = "audio_container" + this.model.get("id");
        var audio_id = "audio" + this.model.get("id");
        var flashvars = { 'id': this.model.get("id") };
        var params = {};
        var attributes = { id: audio_id };
        var swf_path = this.model.get('swf_path') + '?nocache=' + new Date().getTime();
        swfobject.embedSWF(
            swf_path,
            audio_container_id,
            "1",
            "1",
            "10.0.0",
            false,
            flashvars,
            params,
            attributes,
            null
        );

        this.audio = null;
    },


    /**
     * called by flash
     */
    initAudio: function() {
        var audio_id = "audio" + this.model.get("id");
        var $audio = this.$el.find("#" + audio_id);
        var audio = $audio.get(0);

        if (audio) {
            console.log('player ' + this.model.get('id') + ' : initAudio : ready');

            this.$audio = $audio;
            this.audio = audio;

            this.model.set('ready', this.model.get('ready') + 1);
        }
    },


    /**
     *
     * @return {String}
     */
    getName : function() {
        return 'JsPlayerFlashView';
    },


    /**
     * handler for loadedmetadata event sent by flash player
     */
    onAudioLoadedMetadata: function () {
        this.trigger('loadedmetadata');
    },

    /**
     *
     */
    onAudioCanPlay: function () {
        this.trigger('canplay');
    },

    /**
     *
     */
    onAudioPlay: function () {
        this.trigger('play');
    },

    /**
     *
     */
    onAudioPlaying: function () {
        this.trigger('playing');
    },

    /**
     *
     */
    onAudioTimeUpdate: function () {
        this.trigger('timeupdate');
    },

    /**
     *
     */
    onAudioEnded: function () {
        this.trigger('ended');
    },

    /**
     *
     */
    onAudioVolumeChange: function () {
        this.trigger('volumechange');
    },

    /**
     *
     */
    onAudioDurationChange: function () {
        this.trigger('durationchange');
    },


    /**
     *
     */
    setSrc: function(src) {
        this.audio.swfSetSrc(src);
    },

    /**
     *
     */
    setCurrentTime: function(t) {
        this.audio.swfSetCurrentTime(t);
    },

    /**
     *
     */
    getCurrentTime: function() {
        return this.audio.swfGetCurrentTime();
    },

    /**
     *
     */
    load: function() {
        this.audio.swfLoad();
    },

    /**
     *
     */
    play: function() {
        this.audio.swfPlay();
    },

    /**
     *
     */
    pause: function() {
        this.audio.swfPause();
    },

    /**
     *
     */
    mute: function() {
        this.model.defaults.volume = this.getVolume();
        this.audio.swfSetVolume(0);
    },

    /**
     *
     */
    unmute: function() {
        this.audio.swfSetVolume(this.model.defaults.volume);
    },

    /**
     *
     */
    setVolume: function(volume) {
        volume = Math.min(Math.max(volume, 0), 1);
        this.audio.swfSetVolume(volume);
    },

    /**
     *
     */
    getVolume: function() {
        return this.audio.swfGetVolume();
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
        return this.audio.swfGetDuration();
    }
});

