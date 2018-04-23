//@ sourceURL=importAirdeclare.js
var importAirdeclare=(function(){
	var data;
	//获取数据
	function askData(id,html){
		 $.ajax({
             type:'post',
             url: '/SeawinWebappBase/airBillImportCustomsController/getById.do',  //'shipping/exportBusiness/mock_data/packings.json',
             data:{"id":id},
             success:function(data){
	            	 data=JSON.parse(data);
	            	 importAirdeclare.data=data;
	            	 console.log(data);
	            	
	            	 $.each($('.'+html+' #imdeclare').find('input,select'),function(i,input){
	            		 $(this).val(data[$(this).attr('name')]);
	            	 });
	            	 setFormSelect2ValueByTotal(html,"airBGXX", ["customsMode"], [data["customsMode"]]);
	            	 var tr='';
	            	 $('.'+html+' div#imimdeclare section div div.bottom table tbody').empty();
	            	 for(var i=0;i<data['sysCustomsBillVOs'].length;i++){
	            		 var sysData=data['sysCustomsBillVOs'][i];
	            		 tr+='<tr exchange_operate>'+
	            		 	 '<td><input class="form-control" name="type" value='+sysData['type']+'></td>'+
	            		 	'<td><input class="form-control" name="billLadingNo" value='+data['billLadingNo']+' readonly="readonly"></td>'+
	            		 	'<td><input class="form-control" name="customsName" value='+sysData['customsName']+'></td>'+
	            		 	'<td><input class="form-control" name="customsNo" value='+sysData['customsNo']+'></td>'+
	            		 	'<td><input class="form-control" name="latestStatus" value='+sysData['latestStatus']+'></td>'+
	            		 	'<td><input class="form-control" name="processingTime" value='+sysData['processingTime']+'></td>'+
	            			'<td><input class="form-control" name="operator" value='+sysData['operator']+'></td>'+
	            		 	 '</tr>';
	            	 }
	            	 $('.'+html+' div#imimdeclare section div div.bottom table tbody').append(tr);
	            	 //报关委托的模态框展示
	            	 $.each($('.'+html+' div#impDeclareEntrust div.modal-body tbody').find('input,textarea'),function(){
	            		if($(this).attr('name')){
                            $(this).val(data[$(this).attr('name')]);
	            		} else{

	            		}
	            	 });
	            	 //随附单证创建a
				 	$('.AIRimport div#impDeclareEntrust').find('a').remove();
				 	console.log(data['syaAttachments']);
					 var sysAttachments=data['sysAttachments']
					 for(var i=0,len=sysAttachments.length;i<len;i++){
						 $('.AIRimport div#impDeclareEntrust td.showCompanyDocumentList').append('<a href="'+sysAttachments[i]['attachmentPath']+'">'+sysAttachments[i]['attachmentName']+'</a>');
					 }
              		 $('.AIRimport div.ZLmain>ul.nav-tabs>li.importDeclareList').attr('changed',false);

            	 }
             })
	}
	function saveData(html){		
		$.each($('.AIRimport #imdeclare .myFieldset').find('input,select'),function(i,input){
			importAirdeclare.data[$(this).attr('name')]=$(this).val();
		});
		//修改数据
		$.each($('.AIRimport div#imdeclare section div div.bottom table tbody').find('tr[exchange_operate!="insert"]'),function(i,tr){
			console.log(i);
			importAirdeclare.data['sysCustomsBillVOs'][i]['exchange_operate']=$(tr).attr('exchange_operate');
			$.each($(tr).find('input'),function(j,input){
				console.log($(this).attr('name'));
				var name=$(this).attr('name');
				console.log(i);
				console.log(importAirdeclare.data['sysCustomsBillVOs'][i])
				console.log(importAirdeclare.data['sysCustomsBillVOs'][i][name]);
				if(importAirdeclare.data['sysCustomsBillVOs'][i][name]){
					importAirdeclare.data['sysCustomsBillVOs'][i][name]=$(this).val();
				}
				
			})
		})
		//新增的数据
		$.each($('.AIRimport div#imdeclare section div div.bottom table tbody').find('tr[exchange_operate="insert"]'),function(i,tr){
			var obj={'exchange_operate':'insert','customsId':importAirdeclare.data['customsId']};
			$.each($(tr).find('input'),function(j,input){
				obj[$(this).attr('name')]=$(this).val();
			})
			importAirdeclare.data['sysCustomsBillVOs'].push(obj);
		});
		console.log(importAirdeclare.data);
		importAirdeclare.data['billId']=$('.AIRimport ul.Big li.active').attr('billId');
		 $.ajax({
             type:'post',
             url: getShipContextPath() + '/shippingBillCustoms/save.do',  
             async: false,
             contentType: "application/json;charset=UTF-8",
             data:JSON.stringify(importAirdeclare.data),
             success:function(data){
            	 console.log(data);
            	 var res = JSON.parse(data);
 				if(res.code ==0){
 					callSuccess("保存成功！");
                    $('.AIRimport div.ZLmain>ul.nav-tabs>li.importDeclareList').attr('changed',false);
                    if($('.AIRimport div.ZLmain>ul>li.importDeclareList').hasClass('active')){
                        importAirdeclare.askData($('.AIRimport ul.Big li.active').attr('billId'));
                    }else{

                    }

                }else if(res.status == 2){
 					callAlert("该订单未审核，不能修改！");
 					
 				}
             }
		 });
	}
	//删除
	function delData(html){
		var tr=$('.'+html+' div#imdeclare section div div.bottom table tbody').find('tr.sel');
		if(tr.length==1){
			if(tr.attr('exchange_operate')=='insert'){
				tr.remove();
			}else{
				tr.attr('exchange_operate','delete').css('display','none');
			}
		}else{
			callAlert('请选择您要删除的数据');
		}
	}
	//新增
	function addData(html){
		var tr='<tr exchange_operate="insert">'+
	 	 '<td><input class="form-control" name="type" value=""></td>'+
	 	'<td><input class="form-control" name="billLadingNo" value='+importAirdeclare.data['billLadingNo']+' readonly="readonly"></td>'+
	 	'<td><input class="form-control" name="customsName" value=""></td>'+
	 	'<td><input class="form-control" name="customsNo" value=""></td>'+
	 	'<td><input class="form-control" name="latestStatus" value=""></td>'+
	 	'<td><input class="form-control" name="processingTime" value=""></td>'+
		'<td><input class="form-control" name="operator" value=""></td>'+
	 	 '</tr>';
		 $('.'+html+' div#imdeclare section div div.bottom table tbody').find('tr').css('background','transparent').removeClass('sel');
		 $(tr).css('background','lightblue').addClass('sel');		 
		 $('.'+html+' div#imdeclare section div div.bottom table tbody').append(tr);
	}
	//复制
	function copyData(html){
		var tr=$('.'+html+' div#imdeclare section div div.bottom table tbody').find('tr.sel');
		if(tr.length==1){
			tr.clone().attr('exchange_operate','insert').css('background','transparent').removeClass('sel').appendTo($('.'+html+' div#imdeclare section div div.bottom table tbody'));
		}else{
			callAlert('请选择您要复制的数据');
		}
	}
    //导出
    function exportExcle(){
        var id=$('.AIRimport ul.Big li.active').attr('billid');//获取主键
        window.location.href=getShipContextPath()+"shippingBillCustoms/exportExcle.do?id="+id;
    }
    //选择随附单证
    function choseAccompanyDocument(){
        var keys={};
        keys['businessId']=$('.AIRimport ul.Big li.active').attr('billId');
        keys['businessTable']='air_bill_import';
		/*  keys['isChoose']=false;*/
        $.ajax({
            url:getContextPath()+'sysAttachment/listByPage.do',
            type:'POST',
            data:{'keys':JSON.stringify(keys),'start':0,'length':1000},
            success:function (data) {
                //显示获取的数据
                $('.AIRimport #AIRimpChoseAccompanyDocument table tbody').empty();
                data=JSON.parse(data)['aaData'];
                for(var i=0;i<data.length;i++){
                    var tr=' <tr attachmentId='+data[i]['attachmentId']+'>'+
                        '<td><input type="checkbox" name="isChoose"></td>'+
                        '<td name="attachmentName"><a target="_blank" href='+data[i]['attachmentPath']+'>'+data[i]['attachmentName']+'</a></td>'+
                        '<td >'+ data[i]['documentType']+'</td>'+
                        '<td>'+data[i]['size']+'</td>'+
                        '<td>'+data[i]['createTime']+'</td>'+
                        '<td>'+data[i]['remarks']+'</td>'+
                        '</tr>';
                    $('.AIRimport #AIRimpChoseAccompanyDocument table tbody').append(tr);
                    if(data[i]['isChoose']){
                        $('.AIRimport #AIRimpChoseAccompanyDocument table tbody').find('tr:last').find('input[name="isChoose"]').prop('checked',true);
                    }else{

                    }
                }
            }
        })
        $('.AIRimport #AIRimpChoseAccompanyDocument').modal('show');
    }
    //选择随附单证提交数据
    function submitAccompanyDocument() {
        var sysAttachments=[];
        $('.AIRimport #AIRimpChoseAccompanyDocument table tbody').find('tr input').each(function () {
            sysAttachments.push({'attachmentId':$(this).parent().parent().attr('attachmentId'),'isChoose':this.checked})
        })
        console.log(sysAttachments);
        $.ajax({
            url:getContextPath()+'sysAttachment/updateBatch.do',
            type:'POST',
            data:{'sysAttachments':JSON.stringify(sysAttachments)},
            success:function (data) {
                console.log(data);
                data=JSON.parse(data);
                $('.AIRimport #AIRimpChoseAccompanyDocument').modal('hide');
                callAlert(data['message']);
                importAirdeclare.askData($('.AIRimport ul.Big li.active').attr('billId'));
            }
        })
    }
    //保存报关委托中备注的修改
    function saveRemark(d) {
        $.ajax({
            url:getContextPath()+'shippingBillCustoms/save.do',
            type:'POST',
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({'businessId':importAirdeclare.data['businessId'],'businessType':importAirdeclare.data['businessType'],'customsId':importAirdeclare.data['customsId'],'remark':$(d).val()}),
            success:function (resData) {
                console.log(resData);
            }
        })
    }
    //发送报关委托
    function sendCustomsCommission() {
        console.log($('.AIRimport #impDeclareEntrust input[name="type"]:checked').val());
        if($('.AIRimport #impDeclareEntrust input[name="type"]:checked').val()){
            $.ajax({
                url:getContextPath()+'shippingBillCustoms/sendToCustoms.do',
                type:'POST',
                data:{'businessType':1,'billId':importAirdeclare.data['businessId'],'type':$('.AIRimport #impDeclareEntrust input[name="type"]:checked').val()},
                success:function (data) {
                    console.log(data);
                    data=JSON.parse(data);
                    callAlert(data['message']);
                }
            })
		}else{
			callAlert('请选择接收方');
		}


    }
	return {
        exportExcle:exportExcle,
        choseAccompanyDocument:choseAccompanyDocument,
        submitAccompanyDocument:submitAccompanyDocument,
        saveRemark:saveRemark,
        sendCustomsCommission:sendCustomsCommission,
		data:data,
		askData:askData,
		delData:delData,
		addData:addData,
		copyData:copyData,
		saveData:saveData
	}
})();
$(function(){
	//监听内容页面是否修改
    $('.AIRimport div#imdeclare').on('change','section input,section textarea,section select',function () {
        $('.AIRimport div.ZLmain>ul.nav-tabs>li.importDeclareList').attr('changed',true);
    });
	$('.AIRimport div#imdeclare section div div.bottom table tbody').on('click','tr td',function(){
		$('.AIRimport div#imdeclare section div div table tbody').find('tr').css('background','transparent').removeClass('sel');
		$(this).parents('tr').css('background','lightblue').addClass('sel');
	});
	/*$('.AIRimport div#imdeclare section div div table tbody').on('click','tr td',function(){
		$('.AIRimport div#imdeclare section div div table tbody').find('tr').css('background','transparent').removeClass('sel');
		$(this).parents('tr').css('background','lightblue').addClass('sel');
	});*/
	//报关行赋值
	$('.AIRimport div#imdeclare select.customsBrokerSel').on('change',function(){
		var customerText=$(this).find('option:selected').text();
    	var target=' | ';
    	var customsBrokerCode=customerText.split(' | ')[0];
    	var customsBroker=customerText.split(' | ')[1];
    	$('.AIRimport div#imdeclare input[name="customsBrokerCode"]').val(customsBrokerCode);
    	$('.AIRimport div#imdeclare input[name="customsBroker').val(customsBroker);
	});
	//出口口岸赋值
	$('.AIRimport div#imdeclare select.exportPortSel').on('change',function(){
		var customerText=$(this).find('option:selected').text();
    	var target=' | ';
    	var exportPortCode=customerText.split(' | ')[0];
    	var exportPort=customerText.split(' | ')[1];
    	$('.AIRimport div#imdeclare input[name="exportPortCode"]').val(exportPortCode);
    	$('.AIRimport div#imdeclare input[name="exportPort').val(exportPort);
	});
})