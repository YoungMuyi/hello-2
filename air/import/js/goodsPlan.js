//@ sourceURL=goodsPlan.js
var goodsPlan=(function(){
	var outData={};//传回后台的数据
	function askData(id) {
		// 向后台请求数据
		$.ajax({
					type : 'post',
					url : '/SeawinWebappBase/airBillImportController/searchTotalInfoById.do',
					data : {
						"id" : id
					},
					success : function(data) {
						var data = JSON.parse(data);
						// 循环给表单赋值
						$.each($('.AIRimport form#goodsTransPlan').find('input,textarea,select'),function(i, input) {
											if ($(this).attr("name")) {
												$(this).val(data[$(this).attr("name")]);
											} else {
												// 不需要替换
											}
										});
						var tr='';
	            	    $('.AIRimport div#goodsDataTable table tbody').empty();
	            	    console.log(data['deliverGoodsPlans'].length);
	            	    console.log(data['deliverGoodsPlans']);
	            	    for(var i=0;i<data['deliverGoodsPlans'].length;i++){
	            		var goodsData=data['deliverGoodsPlans'][i];
	            	    tr +=  '<tr exchange_operate="" class="active">'+
                               '<td><input class="checkChild" type="checkbox"></td>'+
                               '<td></td>'+
                               '<td><input class="form-control" type="text" name="liftStoreInfo" value='+goodsData['liftStoreInfo']+'></td>'+
                               '<td>'+
                               '<input class="form-control" type="text" name="liftStoreName" value='+goodsData['liftStoreName']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="liftStoreContact" value='+goodsData['liftStoreContact']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="liftStorePhone" value='+goodsData['liftStorePhone']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="liftStoreAddress" value='+goodsData['liftStoreAddress']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="liftStoreNote" value='+goodsData['liftStoreNote']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="deliverStoreInfo" value='+goodsData['deliverStoreInfo']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="deliverStoreName" value='+goodsData['deliverStoreName']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="deliverStoreContact" value='+goodsData['deliverStoreContact']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="deliverStorePhone" value='+goodsData['deliverStorePhone']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="deliverStoreAddress" value='+goodsData['deliverStoreAddress']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="deliverStoreNote" value='+goodsData['deliverStoreNote']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="storeNumber" value='+goodsData['storeNumber']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="storeGross" value='+goodsData['storeGross']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="storeVolume" value='+goodsData['storeVolume']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="storeChineseName" value='+goodsData['storeChineseName']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="storeForeignName" value='+goodsData['storeForeignName']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="storeInfomation" value='+goodsData['storeInfomation']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="storeDes" value='+goodsData['storeDes']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="storeTicketNum" value='+goodsData['storeTicketNum']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="carTeam" value='+goodsData['carTeam']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="carNum" value='+goodsData['carNum']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="carContact" value='+goodsData['carContact']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="carPhone" value='+goodsData['carPhone']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="expectDeliver" class="startTime" value='+goodsData['expectDeliver']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="expectArrive" class="startTime" value='+goodsData['expectArrive']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="actuallDeliver" value='+goodsData['actuallDeliver']+'>'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="actuallArrive" value='+goodsData['actuallArrive']+'>'+
                               '<input class="form-control" type="text" name="goodsPlanId" value='+goodsData['goodsPlanId']+' style="display:none;">'+
                               '</td>'+
                               '</tr>';
                        //console.log(tr);
                      } 
                      $('.AIRimport div#goodsDataTable table tbody').append(tr);
                      reorderByCon('AIRimport');
                      timeLoad();
                      $('.AIRimport div.ZLmain>ul.nav-tabs>li.goodsPlanList').attr('changed',false);
                    }
				})
	}
	//保存
	function savePlan(liId) {
		/*var isFull=false;
		$('.AIRimport #orders').find("input[class='must']").each(function(){
			if($(this).val()==""){
				$(this).parents("tr").css("border","1px solid red");
			}
		})*/
		$.ajax({
					type : "POST",
					url : '/SeawinWebappBase/airBillImportController/updateById.do',
					async: false,
					contentType : "application/json;charset=UTF-8",
					data : function(){
						outData = {'billImportId':liId};
						$.each($('.AIRimport #goodsTransPlan').find('input,select,textarea'),function(i,input){
			                outData[$(this).attr('name')]=$(this).val();
		              });
		                outData['deliverGoodsPlans']=[];
		                outData['airGoodsInfoList']=[];
		                //修改数据
		                $.each($('.AIRimport #goodsDataTable table tbody').find('tr[exchange_operate!="insert"]'),function(i,tr){
		                	outData['deliverGoodsPlans'][i]={};
		                	outData['deliverGoodsPlans'][i]['exchange_operate']=$(tr).attr('exchange_operate');
		                	outData['deliverGoodsPlans'][i]['billImportId']=liId;
			                $.each($(tr).find('input'),function(j,input){
			                	var name=$(this).attr('name');
			                	outData['deliverGoodsPlans'][i][name]=$(this).val();
			                })
		                })
		                //新增数据
		                console.log($('.AIRimport #goodsDataTable table tbody'));
		                $.each($('.AIRimport #goodsDataTable table tbody').find('tr[exchange_operate="insert"]'),function(i,tr){
			                var obj={'exchange_operate':'insert','billImportId':liId};
			                $.each($(tr).find('input'),function(j,input){
				                obj[$(this).attr('name')]=$(this).val();
			                })
			                outData['deliverGoodsPlans'].push(obj);
		                });
		                return JSON.stringify(outData);
					}(),
					success : function(data) {
						var res = JSON.parse(data);
						if (res.status == 1) {
							callAlert("成功!");
							$('.AIRimport div.ZLmain>ul.nav-tabs>li.goodsPlanList').attr('changed',false);
							if($('.AIRimport div.ZLmain>ul>li.goodsPlanList').hasClass('active')){
							    goodsPlan.askData(liId);
                            }
							//callSuccess("保存成功！");
						} else if (res.status == 0) {
							alert("失败!");
							//callAlert("保存失败！");
						}
					}
				});
	}
	//送货信息新增一条
    function addGoodsData(htmlName){
        var tr='<tr exchange_operate="insert" class="active">'+
                               '<td><input class="checkChild" type="checkbox"></td>'+
                               '<td></td>'+
                               '<td><input class="form-control" type="text" name="liftStoreInfo" value=""></td>'+
                               '<td>'+
                               '<input class="form-control" type="text" name="liftStoreName" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="liftStoreContact" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="liftStorePhone" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="liftStoreAddress" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="liftStoreNote" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="deliverStoreInfo" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="deliverStoreName" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="deliverStoreContact" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="deliverStorePhone" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="deliverStoreAddress" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="deliverStoreNote" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="storeNumber" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="storeGross" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="storeVolume" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="storeChineseName" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="storeForeignName" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="storeInfomation" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="storeDes" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="storeTicketNum" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="carTeam" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="carNum" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="carContact" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="carPhone" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="expectDeliver" class="startTime" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="expectArrive" class="startTime" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="actuallDeliver" value="">'+
                               '</td>'+
                               '<td>'+
                               '<input class="form-control" name="actuallArrive" value="">'+
                               '</td>'+
                               '</tr>';
        $('.'+htmlName+' div#goodsDataTable table tbody').find('tr').css('background','transparent').removeClass('sel');
        $('.'+htmlName+' div#goodsDataTable table tbody').append(tr);
        $('.'+htmlName+' div#goodsDataTable table tbody tr:last').css('background','lightblue').addClass('sel');
        reorderByCon(htmlName);
        timeLoad();
    }
    //复制
    function copyData(htmlName){
		var tr=$('.'+htmlName+' div#goodsDataTable  table tbody').find('tr.sel');
		if(tr.length==1){
			tr.clone().attr('exchange_operate','insert').css('background','transparent').removeClass('sel').appendTo($('.'+htmlName+' div#goodsDataTable  table tbody'));
		    reorderByCon(htmlName);
		    timeLoad();
		}else{
			callAlert('请选择您要复制的数据');
		}
	}
    //全选功能
    $('.AIRimport div#goodsDataTable table thead').on('click','input.checkAll',function(){
    	var check=$(this).prop('checked');
    	$('.AIRimport div#goodsDataTable table tbody input.checkChild').prop("checked",check);
    	if(check){
    		$('.AIRimport div#goodsDataTable table tbody').find('tr').css('background','lightblue').addClass('sel');
    	}else{
    		$('.AIRimport div#goodsDataTable table tbody').find('tr').css('background','transparent').removeClass('sel');
    	}
    })
    $('.AIRimport div#goodsDataTable table').on('click','input.checkChild',function(){
    	var checkChild=$(this).prop('checked');
    	//alert(checkChild);
    	if(checkChild){
    		$(this).parents('tr').css('background','lightblue').addClass('sel');
    	}else{
    		$(this).parents('tr').css('background','transparent').removeClass('sel');
    	}
    })
    /*//选择一行记录
    $('.AIRimport div#goodsDataTable table tbody').on('click','tr',function(){
    	$('.AIRimport div#goodsDataTable table tbody').find('tr').removeClass('sel');
    	$(this).css('background','lightblue').addClass('sel');
    })*/
    //删除应付费用
    function delGoodsData(htmlName){
        var tr=$('.'+htmlName+' div#goodsDataTable  table tbody').find('tr.sel');
        if(tr.length!=0){
            if(tr.attr('exchange_operate')=='insert'){
                tr.remove();
            }else{
                tr.attr('exchange_operate','delete').css('display','none').removeClass('active');
            }
            $('.AIRimport div#goodsDataTable table tbody input.checkChild').prop("checked",false);
            $('.AIRimport div#goodsDataTable table input.checkAll').prop("checked",false);
            reorderByCon(htmlName);
        }else{
            callAlert('请选择您要删除的数据');
        }
    }
     //序号排序
    function reorderByCon(htmlName) {
        var ConArr = $('.'+htmlName+' div#goodsDataTable table tbody tr.active');
        for (var i = 0; i < ConArr.length; i++) {
            $(ConArr[i]).find('td:eq(1)').text(i + 1);
        }
    }
    function timeLoad(){
    	$('.AIRimport .startTime,.AIRimport .endTime').datepicker({
			autoclose : true,
            language : 'zh-CN',
			format : "yyyy-mm-dd"
		})
    }
    function entrust(){
    	var id=$('.AIRimport ul.Big li.active').attr('billid');
    	if($('.AIRimport div.ZLmain>ul.nav-tabs>li.goodsPlanList').attr('changed')=='true'){
    		var con=confirm('是否保存页面的修改');
            if(con){
            	goodsPlan.savePlan(id);
            }else{
            	$.ajax({
					type:"POST",
					url:"/SeawinWebappBase/airBillCommonController/importEntrust.do",
					//async:true
					data:{"id":id},
					success:function(data){
						data=JSON.parse(data);
						if(data['code']==0){
							callAlert('操作成功');
						}else if(data['code']==1){
							alert('操作失败');
						}
						//$('.AIRimport div#successModal').modal('show');
					}
				});
            }
    	}else{
    		$.ajax({
					type:"POST",
					url:"/SeawinWebappBase/airBillCommonController/importEntrust.do",
					//async:true
					data:{"id":id},
					success:function(data){
						data=JSON.parse(data);
						if(data['code']==0){
							callAlert('操作成功');
						}else if(data['code']==1){
							alert('操作失败');
						}
						//$('.AIRimport div#successModal').modal('show');
					}
				});
    	}
    	//$('.AIRimport div#failModal').modal('show');
   }
	return{
		askData:askData,
		addGoodsData:addGoodsData,
		reorderByCon:reorderByCon,
		delGoodsData:delGoodsData,
		savePlan:savePlan,
		timeLoad:timeLoad,
		copyData:copyData,
		entrust:entrust
	}
})();
$(function(){
	//监听内容页面是否修改
    $('.AIRimport div#goodsPlan').on('change','section input,section textarea,section select',function () {
        $('.AIRimport div.ZLmain>ul.nav-tabs>li.goodsPlanList').attr('changed',true);
    });
    $('.AIRimport table#putTable tbody').on('click','tr',function(){
    	$('.AIRimport table#putTable').find('tr').css('background','transparent').removeClass('sel');
    	$(this).css('background','lightblue').addClass('sel');
    });
    $('.AIRexport table#putTable tbody').on('click','tr',function(){
    	$('.AIRexport table#putTable').find('tr').css('background','transparent').removeClass('sel');
    	$(this).css('background','lightblue').addClass('sel');
    });
})
	

