//@ sourceURL=AIRexport.js
$(document).ready(function(){
	showButton();
	resizeL();
	$(".AIRexport .select2").select2();
});
var AIRexport = (function() {
    //判断是否显示数据同步按钮
   /* if(JSON.parse(($.cookie())['loginingEmployee'])['loginingCompanyCode']=='HH'){
        $('.AIRexport .HHShow').css('display','inline-block');
    }else{
        $('.AIRexport .HHShow').css('display','none');
    }*/
    var AIRexport_table;
	var ULname = '.AIRexport ul.Big';
	var keysOption = {};
	var countryArr = [];// 港口国家 =basedataPort_country',
	var basedataWharf = [];// 目的地
	var airLineArr = [];// 航线
	var orderArr = [];// 订舱方
	var airCom = [];// 航空公司
	var AIRexportClient_table;//委托人datatable
	var status = [];//修改状态
	var documentType=[{'id':'','text':''}];   //单证类型
	var saved=0;//是否保存完毕
	//费用变量
	var optionCurrency=[{'id':' ','text':''}];  //货物数据
    var FeiYongDaiMa=[{'id':' ','text':''}];   //费用代码
    var customerNameSel=[{'id':' ','text':''}];  //应付往来单位
    var CorrespondentUnit=[{'id':' ','text':''}];  //应收往来单位
    //费用 应付往来单位
    var AIRIntercourUnit_table;
    //费用 应收往来单位
    var AIRReceivableUnit_table;

    var numberUnit=[{'id':' ','text':''}];    //件数单位
	// 导航栏查询按钮
	function queryButton() {
		$('.AIRexport ul.Big li.SD').removeClass('active');
		$('.AIRexport ul.Big li.query').addClass('active');
		$('.AIRexport div.detailPage').removeClass('active');
		$('.AIRexport div.Big').find('>div.businessQuery').addClass('active');
		AIRexport.AIRexport_table.ajax.reload();
	}
	// 导航栏新增按钮
	function addNew() {
		$.ajax({
					type : "post",
					url : '/SeawinWebappBase/airBillExportController/insertRecord.do',
					data : {},
					success : function(data) {
						var res = JSON.parse(data);
						var billId = res.billExportId;
						var businessCode=res.businessCode;
						var procInstId=res.procInstId;
						$('.AIRexport ul.Big').find('li').removeClass('active');
						$('.AIRexport ul.Big').append('<li role="presentation" class="active AIR" billId='+ billId +' procInstId='+ procInstId +'> <a href="#detailPage" aria-controls="overview" role="tab" data-toggle="tab">出口-'+ businessCode +'<span class="glyphicon glyphicon-remove closeTab" style="borderr-radius:50%;background:#4122e5;color:white;margin-left:5px;"></span></a></li>');
						$('.AIRexport div.Big').find('>div.tab-pane').removeClass('active');
						$('.AIRexport div.detailPage').addClass('active');
						changeZLmain(1);
						//AIRinputorder.initBaseData();
						AIRexport.AIRexportDetail(billId,1);
					}
				});
		AIRexport.AIRexport_table.ajax.reload();
	}
	function changeZLmain(num) {
		$('.AIRexport div.detailPage div.ZLmain>ul>li').removeClass('active');
		$('.AIRexport div.detailPage div.ZLmain>div.tab-content>div').removeClass('active');
		$('.AIRexport div.detailPage div.ZLmain>ul>li:eq(' + num + ')').addClass('active');
		$('.AIRexport div.detailPage div.ZLmain>div.tab-content>div:eq('+ num + ')').addClass('active');
	}
	function changeTrack(num) {
		$('.AIRexport div.trace>ul.myTab>li').removeClass('active');
		$('.AIRexport div.trace>div.tab-content>div').removeClass('active');
		$('.AIRexport div.trace>ul.myTab>li:eq(' + num + ')').addClass('active');
		$('.AIRexport div.trace>div.tab-content>div:eq(' + num + ')').addClass('active');
	}
	// 导航栏批量删除按钮
	function deleteBusinessAll() {
		var info;
		var selectedRowData = AIRexport.AIRexport_table.rows('.selected').data();
		if (selectedRowData.length < 1) {
			info = "请选择需要删除的数据！";
			callAlert(info);
			return;
		}
		info = "确定要删除" + selectedRowData.length + "条数据吗?";
		callAlertModal(info, 'AIRexport_BusinessDelete');

		// 先解除click捆绑事件否则每次都会造成连续捆绑。
		$('.AIRexport_BusinessDelete')
				.unbind('click')
				.click(
						function() {
							var ids = [];
							var selectedRowData = AIRexport.AIRexport_table.rows(
									'.selected').data();
							for (var i = 0; i < selectedRowData.length; i++) {
								ids.push(selectedRowData[i].billExportId);
							}
							$.ajax({
										url : '/SeawinWebappBase/airBillExportController/deleteById.do',
										data : {
											"ids" : ids.join(",")
										},
										beforeSend : function() {
											showMask();// 显示遮罩层
										},
										success : function(rsp) {
											hideMask();
											rsp = JSON.parse(rsp);
											if (rsp.status == 1) {
												callSuccess("删除成功!");
												AIRexport.AIRexport_table.ajax.reload();
											} else
												callAlert("删除失败!");
										},
										error : function() {
											hideMask();
											alert(ids);
											callAlert("删除失败！")
										}
									});
						})

	}
	// 关闭DIV
	function closeDetail(id) {
		$('.AIRexport div' + id).css('display', 'none');
	}
	// 初始时间设置 选择日期 选择时间具体到分
	function setTimeInput() {
		var nS = new Date().valueOf();
		var endTime = new Date(parseInt(nS)).toLocaleString().replace(/\//g,
				"-").replace(/日/g, " ");
		var startTime = new Date(parseInt(nS - 30 * 24 * 60 * 60 * 1000))
				.toLocaleString().replace(/\//g, "-").replace(/日/g, " ");
		if (startTime.split('-')[1] > 9) {

		} else {
			var startArr = startTime.split('-');
			// console.log(startArr);
			startArr[1] = '0' + startArr[1];
			startTime = startArr.join("-");
		}
		if (endTime.split('-')[1] > 9) {

		} else {
			var endArr = endTime.split('-');
			// console.log(endArr);
			endArr[1] = '0' + endArr[1];
			endTime = endArr.join("-");
		}
		$('.AIRexport input.startTime').val(startTime.split(" ")[0]);
		$('.AIRexport input.endTime').val(endTime.split(" ")[0]);
	}
	// select2具体初始化
	function initSelect2_AIRexport() {
		var otherConditionsData = [ {
			id : 'clientLinkman',
			text : '委托方'
		}, {
			id : 'majorOperate',
			text : '操作员'
		}, {
			id : 'flightId',
			text : '航班号'
		}, {
			id : 'billLandingNo',
			text : '提单号'
		}, {
			id : 'orderInfo',
			text : '订舱方'
		}, {
			id : 'orderId',
			text : '订舱号'
		}, {
			id : 'caseNo',
			text : '进仓编号'
		}, {
			id : 'caseSealNo',
			text : '报关单号'
		}, {
			id : 'disEntryCode',
			text : '最新状态'
		} ];
		var otherTypeData = [ {
			id : 'LIKE',
			text : '包含'
		}, {
			id : 'EQUAL',
			text : '等于'
		}, {
			id : 'NOTEQUAL',
			text : '不等于'
		}, {
			id : 'NOTLIKE',
			text : '不包含'
		} ]

		$('.otherConditions').select2({
			data : otherConditionsData
		});
		$('.otherType').select2({
			data : otherTypeData
		})
	}
	// 条件查询按钮
	function doSearch() {
		AIRexport.AIRexport_table.ajax.reload();
	}
	// 显示查询结果的表格
	var paral = {
		"businessCode" : "业务编号",
		"billLadingNo" : "提单号",
		"airplaneInfo" : "航空公司",
		"flightId" : "航班号",
		"actualDate" : "实际离岗日期",
		"orderInfo" : "订舱方",
		"orderId" : "订舱号",
		"chineseCargo" : "品名",
		"" : "报关单号",
		"majorOperate" : "操作员",
		"createTime" : "录入时间",
		"" : "最新状态"
	};
	InitShippingSurcharge();
	function InitShippingSurcharge() {
		AIRexport_table = $("#AIRexportTable")
				.DataTable(
						{
							fnRowCallback : rightClick, // 利用行回调函数来实现右键事件
							fnDrawCallback : changePage, // 重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
							// 动态分页加载数据方式
							fnInitComplete: function(oSettings,json){
            	                //alert('加载下拉框');
            	                putOrderSelect();
            	                console.log(window.localStorage.jsonData_AIRexport);
                                //有缓存
                                if (window.localStorage.jsonData_AIRexport){
                                    var billId = parseInt(JSON.parse(window.localStorage.jsonData_AIRexport).billId);
                                    var businessCode = JSON.parse(window.localStorage.jsonData_AIRexport).bussinessCode;
                                    var presentNode = JSON.parse(window.localStorage.jsonData_AIRexport).presentNode;
                                    
                                    /*$('.AIRexport ul.Big').find('li').removeClass('active');
                                    $('.AIRexport ul.Big').append('<li role="presentation" class="active AIR" billId='+billId+' mblno='+businessCode+'> <a href="#detailPage" role="tab" data-toggle="tab">出口-'+businessCode+'<span closeTabid='+billId+' class="glyphicon glyphicon-remove closeTab" style="borderr-radius:50%;background:#4122e5;color:white;margin-left:5px;"></span></a></li>');
                                    $('.AIRexport div.Big').find('>div.tab-pane').removeClass('active');
                                    $('.AIRexport div.detailPage').addClass('active');*/
                                    
                                    $('.AIRexport ul.Big').find('li').removeClass('active');
								    $('.AIRexport ul.Big').append('<li role="presentation" class="active AIR" billId='+ billId+'><a href="#detailPage" role="tab" data-toggle="tab">出口-'+ businessCode+ '<span class="glyphicon glyphicon-remove closeTab" closeTabid='+ billId+ ' style="borderr-radius:50%;background:#4122e5;color:white;margin-left:5px;"></span></a></li>');
								    $('.AIRexport div.Big').find('>div.tab-pane').removeClass('active');
								    $('.AIRexport div.detailPage').addClass('active');
                                    var num;
                                    switch(presentNode) {
                                        case "商务审批":
                                            num = 1;
                                            break;
                                    }
                                    changeZLmain(num);
                                    //向后台请求数据
                                   	AIRexportDetail(billId,num);
                                    window.localStorage.removeItem("jsonData_AIRexport");
                                }
                            //无缓存
                                else{

                                }
                            },
							bProcessing : true,
							bServerSide : true,
							aLengthMenu : [ 10, 20, 40, 60 ], // 动态指定分页后每页显示的记录数。
							searching : false,// 禁用搜索
							lengthChange : true, // 是否启用改变每页显示多少条数据的控件
							/*
							 * sort : "position",
							 * //是否开启列排序，对单独列的设置在每一列的bSortable选项中指定
							 */
							deferRender : true,// 延迟渲染
							bStateSave : false, // 在第三页刷新页面，会自动到第一页
							iDisplayLength : 10, // 默认每页显示多少条记录
							iDisplayStart : 0,
							ordering : false,// 全局禁用排序
							serverSide : true,
							scrollX: true,
							autoWidth : true,//让表头跟着一起滑动
							scrollY : calcDataTableHeight(),
							colReorder : true,
							destroy : true,
							dom : '<"top">rt<"bottom"flip><"clear">',
							ajax : {
								type : "post",
								url : '/SeawinWebappBase/airBillExportController/selectAll.do',
								data : function(d) {
									search_data = $('#exportSearchForm')
											.serializeObject();
									var k = {};
									var i = 0;
									for ( var key in search_data) {
										if (i == 6) {
											if (search_data[key] == ""
													|| search_data[key] == null) {
											} else {
												k[key] = search_data[key];
											}
										} else {
											if (search_data[key] == ""
													|| search_data[key] == null) {
											} else {
												k[key] = search_data[key];
											}
										}
										i++;
									}
									k = JSON.stringify(k);
									d.keys = k;
								}
							},
							language : {
								"url" : "js/Chinese.json"
							},
							columns : [
									{
										"sClass" : "text-center",
										"data" : "airExportId",
										"title" : "<input type='checkbox' class='checkall' />",
										"render" : function(data, type, row,
												meta) {
											// console.log(row)
											return '<input type="checkbox"  class="checkchild" id="'
													+ row.billExportId
													+ '"  value="'
													+ row.billExportId + '" />';
										},
										"bSortable" : false

									},
									{
										"sClass" : "text-center",
										"data" : "number",
										"title" : "序号",
										"render" : function(data, type, full,
												meta) {
											return meta.row + 1;
										}
									}, {
										title : "业务编号",
										data : "businessCode"
									}, {
										title : "提单号",
										data : "billLadingNo"
									}, {
										title : "航空公司",
										data : "airplaneInfo"
									}, {
										title : "航班号",
										data : "flightId"
									}, {
										title : "实际离港日期",
										data : "actualDate"
									}, {
										title : "订舱方",
										data : "orderInfo"
									}, {
										title : '订舱号',
										data : "orderId"
									}, {
										title : '品名',
										data : "chineseCargo"
									},{
										title : '操作员',
										data : "majorOperate"
									}, {
										title : '录入时间',
										data : "createTime"
									}, {
										title : '最新状态',
										data : "businessStatus"
									} ],
							columnDefs : [
									{
										orderable : false,
										targets : 0
									},
									{
										"render" : function(data, type, full,
												meta) {

											if ($.string.isNullOrEmpty(data))
												return "";
											else
												return type === 'display'
														&& data.length > 30 ? '<span title="'
														+ data
														+ '">'
														+ data
														+ '</span>'
														: data;
										},
										targets : [ 1, 2, 3, 4, 5, 6, 7, 8, 9,
												10, 11, 12 ]
									} ],
									buttons: [
                                        {
                                            extend: 'excelHtml5',
                                            exportOptions: {
                                            columns: ':visible',
                                            modifier: {
                                            selected: true
                                                }
                                            },
                                            text:"选中行导出Excel",
                                            container: '#customer_export-excel-selected'
                                        },
                                        {
                                            extend: 'excelHtml5',
                                            text:"当前页导出Excel",
                                            exportOptions: {
                                                columns: ':visible'
                                            },
                                            container: '#customer_export-excel-current'
                                        }],
							select : {
								// blurable: true,
								style : 'multi',// 选中多行
								selector : 'td:first-child'// 选中效果仅对第一列有效
							// info: false
							}
						});
	}
    function askDataAndBind(url,idData,textData,selName) {
        $.ajax({
            url:getContextPath()+url,
            type:'POST',
            async:false,
            data:{},
            success:function (data) {
          //      console.log(data);
                data=JSON.parse(data);
                var arr=[{'id':' ','text':' '}];
                for(i=0;i<data.length;i++){
                    arr.push({'id':data[i][idData],'text':data[i][textData]});
                }
                console.log(arr);
                $('.AIRexport').find(selName).select2({
                    data:arr,
                    placeholder:''
                });
            }
        })
    }
    //加载输单下拉框
    function putOrderSelect(){
    	//输单 客服2 客服3  客服1
    	AIRexport.askDataAndBind('/airBillCommonController/getUserByDutiesCode.do?code=customerService&type=员工','userId','username','#inputORD select[name="majorPeopleOne"],#inputORD select[name="majorPeopleTwo"],#inputORD select[name="majorPeopleThree"]');
  //  	AIRexport.askDataAndBind('/airBillCommonController/getUserByDutiesCode.do?code=customerService&type=员工','userId','username','#inputORD select[name="majorPeopleThree"]');
        /*$.ajax({
            "type":"post",
            "url":getContextPath()+'airBillCommonController/getUserByDutiesCode.do', //?code=customerService&type=员工',
            "data":{'code':'customerService','type':'员工'},
            "success":function (data) {
                data=JSON.parse(data);
                console.log(data);
                var optArr=[];
                for(var i=0;i<data.length;i++){
                    optArr.push({'id':data[i]['username'],'text':data[i]['username']});
                }
                $('.AIRexport #busyCode select[name="majorPeopleTwo"],.AIRexport #busyCode select[name="majorPeopleThree"]').select2({
                    data:optArr,
                    placeholder:''
                })
            }
        })*/
    	//销售2
    //	initSelect2FromRedis("busyCode", "majorPeopleTwo", "redisController/listIdNameByName.do?name=employee", "{}", "servicePersonId", "servicePersonId");
        //销售3
    //    initSelect2FromRedis("busyCode", "majorPeopleThree", "redisController/listIdNameByName.do?name=employee", "{}", "servicePersonId", "servicePersonId");
    	//商务
    	 AIRexport.askDataAndBind('airBillCommonController/getUserByDutiesCode.do?code=business&type=员工','userId','username','#inputORD select[name="majorBusinessId"]');
        //操作
        AIRexport.askDataAndBind('airBillCommonController/getUserByDutiesCode.do?code=operator&type=员工','userId','username','#inputORD select[name="majorOperateId"]');
        //调度
        AIRexport.askDataAndBind('airBillCommonController/getUserByDutiesCode.do?code=dispatch&type=员工','userId','username','#inputORD select[name="majorDispatchId"]');
		//委托人
            /*$.ajax({
                type:'post',
                url: getContextPath() + 'saleCustomerEmployee/listByNewBusiness.do',
                data:function(){
	                 var data={"start":0,"length":1000};
	                 data["keys"]=JSON.stringify({"operatorLeader":""});
	                 return data;
                	}(),
                success:function(data){
                   data=JSON.parse(data);
                   data=data.aaData;
                    $('.AIRexport div.clientDetail').find('tr.newTRMT').remove();
                   for(var key=0;key<data.length;key++){
                	var $tr=$('<tr class="newTRMT" customerId='+data[key]['customerId']+' salesmanId='+data[key]['salesmanId']+'>'+
    						'<td name="customerCode">'+data[key]['saleCustomer']['customerCode']+'</td>'+
    						'<td name="abbrForShow">'+data[key]['abbrForShow']+'</td>'+
    						'<td name="customerNameCn">'+data[key]['saleCustomer']['customerNameCn']+'</td>'+
    						'<td name="manInCharge">'+data[key]['manInCharge']+'</td>'+
    						'<td name="mobile">'+data[key]['mobile']+'</td>'+
    						'<td  name="salesmanName">'+data[key]['salesmanName']+'</td>'+
    						'<td name="servicePersonName">'+data[key]['servicePersonName']+'</td>'+
    						'<td name="payTypeName">'+data[key]['payTypeName']+'</td>'+
    						'<td name="address">'+data[key]['saleCustomer']['address']+'</td>'+
    						'<td name="creditRateName">'+data[key]['creditRateName']+'</td>'+
    						'</tr>');
                		$tr.appendTo('.AIRexport div.clientDetail table>tbody');
                        } 
                 }
            }); */
		//装货港
		$.ajax({
        type:'post',
        url: getContextPath() +'redisController/listIdObjectByname.do?name=basedataPort_country_ap',
        data:{},
        success:function(data){
            data=JSON.parse(data);
            var data=data.sort(AIRexport.compare("port_code"));
            $('.AIRexport div.ZHG').find('tr.newTR').remove();
            var trArr='';
            AIRexport.countryArr=[];
            for(var key=0;key<data.length;key++){
                trArr=trArr+'<tr class="newTR">' +
                    '<td  name="port_code">'+data[key]['port_code']+'</td>' +
                    '<td name="port_name">'+data[key]['port_name']+'</td>' +
                    '<td name="port_name_cn">'+data[key]['port_name_cn']+'</td>' +
                    '<td name="en_name">'+data[key]['en_name']+'</td>' +
                    '<td name="cn_name">'+data[key]['cn_name']+'</td>' +
                    '<td name="port_id">'+data[key]['port_id']+'</td>' +
                    '</tr>';
                AIRexport.countryArr.push({'id':key,'text':data[key]['port_code']+' | '+data[key]['port_name']+'('+data[key]['port_name_cn']+')'});
            }
            $('.countryArr').select2({
                data:AIRexport.countryArr,
                placeholder:''
            })
            $(trArr).appendTo($('.AIRexport div.ZHG table>tbody'));
        }
    });
    //目的地
	    $.ajax({
	        type:'post',
	        url: getContextPath() + 'redisController/listIdObjectByname.do?name=basedataPort_country_ap',
	        data:{},
	        success:function(data){
	            data=JSON.parse(data);
	            $('.AIRexport div.MDD').find('tr.newTRMT').remove();
	            var trArr='';
	            AIRexport.basedataWharf=[];
	            for(var key=0;key<data.length;key++){
                trArr=trArr+'<tr class="newTRMT">' +
                    '<td  name="port_code">'+data[key]['port_code']+'</td>' +
                    '<td name="port_name">'+data[key]['port_name']+'</td>' +
                    '<td name="port_name_cn">'+data[key]['port_name_cn']+'</td>' +
                    '<td name="en_name">'+data[key]['en_name']+'</td>' +
                    '<td name="cn_name">'+data[key]['cn_name']+'</td>' +
                    '<td name="port_id">'+data[key]['port_id']+'</td>' +
                    '</tr>';
                AIRexport.basedataWharf.push({'id':key,'text':data[key]['port_code']+' | '+data[key]['port_name']+'('+data[key]['port_name_cn']+')'});
                }
	            $('.basedataWharf').select2({
                data:AIRexport.basedataWharf,
                placeholder:''
                })
	            $(trArr).appendTo($('.AIRexport div.MDD table>tbody'));
	         }
	    });
	//航线
	    $.ajax({
	        type:'post',
	        url: getContextPath() + 'redisController/listIdObjectByname.do?name=basedataServiceLine_detail',
	        data:{},
	        success:function(data){
	            data=JSON.parse(data);
	            $('.AIRexport div.HX').find('tr.newTRMT').remove();
	            var trArr='';
	            AIRexport.airLineArr=[];
	            for(var key in data){
	            	trArr=trArr+'<tr class="newTRMT">' +
                    '<td  name="service_line_name_cn">'+data[key]['service_line_name_cn']+'</td>' +
                    '<td name="service_line_id">'+data[key]['service_line_id']+'</td>' +
                    '<td name="service_line_name">'+data[key]['service_line_name']+'</td>' +
                    '<td name="service_line_code">'+data[key]['service_line_code']+'</td>' +
                    '</tr>';
                    AIRexport.airLineArr.push({'id':key,'text':data[key]['service_line_name_cn']+' | '+data[key]['service_line_id']+' | '+data[key]['service_line_name']+' | '+data[key]['service_line_code']});
	                }
	            $('.airLineSelect').select2({
                data:AIRexport.airLineArr,
                placeholder:''
                })
	            $(trArr).appendTo($('.AIRexport div.HX table>tbody'));
	         }
	    });
	//订舱方(先用装货港的接口代替)
	// $.ajax({
     //    type:'post',
     //    url: getContextPath() +'redisController/listIdObjectByname.do?name=basedataPort_country',
     //    data:{},
     //    success:function(data){
     //        data=JSON.parse(data);
     //        var data=data.sort(AIRexport.compare("port_code"));
     //        $('.AIRexport div.DCF').find('tr.newTR').remove();
     //        var trArr='';
     //        AIRexport.orderArr=[];
     //        for(var key=0;key<data.length;key++){
     //            trArr=trArr+'<tr class="newTR">' +
     //                '<td name="port_code">'+data[key]['port_code']+'</td>' +
     //                '<td name="port_name">'+data[key]['port_name']+'</td>' +
     //                '<td name="port_name_cn">'+data[key]['port_name_cn']+'</td>' +
     //                '<td name="en_name">'+data[key]['en_name']+'</td>' +
     //                '<td name="cn_name">'+data[key]['cn_name']+'</td>' +
     //                '</tr>';
     //            AIRexport.orderArr.push({'id':key,'text':data[key]['port_code']+' | '+data[key]['port_name']+'('+data[key]['port_name_cn']+')'});
     //        }
     //        $('.orderPER').select2({
     //            data:AIRexport.orderArr,
     //            placeholder:''
     //        })
     //        $(trArr).appendTo($('.AIRexport div.DCF table>tbody'));
     //    }
    // });
	//航空公司
	$.ajax({
	        type:'post',
	        url: getContextPath() + '/redisController/listIdObjectByname.do?name=basedataAirline_detail',
	        data:{},
	        success:function(data){
	            data=JSON.parse(data);
	            $('.AIRexport div.HKGS').find('tr.newTRMT').remove();
	            var trArr='';
	            AIRexport.airCom=[];
	            for(var key in data){
	            	trArr=trArr+'<tr class="newTRMT">' +
                    '<td  name="iata_designator">'+data[key]['iata_designator']+'</td>' +
                    '<td name="icao_designator">'+data[key]['icao_designator']+'</td>' +
                    '<td name="airline_id">'+data[key]['airline_id']+'</td>' +
                    '<td name="airline_name">'+data[key]['airline_name']+'</td>' +
                    '</tr>';
                    AIRexport.airCom.push({'id':key,'text':data[key]['iata_designator']+' | '+data[key]['icao_designator']+' | '+data[key]['airline_id']+' | '+data[key]['airline_name']});
	                }
	            $('.airCom').select2({
                data:AIRexport.airCom,
                placeholder:''
                })
	            $(trArr).appendTo($('.AIRexport div.HKGS table>tbody'));
	         }
	  });
	   
	//费用基础数据加载
	// 往来单位  应付
       /* $.ajax({
            url:getContextPath()+'/saleSupplier/listByPageSelect.do?',
            type:'POST',
            data:{'keys':{},'start':0,'length':10000},
            success:function (data) {
                data=JSON.parse(data);
                console.log(data['aaData']);
                data=data['aaData'];
                AIRexport.customerNameSel=[{'id':' ','text':''}];
                for(var i=0;i<data.length;i++){
                    AIRexport.customerNameSel.push({'id':data[i]['customerCode'],'text':data[i]['customerNameCn']});
                    //  FCLpayExpense.customerNameSel.push({'id':data[i]['customerCode']+'|'+ data[i]['customerNameCn'],'text':data[i]['customerNameCn']})
                }
                console.log(AIRexport.customerNameSel);
            }
        });*/
        //请求供应商 应收 往来单位
        /*$.ajax({
            url:getContextPath()+'saleCustomer/listByKeys.do?',
            type:'POST',
            data:JSON.stringify({"keys":{}}),
            success:function (data) {
                console.log(data);
                data=JSON.parse(data);
                AIRexport.CorrespondentUnit=[{'id':' ','text':''}];
                for(var i=0;i<data.length;i++){
                    AIRexport.CorrespondentUnit.push({'id':data[i]['customerCode'],'text':data[i]['customerNameCn']})
                }
                console.log(AIRexport.CorrespondentUnit);
            }
        })*/
        //redis货币数据
        $.ajax({
            type: 'post',
            url: getContextPath() + '/redisController/listIdNameByName.do?name=basedataCommonSet_3',
            data: {},
            success: function (data) {
                data = JSON.parse(data);
                //console.log(data);
                AIRexport.optionCurrency=[{'id':' ','text':''}];
                for(var i=0;i<data.length;i++){
                    var d=data[i];
                    for(var key in d){
                        var  currency=d[key];
                        AIRexport.optionCurrency.push({"id":d[key],"text":d[key]});
                    }
                }
            }
        });
        //请求费用代码和科目
        $.ajax({
            type: 'post',
            url: getContextPath() + 'redisController/listIdObjectByname.do?name=BasedataCharge', //http://localhost:8080/SeawinWebappBase/redisController/listIdObjectByname.do?name=BasedataCharge http://localhost:8080/SeawinWebappBase/redisController/listIdNameByName?name=BasedataCharge
            success: function (data) {
                console.log(data);
                data = JSON.parse(data);
                AIRexport.FeiYongDaiMa=[{'id':' ','text':''}];
                $.each(data, function (i, a) {
                    //     console.log(i + '**' + a);
                    AIRexport.FeiYongDaiMa.push({'id': a, 'text': a});
                })
                console.log(AIRexport.FeiYongDaiMa);
            }
        });
        //获取报关行数据
        $.ajax({
            type:'post',
            url:getShipContextPath()+'saleSupplier/listByKeys.do',
       //     contentType: "application/json;charset=UTF-8",
            data:{"keys":JSON.stringify({"customerTypeId":"报关行"})},//JSON.stringify({"keys":{"customerTypeId":"报关行"}}),
            success:function (data) {
                data=JSON.parse(data);
                console.log(data);
                var customsBroker=[{'id':' ','text':''}];
                $.each(data,function (i,a) {
      //              console.log(a);
                    customsBroker.push({'id':a['supplierId'],'text':a['customerCode']+' | '+a['customerNameCn']})
                })
                $('.AIRexport #declare select.customsBrokerSel').select2({
                    data:customsBroker,
                    placeholder:''
                })
            }
        })
        //获取海关数据
        $.ajax({
            type:'post',
   /*         async:false,*/
            url:getShipContextPath()+'redisController/listIdObjectByname.do?name=basedataCommonSet_59_detail',//海关
            data:{},
            success:function (data) {
                //	console.log(data);
                var selData=[{'id':' ','text':''}];
                data=JSON.parse(data);
                for(var i=0;i<data.length;i++){
                    selData.push({'id':data[i]['code']+' | '+data[i]['cn_name'],'text':data[i]['code']+' | '+data[i]['cn_name']});
                }
                $('.AIRexport #declare select.exportPortSel').select2({
                    data:selData
                })
            }
        });
        //件数单位
        $.ajax({
            type: 'post',
            url: getContextPath() + '/redisController/listIdObjectByname.do?name=basedataCommonSet_55',
            data: {},
            success: function (data) {
                data = JSON.parse(data);
                /*for(var key = 0; key < data.length; key++) {
                    AIRimport.caseType.push({
                        'id': data[key],
                        'text': data[key].split('|')[1]
                    })
                }*/
                $(".AIRexport #select_4").empty();
                $(".AIRexport #select_4").append("<option value=''></option>");
                $(".AIRexport #select_5").empty();
                $(".AIRexport #select_5").append("<option value=''></option>");
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        var arr = data[key].split('|');
                        var name = arr[1];
                        $(".AIRexport #select_4").append("<option>" + name + "</option>");
                        $(".AIRexport #select_5").append("<option>" + name + "</option>");
                    }
                }
            }
        });
        //应付费用 往来单位
            AIRexport.AIRIntercourUnit_table=$('.AIRexport div#AIRIntercourseUnit table#IntercourseUnitTable').DataTable({
                fnDrawCallback:function () {
                    console.log('数据加载完成，表格显示');
                },
                bProcessing:true,
                bServerSide:true,
                aLengthMenu:[10,20,40,60],
                searching:false,
                lengthChange:true,
                bSort:false,
                sort:'position',
                deferRender:true,
                bStrateSave:false,
                iDisplayStart:0,
                serverSide:true,
                auroWidth:true,
                scrollX:true,
                scrollY:calcDataTableHeight(),
                colReorder:true,
                destroy:true,
                dom:'<"top">rt<"bottom"flip><"clear">',
                ajax:{
                    "type":"POST",
                    "url":getContextPath()+'/saleSupplier/listByPageSelect.do?',
                    "data":function(d){
                        search_data=$('.AIRexport div#AIRIntercourseUnit form#IntercourseUnitForm').serializeObject();
                        var k={"operatorLeader":""};
                        for(var key in search_data){
                            k[key]=search_data[key];
                        }
                        d.keys=JSON.stringify(k);
                    },
                    "dataSrc":function (data) {
                        console.log(data);
                        console.log('已获取到数据，但还未进行表格渲染，可将数据进行处理');
                        for(var i=0;i<data['aaData'].length;i++){
                            data['aaData'][i]['amenderName']=data['aaData'][i]['baseModel']['amenderName'];
                            data['aaData'][i]['creatorName']=data['aaData'][i]['baseModel']['creatorName'];
                            data['aaData'][i]['organiztionName']=data['aaData'][i]['baseModel']['organiztionName'];
                        }
                        console.log(data.aaData);
                        return data.aaData;
                    }
                },
                language:{
                    "url":"js/Chinese.json"
                },
                columns:[
                    {"sClass":"text-center",
                     "data":"number",
                     "title":"序号",
                     "render":function (data,type,full,meta) {
                            return meta.row+1;
                        }
                    },{
                        title:'单位代码',data:'customerCode'
                    },{
                        title:'单位简称',data:'abbrCn'
                    },{
                        title:'单位全称',data:'customerNameCn'
                    }
                ],
                columnDefs:[
                    {
                        orderable:false,
                        targets:0
                    },{
                        "render":function (data,type,full,meta) {
                            if($.string.isNullOrEmpty(data)){
                                return "";
                            }else{
                                return type==='display'&&data.length>10?
                                    '<span title="'+data+'">'+data+'</span>':data;
                            }
                        },
                        "targets":[1,2,3]
                    }
                ],
                buttons:[{

                }],
                select:{
                    style:'multi',          //选中多行
                    selector:'td:first-child',  //选中效果仅对第一列有效
                },
                initCompltet:function () {

                }
            });
            //应收费用 往来单位
            AIRexport.AIRReceivableUnit_table=$('.AIRexport div#AIRReceivableUnit table#ReceivableUnitTable').DataTable({
                fnDrawCallback:function () {
                    console.log('数据加载完成，表格显示');
                },
                bProcessing:true,
                bServerSide:true,
                aLengthMenu:[10,20,40,60],
                searching:false,
                lengthChange:true,
                bSort:false,
                sort:'position',
                deferRender:true,
                bStrateSave:false,
                iDisplayStart:0,
                serverSide:true,
                autoWidth:true,
                scrollX:true,
                scrollY:calcDataTableHeight(),
                colReorder:true,
                destroy:true,
                dom:'<"top">rt<"bottom"flip><"clear">',
                ajax:{
                    "type":"POST",
                    "url":getContextPath()+'saleCustomer/listByKeys.do?',
                    "data":function(d){
                        search_data=$('.AIRexport div#AIRReceivableUnit form#ReceivableUnitForm').serializeObject();
                        var k={};
                        for(var key in search_data){
                            k[key]=search_data[key];
                        }
                        d.keys=JSON.stringify(k);
                    },
                    "dataSrc":function (data) {
                        console.log(data);
                        console.log('已获取到数据，但还未进行表格渲染，可将数据进行处理');
                        console.log(data.aaData);
                        return data.aaData;
                    }
                },
                language:{
                    "url":"js/Chinese.json"
                },
                columns:[
                    {"sClass":"text-center",
                        "data":"number",
                        "title":"序号",
                        "render":function (data,type,full,meta) {
                            return meta.row+1;
                        }
                    },{
                        title:'单位代码',data:'customerCode'
                    },{
                        title:'单位简称',data:'abbrCn'
                    },{
                        title:'单位全称',data:'customerNameCn'
                    }
                ],
                columnDefs:[
                    {
                        orderable:false,
                        targets:0
                    },{
                        "render":function (data,type,full,meta) {
                            if($.string.isNullOrEmpty(data)){
                                return "";
                            }else{
                                return type==='display'&&data.length>10?
                                    '<span title="'+data+'">'+data+'</span>':data;
                            }
                        },
                        "targets":[1,2,3]
                    }
                ],
                buttons:[{

                }],
                select:{
                    style:'multi',          //选中多行
                    selector:'td:first-child',  //选中效果仅对第一列有效
                },
                initCompltet:function () {

                }
            });
        InitEntrClientDetail();
    }
    //订舱方弹出框
    airBooking_table=$('.AIRexport #airBookingTable').DataTable({
        fnDrawCallback:function () {
            console.log('数据加载完成，表格显示');
        },
        bProcessing:true,
        bServerSide:true,
        aLengthMenu:[10,20,40,60],
        searching:false,
        lengthChange:true,
        bSort:false,
        sort:'position',
        deferRender:true,
        bStrateSave:false,
        iDisplayStart:0,
        serverSide:true,
        auroWidth:true,
        scrollX:true,
        scrollY:calcDataTableHeight(),
        colReorder:true,
        destroy:true,
        dom:'<"top">rt<"bottom"flip><"clear">',
        ajax:{
            "type":"POST",
            "url":getShipContextPath()+'saleSupplier/listByPageSelect.do',
            "data":function(d){
                search_data=$('.AIRexport #airBookingForm').serializeObject();
                var k={"customerTypeId":"订舱单位"};
                for(var key in search_data){
                    k[key]=search_data[key];
                }
                d.keys=JSON.stringify(k);
            },
            "dataSrc":function (data) {
                console.log(data);
                console.log('已获取到数据，但还未进行表格渲染，可将数据进行处理');
                for(var i=0;i<data['aaData'].length;i++){
                    data['aaData'][i]['amenderName']=data['aaData'][i]['baseModel']['amenderName'];
                    data['aaData'][i]['creatorName']=data['aaData'][i]['baseModel']['creatorName'];
                    data['aaData'][i]['organiztionName']=data['aaData'][i]['baseModel']['organiztionName'];
                }
                console.log(data.aaData);
                return data.aaData;
            }
        },
        language:{
            "url":"js/Chinese.json"
        },
        columns:[
            {"sClass":"text-center",
                "data":"number",
                "title":"序号",
                "render":function (data,type,full,meta) {
                    return meta.row+1;
                }
            },{
                title:'单位代码',data:'customerCode'
            },{
                title:'单位简称',data:'abbrCn'
            },{
                title:'单位全称',data:'customerNameCn'
            }/*,{
			 title:'地址',data:'abbrCn'
			 },{
			 title:'详细地址',data:'addressDetail'
			 },{
			 title:'修改时间',data:'amendTime'
			 },{
			 title:'企业名',data:'organiztionName'
			 },{
			 title:'创建者',data:'creatorName'
			 },{
			 title:'修改者',data:'amenderName'
			 }*/
        ],
        columnDefs:[
            {
                orderable:false,
                targets:0
            },{
                "render":function (data,type,full,meta) {
                    if($.string.isNullOrEmpty(data)){
                        return "";
                    }else{
                        return type==='display'&&data.length>10?
                            '<span title="'+data+'">'+data+'</span>':data;
                    }
                },
                "targets":[1,2]
            }
        ],
        buttons:[{

        }],
        select:{
            style:'multi',          //选中多行
            selector:'td:first-child' //选中效果仅对第一列有效
        },
        initCompltet:function () {

        }
    });
	function airBooking(){
        $("#airBookingForm")[0].reset();
        //获取订舱页面订舱方数据   bookingParty
        airBooking_table.ajax.reload();
        $('#airBooking').modal('show');//现实模态框
	}
    function InitEntrClientDetail() {
       //     alert('委托人datatable初始化');
           AIRexport.AIRexportClient_table=$('.AIRexport div#exportEntrustModal table#clientTable').DataTable({
              //  fnRowCallback:rightClick,       //利用回调函数来实现右键事件
                fnDrawCallback:function () {
             //       console.log('数据加载完成，表格显示');
                },
                bProcessing:true,
                bServerSide:true,
                aLengthMenu:[10,20,40,60],          //动态制定分页后每页显示的记录数
                searching:false,  //禁用搜索
                lengthChange:true,  //是否启用改变每页显示多少条数据的控件
                bSort:false,
                sort:'position',   //是否开启列排序，对单独列的设置在每一列的bSortable选项中指定
                deferRender:true,//延迟渲染
                bStrateSave:false,  //……
                iDisplayLength:10,
                iDisplayStart:0,
                serverSide:true,
                autoWidth:true,
                scrollX:true,
               scrollY:calcDataTableHeight(),
                colReorder:true,
                destroy:true,
                dom:'<"top">rt<"bottom"flip><"clear">',
                ajax:{
                    "type":"POST",
                    "url":getContextPath() + 'saleCustomerEmployee/listByNewBusiness.do',
                    "data":function (d) {
                        search_data=$('.AIRexport div#exportEntrustModal form#exportEntrustForm').serializeObject();
                        var k={"operatorLeader":""};
                        for(var key in search_data){
                            k[key]=search_data[key];
                        }
                        d.keys=JSON.stringify(k);
                    },
                    "dataSrc":function (data) {
                        console.log(data);
                       for(var i=0;i<data['aaData'].length;i++){
                           data['aaData'][i]['customerCode']=data['aaData'][i]['saleCustomer']['customerCode'];
                           data['aaData'][i]['customerNameCn']=data['aaData'][i]['saleCustomer']['customerNameCn'];
                           data['aaData'][i]['address']=data['aaData'][i]['saleCustomer']['address'];
                       }
                       return data.aaData;
                    }
                    
                },
                language:{
                     "url":"js/Chinese.json"
                },
                columns:[
                 /*   {"sClass":"text-center",
                    "data":"WorkId",
                    "title":"<input type='checkbox' class='checkall' style='vertical-align:middle;'/>",
                    "render":function (data,type,row,meta) {
                            return '<input type="checkbox" entrMiddleOperationId='+row.Id+' class="checkchild" />';
                        },
                    "bSortable":false
                    },*/
                    /*{
						"sClass" : "text-center",
						"data" : "airExportId",
						//"title" : "<input type='checkbox' class='checkall' />",
						"render" : function(data, type, row,meta) {
											// console.log(row)
							return '<input type="checkbox"  class="checkchild" id="">';
								},
							"bSortable" : false

					},*/
					{
						"sClass" : "text-center",
					    "data" : "number",
					    "title" : "序号",
					    "render" : function(data, type, full,meta) {
						    return meta.row + 1;
						}
					},
                    {title:'单位代码',data:'customerCode'},
                    {title:'简称',data:'abbrForShow'},
                    {title:'全部',data:'customerNameCn'},
                    {title:'负责人',data:'manInCharge'},
                    {title:'电话',data:'mobile'},
                    {title:'销售',data:'salesmanName'},
                    {title:'客服',data:'servicePersonName'},
                    {title:'付款方式',data:'payTypeName'},
                    {title:'地址',data:'address'},
                    {title:'属性',data:'creditRateName'}
                ],
                columnDefs:[
                    {
                        orderable:false,
                        targets:0
                    },{
                    "render":function (data,type,full,meta) {
                        if($.string.isNullOrEmpty(data)){
                            return "";
                        }else{
                            return type==='display'&&data.length>10?
                                '<span title="'+data+'">'+data+'</span>':
                                data;
                        }
                    },
                    "targets":[1,2,3,4,5,6,7,8,9,10]
                    }
                ],
                buttons:[{

                }],
                /*select:{
                    style:'multi',                 //选中多行
                    selector:'td'   //选中效果仅对第一列有效
                },*/
                initCompltet:function () {
                    
                }
            });
        }
	//委托人赋值
	/*function getEntrustButton(){
		var selRow=AIRexportClient_table.rows('.selected').data();
		console.log(selRow.length);
		if(selRow.length<1){
			$('.AIRexport div#exportEntrustModal').modal('hide');
		}else if(selRow.length>1){
			alert('仅能选择一条记录');
		}else{
			console.log(selRow);
			var customerCode=selRow[0]["customerCode"];
			var customerId=selRow[0]["customerId"];
			var customerNameCn=selRow[0]["customerNameCn"];
			var salesmanName=selRow[0]["salesmanName"];
			var servicePersonName=selRow[0]["servicePersonName"];
			$('.AIRexport div#inputORD input[name="customerCode"]').val(customerCode);
			$('.AIRexport div#inputORD input[name="customerId"]').val(customerId);
			$('.AIRexport div#inputORD input[name="clientInfo"]').val(customerNameCn);
			$('.AIRexport div#inputORD input[name="salesmanName"]').val(salesmanName);
			$('.AIRexport div#inputORD input[name="majorPeopleOne"]').val(servicePersonName);
			$('.AIRexport div#exportEntrustModal').modal('hide');
		}
	}*/
	//委托人模态框查询
	function entrustSearch(){
        AIRexport.AIRexportClient_table.ajax.reload();
	}
	//委托人模态框重置
	function entrustReset(){
		$('#exportEntrustForm')[0].reset();
		AIRexport.AIRexportClient_table.ajax.reload();
	}
	//打印show模态框
    function showPrint(a) {
        if(a==1){
            var selRow=AIRexport.AIRexport_table.rows('.selected').data();
            //alert(selRow.length);
            if(selRow.length<1){
                callAlert('请选择一条记录!');
            }else if(selRow.length>1){
                callAlert('仅能操作一条记录!');
            }else{
                //console.log(selRow[0].billId);
                $('.AIRexport div#print').find('div.modal-body button.ajaxAsk[name="print"]').attr('billExportId',selRow[0].billExportId);
                $('.AIRexport div#print').find('div.modal-body button[name="showPrint"]').attr('billExportId',selRow[0].billExportId);
                $('.AIRexport div#print').find('div.modal-body button.ajaxAsk[name="previewButton"]').attr('billExportId',selRow[0].billExportId);
                $('.AIRexport #print').modal('show');//现实模态框
            }
        }else{
            //console.log($('.FCLexport ul.Big>li.FCL.active').attr('billId'));
            $('.AIRexport div#print').find('div.modal-body button.ajaxAsk[name="print"]').attr('billExportId',$('.AIRexport ul.Big>li.active').attr('billId'));
            $('.AIRexport div#print').find('div.modal-body button[name="showPrint"]').attr('billExportId',$('.AIRexport ul.Big>li.active').attr('billId'));
            $('.AIRexport div#print').find('div.modal-body button.ajaxAsk[name="previewButton"]').attr('billExportId',$('.AIRexport ul.Big>li.active').attr('billId'));           // $('.FCLexport div#importResultsFCLexportModal').find('div.modal-footer input.ajaxAsk').attr('billId',$('.FCLexport ul.Big>li.FCL.active').attr('billid'));
            $('.AIRexport #print').modal('show');//现实模态框
        }
    }
    //打印
    function print(d){
        var airExportId=$(d).attr('billExportId');
        var saveName=$(d).attr('saveName');
        window.open(getPrintContextPath()+"/stimulsoft_viewerfx?stimulsoft_report_key=seawin/"+saveName+"&airExportId="+airExportId);
    }
	//跟踪页面切换请求数据
	function AIRTrackingDetail(id,num){
		changeTrack(num);
		switch(Number(num)){
			//流程跟踪
			case 0:
			    //alert('流程跟踪');
				AirBusinessTrack.showBusinessTrack("AIRexport", id, "空运出口");
			    break;
			    
			//状态跟踪
			case 1:
			   // alert('状态跟踪');
			    break;
			    
			//二程跟踪
			case 2:
			   // alert('二程跟踪');
				AirSecondTrack.askData(id,"空运出口","AIRexport");
			    break;
		}
	}
	// 页面切换请求数据
	function AIRexportDetail(id, num) {
		// 判断是 总览home 输单entrust 订舱bookingSpace 做箱packings 提单billLading 报关declare
		// 费用cost 跟踪tracing
		changeZLmain(num);
		//var exportid = [];
		//var selectedRow = AIRexport_table.rows('.selected').data();
		/*for (var i = 0; i < selectedRow.length; i++) {
			exportid.push(selectedRow[i].billExportId);
		}*/
		// alert(id+'*****'+num);
		switch (Number(num)) {
		case 0:
			// alert('总览')
			// 总览
			$.ajax({
						type : 'POST',
						url : '/SeawinWebappBase/airBillExportController/searchTotalInfoById.do',
						data : {"id" : id},
						success : function(data) {
							var data = JSON.parse(data);
							// 循环给表单赋值
							$.each($('.AIRexport div.detailPage').find('form#overviewForm input'),function(i, input) {
								if (typeof (data[$(this).attr("name")]) == 'undefined'|| data[$(this).attr("name")] == '') {
									$(this).val('');
								}else{
									$(this).val(data[$(this).attr("name")]);
								}
							});
						}
					})
			break;
		case 1:
			// 输单
			AIRinputorder.askData(id);// 根据id向后台请求输单数据r
			$(".AIRexport #detailPage .ZLmain>ul>li.active").attr('changed',false);
			//AIRinputorder.initBaseData();// 请求基础数据（包括下拉框里的内容）
			break;
		case 2:
			// 货物数据
			AIRCargoData.askData(id);// 根据id向后台请求货物数据
			break;
	    case 3://取货计划
	        exportGoodsPlan.askData(id);
	        break;
		case 4:
			// 报关
			Airdeclare.askData(id);
			break;
		case 5:
			// 费用
			/*logisticsFee.initPayFee(id, 'AIRexport','air_bill_export');*/
			// logisticsFee.initReceiFee(
			// exportid.join(','),'AIRexport','air_bill_import');
			AIRexportPayExpense.initPayFee(id,'AIRexport','air_bill_export');
			break;
		case 6:
			// 跟踪
			AirBusinessTrack.showBusinessTrack("AIRexport", id, "空运出口");
			break;
		}
	}
	//刷新编辑页面
	function refresh(){
		AIRexport.isChange();
		var id=$('.AIRexport ul.Big li.active').attr('billId');
		var num=$('.AIRexport div.ZLmain ul.editList li.active').index();
	    switch (Number(num)) {
		case 0:
			// alert('总览')
			// 总览
			$.ajax({
						type : 'POST',
						url : '/SeawinWebappBase/airBillExportController/searchTotalInfoById.do',
						data : {"id" : id},
						success : function(data) {
							var data = JSON.parse(data);
							// 循环给表单赋值
							$.each($('.AIRexport div.detailPage').find('form#overviewForm input'),function(i, input) {
								if (typeof (data[$(this).attr("name")]) == 'undefined'|| data[$(this).attr("name")] == '') {
									
								}else{
									$(this).val(data[$(this).attr("name")]);
								}
							});
						}
					})
			break;
		case 1:
			// 输单
			AIRinputorder.askData(id);// 根据id向后台请求输单数据r
			//AIRinputorder.initBaseData();// 请求基础数据（包括下拉框里的内容）
			break;
		case 2:
			// 货物数据
			AIRCargoData.askData(id);// 根据id向后台请求货物数据
			break;
		case 3:
			// 报关
			Airdeclare.askData(id);
			break;
		case 4:
			// 费用
			logisticsFee.initPayFee(id, 'AIRexport','air_bill_export');
			// logisticsFee.initReceiFee(
			// exportid.join(','),'AIRexport','air_bill_import');
			break;
		case 5:
			// 跟踪
			AirBusinessTrack.showBusinessTrack("AIRexport", id, "空运出口");
			break;
		}
	}
	//业务查询刷新按钮
	function datatableRefresh(){
		AIRexport.AIRexport_table.ajax.reload();
	}
	// 作为fnRowCallback的回调函数增加右键菜单功能
	// 作为checkbox值初始化
	function rightClick() {

		$.contextMenu({
			selector : '#customsBillTable tbody tr',
			callback : function(key, options) {
				// var row_data =
				// customsBill_table.rows(options.$trigger[0]).data()[0];
				switch (key) {
				case "Add":// 增加一条数据
					addcustomsBill();
					break;
				case "Delete":// 删除该节点
					$("#customsBillTable tr.selected").removeClass("selected")
							.find("input[class=checkchild]").prop("checked",
									false);// 把其他行取消选中；
					customsBill_table.row(this).select();// 选中该行selected
					$(this).find("input[class=checkchild]").prop("checked",
							true);// checkbox选中
					deletecustomsBill();
					break;
				case "Edit":// 编辑该节点
					$("#customsBillTable tr.selected").removeClass("selected")
							.find("input[class=checkchild]").prop("checked",
									false);// 把其他行取消选中；
					customsBill_table.row(this).select();// 选中该行selected
					$(this).find("input[class=checkchild]").prop("checked",
							true);// checkbox选中
					editcustomsBill();
					break;
				default:
					options.$trigger.removeClass("selected").find(
							"input[class=checkchild]").prop("checked", false);
					;// 取消选择selected
				}
			},
			items : {
				"Edit" : {
					name : "修改",
					icon : "edit"
				},
				// "cut": {name: "Cut", icon: "cut"},
				// copy: {name: "Copy", icon: "copy"},
				// "paste": {name: "Paste", icon: "paste"},
				"Delete" : {
					name : "删除",
					icon : "delete"
				},
				"Add" : {
					name : "新增",
					icon : "add"
				},
				"sep1" : "---------",
				"quit" : {
					name : "取消操作",
					icon : function() {
						return 'context-menu-icon context-menu-icon-quit';
					}
				}
			}
		});
	};
	//切换页面时保存修改
	function isChange() {
   //     alert('*******');
        if($('.AIRexport ul.Big').find('li.active').index()==0){
        	
        }else if($('.AIRexport div.ZLmain>ul.nav-tabs>li.active').index()==0){
        	
        }else if($('.AIRexport div.ZLmain>ul.nav-tabs').find('li.active').attr('changed')=='false'){
        	
         }else if($('.AIRexport div.ZLmain>ul.nav-tabs').find('li.active').attr('changed')=='true'){
            if(confirm("是否要保存您的修改?")){
                //保存数据
                AIRexport.airExportSave();
            }else{
                $('.AIRexport div.ZLmain>ul.nav-tabs').find('li.active').attr('changed',false);
            }
        }
    }
	// 将当前时间转换成yyyymmdd格式
	function nowtime() {
		var mydate = new Date();
		var str = "" + mydate.getFullYear();
		var mm = mydate.getMonth() + 1
		if (mydate.getMonth() > 9) {
			str += '-' + mm;
		} else {
			str += "-0" + mm;
		}
		if (mydate.getDate() > 9) {
			str += '-' + mydate.getDate();
		} else {
			str += "-0" + mydate.getDate();
		}
		return str;
	}
	// 页面保存
	function airExportSave() {
        $("#busyCode .select2-selection--single").removeClass("error");
		// 获取billId(主键)
		var liId = $('.AIRexport ul.Big li.active').attr('billId');
		// 获取当前li
		$("#detailPage .ZLmain>ul>li.active").attr('changed',false);
		//saved=0;
		var num = $("#detailPage .ZLmain>ul>li.active").index() + 1;
		var trackSub = $(".AIRexport #myTab li.active").index() + 1;
		switch (num) {
		case 2:
			// alert('点击了输单保存');
		/*	var checkLeftBill = $('.AIRexport #busyCode').valid();
			if (checkLeftBill == false) {
				alert('请完成必填输入！');
				return;
			} else {*/
				AIRinputorder.saveInputorder(liId);
	//		}
		//	AIRinputorder.saveInputorder(liId);
			break;
		case 3:
			// alert("点击了货物数据保存");
			AIRCargoData.saveData(liId);
			break;
	    case 4:
		    //取货计划
		    exportGoodsPlan.saveData(liId);
		    break;
		case 5:
			// 报关页面保存
			Airdeclare.saveData();
			break;
		case 6:
			// 费用保存
            AIRexportPayExpense.saveData();
			break;
		case 7:
			// 跟踪保存
			if (trackSub == 1) {
				// 流程跟踪
				AirBusinessTrack.saveBusinessTrack("AIRexport");
			} else if (trackSub == 2) {
				// 状态跟踪
				
			} else {
				// 二程跟踪
				AirSecondTrack.saveData(liId,"空运出口","AIRexport");
			}
			break;
		}
		//saved=1;
	}
	// 页面提交
	function airExportSubmit() {
        $("#busyCode .select2-selection--single").removeClass("error");
		// 获取billId(主键)
		var liId = $('.AIRexport ul.Big li.active').attr('billId');
		// 获取当前li
		$("#detailPage .ZLmain>ul>li.active").attr('changed',false);
		//saved=0;
		var num = $("#detailPage .ZLmain>ul>li.active").index() + 1;
		var trackSub = $(".AIRexport #myTab li.active").index() + 1;
		switch (num) {
		case 2:
			// alert('点击了输单保存');
			var checkLeftBill = $('.AIRexport #busyCode').valid();
			if (checkLeftBill == false) {
				alert('请完成必填输入！');
				return;
			} else {
				AIRinputorder.submitInputorder(liId);
			}
			break;
		case 3:
			// alert("点击了货物数据保存");
			AIRCargoData.saveData(liId);
			break;
	    case 4:
		    //取货计划
		    exportGoodsPlan.saveData(liId);
		    break;
		case 5:
			// 报关页面保存
			Airdeclare.saveData();
			break;
		case 6:
			// 费用保存
            AIRexportPayExpense.saveData();
			break;
		case 7:
			// 跟踪保存
			if (trackSub == 1) {
				// 流程跟踪
				AirBusinessTrack.saveBusinessTrack("AIRexport");
			} else if (trackSub == 2) {
				// 状态跟踪
				
			} else {
				// 二程跟踪
				AirSecondTrack.saveData(liId,"空运出口","AIRexport");
			}
			break;
		}
		//saved=1;
	}
    function lockFunction(){
    	$('.AIRexport').find('input,textarea').attr('disabled','disabled');//input框设置为只读
    	$('.AIRexport').find('select').attr('disabled','disabled');//select设置为只读
    	$('.AIRexport button.invalid').attr('disabled','disabled');//部分按钮禁用
    	$('.AIRexport div.invalid').removeAttr('onclick');//禁用一些新增、删除div
    	$('.AIRexport span.invalid').removeAttr('onclick');//禁用收、发货人span
    }
    function unlockFunction(){
    	$('.AIRexport').find('input,textarea').attr('disabled',false);//input框设置为只读
    	$('.AIRexport').find('select').attr('disabled',false);//select设置为只读
    	$('.AIRexport button.invalid').attr('disabled',false);//部分按钮解除禁用
    	//输单
    	$('.AIRexport span#majorConsignor').attr('onclick','AIRinputorder.majorConsignor(this)');
    	$('.AIRexport span#branchConsignor').attr('onclick','AIRinputorder.branchConsignor(this)');
    	$('.AIRexport span#majorConsignee').attr('onclick','AIRinputorder.majorConsignee(this)');
    	$('.AIRexport span#branchConsignee').attr('onclick','AIRinputorder.branchConsignee(this)');
    	//取货计划
    	//$('.AIRexport div#entrustDiv').attr('onclick','exportGoodsPlan.entrust()');
    	$('.AIRexport div#addGoodsDiv').attr('onclick',"goodsPlan.addGoodsData('AIRexport')");
    	$('.AIRexport div#copyGoodsDiv').attr('onclick',"goodsPlan.copyData('AIRexport')");
    	$('.AIRexport div#deleteGoodsDiv').attr('onclick',"goodsPlan.delGoodsData('AIRexport')");
    	//报关
    	$('.AIRexport div#declareAdd').attr('onclick','Airdeclare.addData()');
    	$('.AIRexport div#declareCopy').attr('onclick','Airdeclare.copyData()');
    	$('.AIRexport div#declareDelete').attr('onclick','Airdeclare.delData()');
    	//费用
    	$('.AIRexport div#addPayCost').attr('onclick','AIRexportPayExpense.addData(this)');
    	$('.AIRexport div#deletePayCost').attr('onclick','AIRexportPayExpense.delData(this)');
    	$('.AIRexport div#addRecieveCost').attr('onclick','AIRexportPayExpense.addData(this)');
    	$('.AIRexport div#deleteRecieveCost').attr('onclick','AIRexportPayExpense.delData(this)');
    	//跟踪
    	$('.AIRexport div#addStatus').attr('onclick',"AirSecondTrack.addData('AIRexport')");
    	$('.AIRexport div#deleteStatus').attr('onclick',"AirSecondTrack.delData('AIRexport')");
    }
	// 数组排序 对象中属性
	function compare(property) {
		return function(obj1, obj2) {
			var value1 = obj1[property];
			var value2 = obj2[property];
			return value1.localeCompare(value2);
		}
	}
	//上传附件
    function uploadFile (){
        var businessTable="air_bill_export";
        var fileType="正本";
        var modelName="airExport";
        /*if($('.AIRexport div#zlQtxxFjxx').attr('page')=='search'){
        	var rowData=AIRexport_table.rows('.selected').data()[0];
        	var id =rowData.billExportId;
        }else if($('.AIRexport div#zlQtxxFjxx').attr('page')=='business'){
        	var id=$('.AIRexport ul.Big li.active').attr('billId');
        }*/
       var id=$('.AIRexport div#zlQtxxFjxx').attr('billId');
        //var id = $(FCLexport.ULname).find('li.active').attr('billId');
        $Form = $(".AIRexport #fileUpload");
        var str=$('.AIRexport input#selectedFile').val();
        if(str==''){
            callAlert('请先选择要上传的文件');
        }else{
            var arr=str.split('\\');//注split可以用字符或字符串分割
            var fileName=arr[arr.length-1];//这就是要取得的文件名称
            var fileTypes=fileName.split('.');
            var fileType=fileTypes[fileTypes.length-1];
            fileName = encodeURI(encodeURI(fileName));
            fileType =  encodeURI(encodeURI(fileType));
            formURL=getContextPath()+'/uploader/upload.do?businessTable='+businessTable+"&businessId="+id+"&fileName="+fileName+"&fileType="+fileType+"&modelName="+modelName;
             // $Form.attr("action",formURL);
             // $Form.submit();
           // var form = document.getElementById(fileUpload);
            var formData = new FormData($Form[0]);
            $.ajax({
                url: formURL,
                type: 'POST',
                data: formData,
                mimeType: "multipart/form-data",
                contentType: false,
                cache: false,
                processData: false,
                success: function (res) {
                	if($('.AIRexport div#zlQtxxFjxx').attr('page')=='search'){
                		AIRexport.listFileById(1);
                	}else if($('.AIRexport div#zlQtxxFjxx').attr('page')=='business'){
                		AIRexport.listFileById(0);
                	}
                }
            });
            
        }
    }
	//查询附件信息
    function listFileById(a) {
    	if(a==1){
    		//DataTable返回的值
        var selectedRowData=AIRexport.AIRexport_table.rows('.selected').data();
        //alert(selectedRowData.length);
        if(selectedRowData.length<1){
            callAlert('请选择一条记录！');
            return ;
        }else if(selectedRowData.length>1){
            callAlert('仅允许操作一条记录');
            return ;
        }else {
            var billId=selectedRowData[0].billExportId;
            $('.AIRexport div#zlQtxxFjxx').attr('page','search');//用来判断模态框显示之前用户在查询界面还是业务界面
            $('.AIRexport div#zlQtxxFjxx').attr('billId',billId);
            $.ajax({
                type:'post',
                url:getContextPath()+'/sysAttachment/listByPage.do',
                //async:false,//同步
                data:{'keys':'{businessId:'+billId+',businessTable:"air_bill_export"}','start':0,'length':10000},
                success:function (data) {
                    $('.AIRexport #zlQtxxFjxx #fileUpload table tbody').empty();
                    data=JSON.parse(data)['aaData'];
                    for(var i=0;i<data.length;i++){
                        var tr=' <tr attachmentId='+data[i]['attachmentId']+'>'+
                            '<td name="attachmentName"><a target="_blank" href='+data[i]['attachmentPath']+'>'+data[i]['attachmentName']+'</a></td>'+
                            '<td >'+
                            '<select  name="documentType" class="optionDocumentType select2 select2-hidden-accessible"tabindex="-1" aria-hidden="true" style="width: 150px;">'+
                            '</select>'+
                            '</td>'+
                            '<td>'+data[i]['size']+'</td>'+
                            '<td>'+data[i]['createTime']+'</td>'+
                            '<td name="downloadNumber">'+data[i]['downloadNumber']+'</td>'+
                            '<td><input name="remarks" onchange="AIRexport.saveFile(this)" value='+data[i]['remarks']+'></td>'+
                            '</tr>';
                        $('.AIRexport #zlQtxxFjxx #fileUpload table tbody').append(tr);
                        $('.AIRexport #zlQtxxFjxx #fileUpload table tbody').find('tr:last .optionDocumentType').select2({
                            data: documentType,
                            placeholder:''
                        });
                        $('.AIRexport #zlQtxxFjxx #fileUpload table tbody').find('tr:last').find('select[name="documentType"]').val(data[i]['documentType']).trigger('change');
                        $('.AIRexport #zlQtxxFjxx #fileUpload table tbody').find('tr:last').find('select[name="documentType"]').attr('onchange','AIRexport.saveFile(this)');
                    }
                }
            });
            $('.AIRexport div#zlQtxxFjxx').modal('show');
        }
    	}
    	else{
    		var billId=$('.AIRexport ul.Big li.active').attr('billId');
    		$('.AIRexport div#zlQtxxFjxx').attr('page','business');
            $('.AIRexport div#zlQtxxFjxx').attr('billId',billId);
            $.ajax({
                type:'post',
                url:getContextPath()+'/sysAttachment/listByPage.do',
                data:{'keys':'{businessId:'+billId+',businessTable:"air_bill_export"}','start':0,'length':10000},
                //async:false,//同步
                success:function (data) {
                    $('.AIRexport #zlQtxxFjxx #fileUpload table tbody').empty();
                    data=JSON.parse(data)['aaData'];
                    for(var i=0;i<data.length;i++){
                        var tr=' <tr attachmentId='+data[i]['attachmentId']+'>'+
                            '<td name="attachmentName"><a target="_blank" href='+data[i]['attachmentPath']+'>'+data[i]['attachmentName']+'</a></td>'+
                            '<td >'+
                            '<select name="documentType" class="optionDocumentType select2 select2-hidden-accessible"tabindex="-1" aria-hidden="true" style="width: 150px;">'+
                            '</select>'+
                            '</td>'+
                            '<td>'+data[i]['size']+'</td>'+
                            '<td>'+data[i]['createTime']+'</td>'+
                            '<td name="downloadNumber">'+data[i]['downloadNumber']+'</td>'+
                            '<td><input name="remarks" onchange="AIRexport.saveFile()" value='+data[i]['remarks']+'></td>'+
                            '</tr>';
                        $('.AIRexport #zlQtxxFjxx #fileUpload table tbody').append(tr);
                        $('.AIRexport #zlQtxxFjxx #fileUpload table tbody').find('tr:last .optionDocumentType').select2({
                            data: documentType,
                            placeholder:''
                        });
                        $('.AIRexport #zlQtxxFjxx #fileUpload table tbody').find('tr:last').find('select[name="documentType"]').val(data[i]['documentType']).trigger('change');
                        $('.AIRexport #zlQtxxFjxx #fileUpload table tbody').find('tr:last').find('select[name="documentType"]').attr('onchange','AIRexport.saveFile()');

                    }
                }
            });
            $('.AIRexport div#zlQtxxFjxx').modal('show');
    	}
    }
    //删除上传文件
    function deleteFile(){
    		var a = $(".AIRexport #zlQtxxFjxx #fileUpload table tbody tr").hasClass("sel");
		if(!a){
			callAlert("请选择一个文件！");
		}else{
        var attachmentId=$('.AIRexport #zlQtxxFjxx #fileUpload table tbody tr.sel').attr('attachmentId');
        $.ajax({
            type: 'post',
            url: getContextPath() + '/sysAttachment/delete.do',
            data: {'attachmentIds':attachmentId,'modelName':'airExport'},
            success: function (data) {
                data=JSON.parse(data);
                if($('.AIRexport div#zlQtxxFjxx').attr('page')=='search'){
                	AIRexport.listFileById(1);
                }else if($('.AIRexport div#zlQtxxFjxx').attr('page')=='business'){
                	AIRexport.listFileById(0);
                }
                callAlert(data['message']);
            }
        });
	  }
    }
    //下载上传文件
    function downloadFile(){
    		var a = $(".AIRexport #zlQtxxFjxx #fileUpload table tbody tr").hasClass("sel");
    		if(!a){
    			callAlert("请选择一个文件！");
    		}else{
        var attachmentId=$('.AIRexport #zlQtxxFjxx #fileUpload table tbody tr.sel').attr('attachmentId');
        var downloadNumber=$('.AIRexport #zlQtxxFjxx #fileUpload table tbody tr.sel td[name="downloadNumber"]').text();
        var attachmentName=$('.AIRexport #zlQtxxFjxx #fileUpload table tbody tr.sel td[name="attachmentName"]').text();
        var modelName = "airExport";
        var url=getShipContextPath()+"downloader/downloadNumber.do?fileName="+attachmentName+'&modelName='+
            modelName+"&attachmentId="+attachmentId+"&downloadNumber="+downloadNumber;
        url=encodeURI(encodeURI(url)); //用了2次encodeURI
        window.location.href = url;
       /* if($('.AIRexport div#zlQtxxFjxx').attr('page')=='search'){
            AIRexport.listFileById(1);
        }else if($('.AIRexport div#zlQtxxFjxx').attr('page')=='business'){
            AIRexport.listFileById(0);
        }*/
       $('.AIRexport #zlQtxxFjxx #fileUpload table tbody tr.sel td[name="downloadNumber"]').text(Number(downloadNumber)+1);
        //window.open(url,'top');
        /*$.ajax({
        	type:"post",
        	url:url,
        	async:true,
        	success:function(data){
        		if($('.AIRexport div#zlQtxxFjxx').attr('page')=='search'){
            		AIRexport.listFileById(1);
        		}else if($('.AIRexport div#zlQtxxFjxx').attr('page')=='business'){
            		AIRexport.listFileById(0);
        		}
        	}
        });*/
    	}
    }
    //保存文件修改
    function saveFile(d){
        $('.AIRexport div#zlQtxxFjxx  table tbody').find('tr').css('background','transparent').removeClass('sel');
        $(d).parent('td').parent('tr').css('background','lightblue').addClass('sel');
        var remarks=$('.AIRexport #zlQtxxFjxx #fileUpload table tbody tr.sel input[name="remarks"]').val();
        var documentType=$('.AIRexport #zlQtxxFjxx #fileUpload table tbody tr.sel select[name="documentType"]').val();
        var attachmentId=$('.AIRexport #zlQtxxFjxx #fileUpload table tbody tr.sel').attr('attachmentId');
        $.ajax({
            type: 'post',
            url: getContextPath() + 'sysAttachment/update.do',
            data: {'attachmentId':attachmentId,'remarks':remarks,'documentType':documentType},
            success: function (data) {
                data=JSON.parse(data);
               // callAlert(data['message']);
                //AIRexport.listFileById();
            }
        });
        
    }
    function financialModalShow(){
    	//var id=$('.AIRexport ul.Big li.active').attr('billId');
        $.ajax({
            url:getContextPath()+'airBillCommonController/getAirFinanceInfo.do',
            type:'POST',
            data:{'billId':$('.AIRexport ul.Big li.active').attr('billId'),'businessTable':'air_bill_export'},
            success:function (data) {
                console.log(data);
                if(data){
                    data=JSON.parse(data);
					$('.AIRexport div#financeTC tbody input').each(function () {
						if(data[$(this).attr('name')]){
							$(this).val(data[$(this).attr('name')])
						}else{
                            $(this).val(0);
						}
                    });
				}else{
                    $('.AIRexport div#financeTC tbody input').each(function () {
                            $(this).val(0);
                    });
				}
            }
        })
    	/*var USDpay=$('.AIRexport div.cost div#airExportPayable input#USDTotal').val();
    	var USDget=$('.AIRexport div.cost div#expReceivable input#USDTotal').val();
    	var USDprofit=USDget-USDpay;
    	var RMBpay=$('.AIRexport div.cost div#airExportPayable input#RMBTotal').val();
    	var RMBget=$('.AIRexport div.cost div#expReceivable input#RMBTotal').val();
    	var RMBprofit=RMBget-RMBpay;
    	//alert(USDget);
    	$('.AIRexport div#financeTC input#USDfinanceGet').val(USDget);
    	$('.AIRexport div#financeTC input#USDfinancePay').val(USDpay);
    	$('.AIRexport div#financeTC input#USDfinanceProfit').val(USDprofit);
    	$('.AIRexport div#financeTC input#RMBfinanceGet').val(RMBget);
    	$('.AIRexport div#financeTC input#RMBfinancePay').val(RMBpay);
    	$('.AIRexport div#financeTC input#RMBfinanceProfit').val(RMBprofit);*/
    	$('.AIRexport #financeTC').modal('show');
    }
    //完成提交按钮
    function lockPage(){
    	if(confirm('是否提交整票业务')){
    		var id=$('.AIRexport ul.Big li.active').attr('billId');
    	$.ajax({
    		type:"post",
    		url:"/SeawinWebappBase/airBillExportController/updateStatus.do",
    		data:{"id":id,"token":"完成"},
    		success:function(data){
    			alert('提交成功');
    			//$('.AIRexport div#successModal').modal('show');//显示操作完成模态框
    			$('.AIRexport').find('input,textarea').attr('readonly','readonly');//input框设置为只读
    			$('.AIRexport').find('select').attr('disabled','disabled');//select设置为只读
    		}
    	});
    	}else{
    		
    	}
    }
    //复制按钮
    function copy(){
    	var selectedRowData=AIRexport.AIRexport_table.rows('.selected').data();
        //alert(selectedRowData.length);
        //console.log(selectedRowData);
        if(selectedRowData.length<1){
            callAlert('请选择一条记录！');
            return ;
        }else if(selectedRowData.length>1){
        	callAlert('只能复制一条记录！');
            return ;
        }else{
        	var id=selectedRowData[0].billExportId;
            //console.log(id);
        	$.ajax({
        		type:"post",
        		url:"/SeawinWebappBase/airBillCommonController/exportCopy.do",
        		//async:true
        		data:{"id":id},
        		success:function(data){
        			callAlert('复制成功');
        			AIRexport.AIRexport_table.ajax.reload();//重新加载表单
        		}
        	});
        }
    }
    //业务查询界面修改按钮
    function updateButton(){
    	var selRow=AIRexport.AIRexport_table.rows('.selected').data();
    	var length=selRow.length;
    	if(length>1){
    		callAlert('只能修改一条记录！');
    	}else if(length<1){
    		callAlert('请选择一条记录！');
    	}else{
    		var businessStatus=selRow[0].businessStatus;
    		if(businessStatus=='完成'){
    			callAlert('该票业务已提交，不能进行修改！');
    		}else{
    			var billId=selRow[0].billExportId;
    			var flag = 0;//判断是否已经有该条业务的菜单
				for (var i = 0; i < $('.AIRexport ul.Big').find('li').length; i++) {
					if (billId == $($('.AIRexport ul.Big').find('li')[i]).attr('billId')) {
						flag++;
						} else {

						}
					}
				if(flag==0){
					var mbLNo = selRow[0].businessCode;// 获取业务编号
					$('.AIRexport ul.Big').find('li').removeClass('active');
					$('.AIRexport ul.Big').append(
												'<li role="presentation" class="active AIR" billId='
												+ billId
												+' businessStatus='+businessStatus+'><a href="#detailPage" aria-controls="overview" role="tab" data-toggle="tab">出口-'
														+ mbLNo
														+ '<span class="glyphicon glyphicon-remove closeTab" closeTabid='
														+ billId
														+ ' style="borderr-radius:50%;background:#4122e5;color:white;margin-left:5px;"></span></a></li>');
					$('.AIRexport div.Big').find('>div.tab-pane').removeClass('active');
					$('.AIRexport div.detailPage').addClass('active');
					changeZLmain(0);
					// 向后台请求数据
					AIRexportDetail(billId, 0);
				}else{
					$('.AIRexport ul.Big').find('>li').removeClass('active');
					$('.AIRexport div.Big').find('>div.tab-pane').removeClass('active');
					$('.AIRexport ul.Big').find('li[billId="' + billId + '"]').addClass('active');
					$('.AIRexport div.Big').find('>div.tab-pane#detailPage').addClass('active');
					var num = $('.AIRexport ul.Big').find('li[billId="' + billId + '"]').attr('data-num');
					AIRexportDetail(billId, num);		
				}
    	    }
    	}
    }
    //数据同步
	function DS() {
        $('.AIRexport div#AIRIsDSModal').modal('show');
        $('.AIRexport div#AIRIsDSModal button.YesSubmit').unbind('click').click(function () {
            $.ajax({
                url:getShipContextPath()+'airBillExportController/synchroHhToHg.do',
                type:'POST',
                data:{'billId':$('.AIRexport ul.Big li.active').attr('billId')},
                success:function (data) {
                    console.log(data);
                    data=JSON.parse(data);
                    alert(data['message']);
                }
            })
            $('.AIRexport div#AIRIsDSModal').modal('hide');
        })
		
    }
	return {
    	DS:DS,
		addNew : addNew,
		queryButton : queryButton,
		deleteBusinessAll : deleteBusinessAll,
		AIRexportDetail : AIRexportDetail,
		documentType:documentType, //单证类型
		closeDetail : closeDetail,
		airExportSave : airExportSave,
		showPrint : showPrint,
		print : print,
		nowtime : nowtime,// 获取当前时间格式化
		doSearch : doSearch,
		compare : compare,
		changeTrack:changeTrack,
		AIRTrackingDetail:AIRTrackingDetail,
		isChange:isChange,
		uploadFile:uploadFile,
		listFileById:listFileById,
        deleteFile:deleteFile,
        downloadFile:downloadFile,
        saveFile:saveFile,
        refresh:refresh,
        putOrderSelect:putOrderSelect,
        datatableRefresh:datatableRefresh,
        financialModalShow:financialModalShow,
        askDataAndBind:askDataAndBind,
        lockPage:lockPage,
        copy:copy,
        InitEntrClientDetail:InitEntrClientDetail,
        //getEntrustButton:getEntrustButton,
        entrustSearch:entrustSearch,
        entrustReset:entrustReset,
        airExportSubmit:airExportSubmit,
        lockFunction:lockFunction,
        unlockFunction:unlockFunction,
        updateButton:updateButton,
        airBooking:airBooking,
        airBooking_table:airBooking_table,
		setTimeInput:setTimeInput,
        initSelect2_AIRexport:initSelect2_AIRexport,
        AIRexport_table:AIRexport_table,
        changeZLmain:changeZLmain,
        AIRexportClient_table:AIRexportClient_table
	};
})();
$(function() {
	//附件上传模态框选中
    $('.AIRexport div#zlQtxxFjxx table tbody').on('click','tr td',function(){
        $('.AIRexport div#zlQtxxFjxx  table tbody').find('tr').css('background','transparent').removeClass('sel');
        $(this).parents('tr').css('background','lightblue').addClass('sel');
    });
    $('.AIRexport div.form-group input.startTime').on('click',function () {
        $(this).datepicker('setEndDate',$(this).parents('div.form-group').find('input.endTime').val());
    })
    $('.AIRexport div.form-group input.endTime').on('click',function () {
        $(this).datepicker('setStartDate',$(this).parents('div.form-group').find('input.startTime').val());
    })
    /*$('.AIRexport div#tracing').on('click','li#statusLi',function(){
    	$('.AIRexport div#tracing div#jzx').addClass('active');
    })*/
	$('.AIRexport .startTime,.AIRexport .endTime,.AIRexport .Time').datepicker({
        autoclose : true,
		language:'zh-CN',
        format : "yyyy-mm-dd"
    });
    AIRexport.setTimeInput();
    var billId;// 菜单切换是操作，更改billId的值
    $(document.body).css('overflow', 'auto');

    // 点击总览等菜单切换页面 向后台请求数据
    $('.AIRexport div.Big div.ZLmain').on('click', '>ul>li', function() {
        AIRexport.isChange();
        var id = $('.AIRexport ul.Big li.active').attr('billId');
        var num = $(this).index();
        AIRexport.AIRexportDetail(id, num);
    });
    // 点击跟踪里面的子菜单切换页面 向后台请求数据
    $('.AIRexport #tracing').on('click','>ul>li',function(){
        var id = $('.AIRexport ul.Big li.active').attr('billId');
        var num = $(this).index();
        AIRexport.AIRTrackingDetail(id,num);
    });
    // tab菜单样式切换
    $('.AIRexport ul.Big').on('click','li',function(e) {
      	AIRexport.isChange();
        billId = $(this).attr('billId');
        console.log(billId);
        e.stopPropagation();
        e.preventDefault();
        if ($(this).hasClass('active')) {//点击当前业务的菜单什么都不做

        } else {//点击另一条业务或者业务查询的菜单
            if ($('.AIRexport ul.Big').find('li.active').attr('billId')) {//当前菜单是一条业务的菜单
                //alert('是业务菜单');//点击的是业务查询的菜单
                var ind = $('.AIRexport div#detailPage div.ZLmain>ul>li.active').index();
                $('.AIRexport ul.Big').find('li.active').attr('data-num', ind);
            } else {//点击的是另一条业务的菜单
                //alert('是主菜单');
            }
            $('.AIRexport ul.Big').find('li').removeClass('active');
            $('.AIRexport div.Big>div').removeClass('active');
            $(this).addClass('active');
            // console.log($(this).find('a').attr('href'))
            var tabPanelId = $(this).find('a').attr('href').split('#')[1];
            if ($(this).attr('data-num')) {
                // 这里向后台请求数据 跟新页面 还要获取页面结束时所在的tab
                var num = $(this).attr('data-num');
                var businessStatus=$(this).attr('businessStatus');
                $('.AIRexport div.Big>div#' + tabPanelId).addClass('active');
                $('.AIRexport div#detailPage div.ZLmain>ul>li').removeClass('active');
                $('.AIRexport div#detailPage div.ZLmain>div>div').removeClass('active');
                $('.AIRexport div#detailPage div.ZLmain>ul>li:eq('+ num + ')').addClass('active');
                $('.AIRexport div#detailPage div.ZLmain>div>div:eq('+ num + ')').addClass('active');
                if(businessStatus=='完成'){
                    AIRexport.lockFunction();
                }else{
                    AIRexport.unlockFunction();
                }
                AIRexport.AIRexportDetail(billId, num);
            } else {
                // console.log('是主菜单');
                AIRexport.AIRexport_table.ajax.reload();
                $('.AIRexport div.Big>div#' + tabPanelId).addClass('active');
            }

        }
    })
    // tab菜单点击图标删除菜单操作
    $('.AIRexport ul.Big').on('click', 'li span.closeTab', function(e) {
        e.stopPropagation();
        e.preventDefault();
        var Tabid = $(this).attr('closeTabid');
        // console.log($(this).parents('li').hasClass('active'));
        if ($(this).parents('li').hasClass('active')) {
            // 删除当前菜单 操作结束后主页面获取active
            $($(this).parents('ul').find('li')[0]).addClass('active');
            $($('.AIRexport div.Big>div')[0]).addClass('active');
            $(this).parents('li').remove();
            $($('.AIRexport div.Big>div')[1]).removeClass('active');

        } else {
            // 直接删除即可
           AIRexport.isChange();
            $(this).parents('li').remove();
        }
        return false;
    })

    //请求单证类型
    $.ajax({
        type: 'post',
        url: getContextPath() + '/redisController/listIdObjectByname.do?name=basedataCommonSet_45',
        data: {},
        success: function (data) {
            data = JSON.parse(data);
            //console.log(data);
            for(var i=0;i<data.length;i++){
                AIRexport.documentType.push({"id":data[i],"text":data[i]});
            }
        }
    });
    // tab菜单点击图标删除菜单操作
    $('.AIRexport ul.Big').on('click', 'li span.closeTab', function(e) {
        e.stopPropagation();
        e.preventDefault();
        var Tabid = $(this).attr('closeTabid');
        // console.log($(this).parents('li').hasClass('active'));
        if ($(this).parents('li').hasClass('active')) {
            // 删除当前菜单 操作结束后主页面获取active
            $($(this).parents('ul').find('li')[0]).addClass('active');
            $($('.AIRexport div.Big>div')[0]).addClass('active');
            $(this).parents('li').remove();
            $($('.AIRexport div.Big>div')[1]).removeClass('active');

        } else {
            // 直接删除即可
            $(this).parents('li').remove();
        }
        return false;
    })
	// 表单重置
    $('button.search_reset').on('click',function() {
            $('#exportSearchForm')[0].reset();
            // 初始化时间输入框
            //setTimeInput();
            $('#exportSearchForm').find('.select2-selection__rendered')
                .attr('title', '其他条件').text('其他条件');
            keysOption = {};
            AIRexport.AIRexport_table.ajax.reload();
        })
	// 初始化下拉框
    $(function() {
        $(".AIRexport .select2").select2();
        // 下拉框中加载数据
        AIRexport.initSelect2_AIRexport();
        // 解决select2在弹开中不能搜素的问题
        $.fn.modal.Constructor.prototype.enforceFocus = function() {
        };
    })
	// 监听其他条件变化
    $('select.otherConditions').on('change', function(e) {
        $(this).parent().find('input').attr('name', $(this).val());
    });
	//全选
    $('body').on('click', '.AIRexport .checkall', function () {
        allSelection("AIRexport","AIRexportTable",AIRexport.AIRexport_table,this);
    });
    //点击第一格才能选中
    $('#AIRexportTable tbody').on('click', 'tr td:first-child', function () {
        selection1(AIRexport.AIRexport_table,this);
    });
    //找到表格 对点击的内容进行赋值
    $('body').on('click','.AIRexport #airBookingTable tr td',function () {
        $(this).parents('tbody').find('tr').removeClass('selected');
        $(this).parents('tr').addClass('selected');
    });
    $('body').on('dblclick','.AIRexport #airBookingTable tr',function () {
        var bookingData=airBooking_table.rows($(this)).data()[0];
        $('#busyCode input[name="orderCode"]').val(bookingData['customerCode']).trigger('change');
        $('#busyCode input[name="orderInfo"]').val(bookingData['customerNameCn']).trigger('change');
        $('#busyCode input[name="orderId"]').val(bookingData['supplierId']).trigger('change');
        $('#airBooking').modal('hide');
    })

    //刷新订舱方
    $("#airBookingSeachPortForm").click( function() {
        $("#airBookingForm")[0].reset();
        airBooking_table.ajax.reload();
    });
    //委托人
    $('.AIRexport div#exportEntrustModal').on('click','table#clientTable tr td',function(){
        $('.AIRexport div#exportEntrustModal table#clientTable tr').css('background-color','transparent').removeClass('sel');
        $(this).parent('tr').css('background-color','lightblue').addClass('sel');
    });
    //委托人 输单页面赋值
    $('.AIRexport div#exportEntrustModal').on('dblclick','table#clientTable tr td',function(){
        var selRow=AIRexport.AIRexportClient_table.rows('.sel').data();
        var customerCode=selRow[0]["customerCode"];
        var customerId=selRow[0]["customerId"];
        var customerNameCn=selRow[0]["customerNameCn"];
        var salesmanName=selRow[0]["salesmanName"];
        var salesmanId=selRow[0]["salesmanId"];
    //    var servicePersonName=selRow[0]["servicePersonName"];
      	var servicePersonUserId=selRow[0]["servicePersonUserId"];
        $('.AIRexport div#inputORD input[name="customerCode"]').val(customerCode).trigger('change').removeClass('error').addClass('valid');
        $('.AIRexport div#inputORD input[name="customerId"]').val(customerId).trigger('change');
        $('.AIRexport div#inputORD input[name="clientInfo"]').val(customerNameCn).trigger('change').removeClass('error').addClass('valid');
        $('.AIRexport div#inputORD input[name="salesmanName"]').val(salesmanName).trigger('change');
        $('.AIRexport div#inputORD input[name="salesmanId"]').val(salesmanId).trigger('change');
   //     $('.AIRexport div#inputORD input[name="majorPeopleOne"]').val(servicePersonName);
		$('.AIRexport div#inputORD select[name="majorPeopleOne"]').val(servicePersonUserId).trigger('change');
        $('.AIRexport div#exportEntrustModal').modal('hide');
    });
    // 设置校验规则
    $().ready(function validateLeftBillForm() {
        LeftBill_Validator = $(".AIRexport #busyCode").validate({
            ignore : '',
            errorElement : 'span',
            errorClass : 'error',
            rules : {
                businessCode : {  //业务编号
                    required : true,
                    maxlength : 20
                },
                billLandingNo : { 	//提单号
                    required : true,
                    maxlength : 20
                },
               /* majorShipperCode : {	//发货人
                    required : true,
                    //maxlength : 100
                },*/
                majorShipperInfo : {	//发货人
                    required : true,
                    //maxlength : 100
                },
                majorRecieveCode : {		//收货人
                    required : true,
                    //maxlength : 100
                },
                majorRecieveInfo : {		//收货人
                    required : true,
                    //maxlength : 100
                },
                clientInfo : {			//委托人
                    required : true,
                    maxlength : 20
                },
                loadInfo : {		//装货港
                    required : true,
                    maxlength : 20
                },
				loadCode:{		//装货港
                	required:true
				},
                terminiInfo : {		//目的地
                    required : true,
                    maxlength : 20
                },
                terminiCode:{
                    required:true
                },
                planLeaveDate : {		//预计离港
                    required : true,
                    maxlength : 20
                },
                salesmanName : {		//销售
                    required : true,
                    maxlength : 20
                },
               /* majorPeopleOne : {		//客服1
                    required : true,
                    maxlength : 20
                },*/
                majorBusniess : {		//商务
                    required : true,
                    maxlength : 20
                },
                majorOperate : {	//操作
                    required : true,
                    maxlength : 20
                },
				majorPackageNumber:{	//件数
                	required:true
				},
                majorGrossWeight:{		//毛重
                    required:true
                },
                majorVolume:{		//体积
                    required:true
                },
                majorQuantityUnit:{		//件数单位
                	required:true
				},
                majorWeightUnit:{		//毛重单位
                	required:true
				},
                majorVolumeUnit:{		//体积单位
                	required:true
				},
                majorBusinessId:{  //商务ID
                	required:true
				},
                majorOperateId:{	//操作ID
                	required:true
				}/*,
                updateRemark:{		//审核备注
                    required:true
                }*/
            },
            errorPlacement : function() {
                return false;
            }
        });
    });
    //单证类型
    $.ajax({
        type: 'post',
        url: getContextPath() + '/redisController/listIdNameByName.do?name=basedataCommonSet_45',
        data: {},
        success: function (data) {
            data = JSON.parse(data);
            $(".AIRexport #printSelect_1").empty();
            $(".AIRexport #printSelect_1").append("<option value=''></option>");
            for (var i = 0; i < data.length; i++) {
                for (var key in data[i]) {
                    $(".AIRexport #printSelect_1").append("<option value='" + key + "'>" + data[i][key] + "</option>");
                }
            }
        }
    });
    //点击tr添加selected属性但不选中checkbox nowSel是最新点击的tr也就是（删除之 外的）操作的执行者  删除的用selected作为选择器
	/*$('#AIRexportTable tbody').on('click', 'tr td', function () {
	 $('#AIRexportTable tbody').find('tr').removeClass('nowSel');

	 $(this).parents('tr').addClass('nowSel');
	 });*/
    // 双击一条记录，跳转到总览
    $('.AIRexport #AIRexportTable').on('dblclick','tbody tr',function() {
        var billId = $(this).find('input:checkbox').val();
        var businessStatus=$(this).find('td:last-child').text();
        console.log(billId);
        console.log(businessStatus);
        //alert('billId:'+billId);
        var flag = 0;//判断是否已经有该条业务的菜单
        for (var i = 0; i < $('.AIRexport ul.Big').find('li').length; i++) {
            if (billId == $($('.AIRexport ul.Big').find('li')[i]).attr('billId')) {
                flag++;
            } else {

            }
        }
        if (flag == 0) {
            // 创建新的tab菜单
            if(businessStatus=='完成'){
                var mbLNo = $($(this).find('td')[2]).text();// 获取业务编号
                //alert('mblNo:'+mbLNo);
                $('.AIRexport ul.Big').find('li').removeClass('active');
                $('.AIRexport ul.Big').append(
                    '<li role="presentation" class="active AIR" billId='
                    + billId
                    +' businessStatus='+businessStatus+'><a href="#detailPage" aria-controls="overview" role="tab" data-toggle="tab">出口-'
                    + mbLNo
                    + '<span class="glyphicon glyphicon-remove closeTab" closeTabid='
                    + billId
                    + ' style="borderr-radius:50%;background:#4122e5;color:white;margin-left:5px;"></span></a></li>');
                $('.AIRexport div.Big').find('>div.tab-pane').removeClass('active');
                $('.AIRexport div.detailPage').addClass('active');
                //$('.AIRexport').find('input,textarea').attr('readonly','readonly');//input框设置为只读
                //$('.AIRexport').find('select').attr('disabled','disabled');//select设置为只读
                AIRexport.lockFunction();
                AIRexport.changeZLmain(0);
                // 向后台请求数据
                AIRexport.AIRexportDetail(billId, 0);
            }else{
                var mbLNo = $($(this).find('td')[2]).text();// 获取业务编号
                //alert('mblNo:'+mbLNo);
                $('.AIRexport ul.Big').find('li').removeClass('active');
                $('.AIRexport ul.Big').append(
                    '<li role="presentation" class="active AIR" billId='
                    + billId
                    +' businessStatus='+businessStatus+'><a href="#detailPage" aria-controls="overview" role="tab" data-toggle="tab">出口-'
                    + mbLNo
                    + '<span class="glyphicon glyphicon-remove closeTab" closeTabid='
                    + billId
                    + ' style="borderr-radius:50%;background:#4122e5;color:white;margin-left:5px;"></span></a></li>');
                $('.AIRexport div.Big').find('>div.tab-pane').removeClass('active');
                $('.AIRexport div.detailPage').addClass('active');
                //$('.AIRexport').find('input,textarea').attr('readonly',false);//input框设置为只读
                //$('.AIRexport').find('select').attr('disabled',false);//select设置为只读
                AIRexport.unlockFunction();
                AIRexport.changeZLmain(0);
                // 向后台请求数据
                AIRexport.AIRexportDetail(billId, 0);
            }

        } else {
            if(businessStatus=='完成'){
                $('.AIRexport ul.Big').find('>li').removeClass('active');
                $('.AIRexport div.Big').find('>div.tab-pane').removeClass('active');
                $('.AIRexport ul.Big').find('li[billId="' + billId + '"]').addClass('active');
                $('.AIRexport div.Big').find('>div.tab-pane#detailPage').addClass('active');
                //$('.AIRexport').find('input,textarea').attr('readonly','readonly');//input框设置为只读
                //$('.AIRexport').find('select').attr('disabled','disabled');//select设置为只读
                AIRexport.lockFunction();//input、按钮等禁用
                var num = $('.AIRexport ul.Big').find(
                    'li[billId="' + billId + '"]').attr(
                    'data-num');
                AIRexport.AIRexportDetail(billId, num);
            }else{
                $('.AIRexport ul.Big').find('>li').removeClass('active');
                $('.AIRexport div.Big').find('>div.tab-pane').removeClass('active');
                $('.AIRexport ul.Big').find('li[billId="' + billId + '"]').addClass('active');
                $('.AIRexport div.Big').find('>div.tab-pane#detailPage').addClass('active');
                //$('.AIRexport').find('input,textarea').attr('readonly',false);//input框设置为只读
                //$('.AIRexport').find('select').attr('disabled',false);//select设置为只读
                AIRexport.unlockFunction();//解除禁用
                var num = $('.AIRexport ul.Big').find(
                    'li[billId="' + billId + '"]').attr(
                    'data-num');
                AIRexport.AIRexportDetail(billId, num);
            }

        }
    });
    //主单付款方式监听select2的改变
    $('.AIRexport select[name="majorPayMean"]').on('change',function(){
        var majorPayMean=$(this).val();
        //console.log(majorPayMean);
        if(majorPayMean=='P'){
            $(this).parent('td').find('input').val('FREIGHT PREPAID');
        }else if(majorPayMean=='C'){
            $(this).parent('td').find('input').val('FREIGHT COLLECT');
        }else if(majorPayMean=='A'){
            $(this).parent('td').find('input').val('FREIGHT PAYALE AT');
        }else{
            $(this).parent('td').find('input').val(' ');
        }

    })
    //分单付款方式监听select2的改变
    $('.AIRexport select[name="branchPayMean"]').on('change',function(){
        var branchPayMean=$(this).val();
        //console.log(majorPayMean);
        if(branchPayMean=='P'){
            $(this).parent('td').find('input').val('FREIGHT PREPAID');
        }else if(branchPayMean=='C'){
            $(this).parent('td').find('input').val('FREIGHT COLLECT');
        }else if(branchPayMean=='A'){
            $(this).parent('td').find('input').val('FREIGHT PAYALE AT');
        }else{
            $(this).parent('td').find('input').val(' ');
        }

    });
})