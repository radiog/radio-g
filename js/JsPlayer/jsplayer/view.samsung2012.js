/**
 * This is the the view for the Samsung2012 TV version of the player
 * @class JsPlayerSamsung2012View
 * @module JsPlayer
 */
var JsPlayerSamsung2012View = Backbone.View.extend({

    /**
     *
     */
    src: "",

    /**
     *
     */
    currentplaytime: 0,

    /**
     *
     */
    duration: 0,

    /**
     *
     */
    keys: {
        '71' : 'play',
        '74' : 'pause',
        '70' : 'stop',
        '69' : 'backward',
        '72' : 'forward',
        '27' : 'mute-unmute',
        '11' : 'volume_moins',
        '7' : 'volume_plus'
    },

    /**
     * automatically called by Backbone at initialisation
     */
    initialize: function() {
        console.log('player ' + this.model.get('id') + ' : JsPlayerSamsungView.initialize()');

        this.volume = this.model.get("volume");

        _.bindAll(this, 'getAVPlaySuccess', 'getAVPlayError');

        var custom = deviceapis.avplay;
        custom.getAVPlay(this.getAVPlaySuccess, this.getAVPlayError);
    },


    /**
     * Samsung 2012 specific initialization
     * @param avplay
     */
    getAVPlaySuccess: function(avplay) {
        console.log('player ' + this.model.get('id') + ' : JsPlayerSamsungView.getAVPlaySuccess()');

        var that = this;
        this.audio = avplay;
        this.audio.init({
            playCallback: {
                oncurrentplaytime: function(time) {
                    //console.log(time.timeString);
                    that.onAudioTimeUpdate(time.millisecond / 1000);
                },
                onstreamcompleted: function() {
                    that.onAudioEnded();
                }
            },
            bufferingCallback: {
                onbufferingstart: function() {
                    console.log("onbufferingstart");
                },
                onbufferingprogress: function(percent) {
                    console.log("onbufferingprogress : percent = " + percent);
                },
                onbuffercomplete: function() {
                    console.log("onbuffercomplete");
                    //that.onAudioCanPlay();
                }
            }
        });

        this.model.set('ready', this.model.get('ready') + 1);
    },

    /**
     *
     */
    getAVPlayError: function(error) {
        console.log('player ' + this.model.get('id') + ' : JsPlayerSamsungView.getAVPlayError() : ' + error.message);
    },


    /**
     *
     * @return {String}
     */
    getName : function() {
        return 'JsPlayerSamsung2012View';
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
    onAudioTimeUpdate: function(t) {
        this.currentplaytime = t;
        this.trigger('timeupdate');

        if (this.duration != this.getDuration()) {
            this.duration = this.getDuration();
            this.onAudioDurationChange();
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
        var dt = t - this.getCurrentTime();
        if (dt > 0) {
            this.audio.jumpForward(dt);
        }
        else {
            this.audio.jumpBackward(-dt);
        }
    },


    /**
     *
     */
    getCurrentTime: function() {
        return this.currentplaytime;
    },


    /**
     *
     */
    load: function() {
        console.log("load() src = " + this.src);

        if (this.audio.status > 1) {
            this.audio.stop();
        }

        try {
            if (this.src != "") {
                this.audio.open(this.src);
                this.onAudioCanPlay();
            }
        }
        catch(err) {
            console.log(err);
        }
    },

    /**
     *
     */
    play: function() {
        console.log("play()");
        console.log("status = " + this.audio.status);

        if (this.audio.status >= 4) {
            this.audio.resume();
        }
        else {
            try {
                this.audio.play(
                    function(str) {
                        console.log("play success" + str);
                    },
                    function(str) {
                        console.log("play error" + str);
                    }
                );
            }
            catch(err) {
                console.log(err);
            }
        }
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
        console.log("mute()");
        this.model.defaults.volume = this.getVolume();
        deviceapis.audiocontrol.setMute(true);
        this.trigger('volumechange');
    },

    /**
     *
     */
    unmute: function() {
        console.log("unmute()");
        deviceapis.audiocontrol.setVolume(this.model.defaults.volume * 100);
        this.trigger('volumechange');
    },

    /**
     *
     */
    setVolume: function(volume) {
        volume = Math.min(Math.max(volume, 0), 1);
        volume = Math.round(volume * 100);

        deviceapis.audiocontrol.setVolume(volume);

        // no onAudioVolumeChange so :
        this.trigger('volumechange');
    },

    /**
     *
     */
    getVolume: function() {
        return this.getMute() ? 0 : deviceapis.audiocontrol.getVolume() / 100;
    },

    /**
     *
     */
    getMute: function() {
        return deviceapis.audiocontrol.getMute();
    },

    /**
     *
     */
    getDuration: function() {
        return Math.round(this.audio.duration / 1000);
    }
});

