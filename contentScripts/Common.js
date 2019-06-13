const Common = {
    getWebVar: function () {
        let ret = {};
        let scriptContent = "";
        for (let i = 0; i < arguments.length; i++) {
            let currVariable = arguments[i];
            scriptContent += "if (typeof " + currVariable + " !== 'undefined') $('body').attr('tmp_" + currVariable + "', JSON.stringify(" + currVariable + "));\n"
        }
        let script = document.createElement('script');
        script.id = 'tmpScript';
        script.appendChild(document.createTextNode(scriptContent));

        (document.body || document.head || document.documentElement).appendChild(script);
        for (let i = 0; i < arguments.length; i++) {
            let currVariable = arguments[i];
            let $body = jQuery(document.body);
            ret[currVariable] = jQuery.parseJSON($body.attr("tmp_" + currVariable));
            $body.removeAttr("tmp_" + currVariable);
        }
        jQuery("#tmpScript").remove();
        return ret;
    }
};