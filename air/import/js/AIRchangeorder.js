//@ sourceURL=AIRchangeorder.js
var AIRchangeorder=(function(){
    var initNum=0;
	var tarff=[];
	function askData(id){
		// 向后台请求数据
		$.ajax({
					type : 'post',
					url : '/SeawinWebappBase/airBillSwitchImportController/searchById.do',
					data : {
						"id" : id
					},
					success : function(data) {
						 data = JSON.parse(data);
						// 循环给表单赋值
						$.each($('.AIRimport form#changeOrder').find('input,textarea,select'),
										function(i, input) {
											if ($(this).attr("name")) {
												$(this).val(data[$(this).attr("name")]);
											} else {
												// 不需要替换
											}
										});
						console.log(data['customsRemindDocNo']);
						console.log(data['customsRemindMoney']);
						console.log(data['customsRemindEmail']);
						$('.AIRimport #tariffInfo').attr('switchBillId',data['switchBillId']);
						/*$('.AIRimport #tariffInfo table.ZJ').find('input').each(function () {
							console.log($(this));
							$(this).val(data[$(this).attr('name')]);
                        })*/
						if(initNum==0){
                            AIRchangeorder.domBind();
                            initNum++;
                        }else{

                        }
                        $('.AIRimport div.ZLmain>ul.nav-tabs>li.importChangeOrder').attr('changed',false);
                    }
				})
		//关税类型
		$.ajax({
			type:'post',
			url:getContextPath()+'redisController/listIdNameByName.do?name=basedataCommonSet_76',
			data:{},
			success:function (data) {
				console.log(data);
				data=JSON.parse(data);
				for(var i=0;i<data.length;i++){
					console.log(data[i]);
					for(key in data[i]){
						AIRchangeorder.tarff.push({'id':key,'text':data[i][key]})
					}
				}
				console.log(AIRchangeorder.tarff);
            }
		})
	}
	// 保存按钮
	function saveChangeorder(liId) {
		var isFull=false;
		$('.AIRimport #changeOrder').find("input[class='must']").each(function(){
			if($(this).val()==""){
				$(this).parents("tr").css("border","1px solid red");
			}
		})
		$.ajax({
					type : "POST",
					url : '/SeawinWebappBase/airBillSwitchImportController/updateById.do',
					async: false,
					contentType : "application/json;charset=UTF-8",
					data : function() {
						search_busyCode = $('.AIRimport #changeOrder').serializeObject();
						var switchVo = {};
						switchVo = {
							'billImportId' : liId
						};
						for ( var key in search_busyCode) {
							switchVo[key] = search_busyCode[key];
						};
						return JSON.stringify(switchVo);
					}(),
					success : function(data) {
						var res = JSON.parse(data);
						if (res.status == 1) {
							callAlert("成功！");
							//callSuccess("保存成功！");
                            $('.AIRimport div.ZLmain>ul.nav-tabs>li.importChangeOrder').attr('changed',false);
                            if($('.AIRimport div.ZLmain>ul>li.importChangeOrder').hasClass('active')){
                                AIRchangeorder.askData(liId);
                            }else{

                            }

						} else if (res.status == 0) {
							alert("失败！");
							//callAlert("保存失败！");
						}

					}
				});
	}
	//发送邮件
	function sendEmail(){
		var name = JSON.parse($.cookie('loginingEmployee'))['user']['username'];
		var emailContent=$('.AIRimport #declareMailForm').serializeObject();//序列化表单
		var sendContent='单号: '+emailContent['billNumber']+'; '+'关税1: '+emailContent['tariffOne']+'; '+'关税2: '+emailContent['tariffTwo']+'; '+'总额: '+emailContent['tariffSum'];
		var email=$('.AIRimport #declareMailForm input[name="email"]').val();//获取邮箱
		delete emailContent['email'];
        $.ajax({
           type: 'post',
           url:getShipContextPath() + 'email/sendemail.do',
           data:{
               content:sendContent,
               toMail:email,
               from:name
           },
           success:function(data){
           	   $('.AIRimport div#tariffInfo').modal('hide');
               callAlert('发送成功');
           },
           error:function(data){

           }
        })
	}
    //设置提醒 获取
    function getSetUp(){
	    var businessId=$('.AIRimport ul.Big li.active').attr('billId');
        $.ajax({
            url:getContextPath()+'seawinremind/search.do',
            type:'POST',
            data:{'businessId':businessId,'businessType':1,'type':1},
            success:function (data) {
                console.log(data);
                if(data){
                    data=JSON.parse(data);
                    data['remindUserType']?data['remindUserType']=data['remindUserType'].split(','):data['remindUserType'];
                    console.log(data['remindUserType']);
                    //开始提醒
                    $('.AIRimport div#setUp input[name="advanceTimeType"]').each(function(){
                        if($(this).val()==data['advanceTimeType']){
                            $(this).prop('checked','checked');
                        }else{
                            $(this).removeAttr('checked');
                        }
                    });
                    //提醒频率
                    $('.AIRimport div#setUp input[name="frequencyType"]').each(function () {
                        if($(this).val()==data['frequencyType']){
                            $(this).prop('checked','checked');
                        }else{
                            $(this).removeAttr('checked');
                        }
                    });
                    //提醒人员
                    $('.AIRimport div#setUp input[name="remindUserType"]').each(function () {
                        if(data['remindUserType'].indexOf($(this).val())==-1){
                            $(this).removeAttr('checked');
                        }else{
                            $(this).prop('checked','checked');
                        }
                    })
                    //不再提醒
                    if(data['confirmStatus']=='1'){
                        $('.AIRimport div#setUp input[name="confirmStatus"]').prop('checked','checked');
                    }else{
                        $('.AIRimport div#setUp input[name="confirmStatus"]').removeAttr('checked');
                    }
                    if(data['remindId']){
                        $('.AIRimport div#setUp input[name="remindId"]').val(data['remindId']);
                    }else {
                        $('.AIRimport div#setUp input[name="remindId"]').val('');
                    }
                }else{
                    //开始提醒
                    $('.AIRimport div#setUp input[name="advanceTimeType"]').each(function(){
                            $(this).removeAttr('checked');
                    });
                    //提醒频率
                    $('.AIRimport div#setUp input[name="frequencyType"]').each(function () {
                            $(this).removeAttr('checked');
                    });
                    //提醒人员
                    $('.AIRimport div#setUp input[name="remindUserType"]').each(function () {
                            $(this).removeAttr('checked');
                    })
                    //不再提醒
                    $('.AIRimport div#setUp input[name="confirmStatus"]').removeAttr('checked');
                    //默认第一个选中
                    $('.AIRimport div#setUp input[name="advanceTimeType"]:first').prop('checked','checked');
                    $('.AIRimport div#setUp input[name="frequencyType"]:first').prop('checked','checked');
                    $('.AIRimport div#setUp input[name="remindUserType"]:first').prop('checked','checked');
                    $('.AIRimport div#setUp input[name="remindId"]').val('');
                }
            }

        })
    }
    //设置提醒 提交
    function submitSetUp(){
        var obj={};
        obj['type']=1;
        obj['businessId']=$('.AIRimport ul.Big li.active').attr('billId');
        obj['businessType']=1;
        var arr=[];
        $('.AIRimport div#setUp input[name="remindUserType"]:checked').each(function () {
            arr.push($(this).val());
        });
        obj['remindUserType']=arr.join();//提醒人员
        obj['advanceTimeType']=$('.AIRimport div#setUp input[name="advanceTimeType"]:checked').val();//开始提醒
        obj['frequencyType']=$('.AIRimport div#setUp input[name="frequencyType"]:checked').val();//提醒频率
        obj['remindId']=$('.AIRimport div#setUp input[name="remindId"]').val();
        if($('.AIRimport div#setUp input[name="confirmStatus"]')[0].checked){
            obj['confirmStatus']=1;
        }else{
            obj['confirmStatus']=0;
        }
        obj['endTime']=$('.AIRimport div#importDetailPage div#changeORD input[name="bondExpire"]').val();
        $.ajax({
            url:getContextPath()+'seawinremind/insert.do',
            type:'POST',
            data:{'seawinremind':JSON.stringify(obj)},
            success:function (data) {
                console.log(data);
                data=JSON.parse(data);
                callAlert(data['message']);
            }
        })
    }
	function domBind() {
        //监听内容页面是否修改
        $('.AIRimport div#changeORD').on('change','section input,section textarea,section select',function () {
            $('.AIRimport div.ZLmain>ul.nav-tabs>li.importChangeOrder').attr('changed',true);
        });
        $('.AIRimport #select_declarationPort').on('change',function(){
            var content=$(this).find('option:selected').text();
            var code=content.split('|')[0];
            var name=content.split('|')[1];
            $('.AIRimport input[name="declarationPortCode"]').val(code);
            $('.AIRimport input[name="declarationPortName"]').val(name);
        })
        //换单方赋值
        $('.AIRimport div#changeORD select.customsBrokerSel,' +
            '.AIRimport #changeORD select[name ="clearancePartyId"],' +
            '.AIRimport #changeORD select[name ="threePartyId"]').on('change',function(){
            var customerText=$(this).find('option:selected').text();
            var target=' | ';
            var billSwitchCode=customerText.split(' | ')[0];
            var billSwitchName=customerText.split(' | ')[1];
            $(this).parent('td').find('input:eq(0)').val(billSwitchCode);
            $(this).parent('td').find('input:eq(1)').val(billSwitchName);
           /* $('.AIRimport div#changeORD input[name="billSwitchCode"]').val(billSwitchCode);
            $('.AIRimport div#changeORD input[name="billSwitchName').val(billSwitchName);*/
        });
        //获取关税提醒的数据改变
        $('.AIRimport #tariffInfo table.ZJ').find('input').on('change',function () {
            $('.AIRimport div#changeORD input[name="'+$(this).attr('name')+'"]').val($(this).val());
        })
        //计算关税总额
        $('.AIRimport div#tariffInfo div table').on('input','tbody input[name="amountMoney"]',function(){
            var sum=0;
           $(this).parent('td').parent('tr').parent('tbody').find('tr.active').each(function (index,ele) {
               if(Number($(ele).find('input[name="amountMoney"]').val())){
                   sum=sum+Number($(ele).find('input[name="amountMoney"]').val());
               }else{

               }
           })
            $('.AIRimport #tariffInfo table.ZJ input[name="customsRemindMoney"]').val(sum);
        });
        //获取关税提醒数据
        $('.AIRimport #tariffInfo').on('show.bs.modal',function () {
            $.ajax({
                url:getContextPath()+'airBillSwitchImportController/getCustomsRemind.do',
                type:'POST',
                data:{'switchBillId':$(this).attr('switchBillId')},
                success:function (data) {
                    $('.AIRimport div#tariffInfo table.detail tbody').empty();
                    console.log(data);
                    data=JSON.parse(data);
                    $('.AIRimport #tariffInfo table.ZJ').find('input').each(function () {
                        console.log($(this));
                        $(this).val(data[$(this).attr('name')]);
                    });
                    if(data['seawinCustomsReminds']){
                        var seawinCustomsReminds=data['seawinCustomsReminds'];
                        if(seawinCustomsReminds.length>=1){
                            //这里遍历数组 为table添加数据
							for(var i=0;i<seawinCustomsReminds.length;i++){
                                var tr='<tr class="active" exchange_operate="" customsRemindId="'+seawinCustomsReminds[i]['customsRemindId']+'">' +
										'<td></td>' +
										'<td>' +
											'<select class="form-control" name="type" style="width: 160px;"></select>' +
										'</td>' +
										'<td>' +
											'<input class="form-control" type="text" name="amountMoney" value="'+(seawinCustomsReminds[i]['amountMoney']?seawinCustomsReminds[i]['amountMoney']:0)+'">' +
										'</td>' +
									'</tr>';
                                $('.AIRimport div#tariffInfo table.detail tbody').append(tr);
                                $('.AIRimport div#tariffInfo table.detail tbody tr:last').find('select').select2({
                                    data:AIRchangeorder.tarff,
                                    placeholder:''
								}).val(seawinCustomsReminds[i]['type']).trigger('change');
							}
                            $('.AIRimport div#tariffInfo table.detail tbody').find('tr.active').each(function (index,tr) {
                                $(this).find('td:first').text(index+1);
                            })
                        }else{

                        }
					};
                    $('.AIRimport div#tariffInfo').attr('changed',false);

                }
            });
        });
        $('.AIRimport div#tariffInfo').on('hide.bs.modal',function () {
           // $('.AIRimport div#tariffInfo span.save').trigger('click');
				if($('.AIRimport div#tariffInfo').attr('changed')=='true'){
					var con=confirm('是否要保存您的修改？');
					if(con){
                        var submitOBJ={};
                        var seawinCustomsReminds=[];
                        $('.AIRimport div#tariffInfo div table.detail tbody tr').each(function () {
                            var obj={};
                            obj['exchange_operate']=$(this).attr('exchange_operate');
                            obj['type']=$(this).find('select[name="type"]').val();
                            obj['amountMoney']=$(this).find('input[name="amountMoney"]').val();
                            obj['customsRemindId']=$(this).attr('customsRemindId');
                            seawinCustomsReminds.push(obj);
                        });
                        submitOBJ['seawinCustomsReminds']=seawinCustomsReminds;
                        submitOBJ['switchBillId']=$(this).parents('div#tariffInfo').attr('switchBillId');
                        submitOBJ['customsRemindDocNo']=$(this).parents('div#tariffInfo').find('table.ZJ').find('input[name="customsRemindDocNo"]').val();
                        submitOBJ['customsRemindMoney']=$(this).parents('div#tariffInfo').find('table.ZJ').find('input[name="customsRemindMoney"]').val();
                        submitOBJ['customsRemindEmail']=$(this).parents('div#tariffInfo').find('table.ZJ').find('input[name="customsRemindEmail"]').val();
                        //保存页面修改
                        $.ajax({
                            url:getContextPath()+'airBillSwitchImportController/updateCustomsRemind.do',
                            type:'POST',
                            contentType : "application/json;charset=UTF-8",
                            data:JSON.stringify(submitOBJ),
                            success:function (data) {
                                data=JSON.parse(data);
                                console.log(data);
                                if(data['code']){
                                    callAlert('保存成功！');
                                    $('.AIRimport div#tariffInfo').attr('changed',false);
                                    //保存成功再次请求数据
                                }else {
                                    callAlert('保存失败！');
                                }
                            }
                        });
					}
				}else{

				}

        })
		//关税提醒 新增
		$('.AIRimport div#tariffInfo span.add').on('click',function () {
			var tr='<tr class="active" exchange_operate="insert" customsRemindId="">' +
                        '<td></td>' +
                        '<td>' +
                            '<select class="form-control" name="type" style="width: 160px;">' +
                            '</select>' +
                        '</td>' +
                        '<td>' +
                            '<input class="form-control" type="text" name="amountMoney">' +
                        '</td>' +
                    '</tr>';
			$('.AIRimport div#tariffInfo table.detail tbody').prepend(tr);
            $('.AIRimport div#tariffInfo table.detail tbody').find('tr:first').find('select[name="type"]').select2({
				data:AIRchangeorder.tarff,
				placeholder:''
			})
            $('.AIRimport div#tariffInfo table.detail tbody').find('tr.active').each(function (index,tr) {
				$(this).find('td:first').text(index+1);
            });
            $('.AIRimport div#tariffInfo').attr('changed',true);
        });
        //关税提醒 删除
		$('.AIRimport div#tariffInfo span.minus').on('click',function () {
           var tr=$('.AIRimport div#tariffInfo table.detail tbody tr.sel');
           if(tr.length==1){
				if(tr.attr('exchange_operate')=='insert'){
					tr.remove();
				}else{
					tr.removeClass('active').attr('exchange_operate','delete').css('display','none');
				}
               $('.AIRimport div#tariffInfo table.detail tbody').find('tr.active').each(function (index,tr) {
                   $(this).find('td:first').text(index+1);
               });
               $('.AIRimport div#tariffInfo').attr('changed',true);
		   }else{
          	 	callAlert('请选择要操作的数据');
		   }
        });
		//关税提醒 保存按钮
		$('.AIRimport div#tariffInfo span.save').on('click',function () {
			var submitOBJ={};
			var seawinCustomsReminds=[];
			$('.AIRimport div#tariffInfo div table.detail tbody tr').each(function () {
				var obj={};
				obj['exchange_operate']=$(this).attr('exchange_operate');
				obj['type']=$(this).find('select[name="type"]').val();
				obj['amountMoney']=$(this).find('input[name="amountMoney"]').val();
				obj['customsRemindId']=$(this).attr('customsRemindId');
				seawinCustomsReminds.push(obj);
            });
			submitOBJ['seawinCustomsReminds']=seawinCustomsReminds;
			submitOBJ['switchBillId']=$(this).parents('div#tariffInfo').attr('switchBillId');
			submitOBJ['customsRemindDocNo']=$(this).parents('div#tariffInfo').find('table.ZJ').find('input[name="customsRemindDocNo"]').val();
			submitOBJ['customsRemindMoney']=$(this).parents('div#tariffInfo').find('table.ZJ').find('input[name="customsRemindMoney"]').val();
			submitOBJ['customsRemindEmail']=$(this).parents('div#tariffInfo').find('table.ZJ').find('input[name="customsRemindEmail"]').val();
            //保存页面修改
            $.ajax({
                url:getContextPath()+'airBillSwitchImportController/updateCustomsRemind.do',
                type:'POST',
                contentType : "application/json;charset=UTF-8",
                data:JSON.stringify(submitOBJ),
                success:function (data) {
                	data=JSON.parse(data);
                    console.log(data);
                    if(data['code']!=1){
                    	callAlert('保存成功！');
                        $('.AIRimport div#tariffInfo').attr('changed',false);
                    	//保存成功再次请求数据
                      /*  $.ajax({
                            url:getContextPath()+'airBillSwitchImportController/getCustomsRemind.do',
                            type:'POST',
                            data:{'switchBillId':$(this).attr('switchBillId')},
                            success:function (data) {
                                $('.AIRimport div#tariffInfo table.detail tbody').empty();
                                console.log(data);
                                data=JSON.parse(data);
                                $('.AIRimport #tariffInfo table.ZJ').find('input').each(function () {
                                    console.log($(this));
                                    $(this).val(data[$(this).attr('name')]);
                                });
                                if(data['seawinCustomsReminds']){
                                    var seawinCustomsReminds=data['seawinCustomsReminds'];
                                    if(seawinCustomsReminds.length>=1){
                                        //这里遍历数组 为table添加数据
                                        for(var i=0;i<seawinCustomsReminds.length;i++){
                                            var tr='<tr class="active" exchange_operate="" customsRemindId="'+seawinCustomsReminds[i]['customsRemindId']+'">' +
                                                '<td></td>' +
                                                '<td>' +
                                                '<select class="form-control" name="type" style="width: 160px;"></select>' +
                                                '</td>' +
                                                '<td>' +
                                                '<input class="form-control" type="text" name="amountMoney" value="'+seawinCustomsReminds[i]['amountMoney']+'">' +
                                                '</td>' +
                                                '</tr>';
                                            $('.AIRimport div#tariffInfo table.detail tbody').append(tr);
                                            $('.AIRimport div#tariffInfo table.detail tbody tr:last').find('select').select2({
                                                data:AIRchangeorder.tarff,
                                                placeholder:''
                                            }).val(seawinCustomsReminds[i]['type']).trigger('change');
                                        }
                                        $('.AIRimport div#tariffInfo table.detail tbody').find('tr.active').each(function (index,tr) {
                                            $(this).find('td:first').text(index+1);
                                        })
                                    }else{

                                    }
                                }

                                $('.AIRimport div#tariffInfo').attr('changed',false);
                            }
                        });*/
                        $('.AIRimport div#tariffInfo').modal('hide');
					}else {
                    	callAlert('保存失败！');
					}
                }
            });
        });
		//关税提醒 点击某行选中
		$('.AIRimport div#tariffInfo table.detail').on('click','tbody tr',function () {
            $('.AIRimport div#tariffInfo table.detail tbody tr').removeClass('sel');
			$(this).addClass('sel');
        });
		//关税提醒 页面修改检测
		$('.AIRimport div#tariffInfo table').on('change','input,select',function () {
			$('.AIRimport div#tariffInfo').attr('changed',true);
        })

    }
	return{
        getSetUp:getSetUp,    //设置保证金到期提醒
        submitSetUp:submitSetUp,    //设置保证金提醒 提交
        tarff:tarff,		//关税类型
		askData:askData,
		saveChangeorder:saveChangeorder,
		sendEmail:sendEmail,
        domBind:domBind
	}
})();
$(function(){
    $('.AIRimport #setUp').on('show.bs.modal',function () {
        AIRchangeorder.getSetUp();
    })
})
