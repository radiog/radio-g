Contact = {
	
	_photo_taken : '', //images/icone-camera.png

    select_options: function() {
		navigator.notification.confirm(
			'Télécharger photo',  // message
			Contact.callback_select_options,            // fonction de callback appelée avec l'indice du bouton pressé
			'Photo',            // titre
			['Bibliothèque','Photo','Annuler'] // libellés des boutons
		);
    },

    callback_select_options: function(button) {
        if (button==1) {
            //jembe.gallery.search({onSelected:Contact.onResult,onCancel:Contact.onCancel});
		//window.imagePicker.getPictures(Contact.onResult,Contact.onCancel);
		navigator.camera.getPicture(Contact.onResult,Contact.onCancel,{sourceType: Camera.PictureSourceType.PHOTOLIBRARY});
			
        } else if(button==2) {
            //jembe.camera.picture.take({output:"photo.png", onSuccess:Contact.picture_taken});
			navigator.camera.getPicture(Contact.picture_taken,Contact.onCancel);
        } else if(button==3) {
            Contact.reset_photo();	
        }
    },


    reset_photo : function() {
        $('#icon-camera').attr('src','images/icone-camera.png');
        $('#telechargerphoto').val('');
        Contact._photo_taken='';
        Api._scrollPage_Contact.refresh();
    },

    onResult: function (res) {
        //console.log("result received: " + res.path);
        if(res=='')
        {
        
        }
        else
        {
	        console.log(res);
	        $('#icon-camera').attr('src',res);
	        $('#telechargerphoto').val(res);
	        Contact._photo_taken=res;
	        Api._scrollPage_Contact.refresh();
        }
    },

    onCancel: function (res) {
        console.log("canceled:"+res);
    },

    picture_taken: function(result) {
        if(result=='')
        {
        
        }
        else
        {
	        console.log(result);
			//console.log('')
		var result_path = result;
	        $('#icon-camera').attr('src',result_path);
	        $('#telechargerphoto').val(result_path);
	        Contact._photo_taken=result_path;
	        Api._scrollPage_Contact.refresh();
        }
    },

    sendForm : function() {
        var nom=$('#c_nom').val();
        var mail=$('#c_mail').val();
        var mobile=$('#c_mobile').val();
        var destinataire=$('#c_destinataire').val();
        var message=$('#c_message').val();

        if(mail!='' && nom!='' && message!='') {
            $.ajax({
                type: "POST",
                url: Flux._frap_flux.url_contact,
                data: 'from='+Flux._frap_flux.email_contact+'&nom='+nom+'&mail='+mail+'&mobile='+mobile+'&destinataire='+destinataire+'&message='+message,
                success:function(data){
                    alert('Nous avons bien pris en compte votre demande.');
                    $('#c_nom').val('');
                    $('#c_mail').val('');
                    $('#c_mobile').val('');
                    $('#c_message').val('');
                }
            });
        } else {
            alert('Les champs NOM, E-MAIL et MESSAGE sont obligatoire.')
        }
    }

}