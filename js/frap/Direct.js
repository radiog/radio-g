Direct = {

    _open_menu : false,

    _box_titre : $('#box_titre_direct'),

    _box_partage : $('#box_partage_direct'),
	
	_url_direct : '',
	
	_meta : '',
	
	_intervalle : '',

    _current_direct : '',

	init : function() {
		this._url_direct = Flux._frap_flux.ws_meta_direct;
		Direct.refreshData();
		if (Direct._intervalle) clearInterval(Direct._intervalle);
		Direct._intervalle = setInterval(Direct.refreshData,5000);
	},

	refreshData : function() {
		$.ajax
		({
			url: Direct._url_direct, 		
			method: 'GET',
			dataType: 'json',
			success: function(data) 
			{
				Direct._meta = data;
				if(Direct._current_direct != Direct._meta.current.title) {
					Direct._current_direct = Direct._meta.current.title;
					console.log('Show title');
					Direct.showTitle();
				}
			},
			error: function() 
			{
				console.log('********************************************* Direct.callback_error=');
			}
		});
				
	},

	callback_direct : function(msg) {
		eval('Direct._meta = '+msg);
		
		
		Direct.showTitle();
		
	},

    menuToggle : function() {
        if(!this._open_menu) {
            //ouvert
            //this._box_titre.html('');
            this._box_titre.animate({'left':'95%'},400);
            this._box_partage.animate({'left':'0%'},400);
            this._box_partage.find('.btn').html('-');
        } else {
            //fermer
            //this._box_titre.html(this.showTitle());
            this._box_titre.animate({'left':'5%'},400);
            this._box_partage.animate({'left':'-90%'},400);
            this._box_partage.find('.btn').html('+');
        }
        this._open_menu = !this._open_menu;
    },

    showTitle : function() {
        var meta = '<table width="100%" height="80" cellpadding="0" celcspacing="0" border="0"><tr><td><div>'+Direct._meta.nodes[1].node.title+'</div><div></div><div>'+Direct._meta.nodes[1].node.field_artiste+'<br />'+Direct._meta.nodes[1].node.field_image_album+'</div></td></tr></table>';
		console.log('title = '+meta)
		$('#box_titre_direct').html(meta);
        $('#player_picture').html('<img src="'+Direct._meta.nodes[1].node.field_image+'" border="0" height="158">');       
        //return title;
    }



}