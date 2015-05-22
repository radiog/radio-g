Videos = {

    _url_videos : '',

    _list_videos : '',

    _limit_list : 30,

    init : function() {
        this._url_videos = Flux._frap_flux.ws_video+'&limit='+this._limit_list;
        jembe.http.get({url:Videos._url_videos, onSuccess:Videos.callback_videos, onError:Videos.callaback_error});
    },

    callaback_error : function(msg) {
        console.log('error de connexion au JSON Videos '+msg)
    },

    callback_videos : function(msg) {
        //console.log(msg)
        try {
            eval('Videos._list_videos = '+msg);
            Videos.loadVideos();
        } catch(e) {
            Videos._list_videos="";
        }
    },

    loadVideos : function() {
        var liste = '<table width="100%" cellpadding="4" cellspacing="0" border="0">';
        for(var i=0;i<Videos._list_videos.list.length;i++) {
            liste +=    '<tr class="line_videos">'+
                            '<td>'+'' +
                                '<div style="position:relative;">'+
                                    '<div><img src="'+Videos._list_videos.list[i].thumbnail_medium_url+'" border="0" width="90" height="68" /></div>'+
                                    '<div class="play" '+getOnClickEvent()+'="Videos.playVideo('+i+')"><img src="images/player/play.png" /></div>'+
                                '</div>'+
                            '</td>'+
                            '<td><span class="title">'+Videos._list_videos.list[i].title+'</span><div class="trait"></div><!--'+Videos._list_videos.list[i].channel+' / -->'+Videos._list_videos.list[i].views_total+' vues <!--('+Videos._list_videos.list[i].id+'/'+Videos._list_videos.list[i].owner+')--></td>'+
                            '<td><a href="http://www.facebook.com/sharer.php?u='+escape(Videos._list_videos.list[i].url)+'" target="_blank" '+getOnClickEvent()+'="Videos.likeVideo('+i+')" id="video_like_'+i+'" class="like" data-icon="&#xe0d4;"></a></td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td colspan="3"></td>'+
                        '</tr>';
        }
        liste += '</table>';
        $('#page_videos').find('#scroller').html(liste);
        Api._scrollPage_Videos.refresh();
    },

    likeVideo : function(p_node) {
        if($('#video_like_'+p_node).hasClass('active')) {
            console.log('deja like video');
        } else {
            console.log('like video');
            console.log('like url => http://www.facebook.com/sharer.php?u='+escape(Videos._list_videos.list[p_node].url));
            $('#video_like_'+p_node).addClass('active');
        }
    },

    playVideo : function(p_node) {
        var btn_close= '<div '+getOnClickEvent()+'="Videos.closeVideo()" style="text-align:center;color:#fff;text-transform:uppercase;margin-top:10px;">retour</div>';
        Api.switchMenu('embed_video');
        if(Podcasts._current_podcast_play>=0) {
            Podcasts.pausePodcast(Podcasts._current_podcast_play);
        }
        Player.player.pause();
        $('#page_embed_video').find('#scroller').html(Videos._list_videos.list[p_node].embed_html.replace('480','100%')+btn_close);
    },

    closeVideo : function() {
        Api.switchMenu('videos');
        $('#page_embed_video').find('#scroller').html('');
    }
}