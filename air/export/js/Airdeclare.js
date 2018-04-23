//@ sourceURL=Airdeclare.js
var Airdeclare=(function(){
	var data={};
	//获取数据
	function askData(id){
		 $.ajax({
             type:'post',
             url: '/SeawinWebappBase/airBillForCustomsController/getById.do',  //'shipping/exportBusiness/mock_data/packings.json',
             data:{"id":id},
             success:function(data){
	            	 data=JSON.parse(data);
	            	 Airdeclare.data=data;
	            	 console.log(data);
	            	
	            	 $.each($('#declare').find('input,select'),function(i,input){
	            		 $(this).val(data[$(this).attr('name')]);
	            	 });
	            	 setFormSelect2Value("airBGXX", ["customsMode"], [data["customsMode"]]);
	            	 var tr='';
	            	 $('.AIRexport div#declare section div div table tbody').empty();
	            	 for(var i=0;i<data['sysCustomsBillVOs'].length;i++){
	            		 var sysData=data['sysCustomsBillVOs'][i];
	            		 tr+='<tr exchange_operate>'+
	            		 	 '<td><input class="form-control" name="type" value='+sysData['type']+'></td>'+
	            		 	'<td><input class="form-control" name="billLadingNo" value='+data['billLadingNo']+' readonly="readonly"></td>'+
	            		 	'<td><input class="form-control" name="customsName" value='+sysData['customsName']+'></td>'+
	            		 	'<td><input class="form-control" name="customsNo" value='+sysData['customsNo']+'></td>'+
	            		 	'<td><input class="form-control" name="latestStatus" value='+sysData['latestStatus']+'></td>'+
	            		 	'<td><input class="form-control Time" name="processingTime" value='+sysData['processingTime']+'></td>'+
	            			'<td><input class="form-control" name="operator" value='+sysData['operator']+'></td>'+
	            		 	 '</tr>';
	            	 }
	            	 $('.AIRexport div#declare section div div table tbody').append(tr);
	            	 //报关委托的模态框展示
	            	 $.each($('.AIRexport div#expDeclareEntrust div.modal-body tbody').find('input,textarea'),function(){
	            		if($(this).attr('name')){
                            $(this).val(data[$(this).attr('name')]);
	            		} else{

	            		}
	            	 });
	            	 //随附单证 创建a标签
				 	$('.AIRexport div#expDeclareEntrust td.showCompanyDocumentList').find('a').remove();
				 	console.log(data['sysAttachments']);
                 	var sysAttachments=data['sysAttachments'];
                 	for(var i=0,len=sysAttachments.length;i<len;i++){
                 		$('.AIRexport div#expDeclareEntrust td.showCompanyDocumentList').append('<a href="'+sysAttachments[i]['attachmentPath']+'">'+sysAttachments[i]['attachmentName']+'</a>');
					}
                  	$('.AIRexport div.ZLmain>ul>li.declare').attr('changed',false);

             }
            
		 })
		 Airdeclare.timeLoad(); 
	}
	function saveData(){		
		$.each($('#airBGXX').find('input,select'),function(i,input){
			Airdeclare.data[$(this).attr('name')]=$(this).val();
		});
		//修改数据
		$.each($('.AIRexport div#declare section div div table tbody').find('tr[exchange_operate!="insert"]'),function(i,tr){
			console.log(i);
			Airdeclare.data['sysCustomsBillVOs'][i]['exchange_operate']=$(tr).attr('exchange_operate');
			$.each($(tr).find('input'),function(j,input){
				console.log($(this).attr('name'));
				var name=$(this).attr('name');
				console.log(i);
				console.log(Airdeclare.data['sysCustomsBillVOs'][i])
				console.log(Airdeclare.data['sysCustomsBillVOs'][i][name]);
				if(Airdeclare.data['sysCustomsBillVOs'][i][name]){
					Airdeclare.data['sysCustomsBillVOs'][i][name]=$(this).val();
				}
				
			})
		})
		//新增的数据
		$.each($('.AIRexport div#declare section div div table tbody').find('tr[exchange_operate="insert"]'),function(i,tr){
			var obj={'exchange_operate':'insert','customsId':Airdeclare.data['customsId']};
			$.each($(tr).find('input'),function(j,input){
				obj[$(this).attr('name')]=$(this).val();
			})
			Airdeclare.data['sysCustomsBillVOs'].push(obj);
		});
		console.log(Airdeclare.data);
	//	Airdeclare.data['billId']=$('.AIRexport ul.Big li.AIR.active').attr('billId');
		 $.ajax({
             type:'post',
             async: false,
             url: getShipContextPath() + '/shippingBillCustoms/save.do',
             contentType: "application/json;charset=UTF-8",
             data:JSON.stringify(Airdeclare.data),
             success:function(data){
            	 console.log(data);
            	 var res = JSON.parse(data);
 				if(res.code=='0'){
 					callSuccess("保存成功！");
                    $('.AIRexport div.ZLmain>ul>li.declare').attr('changed',false);
                    if($('.AIRexport div.ZLmain>ul>li.declare').hasClass('active')) {
                    	console.log($('.AIRexport ul.Big li.AIR.active').attr('billId'))
                        Airdeclare.askData($('.AIRexport ul.Big li.AIR.active').attr('billId'));
                    }
 				}else if(res.status == 2){
 					callAlert("该订单未审核，不能修改！");
 					
 				}
             }
		 });
	}
	//删除
	function delData(){
		var tr=$('.AIRexport div#declare section div div table tbody').find('tr.sel');
		if(tr.length==1){
			if(tr.attr('exchange_operate')=='insert'){
				tr.remove();
			}else{
				tr.attr('exchange_operate','delete').css('display','none');
			}
		}else{
			alert('请选择您要删除的数据');
		}
	}
	//新增
	function addData(){
		var tr='<tr exchange_operate="insert">'+
	 	 '<td><input class="form-control" name="type" value=""></td>'+
	 	'<td><input class="form-control" name="billLadingNo" value="'+Airdeclare.data['billLadingNo']+'" readonly="readonly"></td>'+
	 	'<td><input class="form-control" name="customsName" value=""></td>'+
	 	'<td><input class="form-control" name="customsNo" value=""></td>'+
	 	'<td><input class="form-control" name="latestStatus" value=""></td>'+
	 	'<td><input class="form-control Time" name="processingTime" value=""></td>'+
		'<td><input class="form-control" name="operator" value=""></td>'+
	 	 '</tr>';
		 $('.AIRexport div#declare section div div table tbody').find('tr').css('background','transparent').removeClass('sel');
		 $(tr).css('background','lightblue').addClass('sel');		 
		 $('.AIRexport div#declare section div div table tbody').append(tr);
		 Airdeclare.timeLoad();
	}
	//复制
	function copyData(){
		var tr=$('.AIRexport div#declare section div div table tbody').find('tr.sel');
		if(tr.length==1){
			tr.clone().attr('exchange_operate','insert').css('background','transparent').removeClass('sel').appendTo($('.AIRexport div#declare section div div table tbody'));
		}else{
			alert('请选择您要复制的数据');
		}
		Airdeclare.timeLoad();
	}
	//导出
	function exportExcle(){
	    var id=$('.AIRexport ul.Big li.active').attr('billId');//获取主键
	    window.location.href=getShipContextPath()+"shippingBillCustoms/exportExcle.do?id="+id;
    }
	//加载时间控件
	function timeLoad(){
    	$('.AIRexport #declare .Time').datepicker({
            autoclose : true,
            language:"zh-CN",//语言设置
			format : "yyyy-mm-dd"
		})
    }
	//监听select2变化
    $('.AIRexport div#declare section select.select2').on('change',function () {
        //console.log($(this).val());
        var textSel=$(this).find('option:selected').text();
        var code=textSel.split(' | ')[0];
        var name=textSel.split(' | ')[1];
        $(this).parent('td').find('input:eq(0)').val(code);
        $(this).parent('td').find('input:eq(1)').val(name);
    })
	//选择随附单证
   	function choseAccompanyDocument(){
        var keys={};
        keys['businessId']=$('.AIRexport ul.Big li.active').attr('billId');
        keys['businessTable']='air_bill_export';
        $.ajax({
            url:getContextPath()+'sysAttachment/listByPage.do',
            type:'POST',
            data:{'keys':JSON.stringify(keys),'start':0,'length':1000},
            success:function (data) {
                //显示获取的数据
                $('.AIRexport #AIRexpChoseAccompanyDocument table tbody').empty();
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
                    $('.AIRexport #AIRexpChoseAccompanyDocument table tbody').append(tr);
                    if(data[i]['isChoose']){
                        $('.AIRexport #AIRexpChoseAccompanyDocument table tbody').find('tr:last').find('input[name="isChoose"]').prop('checked',true);
                    }else{

                    }
                }
            }
        })
        $('.AIRexport #AIRexpChoseAccompanyDocument').modal('show');
	}
	//选择随附单证提交数据
	function submitAccompanyDocument() {
        var sysAttachments=[];
        $('.AIRexport #AIRexpChoseAccompanyDocument table tbody').find('tr input').each(function () {
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
                $('.AIRexport #AIRexpChoseAccompanyDocument').modal('hide');
                callAlert(data['message']);
                Airdeclare.askData(Airdeclare.data['businessId']);
            }
        })
    }
    //保存报关委托中备注的修改
    function saveRemark(d) {
        $.ajax({
            url:getContextPath()+'shippingBillCustoms/save.do',
            type:'POST',
            contentType: "application/json;charset=UTF-8",
            data:JSON.stringify({'businessId':Airdeclare.data['businessId'],'businessType':Airdeclare.data['businessType'],'customsId':Airdeclare.data['customsId'],'remark':$(d).val()}),
            success:function (resData) {
                console.log(resData);
            }
        })
    }
	//发送报关委托
	function sendCustomsCommission(){
        console.log($('.AIRexport #expDeclareEntrust input[name="jsf"]:checked').val());
        if($('.AIRexport #expDeclareEntrust input[name="jsf"]:checked').val()){
            $.ajax({
                url:getContextPath()+'shippingBillCustoms/sendToCustoms.do',
                type:'POST',
                data:{'businessType':2,'billId':Airdeclare.data['businessId'],'type':$('.AIRexport #expDeclareEntrust input[name="jsf"]:checked').val()},
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
        sendCustomsCommission:sendCustomsCommission,
        saveRemark:saveRemark,
        submitAccompanyDocument:submitAccompanyDocument,
        choseAccompanyDocument:choseAccompanyDocument,
		data:data,
		askData:askData,
		delData:delData,
		addData:addData,
		copyData:copyData,
		saveData:saveData,
		exportExcle:exportExcle,
		timeLoad:timeLoad
	}
})();
$(function(){
	$('.AIRexport div#declare section div div table tbody').on('click','tr td',function(){
		$('.AIRexport div#declare section div div table tbody').find('tr').css('background','transparent').removeClass('sel');
		$(this).parents('tr').css('background','lightblue').addClass('sel');
	});
	//监听页面修改
	$('.AIRexport div#declare').on('change','section input,section textarea,section select',function () {
        $('.AIRexport div.ZLmain>ul.nav-tabs>li.declare').attr('changed',true);
    })
});