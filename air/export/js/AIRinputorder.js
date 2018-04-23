//@ sourceURL=AIRinputorder.js
(function (original) {
  jQuery.fn.clone = function () {
        var result = original.apply(this, arguments),
        my_textareas = this.find('textarea').add(this.filter('textarea')),
        result_textareas = result.find('textarea').add(result.filter('textarea')),
        my_selects = this.find('select').add(this.filter('select')),
        result_selects = result.find('select').add(result.filter('select'));
    for (var i = 0, l = my_textareas.length; i < l; ++i) $(result_textareas[i]).val($(my_textareas[i]).val());
    for (var i = 0, l = my_selects.length;   i < l; ++i) {
      for (var j = 0, m = my_selects[i].options.length; j < m; ++j) {
        if (my_selects[i].options[j].selected === true) {
          result_selects[i].options[j].selected = true;
        }
      }
    }
    return result;
  };
})(jQuery.fn.clone);
var AIRinputorder = (function() {
    var freData={};//运价查询条件
    var process={}; //流程Id
    var extraCharge;//附加费
	// 根据id请求输单数据
	function askData(id) {
		// 向后台请求数据
		$.ajax({
					type : 'get',
					url : '/SeawinWebappBase/airBillExportController/searchById.do',
					data : {"id" : id},
					async: false,//同步
					success : function(data) {
						var data = JSON.parse(data);
						// 循环给表单赋值
						$.each($('.AIRexport form#busyCode').find('input,textarea,select'),function(i, input) {
							if ($(this).attr("name")) {
								$(this).val(data[$(this).attr("name")]).trigger('change');
									/*if($(this).hasClass('must')){
										if(data[$(this).attr("name")]){
											$(this).removeClass('error').addClass('valid');
											if($(this).hasClass('select')){
												$(this).parent('td').find('span').removeClass('error').addClass('valid');
											}

										}else{
											$(this).addClass('error').removeClass('valid');
											if($(this).hasClass('select')){
                                                $(this).parent('td').find('span').removeClass('valid').addClass('error');
                                            }
										}
									}else {

									}*/
							    } else {
												// 不需要替换
										}
						});
						if(data["auditAuthority"]==true){
							$('.AIRexport div#inputORD button#examinButton').css('display','block');
							$('.AIRexport div#inputORD input[name="examine"]').removeAttr('disabled');
						}else if(data["auditAuthority"]==false){
							$('.AIRexport div#inputORD button#examinButton').css('display','none');
							$('.AIRexport div#inputORD input[name="examine"]').attr('disabled','disabled');
						}
						freData['customerId']=data['customerId'];//委托人Id
						freData['loadingPortId']=data['loadId'];//装货港
						freData['dischargingPortId']=data['terminiId'];//目的港
						freData['serviceLineId']=data['routeId'];//航线Id
						freData['airLineId']=data['airplaneId'];//航空公司
						
						process['procInstId']=data['processId'];//获取流程Id
						console.log(freData);
						console.log(process);
                        $('.AIRexport div.ZLmain>ul.nav-tabs>li.inputORD').attr('changed',false);

                    }
				});
	}
	//加载页面时请求基础数据
	function initBaseData(){
		//委托人
            $.ajax({
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
            }); 
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
                trArr=trArr+'<tr class="newTR">' +
                    '<td  name="port_code">'+data[key]['port_code']+'</td>' +
                    '<td name="port_name">'+data[key]['port_name']+'</td>' +
                    '<td name="port_name_cn">'+data[key]['port_name_cn']+'</td>' +
                    '<td name="en_name">'+data[key]['en_name']+'</td>' +
                    '<td name="cn_name">'+data[key]['cn_name']+'</td>' +
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
			$.ajax({
        type:'post',
        url: getContextPath() +'redisController/listIdObjectByname.do?name=basedataPort_country',
        data:{},
        success:function(data){
            data=JSON.parse(data);
            var data=data.sort(AIRexport.compare("port_code"));
            $('.AIRexport div.DCF').find('tr.newTR').remove();
            var trArr='';
            AIRexport.orderArr=[];
            for(var key=0;key<data.length;key++){
                trArr=trArr+'<tr class="newTR">' +
                    '<td name="port_code">'+data[key]['port_code']+'</td>' +
                    '<td name="port_name">'+data[key]['port_name']+'</td>' +
                    '<td name="port_name_cn">'+data[key]['port_name_cn']+'</td>' +
                    '<td name="en_name">'+data[key]['en_name']+'</td>' +
                    '<td name="cn_name">'+data[key]['cn_name']+'</td>' +
                    '</tr>';
                AIRexport.orderArr.push({'id':key,'text':data[key]['port_code']+' | '+data[key]['port_name']+'('+data[key]['port_name_cn']+')'});
            }
            $('.orderPER').select2({
                data:AIRexport.orderArr,
                placeholder:''
            })
            $(trArr).appendTo($('.AIRexport div.DCF table>tbody'));
        }
    });
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
	}
	// 保存按钮
	function saveInputorder(liId) {
		var isFull=false;
		$('.AIRexport #inputORD').find("input[class='must']").each(function(){
			if($(this).val()==""){
				$(this).parents("tr").css("border","1px solid red");
			}
		})
		$.ajax({
					type : "POST",
					async: false,
					url : '/SeawinWebappBase/airBillExportController/saveById.do',
					contentType : "application/json;charset=UTF-8",
					data : function() {
						search_busyCode = $('.AIRexport #busyCode').serializeObject();
						var airBillExport = {};
						airBillExport = {'billExportId' : liId};
						for ( var key in search_busyCode) {
							airBillExport[key] = search_busyCode[key];
						};
						return JSON.stringify(airBillExport);
					}(),
					success : function(data) {
						var res = JSON.parse(data);
						if (res.status == 1) {
							callAlert("成功!");
                            $('.AIRexport div.ZLmain>ul.nav-tabs>li.inputORD').attr('changed',false);
                            if($('.AIRexport div.ZLmain>ul>li.inputORD').hasClass('active')){
                                AIRinputorder.askData(liId);
							}
						 	/*callSuccess("保存成功！");*/
						} else if (res.status == 0) {
							alert("保存失败!");
							/*callAlert("失败！");*/
						}
					}
				});
	}
	/*提交按钮*/
	function submitInputorder(liId) {
		var isFull=false;
		$('.AIRexport #inputORD').find("input[class='must']").each(function(){
			if($(this).val()==""){
				$(this).parents("tr").css("border","1px solid red");
			}
		})
		$.ajax({
					type : "POST",
					async: false,
					url : '/SeawinWebappBase/airBillExportController/updateById.do',
					contentType : "application/json;charset=UTF-8",
					data : function() {
						search_busyCode = $('.AIRexport #busyCode').serializeObject();
						var airBillExport = {};
						airBillExport = {'billExportId' : liId};
						for ( var key in search_busyCode) {
							airBillExport[key] = search_busyCode[key];
						};
						return JSON.stringify(airBillExport);
					}(),
					success : function(data) {
						var res = JSON.parse(data);
						if (res.status == 1) {
							callAlert("成功!");
						 	/*callSuccess("保存成功！");*/
						} else if (res.status == 0) {
							alert("保存失败!");
							/*callAlert("失败！");*/
						}

					}
				});
	}
	// 主单发货人详细信息
	function majorConsignor(d) {
		var customerId = $('.AIRexport #bottomBill input[name="customerId"]')
				.val();
		if (!customerId) {
			customerId = 0;
		}
		// alert(customerId);
		$.ajax({
			"type" : "get",
			"url" : getContextPath() + '/saleBillCustomer/getByCustomerId.do',
			"data" : {
				id : customerId
			},
			"success" : function(data) {
				$('.AIRexport .majorConsignor div table.smallTable tbody')
						.empty();
				var data = JSON.parse(data);
				var tr = "";
				for (var i = 0; i < data.length; i++) {
					tr = tr + "<tr billCustomerId=" + data[i]['billCustomerId']
							+ "><td>" + data[i]['code'] + "</td><td>"
							+ data[i]["compositeName"] + "</td><td>"
							+ data[i]["baseModel"]["creatorName"] + "</td><td>"
							+ data[i]["createTime"] + "</td></tr>";
				}
				$('.AIRexport .majorConsignor div table.smallTable tbody').append(tr);
				console.log(data);
				$('.AIRexport  .majorConsignor').css('display', 'block');
			}
		});
	}
	// 分单发货人详细信息
	function branchConsignor(d) {
		var customerId = $('.AIRexport #bottomBill input[name="customerId"]')
				.val();
		if (!customerId) {
			customerId = 0;
		}
		// alert(customerId);
		$.ajax({
			"type" : "get",
			"url" : getContextPath() + '/saleBillCustomer/getByCustomerId.do',
			"data" : {
				id : customerId
			},
			"success" : function(data) {
				$('.AIRexport .branchConsignor div table.smallTable tbody')
						.empty();
				var data = JSON.parse(data);
				var tr = "";
				for (var i = 0; i < data.length; i++) {
					tr = tr + "<tr billCustomerId=" + data[i]['billCustomerId']
							+ "><td>" + data[i]['code'] + "</td><td>"
							+ data[i]["compositeName"] + "</td><td>"
							+ data[i]["baseModel"]["creatorName"] + "</td><td>"
							+ data[i]["createTime"] + "</td></tr>";
				}
				$('.AIRexport .branchConsignor div table.smallTable tbody')
						.append(tr);
				console.log(data);
				$('.AIRexport  .branchConsignor').css('display', 'block');
			}
		});
	}
	// 主单收货人详细信息
	function majorConsignee(d) {
		var customerId = $('.AIRexport #bottomBill input[name="customerId"]')
				.val();
		if (!customerId) {
			customerId = 0;
		}
		// alert(customerId);
		$.ajax({
			"type" : "get",
			"url" : getContextPath() + '/saleBillCustomer/getByCustomerId.do',
			"data" : {
				id : customerId
			},
			"success" : function(data) {
				$('.AIRexport .majorConsignee div table.smallTable tbody')
						.empty();
				var data = JSON.parse(data);
				var tr = "";
				for (var i = 0; i < data.length; i++) {
					tr = tr + "<tr billCustomerId=" + data[i]['billCustomerId']
							+ "><td>" + data[i]['code'] + "</td><td>"
							+ data[i]["compositeName"] + "</td><td>"
							+ data[i]["baseModel"]["creatorName"] + "</td><td>"
							+ data[i]["createTime"] + "</td></tr>";
				}
				$('.AIRexport .majorConsignee div table.smallTable tbody')
						.append(tr);
				console.log(data);
				$('.AIRexport  .majorConsignee').css('display', 'block');
			}
		});
	}
	// 分单收货人详细信息
	function branchConsignee(d) {
		var customerId = $('.AIRexport #bottomBill input[name="customerId"]')
				.val();
		if (!customerId) {
			customerId = 0;
		}
		// alert(customerId);
		$.ajax({
			"type" : "get",
			"url" : getContextPath() + '/saleBillCustomer/getByCustomerId.do',
			"data" : {
				id : customerId
			},
			"success" : function(data) {
				$('.AIRexport .branchConsignee div table.smallTable tbody')
						.empty();
				var data = JSON.parse(data);
				var tr = "";
				for (var i = 0; i < data.length; i++) {
					tr = tr + "<tr billCustomerId=" + data[i]['billCustomerId']
							+ "><td>" + data[i]['code'] + "</td><td>"
							+ data[i]["compositeName"] + "</td><td>"
							+ data[i]["baseModel"]["creatorName"] + "</td><td>"
							+ data[i]["createTime"] + "</td></tr>";
				}
				$('.AIRexport .branchConsignee div table.smallTable tbody')
						.append(tr);
				console.log(data);
				$('.AIRexport  .branchConsignee').css('display', 'block');
			}
		});
	}
	// 主单通知人详细信息
	function majorContact(d) {
		var customerId = $('.AIRexport #bottomBill input[name="customerId"]')
				.val();
		if (!customerId) {
			customerId = 0;
		}
		// alert(customerId);
		$.ajax({
			"type" : "get",
			"url" : getContextPath() + '/saleBillCustomer/getByCustomerId.do',
			"data" : {
				id : customerId
			},
			"success" : function(data) {
				$('.AIRexport .majorContact div table.smallTable tbody')
						.empty();
				var data = JSON.parse(data);
				var tr = "";
				for (var i = 0; i < data.length; i++) {
					tr = tr + "<tr billCustomerId=" + data[i]['billCustomerId']
							+ "><td>" + data[i]['code'] + "</td><td>"
							+ data[i]["compositeName"] + "</td><td>"
							+ data[i]["baseModel"]["creatorName"] + "</td><td>"
							+ data[i]["createTime"] + "</td></tr>";
				}
				$('.AIRexport .majorContact div table.smallTable tbody')
						.append(tr);
				console.log(data);
				$('.AIRexport  .majorContact').css('display', 'block');
			}
		});
	}
	// 分单通知人详细信息
	function branchContact(d) {
		var customerId = $('.AIRexport #bottomBill input[name="customerId"]')
				.val();
		if (!customerId) {
			customerId = 0;
		}
		// alert(customerId);
		$.ajax({
			"type" : "get",
			"url" : getContextPath() + '/saleBillCustomer/getByCustomerId.do',
			"data" : {
				id : customerId
			},
			"success" : function(data) {
				$('.AIRexport .branchContact div table.smallTable tbody')
						.empty();
				var data = JSON.parse(data);
				var tr = "";
				for (var i = 0; i < data.length; i++) {
					tr = tr + "<tr billCustomerId=" + data[i]['billCustomerId']
							+ "><td>" + data[i]['code'] + "</td><td>"
							+ data[i]["compositeName"] + "</td><td>"
							+ data[i]["baseModel"]["creatorName"] + "</td><td>"
							+ data[i]["createTime"] + "</td></tr>";
				}
				$('.AIRexport .branchContact div table.smallTable tbody')
						.append(tr);
				console.log(data);
				$('.AIRexport  .branchContact').css('display', 'block');
			}
		});
	}
	/*发货人 收货人 通知人查询按钮*/
	function customerSearch(d){
		var searchContent=$(d).parent('div').find('input').val();
		var customerId = $('.AIRexport #bottomBill input[name="customerId"]').val();
		if (!customerId) {
			customerId = 0;
		}
		if(searchContent){
			$.ajax({
			"type" : "get",
			"url" : getContextPath() + '/saleBillCustomer/getByCustomerId.do',
			"data" : {
				id : customerId
			},
			"success" : function(data) {
				$(d).parents('div.modal-body').find('table.smallTable tbody').empty();
				var data = JSON.parse(data);
				var tr = "";
				for (var i = 0; i < data.length; i++) {
					if(data[i]['code']==searchContent){//如果符合条件,就把这条记录显示出来
						tr = tr + "<tr billCustomerId=" + data[i]['billCustomerId']
							+ "><td>" + data[i]['code'] + "</td><td>"
							+ data[i]["compositeName"] + "</td><td>"
							+ data[i]["baseModel"]["creatorName"] + "</td><td>"
							+ data[i]["createTime"] + "</td></tr>";
					}else{
						
					}
				}
				$(d).parents('div.modal-body').find('table.smallTable').append(tr);
				console.log(data);
				/*$('.AIRexport  .majorConsignor').css('display', 'block');*/
			}
		});
		}else{
			$.ajax({
			"type" : "get",
			"url" : getContextPath() + '/saleBillCustomer/getByCustomerId.do',
			"data" : {
				id : customerId
			},
			"success" : function(data) {
				$(d).parents('div.modal-body').find('table.smallTable tbody').empty();
				var data = JSON.parse(data);
				var tr = "";
				for (var i = 0; i < data.length; i++) {
						tr = tr + "<tr billCustomerId=" + data[i]['billCustomerId']
							+ "><td>" + data[i]['code'] + "</td><td>"
							+ data[i]["compositeName"] + "</td><td>"
							+ data[i]["baseModel"]["creatorName"] + "</td><td>"
							+ data[i]["createTime"] + "</td></tr>";
				}
				$(d).parents('div.modal-body').find('table.smallTable').append(tr);
				console.log(data);
				/*$('.AIRexport  .majorConsignor').css('display', 'block');*/
			}
		});
		}
		
	}
	// 发货人 收货人 通知人选择按钮
	function selCustomer(d) {
		if ($(d).parent('div').next().next().find('table tbody tr.sel').length == 1) {
			var tr = $(d).parent('div').next().next().find('tbody tr.sel');
			var code = $(tr).find('td:eq(0)').text();
			var detail = $(tr).find('td:eq(1)').text();
			$(d).parents('td').find('input.code').val(code).trigger('change');
			$(d).parents('td').find('input.info').val(detail).trigger('change');
			$(d).parents('div.personModal').css('display','none');
			/*$(d).parents('td').find('div').css('display','none');//选择记录后关闭弹框*/
		} else {
			callAlert('请选择数据');
		}
	}
	//发货人 收货人 通知人添加按钮
    function addCus(d){
    	var name=JSON.parse($.cookie('loginingEmployee'))['user']['username'];
    	var data=AIRexport.nowtime();
        var tr="<tr class='addTR'><td name='code' contentEditable='true'></td><td name='compositeName' contentEditable='true'></td><td name='creatorName'>"+name+"</td><td name='createTime'>"+data+"</td></tr>";
    	$(d).parent('div').next().next().find('tbody').append(tr);
    }
    //发货人 收货人 通知人 删除按钮
    function delCus(d){
    	if($(d).parent('div').next().next().find('table tbody tr.sel').length==1){
    		if($(d).parent('div').next().next().find('table tbody tr.sel').hasClass('addTR')){
    			$(d).parent('div').next().next().find('table tbody tr.sel').remove();
    		}else{
    			$(d).parent('div').next().next().find('table tbody tr.sel').css('display','none');
    			var id=$(d).parent('div').next().next().find('table tbody tr.sel').attr('billCustomerId');
			    $.ajax({
	                type:'post',
	                url:getContextPath()+'/saleBillCustomer/delete.do',
	                data:{'ids':id},
	                success:function(data){
	                    console.log(data);
	                }
	            })
    		}
    	}else{
    		callAlert('请选择你要操作的数据');
    	}
    }
  //根据input中的输入值查找tr中的匹配项
    function selTR(a,b){
    	a=a.toLocaleUpperCase();
    	console.log(a);
    	var Arrtd=$('.AIRexport div.'+b+' tbody tr').find('td:eq(0)');
    	$.each(Arrtd,function(i,td){
			if($(td).text().indexOf(a)>=0){
				$(td).parent('tr').css('display','table-row');
			}else{
				$(td).parent('tr').css('display','none');
			}
		});
    }
    //显示审核模态框
    function examin(){
    	$('.AIRexport div#examin input:radio[name="examin"]').get(0).checked=false;
    	$('.AIRexport div#examin input:radio[name="examin"]').get(1).checked=false;
    	$('.AIRexport div#examin').modal('show');
    }
    //提交审核数据
    function examinSubmit(){
    	var id=$('.AIRexport ul.Big li.active').attr('billId');//获取主键
    	var procInstId=process['procInstId'];//获取流程Id
    	var sele=$('.AIRexport div#examin input:radio[name="examin"]:checked').val();//获取审核结果
    	var remark=$('.AIRexport div#examin textarea[name="updateRemark"]').val();//获取审核备注
    	
    	var judgeVo={};
    	var isPass;
		
		if(sele=="true"){
			isPass=true;
		}else{
			isPass=false;
		}
		judgeVo['procInstId']=procInstId;
		judgeVo['isPass']=isPass;
		judgeVo['remark']=remark;
		var keys={};
		keys['billExportId']=id;
		keys['orderId']=$('.AIRexport div#inputORD form#busyCode div.inputOrder table input[name="orderId"]').val();      //订舱方Id
		keys['orderCode']=$('.AIRexport div#inputORD form#busyCode div.inputOrder table input[name="orderCode"]').val();	//订舱方Code
		keys['orderInfo']=$('.AIRexport div#inputORD form#busyCode div.inputOrder table input[name="orderInfo"]').val();		//订舱方name
		keys['flightId']=$('.AIRexport div#inputORD form#busyCode div.inputOrder table input[name="flightId"]').val();		//航班号
		keys['airplaneId']=$('.AIRexport div#inputORD form#busyCode div.inputOrder table input[name="airplaneId"]').val();		//航空公司code
		keys['airplaneInfo']=$('.AIRexport div#inputORD form#busyCode div.inputOrder table input[name="airplaneInfo"]').val();		//航空公司name
		keys['fare']=$('.AIRexport div#inputORD form#busyCode div.inputOrder table input[name="fare"]').val();			//运价
		keys['extra']=$('.AIRexport div#inputORD form#busyCode div.inputOrder table input[name="extra"]').val();				//附加费
		keys['extraProvision']=$('.AIRexport div#inputORD form#busyCode div.inputOrder table input[name="extraProvision"]').val();			//附加费条款
    	/*alert(examinStatus);*/
    	judgeVo['keys']=keys;
    	$.ajax({
    		type : 'post',
		    async: false,
		    url : getShipContextPath()+'workflow/audit.do',
		    data:JSON.stringify(judgeVo),
		    dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
		    success:function(data){
		    	// 移除缓存
                window.localStorage.removeItem('jsonData_customer');
                
                /*隐藏模态框*/
		    	$('.AIRexport div#examin').modal('hide');
		    	/*$("#tab_tab_16").empty();
                $("#tab_tab_16").remove();
                $("#tab_16").remove();
                $(".AIRexport").remove();
                $('.modal-backdrop').hide();*/
                
                 /*显示工作台*/
                /*$('#tab_10').addClass('active');*/
                if (data.code == 0) {
                    callAlert("操作成功");
                } else {
                    alert("操作失败");
                }
                hideMask();
		    	
		    }
    	});
    	AIRinputorder.askData(id);
    }
    function showPriceModal(){
    	/*判断界面是否有修改*/
    	AIRexport.isChange();
    	
    	$('.AIRexport div#priceModal input:radio[name="standard"]').get(0).checked=false;
    	$('.AIRexport div#priceModal input:radio[name="standard"]').get(1).checked=false;
    	$('.AIRexport div#priceModal input:radio[name="standard"]').get(2).checked=false;
    	$('.AIRexport div#priceModal input:radio[name="standard"]').get(3).checked=false;
    	$('.AIRexport div#priceModal input:radio[name="standard"]').get(4).checked=false;
    	$('.AIRexport div#priceModal input:radio[name="standard"]').get(5).checked=false;
    	$('.AIRexport div#priceModal input:radio[name="standard"]').get(6).checked=false;
    	/*再次请求数据*/
    	var id=$('.AIRexport ul.Big li.active').attr('billId');
    	AIRinputorder.askData(id);
    	console.log(freData);
    	
    	var i=0;
        for(key in freData){
            console.log(freData[key]);
            if(freData[key]){

            }else{
                i++;
            }
        }
        console.log(i);
        if(i===0){
            console.log('请求运价数据');
            $.ajax({
                type:'post',
                /*async:false,*/
                url:getContextPath()+'/freightAirQuotation/getCustomerFreight.do',
                data:{'keys':JSON.stringify(freData)},
                success:function (data) {
                	if(data){
                		var priceData = JSON.parse(data);
                    console.log(priceData);
                    /*alert(data);*/
                    var priceM=priceData["priceM"];
                    var priceN=priceData["priceN"];
                    var price45=priceData["price45"];
                    var price100=priceData["price100"];
                    var price300=priceData["price300"];
                    var price500=priceData["price500"];
                    var price1000=priceData["price1000"];
                    /*附加费*/
                    var warRiskCharge=priceData["warRiskCharge"];
                    var fuelCharge=priceData["fuelCharge"];
                    var otherCharge=priceData["otherCharge"];
                    extraCharge=warRiskCharge+fuelCharge+otherCharge;
                    $('.AIRexport div#priceModal').find('input[name="priceM"]').val(priceM).trigger('change');
                    $('.AIRexport div#priceModal').find('input[name="priceN"]').val(priceN).trigger('change');
                    $('.AIRexport div#priceModal').find('input[name="price45"]').val(price45).trigger('change');
                    $('.AIRexport div#priceModal').find('input[name="price100"]').val(price100).trigger('change');
                    $('.AIRexport div#priceModal').find('input[name="price300"]').val(price300).trigger('change');
                    $('.AIRexport div#priceModal').find('input[name="price500"]').val(price500).trigger('change');
                    $('.AIRexport div#priceModal').find('input[name="price1000"]').val(price1000).trigger('change');
                    /*附加费*/
                    $('.AIRexport div#priceModal').find('input[name="warRiskCharge"]').val(warRiskCharge).trigger('change');
                    $('.AIRexport div#priceModal').find('input[name="fuelCharge"]').val(fuelCharge).trigger('change');
                    $('.AIRexport div#priceModal').find('input[name="otherCharge"]').val(otherCharge).trigger('change');
                    $('.AIRexport div#priceModal').modal('show');
                    /*$('.FCLexport div#bookingSpace input[name="bookFreight"]').val(data);*/
                	}else{
                		callAlert('查询不到该条运价数据');
                	}
                }
            })
        }else{
        	/*$('.AIRexport #priceResultModal').modal('show');*/
        	callAlert('请将数据填写完整');
        }
    }
    function getPriceButton(){
    	var transport_price=$('.AIRexport div#priceModal input[name="standard"]:checked').parent().parent().find('input.value').val();
    	/*alert(transport_price);*/
    	$('.AIRexport div#inputORD').find('input[name="fare"]').val(transport_price).trigger('change');
    	$('.AIRexport div#inputORD').find('input[name="extra"]').val(extraCharge).trigger('change');
    	$('.AIRexport div#priceModal').modal('hide');
    }
	return {
		initBaseData:initBaseData,
		askData:askData,
		saveInputorder:saveInputorder,
		majorConsignor:majorConsignor,
		branchConsignor:branchConsignor,
		majorConsignee:majorConsignee,
		branchConsignee:branchConsignee,
		majorContact:majorContact,
		branchContact:branchContact,
		addCus:addCus,
		delCus:delCus,
		selTR:selTR,
		selCustomer:selCustomer,
		examin:examin,
		examinSubmit:examinSubmit,
		showPriceModal:showPriceModal,
		getPriceButton:getPriceButton,
		submitInputorder:submitInputorder,
		customerSearch:customerSearch
	};
})();
$(function() {
	//中文货名 英文货名 唛头title提示
	$('.AIRexport div#inputORD').on('change','input[name="chineseCargo"],input[name="englishCargo"],input[name="cargoCode"]',function () {
		$(this).attr('title',$(this).val());
    })

	//预计离港
	$('.AIRexport div#inputORD input.Time.must').on('change',function () {
		if($(this).val()){
			$(this).removeClass('error').addClass('valid');
		}
    });
	//监听内容页面是否修改
    $('.AIRexport div#inputORD').on('change','section input,section textarea,section select',function () {
        $('.AIRexport div.ZLmain>ul.nav-tabs>li.inputORD').attr('changed',true);
    })
    //商务调度操作 关联问题
	$('.AIRexport div#inputORD select.IdAndName').on('change',function () {
		if($(this).val()){
			$(this).removeClass('error').addClass('valid');
			$(this).parent('td').find('span').removeClass('error');
			if($(this).find('option:selected').text()){
                $(this).parent('td').find('input').val($(this).find('option:selected').text()).trigger('change');
            }
		}

    })
    /*$('select.bookShipCompany').on('change',function () {
        console.log($(this).val());
        console.log($(this).val().split(' '));
        var strArr=$(this).val().split(' ');
        $(this).parent('td').find('input:eq(0)').val(strArr[0]);
        $(this).parent('td').find('input:eq(1)').val(strArr[2].split('(')[1].split(')')[0]);
    })*/
	//委托人详细信息
	/*$('.AIRexport span.showClientDetail').on('click',function(e){
        	//阻止冒泡
            if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
            /!*$("div.modalDIVSmall").css('display','none');*!/
            /!*$('.AIRexport div.modalDIV').css('display','none');*!/
            $('.AIRexport div.clientDetail').css('display','block');                  	
        })*/
	 //委托人div点击选中一行
     /*$('.AIRexport div.clientDetail table tbody').on('click','tr.newTRMT>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
        	$('.AIRexport div.clientDetail table tbody').find('tr').css('background','transparent').removeClass('sel');
        	$(this).parent('tr.newTRMT').css('background','lightblue').addClass('sel');
        });*/
    /*委托人div双击进行赋值*/
    /*  $('.AIRexport div.clientDetail div table.smallTable tbody').on('dblclick','tr.sel',function () {
	//	  alert('点击了委托人');
		  /!*var code=$(this).find('td:eq(0)').text();*!/
		  var id=$(this).attr('customerId');
		  var code=$(this).find('td:eq(0)').text();
		  var name=$(this).find('td:eq(1)').text();
		  //var cusName=$(this).find('td:eq(2)').text();
		  var salesmanName=$(this).find('td[name="salesmanName"]').text();//销售
		  var servicePersonName=$(this).find('td[name="servicePersonName"]').text();//客服
		  $(this).parents('td').find('>input:eq(0)').val(code).trigger('change');
		  $(this).parents('td').find('>input:eq(1)').val(name).trigger('change');
		  $(this).parents('td').find('>input:eq(2)').val(id).trigger('change');
		  console.log(id);
		  //$(this).parents('td').find('>input:eq(3)').val(cusName);
		  $(this).parents('table.table').find('input[name="salesmanName"]').val(salesmanName).trigger('change');
		  $(this).parents('table.table').find('input[name="majorPeopleOne"]').val(servicePersonName).trigger('change');
          var customerId=$(this).attr("customerId");
          if(customerId){
              $.ajax({
                  type:'post',
                  url:getContextPath()+'saleCustomerEmployee/getOperatorByCustomerId.do',
                  data:{"customerId":customerId},
                  /!*success:function(data){
                   //   alert('holaholahola');
                      $('.AIRexport #inputORD #customerService select[name="majorOperate"]').empty();
                      var data=JSON.parse(data);
                      console.log(data);
                      AIRentrust.Operator=data;
                      console.log(data.length);
                      for(var i=0;i<data.length;i++){
                          var opt='<option value='+data[i]['operator']+'>'+data[i]['operator']+'</option>';
                          $('.AIRexport #inputORD #customerService select[name="majorOperate"]').append(opt);
                      }
                      console.log(AIRentrust.Operator[0]);
					  if(AIRentrust.Operator[0]==undefined){

					  }else{
                          $('.AIRexport #inputORD #customerService table tbody').find('tr td input[name="contactPhone"]').val(AIRentrust.Operator[0]['mobile']);
                      }

                  }*!/
              })
		  }else{

		  }
		  AIRexport.closeDetail('.clientDetail');
      })*/
    /*主单发货人的双击赋值*/
    $('.AIRexport div.ZDFHR table.smallTable tbody').on('dblclick','tr',function(){
    	var majorShipperCode=$(this).find('td:eq(0)').text();
    	var majorShipperInfo=$(this).find('td:eq(1)').text();
    	$('.AIRexport div#inputORD input[name="majorShipperCode"]').val(majorShipperCode).trigger('change').removeClass('error').addClass('valid');
    	$('.AIRexport div#inputORD textarea[name="majorShipperInfo"]').val(majorShipperInfo).trigger('change').removeClass('error').addClass('valid');
    	AIRexport.closeDetail('.ZDFHR');
    })
    /*分单发货人的双击赋值*/
   $('.AIRexport div.FDFHR table.smallTable tbody').on('dblclick','tr',function(){
    	var branchShipperCode=$(this).find('td:eq(0)').text();
    	var branchShipperInfo=$(this).find('td:eq(1)').text();
    	$('.AIRexport div#inputORD input[name="branchShipperCode"]').val(branchShipperCode).trigger('change');
    	$('.AIRexport div#inputORD textarea[name="branchShipperInfo"]').val(branchShipperInfo).trigger('change');
    	AIRexport.closeDetail('.FDFHR');
    })
   /*主单收货人的双击赋值*/
    $('.AIRexport div.ZDSHR table.smallTable tbody').on('dblclick','tr',function(){
    	var majorRecieveCode=$(this).find('td:eq(0)').text();
    	var majorRecieveInfo=$(this).find('td:eq(1)').text();
    	$('.AIRexport div#inputORD input[name="majorRecieveCode"]').val(majorRecieveCode).trigger('change').removeClass('error').addClass('valid');
    	$('.AIRexport div#inputORD textarea[name="majorRecieveInfo"]').val(majorRecieveInfo).trigger('change').removeClass('error').addClass('valid');
    	AIRexport.closeDetail('.ZDSHR');
    })
    /*分单收货人的双击赋值*/
    $('.AIRexport div.FDSHR table.smallTable tbody').on('dblclick','tr',function(){
    	var branchRecieveCode=$(this).find('td:eq(0)').text();
    	var branchRecieveInfo=$(this).find('td:eq(1)').text();
    	$('.AIRexport div#inputORD input[name="branchRecieveCode"]').val(branchRecieveCode).trigger('change');
    	$('.AIRexport div#inputORD textarea[name="branchRecieveInfo"]').val(branchRecieveInfo).trigger('change');
    	AIRexport.closeDetail('.FDSHR');
    })
    /*主单通知人的双击赋值*/
   $('.AIRexport div.ZDTZR table.smallTable tbody').on('dblclick','tr',function(){
    	var majorNotifierCode=$(this).find('td:eq(0)').text();
    	var majorNotifierInfo=$(this).find('td:eq(1)').text();
    	$('.AIRexport div#inputORD input[name="majorNotifierCode"]').val(majorNotifierCode).trigger('change');
    	$('.AIRexport div#inputORD textarea[name="majorNotifierInfo"]').val(majorNotifierInfo).trigger('change');
    	AIRexport.closeDetail('.ZDTZR');
    })
   /*分单通知人的双击赋值*/
    $('.AIRexport div.FDTZR table.smallTable tbody').on('dblclick','tr',function(){
    	var branchNotifierCode=$(this).find('td:eq(0)').text();
    	var branchNotifierInfo=$(this).find('td:eq(1)').text();
    	$('.AIRexport div#inputORD input[name="branchNotifierCode"]').val(branchNotifierCode).trigger('change');
    	$('.AIRexport div#inputORD textarea[name="branchNotifierInfo"]').val(branchNotifierInfo).trigger('change');
    	AIRexport.closeDetail('.FDTZR');
    })
    //监听select的change
    $('div.AIRexport select.select2.absOpacity').on('change',function () {
        var id=Number($(this).val());
        console.log($('.AIRexport div.'+$(this).attr('trig')+' table tbody tr:eq('+id+') td'));
        $('.AIRexport div.'+$(this).attr('trig')+' table tbody tr:eq('+id+') td').trigger('click');

    })
     //装货港   下拉条点击后给input赋值
    $('.AIRexport div.entrLoading.ZHG table.smallTable tbody').on('click','tr.newTR>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
         	$('.AIRexport div.entrLoading.ZHG table.smallTable tbody').find('tr').css('background','transparent');
        	$(this).parent('tr.newTR').css('background','rgb(214,237,247)');
        	var en_name=$(this).parent('tr.newTR').find('td[name="port_name"]').text();
        	var code=$(this).parent('tr.newTR').find('td[name="port_code"]').text();
        	var id=$(this).parent('tr.newTR').find('td[name="port_id"]').text();
        	console.log("装货港code"+code);
        	$('.AIRexport input[name="loadId"]').val(id).trigger('change').removeClass('error').addClass('valid');
        	$('.AIRexport input[name="loadCode"]').val(code).trigger('change').removeClass('error').addClass('valid');
        	$('.AIRexport input[name="loadInfo"]').val(en_name).trigger('change').removeClass('error').addClass('valid');
        })
    //目的地   下拉条点击后给input赋值
    $('.AIRexport div.entrDestDock.MDD table.smallTable tbody').on('click','tr.newTRMT>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
         	$('.AIRexport div.entrDestDock.MDD table.smallTable tbody').find('tr').css('background','transparent');
        	$(this).parent('tr.newTRMT').css('background','rgb(214,237,247)');
        	var en_name=$(this).parent('tr.newTRMT').find('td[name="port_name"]').text();
        	var code=$(this).parent('tr.newTRMT').find('td[name="port_code"]').text();
        	var id=$(this).parent('tr.newTRMT').find('td[name="port_id"]').text();
        	console.log("目的地code"+code);
        	$('.AIRexport input[name="terminiCode"]').val(code).trigger('change').removeClass('error').addClass('valid');
        	$('.AIRexport input[name="terminiInfo"]').val(en_name).trigger('change').removeClass('error').addClass('valid');
        	$('.AIRexport input[name="terminiId"]').val(id).trigger('change').removeClass('error').addClass('valid');
        })
    //航线    下拉条点击后给input赋值
    $('.AIRexport div.entrRouteCode.HX table.smallTable tbody').on('click','tr.newTRMT>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
         	$('.AIRexport div.entrRouteCode.HX table.smallTable tbody').find('tr').css('background','transparent');
        	$(this).parent('tr.newTRMT').css('background','rgb(214,237,247)');
        	var en_name=$(this).parent('tr.newTRMT').find('td[name="service_line_name_cn"]').text();
        	var code=$(this).parent('tr.newTRMT').find('td[name="service_line_id"]').text();
        	$('.AIRexport input[name="routeId"]').val(code).trigger('change');
        	$('.AIRexport input[name="routeInfo"]').val(en_name).trigger('change');
        })
    //订舱方    下拉条点击后给input赋值
    $('.AIRexport div.orderPer.DCF table.smallTable tbody').on('click','tr.newTR>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
         	$('.AIRexport div.orderPer.DCF table.smallTable tbody').find('tr').css('background','transparent');
        	$(this).parent('tr.newTR').css('background','rgb(214,237,247)');
        	var en_name=$(this).parent('tr.newTR').find('td[name="port_name"]').text();
        	var code=$(this).parent('tr.newTR').find('td[name="port_code"]').text();
        	$('.AIRexport input[name="orderId"]').val(code).trigger('change');
        	$('.AIRexport input[name="orderInfo"]').val(en_name).trigger('change');
        })
    //航空公司   下拉条点击后给input赋值
    $('.AIRexport div.airCompany.HKGS table.smallTable tbody').on('click','tr.newTRMT>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
         	$('.AIRexport div.airCompany.HKGS table.smallTable tbody').find('tr').css('background','transparent');
        	$(this).parent('tr.newTRMT').css('background','rgb(214,237,247)');
        	var en_name=$(this).parent('tr.newTRMT').find('td[name="airline_name"]').text();
        	var code=$(this).parent('tr.newTRMT').find('td[name="airline_id"]').text();
        	$('.AIRexport input[name="airplaneId"]').val(code).trigger('change');
        	$('.AIRexport input[name="airplaneInfo"]').val(en_name).trigger('change');
        })
	// 主单发货人详细信息选择一行
	$('.AIRexport div.majorConsignor table tbody').on('click','tr>td',function(e) {
				if (e.stopPropagation) {
					e.stopPropagation();
				} else {
					e.cancelBubble = true;
				}
				$('.AIRexport div.majorConsignor table tbody').find('tr').css(
						'background', 'transparent').removeClass('sel');
				$(this).parent('tr').css('background', 'lightblue').addClass(
						'sel');
			});
	// 分单发货人详细信息选择一行
	$('.AIRexport div.branchConsignor table tbody').on('click','tr>td',function(e) {
				if (e.stopPropagation) {
					e.stopPropagation();
				} else {
					e.cancelBubble = true;
				}
				$('.AIRexport div.branchConsignor table tbody').find('tr').css(
						'background', 'transparent').removeClass('sel');
				$(this).parent('tr').css('background', 'lightblue').addClass(
						'sel');
			});
	// 主单收货人详细信息选择一行
	$('.AIRexport div.majorConsignee table tbody').on('click','tr>td',function(e) {
				if (e.stopPropagation) {
					e.stopPropagation();
				} else {
					e.cancelBubble = true;
				}
				$('.AIRexport div.majorConsignee table tbody').find('tr').css(
						'background', 'transparent').removeClass('sel');
				$(this).parent('tr').css('background', 'lightblue').addClass(
						'sel');
			});
	// 分单收货人详细信息选择一行
	$('.AIRexport div.branchConsignee table tbody').on('click','tr>td',function(e) {
				if (e.stopPropagation) {
					e.stopPropagation();
				} else {
					e.cancelBubble = true;
				}
				$('.AIRexport div.branchConsignee table tbody').find('tr').css(
						'background', 'transparent').removeClass('sel');
				$(this).parent('tr').css('background', 'lightblue').addClass(
						'sel');
			});
	// 主单通知人详细信息选择一行
	$('.AIRexport div.majorContact table tbody').on('click','tr>td',function(e) {
				if (e.stopPropagation) {
					e.stopPropagation();
				} else {
					e.cancelBubble = true;
				}
				$('.AIRexport div.majorContact table tbody').find('tr').css(
						'background', 'transparent').removeClass('sel');
				$(this).parent('tr').css('background', 'lightblue').addClass(
						'sel');
			});
	// 分单通知人详细信息选择一行
	$('.AIRexport div.branchContact table tbody').on('click','tr>td',function(e) {
				if (e.stopPropagation) {
					e.stopPropagation();
				} else {
					e.cancelBubble = true;
				}
				$('.AIRexport div.branchContact table tbody').find('tr').css(
						'background', 'transparent').removeClass('sel');
				$(this).parent('tr').css('background', 'lightblue').addClass(
						'sel');
			});
	/*件数单位赋值*/
	$('.AIRexport #select_4').on('change',function(){
		//必填项
    	var content=$('.AIRexport #select_4').find('option:selected').text();
    	$('.AIRexport div#inputORD input[name="majorQuantityUnit"]').val(content).trigger('change').removeClass('error').addClass('valid');
    });
    $('.AIRexport #select_5').on('change',function(){
    	var content=$('.AIRexport #select_5').find('option:selected').text();
    	$('.AIRexport div#inputORD input[name="branchQuantityUnit"]').val(content).trigger('change');
    });
})
