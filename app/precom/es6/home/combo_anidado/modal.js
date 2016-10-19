yOSON.AppCore.addModule("modal", function(Sb){
	
	let st              = {},
	defaults 			= {},
      dom             	= {},      
      events,
      fn,
      catchDom,
      suscribeEvents,
      asyncatchDom,
	  asynSuscribeEvents,
      initialize;

	defaults = {
		linkModal 	: ".open_modal",
		parent		: ".modal-fixed",
		content		: ".modal-content",
		btnClose	: ".close",
		tpl 		: " <div class='modal-fixed'><div class='modal-wrap'> <div class='modal-content'>asdasdasd</div><span class='close'></span></div></div>",
		html		: "",
		afterShow	: '',
		afterClose	: ''

	}
			
	catchDom = () => {
		dom.linkModal 	= $(st.linkModal);
	}

	asyncatchDom = () => {
		dom.parent 			= $(st.parent);
		dom.btnClose 		= $(st.btnClose, st.parent);
		dom.content 		= $(st.content, st.parent);
	}

	suscribeEvents = () => {
		dom.linkModal.on("click", events.openModal) ;
	}

	asynSuscribeEvents = () =>{

	
		dom.btnClose.on("click", events.close);
	}
	
	events = {

		openModal : (e) =>{
			
			$.type(st.afterShow) === "function" ? fn.open(st.afterShow) :fn.open() ;
		},

		close 	: () =>{
			$.type(st.afterClose) === "function" ? fn.close(st.afterClose) :fn.close() ;
		}

	}
	
	fn = {

		open : (callback) =>{

			let modal = $(st.tpl).appendTo("body");
			modal.css({
					"display"			: "flex",
					"justify-content" 	:"center",
					"align-items"		: "center"
			});

			let html = $($(".link_modal a").attr("data-href"));

			asyncatchDom();
			dom.content.append(html);
			asynSuscribeEvents();

			callback!= undefined ? fn.callback() : '';

		},

		close : (callback) =>{

			dom.parent.remove().hide();
			callback!= undefined ? fn.callback() : '';
		},
		
	}

	
  	initialize = (opts) => {
  	st = $.extend({},defaults,opts);
    catchDom();
    suscribeEvents();

		
  };
	return{
		init : initialize
	}
},[]);
