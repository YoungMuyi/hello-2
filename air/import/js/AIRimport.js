//@ sourceURL=AIRimport.js
var AIRimport=(function(){
	var ULname = '.AIRimport ul.Big';
	var AIRimport_table;
	var carryArr=[];//装货港
	var load=[];//卸货港
	var MDport=[];//目的港
	var airCompany=[];//航空公司
	var documentType=[{'id':'','text':''}];   //单证类型
	//费用变量
	var optionCurrency=[{'id':' ','text':''}];  //货物数据
    var FeiYongDaiMa=[{'id':' ','text':''}];   //费用代码
    var customerNameSel=[{'id':' ','text':''}];  //应付往来单位
    var CorrespondentUnit=[{'id':' ','text':''}];  //应收往来单位
    var receivingMode=[{'id':' ','text':''}]; //贸易类型
    //费用 应付往来单位
    var AIRIntercourUnit_table;
    //费用 应收往来单位
    var AIRReceivableUnit_table;
    var numberUnit=[{'id':' ','text':''}];    //件数单位
	//初始时间设置  选择日期   选择时间具体到分
    function  setTimeInput() {
        var nS=new Date().valueOf();
        var endTime=new Date(parseInt(nS)).toLocaleString().replace(/\//g,"-").replace(/日/g," ");
        var startTime=new Date(parseInt(nS-30*24*60*60*1000)).toLocaleString().replace(/\//g,"-").replace(/日/g," ");
        /* var now=new Date();
         var before=new Date(parseInt(new Date().valueOf()-30*24*60*60*1000)*1000);
         var startTime=(now.getYear())+"-"+(now.getMonth()+1)+"-"+(now.getDate());
         var endTime=(before.getYear())+"-"+(before.getMonth()+1)+"-"+(before.getDate());*/
      //  console.log(startTime.split('-')[1]>9);
        if(startTime.split('-')[1]>9){

        }else{
            var startArr=startTime.split('-');
         //   console.log(startArr);
            startArr[1]='0'+startArr[1];
            startTime=startArr.join("-");
        }
        if(endTime.split('-')[1]>9){

        }else{
            var endArr=endTime.split('-');
         //   console.log(endArr);
            endArr[1]='0'+endArr[1];
            endTime=endArr.join("-");
        }
        $('input.startTime').val(startTime.split(" ")[0]);
        $('input.endTime').val(endTime.split(" ")[0]);
    }
    //select2具体初始化
    function initSelect2_AIRimport() {
        var otherConditionsData= [{ id: 'clientLinkman', text: '委托方' }, { id: 'operator', text: '操作员' }, { id: 'flightId', text: '航班号' }, { id: 'billLandingNo', text: '提单号' }, {id:'orderInfo',text:'订舱方'},{ id: 'orderId', text: '订舱号' },{id:'caseNo',text:'进仓编号'},{id:'caseSealNo',text:'报关单号'},{id:'disEntryCode',text:'最新状态'}];
        var otherTypeData=[{id:'LIKE',text:'包含'},{id:'EQUAL',text:'等于'},{id:'NOTEQUAL',text:'不等于'},{id:'NOTLIKE',text:'不包含'}]

       $('.otherConditions').select2({
            data:otherConditionsData
        });
        $('.otherType').select2({
            data:otherTypeData
        })
    }
    //导航栏新增按钮
	function imAddNew(){
		$.ajax({
			type:"post",
			url:'/SeawinWebappBase/airBillImportController/insertRecord.do',
			data:{},
			success:function(data){
				var res = JSON.parse(data);
				var billId = res.billImportId;
				var businessCode=res.businessCode;
				$('.AIRimport ul.Big').find('li').removeClass('active');
                $('.AIRimport ul.Big').append('<li role="presentation" class="active" billId=' + billId + '> <a href="#importDetailPage" aria-controls="importOverview" role="tab" data-toggle="tab">进口-'+ businessCode +'<span class="glyphicon glyphicon-remove closeTab" style="borderr-radius:50%;background:#4122e5;color:white;margin-left:5px;"></span></a></li>');
                $('.AIRimport div.Big').find('>div.tab-pane').removeClass('active');
                $('.AIRimport div.importDetailPage').addClass('active');
                AIRimport.changeZLmain(1);
                //AIRimport_table.ajax.reload();
                //AIRgetorder.initBaseData();
                AIRimport.AIRimportDetail(billId,1);
			}
		});
		AIRimport_table.ajax.reload();
	}
	 //导航栏批量删除按钮
    function imDelete() {
        var info;
        var selectedRowData = AIRimport_table.rows('.selected').data();
        if (selectedRowData.length < 1) {
            info = "请选择需要删除的数据！";
            callAlert(info);
            return;
        }
        info = "确定要删除" + selectedRowData.length + "条数据吗?";
        callAlertModal(info,'AIRexport_BusinessDelete');

//先解除click捆绑事件否则每次都会造成连续捆绑。
        $('.AIRexport_BusinessDelete').unbind('click').click(function () {
            var ids=[];
            var selectedRowData = AIRimport_table.rows('.selected').data();
            for(var i =0;i<selectedRowData.length;i++){
                ids.push(selectedRowData[i].billImportId);
            }
         $.ajax({
                url:'/SeawinWebappBase/airBillImportController/deleteById.do',
                data: {"ids":ids.join(",")},
                beforeSend: function () {
                    showMask();//显示遮罩层
                },
                success: function (rsp) {
                    hideMask();
					rsp=JSON.parse(rsp);
                    if (rsp.status ==1) {
                        callSuccess("删除成功!");
                        AIRimport_table.ajax.reload();
                    } else{
                    	callAlert("删除失败!");
                    }
                },
                error: function () {
                    hideMask();
                    callAlert(ids);
                    callAlert("删除失败！")
                }
            });
        })

    }
    //条件查询按钮
    function imDoSearch(){
        AIRimport_table.ajax.reload();
    }
	//显示查询结果的表格
    InitAirImportTable();
    function InitAirImportTable(){
    	AIRimport_table = $("#AIRimportTable").DataTable({
            fnRowCallback:rightClick,   //利用行回调函数来实现右键事件
            fnDrawCallback:changePage,  //重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
            //动态分页加载数据方式
            fnInitComplete: function(oSettings,json){
            	//alert('加载下拉框');
            	AIRimport.getOrderInitSelect();
            },
            bProcessing: true,
            bServerSide: true,
            aLengthMenu: [10, 20, 40, 60], // 动态指定分页后每页显示的记录数。
            searching: false,// 禁用搜索
            lengthChange: true, // 是否启用改变每页显示多少条数据的控件
            /*
             * sort : "position",
             * //是否开启列排序，对单独列的设置在每一列的bSortable选项中指定
             */
            deferRender: true,// 延迟渲染
            bStateSave: false, // 在第三页刷新页面，会自动到第一页
            iDisplayLength: 10, // 默认每页显示多少条记录
            iDisplayStart: 0,
            ordering: false,// 全局禁用排序
            serverSide: true,
            scrollX: true,
            autoWidth: true,
            scrollY:calcDataTableHeight(),
            colReorder:true,
            destroy:true,
            dom:'<"top">rt<"bottom"flip><"clear">',
            ajax: {
                type: "post",
                url:'/SeawinWebappBase/airBillImportController/selectAll.do',
                data: function (d) {
                    search_data = $('#importSearchForm').serializeObject();                   
                    var k={};
                    var i=0;
                    for(var key in search_data){
						if(i==6){
                            if(search_data[key]==""||search_data[key]==null){
                            }else{
                                k[key]=search_data[key];
                            }
						}else{
                            if(search_data[key]==""||search_data[key]==null){
                            }
                            else{
                                k[key]=search_data[key];
                            }
						}
                        i++;
                    }
                    k=JSON.stringify(k);
                    d.keys=k;
                }
            },
            language: {
                "url": "js/Chinese.json"
            },
            columns: [
                {
                    "sClass": "text-center",
                    "data": "airImportId",
                    "title": "<input type='checkbox' class='checkall' />",
                    "render": function (data, type,row, meta) {
                    //	console.log(row)
                        return '<input type="checkbox"  class="checkchild" id="'+row.billImportId+'"  value="' +row.billImportId+ '" />';
                    },
                    "bSortable": false

                },{
                    "sClass":"text-center",
                    "data":"number",
                    "title":"序号",
                    "render":function (data,type,full,meta) {
                        return meta.row+1;
                    }
                },
                {title: "业务编号", data: "businessCode"},
                {title: "提单号", data: "billLadingNo"},
                {title: "航空公司", data: "importAirplaneCompary"},
                {title: "航班号", data: "importFlightNumber"},
                {title: "实际离港日期", data: "actualTime"},
                //{title: "订舱方", data: "orderInfo"},
                //{title:'订舱号',data:"orderId"},
                {title:'品名',data:"chineseItemName"},
                //{title:'报关单号',data:"chineseCargo"},
                {title:'操作员',data:"operator"},
                {title:'录入时间',data:"createTime"},
                {title:'最新状态',data:"businessStatus"}
            ],
            columnDefs: [
                {
                    orderable: false,
                    targets: 0
                },
                {
                    "render": function (data, type, full, meta) {

                        if ($.string.isNullOrEmpty(data))
                            return "";
                        else
                            return type === 'display' && data.length > 30 ?
                                '<span title="' + data + '">' + data + '</span>' :
                                data;
                    },
                    targets: [1, 2, 3, 4, 5, 6, 7,8,9,10]
                }
            ],
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

                }
            ],
            select: {
                style: 'multi',//选中多行
                selector: 'td:first-child'//选中效果仅对第一列有效
            }

        });
    }
    //加载下拉框
    function askDataAndBind(url,idData,textData,selName) {
        $.ajax({
            url:getContextPath()+url,
            type:'POST',
            data:{},
            success:function (data) {
          //      console.log(data);
                data=JSON.parse(data);
                var arr=[{'id':' ','text':' '}];
                for(i=0;i<data.length;i++){
                    arr.push({'id':data[i][idData],'text':data[i][textData]});
                }
                console.log(arr);
                $('.AIRimport').find(selName).select2({
                    data:arr,
                    placeholder:''
                });
            }
        })
    }
    //初始化接单下拉框
    function getOrderInitSelect(){
        //输单 客服2 客服3  客服1
        AIRimport.askDataAndBind('/airBillCommonController/getUserByDutiesCode.do?code=customerService&type=员工','userId','username','#ordersForm select[name="customerService1"],#ordersForm select[name="customerService2"],#ordersForm select[name="customerService3"]');
        //客服1
   //   initSelect2FromRedis("ordersForm", "customerService1", "redisController/listIdNameByName.do?name=employee", "{}", "servicePersonId", "servicePersonId");
        //销售2 客服
   // 	initSelect2FromRedis("ordersForm", "customerService2", "redisController/listIdNameByName.do?name=employee", "{}", "servicePersonId", "servicePersonId");
        //销售3
   //   initSelect2FromRedis("ordersForm", "customerService3", "redisController/listIdNameByName.do?name=employee", "{}", "servicePersonId", "servicePersonId");
    	//商务
    	 AIRimport.askDataAndBind('airBillCommonController/getUserByDutiesCode.do?code=business&type=员工','userId','username','#orders select[name="businessManId"]');
        //操作
        AIRimport.askDataAndBind('airBillCommonController/getUserByDutiesCode.do?code=operator&type=员工','userId','username','#orders select[name="operatorId"]');
        //调度
        AIRimport.askDataAndBind('airBillCommonController/getUserByDutiesCode.do?code=dispatch&type=员工','userId','username','#orders select[name="dispatchId"]');
		//委托人
     /*   $.ajax({
                type:'post',
                url: getContextPath() + 'saleCustomerEmployee/listByNew.do',
                data:function(){
	                 var data={"start":0,"length":1000};
	                 data["keys"]=JSON.stringify({"operatorLeader":""});
	                 return data;
                	}(),
                success:function(data){
                   data=JSON.parse(data);
                   data=data.aaData;
                    $('.AIRimport div.clientDetail').find('tr.newTRMT').remove();
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
                		$tr.appendTo('.AIRimport div.clientDetail table>tbody');
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
                data=data.sort(AIRimport.compare("port_code"));
                $('.AIRimport div.ZHG').find('tr.newTR').remove();
                var optArr='<option data-detail="" value=""></option>';
                AIRimport.carryArr=[];
                for(var key=0;key<data.length;key++){
                    optArr=optArr+"<option data-detail='"+JSON.stringify(data[key])+"' value='"+data[key]["port_code"]+"'>"+data[key]['port_code']+" | "+data[key]['port_name']+"("+data[key]['port_name_cn']+"</option>";
                }
                $('.AIRimport .carryArr').append(optArr).select();
            }
        });
    //卸货港
	    $.ajax({
	        type:'post',
	        url: getContextPath() +'redisController/listIdObjectByname.do?name=basedataPort_country_ap',
	        data:{},
	        success:function(data){
	            data=JSON.parse(data);
	            $('.AIRimport div.loadPort').find('tr.newTRMT').remove();
	            var optArr='<option data-detail="" value=""></option>';
	            AIRimport.load=[];
	            for(var key in data){
	            	optArr=optArr+"<option data-detail='"+JSON.stringify(data[key])+"' value='"+data[key]['port_code']+"'>"+data[key]['port_code']+" | "+data[key]['port_name']+"("+data[key]['port_name_cn']+"</option>";
	            }
	            $('.AIRimport .loadingPort').append(optArr).select();
	         }
	    });
    //目的港
	    $.ajax({
	        type:'post',
	        url: getContextPath() +'redisController/listIdObjectByname.do?name=basedataPort_country_ap',
	        data:{},
	        success:function(data){
	            data=JSON.parse(data);
	            $('.AIRimport div.MDD').find('tr.newTRMT').remove();
	            var optArr='<option data-detail="" value=""></option>';
	            AIRimport.MDport=[];
	            for(var key in data){
                    optArr=optArr+"<option data-detail='"+JSON.stringify(data[key])+"' value='"+data[key]['port_code']+"'>"+data[key]['port_code']+" | "+data[key]['port_name']+"("+data[key]['port_name_cn']+")</option>";
	            }
	            $('.AIRimport .MDport').append(optArr).select();
	         }
	    });
	//航空公司
	$.ajax({
	        type:'post',
	        url: getContextPath() + '/redisController/listIdObjectByname.do?name=basedataAirline_detail',
	        data:{},
	        success:function(data){
	            data=JSON.parse(data);
	            $('.AIRimport div.HKGS').find('tr.newTRMT').remove();
                var optArr='<option data-detail="" value=""></option>';
                AIRimport.airCompany=[];
	            for(var key in data){
	                //airline_name 中文名     airline_name_cn 简称
                    optArr=optArr+"<option data-detail='"+JSON.stringify(data[key])+"' value='"+data[key]['iata_designator']+"'>"+data[key]['iata_designator']+" | "+data[key]['icao_designator']+" | "+data[key]['airline_name']+"</option>";
	               }
	            $('.AIRimport .airLine').append(optArr).select();
	         }
	    });
	//付款方式
    $.ajax({
        type: 'post',
        url: getContextPath() + '/redisController/listIdObjectByname.do?name=basedataCommonSet_53_detail',
        data: {},
        success: function (data) {
            //    console.log(data);
            //  var arr=[];
            data = JSON.parse(data);
            //  console.log(data);
            $(".AIRimport #select_1").empty();
            $(".AIRimport #select_1").append("<option value=''></option>");
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    $(".AIRimport #select_1").append("<option value='" + data[key]['code'] + "' data-input='" + data[key]['cn_name'] + "'>" + data[key]['code'] + "</option>");
                }
            }
            //   console.log($("#HYTD select[name='payMethod']"));
        }
    });
    //费用基础数据加载
	/*// 往来单位  应付
        $.ajax({
            url:getContextPath()+'/saleSupplier/listByPageSelect.do?',
            type:'POST',
            data:{'keys':{},'start':0,'length':10000},
            success:function (data) {
                data=JSON.parse(data);
                console.log(data['aaData']);
                data=data['aaData'];
                AIRimport.customerNameSel=[{'id':' ','text':''}];
                for(var i=0;i<data.length;i++){
                    AIRimport.customerNameSel.push({'id':data[i]['customerCode'],'text':data[i]['customerNameCn']});
                    //  FCLpayExpense.customerNameSel.push({'id':data[i]['customerCode']+'|'+ data[i]['customerNameCn'],'text':data[i]['customerNameCn']})
                }
                console.log(AIRimport.customerNameSel);
            }
        });*/
        //请求供应商 应收 往来单位
/*        $.ajax({
            url:getContextPath()+'saleCustomer/listByKeys.do?',
            type:'POST',
            data:JSON.stringify({"keys":{}}),
            success:function (data) {
                console.log(data);
                data=JSON.parse(data);
                FCLexport.CorrespondentUnit=[{'id':' ','text':''}];
                for(var i=0;i<data.length;i++){
                    FCLexport.CorrespondentUnit.push({'id':data[i]['customerCode'],'text':data[i]['customerNameCn']})
                }
                console.log(FCLexport.CorrespondentUnit);
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
                AIRimport.optionCurrency=[{'id':' ','text':''}];
                for(var i=0;i<data.length;i++){
                    var d=data[i];
                    for(var key in d){
                        var  currency=d[key];
                        AIRimport.optionCurrency.push({"id":d[key],"text":d[key]});
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
                AIRimport.FeiYongDaiMa=[{'id':' ','text':''}];
                $.each(data, function (i, a) {
                    //     console.log(i + '**' + a);
                    AIRimport.FeiYongDaiMa.push({'id': a, 'text': a});
                })
                console.log(AIRimport.FeiYongDaiMa);
            }
        });
        //贸易类型
        $.ajax({
            type:'post',
            url: getContextPath() + '/redisController/listIdObjectByname.do?name=basedataCommonSet_54_detail',
            data:{},
            success:function(data){
                data=JSON.parse(data);
                for(var key=0;key<data.length;key++){
                    receivingMode.push({'id':key,'text':data[key]['code']+' | '+data[key]['cn_name']});
                }
                $('.AIRimport .tradeTypeSel').select2({
                    data:receivingMode,
                    placeholder:''
                })
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
                $('.AIRimport #imdeclare select.customsBrokerSel,' +
                    '.AIRimport #changeORD select.customsBrokerSel,'+
                    '.AIRimport #changeORD select[name ="clearancePartyId"],' +
                    '.AIRimport #changeORD select[name ="threePartyId"]').select2({
                    data:customsBroker,
                    placeholder:''
                })
            }
        });
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
                $('.AIRimport #imdeclare select.exportPortSel').select2({
                    data:selData
                })
            }
        });
        //申报海关
        $.ajax({
            type: 'post',
            url: getContextPath() + '/redisController/listIdObjectByname.do?name=basedataCommonSet_59_detail',
            data: {},
            success: function (data) {
                data = JSON.parse(data);
                $(".AIRimport #select_declarationPort").empty();
                $(".AIRimport #select_declarationPort").append("<option value=''></option>");
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        $(".AIRimport #select_declarationPort").append("<option value='" + data[key]['cn_name'] + "'>" + data[key]['code'] + '|' + data[key]['cn_name'] + "</option>");
                    }
                }
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
                $(".AIRimport #select_4").empty();
                $(".AIRimport #select_4").append("<option value=''></option>");
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        var arr = data[key].split('|');
                        var name = arr[1];
                        $(".AIRimport #select_4").append("<option>" + name + "</option>");
                    }
                }
            }
        });
        //应付费用 往来单位
            AIRimport.AIRIntercourUnit_table=$('.AIRimport div#AIRIntercourseUnitModal table#IntercourseUnitTable').DataTable({
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
                        search_data=$('.AIRimport div#AIRIntercourseUnitModal form#IntercourseUnitForm').serializeObject();
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
            AIRimport.AIRReceivableUnit_table=$('.AIRimport div#AIRReceivableUnitModal table#ReceivableUnitTable').DataTable({
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
                    "url":getContextPath()+'saleCustomer/listByKeys.do?',
                    "data":function(d){
                        search_data=$('.AIRimport div#AIRReceivableUnitModal form#ReceivableUnitForm').serializeObject();
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
        InitEntrClientDetail();//委托人初始化
    }
    var AIRimportClient_table;
    function InitEntrClientDetail() {
       //     alert('委托人datatable初始化');
            AIRimport.AIRimportClient_table=$('.AIRimport div#importEntrustModal table#clientTable').DataTable({
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
                auroWidth:true,
                scrollX:true,
               scrollY:calcDataTableHeight(),
                colReorder:true,
                destroy:true,
                dom:'<"top">rt<"bottom"flip><"clear">',
                ajax:{
                    "type":"POST",
                    "url":getContextPath() + 'saleCustomerEmployee/listByNewBusiness.do',
                    "data":function (d) {
                        search_data=$('.AIRimport div#importEntrustModal form#importEntrustForm').serializeObject();
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
                select:{
                    style:'multi',                 //选中多行
                    selector:'td:first-child'   //选中效果仅对第一列有效
                },
                initCompltet:function () {
                    
                }
            });
        }
	//委托人赋值
	/*function getEntrustButton(){
		var selRow=AIRimportClient_table.rows('.selected').data();
		console.log(selRow.length);
		if(selRow.length<1){
			$('.AIRimport div#importEntrustModal').modal('hide');
		}else if(selRow.length>1){
			alert('仅能选择一条记录');
		}else{
			console.log(selRow);
			var customerCode=selRow[0]["customerCode"];
			var customerNameCn=selRow[0]["customerNameCn"];
			var salesmanName=selRow[0]["salesmanName"];
			var servicePersonName=selRow[0]["servicePersonName"];
			$('.AIRimport div#orders input[name="customerCode"]').val(customerCode);
			$('.AIRimport div#orders input[name="customerName"]').val(customerNameCn);
			$('.AIRimport div#orders input[name="salemanName"]').val(salesmanName);
			$('.AIRimport div#orders input[name="customerService1"]').val(servicePersonName);
			$('.AIRimport div#importEntrustModal').modal('hide');
		}
	}*/
	//委托人模态框查询
	function entrustSearch(){
		AIRimport.AIRimportClient_table.ajax.reload();
	}
	//委托人模态框重置
	function entrustReset(){
		$('#importEntrustForm')[0].reset();
		AIRimport.AIRimportClient_table.ajax.reload();
	}
    //业务查询刷新按钮
    function datatableImportRefresh(){
    	AIRimport_table.ajax.reload();
    }
  //打印show模态框
    function showPrint(a) {
        if(a==1){
            var selRow=AIRimport_table.rows('.selected').data();
            if(selRow.length<1){
                callAlert('请选择一条记录!');
            }else if(selRow.length>1){
                callAlert('仅能操作一条记录!');
            }else{
                //console.log(selRow[0].billId);
                $('.AIRimport div#print').find('div.modal-body button.ajaxAsk[name="print"]').attr('billImportId',selRow[0].billImportId);
                $('.AIRimport div#print').find('div.modal-body button[name="showPrint"]').attr('billImportId',selRow[0].billImportId);
                $('.AIRimport div#print').find('div.modal-body button.ajaxAsk[name="previewButton"]').attr('billImportId',selRow[0].billImportId);
                //$('.AIRimport div#printImport').find('div.modal-body button.ajaxAsk[name="print"]').attr('billImportId',selRow[0].billImportId);
                $('.AIRimport #print').modal('show');//现实模态框
            }
        }else{
            //console.log($('.FCLexport ul.Big>li.FCL.active').attr('billid'));
            $('.AIRimport div#print').find('div.modal-body button.ajaxAsk[name="print"]').attr('billImportId',$('.AIRimport ul.Big>li.active').attr('billId'));
            $('.AIRimport div#print').find('div.modal-body button[name="showPrint"]').attr('billImportId',$('.AIRimport ul.Big>li.active').attr('billId'));
            $('.AIRimport div#print').find('div.modal-body button.ajaxAsk[name="previewButton"]').attr('billImportId',$('.AIRimport ul.Big>li.active').attr('billId'));
            //$('.AIRimport div#print').find('div.modal-body button.ajaxAsk[name="print"]').attr('billImportId',$('.AIRimport ul.Big>li.query.active').attr('billImportId'));
           // $('.FCLexport div#importResultsFCLexportModal').find('div.modal-footer input.ajaxAsk').attr('billId',$('.FCLexport ul.Big>li.FCL.active').attr('billid'));
            $('.AIRimport #print').modal('show');//现实模态框
        }
    }
    //打印
    function print(d){
        var billImportId=$(d).attr('billImportId');
        var saveName=$(d).attr('saveName');
        window.open(getPrintContextPath()+"/stimulsoft_viewerfx?stimulsoft_report_key=seawin/"+saveName+"&billImportId="+billImportId);
    }
    //打印测试
    function print1(d){
    	//报表名 参数名 参数值
    	var billImportId=$(d).attr('billImportId');
        var saveName=$(d).attr('saveName');
        printUniversal("billImportId",billImportId,"");
    }
    /*
     *
     * paramname 参数名字 paramvalue 参数值 报表名 Reportname
     */
    function printUniversal(paramname,paramvalue,Reportname){
    	$.ajax({
            type: 'post',
            url: getPrintContextPath() + 'test/print',
            data: {"reportName":Reportname,"varValue":paramvalue,"reportName":Reportname},
            success: function (data) {
                
            }
        });
    }
  //跟踪页面切换请求数据
	function AIRTrackingDetail(id,num){
		changeTrack(num);
        switch(Number(num)){

            //状态跟踪
            case 0:
                // alert('状态跟踪');
                break;

            //二程跟踪
            case 1:
                // alert('二程跟踪');
                AirImportSecondTrack.askData(id,"空运进口","AIRimport");
                break;
        }
		/*进口没有流程跟踪
		switch(Number(num)){
			//流程跟踪
			case 0:
			    //alert('流程跟踪');
				AirImportBusinessTrack.showBusinessTrack("AIRimport", id, "空运进口");
			    break;
			    
			//状态跟踪
			case 1:
			   // alert('状态跟踪');
			    break;
			    
			//二程跟踪
			case 2:
			   // alert('二程跟踪');
				AirImportSecondTrack.askData(id,"空运进口","AIRimport");
			    break;
		}*/
	}
    function rightClick() {
        $.contextMenu({
            selector: '#customsBillTable tbody tr',
            callback: function (key, options) {
                //var row_data = customsBill_table.rows(options.$trigger[0]).data()[0];
                switch (key) {
                    case "Add"://增加一条数据
                        addcustomsBill();
                        break;
                    case "Delete"://删除该节点
                        $("#customsBillTable tr.selected").removeClass("selected").find("input[class=checkchild]").prop("checked", false);//把其他行取消选中；
                        customsBill_table.row(this).select();//选中该行selected
                        $(this).find("input[class=checkchild]").prop("checked", true);//checkbox选中
                        deletecustomsBill();
                        break;
                    case "Edit"://编辑该节点
                        $("#customsBillTable tr.selected").removeClass("selected").find("input[class=checkchild]").prop("checked", false);//把其他行取消选中；
                        customsBill_table.row(this).select();//选中该行selected
                        $(this).find("input[class=checkchild]").prop("checked", true);//checkbox选中
                        editcustomsBill();
                        break;
                    default:
                        options.$trigger.removeClass("selected").find("input[class=checkchild]").prop("checked", false);;//取消选择selected
                }
            },
            items: {
                "Edit": {name: "修改", icon: "edit"},
                // "cut": {name: "Cut", icon: "cut"},
                // copy: {name: "Copy", icon: "copy"},
                // "paste": {name: "Paste", icon: "paste"},
                "Delete": {name: "删除", icon: "delete"},
                "Add": {name: "新增", icon: "add"},
                "sep1": "---------",
                "quit": {
                    name: "取消操作", icon: function () {
                        return 'context-menu-icon context-menu-icon-quit';
                    }
                }
            }
        });
    };
    /*//点击tr添加selected属性但不选中checkbox nowSel是最新点击的tr也就是（删除之外的）操作的执行者  删除的用selected作为选择器
    $('#AIRimportTable tbody').on('click', 'tr td', function () {
        $('#AIRimportTable tbody').find('tr').removeClass('nowSel');
        $(this).parents('tr').addClass('nowSel');
    });*/
    //锁定页面
    function lockFunction(){
    	$('.AIRimport').find('input,textarea').attr('disabled','disabled');//input框设置为只读
    	$('.AIRimport').find('select').attr('disabled','disabled');//select设置为只读
    	$('.AIRimport button.invalid').attr('disabled','disabled');//部分按钮禁用
    	$('.AIRimport div.invalid').removeAttr('onclick');//禁用一些新增、删除div
    	$('.AIRimport span.invalid').removeAttr('onclick');//禁用收、发货人span
    }
    //解锁页面
    function unlockFunction(){
    	$('.AIRimport').find('input,textarea').attr('disabled',false);//input框设置为只读
    	$('.AIRimport').find('select').attr('disabled',false);//select设置为只读
    	$('.AIRimport button.invalid').attr('disabled',false);//部分按钮禁用
    	//接单
    	$('.AIRimport span#majorConsignee').attr('onclick','AIRgetorder.majorConsignee(this)');
    	$('.AIRimport span#majorConsignor').attr('onclick','AIRgetorder.majorConsignor(this)');
    	$('.AIRimport div#getOrderAdd').attr('onclick',"AIRgetorder.addPayData('AIRimport')");
    	$('.AIRimport div#getOrderDelete').attr('onclick',"AIRgetorder.delPayData('AIRimport')");
    	//报关
    	$('.AIRimport div#declareAdd').attr('onclick',"importAirdeclare.addData('AIRimport')");
    	$('.AIRimport div#declareCopy').attr('onclick',"importAirdeclare.copyData('AIRimport')");
    	$('.AIRimport div#declareDelete').attr('onclick',"importAirdeclare.delData('AIRimport')");
    	//送货计划
    	//$('.AIRimport div#goodsEntrust').attr('onclick',"goodsPlan.entrust()");
    	$('.AIRimport div#goodsAdd').attr('onclick',"goodsPlan.addGoodsData('AIRimport')");
    	$('.AIRimport div#goodsCopy').attr('onclick',"goodsPlan.copyData('AIRimport')");
    	$('.AIRimport div#goodsDelete').attr('onclick',"goodsPlan.delGoodsData('AIRimport')");
    	//费用
    	$('.AIRimport div#addPayCostIm').attr('onclick',"AIRimportPayExpense.addData(this)");
    	$('.AIRimport div#deleteCostIm').attr('onclick',"AIRimportPayExpense.delData(this)");
    	$('.AIRimport div#addRecieveCostIm').attr('onclick',"AIRimportPayExpense.addData(this)");
    	$('.AIRimport div#deleteRecieveCostIm').attr('onclick',"AIRimportPayExpense.delData(this)");
    	//跟踪
    	$('.AIRimport div#addStatusIm').attr('onclick',"AirImportSecondTrack.addData('AIRimport')");
    	$('.AIRimport div#deleteStatusIm').attr('onclick',"AirImportSecondTrack.delData('AIRimport')");
    }
    function changeZLmain(num) {
        $('.AIRimport div.importDetailPage div.ZLmain>ul>li').removeClass('active');
        $('.AIRimport div.importDetailPage div.ZLmain>div.tab-content>div').removeClass('active');
        $('.AIRimport div.importDetailPage div.ZLmain>ul>li:eq('+num+')').addClass('active');
        $('.AIRimport div.importDetailPage div.ZLmain>div.tab-content>div:eq('+num+')').addClass('active');
    }
    function changeTrack(num) {
		$('.AIRimport div.trace>ul.myTab>li').removeClass('active');
		$('.AIRimport div.trace>div.tab-content>div').removeClass('active');
		$('.AIRimport div.trace>ul.myTab>li:eq(' + num + ')').addClass('active');
		$('.AIRimport div.trace>div.tab-content>div:eq(' + num + ')').addClass('active');
	}
    //页面切换请求数据
	function AIRimportDetail(id,num) {
			//判断是 总览home 输单entrust 订舱bookingSpace 做箱packings 提单billLading 报关imdeclare 费用imcost 跟踪tracing
		    AIRimport.changeZLmain(num);
		    //var importid=[];
            var selectedRow = AIRimport_table.rows('.selected').data();
            /*for(var i =0;i<selectedRow.length;i++){
                importid.push(selectedRow[i].billImportId);
            }*/
	//		alert(id+'*****'+num);
			switch(Number(num)){
				case 0:
				//	alert('总览')
					//总览
                    $.ajax({
                    type:'get',
                    url:'/SeawinWebappBase/airBillImportController/searchTotalInfoById.do',
                    data:{"id":id},
                    success:function(data){
                        var data=JSON.parse(data);
                        // 循环给表单赋值
                        $.each($('.AIRimport div.importDetailPage').find('form#imOverviewForm input'),function (i,input) {
                            if(typeof(data[$(this).attr("name")])=='undefined'||data[$(this).attr("name")]==''){
                            	$(this).val('');
                            }else{
                                $(this).val(data[$(this).attr("name")]);
                            }
                        });
                    }
                });
                AIRimportPayExpense.initPayFee(id,'AIRimport','air_bill_import');
					break;
				case 1:
					//接单
					AIRgetorder.askData(id);//根据id向后台请求输单数据r
					$(".AIRimport #importDetailPage .ZLmain>ul>li.active").attr('changed',false);
					AIRimport.setTimeInput();//初始化接单时间
					//AIRgetorder.initBaseData();//请求基础数据（包括下拉框里的内容）
					break;
				case 2:
					//换单
					AIRchangeorder.askData(id);
					break;
				case 3:
					//报关
					importAirdeclare.askData(id,'AIRimport');
					break;
				case 4:
					//送货计划
					goodsPlan.askData(id);//根据id向后台请求数据
					break;
				case 5:
                   //费用
					/*logisticsFee.initPayFee(id, 'AIRimport',
					'air_bill_import');*/
					AIRimportPayExpense.initPayFee(id,'AIRimport','air_bill_import');
					break;
				case 6:
					//跟踪
                    AirImportStatusTrack.getNumInfo(id,"AIRimport");
				//进口没有流程跟踪	AirImportBusinessTrack.showBusinessTrack("AIRimport",id, "空运进口");
					break;
		}
    }
	//编辑页面刷新
	function editRefresh(){
		isChange();
		var id=$('.AIRimport ul.Big li.active').attr('billId');
		var num=$('.AIRimport div.ZLmain ul.editList li.active').index();
	    switch(Number(num)){
				case 0:
				//	alert('总览')
					//总览
                    $.ajax({
                    type:'get',
                    url:'/SeawinWebappBase/airBillImportController/searchTotalInfoById.do',
                    data:{"id":id},
                    success:function(data){
                        var data=JSON.parse(data);
                        // 循环给表单赋值
                        $.each($('.AIRimport div.importDetailPage').find('form#imOverviewForm input'),function (i,input) {
                            if(typeof(data[$(this).attr("name")])=='undefined'||data[$(this).attr("name")]==''){
                            	
                            }else{
                                $(this).val(data[$(this).attr("name")]);
                            }
                        });
                    }
                })
					break;
				case 1:
					//接单
					AIRgetorder.askData(id);//根据id向后台请求输单数据r
					//AIRgetorder.initBaseData();//请求基础数据（包括下拉框里的内容）
					break;
				case 2:
					//换单
					AIRchangeorder.askData(id);
					break;
				case 3:
					//报关
					importAirdeclare.askData(id,'AIRimport');
					break;
				case 4:
					//送货计划
					goodsPlan.askData(id);//根据id向后台请求数据
					break;
				case 5:
                   //费用
					logisticsFee.initPayFee(id, 'AIRimport',
					'air_bill_import');
					break;
				case 6:
					//跟踪
					AirImportBusinessTrack.showBusinessTrack("AIRimport",id, "空运进口");
					break;
		}
	
	}
	//判断页面是否修改
	function isChange() {
   //     alert('*******');
        if($('.AIRimport ul.Big').find('li.active').index()==0){
        	
        }else if($('.AIRimport div.ZLmain>ul.nav-tabs>li.active').index()==0){
        	
        }else if($('.AIRimport div.ZLmain>ul.nav-tabs').find('li.active').attr('changed')=='false'){
        	
         }else{
            if(confirm("是否要保存您的修改?")){
                //保存数据
                AIRimport.airImportSave();
            }else{
                $('.AIRimport div.ZLmain>ul.nav-tabs').find('li.active').attr('changed',false);
            }
        }
    }
	//页面保存
    function airImportSave() {
        $("#orders .select2-selection--single").removeClass("error");
        //获取billId
        var liId = $('.AIRimport ul.Big li.active').attr('billid');
        $("#importDetailPage .ZLmain>ul>li.active").attr('changed',false);
        //获取当前li
       var num= $("#importDetailPage .ZLmain>ul>li.active").index()+1;
       var trackSub = $(".AIRimport #myTab li.active").index() + 1;
        switch (num) {
            case 2:
             //   alert('点击了接单保存');
                var checkUpBill=$('.AIRimport #ordersForm').valid();
                /*if(checkUpBill==false){
                	return;
                }
                else{
                	AIRgetorder.saveGetorder(liId);
                }*/
                AIRgetorder.saveGetorder(liId);
                //AIRgetorder.saveGetorder(liId);
                break;
            case 3:
                AIRchangeorder.saveChangeorder(liId);
                break;
            case 4:
            	//报关页面保存
            	importAirdeclare.saveData('AIRimport');
                break;
            case 5:
            	//送货计划保存
            	goodsPlan.savePlan(liId);
                break;
            case 6:
            	//费用
                AIRimportPayExpense.saveData();
                break;
            case 7:
            	// 跟踪保存
    			if (trackSub == 1) {
    				// 流程跟踪
    				AirImportBusinessTrack.saveBusinessTrack("AIRimport");
    			} else if (trackSub == 2) {
    				// 状态跟踪
    				
    			} else {
    				// 二程跟踪
    				AirImportSecondTrack.saveData(liId,"空运进口","AIRimport");
    			}
                break;
        }
    }
    //关闭DIV
    function closeDetail(id){
    	 $('.AIRimport div'+id).css('display','none');
    }
    //数组排序 对象中属性
    function compare(property){
    	return function(obj1,obj2){
    		var value1=obj1[property];
    		var value2=obj2[property];
    		return value1.localeCompare(value2);
    	}
    }
  //上传附件
    function uploadFile (){
        var businessTable="air_bill_import";
        var fileType="正本";
        var modelName="airImport";
        var rowData=AIRimport_table.rows('.selected').data()[0];
        var id =rowData.billImportId;
        //var id = $(FCLexport.ULname).find('li.active').attr('billid');
        $Form = $(".AIRimport #fileUpload");
        var str=$('.AIRimport input#selectedFile').val();
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
                	AIRimport.listFileById();
                }
            });
            
        }
    }
	//查询附件信息
    function listFileById() {
        //这里要判断是哪里的附件查询   查询页面和详情页面共用此方法
        if($('.AIRimport ul.Big li.active').index()==0){
            //业务查询页面的附件按钮
            //DataTable返回的值
            var selectedRowData=AIRimport_table.rows('.selected').data();
            if(selectedRowData.length<1){
                callAlert('请选择一条记录！');
                return ;
            }else if(selectedRowData.length>1){
                callAlert('仅允许操作一条记录');
                return ;
            }else {

                var billId = selectedRowData[0].billImportId;
            }
        }else{
            //在详情页面附件
            var billId=$('.AIRimport ul.Big li.active').attr('billId');
        }
        if(billId){
            $('div#zlQtxxFjxx').modal('show');
            $.ajax({
                type:'post',
                url:getContextPath()+'/sysAttachment/listByPage.do',
                data:{'keys':'{businessId:'+billId+',businessTable:"air_bill_import"}','start':0,'length':10000},
                success:function (data) {
                    $('.AIRimport #zlQtxxFjxx #fileUpload table tbody').empty();
                    data=JSON.parse(data)['aaData'];
                    for(var i=0;i<data.length;i++){
                        var tr=' <tr attachmentId='+data[i]['attachmentId']+'>'+
                            '<td name="attachmentName"><a target="_blank" href='+data[i]['attachmentPath']+'>'+data[i]['attachmentName']+'</a></td>'+
                            '<td >'+
                            '<select onchange="AIRimport.saveFile(this)" name="documentType" class="optionDocumentType select2 select2-hidden-accessible"tabindex="-1" aria-hidden="true" style="width: 150px;">'+
                            '</select>'+
                            '</td>'+
                            '<td>'+data[i]['size']+'</td>'+
                            '<td>'+data[i]['createTime']+'</td>'+
                            '<td name="downloadNumber">'+data[i]['downloadNumber']+'</td>'+
                            '<td><input name="remarks" onchange="AIRimport.saveFile(this)" value='+data[i]['remarks']+'></td>'+
                            '</tr>';
                        $('.AIRimport #zlQtxxFjxx #fileUpload table tbody').append(tr);
                        $('.AIRimport #zlQtxxFjxx #fileUpload table tbody').find('tr:last .optionDocumentType').select2({
                            data: documentType,
                            placeholder:''
                        });
                        $('.AIRimport #zlQtxxFjxx #fileUpload table tbody').find('tr:last').find('select[name="documentType"]').val(data[i]['documentType']).trigger('change');
                    }
                }
            })
        }else{
            console.log('未获取到billId');
        }
    	//DataTable返回的值
     /*  旧版本     没有考虑详情页面的附件按钮
       var selectedRowData=AIRimport_table.rows('.selected').data();
        if(selectedRowData.length<1){
            callAlert('请选择一条记录！');
            return ;
        }else if(selectedRowData.length>1){
            callAlert('仅允许操作一条记录');
            return ;
        }else {
            $('div#zlQtxxFjxx').modal('show');
            var billId=selectedRowData[0].billImportId;
            $.ajax({
                type:'post',
                url:getContextPath()+'/sysAttachment/listByPage.do',
                data:{'keys':'{businessId:'+billId+',businessTable:"air_bill_import"}','start':0,'length':10000},
                success:function (data) {
                    $('.AIRimport #zlQtxxFjxx #fileUpload table tbody').empty();
                    data=JSON.parse(data)['aaData'];
                    for(var i=0;i<data.length;i++){
                        var tr=' <tr attachmentId='+data[i]['attachmentId']+'>'+
                            '<td name="attachmentName"><a target="_blank" href='+data[i]['attachmentPath']+'>'+data[i]['attachmentName']+'</a></td>'+
                            '<td >'+
                            '<select onchange="AIRimport.saveFile()" name="documentType" class="optionDocumentType select2 select2-hidden-accessible"tabindex="-1" aria-hidden="true" style="width: 150px;">'+
                            '</select>'+
                            '</td>'+
                            '<td>'+data[i]['size']+'</td>'+
                            '<td>'+data[i]['createTime']+'</td>'+
                            '<td name="downloadNumber">'+data[i]['downloadNumber']+'</td>'+
                            '<td><input name="remarks" onchange="AIRimport.saveFile()" value='+data[i]['remarks']+'></td>'+
                            '</tr>';
                        $('.AIRimport #zlQtxxFjxx #fileUpload table tbody').append(tr);
                        $('.AIRimport #zlQtxxFjxx #fileUpload table tbody').find('tr:last .optionDocumentType').select2({
                            data: documentType,
                            placeholder:''
                        });
                        $('.AIRimport #zlQtxxFjxx #fileUpload table tbody').find('tr:last').find('select[name="documentType"]').val(data[i]['documentType']).trigger('change');
                    }
                }
            })
        }*/

    }
    //删除上传文件
    function deleteFile(){
    	var a = $(".AIRimport #zlQtxxFjxx #fileUpload table tbody tr").hasClass("sel");
		if(!a){
			callAlert("请选择一个文件！");
		}else{
        var attachmentId=$('.AIRimport #zlQtxxFjxx #fileUpload table tbody tr.sel').attr('attachmentId');
        $.ajax({
            type: 'post',
            url: getContextPath() + '/sysAttachment/delete.do',
            data: {'attachmentIds':attachmentId,'modelName':'airImport'},
            success: function (data) {
                data=JSON.parse(data);
                AIRimport.listFileById();
                callAlert(data['message']);
            }
        });
		}
    }
    //下载上传文件
    function downloadFile(){
    	var a = $(".AIRimport #zlQtxxFjxx #fileUpload table tbody tr").hasClass("sel");
		if(!a){
			callAlert("请选择一个文件！");
		}else{
        var attachmentId=$('.AIRimport #zlQtxxFjxx #fileUpload table tbody tr.sel').attr('attachmentId');
        var downloadNumber=$('.AIRimport #zlQtxxFjxx #fileUpload table tbody tr.sel td[name="downloadNumber"]').text();
        var attachmentName=$('.AIRimport #zlQtxxFjxx #fileUpload table tbody tr.sel td[name="attachmentName"]').text();
        var modelName = "airImport";
        var url=getShipContextPath()+"downloader/downloadNumber.do?fileName="+attachmentName+'&modelName='+
            modelName+"&attachmentId="+attachmentId+"&downloadNumber="+downloadNumber;
        url=encodeURI(encodeURI(url)); //用了2次encodeURI
        window.location.href = url;
   //     AIRimport.listFileById();
        $('.AIRimport #zlQtxxFjxx #fileUpload table tbody tr.sel td[name="downloadNumber"]').text(Number(downloadNumber)+1);

        }
    }
    //保存文件修改
    function saveFile(d){
        $('.AIRimport div#zlQtxxFjxx  table tbody').find('tr').css('background','transparent').removeClass('sel');
        $(d).parent('td').parent('tr').css('background','lightblue').addClass('sel');
        var remarks=$('.AIRimport #zlQtxxFjxx #fileUpload table tbody tr.sel input[name="remarks"]').val();
        var documentType=$('.AIRimport #zlQtxxFjxx #fileUpload table tbody tr.sel select[name="documentType"]').val();
        var attachmentId=$('.AIRimport #zlQtxxFjxx #fileUpload table tbody tr.sel').attr('attachmentId');
        $.ajax({
            type: 'post',
            url: getContextPath() + '/sysAttachment/update.do',
            data: {'attachmentId':attachmentId,'remarks':remarks,'documentType':documentType},
            success: function (data) {
                data=JSON.parse(data);
               // callAlert(data['message']);
                //AIRexport.listFileById();
            }
        });
    }
    //总览页面 财务信息
    function financialModalShow(){
    	//var id=$('.AIRexport ul.Big li.active').attr('billid');
        $.ajax({
            url:getContextPath()+'airBillCommonController/getAirFinanceInfo.do',
            type:'POST',
            data:{'billId':$('.AIRimport ul.Big li.active').attr('billid'),'businessTable':'air_bill_import'},
            success:function (data) {
                console.log(data);
                if(data){
                    data=JSON.parse(data);
                    $('.AIRimport div#financeTC tbody input').each(function(){
                        if(data[$(this).attr('name')]){
                            $(this).val(data[$(this).attr('name')])
                        }else{
                            $(this).val(0);
                        }
                    });
                }else{
                    $('.AIRimport div#financeTC tbody input').each(function () {
                        $(this).val(0);
                    })
                }
            }
        })
    	
    	/*var USDpay=$('.AIRimport div.imcost div#imairExportPayable input#USDTotal').val();
    	var USDget=$('.AIRimport div.imcost div#expReceivable input#USDTotal').val();
    	var USDprofit=USDget-USDpay;
    	var RMBpay=$('.AIRimport div.imcost div#imairExportPayable input#RMBTotal').val();
    	var RMBget=$('.AIRimport div.imcost div#expReceivable input#RMBTotal').val();
    	var RMBprofit=RMBget-RMBpay;
    	//alert(USDget);
    	$('.AIRimport div#financeTC input#USDfinanceGet').val(USDget);
    	$('.AIRimport div#financeTC input#USDfinancePay').val(USDpay);
    	$('.AIRimport div#financeTC input#USDfinanceProfit').val(USDprofit);
    	$('.AIRimport div#financeTC input#RMBfinanceGet').val(RMBget);
    	$('.AIRimport div#financeTC input#RMBfinancePay').val(RMBpay);
    	$('.AIRimport div#financeTC input#RMBfinanceProfit').val(RMBprofit);*/
    	$('.AIRimport #financeTC').modal('show');
    }
    function copy(){
    	var selectedRowData=AIRimport_table.rows('.selected').data();
        //alert(selectedRowData.length);
        //console.log(selectedRowData);
        if(selectedRowData.length<1){
            callAlert('请选择一条记录！');
            return ;
        }else if(selectedRowData.length>1){
        	callAlert('只能复制一条记录！');
            return ;
        }else{
        	var id=selectedRowData[0].billImportId;
            //console.log(id);
        	$.ajax({
        		type:"post",
        		url:"/SeawinWebappBase/airBillCommonController/importCopy.do",
        		//async:true
        		data:{"id":id},
        		success:function(data){
        			callAlert('复制成功');
        			AIRimport_table.ajax.reload();//重新加载表单
        		}
        	});
        }
    }
    //完成提交按钮
    function lockPage(){
    	if(confirm('是否提交整票业务')){
    		var id=$('.AIRimport ul.Big li.active').attr('billId');
    	$.ajax({
    		type:"post",
    		url:"/SeawinWebappBase/airBillImportController/updateStatus.do",
    		data:{"id":id,"token":"完成"},
    		success:function(data){
    			callAlert('提交成功');
    			//$('.AIRimport div#successModal').modal('show');//显示操作完成模态框
    			$('.AIRimport').find('input,textarea').attr('disabled','disabled');//input框设置为只读
    			$('.AIRimport').find('select').attr('disabled','disabled');//select设置为只读
    		}
    	});
    	}else{
    		
    	}
    }
    //业务查询页面修改按钮
    function updateButton(){
    	var selRow=AIRimport_table.rows('.selected').data();
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
    			var billId=selRow[0].billImportId;
    			var flag = 0;//判断是否已经有该条业务的菜单
				for (var i = 0; i < $('.AIRimport ul.Big').find('li').length; i++) {
					if (billId == $($('.AIRimport ul.Big').find('li')[i]).attr('billId')) {
						flag++;
						} else {

						}
					}
				if(flag==0){
					var mbLNo=selRow[0].businessCode;//获取业务编号
                    $('.AIRimport ul.Big').find('li').removeClass('active');
                    $('.AIRimport ul.Big').append('<li role="presentation" class="active" billId='+billId+' businessStatus='+businessStatus+'> <a href="#importDetailPage" aria-controls="overview" role="tab" data-toggle="tab">进口-'+mbLNo+'<span class="glyphicon glyphicon-remove closeTab" closeTabid='+billId+' style="borderr-radius:50%;background:#4122e5;color:white;margin-left:5px;"></span></a></li>');
                    $('.AIRimport div.Big').find('>div.tab-pane').removeClass('active');
                    $('.AIRimport div.importDetailPage').addClass('active');
                    AIRimport.changeZLmain(0);
                    //向后台请求数据
                    AIRimportDetail(billId,0);
				}else{
					$('.AIRimport ul.Big').find('>li').removeClass('active');
                    $('.AIRimport div.Big').find('>div.tab-pane').removeClass('active');
                    $('.AIRimport ul.Big').find('li[billId="'+billId+'"]').addClass('active');
                    $('.AIRimport div.Big').find('>div.tab-pane#importDetailPage').addClass('active');
                    var num=$('.AIRimport ul.Big').find('li[billId="'+billId+'"]').attr('data-num');
                    AIRimportDetail(billId,num);	
				}
    	    }
    }
    }
    function nowtime(){//将当前时间转换成yyyymmdd格式
        var mydate = new Date();
        var str = "" + mydate.getFullYear();
        var mm = mydate.getMonth()+1
        if(mm>9){
            str +='-'+ mm;
        }
        else{
            str +="-0" + mm;
        }
        if(mm>9){
            str +='-'+ mydate.getDate();
        }
        else{
            str += "-0" + mydate.getDate();
        }
        return str;
    }
	return{
        nowtime:nowtime,
        AIRimportClient_table:AIRimportClient_table,
		AIRimportDetail:AIRimportDetail,
		imAddNew:imAddNew,
		imDoSearch:imDoSearch,
		imDelete:imDelete,
		showPrint : showPrint,
		print : print,
		AIRTrackingDetail:AIRTrackingDetail,
		changeTrack:changeTrack,
		airImportSave:airImportSave,
		closeDetail:closeDetail,
		compare:compare,
		print1:print1,
		printUniversal:printUniversal,
		documentType:documentType, //单证类型
		uploadFile:uploadFile,
		listFileById:listFileById,
        deleteFile:deleteFile,
        downloadFile:downloadFile,
        saveFile:saveFile,
        editRefresh:editRefresh,
        datatableImportRefresh:datatableImportRefresh,
        getOrderInitSelect:getOrderInitSelect,
        isChange:isChange,
        financialModalShow:financialModalShow,
        askDataAndBind:askDataAndBind,
        copy:copy,
        InitEntrClientDetail:InitEntrClientDetail,
        //getEntrustButton:getEntrustButton,
        entrustSearch:entrustSearch,
        entrustReset:entrustReset,
        lockPage:lockPage,
        lockFunction:lockFunction,
        unlockFunction:unlockFunction,
        updateButton:updateButton,
        setTimeInput:setTimeInput,
        initSelect2_AIRimport:initSelect2_AIRimport,
        changeZLmain:changeZLmain,
        AIRimport_table:AIRimport_table
	};
})();
$(function(){
    showButton();
	//附件上传模态框选中
    $('.AIRimport div#zlQtxxFjxx table tbody').on('click','tr td',function(){
        $('.AIRimport div#zlQtxxFjxx  table tbody').find('tr').css('background','transparent').removeClass('sel');
        $(this).parents('tr').css('background','lightblue').addClass('sel');
    });
    $('.AIRimport div.form-group input.startTime').on('click',function () {
        $(this).datepicker('setEndDate',$(this).parents('div.form-group').find('input.endTime').val());
    });
    $('.AIRimport div.form-group input.endTime').on('click',function () {
        $(this).datepicker('setStartDate',$(this).parents('div.form-group').find('input.startTime').val());
    });
    $('.AIRimport .startTime,.AIRimport .endTime,.AIRimport .Time').datepicker({
        autoclose: true,
        language:"zh-CN",//语言设置
        format: "yyyy-mm-dd"

    });
    AIRimport.setTimeInput();
    $(document.body).css('overflow','auto');
    //请求单证类型
    $.ajax({
        type: 'post',
        url: getContextPath() + '/redisController/listIdObjectByname.do?name=basedataCommonSet_45',
        data: {},
        success: function (data) {
            data = JSON.parse(data);
            //console.log(data);
            for(var i=0;i<data.length;i++){
                AIRimport.documentType.push({"id":data[i],"text":data[i]});
            }
        }
    });
    $(".AIRimport .select2").select2();
    //下拉框中加载数据
    AIRimport.initSelect2_AIRimport();
    //解决select2在弹开中不能搜素的问题
    $.fn.modal.Constructor.prototype.enforceFocus = function () {
    };
    //tab菜单点击图标删除菜单操作
    $('.AIRimport ul.Big').on('click','li span.closeTab',function(e){
        e.stopPropagation();
        e.preventDefault();
        var Tabid=$(this).attr('closeTabid');
        //  	console.log($(this).parents('li').hasClass('active'));
        if($(this).parents('li').hasClass('active')){
            //删除当前菜单   操作结束后主页面获取active
            $($(this).parents('ul').find('li')[0]).addClass('active');
            $($('.AIRimport div.Big>div')[0]).addClass('active');
            $(this).parents('li').remove();
            $($('.AIRimport div.Big>div')[1]).removeClass('active');

        }else{
            //直接删除即可
            $(this).parents('li').remove();
        }
        return false;
    })
    //监听其他条件变化
    $('select.otherConditions').on('change',function (e) {
        $(this).parent().find('input').attr('name',$(this).val());
    });
    //表单重置
    $('button.search_reset').on('click',function () {
        $('#importSearchForm')[0].reset();
        //初始化时间输入框
        AIRimport.setTimeInput();
        $('#importSearchForm').find('.select2-selection__rendered').attr('title','其他条件').text('其他条件');
        keysOption={};
        AIRimport.AIRimport_table.ajax.reload();
    })
    //全选
    $('body').on('click', '.AIRimport .checkall', function () {
        allSelection("AIRimport","AIRimportTable",AIRimport.AIRimport_table,this);
    });
    //点击第一格才能选中
    $('#AIRimportTable tbody').on('click', 'tr td:first-child', function () {
        selection1(AIRimport.AIRimport_table,this);
    });
    $('.AIRimport div#importEntrustModal').on('click','table#clientTable tr td',function(){
        $('.AIRimport div#importEntrustModal table#clientTable tr').css('background-color','transparent').removeClass('sel');
        $(this).parent('tr').css('background-color','lightblue').addClass('sel');
    });
    //委托人模态框 双击事件
    $('.AIRimport div#importEntrustModal').on('dblclick','table#clientTable tr td',function(){
        var selRow=AIRimport.AIRimportClient_table.rows('.sel').data();
        var customerCode=selRow[0]["customerCode"];
        var customerNameCn=selRow[0]["customerNameCn"];
        var salesmanName=selRow[0]["salesmanName"];
        var salesmanId=selRow[0]["salesmanId"];
        var servicePersonUserId=selRow[0]["servicePersonUserId"];
        $('.AIRimport div#orders input[name="customerCode"]').val(customerCode).trigger('change');
        $('.AIRimport div#orders input[name="customerId"]').val(selRow[0]['customerId']).trigger('change');
        $('.AIRimport div#orders input[name="customerName"]').val(customerNameCn).trigger('change');
        $('.AIRimport div#orders input[name="salemanName"]').val(salesmanName).trigger('change');
        $('.AIRimport div#orders input[name="salesmanId"]').val(salesmanId).trigger('change');
        $('.AIRimport div#orders select[name="customerService1"]').val(servicePersonUserId).trigger('change');

        //根据选中的委托人的不同   修改联系人信息
        AIRgetorder.getContactsByCustomerId(selRow[0]['customerId']);
        //根据选中的委托人的不同  修改合同协议
        AIRgetorder.getContractCode(selRow[0]['customerId']);
        $('.AIRimport div#importEntrustModal').modal('hide');
    });
    //双击一条记录，跳转到总览
    $('.AIRimport #AIRimportTable').on('dblclick','tbody tr',function(){
        var billId=$(this).find('input:checkbox').val();
        var businessStatus=$(this).find('td:last-child').text();
        var flag=0;
        console.log(businessStatus);
        for(var i=0;i<$('.AIRimport ul.Big').find('li').length;i++){
            if(billId==$($('.AIRimport ul.Big').find('li')[i]).attr('billId')){
                flag++;
            }else{

            }
        }
        if(flag==0){
            if(businessStatus=='完成'){
                //创建新的tab菜单
                var mbLNo=$($(this).find('td')[2]).text();//获取业务编号
                $('.AIRimport ul.Big').find('li').removeClass('active');
                $('.AIRimport ul.Big').append('<li role="presentation" class="active" billId='+billId+' businessStatus='+businessStatus+'> <a href="#importDetailPage" aria-controls="overview" role="tab" data-toggle="tab">进口-'+mbLNo+'<span class="glyphicon glyphicon-remove closeTab" closeTabid='+billId+' style="borderr-radius:50%;background:#4122e5;color:white;margin-left:5px;"></span></a></li>');
                $('.AIRimport div.Big').find('>div.tab-pane').removeClass('active');
                $('.AIRimport div.importDetailPage').addClass('active');
                AIRimport.lockFunction();
                AIRimport.changeZLmain(0);
                //向后台请求数据
                AIRimportDetail(billId,0);
            }else{
                //创建新的tab菜单
                var mbLNo=$($(this).find('td')[2]).text();//获取业务编号
                $('.AIRimport ul.Big').find('li').removeClass('active');
                $('.AIRimport ul.Big').append('<li role="presentation" class="active" billId='+billId+' businessStatus='+businessStatus+'> <a href="#importDetailPage" aria-controls="overview" role="tab" data-toggle="tab">进口-'+mbLNo+'<span class="glyphicon glyphicon-remove closeTab" closeTabid='+billId+' style="borderr-radius:50%;background:#4122e5;color:white;margin-left:5px;"></span></a></li>');
                $('.AIRimport div.Big').find('>div.tab-pane').removeClass('active');
                $('.AIRimport div.importDetailPage').addClass('active');
                AIRimport.unlockFunction();
                AIRimport.changeZLmain(0);
                //向后台请求数据
                AIRimport.AIRimportDetail(billId,0);
            }
        }else{
            if(businessStatus=='完成'){
                $('.AIRimport ul.Big').find('>li').removeClass('active');
                $('.AIRimport div.Big').find('>div.tab-pane').removeClass('active');
                $('.AIRimport ul.Big').find('li[billId="'+billId+'"]').addClass('active');
                $('.AIRimport div.Big').find('>div.tab-pane#importDetailPage').addClass('active');
                AIRimport.lockFunction();
                var num=$('.AIRimport ul.Big').find('li[billId="'+billId+'"]').attr('data-num');
                AIRimport.AIRimportDetail(billId,num);
            }else{
                $('.AIRimport ul.Big').find('>li').removeClass('active');
                $('.AIRimport div.Big').find('>div.tab-pane').removeClass('active');
                $('.AIRimport ul.Big').find('li[billId="'+billId+'"]').addClass('active');
                $('.AIRimport div.Big').find('>div.tab-pane#importDetailPage').addClass('active');
                AIRimport.unlockFunction();
                var num=$('.AIRimport ul.Big').find('li[billId="'+billId+'"]').attr('data-num');
                AIRimport.AIRimportDetail(billId,num);
            }

        }
    });
    //tab菜单样式切换
    $('.AIRimport ul.Big').on('click','li',function(e){
        billId=$(this).attr('billId');
        console.log(billId);
        e.stopPropagation();
        e.preventDefault();
        if($(this).hasClass('active')){

        }else{
            if($('.AIRimport ul.Big').find('li.active').attr('billid')){
                //	console.log('是业务菜单');
                var ind=$('.AIRimport div#detailPage div.ZLmain>ul>li.active').index();
                $('.AIRimport ul.Big').find('li.active').attr('data-num',ind);
            }else{
                //	console.log('是主菜单');
            }
            $('.AIRimport ul.Big').find('li').removeClass('active');
            $('.AIRimport div.Big>div').removeClass('active');
            $(this).addClass('active');
            //         console.log($(this).find('a').attr('href'))
            var tabPanelId=$(this).find('a').attr('href').split('#')[1];
            if($(this).attr('data-num')){
                //这里向后台请求数据    跟新页面   还要获取页面结束时所在的tab
                var num=$(this).attr('data-num');
                var businessStatus=$(this).attr('businessStatus');
                $('.AIRimport div.Big>div#'+tabPanelId).addClass('active');
                $('.AIRimport div#detailPage div.ZLmain>ul>li').removeClass('active');
                $('.AIRimport div#detailPage div.ZLmain>div>div').removeClass('active');
                $('.AIRimport div#detailPage div.ZLmain>ul>li:eq('+num+')').addClass('active');
                $('.AIRimport div#detailPage div.ZLmain>div>div:eq('+num+')').addClass('active');
                if(businessStatus=='完成'){
                    AIRimport.lockFunction();
                }else{
                    AIRimport.unlockFunction();
                }
                 AIRimport.AIRimportDetail(billId,num);
            }else{
                //    			console.log('是主菜单');
                AIRimport.AIRimport_table.ajax.reload();
                $('.AIRimport div.Big>div#'+tabPanelId).addClass('active');
            }

        }
    })
    // 设置校验规则
    $().ready(function validateUpBillForm() {
        UpBill_Validator = $(".AIRimport #ordersForm").validate({
            ignore : '',
            errorElement : 'span',
            errorClass : 'error',
            rules : {
                customerCode : {
                    required : true,
                    //maxlength : 20
                },
                customerName : {
                    required : true,
                    //maxlength : 20
                },
                salemanName : {
                    required : true,
                    maxlength : 20
                },
               /* customerService1 : { 客服1
                    required : true,
                    maxlength : 20
                },*/
                takingTime : {
                    required : true,
                    maxlength : 20
                },
               /* customerService2 : {
                    required : true,
                    maxlength : 20
                },*/
                consigneeCode : {
                    required : true,
                    //maxlength : 20
                },
                consigneerName : {
                    required : true,
                    //maxlength : 20
                },
                /*contractCode : {
                    required : true,
                    maxlength : 20
                },*/
               /* 客户编号据说要去除
                clientCode : {
                    required : true,
                    maxlength : 20
                },*/
                businessMan: {
                    required : true,
                    maxlength : 20
                },
                operator: {
                    required : true,
                    maxlength : 20
                },
                loadingPortCode : {
                    required : true,
                    maxlength : 20
                },
                loadingPortName : {
                    required : true,
                    maxlength : 20
                },
                expectTime: {
                    required : true,
                    maxlength : 20
                },
                dischargePortCode : {
                    required : true,
                    maxlength : 20
                },
                dischargePortName : {
                    required : true,
                    maxlength : 20
                }
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
            $(".AIRimport #printSelect_1").empty();
            $(".AIRimport #printSelect_1").append("<option value=''></option>");
            for (var i = 0; i < data.length; i++) {
                for (var key in data[i]) {
                    $(".AIRimport #printSelect_1").append("<option value='" + key + "'>" + data[i][key] + "</option>");
                }
            }
        }
    });
    //点击总览等菜单切换页面  向后台请求数据
    $('.AIRimport div.Big div.ZLmain').on('click','>ul>li',function(){
        AIRimport.isChange();
        var id=$('.AIRimport ul.Big li.active').attr('billid');
        var num=$(this).index();
        AIRimport.AIRimportDetail(id,num);
    });
    // 点击跟踪里面的子菜单切换页面 向后台请求数据
    $('.AIRimport #tracing').on('click','>ul>li',function(){

        var id = $('.AIRimport ul.Big li.active').attr('billid');
        var num = $(this).index();
        AIRimport.AIRTrackingDetail(id,num);
    });
})