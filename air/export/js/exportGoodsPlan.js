//@ sourceURL=exportGoodsPlan.js
var exportGoodsPlan=(function(){
	//传给后台的数据
	var outData={};
	//请求数据
	function askData(id){
		$.ajax({
					type : 'post',
					url : '/SeawinWebappBase/airExportDrawController/showDrawInfoById.do',
					data : {"billId" : id},
					success : function(data) {
						var data = JSON.parse(data);
						// 循环给表单赋值
						$.each($('.AIRexport form#goodsTransPlan').find('input,textarea,select'),function(i, input) {
											if ($(this).attr("name")) {
												$(this).val(data[$(this).attr("name")]);
											} else {
												// 不需要替换
											}
										});
						var tr='';
	            	    $('.AIRexport div#goodsDataTable table tbody').empty();
	            	    console.log(data['airDrawGoodsPlanLists'].length);
	            	    console.log(data['airDrawGoodsPlanLists']);
	            	    for(var i=0;i<data['airDrawGoodsPlanLists'].length;i++){
	            		var goodsData=data['airDrawGoodsPlanLists'][i];
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
                      $('.AIRexport div#goodsDataTable table tbody').append(tr);
                      reorderByCon('AIRexport');
                      timeLoad();
                      $('.AIRexport div.ZLmain>ul.nav-tabs>li.getGoods').attr('changed',false);

                    }
				});
	}
	//保存
	function saveData(liId){
		               
		$.ajax({
					type : "POST",
					url : '/SeawinWebappBase/airExportDrawController/updateDrawInfoById.do',
					async: false,
					contentType : "application/json;charset=UTF-8",
					data :function(){
						 outData = {'billExportId':liId};
						$.each($('.AIRexport #goodsTransPlan').find('input,select,textarea'),function(i,input){
			                outData[$(this).attr('name')]=$(this).val();
		              });
		                outData['airDrawGoodsPlanLists']=[];
		                //outData['airGoodsInfoList']=[];
		                //修改数据
		                $.each($('.AIRexport #goodsDataTable table tbody').find('tr[exchange_operate!="insert"]'),function(i,tr){
		                	outData['airDrawGoodsPlanLists'][i]={};
		                	outData['airDrawGoodsPlanLists'][i]['exchange_operate']=$(tr).attr('exchange_operate');
		                	outData['airDrawGoodsPlanLists'][i]['billExportId']=liId;
			                $.each($(tr).find('input'),function(j,input){
			                	var name=$(this).attr('name');
			                	outData['airDrawGoodsPlanLists'][i][name]=$(this).val();
			                })
		                })
		                //新增数据
		                console.log($('.AIRexport #goodsDataTable table tbody'));
		                $.each($('.AIRexport #goodsDataTable table tbody').find('tr[exchange_operate="insert"]'),function(i,tr){
			                var obj={'exchange_operate':'insert','billExportId':liId};
			                $.each($(tr).find('input'),function(j,input){
				                obj[$(this).attr('name')]=$(this).val();
			                })
			                outData['airDrawGoodsPlanLists'].push(obj);
		                });
		                return JSON.stringify(outData);
					}(),
					success : function(data) {
						var res = JSON.parse(data);
						if (res.status == 1) {
							callAlert("保存成功!");
							$('.AIRexport div.ZLmain>ul.nav-tabs>li.getGoods').attr('changed',false);
                            if($('.AIRexport div.ZLmain>ul>li.getGoods').hasClass('active')) {
                                exportGoodsPlan.askData(liId);
                            }
							//callSuccess("保存成功！");
						} else if (res.status == 0) {
							alert("保存失败!");
							//callAlert("保存失败！");
						}
					}
				});
	}
	//委托按钮
	function entrust(){
		//callAlert('操作成功');
		var id=$('.AIRexport ul.Big li.active').attr('billid');
		if($('.AIRexport div.ZLmain>ul.nav-tabs>li.getGoods').attr('changed')=='true'){
			var con=confirm('是否保存页面的修改');
            if(con){
            	exportGoodsPlan.saveData(id);
            }else{
            	$.ajax({
					type:"POST",
					url:"/SeawinWebappBase/airBillCommonController/exportEntrust.do",
					//async:true
					data:{"id":id},
					success:function(data){
						data=JSON.parse(data);
						if(data['code']==0){
							callAlert('操作成功');
						}else if(data['code']==1){
							alert('操作失败');
						}
				//$('.AIRexport div#successModal').modal('show');
					}		
				});
            }
		}else{
			$.ajax({
					type:"POST",
					url:"/SeawinWebappBase/airBillCommonController/exportEntrust.do",
					//async:true
					data:{"id":id},
					success:function(data){
						data=JSON.parse(data);
						if(data['code']==0){
							callAlert('操作成功');
						}else if(data['code']==1){
							alert('操作失败');
						}
				//$('.AIRexport div#successModal').modal('show');
					}		
				});
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
    	$('.AIRexport .startTime,.AIRimport .endTime').datepicker({
			autoclose : true,
			language : 'zh-CN',
			format : "yyyy-mm-dd"
		})
    }
    //全选功能
    $('.AIRexport div#goodsDataTable table thead').on('click','input.checkAll',function(){
    	var check=$(this).prop('checked');
    	$('.AIRexport div#goodsDataTable table tbody input.checkChild').prop("checked",check);
    	if(check){
    		$('.AIRexport div#goodsDataTable table tbody').find('tr').css('background','lightblue').addClass('sel');
    	}else{
    		$('.AIRexport div#goodsDataTable table tbody').find('tr').css('background','transparent').removeClass('sel');
    	}
    })
    $('.AIRexport div#goodsDataTable table').on('click','input.checkChild',function(){
    	var checkChild=$(this).prop('checked');
    	//alert(checkChild);
    	if(checkChild){
    		$(this).parents('tr').css('background','lightblue').addClass('sel');
    	}else{
    		$(this).parents('tr').css('background','transparent').removeClass('sel');
    	}
    })
    //监听页面修改
	$('.AIRexport div#getGoods').on('change','section input,section textarea,section select',function () {
        $('.AIRexport div.ZLmain>ul.nav-tabs>li.getGoods').attr('changed',true);
   });
	return{
		askData:askData,
		saveData:saveData,
		reorderByCon:reorderByCon,
		timeLoad:timeLoad,
		entrust:entrust
	}
})();
$(function () {
    // 货物数据 将实际进仓数据同步到付款主单
    $("#cargoDataTable tbody tr:eq(2) td:gt(0)").on('input',function(){
        var i = $(this).index();
        var v = $(this).find("input").val();
        $("#cargoDataTable tbody tr:eq(1) td:eq("+i+") input").val(v).trigger('input');//.trigger('change');
        if($(this).find("input").length==0){
        	v=$(this).find('select').val();
            $("#cargoDataTable tbody tr:eq(1) td:eq("+i+") select").val(v).trigger('input');//.trigger('change');
		}

    })
})