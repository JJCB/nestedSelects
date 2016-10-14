let modal = (()=>{
	
	let st              = {},
      dom             = {},      
      events,
      fn,
      findDatos={},
      catchDom,
      asyncatchDom,
      afterCatchDom,
      suscribeEvents,
      asynSuscribeEvents,
      initialize;

	st = {
		linkModal 		: ".link_modal a",
		slcDepart		: "select[name='depart']",
		slcProv			: "select[name='prov']",
		slcDist			: "select[name='dist']",
		btnAdd			: ".btn_add",
		btnUpdate		: ".btn_update",
		btnRemove		: "li .remove",
		btnEdit			: "li .edit",
		urlDepart		: "http://www.json-generator.com/api/json/get/bYmFFsHmDC?indent=2",
		urlprov			: "http://www.json-generator.com/api/json/get/cpXdelSNki?indent=2",
		urlDist			: "http://www.json-generator.com/api/json/get/cjWbLDrQXS?indent=2",
		arrayList		: [],
		contentList 	: "#addDatos",
		html 			: "",
		id 				: null,
		data	: {
			dpto 	: {},
			prov 	: {},
			dist 	: {}
		},

	}
			
	catchDom = () => {
		dom.linkModal 		= $(st.linkModal);
		dom.idTpl			= dom.linkModal.data("link-modal");
	}

	asyncatchDom = () =>{
		dom.slcDepart	= $(st.slcDepart, st.parentModal);
		dom.slcProv		= $(st.slcProv, st.parentModal);
		dom.slcDist		= $(st.slcDist, st.parentModal);
		dom.btnAdd		= $(st.btnAdd, st.parentModal);
		dom.contentList = $(st.contentList);
		dom.btnRemove	= $(st.btnRemove);
		dom.btnEdit		= $(st.btnEdit);
		dom.btnUpdate	= $(st.btnUpdate);
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
		dom.slcDepart.change( events.findprovincia);
		dom.slcProv.change( events.findDistrito);

		dom.btnAdd.on("click", events.addList);
		dom.btnRemove.on("click", events.removeList);
		dom.btnEdit.on("click", events.editList);
		dom.btnUpdate.on("click", events.updateList);
		$("#modal").on("click",'.remove',events.removeList)
		$("#modal").on("click",'.edit',events.editList)
	}
	
	events = {

		openModal : (e) => {			
			e.preventDefault();
			fn.renderModal();

		},

		findprovincia : () =>{			
			fn.ajaxProv();
			fn.cleanSlcDist();

		},

		findDistrito : () =>{
			fn.ajaxDist();
		},

		
		removeList : (e) => {

			let id 		= $(e.target).parent().children("div").attr("data-id");

			st.arrayList.splice(id, 1);

			$(e.target).parent().slideUp("slow",function(){

				if(st.arrayList.length==0){
					$(".list_add").slideUp();
				}
				fn.showList();
			});
			$("ul li").removeClass("active");
			st.id = null;
			fn.changeAdd();
			
			

		},
		addList : () => {

			var data = fn.captureData();
			st.arrayList.push(data);
			fn.showList ();
			
		},
		editList :(e) => {

			st.id 	 	= $(e.target).parent().children("div").attr("data-id");
			st.data 	= st.arrayList[st.id];
			$("ul li").removeClass("active");
			$(e.target).parent().addClass("active");
			fn.editData();

			
			
		},

		updateList : () =>{
			st.arrayList[st.id] 	= fn.captureData();
			dom.btnAdd.show();
			dom.btnUpdate.hide();
			fn.showList ();

		}
	}
	
	fn = {

		renderModal : function(){
			fn.template($(dom.idTpl).html(),{data : {}} ,function(html){

				st.html += html;
				fn.list();

			});
		},

		list : () => {

			fn.template($("#addDatos").html(),{data:st.arrayList}, function(html){

				st.html += html;
				fn.modal(st.html);
				st.html = "";
			});
		},

		modal : (html)=>{

			$.fancybox.open(html,{
				afterShow	: fn.AfterModal,
				afterClose  : fn.cleanData
			});
		},

		AfterModal : () =>{

			fn.ajaxDepart();
			asyncatchDom();
			asynSuscribeEvents();
		},

		ajaxDepart : (callback) => {
			$.ajax({
				url			: st.urlDepart,
				dataType	: "json",
				success 	: (data) => {
					fn.successAjaxDepart(data, callback);
					
				}

			})	
		},
		ajaxProv : (callback) => {
			$.ajax({
				url			: st.urlprov,
				dataType	: "json",
				success 	: (data) =>{
					fn.successAjaxProv(data, callback);
				}
			})	
		},
		ajaxDist	 : (callback) => {
			$.ajax({
				url				: st.urlDist,
				dataType		: "json",
				success 		: (data) =>{
					fn.successAjaxDist(data, callback);
				}
			})	
		},

		successAjaxDepart : (data, callback)=>{

			fn.template($("#listSlc").html(), {data: data, id:st.data.dpto.id }, function(html){
				$(dom.slcDepart).append(html);
				callback != undefined ?  callback(fn.ajaxDist) :'';
			});

		},
		successAjaxProv : (data,callback) => {

			let valorOption = dom.slcDepart.val();
			let content 	= data[valorOption];

			fn.template($("#listSlc").html(), {data:content, id:st.data.prov.id}, function(html){
				dom.slcProv.html(html);
				callback != undefined ? callback(fn.changeUpdate) :'';
			});
			
		},

		successAjaxDist : (data,callback) => {

			let valorOption = dom.slcProv.val();
			let content 	= data[valorOption];

			fn.template($("#listSlc").html(), {data:content, id:st.data.dist.id}, function(html){
				dom.slcDist.html(html);
				callback != undefined ? callback(fn.changeUpdate) :'';
			});
		},

		template : (tpl, data, fn) =>{

			let html = _.template(tpl, data);		
			
			if (fn != undefined) {
				fn(html);
			}
		},

		showList : () =>{

			$(".list_add ").remove();
			let li 	= _.template($("#addDatos").html(),{data:st.arrayList});

			// Hacer prueba con $(documento).on("click",'.clase',evento);

			//let $li = $(li);

			//$li.on("click",".remove", events.removeList);

			//$li.on("click",".edit", events.editList);
			$("#modal").append(li);
		},
		captureData : () =>{
		
			return {
				dpto: {
					id : dom.slcDepart.val(),
					name : $("select[name='depart'] option:selected").text()
				},
				prov : {
					id : dom.slcProv.val(),
					name : $("select[name='prov'] option:selected").text()
				},
				dist : {
					id : dom.slcDist.val(),
					name : $("select[name='dist'] option:selected").text()	
				}
			}
		},

		cleanData : () =>{
			st.id 	= null;
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

		cleanSlcDist : ()=>{
			dom.slcDist.children("option").remove();
			dom.slcDist.append("<option selected disabled>Selecciona</option>");
		},

		changeUpdate : () =>{

			dom.btnAdd.hide();
			dom.btnUpdate.show();
			$(".btn_loading").hide();
		},

		changeAdd :() =>{

			dom.btnAdd.show();
			dom.btnUpdate.hide();
		},
		changeLoading : () => {
			dom.btnAdd.hide();
			dom.btnUpdate.hide();
			$(".btn_loading").show();
		},
		editData : () =>{
			fn.changeLoading();
			fn.ajaxDepart(fn.ajaxProv);
		}
		
	}
	
  	initialize = () => {
    catchDom();
	afterCatchDom();
    suscribeEvents();
		
  };
	
	return{
		init : initialize
	}
})();

modal.init();
