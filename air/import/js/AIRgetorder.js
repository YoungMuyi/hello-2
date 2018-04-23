//@ sourceURL=AIRgetorder.js
var AIRgetorder=(function(){
	var data={};//一个存放数据的对象
	var Operator=[];
	//data['airGoodsInfoList']=[];
	// 根据id请求输单数据
	function askData(id) {
		// 向后台请求数据
		$.ajax({
					type : 'post',
					url : '/SeawinWebappBase/airBillImportController/searchTotalInfoById.do',
					data : {
						"id" : id
					},
					async: false,//同步
					success : function(data) {
						var data = JSON.parse(data);
						AIRgetorder.data=data;
						console.log(data);
						// 循环给表单赋值
						$.each($('.AIRimport form#ordersForm').find('input,textarea,select'),function(i, input) {
									if ($(this).attr("name")) {
												$(this).val(data[$(this).attr("name")]).trigger('change');
									} else {
												// 不需要替换
									}
								});
						var tr='';
	            	    $('.AIRimport div#HSCodeInfo table tbody').empty();
	            	    console.log(data['airGoodsInfoList'].length);
	            	    console.log(data['airGoodsInfoList']);
	            	    for(var i=0;i<data['airGoodsInfoList'].length;i++){
	            		 var sysData=data['airGoodsInfoList'][i];
	            	    tr+='<tr exchange_operate class="active">'+
                            '<td></td>'+
                            '<td><input class="form-control" type="text" name="customeId" value='+sysData['customeId']+'></td>'+
                            '<td>'+
                            '<input class="form-control" type="text" name="number" value='+sysData['number']+'>'+
                            '</td>'+
                            '<td>'+
                            '<input class="form-control" name="gross" value='+sysData['gross']+'>'+
                            '</td>'+
                            '<td>'+
                            '<input class="form-control" name="volume" value='+sysData['volume']+'>'+
                            '</td>'+
                            '<td>'+
                            '<input class="form-control" name="volumeWeight" value='+sysData['volumeWeight']+'>'+
                            '</td>'+
                            '<td>'+
                            '<input class="form-control" name="englishGoodsName" value='+sysData['englishGoodsName']+'>'+
                            '</td>'+
                            '<td>'+
                            '<input class="form-control" name="chineseGoodsName" value='+sysData['chineseGoodsName']+'>'+
                            '</td>'+
                            '<td>'+
                            '<input class="form-control" name="remarks" value='+sysData['remarks']+'>'+
                            '<input class="form-control" type="text" name="goodsInfoId" value='+sysData['goodsInfoId']+' style="display:none;">'+
                            '</td>'+
                        '</tr>';
                        //console.log(tr);
                      } 
                      	$('.AIRimport div#HSCodeInfo table tbody').append(tr);
                     	reorderByCon('AIRimport');

                     	AIRgetorder.getContactsByCustomerId(data['customerId'],data['contact'],true);

                        $('.AIRimport div.ZLmain>ul.nav-tabs>li.importGetOrder').attr('changed',false);

					}
				})
	}
	//加载初始数据
	function initBaseData(){
		//装货港
		$.ajax({
        type:'post',
        url: getContextPath() +'redisController/listIdObjectByname.do?name=basedataPort_country',
        data:{},
        success:function(data){
            data=JSON.parse(data);
            var data=data.sort(AIRimport.compare("port_code"));
            $('.AIRimport div.ZHG').find('tr.newTR').remove();
            var trArr='';
            AIRimport.carryArr=[];
            for(var key=0;key<data.length;key++){
                trArr=trArr+'<tr class="newTR">' +
                    '<td  name="port_code">'+data[key]['port_code']+'</td>' +
                    '<td name="port_name">'+data[key]['port_name']+'</td>' +
                    '<td name="port_name_cn">'+data[key]['port_name_cn']+'</td>' +
                    '<td name="en_name">'+data[key]['en_name']+'</td>' +
                    '<td name="cn_name">'+data[key]['cn_name']+'</td>' +
                    '</tr>';
                AIRimport.carryArr.push({'id':key,'text':data[key]['port_code']+' | '+data[key]['port_name']+'('+data[key]['port_name_cn']+')'});
            }
            $('.carryArr').select2({
                data:AIRimport.carryArr,
                placeholder:''
            })
            $(trArr).appendTo($('.AIRimport div.ZHG table>tbody'));
        }
    });
    //卸货港
	/*    $.ajax({
	        type:'post',
	        url: getContextPath() + '/redisController/listIdObjectByname.do?name=basedataWharf_port',
	        data:{},
	        success:function(data){
	            data=JSON.parse(data);
	            $('.AIRimport div.loadPort').find('tr.newTRMT').remove();
	            var trArr='';
	            AIRimport.load=[];
	            for(var key in data){
	            	trArr=trArr+'<tr class="newTRMT">' +
                    '<td  name="wharf_id">'+data[key]['wharf_id']+'</td>' +
                    '<td name="wharf_code">'+data[key]['wharf_code']+'</td>' +
                    '<td name="country_name">'+data[key]['country_name']+'</td>' +
                    '<td name="name_cn">'+data[key]['name_cn']+'</td>' +
                    '<td name="name_en">'+data[key]['name_en']+'</td>' +
                    '</tr>';
                    AIRimport.load.push({'id':key,'text':data[key]['wharf_id']+' | '+data[key]['wharf_code']+' | '+data[key]['country_name']+' | '+data[key]['name_cn']});
	                }
	            $('.AIRimport .loadingPort').select2({
                data:AIRimport.load,
                placeholder:''
                })
	            $(trArr).appendTo($('.AIRimport div.loadPort table>tbody'));
	         }
	    });*/
    //目的港
	    $.ajax({
	        type:'post',
	        url: getContextPath() + '/redisController/listIdObjectByname.do?name=basedataWharf_port',
	        data:{},
	        success:function(data){
	            data=JSON.parse(data);
	            $('.AIRimport div.MDD').find('tr.newTRMT').remove();
	            var trArr='';
	            AIRimport.MDport=[];
	            for(var key in data){
	            	trArr=trArr+'<tr class="newTRMT">' +
                    '<td  name="wharf_id">'+data[key]['wharf_id']+'</td>' +
                    '<td name="wharf_code">'+data[key]['wharf_code']+'</td>' +
                    '<td name="country_name">'+data[key]['country_name']+'</td>' +
                    '<td name="name_cn">'+data[key]['name_cn']+'</td>' +
                    '<td name="name_en">'+data[key]['name_en']+'</td>' +
                    '</tr>';
                    AIRimport.MDport.push({'id':key,'text':data[key]['wharf_id']+' | '+data[key]['wharf_code']+' | '+data[key]['country_name']+' | '+data[key]['name_cn']});
	                }
	            $('.MDport').select2({
                data:AIRimport.MDport,
                placeholder:''
                })
	            $(trArr).appendTo($('.AIRimport div.MDD table>tbody'));
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
	            var trArr='';
	            AIRimport.airCompany=[];
	            for(var key in data){
	            	trArr=trArr+'<tr class="newTRMT">' +
                    '<td  name="iata_designator">'+data[key]['iata_designator']+'</td>' +
                    '<td name="icao_designator">'+data[key]['icao_designator']+'</td>' +
                    '<td name="airline_id">'+data[key]['airline_id']+'</td>' +
                    '<td name="airline_name">'+data[key]['airline_name']+'</td>' +
                    '</tr>';
                    AIRimport.airCompany.push({'id':key,'text':data[key]['iata_designator']+' | '+data[key]['icao_designator']+' | '+data[key]['airline_id']+' | '+data[key]['airline_name']});
	               }
	            $('.airLine').select2({
                data:AIRimport.airCompany,
                placeholder:''
                })
	            $(trArr).appendTo($('.AIRimport div.HKGS table>tbody'));
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
	}
	// 保存按钮
	function saveGetorder(liId) {
		var isFull=false;
		$('.AIRimport #upForm').find("input[class='must']").each(function(){
			if($(this).val()==""){
				$(this).parents("tr").css("border","1px solid red");
			}
		})
		$.ajax({
					type : "POST",
					url : '/SeawinWebappBase/airBillImportController/updateById.do',
					async: false,
					contentType : "application/json;charset=UTF-8",
					data : function(){
						data ={'billImportId':liId};
						$.each($('.AIRimport #ordersForm').find('input,select,textarea'),function(i,input){
			                data[$(this).attr('name')]=$(this).val();
		               });
		                data['airGoodsInfoList']=[];
		                data['deliverGoodsPlans']=[];
		                //修改数据
		                $.each($('.AIRimport #HSCodeInfo table tbody').find('tr[exchange_operate!="insert"]'),function(i,tr){
		                	data['airGoodsInfoList'][i]={};
		                	data['airGoodsInfoList'][i]['exchange_operate']=$(tr).attr('exchange_operate');
		                	data['airGoodsInfoList'][i]['billImportId']=liId;
			                $.each($(tr).find('input'),function(j,input){
			                	var name=$(this).attr('name');
			                	data['airGoodsInfoList'][i][name]=$(this).val();
			                })
		                })
		                //新增数据
		                $.each($('.AIRimport #HSCodeInfo table tbody').find('tr[exchange_operate="insert"]'),function(i,tr){
			                var obj={'exchange_operate':'insert','billImportId':liId};
			                $.each($(tr).find('input'),function(j,input){
				                obj[$(this).attr('name')]=$(this).val();
			                })
			                data['airGoodsInfoList'].push(obj);
		                });
		                return JSON.stringify(data);
					}(),
					success : function(data) {
						var res = JSON.parse(data);
						if (res.status == 1) {
							callAlert('成功');
                            $('.AIRimport div.ZLmain>ul.nav-tabs>li.importGetOrder').attr('changed',false);
                            if($('.AIRimport div.ZLmain>ul>li.importGetOrder').hasClass('active')){
                                AIRgetorder.askData(liId);
                            }else{

                            }
							//callSuccess("保存成功！");
						} else if (res.status == 0) {
							alert('失败');
							//callAlert("保存失败！");
						}
					}
				});
	}
	// 主单收货人详细信息
	function majorConsignee(d) {
		var customerId = $('.AIRimport #ordersForm  input[name="customerId"]').val();
		if (!customerId) {
			customerId = 0;
		}
		// alert(customerId);
		$.ajax({
			"type" : "post",
			"url" : getContextPath() + '/saleBillCustomer/getByCustomerId.do',
			"data" : {
				id : customerId,
				type:'S'
			},
			"success" : function(data) {
				$('.AIRimport #entrConsigneeEdit div table.smallTable tbody').empty();
				var data = JSON.parse(data);
				var tr = "";
				for (var i = 0; i < data.length; i++) {
					tr = tr +"<tr billCustomerId="+data[i]['billCustomerId']+">" +
                        "<td><textarea class='form-control' name='code' readonly='readonly' >"+data[i]['code']+"</textarea></td>" +
                        "<td><textarea class='form-control' name='compositeName' readonly='readonly'> "+data[i]["compositeName"]+"</textarea></td>" +
                        "<td>"+data[i]["baseModel"]["creatorName"]+"</td>" +
                        "<td>"+data[i]["createTime"]+"</td>" +
                        "</tr>";
				}
				$('.AIRimport #entrConsigneeEdit div table.smallTable tbody').append(tr);
				console.log(data);
				$('.AIRimport  #entrConsigneeEdit').modal('show');
			}
		});
	}
	// 主单发货人详细信息
	function majorConsignor(d) {
		var customerId = $('.AIRimport #ordersForm input[name="customerId"]')
				.val();
		if (!customerId) {
			customerId = 0;
		}
		$.ajax({
			"type" : "get",
			"url" : getContextPath() + '/saleBillCustomer/getByCustomerId.do',
			"data" : {
				id : customerId,
				type:'F'
			},
			"success" : function(data) {
				$('.AIRimport #entrConsignorEdit div table.smallTable tbody').empty();
				var data = JSON.parse(data);
				var tr = "";
				for (var i = 0; i < data.length; i++) {
					tr = tr +"<tr billCustomerId="+data[i]['billCustomerId']+">" +
                        "<td><textarea class='form-control' name='code' readonly='readonly'> "+data[i]['code']+"</textarea></td>" +
                        "<td><textarea class='form-control' name='compositeName' readonly='readonly'>"+data[i]["compositeName"]+"</textarea></td>" +
                        "<td>"+data[i]["baseModel"]["creatorName"]+"</td>" +
                        "<td>"+data[i]["amendTime"]+"</td>" +
                        "</tr>";
				}
				$('.AIRimport #entrConsignorEdit div table.smallTable tbody')
						.append(tr);
				console.log(data);
				$('.AIRimport #entrConsignorEdit').modal('show');
		//		$('.AIRimport .majorConsignor').css('display', 'block');
			}
		});
	}
	//HS编码新增一条
	//新增应付费用
    function addPayData(htmlName){
        var tr='<tr exchange_operate="insert" class="active">'+
            '<td></td>'+
            '<td><input class="form-control" type="text" name="customeId" value=""></td>'+
            '<td>'+
            '<input class="form-control" type="text" name="number" value="">'+
            '</td>'+
            '<td>'+
            '<input class="form-control" name="gross" value="">'+
            '</td>'+
            '<td>'+
            '<input class="form-control" name="volume" value="">'+
            '</td>'+
            '<td>'+
            '<input class="form-control" name="volumeWeight" value="">'+
            '</td>'+
            '<td>'+
            '<input class="form-control" name="englishGoodsName" value="">'+
            '</td>'+
            '<td>'+
            '<input class="form-control" name="chineseGoodsName" value="">'+
            '</td>'+
            '<td>'+
            '<input class="form-control" name="remarks" value="">'+
            '</td>'+
            '</tr>';
        $('.'+htmlName+' div#HScode table tbody').find('tr').css('background','transparent').removeClass('sel');
      //  $(tr).css('background','lightblue').addClass('sel');
        $('.'+htmlName+' div#HScode table tbody').append(tr);
        $('.'+htmlName+' div#HScode table tbody tr:last').css('background','lightblue').addClass('sel');
        /*//给select2 赋值
        $("."+htmlName+" div#HScode tbody").find('tr:last .optionExpenseType').select2({
            data: optionExpenseType,
            placeholder:''
        });
        $("."+htmlName+" div#HScode tbody").find('tr:last .optionCurrency').select2({
            data:optionCurrency,
            placeholder:''
        });
        var salesmanName=businessData['salesmanName'];
        $("."+htmlName+" div#HScode tbody").find("tr:last input[name='salesmanName']").val(salesmanName);*/
        reorderByCon(htmlName);
    }
    //删除应付费用
    function delPayData(htmlName){
        var tr=$('.'+htmlName+' div#HScode  table tbody').find('tr.sel');
        if(tr.length==1){
            if(tr.attr('exchange_operate')=='insert'){
                tr.remove();
            }else{
                tr.attr('exchange_operate','delete').css('display','none').removeClass('active');
            }
            reorderByCon(htmlName);
        }else{
            callAlert('请选择您要删除的数据');
        }
    }
    //序号排序
    function reorderByCon(htmlName) {
        var ConArr = $('.'+htmlName+' div#HScode table tbody tr.active');
        for (var i = 0; i < ConArr.length; i++) {
            $(ConArr[i]).find('td:eq(0)').text(i + 1);
        }
    }
    // 初始时间设置 选择日期 选择时间具体到分
	//接单 根据选中的委托人不同 获取合同协议
	function getContractCode(customerId) {
		$.ajax({
			type:'POST',
			url:getContextPath()+'saleFile/getContractNumber.do',
			data:{'customerId':customerId},
			success:function (data) {
				if(data){
                    $('.AIRimport #orders #ordersForm input[name="contractCode"]').val(data['data']);
				}else{
                    $('.AIRimport #orders #ordersForm input[name="contractCode"]').val('');
                }
            }
		})
    }
    //接单  根据选中的委托人的不同  修改联系人信息
    function getContactsByCustomerId(customerId,contact,isChange) {
        $.ajax({
            type:'post',
            url:getContextPath()+'saleCustomerEmployee/getOperatorByCustomerId.do',
            data:{"customerId":customerId},
            success:function(data){
                $('.AIRimport #orders #ordersForm select[name="contact"]').empty();
       //         $('.AIRimport #orders #ordersForm select[name="contact"]').parent('td').find('span.select2').remove();
                var data=JSON.parse(data);
                console.log(data);
                AIRgetorder.Operator=data;
                console.log(data.length);
                var opt='<option mobile="" contactId="" value=""></option>';
                for(var i=0;i<data.length;i++){
                    opt=opt+'<option mobile='+data[i]['mobile']+' contactId='+data[i]['customerEmployeeId']+'  value='+data[i]['operator']+'>'+data[i]['operator']+'</option>';
                }
                //      opt=opt+'<option mobile="2" value="2">34</option><option mobile="3" value="3">3</option><option mobile="4" value="4">4</option>'
                $('.AIRimport #orders #ordersForm select[name="contact"]').append(opt).select();
                if(contact){
                    $('.AIRimport #orders #ordersForm select[name="contact"]').val(contact).trigger('change');
                }
                console.log(AIRgetorder.Operator[0]);
                if(AIRgetorder.Operator[0]==undefined){
                    $('.AIRimport #orders #ordersForm table tbody').find('tr td select[name="contact"]').val('').trigger('change');
                }else{
                    $('.AIRimport #orders #ordersForm table tbody').find('tr td select[name="contact"]').val(AIRgetorder.Operator[0]['operator']).trigger('change');
                }
                if(isChange){
                    $('.AIRimport div.ZLmain>ul.editList>li.importGetOrder').attr('changed',false);
                }
            }
        })
    }
    //发货人 收货人添加信息
    function addCustomer(d) {
        var name=JSON.parse($.cookie('loginingEmployee'))['user']['username'];
        var data=AIRimport.nowtime();
        var tr="<tr exchange_operate='insert' billcustomerid=''>" +
            "<td name='code' width='120' style='word-break: break-all;white-space: initial;'>" +
            "<textarea name='code' style='margin: 0px;border:none;width: 100%;height:24px;word-break: break-all;white-space: initial;'></textarea>"+
            "</td>" +
            "<td name='compositeName' width='209' style='word-break: break-all;white-space:initial;'>" +
            "<textarea name='compositeName' style='margin: 0px;border: none; width: 100%;height: 24px;word-break: break-all;white-space: initial;'></textarea>"+
            "</td>" +
            "<td name='creatorName'>"+name+"</td>" +
            "<td name='amendTime'>"+data+"</td></tr>";
        $(d).parents('div.BasicInfo').find('tbody').prepend(tr);
        $(d).parents('div.BasicInfo').find('table.smallTable').attr('changed','true');
    }
    //发货人 收货人删除信息
    function delCustomer(d){
        if($(d).parents('div.BasicInfo').find('table tbody tr.sel').length==1){
            if($(d).parents('div.BasicInfo').find('table tbody tr.sel').attr('exchange_operate')=='insert'){
                $(d).parents('div.BasicInfo').find('table tbody tr.sel').remove();
            }else{
                $(d).parents('div.BasicInfo').find('table tbody tr.sel').css('display','none').attr('exchange_operate','delete');
                $(d).parents('div.BasicInfo').find('table.smallTable').attr('changed',true);
            }
        }else{
            callAlert('请选择你要操作的数据');
        }
    }
    //发货人 收货人 修改
    function changeCustomer(d) {
        var data=AIRimport.nowtime();
        var tr=$(d).parents('div.BasicInfo').find('table tbody tr.sel');
        if(tr.length==1){
            tr.find('textarea').removeAttr('readonly');
            tr.attr('exchange_operate','');
            $(tr).parents('table.smallTable').attr('changed','true')
        }else{
            callAlert('请选择你要操作的数据');
        }
    }
    //向后台提交数据 发货人 收货人
    function saveCustomer(d,type) {
        //     alert('保存');
        var tr=$(d).parents('div.modal-body').find('tbody tr');
        var saveData=[];
        var customerId=$('.AIRimport #orders input[name="customerId"]').val();
        var customerCode=$('.FCLexport #orders input[name="customerCode"]').val();
        $.each(tr,function () {
            console.log($(this).attr('exchange_operate'));
            if($(this).attr('exchange_operate')!='undefined'){
                saveData.push({'customerId':customerId,'customerCode':customerCode,'customerType':type,'billCustomerId':$(this).attr('billcustomerid'),'exchange_operate':$(this).attr('exchange_operate'),'code':$(this).find('textarea[name="code"]').val(),'compositeName':$(this).find('textarea[name="compositeName"]').val()});
            }
        })
		saveData['type']=type;
        console.log(saveData);
        $.ajax({
            "type": "POST",
            contentType : 'application/json;charset=utf-8',
            "url": getContextPath() + '/saleBillCustomer/save.do',
            "data":JSON.stringify(saveData),
            "success": function (data) {
                console.log(data);
                data=JSON.parse(data);
                callAlert(data['message']);
            }
        });
    }
    function domBind() {
        
    }
	return{
        getContractCode:getContractCode,		//根据customerId 获取合同协议
        saveCustomer:saveCustomer,
        changeCustomer:changeCustomer,
        delCustomer:delCustomer,
        addCustomer:addCustomer,
        Operator:Operator,
        getContactsByCustomerId:getContactsByCustomerId,
        askData:askData,
		initBaseData:initBaseData,
		saveGetorder:saveGetorder,
		majorConsignee:majorConsignee,
		majorConsignor:majorConsignor,
		addPayData:addPayData,
		reorderByCon:reorderByCon,
		delPayData:delPayData
	}
})();
$(function(){
    $('.AIRimport #orders #ordersForm select[name="contact"]').on('change',function () {
        $('.AIRimport div#orders table tbody').find('tr td input[name="contactPhone"]').val($(this).find('option:selected').attr('mobile'));
        $(this).parent('td').find('input[name="contactId"]').val($(this).find('option:selected').attr('contactId'));
    })
    //商务调度操作 关联问题
    $('.AIRimport div#orders select.IdAndName').on('change',function () {
        //   alert($(this).find('option:selected').text());
        $(this).parent('td').find('input').val($(this).find('option:selected').text());

    })
    //监听贸易类型select2变化
    $('.AIRimport div#orders section select.tradeTypeSel').on('change',function () {
        //console.log($(this).val());
        var textSel=$(this).find('option:selected').text();
        //var code=textSel.split(' | ')[0];
        var name=textSel.split(' | ')[1];
        //$(this).parent('td').find('input:eq(0)').val(code);
        $(this).parent('td').find('input:eq(0)').val(name);
    })
    $('.AIRimport select[name="paymentTermName"]').on('change',function(){
        var paymentTermName=$(this).val();
        //console.log(majorPayMean);
        if(paymentTermName=='P'){
            $(this).parent('td').find('input').val('FREIGHT PREPAID');
        }else if(paymentTermName=='A'){
            $(this).parent('td').find('input').val('FREIGHT PAYALE AT');
        }else if(paymentTermName=='C'){
            $(this).parent('td').find('input').val('FREIGHT COLLECT');
        }
        else{
            $(this).parent('td').find('input').val(' ');
        }
    })
    //收货方赋值
 //   $('.AIRimport div.ZDSHR table.smallTable tbody').on('dblclick','tr',function(){
	$('.AIRimport div#entrConsigneeEdit table.smallTable tbody').on('dblclick','tr.sel',function () {
        var consigneeCode=$(this).find('td:eq(0) textarea').val();
        var consigneerName=$(this).find('td:eq(1) textarea').val();
        $('.AIRimport div#orders input[name="consigneeCode"]').val(consigneeCode);
        $('.AIRimport div#orders textarea[name="consigneerName"]').val(consigneerName);
		$('.AIRimport div#entrConsigneeEdit').modal('hide');
    })
    //发货方赋值
 //   $('.AIRimport div.ZDFHR table.smallTable tbody').on('dblclick','tr',function(){
    $('.AIRimport div#entrConsignorEdit table.smallTable tbody').on('dblclick','tr.sel',function () {
        var consignorCode=$(this).find('td:eq(0) textarea').val();
        var consignorName=$(this).find('td:eq(1) textarea').val();
        $('.AIRimport div#orders input[name="consignorCode"]').val(consignorCode);
        $('.AIRimport div#orders textarea[name="consignorName"]').val(consignorName);
        $('.AIRimport div#entrConsignorEdit').modal('hide');
    })
	//监听内容页面是否修改
    $('.AIRimport div#orders').on('change','section input,section textarea,section select',function () {
        $('.AIRimport div.ZLmain>ul.nav-tabs>li.importGetOrder').attr('changed',true);
    });
	//付款方式变化为后面的input框赋值
    $(".AIRimport #select_1").on('change',function(){
        //$(".AIRimport #importGoodsData input[name='orderPaymentTermCode']").val($(this).select2("data")[0].text);
        $(".AIRimport #importGoodsData input[name='paymentTermName']").val($(this).find("option:selected").attr("data-input"));
    });
	//委托人详细信息
	$('.AIRimport span.showClientDetail').on('click',function(e){
        	//阻止冒泡
            if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
            $("div.modalDIVSmall").css('display','none');
            $('.AIRimport div.modalDIV').css('display','none');
            $('.AIRimport div.clientDetail').css('display','block');                 	
        })
	//委托人div点击选中一行
    $('.AIRimport div.clientDetail table tbody').on('click','tr.newTRMT>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
        	$('.AIRimport div.clientDetail table tbody').find('tr').css('background','transparent').removeClass('sel');
        	$(this).parent('tr.newTRMT').css('background','lightblue').addClass('sel');
        });
    /*委托人div双击进行赋值*/
    /*$('.AIRimport div.clientDetail div table.smallTable tbody').on('dblclick','tr.sel',function () {
	//	  alert('点击了委托人');
		  var id=$(this).attr('customerId');
		  var code=$(this).find('td:eq(0)').text();
		  var name=$(this).find('td:eq(1)').text();
		  //var cusName=$(this).find('td:eq(2)').text();
		  var salesmanName=$(this).find('td[name="salesmanName"]').text();//销售
		  var servicePersonName=$(this).find('td[name="servicePersonName"]').text();//客服
		  /!*$(this).parents('td').find('>input:eq(2)').val(id);*!/
		  $(this).parents('td').find('>input:eq(0)').val(code);
		  $(this).parents('td').find('>input:eq(1)').val(name);
		  //$(this).parents('td').find('>input:eq(3)').val(cusName);
		  $(this).parents('table.table').find('input[name="salemanName"]').val(salesmanName);
		  $(this).parents('table.table').find('input[name="customerService1"]').val(servicePersonName);
          var customerId=$(this).attr("customerId");
          if(customerId){
              $.ajax({
                  type:'post',
                  url:getContextPath()+'saleCustomerEmployee/getOperatorByCustomerId.do',
                  data:{"customerId":customerId},
              })
		  }else{

		  }
		  AIRimport.closeDetail('.clientDetail');
      })*/
    //收货人选择一行
    $('.AIRimport div#entrConsigneeEdit table tbody').on('click','tr>td',function(e) {
				if (e.stopPropagation) {
					e.stopPropagation();
				} else {
					e.cancelBubble = true;
				}
				$('.AIRimport div#entrConsigneeEdit table tbody').find('tr').css(
						'background', 'transparent').removeClass('sel');
				$(this).parent('tr').css('background', 'lightblue').addClass(
						'sel');
			});
	$('.AIRimport div#entrConsignorEdit table tbody').on('click','tr>td',function(e) {
				if (e.stopPropagation) {
					e.stopPropagation();
				} else {
					e.cancelBubble = true;
				}
				$('.AIRimport div#entrConsignorEdit table tbody').find('tr').css(
						'background', 'transparent').removeClass('sel');
				$(this).parent('tr').css('background', 'lightblue').addClass(
						'sel');
			});
     //装货港   下拉条点击后给input赋值
	/*$('.AIRimport div.entrLoading.ZHG table.smallTable tbody').on('click','tr.newTR>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
         	$('.AIRimport div.entrLoading.ZHG table.smallTable tbody').find('tr').css('background','transparent');
        	$(this).parent('tr.newTR').css('background','rgb(214,237,247)');
        	var en_name=$(this).parent('tr.newTR').find('td[name="port_name"]').text();
        	var code=$(this).parent('tr.newTR').find('td[name="port_code"]').text();
        	var id=$(this).parent('tr.newTR').find('td[name="port_id"]').text();

        	$('.AIRimport input[name="loadingPortCode"]').val(code);
        	$('.AIRimport input[name="loadingPortName"]').val(en_name);
        })*/
	//装货港 点击select进行赋值
    $('.AIRimport #orders select.carryArr').on('change',function () {
        console.log($(this).select2('data')[0]);
        var detail=JSON.parse($(this).find('option:selected').attr('data-detail'));
        $(this).parent('td').find('input[name="loadingPortCode"]').val(detail['port_code']);
        $(this).parent('td').find('input[name="loadingPortName"]').val(detail['port_name']);
    })
    //卸货港   下拉条点击后给input赋值
   /* $('.AIRimport div.entrDest.loadPort table.smallTable tbody').on('click','tr.newTRMT>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
         	$('.AIRimport div.entrDest.loadPort table.smallTable tbody').find('tr').css('background','transparent');
        	$(this).parent('tr.newTRMT').css('background','rgb(214,237,247)');

        	var code=$(this).parent('tr.newTRMT').find('td[name="port_code"]').text();
        	var name=$(this).parent('tr.newTRMT').find('td[name="port_name"]').text();
        	$('.AIRimport input[name="dischargePortCode"]').val(code);
        	$('.AIRimport input[name="dischargePortName"]').val(name);
        })*/
   //卸货港  点击select进行赋值
    $('.AIRimport #orders select.loadingPort').on('change',function () {
        console.log($(this).select2('data')[0]);
        var detail=JSON.parse($(this).find('option:selected').attr('data-detail'));
        $(this).parent('td').find('input[name="dischargePortCode"]').val(detail['port_code']);
        $(this).parent('td').find('input[name="dischargePortName"]').val(detail['port_name']);
        $('.AIRimport #orders select.MDport').val($(this).val()).trigger('change');
    })
    //目的地   下拉条点击后给input赋值
   /* $('.AIRimport div.entrDestDock.MDD table.smallTable tbody').on('click','tr.newTRMT>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
         	$('.AIRimport div.entrDestDock.MDD table.smallTable tbody').find('tr').css('background','transparent');
        	$(this).parent('tr.newTRMT').css('background','rgb(214,237,247)');
        	var code=$(this).parent('tr.newTRMT').find('td[name="port_code"]').text();
        	var name=$(this).parent('tr.newTRMT').find('td[name="port_name"]').text();
        	$('.AIRimport input[name="destnPortCode"]').val(code);
        	$('.AIRimport input[name="destnPortName"]').val(name);
        })*/
   //目的地 点击select进行赋值
    $('.AIRimport #orders select.MDport').on('change',function () {
        console.log($(this).select2('data')[0]);
        var detail=JSON.parse($(this).find('option:selected').attr('data-detail'));
        $(this).parent('td').find('input[name="destnPortCode"]').val(detail['port_code']);
        $(this).parent('td').find('input[name="destnPortName"]').val(detail['port_name']);
    })
    //航空公司   下拉条点击后给input赋值
    $('.AIRimport div.airCompany.HKGS table.smallTable tbody').on('click','tr.newTRMT>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
         	$('.AIRimport div.airCompany.HKGS table.smallTable tbody').find('tr').css('background','transparent');
        	$(this).parent('tr.newTRMT').css('background','rgb(214,237,247)');
        	var en_name=$(this).parent('tr.newTRMT').find('td[name="airline_name"]').text();
        	var code=$(this).parent('tr.newTRMT').find('td[name="airline_id"]').text();
        	$('.AIRimport input[name="importAirplaneCompary"]').val(en_name);
        });
    //航空公司 点击select进行赋值
    $('.AIRimport #orders select.airLine').on('change',function () {
       // console.log($(this).selects('data')[0]['element']['dataset']['detail']);
        var detail=JSON.parse($(this).find('option:selected').attr('data-detail'));
        $(this).parent('td').find('input[name="importAirplaneComparyCode"]').val(detail['iata_designator']);
        $(this).parent('td').find('input[name="importAirplaneCompary"]').val(detail['airline_name']);

    })
    //监听HS编码表格是否被选中
    $('.AIRimport div#HSSelect table.table tbody').on('click','tr',function(){
    	$('.AIRimport div#HSSelect table.table tbody').find('tr').css('background', 'transparent').removeClass('sel');
    	$(this).css('background', 'lightblue').addClass('sel');
    });
    //件数单位赋值
    $('.AIRimport #select_4').on('change',function(){
    	var content=$('.AIRimport #select_4').find('option:selected').text();
    	$('.AIRimport div#orders input[name="quantityUnit"]').val(content);
    });
})