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
		btnUpdate: ".btn_update",
		urlDepart: "http://www.json-generator.com/api/json/get/bYmFFsHmDC?indent=2",
		urlprov: "http://www.json-generator.com/api/json/get/cpXdelSNki?indent=2",
		urlDist: "http://www.json-generator.com/api/json/get/cjWbLDrQXS?indent=2",
		dataList: [],
		contentList: "#addDatos",
		btnRemove: "li .remove",
		btnEdit: "li .edit",
		html: "",
		id: null,
		data: {
			dpto: {},
			prov: {},
			dist: {}
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
		dom.btnRemove = $(st.btnRemove);
		dom.btnEdit = $(st.btnEdit);
		dom.btnUpdate = $(st.btnUpdate);
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
		dom.btnAdd.on("click", events.addList);

		dom.btnRemove.on("click", events.removeList);
		dom.btnEdit.on("click", events.editList);
		dom.btnUpdate.on("click", events.updateList);
	};

	events = {

		openModal: function openModal(e) {
			e.preventDefault();
			fn.renderModal();
		},

		findprovincia: function findprovincia() {
			fn.ajaxProv();
			fn.cleanSlcDist();
		},

		findDistrito: function findDistrito() {
			fn.ajaxDist();
		},

		removeList: function removeList(e) {

			var id = $(e.target).children("div").attr("data-id");
			st.dataList.splice(id, 1);

			$(e.target).parent().slideUp("slow", function () {

				$(this).remove();
				if (st.dataList.length == 0) {
					$(".list_add").slideUp();
					console.log("Data List");
				}
				fn.arrayList();
			});
			$("ul li").removeClass("active");
			st.id = null;
			fn.changeAdd();
		},
		addList: function addList() {

			var data = fn.captureData();
			st.dataList.push(data);
			fn.arrayList();
		},
		editList: function editList(e) {

			st.id = $(e.target).parent().children("div").attr("data-id");
			st.data = st.dataList[st.id];
			$("ul li").removeClass("active");
			$(e.target).parent().addClass("active");
			fn.editData();
		},

		updateList: function updateList() {
			st.dataList[st.id] = fn.captureData();
			dom.btnAdd.show();
			dom.btnUpdate.hide();
			fn.arrayList();
		}
	};

	fn = {

		renderModal: function renderModal() {
			fn.template($(dom.idTpl).html(), { data: {} }, function (html) {

				st.html += html;
				fn.list();
			});
		},

		list: function list() {

			fn.template($("#addDatos").html(), { data: st.dataList }, function (html) {

				st.html += html;
				fn.modal(st.html);
				st.html = "";
			});
		},

		modal: function modal(html) {

			$.fancybox.open(html, {
				afterShow: fn.AfterModal,
				afterClose: fn.cleanData
			});
		},

		AfterModal: function AfterModal() {

			fn.ajaxDepart();
			asyncatchDom();
			asynSuscribeEvents();
		},

		ajaxDepart: function ajaxDepart(callback) {
			$.ajax({
				url: st.urlDepart,
				dataType: "json",
				success: function success(data) {
					fn.successAjaxDepart(data, callback);
				}

			});
		},
		ajaxProv: function ajaxProv(callback) {
			$.ajax({
				url: st.urlprov,
				dataType: "json",
				success: function success(data) {
					fn.successAjaxProv(data, callback);
				}
			});
		},
		ajaxDist: function ajaxDist(callback) {
			$.ajax({
				url: st.urlDist,
				dataType: "json",
				success: function success(data) {
					fn.successAjaxDist(data, callback);
				}
			});
		},

		successAjaxDepart: function successAjaxDepart(data, callback) {

			fn.template($("#listSlc").html(), { data: data, id: st.data.dpto.id }, function (html) {
				$(dom.slcDepart).append(html);
				callback != undefined ? callback(fn.ajaxDist) : '';
			});
		},
		successAjaxProv: function successAjaxProv(data, callback) {

			var valorOption = dom.slcDepart.val();
			var content = data[valorOption];

			fn.template($("#listSlc").html(), { data: content, id: st.data.prov.id }, function (html) {
				dom.slcProv.html(html);
				callback != undefined ? callback(fn.changeUpdate) : '';
			});
		},

		successAjaxDist: function successAjaxDist(data, callback) {

			var valorOption = dom.slcProv.val();
			var content = data[valorOption];

			fn.template($("#listSlc").html(), { data: content, id: st.data.dist.id }, function (html) {
				dom.slcDist.html(html);
				callback != undefined ? callback(fn.changeUpdate) : '';
			});
		},

		template: function template(tpl, data, fn) {

			var html = _.template(tpl, data);

			if (fn != undefined) {
				fn(html);
			}
		},

		arrayList: function arrayList() {
			console.log("lista");
			$(".list_add ").remove();
			var li = _.template($("#addDatos").html(), { data: st.dataList });
			var $li = $(li);

			$li.on("click", ".remove", events.removeList);
			$li.on("click", ".edit", events.editList);
			$("#modal").append($li);
		},
		captureData: function captureData() {

			return {
				dpto: {
					id: dom.slcDepart.val(),
					name: $("select[name='depart'] option:selected").text()
				},
				prov: {
					id: dom.slcProv.val(),
					name: $("select[name='prov'] option:selected").text()
				},
				dist: {
					id: dom.slcDist.val(),
					name: $("select[name='dist'] option:selected").text()
				}
			};
		},

		cleanData: function cleanData() {
			st.id = null;
			st.data = {
				dpto: {
					id: null,
					name: null
				},
				prov: {
					id: null,
					name: null
				},
				dist: {
					id: null,
					name: null
				}
			};
		},

		cleanSlcDist: function cleanSlcDist() {
			dom.slcDist.children("option").remove();
			dom.slcDist.append("<option selected disabled>Selecciona</option>");
		},

		changeUpdate: function changeUpdate() {

			dom.btnAdd.hide();
			dom.btnUpdate.show();
		},

		changeAdd: function changeAdd() {
			dom.btnAdd.show();
			dom.btnUpdate.hide();
		},
		editData: function editData() {
			fn.ajaxDepart(fn.ajaxProv);
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