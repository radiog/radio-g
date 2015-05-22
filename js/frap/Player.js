/**
 * Player.
 * @class Player
 * @static
 **/


Player = {

    player: null,

    is_open: true,

    y_top: 0,

    y_bottom: 200,

    drag_limit: 80,

    diffusion: "direct",

    metadatas_interval: false,

    _list_meta_direct : '',

    init: function() {
        console.log("Player.init()");
        console.log("jembe.info.platform = "+jembe.info.platform);

		// -----------------------------------
        // Player du direct

		if (jembe.info.platform=="server") {
	        this.player = JsPlayer.addPlayer({
	            'id': '1',
	            'el': $("#jsplayer"),
	            'template_id': 'player-template',
	            'swf_path': 'flash/JsPlayer/jsplayer.swf',
                'on_ready': Player.playDirect
	        });
		} else {
			this.player = JsPlayer.addPlayer({
	            'id': '1',
	            'el': $("#jsplayer"),
	            'template_id': 'player-template',
	            'swf_path': 'flash/JsPlayer/jsplayer.swf',
	            'on_ready': Player.playDirect
	        });
		}
		
		// initialisation des éléments visibles ou cachés
		this.player.model.set('show_mode', false);
		this.player.model.set('show_slider', false);
		this.player.model.set('show_time_end', false);
		this.player.model.set('show_time_now', false);
		this.player.model.set('show_time_start', false);
        this.player.model.set('show_mute_btn', true);
		this.player.model.set('show_seektime', false);
        this.player.model.set('show_volume_slider', false);
		$("#separateur").hide();
		
		// Configuration du format des durées / heures.
        this.player.model.set('render_time_start_direct', function(timestamp, timecode) {
            return toHMS(timestamp);
        });
        this.player.model.set('render_time_start_ts', function(timestamp, timecode) {
            return toHMS(timestamp);
        });
        this.player.model.set('render_time_start_aod', function(timestamp, timecode) {
            return secondsToHMS(timecode);
        });

        this.player.model.set('render_time_playing_direct', function(timestamp, timecode, percent) {
            return toHMS(timestamp);
        });
        this.player.model.set('render_time_playing_ts', function(timestamp, timecode, percent) {
            return toHMS(timestamp);
        });
        this.player.model.set('render_time_playing_aod', function(timestamp, timecode, percent) {
            return secondsToHMS(timecode);
        });

        this.player.model.set('render_time_now_direct', function(timestamp, timecode, percent) {
            return toHMS(timestamp);
        });
        this.player.model.set('render_time_now_ts', function(timestamp, timecode, percent) {
            return toHMS(timestamp);
        });
        this.player.model.set('render_time_now_aod', function(timestamp, timecode, percent) {
            return secondsToHMS(timecode);
        });

		this.player.model.set('render_time_end', function(timestamp, timecode) {
            return toHMS(timestamp);
        });

        this.player.model.set('render_time_end_direct', function(timestamp, timecode) {
            return toHMS(timestamp);
        });
        this.player.model.set('render_time_end_ts', function(timestamp, timecode) {
            return toHMS(timestamp);
        });
        this.player.model.set('render_time_end_aod', function(timestamp, timecode) {
            return secondsToHMS(timecode);
        });

		// Evenements
		this.player.on("direct_enter", function(event) {
           	this.model.set('show_slider', false);
			this.model.set('show_time_end', false);
			this.model.set('show_time_now', false);
			$("#separateur").hide();
        });

		
		
		

		// -----------------------------------
        // Player de l'onglet podcast
		
		
		this.player_aod = JsPlayer.addPlayer({
            'id': '2',
            'el': $("#player_podcasts"),
            'template_id': 'player-template2',
            'swf_path': 'flash/JsPlayer/jsplayer.swf',
            'on_ready': Player.playDefaultSound
        });
		
		
		
		// initialisation des éléments visibles ou cachés
		
		this.player_aod.model.set('show_mode', false);
		this.player_aod.model.set('show_time_end', true);
		this.player_aod.model.set('show_time_now', true);
		this.player_aod.model.set('show_time_playing', false);
        this.player_aod.model.set('show_mute_btn', false);
		this.player_aod.model.set('show_seektime', true);
        this.player_aod.model.set('show_volume_slider', false);
		this.player_aod.model.set('show_play_btn', false);
		this.player_aod.model.set('show_pause_btn', false);
             

        this.player_aod.model.set('render_time_start_direct', function(timestamp, timecode) {
            return toHMS(timestamp);
        });
        this.player_aod.model.set('render_time_start_ts', function(timestamp, timecode) {
            return toHMS(timestamp);
        });
        this.player_aod.model.set('render_time_start_aod', function(timestamp, timecode) {
            return secondsToHMS(timecode);
        });

        this.player_aod.model.set('render_time_playing_direct', function(timestamp, timecode, percent) {
            return toHMS(timestamp);
        });
        this.player_aod.model.set('render_time_playing_ts', function(timestamp, timecode, percent) {
            return toHMS(timestamp);
        });
        this.player_aod.model.set('render_time_playing_aod', function(timestamp, timecode, percent) {
            return secondsToHMS(timecode);
        });

        this.player_aod.model.set('render_time_now_direct', function(timestamp, timecode, percent) {
            return toHMS(timestamp);
        });
        this.player_aod.model.set('render_time_now_ts', function(timestamp, timecode, percent) {
            return toHMS(timestamp);
        });
        this.player_aod.model.set('render_time_now_aod', function(timestamp, timecode, percent) {
            return secondsToHMS(timecode);
        });

        this.player_aod.model.set('render_time_end', function(timestamp, timecode) {
            return toHMS(timestamp);
        });

        this.player_aod.model.set('render_time_end_direct', function(timestamp, timecode) {
            return toHMS(timestamp);
        });
        this.player_aod.model.set('render_time_end_ts', function(timestamp, timecode) {
            return toHMS(timestamp);
        });
        this.player_aod.model.set('render_time_end_aod', function(timestamp, timecode) {
            return secondsToHMS(timecode);
        });

        if(Flux._frap_flux.url_dedicace=='') $('#btn_dedicace').hide();
    },


	playDefaultSound : function() {
		//
	},

    choseQuality : function() {
        if (jembe.info.platform=="server") return Flux._frap_flux.mp3_direct.hifi;
        else return Flux._frap_flux.mp3_direct.lofi;
    },
	
	playDirect: function() {
        console.log("playDirect()");
        Player.player.direct({
            'track_url': Player.choseQuality(),
            'track_url_ts': Flux._frap_flux.mp3_ts,
            'time_end': getTimeStamp() + 2400,
            'time_start': getTimeStamp() - 3600
        });

        $('#player_up .container_player .titre_player').html('');
        $('#player_up .container_player .texte_player.row1').html('');
        $('#player_up .container_player .texte_player.row2').html('');
        $('#player_up .container_player img.icon_player').attr('src', '');

		Player.refresh_status("direct");
        //Player.onMetadatas();
        Player.startMetadatasInterval();

        Player.diffusion = "direct";
        //Player.update();

        if(Podcasts._current_podcast_play>=0) {
            Podcasts.pausePodcast(Podcasts._current_podcast_play);
        }
    },

    startMetadatasInterval : function() {
        jembe.http.get({url:Flux._frap_flux.ws_meta_direct, onSuccess:Player.callback_meta_direct, onError:Player.callaback_error});
    },

    callaback_error : function(msg) {
        console.log('error de connexion au JSON meta_direct '+msg);
    },

    callback_meta_direct : function(msg) {
        //console.log(msg)
        try {
            eval('Player._list_meta_direct = '+msg);
            Player.setMetaDirect();
        } catch(e) {
            console.log('rien dans le json Player._list_meta_direct ='+ e.message);
            Player._list_meta_direct="";
        }
    },

    setMetaDirect : function() {
        $('#player_picture').html('<img src="'+Player._list_meta_direct.node.field_image+'" border="0" />');
        setTimeout(Player.startMetadatasInterval(),10000);
    },
	
	refresh_status : function(p_status) {
		Player._status = p_status;
        console.log('=============================================');
        console.log('=============================================');
        console.log('=============================================================== refresh_status='+p_status+' ================');
        console.log('=============================================');
        console.log('=============================================');
		if (p_status!="direct") {
            document.getElementById("btns_player").style.display="none";
            document.getElementById("btn_reload").style.display="inline-block";
        } else {
            document.getElementById("btns_player").style.display="inline-block";
            document.getElementById("btn_reload").style.display="none";
        }
	}

};

