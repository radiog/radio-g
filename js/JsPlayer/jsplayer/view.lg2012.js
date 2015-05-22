var JsPlayerLg2012View = Backbone.View.extend({
    template: _.template($('#player-html-template').html()),

    keys: {
        '415' : 'play',
        '19' : 'pause',
        '413' : 'stop',
        '412' : 'backward',
        '417' : 'forward'
    },

    initialize: function() {
        this.$el.html(this.template(this.model.toJSON()));

        this.$audio = this.$el.find("audio");
        this.audio = this.$audio.get(0);

        this.volume = this.model.get("volume");

        _.bindAll(this, 'onAudioLoadedMetadata', 'onAudioCanPlay', 'onAudioPlay', 'onAudioPlaying', 'onAudioTimeUpdate', 'onAudioEnded', 'onAudioVolumeChange', 'onAudioVolumeChange2', 'mute2', 'onAudioDurationChange');
        this.audio.addEventListener('loadedmetadata', this.onAudioLoadedMetadata);
        //this.audio.addEventListener('progress', this.onProgress);
        this.audio.addEventListener('canplay', this.onAudioCanPlay);
        //this.audio.addEventListener('canplaythrough', this.onCanPlayThrough);
        this.audio.addEventListener('play', this.onAudioPlay);
        //this.audio.addEventListener('pause', this.onPause);
        //this.audio.addEventListener('waiting', this.onWaiting);
        this.audio.addEventListener('playing', this.onAudioPlaying);
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
        return 'JsPlayerLg2012View';
    },

    onAudioLoadedMetadata: function() {
        this.trigger('loadedmetadata');
 	},

    onAudioCanPlay: function() {
        this.trigger('canplay');
 	},

    onAudioPlay: function() {
        this.trigger('play');
 	},

    onAudioPlaying: function() {
        this.trigger('playing');
 	},

    onAudioTimeUpdate: function() {
        this.trigger('timeupdate');
 	},

    onAudioEnded: function() {
        this.trigger('ended');
 	},

    onAudioVolumeChange: function() {
        jembe.audio.currentVolume({callback: this.onAudioVolumeChange2 });
    },

    onAudioVolumeChange2: function(content) {
        this.volume = content;
        this.trigger('volumechange');
    },

    onAudioDurationChange: function() {
        this.trigger('durationchange')
    },


    setSrc: function(src) {
        this.$audio.attr("src", src);
    },

    setCurrentTime: function(t) {
        this.audio.currentTime = t;
    },

    getCurrentTime: function() {
        return this.audio.currentTime;
    },

    load: function() {
        this.audio.load();
    },

    play: function() {
        this.audio.play();
    },

    pause: function() {
        this.audio.pause();
    },

    mute: function() {
        jembe.audio.currentVolume({callback: this.mute2 });
    },

    mute2: function(content) {
        console.log(">>> mute2");
        this.model.defaults.volume = content;
        console.log(">>> content = "+content);
        jembe.audio.volume(0);
    },

    unmute: function() {
        jembe.audio.volume(this.model.defaults.volume);
    },

    setVolume: function(volume) {
        volume = Math.min(Math.max(volume, 0), 1);
        jembe.audio.volume(volume);
    },

    getVolume: function() {
        return this.volume;
    },

    getMute: function() {
        return this.getVolume() == 0;
    },

    getDuration: function() {
        return this.audio.duration;
    }
});

