/**
 * This class creates the players
 * see index.html for examples
 * @module JsPlayer
 * @class JsPlayer
 */
JsPlayer = {

    /**
     * array of players
     * @type Array
     */
    players: [],


    /**
     * add a player
     * @param params {Object}
     * @param params.id Unique id for this player (required)
     * @param params.el jQuery object to which the player will be appended (required)
     * @param params.template_id The template to use for this player (required)
     * @param params.swf_path Path to jsplayer.swf (required)
     * @param params.on_ready Function to be executed when the player is ready (not required)
     * @param params.on_start Function to be executed when the user clique the start button (not required)
     * @return {*}
     */
    addPlayer: function(params) {
        var id, el, template_id, swf_path, on_ready;
        id = params.id;
        el = params.el;
        template_id = params.template_id;
        swf_path = params.swf_path;
        on_ready = params.on_ready;
        on_start = params.on_start;

        if (!params.hasOwnProperty("id") || params.id == "") {
            console.log("Error : missing paramater id");
            return null;
        }

        if (!params.hasOwnProperty("el") || !params.el) {
            console.log("Error : missing paramater el");
            return null;
        }

        if (!params.hasOwnProperty("template_id") || params.template_id == "") {
            console.log("Error : missing paramater template_id");
            return null;
        }

        if (!params.hasOwnProperty("swf_path") || params.swf_path == "") {
            console.log("Error : missing paramater swf_path");
            return null;
        }

        console.log("Add player " + id);

        console.log("player " + id + " : create model");
        var model = new JsPlayerModel({
            'id' : id,
            'template_id' : template_id,
            'swf_path': swf_path,
            'on_ready': on_ready,
            'on_start': on_start
        });

        console.log("player " + id + " : create view");
        var view = new JsPlayerView({
            'model' : model,
            'el': el
        });

        this.players.push(view);
        console.log("players =  " + this.players + " (length = " + this.players.length + ")");

        // TODO : maybe find something better than setTimeout to ensure that ready is set after return ?
        setTimeout(function() {
            console.log("player " + id + " : ready++");
            view.model.set('ready', view.model.get('ready') + 1);
        }, 20);

        return view;
    },


    /**
     * returns the player with this id
     * @param id
     * @return {*}
     */
    getPlayer: function(id) {
        for (var i in this.players) {
            if (this.players.hasOwnProperty(i) && this.players[i].model.get('id') == id) {
                return this.players[i];
            }
        }

        return null;
    },


    /**
     * Put all players except the one with this id in idle mode
     * @param id
     */
    idleOthers: function(id) {
        for (var i in this.players) {
            if (this.players.hasOwnProperty(i) && this.players[i].model.get('id') != id) {
                this.players[i].idle();
            }
        }
    },


    /**
     * Determines if the device is capable of playing mp3 files without flash
     * @return {Boolean}
     */
    canPlayMp3: function() {
        var audio  = document.createElement('audio');

        // canPlayType :
        // "probably" - most likely support
        // "maybe" - might support
        // "" - (empty string) no support
        //
        // only test for mime-type and not codec or Android 2.3 reports ""
        // https://github.com/NielsLeenheer/html5test/blob/master/scripts/engine.js#L804
        return (typeof audio.canPlayType === "function" && audio.canPlayType('audio/mpeg') !== "");
    }

};





