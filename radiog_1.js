FrapFlux = {
	
	id: 'radiog',
	nom: 'Radio G!',
	racine: 'http://radio-g.fr',
	//http://80.82.229.202/sun.aac
	mp3_direct: {
		iOS: 'http://80.82.229.202/radiog.aac',
	    hifi: 'http://80.82.229.202/radiog.mp3',
	    lofi: 'http://80.82.229.202/radiog.mp3',
	},	
	mp3_ts: 'http://80.82.229.202/.mp3?date=%HMS%',
	mp3_racine_podcast : '/data/www/sites/default/files/podcasts',
	
	ws_meta_direct: 'http://radio-g.fr/block_now/nodes.json',
	ws_podcasts: 'http://radio-g.fr/services/views/services.json',
	//ws_video: 'https://api.dailymotion.com/playlist/x231ha_lesonunique_playlist-player/videos&fields=thumbnail_medium_url,id,title,channel,owner,embed_html,duration,views_total,url',
	
	facebook_url : 'https://www.facebook.com/pages/Radio-G/115540545133377?fref=ts',
	twitter_msg: 'J\'écoute {url} #sunradio #sunapp',
	telephone_std: '02 41 37 87 66' , 
	email_contact: 'prog@radio-g.fr',
	url_like: '',
	
	//url_dedicace: 'http://www.lesonunique.com/datasun/selection_auditeur/selection_date_jquery.php',
	url_contact: 'http://frap.jembe.fr/formulaire/send.php',

	destinataires : [
		{nom:'Administration',mail:'cecile.radiog@gmail.com'},
		{nom:'Programmation',mail:'julien.radiog@gmail.com'},
		{nom:'Accueil',mail:'prog@radio-g.fr'},
	]
}
