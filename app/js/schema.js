var schema = {
    'modules':{
        'allModules': function(){
            //alert("sector donde corre sin importar el nombre del modulo");
        },
        'home':{
            'allControllers': function(){
                //alert("sector donde corre sin importar el nombre del controller en el modulo usuario");
            },
            'controllers':{
                'combo_anidado': {
                    'allActions':function(){
                    },
                    'actions':{
                        'index': function(){
                            // alert("ingreso");
                            yOSON.AppCore.runModule("modal");
                            yOSON.AppCore.runModule("combo");
                        },
                        'byDefault':function(){
                            //alert("si no existe un action, este action corre por defecto");
                        }
                    }
                },
                'byDefault': function(){
                    //alert("si no existe un controller debería ser por default este controller");
                }
            }
        },
        'byDefault': function(){
            //alert('corriendo modulo por defecto');
        }
    }
};
