"use strict";

var modal = function () {

	var st = {},
	    dom = {},
	    events = void 0,
	    fn = void 0,
	    findDatos = {},
	    catchDom = void 0,
	    asyncatchDom = void 0,
	    afterCatchDom = void 0,
	    suscribeEvents = void 0,
	    asynSuscribeEvents = void 0,
	    initialize = void 0;

	st = {
		linkModal: ".link_modal a",
		slcDepart: "select[name='depart']",
		slcProv: "select[name='prov']",
		slcDist: "select[name='dist']",
		btnAdd: ".btn_add",
		urlDepart: "http://www.json-generator.com/api/json/get/bYmFFsHmDC?indent=2",
		urlprov: "http://www.json-generator.com/api/json/get/cpXdelSNki?indent=2",
		urlDist: "http://www.json-generator.com/api/json/get/cjWbLDrQXS?indent=2",
		datosList: [],
		contentList: "#addDatos",
		findDatos: {
			depart: null,
			prov: null,
			distri: null
		}

	};

	catchDom = function catchDom() {
		dom.linkModal = $(st.linkModal);
		dom.idTpl = dom.linkModal.data("link-modal");
	};

	asyncatchDom = function asyncatchDom() {
		dom.slcDepart = $(st.slcDepart, st.parentModal);
		dom.slcProv = $(st.slcProv, st.parentModal);
		dom.slcDist = $(st.slcDist, st.parentModal);
		dom.btnAdd = $(st.btnAdd, st.parentModal);
		dom.contentList = $(st.contentList);
	};

	afterCatchDom = function afterCatchDom() {
		_.templateSettings = {
			evaluate: /\{\{([\s\S]+?)\}\}/g,
			interpolate: /\{\{=([\s\S]+?)\}\}/g
		};
	};

	suscribeEvents = function suscribeEvents() {
		dom.linkModal.on("click", events.openModal);
	};

	asynSuscribeEvents = function asynSuscribeEvents() {
		dom.slcDepart.change(events.findprovincia);
		dom.slcProv.change(events.findDistrito);
		dom.btnAdd.on("click", events.captureDato);
	};

	events = {

		openModal: function openModal(e) {
			e.preventDefault();
			fn.ajaxDepart();
		},

		findprovincia: function findprovincia() {
			fn.ajaxProv();
		},

		findDistrito: function findDistrito() {
			fn.ajaxDist();
		},

		captureDato: function captureDato() {

			var valorDept = $("select[name='depart'] option:selected").text();
			var valorprov = $("select[name='prov'] option:selected").text();
			var valorDis = $("select[name='dist'] option:selected").text();

			if (valorDept == null || valorprov == null || valorDis == null) {
				console.log("Falta Seleccionar datos");
			} else {
				fn.addList(valorDept, valorprov, valorDis);
			}
		},
		removeList: function removeList(e) {
			var $this = $(e.target);
			var $parent = $this.parent();
			$parent.slideUp("slow", function () {
				$(this).remove();
			});
		},
		searchDato: function searchDato(e) {
			var $this = $(e.target);
			findDatos.depart = $this.parent().find(".depart").text();
			findDatos.prov = $this.parent().find(".prov").text();
			findDatos.dist = $this.parent().find(".dist").text();

			console.log("depart", findDatos.depart);
			console.log("prov", findDatos.prov);
			console.log("dist", findDatos.dist);
		}
	};

	fn = {
		AfterModal: function AfterModal() {
			asyncatchDom();
			asynSuscribeEvents();
		},

		ajaxDepart: function ajaxDepart() {
			$.ajax({
				url: st.urlDepart,
				dataType: "json",
				success: fn.successAjaxDepart
			});
		},
		ajaxProv: function ajaxProv() {
			$.ajax({
				url: st.urlprov,
				dataType: "json",
				success: fn.successAjaxProv
			});
		},
		ajaxDist: function ajaxDist() {
			$.ajax({
				url: st.urlDist,
				dataType: "json",
				success: fn.successAjaxDist
			});
		},

		successAjaxDepart: function successAjaxDepart(data) {
			fn.template($(dom.idTpl).html(), { dep: data }, fn.modal);
		},

		modal: function modal(html) {
			$.fancybox.open(html, {
				afterShow: fn.AfterModal
			});
		},

		successAjaxProv: function successAjaxProv(data) {
			var valorOption = dom.slcDepart.val();
			fn.template($("#listProvicia").html(), { prov: data, idprov: valorOption, search: findDatos.prov }, function (html) {
				dom.slcProv.html(html);
			});
		},

		searchDato: function searchDato() {
			var valorDept = $();
		},

		successAjaxDist: function successAjaxDist(data) {
			var valorOption = dom.slcProv.val();
			fn.template($("#listDistrito").html(), { dist: data, idDist: valorOption }, function (html) {
				dom.slcDist.html(html);
			});
		},

		template: function template(tpl, data, fn) {
			var html = _.template(tpl, data);

			if (fn != undefined) {
				fn(html);
			}
		},

		addList: function addList(dep, prov, dist) {

			var li = _.template($("#addDatos").html(), { dep: dep, prov: prov, dist: dist });
			var $li = $(li);
			$li.on("click", ".remove", events.removeList);
			$li.on("click", ".edit", events.searchDato);
			$("ul.content_list").append($li);
		}
	};

	initialize = function initialize() {
		catchDom();
		afterCatchDom();
		suscribeEvents();
	};

	return {
		init: initialize
	};
}();

modal.init();