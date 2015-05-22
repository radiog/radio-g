Api = {

    _currentMenu : 'informations',

    _scrollPage_Podcasts : '',

    _scrollPage_Videos : '',

    _scrollPage_Contact : '',

    _scrollPage_Informations : '',

    _list_destinataire : '',

    init : function(){
        this.declareScroll();
        this.start('direct');
        this.initVar();
    },

    initVar : function() {
        $('#num_standard').attr('href','tel:'+Flux._frap_flux.telephone_std);
		
		console.log(Flux._frap_flux);

       // console.log('Destinataires : '+Flux._frap_flux.destinataires.length);
        for(var d=0;d<Flux._frap_flux.destinataires.length;d++) {
            this._list_destinataire += '<option value="'+Flux._frap_flux.destinataires[d].mail+'">'+Flux._frap_flux.destinataires[d].nom+'</option>';
        }
        $('#c_destinataire').append(this._list_destinataire);
    },
	
    declareScroll : function () {
        this._scrollPage_Podcasts = new iScroll('page_podcasts',{
            useTransform: true,
            useTransition: true,
            vScroll: true,
            handleClick: true
        });
        this._scrollPage_Videos = new iScroll('page_videos',{
            useTransform: true,
            useTransition: true,
            vScroll: true,
            handleClick: true
        });
        this._scrollPage_Contact = new iScroll('page_contact',{
            useTransition: true,
            onBeforeScrollStart: function (e) {
                var target = e.target;
                while (target.nodeType != 1) target = target.parentNode;

                if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                    e.preventDefault();
            }
        });
        this._scrollPage_Informations = new iScroll('page_informations',{
            useTransform: true,
            useTransition: true,
            vScroll: true,
            handleClick: true
        });
    },
	
    update : function () {
        height_page=(window.innerHeight-_menu_height);
        $('.page').css('height',(height_page)+'px');
        $('#container').css('height',height_page+'px');
        if(this._currentPage==='direct') {
            //this._scrollPage.refresh();
        } else if(this._currentPage==='podcasts') {
            this._scrollPage_Podcasts.refresh();
        } else if(this._currentPage==='informations') {
            this._scrollPage_Informations.refresh();
        }
    },

    openNav : function() {
        if(open_nav) {
            $('#header').animate({'top':'-'+_header_nav_height+'px'},400);
        } else {
            $('#header').animate({'top':'0px'},400);
        }
        open_nav=!open_nav;
    },

    switchMenu : function(p_menu) {
        if(this._currentMenu!=p_menu) {
            $('#menu #'+this._currentMenu).removeClass('active');
            $('#partage_direct').animate({'top':'-100%'},800);
            $('#page_'+this._currentMenu).animate({'top':'-100%'},800);
            this._currentMenu=p_menu;
            $('#menu #'+this._currentMenu).addClass('active');
            $('#page_'+this._currentMenu).css('top',height_page+'px').animate({'top':'0px'},800);

            $('#page_embed_video').find('#scroller').html('');

            switch(p_menu){
                case 'direct':
                    $('#partage_direct').animate({'top':'125px'},800);
                break;
                case 'podcast':
                    Api._scrollPage_Podcasts.refresh();
                break;
                case 'videos':
                break;
                case 'contact':
                    this._scrollPage_Contact.refresh();
                break;
                case 'informations':
                    this._scrollPage_Informations.refresh();
                    this.openNav();
                break;
            }
        }
    },

    start : function(p_menu) {
        this._currentMenu=p_menu;
        $('#menu #'+this._currentMenu).addClass('active');
        $('#page_'+this._currentMenu).css('top','0px');

        if(this._currentMenu=='direct') $('#partage_direct').css({'top':'125px'});
    }
}
