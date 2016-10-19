"use strict";

yOSON.AppCore.addModule("combo", function (Sb) {
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
		btnRemove: "li .remove",
		btnEdit: "li .edit",
		urlDepart: "http://www.json-generator.com/api/json/get/bYmFFsHmDC?indent=2",
		urlprov: "http://www.json-generator.com/api/json/get/cpXdelSNki?indent=2",
		urlDist: "http://www.json-generator.com/api/json/get/cjWbLDrQXS?indent=2",
		arrayList: [],
		html: "",
		idArray: null,
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

		$("#modal").on("click", '.remove', events.removeList);
		$("#modal").on("click", '.edit', events.editList);
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

			var id = $(e.target).parent().children("div").attr("data-id");

			st.arrayList.splice(id, 1);

			$(e.target).parent().slideUp("slow", function () {

				if (st.arrayList.length == 0) {
					$(".list_add").slideUp();
				}
				fn.showList();
			});
			$("ul li").removeClass("active");
			st.idArray = null;
			fn.changeAdd();
		},
		addList: function addList() {

			var data = fn.captureData();
			st.arrayList.push(data);
			fn.showList();
		},
		editList: function editList(e) {

			st.idArray = $(e.target).parent().children("div").attr("data-id");
			st.data = st.arrayList[st.idArray];
			$("ul li").removeClass("active");
			$(e.target).parent().addClass("active");
			fn.editData();
		},

		updateList: function updateList() {
			st.arrayList[st.idArray] = fn.captureData();
			dom.btnAdd.show();
			dom.btnUpdate.hide();
			fn.showList();
		}
	};

	fn = {

		renderModal: function renderModal() {

			fn.template($(dom.idTpl).html(), { data: {} }, function (html) {
				st.html += html;
				fn.dataList();
			});
		},

		dataList: function dataList() {

			fn.template($("#addDatos").html(), { data: st.arrayList }, function (html) {

				st.html += html;
				fn.modal(st.html);
				st.html = "";
			});
		},

		modal: function modal(html) {

			var opts = {
				html: html,
				locked: false,
				afterShow: fn.AfterModal,
				beforeShow: fn.before,
				afterClose: fn.cleanData

			};

			var data = Sb.trigger('modal:open', opts);
		},
		before: function before() {
			console.log("before mostrar");
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

			fn.template($("#listSlc").html(), { data: content, id: st.data.dist.idArray }, function (html) {
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

		showList: function showList() {

			$(".list_add ").remove();
			var li = _.template($("#addDatos").html(), { data: st.arrayList });

			$("#modal").append(li);

			Sb.trigger('modal:onResize');
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
			st.idArray = null;
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
			$(".btn_loading").hide();
		},

		changeAdd: function changeAdd() {

			dom.btnAdd.show();
			dom.btnUpdate.hide();
		},
		changeLoading: function changeLoading() {
			dom.btnAdd.hide();
			dom.btnUpdate.hide();
			$(".btn_loading").show();
		},
		editData: function editData() {
			fn.changeLoading();
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
}, []);

yOSON.AppCore.addModule("modal", function (Sb) {
	var _this = this;

	var st = {},
	    defaults = {},
	    dom = {},
	    events = void 0,
	    fn = void 0,
	    catchDom = void 0,
	    suscribeEvents = void 0,
	    asyncatchDom = void 0,
	    asynSuscribeEvents = void 0,
	    initialize = void 0;

	defaults = {
		parent: ".modal-fixed",
		parentWrap: ".modal-wrap",
		content: ".modal-content",
		btnClose: ".close",
		tpl: " <div class='modal-fixed'><div class='modal-wrap'> <div class='modal-content'></div><span class='close'></span></div></div>",
		settings: {}

	};

	catchDom = function catchDom() {
		dom.linkModal = $(st.linkModal);
	};

	asyncatchDom = function asyncatchDom() {
		dom.parent = $(st.parent);
		dom.btnClose = $(st.btnClose, st.parent);
		dom.content = $(st.content, st.parent);
		dom.parentWrap = $(st.parentWrap, st.parent);
	};

	suscribeEvents = function suscribeEvents() {
		dom.linkModal.on("click", events.openModal);
	};

	asynSuscribeEvents = function asynSuscribeEvents() {
		dom.btnClose.on("click", events.close);
	};

	events = {

		openModal: function openModal(e) {

			fn.open(opts);
		},

		close: function close() {
			fn.close();
		}

	};

	fn = {

		open: function open(opts) {

			st.settings = opts || {};

			$.type(st.settings.beforeShow) === "function" ? st.settings.beforeShow() : '';

			fn.showModal();
			dom.content.append(st.settings.html);
			fn.modalCss();
			$.type(st.settings.afterShow) === "function" ? setTimeout(st.settings.afterShow, 1) : '';
		},

		beforeShow: function beforeShow() {

			var bef = st.settings.beforeShow;
		},

		showModal: function showModal() {

			$(st.tpl).appendTo("body");
			asyncatchDom();
			asynSuscribeEvents();
		},

		modalCss: function modalCss() {

			dom.parentWrap.css({
				position: 'absolute',
				left: ($(window).width() - dom.parentWrap.outerWidth()) / 2,
				top: ($(window).height() - dom.parentWrap.outerHeight()) / 2
			});

			st.settings.locked == true ? $("body").addClass("locked") : console.log("none");
		},

		close: function close() {

			dom.parent.remove();
			$("body").removeClass("locked");
			$.type(st.settings.afterClose) === "function" ? setTimeout(st.settings.afterClose, 1) : '';
		},
		onResize: function onResize() {
			$(window).resize(fn.modalCss);
			$(window).trigger("resize");
		}

	};

	initialize = function initialize() {
		st = $.extend({}, defaults, {});
		catchDom();
		suscribeEvents();

		Sb.events(["modal:open"], fn.open, _this);
		Sb.events(["modal:onResize"], fn.onResize, _this);
	};
	return {
		init: initialize
	};
});