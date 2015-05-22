Contact = {

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