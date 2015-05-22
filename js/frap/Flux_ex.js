Flux = {

    _url_flux : 'http://www.radio-g.fr/appli/radiog.js',//http://80.82.229.204/datasun/bocetoplayer/frap.js',

    _frap_flux : '',

    init : function() {
        this.getFlux();
    },

    getFlux : function() {
        jembe.http.get({
            url:Flux._url_flux,
            onSuccess:Flux.callback_frap,
            onError:Flux.callaback_error
        });
    },

    callback_frap : function(msg) {
        try {
            eval('Flux._frap_flux = '+msg);
        } catch(e) {
            Flux._frap_flux='';
        }

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

    callaback_error : function(msg) {
        console.log('error de connexion au FLUX '+msg);
    }

}