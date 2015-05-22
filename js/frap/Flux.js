Flux = {

	_url_flux : 'radiog.js',
	//_url_flux : 'http://www.radio-g.fr/appli/radiog.js',
	//_url_flux : 'http://80.82.229.204/datasun/bocetoplayer/frap.js',

    _frap_flux : '',

    init : function() {
        this.getFlux();
    },

	getFlux : function() {
		$(document).ready(function() {
			$.ajax({ 
				type: 'GET',
				url: Flux._url_flux,
				timeout: 3000,
				success: function(data) {
					eval('Flux._frap_flux = '+data);
					if(Flux._frap_flux) {
						Podcasts.init();
						//Videos.init();
						Api.init();
						Player.init();
						Direct.init();
					} else {
						alert('connexion error flux');
					}
				},
				error: function() {
					console.log('error de connexion au FLUX');
				}
			});
		}); //fin script Jquery  
    }
	
}
