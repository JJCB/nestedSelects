"use strict";

yOSON.AppCore.addModule("combo", function (Sb) {
	var st = {},
	    dom = {},
	    events = void 0,
	    fn = void 0,
	    catchDom = void 0,
	    asyncatchDom = void 0,
	    afterCatchDom = void 0,
	    suscribeEvents = void 0,
	    asynSuscribeEvents = void 0,
	    initialize = void 0;

	st = {

		linkModal: ".link_modal a",
		parentModal: "#modal",
		tplListSlc: "#tplListSlc",
		tplShowList: "#tplShowList",
		slcDpto: "select[name='dpto']",
		slcProv: "select[name='prov']",
		slcDist: "select[name='dist']",
		btnAdd: ".btn_add",
		btnUpdate: ".btn_update",
		btnRemove: ".btn_remove",
		btnEdit: ".btn_edit",
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
		dom.idTpl = dom.linkModal.attr("data-link-modal");
	};

	asyncatchDom = function asyncatchDom() {

		dom.parentModal = $(st.parentModal);
		dom.slcDpto = $(st.slcDpto, st.parentModal);
		dom.slcProv = $(st.slcProv, st.parentModal);
		dom.slcDist = $(st.slcDist, st.parentModal);
		dom.btnAdd = $(st.btnAdd, st.parentModal);
		dom.btnRemove = $(st.btnRemove, st.parentModal);
		dom.btnEdit = $(st.btnEdit, st.parentModal);
		dom.btnUpdate = $(st.btnUpdate, st.parentModal);
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

		dom.slcDpto.on("change", events.findProvincia);
		dom.slcProv.on("change", events.findDistrito);
		dom.btnAdd.on("click", events.addList);
		dom.btnUpdate.on("click", events.updateList);
		dom.parentModal.on("click", st.btnRemove, events.removeList);
		dom.parentModal.on("click", st.btnEdit, events.editList);
	};

	events = {
		openModal: function openModal(e) {
			e.preventDefault();
			fn.renderModal();
		},
		findProvincia: function findProvincia() {

			var ajax = [{
				slc: dom.slcProv,
				id: st.data.prov.id,
				parent: dom.slcDpto,
				url: st.urlprov
			}];

			fn.ajax(ajax);
			fn.cleanSlcDist();
		},
		findDistrito: function findDistrito() {

			var ajaxDist = [{
				slc: dom.slcDist,
				id: st.data.dist.id,
				parent: dom.slcProv,
				url: st.urlDist
			}];

			fn.ajax(ajaxDist);
		},
		removeList: function removeList(e) {

			var id = $(e.target).siblings("div").attr("data-id");
			st.arrayList.splice(id, 1);

			$(e.target).parent().slideUp("slow", function () {

				if (!st.arrayList.length) {
					$(".content_list").slideUp();
				} else {
					fn.showList();
				}
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
				fn.LoadDataList();
			});
		},
		LoadDataList: function LoadDataList() {

			fn.template($(st.tplShowList).html(), { data: st.arrayList }, function (html) {
				st.html += html;
				fn.showModal(st.html);
				st.html = "";
			});
		},
		showModal: function showModal(html) {

			var opts = {

				html: html,
				locked: true,
				afterShow: fn.AfterModal,
				beforeShow: fn.before,
				afterClose: fn.cleanData

			};
			Sb.trigger('modal:open', opts);
		},
		AfterModal: function AfterModal() {

			asyncatchDom();
			var ajax = [{
				slc: dom.slcDpto,
				id: st.data.dpto.id,
				parent: false,
				url: st.urlDepart
			}];

			fn.ajax(ajax);
			asynSuscribeEvents();
		},
		ajax: function ajax(opts) {

			var dataSlc = opts[0];
			$.ajax({
				url: dataSlc.url,
				dataType: "json",
				success: function success(data) {

					opts.splice(0, 1);
					var valor = data;
					if (dataSlc.parent) {

						var option = dataSlc.parent.val();
						valor = valor[option];
					}

					fn.template($(st.tplListSlc).html(), { data: valor, id: dataSlc.id }, function (html) {

						$(dataSlc.slc).html(html);
						if (typeof dataSlc.callback === "function") {
							dataSlc.callback(opts);
						}
					});
				}
			});
		},
		template: function template(tpl, data, fn) {

			var html = _.template(tpl, data);
			if (fn != undefined) {
				fn(html);
			}
		},
		showList: function showList() {

			$(".content_list ").remove();
			fn.template($(st.tplShowList).html(), { data: st.arrayList }, function (html) {
				dom.parentModal.append(html);
				Sb.trigger('modal:onResize');
			});
		},
		captureData: function captureData() {

			var myObject = {};
			$("select option:selected").each(function (index) {
				myObject[$(this).parent().attr("name")] = {
					id: $(this).val(),
					name: $(this).text()
				};
			});
			return myObject;
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
			$(".btn_loading").hide();
			dom.btnUpdate.hide();
		},
		changeLoading: function changeLoading() {

			dom.btnAdd.hide();
			dom.btnUpdate.hide();
			$(".btn_loading").show();
		},
		editData: function editData() {

			fn.changeLoading();
			var data = [{
				slc: dom.slcDpto,
				id: st.data.dpto.id,
				parent: false,
				name: "depart",
				url: st.urlDepart,
				callback: fn.ajax

			}, {
				slc: dom.slcProv,
				id: st.data.prov.id,
				parent: dom.slcDpto,
				name: "prov",
				url: st.urlprov,
				callback: fn.ajax

			}, {
				slc: dom.slcDist,
				id: st.data.dist.id,
				parent: dom.slcProv,
				name: "dist",
				url: st.urlDist,
				callback: fn.changeUpdate
			}];

			fn.ajax(data);
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
});