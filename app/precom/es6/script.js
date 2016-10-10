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
		linkModal 	: ".link_modal a",
		slcDepart		: "select[name='depart']",
		slcProv			: "select[name='prov']",
		slcDist			: "select[name='dist']",
		btnAdd			: ".btn_add",
		urlDepart		: "http://www.json-generator.com/api/json/get/bYmFFsHmDC?indent=2",
		urlprov			: "http://www.json-generator.com/api/json/get/cpXdelSNki?indent=2",
		urlDist			: "http://www.json-generator.com/api/json/get/cjWbLDrQXS?indent=2",
		datosList		: [],
		contentList 	: "#addDatos",
		findDatos		: {
			depart 	: null,
			prov 		: null,
			distri 	: null, 
		}

	}
			
	catchDom = () => {
		dom.linkModal = $(st.linkModal);
		dom.idTpl			= dom.linkModal.data("link-modal");
	}

	asyncatchDom = () =>{
		dom.slcDepart	= $(st.slcDepart, st.parentModal);
		dom.slcProv		= $(st.slcProv, st.parentModal);
		dom.slcDist		= $(st.slcDist, st.parentModal);
		dom.btnAdd		= $(st.btnAdd, st.parentModal);
		dom.contentList = $(st.contentList);
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
		dom.btnAdd.on("click", events.captureDato);
	}
	
	events = {

		openModal : (e) => {			
			e.preventDefault();
			fn.ajaxDepart();
		},

		findprovincia : () =>{			
			fn.ajaxProv();
		},

		findDistrito : () =>{
			fn.ajaxDist();
		},

		captureDato : () =>{

			let valorDept = $("select[name='depart'] option:selected").text();
			let valorprov = $("select[name='prov'] option:selected").text();
			let valorDis = $("select[name='dist'] option:selected").text();

			if(valorDept == null || valorprov == null || valorDis == null){
				console.log("Falta Seleccionar datos");
			}
			else{
				fn.addList(valorDept, valorprov, valorDis);
			}			

		},
		removeList : (e) => {
			let $this = $(e.target);
			let $parent = $this.parent()
			$parent.slideUp("slow",function(){
				$(this).remove();
			});
		},
		searchDato : (e) =>{
			let $this 	= $(e.target);
			findDatos.depart = $this.parent().find(".depart").text();
			findDatos.prov = $this.parent().find(".prov").text();
			findDatos.dist = $this.parent().find(".dist").text();

			console.log("depart", findDatos.depart);
			console.log("prov", findDatos.prov);
			console.log("dist", findDatos.dist);
		
		}
	}
	
	fn = {
		AfterModal : () =>{
			asyncatchDom();
			asynSuscribeEvents();
		},

		ajaxDepart : () => {
			$.ajax({
				url				: st.urlDepart,
				dataType	: "json",
				success 	: fn.successAjaxDepart
			})	
		},
		ajaxProv : () => {
			$.ajax({
				url			: st.urlprov,
				dataType	: "json",
				success 	: fn.successAjaxProv
			})	
		},
		ajaxDist	 : () => {
			$.ajax({
				url				: st.urlDist,
				dataType		: "json",
				success 		:fn.successAjaxDist
			})	
		},

		successAjaxDepart : function(data){
			fn.template($(dom.idTpl).html(), {dep: data},fn.modal);			
		},

		modal : (html)=>{
			$.fancybox.open(html,{
				afterShow: fn.AfterModal
			});
		},

		successAjaxProv : (data) => {
			let valorOption = dom.slcDepart.val();
			fn.template($("#listProvicia").html(),	{prov:data, idprov:valorOption, search:findDatos.prov}, function(html){
				dom.slcProv.html(html);		
			});
			
		},

		searchDato : () =>{
			let valorDept = $()
		},

		successAjaxDist : (data) => {
			let valorOption = dom.slcProv.val();
			fn.template($("#listDistrito").html(),{dist:data,idDist:valorOption}, function(html){				
				dom.slcDist.html(html);
			});
		},

		template : (tpl, data, fn) =>{
			let html = _.template(tpl, data);		
			
			if (fn != undefined) {
				fn(html);
			}
		},

		addList : (dep,prov,dist) => {

			let li = _.template($("#addDatos").html(),{dep:dep,prov:prov,dist:dist});
			let $li = $(li);
			$li.on("click",".remove", events.removeList);
			$li.on("click",".edit", events.searchDato);
			$("ul.content_list").append($li);
		},
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
