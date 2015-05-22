var JsPlayerLgNetcastView = Backbone.View.extend({

    /**
     *
     */
    src: "",

    /**
     *
     */
    current_time : 0,

    /**
     *
     */
    duration : 0,

    /**
     *
     */
    clock : false,

    /**
     * template to use for LG Netcast
     */
    template: _.template($('#player-lg-netcast-template').html()),

    keys: {
        '415' : 'play',
        '19' : 'pause',
        '413' : 'stop',
        '412' : 'backward',
        '417' : 'forward'
    },

    initialize: function() {
        this.resetAudio();

        this.volume = this.model.get("volume");

        _.bindAll(this, 'tictac', 'onAudioBuffering', 'onAudioPlayStateChange');

        this.model.set('ready', this.model.get('ready') + 1);
    },


    resetAudio : function () {
        this.stopClock();

        var html = this.template(this.model.toJSON());
        html = html.replace('data=""', 'data="' + this.src + '"');
        this.$el.html(html);

        this.$audio = this.$el.find("object");
        this.audio = this.$audio.get(0);

        this.audio.onPlayStateChange = this.onAudioPlayStateChange;
        this.audio.onBuffering = this.onAudioBuffering;

        this.startClock();
    },



    getName : function() {
        return 'JsPlayerLgNetcastView';
    },


    startClock: function() {
        if (!this.clock) {
            this.clock = window.setInterval(this.tictac, 250);
        }
    },

    stopClock: function() {
        clearInterval(this.clock);
        this.clock = false;
    },

    tictac: function() {
        if (this.getCurrentTime() != this.current_time) {
           // console.log("trigger timeupdate : " + this.current_time);
            this.current_time = this.getCurrentTime();
            this.trigger('timeupdate');
        }

        if (this.getDuration() != this.duration) {
            //console.log("trigger durationchange : " + this.duration);
            this.duration = this.getDuration();
            this.trigger('durationchange');
        }
    },


    onAudioPlayStateChange : function () {
        console.log("onAudioPlayStateChange");

        // Stopped
        if (this.audio.playState == 0) {
            console.log("onPlayStateChange : Stopped");
        }
        // Playing
        else if (this.audio.playState == 1) {
            console.log("onPlayStateChange : Playing");
            this.trigger('play');
        }
        // Paused
        else if (this.audio.playState == 2) {
            console.log("onPlayStateChange : Paused");
        }
        // Connecting
        else if (this.audio.playState == 3) {
            console.log("onPlayStateChange : Connecting");
        }
        // Buffering
        else if (this.audio.playState == 4) {
            console.log("onPlayStateChange : Buffering");
        }
        // Finished
        else if (this.audio.playState == 5) {
            console.log("onPlayStateChange : Finished");
            this.trigger('ended');
        }
        // Error
        else if (this.audio.playState == 6) {
            console.log("onPlayStateChange : Error");
        }
    },

    onAudioBuffering : function (isStarted) {
        console.log("onAudioBuffering : " + isStarted);
        if (!isStarted) {
            this.trigger('canplay');
        }
    },


    setSrc: function(src) {
        this.src = src;
    },

    setCurrentTime: function(t) {
        console.log("setCurrentTime : " + t);
        this.audio.seek(t * 1000);
    },

    getCurrentTime: function() {
        return Math.floor(parseInt(this.audio.playPosition) / 1000);
    },

    load: function() {
        // changing the data attribute doesn't work so we reset the entire <object> everytime the source change
        //this.$audio.attr("data", this.src);

        this.resetAudio();
    },

    play: function() {
        console.log("play");
        this.audio.play(1);
    },

    pause: function() {
        console.log("pause");
        this.audio.play(0);
    },

    mute: function() {
        //
    },

    unmute: function() {
        //
    },

    setVolume: function(volume) {
        this.volume = Math.min(Math.max(volume, 0), 1);
    },

    getVolume: function() {
        return this.volume;
    },

    getMute: function() {
        return this.getVolume() == 0;
    },

    getDuration: function() {
        return Math.floor(parseInt(this.audio.playTime) / 1000);
    }
});

