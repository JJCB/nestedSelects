yOSON.AppCore.addModule("modal", (Sb) => {
	
	let st			= {},
	defaults		= {},
	dom				= {},      
	events,
	fn,
	catchDom,
	suscribeEvents,
	asyncatchDom,
	asynSuscribeEvents,
	initialize;

	defaults = {
		parent				: ".modal-overlay",
		wrap 		 			: ".modal-wrap",
		content				: ".modal-content",
		btnClose			: ".modalClose",
		modalLoading	: ".modal-loading",
		tplWrap 			: "<div class='modal-overlay'><div class='modalClose'>X Cerrar</div><div class='modal-wrap'> <div class='modal-content'></div><span class='modalClose'></span></div></div>",
		tplLoading 		: "<div class='modal-loading'><img src='../../neoauto3/public/static/neoauto3/img/plugins/fancybox/fancybox_loading@2x.gif'></div>",
		settings    	: {
			cssWrap			: {
				padding 		: "20px",
			},
			cssContent 	: {},
			onResize		: true
		}
	}
	
	asyncatchDom = () => {

		dom.parent 					= $(st.parent);
		dom.wrap 						=	$(st.wrap, st.parent)
		dom.btnClose 				= $(st.btnClose, dom.parent);
		dom.content 				= $(st.content, dom.parent);
	}

	asynSuscribeEvents = () =>{

		dom.btnClose.on("click", events.close);
		dom.parent.on("click", events.close);
	}
	
	events = {

		openModal (e) {
			fn.openNew();
		},

		close (e) {

			if (e.target == this){
				fn.close(st.settings.afterClose);
			}
		}
	}

	
	fn = {
		openNew(opts = {}) {
			st.settings = $.extend({}, defaults.settings, opts);

			new Image().src = "http://www.construyehogar.com/wp-content/uploads/2015/06/Dise%C3%B1o-de-casa-moderna-de-dos-plantas.jpg";
			new Image().src = "http://1.bp.blogspot.com/-9O6l6K9RfKs/VbHLGfeuglI/AAAAAAAABKE/RYyY-1EOlMI/s640/FACHADAS%2BDE%2BCASAS%2BDE%2BCAMPO%2B3.jpg";
			
			var view = new Image();
			
			console.log("valor : ", view.complete)

		},
		
		open (opts = {}) {

			st.settings = $.extend({}, defaults.settings, opts);
			fn.showLoading();
			fn._loadModal();
			
			if(st.settings.beforeShow && typeof st.settings.beforeShow === "function") {
				fn._beforeShow();
			}
			else{
				fn._addHtmlModal();
			}
		},	

		_addHtmlModal () {

			dom.content.append(st.settings.html);

			fn._setCss();

			if(st.settings.afterShow && typeof st.settings.afterShow === "function"){
				fn._afterShow();
			}
			fn._onResize();
		},

		_beforeShow () {

			st.settings.beforeShow(st.tplWrap);
			setTimeout(fn._addHtmlModal(), 1000);
		},

		_afterShow () {

			setTimeout(st.settings.afterShow(),1)
		},

		_loadModal () {

			$("body").append(st.tplWrap);
			asyncatchDom();
			asynSuscribeEvents();
		},

		_setCss () {

			if(st.settings.locked){

				$("body").addClass("locked")
				$("html").addClass("locked-html")
			}
			dom.wrap.css({

				left: ($(window).width() - dom.wrap.outerWidth())/2,
				top: ($(window).height() - dom.wrap.outerHeight())/2
			})
			
			dom.wrap.addClass("active");
			fn.hideLoading();

		//	dom.parent.css(st.settings.css || {})

	},

	_onResize () {

		$(window).resize(()=>{
			dom.wrap.css({
				left: ($(window).width() - dom.wrap.outerWidth())/2,
				top: ($(window).height() - dom.wrap.outerHeight())/2
			})
		});
		setTimeout(function(){$(window).trigger("resize")},2);
	},

	updateSize () {

		fn._onResize();
	},

	close (callback) {

		dom.parent.remove();
			//dom.overlay.remove();

			$("body").removeClass("locked");
			$("html").removeClass("locked-html")

			if(callback && $.type(callback) === "function"){
				setTimeout(callback,1)
			}
		},

		showLoading () {
			$(st.tplLoading).appendTo("body");
		},

		hideLoading () {
			$(st.modalLoading).remove();
		}
	}

	initialize = (oP) => {

		st = $.extend({}, defaults, oP);
		Sb.events(["modal:open"], fn.open, this);
		Sb.events(["modal:updateSize"], fn.updateSize, this);
		Sb.events(["modal:showLoading"], fn.showLoading, this);
		Sb.events(["modal:hideLoading"], fn.hideLoading, this);
	};

	return{
		init : initialize
	};
});

