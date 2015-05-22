Rater = {

    _num_open : 0,

    _already_noted : 0,

    _later : 0,

    _titre_appli : 'Jet',

    init : function() {
        console.log('Rater ::::: get num open');

        this._later=localStorage.getItem('_later');
        if(!this._later) this._later=0;

        this._already_noted=localStorage.getItem('_already_noted');
        if(!this._already_noted) this._already_noted=0;

        this._num_open=localStorage.getItem('_num_open_rater');
        if(!this._num_open) this._num_open=0;

        this.updateOpen();
    },

    updateOpen : function() {
        Rater._num_open++;
        localStorage.setItem('_num_open_rater',Rater._num_open);
        //console.log('********************************************************************************** this._num_open='+Rater._num_open);
        if(Rater._num_open==3) Rater.callPopinRater();
        if(Rater._num_open>3 && Rater._later==1 && Rater._already_noted==0) Rater.callPopinRater();
    },

    callPopinRater : function() {
        /*jembe.alert.show({
            title : 'Notez l\'appplication',
            message : 'Vous avez appréciez l\'application '+Rater._titre_appli+' ? Donnez votre avis et évaluez l\'application en vous rendant sur l\'app Store.',
            buttons : 'Noter l\'application|Plus tard|Ne plus afficher ce message',
            onSuccess : Rater.callBackPopin
        });*/
		navigator.notification.confirm(
			'Vous avez appréciez l\'application '+Rater._titre_appli+' ? Donnez votre avis et évaluez l\'application en vous rendant sur le Store.',  // message
			Rater.callBackPopin,            // fonction de callback appelée avec l'indice du bouton pressé
			'Notez l\'appplication',            // titre
			['Noter l\'application','Plus tard','Ne plus afficher ce message']  // libellés des boutons
		);
    },

    callBackPopin : function(button) {
        if (button==0) {
            localStorage.setItem('_already_noted',1);
            Rater._already_noted=1;
            if (isIOS) {
                document.location.href='itms-apps://ax.itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id=606885106';
            } else if (isAndroid2) {
                document.location.href='https://play.google.com/store/apps/details?id=fr.radiofrance.rfpodcasts&write_review=true';
            } else {
                document.location.href='';
            }
        } else if(button==1) {
            //alert('plus tard');
            localStorage.setItem('_later',1);
            Rater._later=1;
        } else if(button==2) {
            //alert('annuler');
            localStorage.setItem('_later',0);
            Rater._later=0;
        }
    }
}