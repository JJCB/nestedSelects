yOSON.AppCore.addModule("combo_anidado", (Sb) => {
	let st 						= {},
			dom 					= {},
			events,
			fn,
			catchDom,
			asyncatchDom,
			afterCatchDom,
			suscribeEvents,
			asynSuscribeEvents,
			initialize;

	st = {

		linkModal 		: ".link_modal a",
		parentModal		: "#modal",
		tplListSlc		: "#tplListSlc",
		tplShowList		: "#tplShowList",
		slcDpto				: "select[name='dpto']",
		slcProv				: "select[name='prov']",
		slcDist				: "select[name='dist']",
		btnAdd				: ".btn_add",
		btnUpdate			: ".btn_update",
		btnRemove			: ".btn_remove",
		btnEdit				: ".btn_edit",
		urlDepart			: "http://www.json-generator.com/api/json/get/bYmFFsHmDC?indent=2",
		urlprov				: "http://www.json-generator.com/api/json/get/cpXdelSNki?indent=2",
		urlDist				: "http://www.json-generator.com/api/json/get/cjWbLDrQXS?indent=2",
		arrayList			: [],
		html 					: "",
		idArray				: null,
		data	: {
			dpto 	: {},
			prov 	: {},
			dist 	: {}
		},
		
	}

			
	catchDom = () => {

		dom.linkModal 	= $(st.linkModal);
		dom.idTpl				= dom.linkModal.attr("data-link-modal");
	}

	asyncatchDom = () =>{

		dom.parentModal 	= $(st.parentModal);
		dom.slcDpto				= $(st.slcDpto, st.parentModal);
		dom.slcProv				= $(st.slcProv, st.parentModal);
		dom.slcDist				= $(st.slcDist, st.parentModal);
		dom.btnAdd				= $(st.btnAdd, st.parentModal);
		dom.btnRemove			= $(st.btnRemove, st.parentModal);
		dom.btnEdit				= $(st.btnEdit, st.parentModal);
		dom.btnUpdate			= $(st.btnUpdate, st.parentModal);
	}

	afterCatchDom = () => {

		_.templateSettings = {
			evaluate: /\{\{([\s\S]+?)\}\}/g,
			interpolate: /\{\{=([\s\S]+?)\}\}/g
		}
	}
	
	suscribeEvents = () => {
		dom.linkModal.on("click", events.openModal);
	}

	asynSuscribeEvents = () =>{

		dom.slcDpto.on("change", events.findProvincia);
		dom.slcProv.on("change", events.findDistrito);
		dom.btnAdd.on("click", events.addList);
		dom.btnUpdate.on("click", events.updateList);
		dom.parentModal.on("click", st.btnRemove, events.removeList);
		dom.parentModal.on("click", st.btnEdit, events.editList);
	}
	
	events = {

		openModal (e) {
			e.preventDefault();
			fn.renderModal();
		},

		findProvincia () {

			let ajax = [
				{
					slc 		: dom.slcProv,
					id  		: st.data.prov.id,
					parent 	: dom.slcDpto,
					url 		: st.urlprov
				}
			];

			fn.ajax(ajax);
			fn.cleanSlcDist();
		},

		findDistrito () {

			let ajaxDist = [
					{
						slc 		: dom.slcDist,
						id  		: st.data.dist.id,
						parent 	: dom.slcProv,
						url 		: st.urlDist
					}
				];

			fn.ajax(ajaxDist);
		},

		removeList (e) {

			let id 		= $(e.target).siblings("div").attr("data-id");
			st.arrayList.splice(id, 1);

			$(e.target).parent().slideUp("slow",() =>{

				if(!st.arrayList.length){
					$(".content_list").slideUp();
				}
				else{
					fn.showList();
				}
			});

			$("ul li").removeClass("active");
			st.idArray = null;
			fn.changeAdd();
			
		},

		addList () {

			let data = fn.captureData();
			st.arrayList.push(data);
			fn.showList ();
			
		},

		editList (e) {

			st.idArray 	= $(e.target).parent().children("div").attr("data-id");
			st.data 		= st.arrayList[st.idArray];
			$("ul li").removeClass("active");
			$(e.target).parent().addClass("active");
			fn.editData();

		},

		updateList () {

			st.arrayList[st.idArray] 	= fn.captureData();
			dom.btnAdd.show();
			dom.btnUpdate.hide();
			fn.showList ();

		}
	}
	
	fn = {

		renderModal () {

			fn.template($(dom.idTpl).html(),{data : {}} ,(html) => {
				st.html += html;
				fn.LoadDataList();

			});
		},

		LoadDataList () {

			fn.template($(st.tplShowList).html(),{data:st.arrayList}, (html) => {
				st.html += html;
				fn.showModal(st.html);
				st.html = "";
			});
		},

		showModal (html) {

			let opts ={

				html					: html,
				locked 				: true,
				afterShow 		: fn.AfterModal,
				beforeShow		: fn.before,
				afterClose		: fn.cleanData,

			}
			
			Sb.trigger('modal:open', opts);
		},

		AfterModal () {

			asyncatchDom();
			let ajax = [
					{
						slc 		: dom.slcDpto,
						id			: st.data.dpto.id,
						parent 	: false,
						url 		: st.urlDepart,
					}
				];

			fn.ajax(ajax);
			asynSuscribeEvents();
		},
	
		ajax (opts) {

			let dataSlc = opts[0];
			$.ajax({
				url					: dataSlc.url,
				dataType		: "json",
				success 		: (data) =>{

					opts.splice(0, 1);
					let valor = data;
					if (dataSlc.parent) {

						let option = dataSlc.parent.val();
						valor = valor[option];
					}
					
					fn.template($(st.tplListSlc).html(), {data: valor, id:dataSlc.id}, (html) => {
						
						$(dataSlc.slc).html(html);
						if(typeof(dataSlc.callback)==="function"){
							dataSlc.callback(opts);
						}
					});
				}
			})	
		},

		template (tpl, data, fn) {

			let html = _.template(tpl, data);		
			if (fn != undefined) {
				fn(html);
			}
		},

		showList () {

			$(".content_list ").remove();
			fn.template($(st.tplShowList).html(),{data:st.arrayList}, (html) => {
				dom.parentModal.append(html);
				Sb.trigger('modal:onResize');

			});
		},

		captureData () {

			let myObject = {};
			$( "select option:selected" ).each( function(index) {
					myObject[$(this).parent().attr("name")] = {
						id 	 : $(this).val(),
						name : $(this).text(), 
					}
			});
				return myObject;
		},

		cleanData () {

			st.idArray 	= null;
			st.data = {
					dpto: {
						id 		: null,
						name 	: null
					},
					prov : {
						id 		: null,
						name 	: null
					},
					dist : {
						id 		: null,
						name 	: null	
					}
				}
		},

		cleanSlcDist () {
			dom.slcDist.children("option").remove();
			dom.slcDist.append("<option selected disabled>Selecciona</option>");
		},

		changeUpdate () {

			dom.btnAdd.hide();
			dom.btnUpdate.show();
			$(".btn_loading").hide();
		},

		changeAdd () {

			dom.btnAdd.show();
			$(".btn_loading").hide();
			dom.btnUpdate.hide();
		},

		changeLoading () {

			dom.btnAdd.hide();
			dom.btnUpdate.hide();
			$(".btn_loading").show();
		},

		editData () {

			fn.changeLoading();
			let data=  [
				{
					slc 			: dom.slcDpto,
					id  			: st.data.dpto.id,
					parent  	: false,
					name 			: "depart",
					url 			: st.urlDepart,
					callback	: fn.ajax

				},
				{
					slc 			: dom.slcProv,
					id  			: st.data.prov.id,
					parent 		: dom.slcDpto,
					name 			: "prov",
					url 			: st.urlprov,
					callback	: fn.ajax
					
					
				},
				{
					slc 			: dom.slcDist,
					id 				: st.data.dist.id,
					parent 		: dom.slcProv,
					name 			: "dist",
					url 			: st.urlDist,
					callback 	: fn.changeUpdate
				}
			]

			fn.ajax(data);
		}
	}

	initialize = () => {

		catchDom();
		afterCatchDom();
		suscribeEvents();
	};
	
	return{
		init : initialize
	};
});
		
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
		parent				: ".modal-wrap",
		content				: ".modal-content",
		overlay 			: ".modal-overlay",
		btnClose			: ".close",
		modalLoading	: ".modal-loading",
		tplWrap 			: "<div class='modal-overlay'></div><div class='modal-wrap'> <div class='modal-content'></div><span class='close'></span></div>",
		tplLoading 		: "<div class='modal-loading'><img src='../img/loading.gif'></div>",
		settings    	: {
				onResize			: true
		}

	}
			
	asyncatchDom = () => {

		dom.btnClose 				= $(st.btnClose);
		dom.content 				= $(st.content);
		dom.parent 					= $(st.parent);
		dom.overlay 				= $(st.overlay);
		dom.modalLoading 		= $(st.modalLoading);
	}

	asynSuscribeEvents = () =>{
		dom.btnClose.on("click", events.close);
		dom.overlay.on("click", events.close);

	}
	
	events = {

		openModal (e) {
			fn.open(opts);
		},

		close () {
			fn.close(st.settings.afterClose);
		}
	}
	
	fn = {
		
		open (opts = {}) {

			st.settings = $.extend({}, defaults.settings, opts);
			fn.beforeShow();
			fn.showModal();
			dom.content.append(st.settings.html);
			fn.afterShow();
			fn.modalCss();
			st.settings.onResize ? fn.onResize() : '' ;

		},	

		beforeShow () {

			$.type(st.settings.beforeShow) === "function" ? st.settings.beforeShow (): '';
		},

		afterShow () {

			$.type(st.settings.afterShow) === "function" ? setTimeout(st.settings.afterShow(),1): '';
		},

		showModal () {

			$(st.tplWrap).appendTo("body");
			asyncatchDom();
			asynSuscribeEvents();
		},

		modalCss () {
			dom.parent.css({
					position:'fixed',
					left: ($(window).width() - dom.parent.outerWidth())/2,
					top:  ($(window).height() - dom.parent.outerHeight())/2
			});
			st.settings.locked == true ? $("body").addClass("locked") : '';
		},

		close (callback) {

			dom.parent.remove();
			dom.overlay.remove();
			$("body").removeClass("locked");
			$.type(callback) === "function" ? setTimeout(callback,1)  : '' ;
		},

		onResize () {
			
			$(window).resize(()=>{
					dom.parent.css({
						position:'fixed',
						left: ($(window).width() - dom.parent.outerWidth())/2,
						top: ($(window).height() - dom.parent.outerHeight())/2
				})
			});
			$(window).trigger("resize");
		},

		showLoading () {
			$(st.tplLoading).appendTo("body");
		},

		hideLoading () {
			$(".modal-loading").remove();
		}
	}

	initialize = (oP) => {

		st = $.extend({}, defaults, oP);
		Sb.events(["modal:open"], fn.open, this);
		Sb.events(["modal:onResize"], fn.onResize, this);
		Sb.events(["modal:showLoading"], fn.showLoading, this);
		Sb.events(["modal:hideLoading"], fn.hideLoading, this);
	};
	return{
		init : initialize
	};
});