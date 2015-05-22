Dedicasse = {

    launch : function() {
        Api.switchMenu('dedicasse');
        //console.log('dedicasse = '+Flux._frap_flux.url_dedicace);
        $('#iframe_dedicase').css({
            'height':(height_page-104)+'px',
            'border':'none',
            'width':'100%',
            'margin-top':'100px'
        }).attr('src',Flux._frap_flux.url_dedicace);
    }

}