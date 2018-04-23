//@ sourceURL=FCLexport.js
var FCLexport=(function () {
    showButton();
    //其他条件对象创建   可随处使用
    var keysOption={};
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

    //    console.log(startTime.split('上午'));
    //    console.log(endTime.split('下午'));
        if(startTime.split('上午').length==2){
            var smArr=startTime.split('上午');
            startTime=smArr.join("").slice(0,-3);
            var emArr=endTime.split('上午');
            endTime=emArr.join("").slice(0,-3);
        }else{
            var saArr=startTime.split('下午');
            var eaArr=endTime.split('下午');

            var satArr=saArr[1].split(":");
            satArr[0]=parseInt(satArr[0])+12;
            saArr[1]=satArr.join(":");
            startTime=saArr.join("").slice(0,-3);

            var eatArr=eaArr[1].split(':');
            eatArr[0]=parseInt(eatArr[0])+12;
            eaArr[1]=eatArr.join(":");
            endTime=eaArr.join("").slice(0,-3);
        }
        $('input.beginEnableTime').val(startTime);
        $('input.endEnableTime').val(endTime);
    }
//  $('input.startTime').val((new Date()).valueOf());
//  $('input.endTime').val((new Date()).valueOf()-30*24*60*60*1000);
    //改变ZLmain的tab
    function changeZLmain(num) {
        $('.FCLexport div.smallTab div.ZLmain>ul>li').removeClass('active');
        $('.FCLexport div.smallTab div.ZLmain>div.tab-content>div').removeClass('active');
        $('.FCLexport div.smallTab div.ZLmain>ul>li:eq('+num+')').addClass('active');
        $('.FCLexport div.smallTab div.ZLmain>div.tab-content>div:eq('+num+')').addClass('active');
    }
	//页面切换请求数据
	function FCLexportDetail(id,num) {
			//判断是 总览home 委托entrust 订舱bookingSpace 做箱packings 提单billLading 报关declare 费用cost 跟踪tracing
		    changeZLmain(num);
	//		alert(id+'*****'+num);
			switch(num){
				case 0:
                    $.ajax({
                    type:'post',
                    url: getShipContextPath() + 'shippingBillOverview/getById.do',
                    data:{"billId":id},
                    success:function(data){
                        var data=JSON.parse(data);
                        // 循环给表单赋值
                        //$.each($smallTabClone.find('form#ZL input'),function(i,input){
                        $.each($('.FCLexport div.smallTab').find('form#ZL input'),function (i,input) {
                     //       console.log($(this).attr("name"));
                     //       console.log(data[$(this).attr("name")]);
                            if(typeof(data[$(this).attr("name")])=='undefined'||data[$(this).attr("name")]==''){
                                if($(this).attr('hbl')){
                                    $(this).val(data['hblBillLading'][$(this).attr("name")]);
                                }else{
                                    $(this).val(data['mblBillLading'][$(this).attr("name")]);
                                }
                            }else{
                                $(this).val(data[$(this).attr("name")]);
                            }
                        });
                    }
                })
					break;
				case 1:
					$('.FCLexport #XHXX table table.myTable tr.appendNew').remove();
                    $('.FCLexport #XHXX table table.myTable tr.createNew').remove();
                    //
                    //向后台请求数据
                    $.ajax({
                        type:'post',
                        url: getShipContextPath() + '/shippingBillEntrust/getById.do',
                        data:{"id":id,"BLType":0},
                        success:function(data){
                //            console.log(data);
                            var data=JSON.parse(data);
               //             console.log($('.FCLexport form#XHXX table table.myTable tr.cloneDemo'));

                            // 循环给表单赋值
                            $.each($('.FCLexport form#HYTD,.FCLexport form#XHXX,.FCLexport form#entrustBase,.FCLexport form#HDTD').find('input,textarea'),function(i,input){
                                if($(this).attr('type')=='checkbox'||$(this).attr('type')=='radio'){
                                    switch(data[$(this).attr("name")]){
                                        case 0:
                                            break;
                                        case 1:
                                            $(this).attr('checked','checked');
                                            break;
                                    }
                                    if($(this).attr("name")=='entrFreightType'){
                                        if($(this).val()==data["entrFreightType"]){
                                            $(this).attr("checked","checked");
                                        }
                                    }

                                }else{
                                    if($(this).attr("name")){
                                        if(typeof(data[$(this).attr("name")])=='undefined'||data[$(this).attr("name")]==''){

                                            if(typeof(data['mbl'][$(this).attr("name")])=='undefined'){
                                                var text=data['hbl'][$(this).attr("name")];
                                                $(this).val(text);
                                            }else{
                                                var text=data['mbl'][$(this).attr("name")];
                                                $(this).val(text);
                                            }


                                        }else{
                                            if($(this).attr("name")=='entrFreightTypeOther'){
                                                if(data['entrFreightType']=='其他'){
                                                    $(this).val(data[$(this).attr("name")]);
                                                }else{
                                                    $(this).val('');
                                                }
                                            }else{
                                                $(this).val(data[$(this).attr("name")]);
                                            }
                                        }

                                    }else{
                                        //不需要替换
                                    }
                                }

                            });
                            //箱货信息table赋值
                            $('div.tab-pane#smallTab'+id).find('div.tab-pane#entrust'+id+' table table tbody tr.appendNew').remove();
                            for(var i=0;i<data['shippingContainerGoods'].length;i++){
                              //  console.log(JSON.stringify(data['shippingContainerGoods'][i]));
                                var strTR='<tr class="appendNew" style="display:table-row;" onclick="FCLexport.chooseContainer(this)">'+
				                            '<td>'+
				                        		'<select name="boxType_goods" data-type="goods">'+
				                        			'<option name="20GP" value="20GP">20GP</option>'+
				                        			'<option name="40GP" value="40GP">40GP</option>'+
				                        			'<option name="40HQ" value="40HQ">40HQ</option>'+
				                        			'<option name="45HQ" value="45HQ">45HQ</option>'+
				                        		'</select>'+
				                        	'</td>'+
				                        	'<td style="padding:0px;">'+
				                        		/*'<input type="text" name="number_goods" data-type="goods" value='+data["shippingContainerGoods"][i]["number"]+'>'+*/
				                        		'<textarea name="number" style="overflow:hidden;resize:none;width:140px;height:25px;width:100%;border:none;line-height:25px;" onkeydown="FCLexport.checkEnter(event)">'+data["shippingContainerGoods"][i]["number"]+'</textarea>'+
				                        	'</td>'+
				                        	'<td>'+
				                        		'<select name="fullSpell_goods" data-type="goods">'+
				                        			'<option name="FCL" value="FCL">FCL</option>'+
				                        			'<option name="LCL" value="LCL">LCL</option>'+
				                        		'</select>'+
				                        	'</td>'+
				                        	'<td>'+
				                        		'<select name="emptyWeight_goods" data-type="goods">'+
				                        			'<option name="F" value="F">F</option>'+
				                        			'<option name="E" value="E">E</option>'+
				                        		'</select>'+
				                        	'</td>'+
				                        	'<td>'+
				                        		'<input type="checkbox" name="soc_goods" data-type="goods" value="0">'+
				                        	'</td>'+
				                        	'<td>'+
				                        		'<select name="goodsAttribute_goods" data-type="goods">'+
				                        			'<option name="普通货物" value="普通货物" data-val=0>普通货物</option>'+
				                        			'<option name="危险品" value="危险品" data-val=1>危险品</option>'+
				                        			'<option name="冷冻柜" value="冻柜" data-val=2>冻柜</option>'+
				                        			'<option name="大件货" value="大件货" data-val=3>大件货</option>'+
				                        		'</select>'+
				                        	'</td>'+
				                        	'<td>'+
				                        		'<a onclick="FCLexport.ContainerDetail(this)">详情</a>'+
				                        	'</td>'+
				                        '</tr>';
                            //    var $tr=$($('.FCLexport form#XHXX table table.myTable tr.cloneDemo')[0]).clone().removeClass('cloneDemo').addClass('appendNew').css('display','table-row').attr('shippingContainerGoods',JSON.stringify(data['shippingContainerGoods'][i])).attr('containerGoodsId',data['shippingContainerGoods'][i]['containerGoodsId']);
                              var $tr=$(strTR).attr('shippingContainerGoods',JSON.stringify(data['shippingContainerGoods'][i])).attr('containerGoodsId',data['shippingContainerGoods'][i]['containerGoodsId']);
                                var tdArr=$tr.find('td');
                                $(tdArr[0]).find('select option[name="'+data['shippingContainerGoods'][i]['boxType']+'"]').attr("selected","selected");
                             //  $(tdArr[1]).find('input').attr('value',data['shippingContainerGoods'][i]['number']);
                                $(tdArr[2]).find('select option[name="'+data['shippingContainerGoods'][i]['fullSpell']+'"]').attr("selected","selected");
                                $(tdArr[3]).find('select option[name="'+data['shippingContainerGoods'][i]['emptyWeight']+'"]').attr("selected","selected");
                                if(data['shippingContainerGoods'][i]['soc']=='0'){

                                }else{
                                    $(tdArr[4]).find('input').attr('checked','checked');
                                }
                                $(tdArr[5]).find('select option[name="'+data['shippingContainerGoods'][i]['goodsAttribute']+'"]').attr("selected","selected");
                                $('.FCLexport form#XHXX table table.myTable tbody').append($tr);
                            }

                        }
                    })
					break;
				case 2:
                    $.ajax({
                        type:'post',
                        url: getShipContextPath() + 'shippingBillBooking/getById.do',
                        data:{"billId":id},
                        success:function(data){
                            var data=JSON.parse(data);
                            // 循环给表单赋值
                            //$.each($smallTabClone.find('form#ZL input'),function(i,input){
                            $.each($('.FCLexport div.smallTab form#PZXX,.FCLexport div.smallTab form#DCXX').find(' input,textarea'),function (i,input) {
                             //   console.log($(this).attr("name"));
                             //   console.log(data[$(this).attr("name")]);
                                /*    if(typeof(data[$(this).attr("name")])=='undefined'||data[$(this).attr("name")]==''){
                                 if($(this).attr('hbl')){
                                 $(this).val(data['hblBillLading'][$(this).attr("name")]);
                                 }else{
                                 $(this).val(data['mblBillLading'][$(this).attr("name")]);
                                 }
                                 }else{*/
                                $(this).val(data[$(this).attr("name")]);
                                //  }
                            });
                        }
                    })
					break;
				case 3:
					//alert(3);
				     $.ajax({
	                        type:'post',
	                        url: getShipContextPath() + 'shippingBillPacking/getById.do',  //'shipping/exportBusiness/mock_data/packings.json',
	                        data:{"billId":id},
	                        success:function(data){
	                        	console.log(data);
	                         var data=JSON.parse(data);
	                         //	console.log($('.FCLexport div#packings div.containerInfo table tbody tr.cloneDemo1'))
	                            $('.FCLexport div#packings div.containerInfo table tbody tr.cloneDemo1').remove();
	                            $('.FCLexport div#packings div.plasticGoods table tbody tr.cloneDemo1').remove();
	                        //    console.log(data);
	                            // 循环给表单赋值
	                            //$.each($smallTabClone.find('form#ZL input'),function(i,input){
	                         	if(data['isChange']){
	                         		$('.FCLexport div.packings form#neglectedLoading').find('select[name="isChange"]').val(1);
	                         	}else{
	                         		$('.FCLexport div.packings form#neglectedLoading').find('select[name="isChange"]').val(0);
	                         	}
	                         	if(data['isMissPlace']){
	                         		$('.FCLexport div.packings form#neglectedLoading').find('select[name="isMissPlace"]').val(1);
	                         	}else{
	                         		$('.FCLexport div.packings form#neglectedLoading').find('select[name="isMissPlace"]').val(0);
	                         	}
	                            $.each($('.FCLexport div.packings form#packings,.FCLexport div.packings form#neglectedLoading').find(' input,textarea'),function (i,input) {

	                            	if($(this).attr('type')=='radio'){
	                            		if($(this).val()==data[$(this).attr('name')]){
	                            			$(this).attr('checked','checked');
	                            		}
	                            	}else{
	                            		$(this).val(data[$(this).attr("name")]);
	                            	}


	                            });
	                        //    console.log(data['shippingBillLadingVOs']);
	                            //主提单号
	                            var initID;
	                            if(data['shippingBillLadingVOs'][0]['billType']){
	                            	//0--货代提单     1--海洋提单
	                            	initID=data['shippingBillLadingVOs'][1]['billLadingId'];
	                            	//对应的div绑定属性
	                            	$('.FCLexport div.packings form#packings div.hbl.xszd')
	                            	.attr({'billLadingId':data['shippingBillLadingVOs'][0]['billLadingId'],'billType':data['shippingBillLadingVOs'][0]['billType']});
	                            	$('.FCLexport div.packings form#packings div.mbl.xszd')
	                            	.attr({'billLadingId':data['shippingBillLadingVOs'][1]['billLadingId'],'billType':data['shippingBillLadingVOs'][1]['billType']});
	                            	//给input赋值绑定属性
	                            	$('.FCLexport div.packings form#packings input[name="hblNo"]').val(data['shippingBillLadingVOs'][0]['bLNo'])
	                            		.attr('billLadingId',data['shippingBillLadingVOs'][0]['billLadingId'])
	                            		.attr('billType',data['shippingBillLadingVOs'][0]['billType'])
                            			.attr('parentId',data['shippingBillLadingVOs'][0]['parentId']);
	                            	$('.FCLexport div.packings form#packings input[name="mblNo"]').val(data['shippingBillLadingVOs'][1]['bLNo'])
	                            		.attr('billLadingId',data['shippingBillLadingVOs'][1]['billLadingId'])
	                            		.attr('billType',data['shippingBillLadingVOs'][1]['billType'])
	                            		.attr('parentId',data['shippingBillLadingVOs'][1]['parentId']);
	                            	for(var i=0;i<(data['shippingBillLadingVOs'][0]['shippingContainerVOs']).length;i++){
	                            	//	console.log(data['shippingBillLadingVOs'][0]['shippingContainerVOs'][i]);
	                            		var shippingContainer=data['shippingBillLadingVOs'][0]['shippingContainerVOs'][i];
	                            		packings.appendTable(data['shippingBillLadingVOs'][0]['shippingContainerVOs'][i],'.FCLexport div.containerInfo table tbody');
	                            		var caseOperationNo=shippingContainer['caseOperationNo'];
	                            		var billLadingNo=shippingContainer['billLadingNo'];
	                            		var caseNo=shippingContainer['caseNo'];
	                            		var caseSealNo=shippingContainer['caseSealNo'];
	                            		var goodsInfo=data['shippingBillLadingVOs'][0]['shippingContainerVOs'][i]['shippingGoodsInfoVOs'];
	                            		for(var j=0;j<goodsInfo.length;j++){
	                            			console.log(goodsInfo[j]);
	                            			goodsInfo[j]['caseOperationNo']=caseOperationNo;
	                            			goodsInfo[j]['billLadingNo']=billLadingNo;
	                            			goodsInfo[j]['caseNo']=caseNo;
	                            			goodsInfo[j]['caseSealNo']=caseSealNo;
	                            			packings.appendTable(goodsInfo[j],'.FCLexport div.plasticGoods table tbody');
	                            		}
	                            	}
	                            	for(var i=0;i<(data['shippingBillLadingVOs'][1]['shippingContainerVOs']).length;i++){
	                            		var shippingContainer=data['shippingBillLadingVOs'][1]['shippingContainerVOs'][i];
	                            		packings.appendTable(data['shippingBillLadingVOs'][1]['shippingContainerVOs'][i],'.FCLexport div.containerInfo table tbody');
	                            		var caseOperationNo=shippingContainer['caseOperationNo'];
	                            		var billLadingNo=shippingContainer['billLadingNo'];
	                            		var caseNo=shippingContainer['caseNo'];
	                            		var caseSealNo=shippingContainer['caseSealNo'];
	                            		var goodsInfo=data['shippingBillLadingVOs'][1]['shippingContainerVOs'][i]['shippingGoodsInfoVOs'];
	                            		for(var j=0;j<goodsInfo.length;j++){
	                            			goodsInfo[j]['caseOperationNo']=caseOperationNo;
	                            			goodsInfo[j]['billLadingNo']=billLadingNo;
	                            			goodsInfo[j]['caseNo']=caseNo;
	                            			goodsInfo[j]['caseSealNo']=caseSealNo;
	                            			packings.appendTable(goodsInfo[j],'.FCLexport div.plasticGoods table tbody');
	                            		}
	                            	}

	                            }else{
	                            	//对应的div绑定属性
	                            	console.log($('.FCLexport div.packings form#packings div.hbl.xszd'));
	                            	$('.FCLexport div.packings form#packings div.hbl.xszd')
	                            		.attr({'billLadingId':data['shippingBillLadingVOs'][1]['billLadingId'],'billType':data['shippingBillLadingVOs'][1]['billType']});
	                            	$('.FCLexport div.packings form#packings div.mbl.xszd')
	                            		.attr({'billLadingId':data['shippingBillLadingVOs'][0]['billLadingId'],'billType':data['shippingBillLadingVOs'][0]['billType']});
	                            	//给input赋值绑定属性
	                            	$('.FCLexport div.packings form#packings input[name="hblNo"]').val(data['shippingBillLadingVOs'][1]['bLNo'])
	                            		.attr('billLadingId',data['shippingBillLadingVOs'][1]['billLadingId'])
	                            		.attr('billType',data['shippingBillLadingVOs'][1]['billType'])
                            			.attr('parentId',data['shippingBillLadingVOs'][1]['parentId']);
	                            	$('.FCLexport div.packings form#packings input[name="mblNo"]').val(data['shippingBillLadingVOs'][0]['bLNo'])
                            			.attr('billLadingId',data['shippingBillLadingVOs'][0]['billLadingId'])
                            			.attr('billType',data['shippingBillLadingVOs'][0]['billType'])
                            			.attr('parentId',data['shippingBillLadingVOs'][0]['parentId']);
	                            	initID=data['shippingBillLadingVOs'][0]['billLadingId'];
	                            	for(var i=0;i<(data['shippingBillLadingVOs'][0]['shippingContainerVOs']).length;i++){
	                            		var shippingContainer=data['shippingBillLadingVOs'][0]['shippingContainerVOs'][i];
	                            		packings.appendTable(data['shippingBillLadingVOs'][0]['shippingContainerVOs'][i],'.FCLexport div.containerInfo table tbody');
	                            		var caseOperationNo=shippingContainer['caseOperationNo'];
	                            		var billLadingNo=shippingContainer['billLadingNo'];
	                            		var caseNo=shippingContainer['caseNo'];
	                            		var caseSealNo=shippingContainer['caseSealNo'];
	                            		var goodsInfo=data['shippingBillLadingVOs'][0]['shippingContainerVOs'][i]['shippingGoodsInfoVOs'];
	                            		for(var j=0;j<goodsInfo.length;j++){
	                            			console.log(goodsInfo[j]);
	                            			goodsInfo[j]['caseOperationNo']=caseOperationNo;
	                            			goodsInfo[j]['billLadingNo']=billLadingNo;
	                            			goodsInfo[j]['caseNo']=caseNo;
	                            			goodsInfo[j]['caseSealNo']=caseSealNo;
	                            			packings.appendTable(goodsInfo[j],'.FCLexport div.plasticGoods table tbody');
	                            		}
	                            	}
	                            	for(var i=0;i<(data['shippingBillLadingVOs'][1]['shippingContainerVOs']).length;i++){
	                            		var shippingContainer=data['shippingBillLadingVOs'][1]['shippingContainerVOs'][i];
	                            		packings.appendTable(data['shippingBillLadingVOs'][1]['shippingContainerVOs'][i],'.FCLexport div.containerInfo table tbody');
	                            		var caseOperationNo=shippingContainer['caseOperationNo'];
	                            		var billLadingNo=shippingContainer['billLadingNo'];
	                            		var caseNo=shippingContainer['caseNo'];
	                            		var caseSealNo=shippingContainer['caseSealNo'];
	                            		var goodsInfo=data['shippingBillLadingVOs'][1]['shippingContainerVOs'][i]['shippingGoodsInfoVOs'];
	                            		for(var j=0;j<goodsInfo.length;j++){
	                            			goodsInfo[j]['caseOperationNo']=caseOperationNo;
	                            			goodsInfo[j]['billLadingNo']=billLadingNo;
	                            			goodsInfo[j]['caseNo']=caseNo;
	                            			goodsInfo[j]['caseSealNo']=caseSealNo;
	                            			packings.appendTable(goodsInfo[j],'.FCLexport div.plasticGoods table tbody');
	                            		}
	                            	}
	                            }
	                            //进入页面显示MBL的集装箱信息
	                            	packings.showContainerInfo(initID);
	                            //分提单号
	                            for(var key=0;key<data['splitShippingBillLadingVOs'].length;key++){
	                           // 		console.log(data['splitShippingBillLadingVOs'][key]['shippingContainerVOs']);
	                            		var shippingContainerVOs=data['splitShippingBillLadingVOs'][key]['shippingContainerVOs'];
	                            		for(var i=0;i<shippingContainerVOs.length;i++){
	                            			packings.appendTable(shippingContainerVOs[i],'.FCLexport div.containerInfo table tbody');
	                            		//	console.log(shippingContainerVOs[i]);
	                            			var shippingContainer=shippingContainerVOs[i];
	                            			var caseOperationNo=shippingContainer['caseOperationNo'];
		                            		var billLadingNo=shippingContainer['billLadingNo'];
		                            		var caseNo=shippingContainer['caseNo'];
		                            		var caseSealNo=shippingContainer['caseSealNo'];
	                            			var goodsInfo=shippingContainerVOs[i]['shippingGoodsInfoVOs'];
	                            			for(var j=0;j<goodsInfo.length;j++){
		                            	//		console.log(goodsInfo[j]);
		                            			goodsInfo[j]['caseOperationNo']=caseOperationNo;
		                            			goodsInfo[j]['billLadingNo']=billLadingNo;
		                            			goodsInfo[j]['caseNo']=caseNo;
		                            			goodsInfo[j]['caseSealNo']=caseSealNo;
		                            			packings.appendTable(goodsInfo[j],'.FCLexport div.plasticGoods table tbody');
		                            		}
	                            		}
	                            		var $tr=$('<tr exchange_operate="" parentId='+data['splitShippingBillLadingVOs'][key]['parentId']+' billType='+data['splitShippingBillLadingVOs'][key]['billType']+' billLadingId='+data['splitShippingBillLadingVOs'][key]['billLadingId']+'>'+
                        						'<td>'+
                        							'<input type="checkbox" value='+data['splitShippingBillLadingVOs'][key]['billLadingId']+' name="billLadingId">'+
                        					    '</td>'+
                        					    '<td name="bLNo">'
                        					         +data['splitShippingBillLadingVOs'][key]['bLNo']+
                        					    '</td>'+
                        					  '</tr>');
	                            		if(data['splitShippingBillLadingVOs'][key]['billType']){
	                            			//0--海洋提单      1--货代提单
	                            			$('.FCLexport #packings div.hbl.xszd table tbody').append($tr);
	                            		}else{
	                            			$('.FCLexport #packings div.mbl.xszd table tbody').append($tr);
	                            		}
	                            }
	                        }
	                    })
					break;
				case 4:
					break;
				case 5:
					break;
				case 6:
					break;
				case 7:
					break;
		}
    }


	//禁止textarea换行
	function checkEnter(e){
		var et=e||window.event;
		var keycode=et.charCode||et.keyCode;
		if(keycode==13){
			if(window.event)
				window.event.returnValue=false;
			else{
				e.preventDefault();//firefox
			}
		}
	}
    //确认增加或者保存编辑
    function submitEditcustomsBillModal() {
        var data = $("#editcustomsBillForm").serializeObject();
        var saveType = $("#editcustomsBillForm input[name='saveType']").val();
        sendSubmitData(data,saveType);
    }
    $().ready(
        function validatecustomsBillForm() {
            $("#editcustomsBillForm").validate({
                rules: {

                },
                messages: {

                }
            });
        }
    );
    //Date picker
    $(function(){
    	$(document.body).css('overflow','auto');
    	 var billId;//菜单切换是操作，更改billId的值
        setTimeInput();
        //时间控件
        //Date picker
        $('.FCLexport .startTime,.FCLexport .endTime').datepicker({
            autoclose: true,
            language:"zh-CN",//语言设置
            format: "yyyy-mm-dd"
        });
        $('.FCLexport .seconds').datetimepicker({
            autoclose:true,
            format:"yyyy-mm-dd hh:mm",
            locale: moment.locale('zh-cn')
        })
        //tab菜单样式切换
        $('.FCLexport ul.Big').on('click','li',function(e){
        	billId=$(this).attr('billId');
        	console.log(billId);
        	e.stopPropagation();
        	e.preventDefault();
        	if($(this).hasClass('active')){

        	}else{
     //   		alert('已经移除active');
        //		console.log($('.FCLexport ul.Big').find('li.active'));
        		if($('.FCLexport ul.Big').find('li.active').attr('billid')){
				//	console.log('是业务菜单');
					var ind=$('.FCLexport div#smallTab div.ZLmain>ul>li.active').index();
                    $('.FCLexport ul.Big').find('li.active').attr('data-num',ind);
				}else{
        		//	console.log('是主菜单');
				}
        		$('.FCLexport ul.Big').find('li').removeClass('active');
        		$('.FCLexport div.Big>div').removeClass('active');
                $(this).addClass('active');
       //         console.log($(this).find('a').attr('href'))
                var tabPanelId=$(this).find('a').attr('href').split('#')[1];
        		if($(this).attr('data-num')){
                    //这里向后台请求数据    跟新页面   还要获取页面结束时所在的tab
        		    var num=$(this).attr('data-num');
                    $('.FCLexport div.Big>div#'+tabPanelId).addClass('active');
                    $('.FCLexport div#smallTab div.ZLmain>ul>li').removeClass('active');
                    $('.FCLexport div#smallTab div.ZLmain>div>div').removeClass('active');
                    $('.FCLexport div#smallTab div.ZLmain>ul>li:eq('+num+')').addClass('active');
                    $('.FCLexport div#smallTab div.ZLmain>div>div:eq('+num+')').addClass('active');
                    FCLexportDetail(billId,num);
				}else{
    //    			console.log('是主菜单');
                    FCLexport_table.ajax.reload();
                    $('.FCLexport div.Big>div#'+tabPanelId).addClass('active');
				}

        	}
        })
        //tab菜单点击图标删除菜单操作
        $('.FCLexport ul.Big').on('click','li span.closeTab',function(e){
        	e.stopPropagation();
        	e.preventDefault();
        	var Tabid=$(this).attr('closeTabid');
      //  	console.log($(this).parents('li').hasClass('active'));
        	if($(this).parents('li').hasClass('active')){
        		//删除当前菜单   操作结束后主页面获取active
        		$($(this).parents('ul').find('li')[0]).addClass('active');
        		$($('.FCLexport div.Big>div')[0]).addClass('active');
        		$(this).parents('li').remove();
                $($('.FCLexport div.Big>div')[1]).removeClass('active');

        	}else{
        		//直接删除即可
        		$(this).parents('li').remove();
        	}
        	return false;
        })
 //       console.log($('#FCLexportTable'))
    	$('.FCLexport #FCLexportTable').on('dblclick','tbody tr',function(){
    	//	console.log($(this).find('input:checked'));
    		if($(this).find('input:checked').length==1){
    	//		console.log($(this).find('input:checked').val());
    			var billId=$(this).find('input:checked').val();
    	//		console.log($('.FCLexport ul.Big').find('li'));
    			var flag=0;
    			for(var i=0;i<$('.FCLexport ul.Big').find('li').length;i++){
    			    if(billId==$($('.FCLexport ul.Big').find('li')[i]).attr('billId')){
    			        flag++;
                    }else{

                    }
                }
                if(flag==0){
    				//创建新的tab菜单
                    var mbLNo=$($(this).find('td')[2]).text();
                    $('.FCLexport ul.Big').find('li').removeClass('active');
                    $('.FCLexport ul.Big').append('<li role="presentation" class="active" billId='+billId+'> <a href="#smallTab" aria-controls="home" role="tab" data-toggle="tab">出口-整箱-'+mbLNo+'<span class="glyphicon glyphicon-remove closeTab" closeTabid='+billId+' style="borderr-radius:50%;background:#4122e5;color:white;margin-left:5px;"></span></a></li>');
                    $('.FCLexport div.Big').find('>div.tab-pane').removeClass('active');
                    $('.FCLexport div.smallTab').addClass('active');
                    changeZLmain(0);
                    //向后台请求数据
                    FCLexportDetail(billId,0);
                }else{
                    $('.FCLexport ul.Big').find('>li').removeClass('active');
                    $('.FCLexport div.Big').find('>div.tab-pane').removeClass('active');
                    $('.FCLexport ul.Big').find('li[billId="'+billId+'"]').addClass('active');
                    $('.FCLexport div.Big').find('>div.tab-pane#smallTab').addClass('active');
                    var num=$('.FCLexport ul.Big').find('li[billId="'+billId+'"]').attr('data-num');
                    FCLexportDetail(billId,num);
                }

            }else{
    	//		alert('您没有选择业务！');
    		}
    	});

        //点击委托菜单  向后台请求数据
        $('.FCLexport div.Big').on('click','li.entrust',function(){
            $('.FCLexport div.ZLmain>ul>li').removeClass('active');
            $('.FCLexport div.ZLmain>ul>li:eq(1)').addClass('active');
    //        console.log($('.FCLexport ul.Big li.active').attr('billid'));
            var id=$('.FCLexport ul.Big li.active').attr('billid');
            FCLexportDetail(id,1);
        });
        //点击订舱
        $('.FCLexport div.Big').on('click','li.booking',function(){
            $('.FCLexport div.ZLmain>ul>li').removeClass('active');
            $('.FCLexport div.ZLmain>ul>li:eq(2)').addClass('active');
         // console.log($('.FCLexport ul.Big li.active').attr('billid'));
            var id=$('.FCLexport ul.Big li.active').attr('billid');
            FCLexportDetail(id,2);
        });

        $('.FCLexport #HYTD select[name="payMethod"]').on('change',function(){
        	$('.FCLexport #HYTD input[name="payMethodDetail"]').val($(this).find("option:selected").attr('data-input'));
        });
        $('.FCLexport #HDTD select[name="payMethod"]').on('change',function(){
        	$('.FCLexport #HDTD input[name="payMethodDetail"]').val($(this).find("option:selected").attr('data-input'));
        })
        //页面加载时需要请求的基础数据
        //运输条款
        $.ajax({
            type:'post',
            url: getContextPath() + '/redisController/listIdObjectByname.do?name=basedataCommonSet_52_detail',
            data:{},
            success:function(data){
                var arr=[];
                data=JSON.parse(data);
            /*    for(var i=0;i<data.length;i++){
                    for(var key in data[i]){
                        if(data[i].hasOwnProperty(key)){
                            arr.push({'id':key,'text':data[i][key]});
                        }
                    }
                }
          //    console.log($('div#smallTab select.mbl[name="transportClause"]'));
                $('div#smallTab select.mbl[name="transportClause"]').select2({
                    data:arr
                });
                $('div#smallTab select.hbl[name="transportClause"]').select2({
                    data:arr
                });*/
                $("#HYTD select[name='transportClause']").empty();
                $("#HDTD select[name='transportClause']").empty();
                for(var key in data){
                    if(data.hasOwnProperty(key)){
                        $("#HYTD select[name='transportClause']").append("<option value='"+ data[key]['cn_name']  + "'>"+data[key]['cn_name']+"</option>");
                        $("#HDTD select[name='transportClause']").append("<option value='" + data[key]['cn_name'] + "'>"+data[key]['cn_name']+"</option>");
                    }
                }
            }
        })
        //付款方式
        $.ajax({
            type:'post',
            url: getContextPath() + 'redisController/listIdObjectByname.do?name=basedataCommonSet_53_detail',
            data:{},
            success:function(data){
            //    console.log(data);
                //  var arr=[];
                data=JSON.parse(data);
           //     console.log(data);
                $("#HYTD select[name='payMethod']").empty();
                $("#HDTD select[name='payMethod']").empty();
                for(var key in data){
                    if(data.hasOwnProperty(key)){
                        $("#HYTD select[name='payMethod']").append("<option value='" + data[key]['code'] + "' data-input='"+data[key]['cn_name']+"'>" + data[key]['code'] + "</option>");
                        $("#HDTD select[name='payMethod']").append("<option value='" + data[key]['code'] + "' data-input='"+data[key]['cn_name']+"'>" + data[key]['code'] + "</option>");
                    }
                }
                //   console.log($("#HYTD select[name='payMethod']"));
            }
        });
        //收货地
        /*$.ajax({
            type:'post',
            url: getContextPath() + 'redisController/listIdObjectByname.do?name=basedataPort_country',
            data:{},
            success:function(data){
          //  	alert('轻松收货地')
             //   console.log(data);
                //  var arr=[];
                data=JSON.parse(data);
              //  console.log(data);
              //  console.log($('.FCLexport div.entrRecePlaceDetail tr.entrRecePlaceDetailcloneDemo'));
              //  console.log($('.FCLexport div.entrRecePlaceDetail'))
                $('.FCLexport div.modalDIV').find('tr.newTR').remove();

                for(var key in data){
            //    	console.log(key);
                    $('<tr class="newTR">' +
                        '<td  name="port_code">'+data[key]['port_code']+'</td>' +
                        '<td name="port_name">'+data[key]['port_name']+'</td>' +
                        '<td name="port_name_cn">'+data[key]['port_name_cn']+'</td>' +
                        '<td name="en_name">'+data[key]['en_name']+'</td>' +
                        '<td name="cn_name">'+data[key]['cn_name']+'</td>' +
                        '</tr>').appendTo($('.FCLexport div.modalDIV table>tbody'));
                }
                $('.FCLexport div.modalDIV.entrDestDockDetail').find('tr.newTR').remove();
                $('.FCLexport div.modalDIV.entrRouteCodeDetail').find('tr.newTR').remove();
                $('.FCLexport div#entrTradeModeDiv').find('tr.newTR').remove();
                $('.FCLexport div.entrClientDetail').find('tr.newTR').remove();
          //      console.log($('.FCLexport div.entrRecePlaceDetail'));
            }
        });*/
        //码头
        $.ajax({
            type:'post',
            url: getContextPath() + '/redisController/listIdObjectByname.do?name=basedataWharf_port',
            data:{},
            success:function(data){
          //  	alert('轻松收货地')
          //      console.log(data);
                //  var arr=[];
                data=JSON.parse(data);
                $('.FCLexport div.modalDIV.entrDestDockDetail').find('tr.newTRMT').remove();
                for(var key in data){
                //	console.log(key);
                    $('<tr class="newTRMT">' +
                        '<td  name="port_code">'+data[key]['wharf_code']+'</td>' +
                        '<td name="port_name">'+data[key]['port_name']+'</td>' +
                        '<td name="port_name_cn">'+data[key]['name_cn']+'</td>' +
                        '<td name="en_name">'+data[key]['name_en']+'</td>' +
                        '<td name="cn_name">'+data[key]['country_name']+'</td>' +
                        '</tr>').appendTo($('.FCLexport div.modalDIV.entrDestDockDetail table>tbody'));
                    }
             }
        });
        //航线
        $.ajax({
            type:'post',
            url: getContextPath() + '/redisController/listIdObjectByname.do?name=basedataServiceLine_detail',
            data:{},
            success:function(data){
                data=JSON.parse(data);
                $('.FCLexport div.modalDIV.entrRouteCodeDetail').find('tr.newTRMT').remove();
                for(var key in data){
              //  	console.log(key);
                    $('<tr class="newTRMT">' +
                        '<td  name="service_line_code">'+data[key]['service_line_code']+'</td>' +
                        '<td name="service_line_name">'+data[key]['service_line_name']+'</td>' +
                        '<td name="service_line_name_cn">'+data[key]['service_line_name_cn']+'</td>' +
                        '</tr>').appendTo($('.FCLexport div.modalDIV.entrRouteCodeDetail table>tbody'));
                    }
             }
        });
        //贸易方式
        $.ajax({
            type:'post',
            url: getContextPath() + '/redisController/listIdObjectByname.do?name=basedataCommonSet_54_detail',
            data:{},
            success:function(data){
                data=JSON.parse(data);
           //     console.log(data);
                $('.FCLexport div#entrTradeModeDiv').find('tr.newTRMT').remove();
               for(var key in data){
             //   	console.log(key);
                    $('<tr class="newTRMT">' +
                        '<td  name="code">'+data[key]['code']+'</td>' +
                        '<td name="cn_name">'+data[key]['cn_name']+'</td>' +
                        '<td name="en_name">'+data[key]['en_name']+'</td>' +
                        '</tr>').appendTo($('.FCLexport div#entrTradeModeDiv table>tbody'));
                    }
             }
        });
        //贸易方式div点击后给input赋值
        $('.FCLexport div#entrTradeModeDiv table.smallTable tbody').on('click','tr.newTRMT>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
        	$('.FCLexport div#entrTradeModeDiv table.smallTable tbody').find('tr').css('background','transparent');
        	$(this).parent('tr.newTRMT').css('background','lightblue');
        	var cn_name=$(this).parent('tr.newTRMT').find('td[name="cn_name"]').text();
        	var code=$(this).parent('tr.newTRMT').find('td[name="code"]').text();
        	$('.FCLexport input[name="entrTradeModeCode"]').val(code);
        	$('.FCLexport input[name="entrTradeMode"]').val(cn_name);
        })
        //收货地div点击后给input赋值
        $('.FCLexport div.entrRecePlaceDetail.modalDIV table.smallTable tbody').on('click','tr.newTR>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
        	$('.FCLexport div.entrRecePlaceDetail.modalDIV table.smallTable tbody').find('tr').css('background','transparent');
        	$(this).parent('tr.newTR').css('background','lightblue');
        	var en_name=$(this).parent('tr.newTR').find('td[name="port_name"]').text();
        	var code=$(this).parent('tr.newTR').find('td[name="port_code"]').text();
        	$('.FCLexport input[name="entrRecePlaceCode"]').val(code);
        	$('.FCLexport input[name="entrRecePlaceName"]').val(en_name);
        	$('.FCLexport input[name="entrRecePlaceNameFinal"]').val(en_name);
        })
        //装货港div点击后给input赋值
        $('.FCLexport div.entrLoadingDetail.modalDIV table.smallTable tbody').on('click','tr.newTR>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
         	$('.FCLexport div.entrLoadingDetail.modalDIV table.smallTable tbody').find('tr').css('background','transparent');
        	$(this).parent('tr.newTR').css('background','lightblue');
        	var en_name=$(this).parent('tr.newTR').find('td[name="port_name"]').text();
        	var code=$(this).parent('tr.newTR').find('td[name="port_code"]').text();
        	$('.FCLexport input[name="entrLoadingPortCode"]').val(code);
        	$('.FCLexport input[name="entrLoadingPortName"]').val(en_name);
        	$('.FCLexport input[name="entrLoadingPortNameFinal"]').val(en_name);
        })
          //装卸港区div点击后给input赋值
        $('.FCLexport div.entrPortCodeDetail.modalDIV table.smallTable tbody').on('click','tr.newTR>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
        	$('.FCLexport div.entrPortCodeDetail.modalDIV table.smallTable tbody').find('tr').css('background','transparent');
        	$(this).parent('tr.newTR').css('background','lightblue');
        	var en_name=$(this).parent('tr.newTR').find('td[name="port_name"]').text();
        	var code=$(this).parent('tr.newTR').find('td[name="port_code"]').text();
        	$('.FCLexport input[name="entrPortCode"]').val(code);
        	$('.FCLexport input[name="entrPortName"]').val(en_name);
        	$('.FCLexport input[name="entrPortNameFinal"]').val(en_name);
        })
         //卸货港div点击后给input赋值
        $('.FCLexport div.entrUnloadingDetail.modalDIV table.smallTable tbody').on('click','tr.newTR>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
         	$('.FCLexport div.entrUnloadingDetail.modalDIV table.smallTable tbody').find('tr').css('background','transparent');
        	$(this).parent('tr.newTR').css('background','lightblue');
        	var en_name=$(this).parent('tr.newTR').find('td[name="port_name"]').text();
        	var code=$(this).parent('tr.newTR').find('td[name="port_code"]').text();
        	$('.FCLexport input[name="entrUnloadingPortCode"]').val(code);
        	$('.FCLexport input[name="entrUnloadingPortName"]').val(en_name);
        	$('.FCLexport input[name="entrUnloadingPortNameFinal"]').val(en_name);
        })
        //目的港div点击后给input赋值
        $('.FCLexport div.entrDestDetail.modalDIV table.smallTable tbody').on('click','tr.newTR>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
        	$('.FCLexport div.entrDestDetail.modalDIV table.smallTable tbody').find('tr').css('background','transparent');
        	$(this).parent('tr.newTR').css('background','lightblue');
        	var en_name=$(this).parent('tr.newTR').find('td[name="port_name"]').text();
        	var code=$(this).parent('tr.newTR').find('td[name="port_code"]').text();
        	$('.FCLexport input[name="entrDestPortCode"]').val(code);
        	$('.FCLexport input[name="entrDestPortName"]').val(en_name);
        	$('.FCLexport input[name="entrDestPortNameFinal"]').val(en_name);
        })
         //目的地码头div点击后给input赋值
        $('.FCLexport div.entrDestDockDetail.modalDIV table.smallTable tbody').on('click','tr.newTRMT>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
        	$('.FCLexport div.entrDestDockDetail.modalDIV table.smallTable tbody').find('tr').css('background','transparent');
        	$(this).parent('tr.newTRMT').css('background','lightblue');
        	var en_name=$(this).parent('tr.newTRMT').find('td[name="port_name"]').text();
        	var code=$(this).parent('tr.newTRMT').find('td[name="port_code"]').text();
        	$('.FCLexport input[name="entrDestDockCode"]').val(code);
        	$('.FCLexport input[name="entrDestDockName"]').val(en_name);
        	$('.FCLexport input[name="entrDestDockNameFinal"]').val(en_name);
        })
        //业务类型为input赋值
        $('.FCLexport div#businessTypeDiv table tbody').on('click','tr.newTR>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
        	$('.FCLexport div#businessTypeDiv table tbody').find('tr').css('background','transparent');
        	$(this).parent('tr.newTR').css('background','lightblue');
        	var en_name=$(this).parent('tr.newTR').find('td:eq(1)').text();
        	var code=$(this).parent('tr.newTR').find('td:eq(0)').text();
        	$('.FCLexport input[name="businessTypeCode"]').val(code);
        	$('.FCLexport input[name="businessTypeName"]').val(en_name);
        });
        //货源类型为input赋值
        $('.FCLexport div#supplyGoodsTypeDiv table tbody').on('click','tr.newTR>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
        	$('.FCLexport div#supplyGoodsTypeDiv table tbody').find('tr').css('background','transparent');
        	$(this).parent('tr.newTR').css('background','lightblue');
        	var en_name=$(this).parent('tr.newTR').find('td:eq(1)').text();
        	var code=$(this).parent('tr.newTR').find('td:eq(0)').text();
        	$('.FCLexport input[name="supplyGoodsTypeCode"]').val(code);
        	$('.FCLexport input[name="supplyGoodsTypeName"]').val(en_name);
        });
        //航线点击div为input赋值
        $('.FCLexport div.entrRouteCodeDetail table tbody').on('click','tr.newTRMT>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
         	$('.FCLexport div.entrRouteCodeDetail table tbody').find('tr').css('background','transparent');
         	$(this).parent('tr.newTRMT').css('background','lightblue');
         	var en_name=$(this).parent('tr.newTRMT').find('td:eq(1)').text();
        	var code=$(this).parent('tr.newTRMT').find('td:eq(0)').text();
        	$('.FCLexport input[name="entrRouteCode"]').val(code);
        	$('.FCLexport input[name="entrRouteName"]').val(en_name);
        })
        //委托人div点击选中一行为input赋值
        $('.FCLexport div.entrClientDetail table tbody').on('click','tr.newTRMT>td',function(e){
        	if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
        	$('.FCLexport div.entrClientDetail table tbody').find('tr').css('background','transparent');
        	$(this).parent('tr.newTRMT').css('background','lightblue');
        	var code=$(this).parent('tr.newTRMT').find('td:eq(0)').text();
        	var abbrCn=$(this).parent('tr.newTRMT').find('td:eq(1)').text();
            var customerId=$(this).parent('tr.newTRMT').attr("customerId");
            //alert(customerId);
        	$('.FCLexport input[name="entrClientCode"]').val(code);
        	$('.FCLexport input[name="entrClient"]').val(abbrCn);
            $('.FCLexport input[name="customerId"]').val(customerId);
        });
        $(document).click(function(){
       		$("div.modalDIV").css('display','none');
       		$("div.modalDIVSmall").css('display','none');
       	});
        //委托人按钮点击显现div
        $('.FCLexport input.showEntrClientDetail').on('click',function(e){
        	//阻止冒泡
            if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
            //委托人
            $.ajax({
                type:'post',
                url: getContextPath() + 'saleCustomerEmployee/listManInCharge.do',
                data:{"keys":'{}',"start":0,"length":1000},
                success:function(data){
                   data=JSON.parse(data);
              //   console.log(data);
                   data=data.aaData;
                    $('.FCLexport div.entrClientDetail').find('tr.newTRMT').remove();
              //   console.log(data);
                   for(var key=0;key<data.length;key++){
              //   console.log(key);
               //  console.log(data[key]);
                	var $tr=$('<tr class="newTRMT" customerId='+data[key]['saleCustomer']['customerId']+'>'+
    						'<td name="customerCode">'+data[key]['saleCustomer']['customerCode']+'</td>'+
    						'<td name="abbrCn">'+data[key]['saleCustomer']['abbrCn']+'</td>'+
    						'<td name="customerNameCn">'+data[key]['saleCustomer']['customerNameCn']+'</td>'+
    						'<td name="manInCharge">'+data[key]['manInCharge']+'</td>'+
    						'<td name="mobile">'+data[key]['mobile']+'</td>'+
    						'<td  name="saleStatusName">'+data[key]['saleCustomer']['saleStatusName']+'</td>'+
    						'<td name="responsiblePerson">'+data[key]['saleCustomer']['responsiblePerson']+'</td>'+
    						'<td name="payTypeName">'+data[key]['saleCustomer']['payTypeName']+'</td>'+
    						'<td name="address">'+data[key]['saleCustomer']['address']+'</td>'+
    						'<td name="creditRateName">'+data[key]['saleCustomer']['creditRateName']+'</td>'+
    						'</tr>');
                		$tr.appendTo('.FCLexport div.entrClientDetail table>tbody');
                        }
                   $("div.modalDIVSmall").css('display','none');
               	$('.FCLexport div.modalDIV').css('display','none');
               	$('.FCLexport div.entrClientDetail').css('display','block');
                 }
            });


        })
        //选择收货地input触发事件
        $('.FCLexport input.takeConsignorAddress').on('click',function(e){
        	//阻止冒泡
            if(e.stopPropagation){
        		e.stopPropagation();
        	}else{
        		e.cancelBubble=true;
        	}
    //    	alert('点击了收货地');
        	$('.FCLexport div.modalDIV').css('display','none');
        	$("div.modalDIVSmall").css('display','none');
            $('.FCLexport div.entrRecePlaceDetail').css('display','block');
        	$(this).bind('input propertychange', function() {  
        		var str=$(this).val();
        		var Arrtd=$('.FCLexport div.entrRecePlaceDetail tbody tr.newTR').find('td:eq(0)');
        		for(var td in Arrtd){
        			if(Arrtd.hasOwnProperty(td)){
        				if($(Arrtd[td]).text().indexOf(str)>=0){
        					$(Arrtd[td]).parent('tr').css('display','table-row');
        				}else{
        					$(Arrtd[td]).parent('tr').css('display','none');
        				}
        			}
        		}
        	}); 
        });
        //选择航线input触发的事件
        $('.FCLexport input.showDIV[name="entrRouteCode"]').on('click',function(e){
        	  if(e.stopPropagation){
                  e.stopPropagation();
              }else{
                  e.cancelBubble=true;
              }
        	  $('.FCLexport div.modalDIV').css('display','none');
        	  $("div.modalDIVSmall").css('display','none');
              $('.FCLexport div.entrRouteCodeDetail').css('display','block');
		      $(this).bind('input propertychange', function() {  
		    		var str=$(this).val();
		    		var Arrtd=$('.FCLexport div.entrRouteCodeDetail tbody tr.newTRMT').find('td:eq(0)');
		    		for(var td in Arrtd){
		    			if(Arrtd.hasOwnProperty(td)){
		    				if($(Arrtd[td]).text().indexOf(str)>=0){
		    					$(Arrtd[td]).parent('tr').css('display','table-row');
		    				}else{
		    					$(Arrtd[td]).parent('tr').css('display','none');
		    				}
		    			}
		    		}
		    }); 
        });
        //选择装货港input触发的事件
        $('.FCLexport input.showDIV[name="entrLoadingPortCode"]').on('click',function (e){
            if(e.stopPropagation){
                e.stopPropagation();
            }else{
                e.cancelBubble=true;
            }
            console.log(  $('.FCLexport input.showDIV[name="entrLoadingPortCode"]'));
     //       alert('点击了装货港');
        	$('.FCLexport div.modalDIV').css('display','none');
        	$("div.modalDIVSmall").css('display','none');
            $('.FCLexport div.entrLoadingDetail').css('display','block');
        	$(this).bind('input propertychange', function() {  
        		var str=$(this).val();
        		var Arrtd=$('.FCLexport div.entrLoadingDetail tbody tr.newTR').find('td:eq(0)');
        		for(var td in Arrtd){
        			if(Arrtd.hasOwnProperty(td)){
        				if($(Arrtd[td]).text().indexOf(str)>=0){
        					$(Arrtd[td]).parent('tr').css('display','table-row');
        				}else{
        					$(Arrtd[td]).parent('tr').css('display','none');
        				}
        			}
        		}
        	}); 
        });
        //选择装卸港区input事件
        $('.FCLexport input.showDIV[name="entrPortCode"]').on('click',function (e){
            if(e.stopPropagation){
                e.stopPropagation();
            }else{
                e.cancelBubble=true;
            }
        	$('.FCLexport div.modalDIV').css('display','none');
        	$("div.modalDIVSmall").css('display','none');
            $('.FCLexport div.entrPortCodeDetail').css('display','block');
        	$(this).bind('input propertychange', function() {  
        		var str=$(this).val();
        		var Arrtd=$('.FCLexport div.entrPortCodeDetail tbody tr.newTR').find('td:eq(0)');
        		for(var td in Arrtd){
        			if(Arrtd.hasOwnProperty(td)){
        				if($(Arrtd[td]).text().indexOf(str)>=0){
        					$(Arrtd[td]).parent('tr').css('display','table-row');
        				}else{
        					$(Arrtd[td]).parent('tr').css('display','none');
        				}
        			}
        		}
        	}); 
        });
        //选择卸货港input事件
          $('.FCLexport input.showDIV[name="entrUnloadingPortCode"]').on('click',function (e){
            if(e.stopPropagation){
                e.stopPropagation();
            }else{
                e.cancelBubble=true;
            }
        	$('.FCLexport div.modalDIV').css('display','none');
            $('.FCLexport div.entrUnloadingDetail').css('display','block');
        	$(this).bind('input propertychange', function() {  
        		var str=$(this).val();
        		var Arrtd=$('.FCLexport div.entrUnloadingDetail tbody tr.newTR').find('td:eq(0)');
        		for(var td in Arrtd){
        			if(Arrtd.hasOwnProperty(td)){
        				if($(Arrtd[td]).text().indexOf(str)>=0){
        					$(Arrtd[td]).parent('tr').css('display','table-row');
        				}else{
        					$(Arrtd[td]).parent('tr').css('display','none');
        				}
        			}
        		}
        	}); 
        })
         //选择目的港input事件
          $('.FCLexport input.showDIV[name="entrDestPortCode"]').on('click',function (e){
            if(e.stopPropagation){
                e.stopPropagation();
            }else{
                e.cancelBubble=true;
            }
            console.log(  $('.FCLexport input.showDIV[name="entrDestPortCode"]'));
      //      alert('点击了装货港');
        	$('.FCLexport div.modalDIV').css('display','none');
            $('.FCLexport div.entrDestDetail').css('display','block');
        	$(this).bind('input propertychange', function() {  
        		var str=$(this).val();
        		var Arrtd=$('.FCLexport div.entrDestDetail tbody tr.newTR').find('td:eq(0)');
        		for(var td in Arrtd){
        			if(Arrtd.hasOwnProperty(td)){
        				if($(Arrtd[td]).text().indexOf(str)>=0){
        					$(Arrtd[td]).parent('tr').css('display','table-row');
        				}else{
        					$(Arrtd[td]).parent('tr').css('display','none');
        				}
        			}
        		}
        	}); 
        })
        //选择目的地码头input事件
          $('.FCLexport input.showDIV[name="entrDestDockCode"]').on('click',function (e){
            if(e.stopPropagation){
                e.stopPropagation();
            }else{
                e.cancelBubble=true;
            }
        //   console.log(  $('.FCLexport input.showDIV[name="entrDestDockCode"]'));
      //      alert('点击了装货港');
        	$('.FCLexport div.modalDIV').css('display','none');
            $('.FCLexport div.entrDestDockDetail').css('display','block');
        	$(this).bind('input propertychange', function() {  
        		var str=$(this).val();
        		var Arrtd=$('.FCLexport div.entrDestDockDetail tbody tr.newTRMT').find('td:eq(0)');
        		for(var td in Arrtd){
        			if(Arrtd.hasOwnProperty(td)){
        				if($(Arrtd[td]).text().indexOf(str)>=0){
        					$(Arrtd[td]).parent('tr').css('display','table-row');
        				}else{
        					$(Arrtd[td]).parent('tr').css('display','none');
        				}
        			}
        		}
        	}); 
        });
        //选择贸易方式input事件
          $('.FCLexport input.showDIV[name="entrTradeModeCode"]').on('click',function (e){
            if(e.stopPropagation){
                e.stopPropagation();
            }else{
                e.cancelBubble=true;
            }
        //   console.log(  $('.FCLexport input.showDIV[name="entrDestDockCode"]'));
      //      alert('点击了装货港');
        	$('.FCLexport div.modalDIV').css('display','none');
            $('.FCLexport div#entrTradeModeDiv').css('display','block');
        	$(this).bind('input propertychange', function() {  
        		var str=$(this).val();
        		var Arrtd=$('.FCLexport div#entrTradeModeDiv tbody tr.newTRMT').find('td:eq(0)');
        		for(var td in Arrtd){
        			if(Arrtd.hasOwnProperty(td)){
        				if($(Arrtd[td]).text().indexOf(str)>=0){
        					$(Arrtd[td]).parent('tr').css('display','table-row');
        				}else{
        					$(Arrtd[td]).parent('tr').css('display','none');
        				}
        			}
        		}
        	}); 
        })
        //选择业务类型
        $('.FCLexport #entrustBase span.showBusinessType').on('click',function(e){
        	if(e.stopPropagation){
                e.stopPropagation();
            }else{
                e.cancelBubble=true;
            }
            //业务类型
            $.ajax({
                "type":"POST",
                "url":getContextPath()+'/redisController/listIdObjectByname.do?name=basedataCommonSet_50_detail',
                "data":{},
                "success":function(data){
                    data=JSON.parse(data);
                    for(var key in data){
                        if(data.hasOwnProperty(key)){
                                  $('.FCLexport #businessTypeTable ').append("<tr class='newTR'><td>"+data[key].code+"</td><td>"+data[key].cn_name+"</td><td>"+data[key].en_name+"</td><td></td></tr>")
                        }
                    }
                }
            });

        	$(".FCLexport #businessTypeDiv").css("display","block");
        })
        //选择货源类型
        $('.FCLexport #entrustBase span.showSupplyGoods').on('click',function(e){
        	callAlert('点击了选择业务类型');
        	if(e.stopPropagation){
                e.stopPropagation();
            }else{
                e.cancelBubble=true;
            }
            $.ajax({
                "type":"POST",
                "url":getContextPath()+'/redisController/listIdObjectByname.do?name=basedataCommonSet_51_detail',
                "data":{},
                "success":function(data){
                    console.log(data);
                    //  var arr=[];
                    data=JSON.parse(data);
        //            console.log(data);
                    // $("#HYTD select[name='payMethod']").empty();
                    for(var key in data){
                        if(data.hasOwnProperty(key)){
                            $('.FCLexport #supplyGoodsTypeTable ').append("<tr class='newTR'><td>"+data[key].code+"</td><td>"+data[key].cn_name+"</td><td>"+data[key].en_name+"</td></tr>")
                        }
                    }
                }
            });
        	$(".FCLexport #supplyGoodsTypeDiv").css("display","block");
        });

   });

    //初始化下拉框
    $(function () {
        $(".FCLexport .select2").select2();
        //下拉框中加载数据
        initSelect2_FCLexport();
        //解决select2在弹开中不能搜素的问题
        $.fn.modal.Constructor.prototype.enforceFocus = function () {
        };
    })

    //select2具体初始化
    function initSelect2_FCLexport() {
        var otherConditionsData= [{ id: 'entrCustomerCode', text: '客户编号' }, { id: 'operator', text: '操作员' }, { id: 'spellCode', text: '拼码' }, { id: 'bookingRoomName', text: '订舱方' }, {id:'splitBillType',text:'分提单号'},{ id: 'bookShipName', text: '船名' },{id:'bookVoyage',text:'航次'},{id:'caseNo',text:'箱号'},{id:'caseSealNo',text:'封号'},{id:'disEntryCode',text:'进仓编号'},{id:'customsNo',text:'报关单号'},{id:'latest_status',text:'最新状态'}];
        var otherTypeData=[{id:'LIKE',text:'包含'},{id:'EQUAL',text:'等于'},{id:'NOTEQUAL',text:'不等于'},{id:'NOTLIKE',text:'不包含'}]

       $('.otherConditions').select2({
            data:otherConditionsData
        });
        $('.otherType').select2({
            data:otherTypeData
        })
    }
    //业务查询搜索 datatable搜索
    function doSearch(){
        FCLexport_table.ajax.reload();
    }

    //其他条件搜索 确定按钮
    function otherSearch() {
        keysOption={};
        $('#moreCriteriaForm').find('input:checkbox:checked');
        console.log( $('#moreCriteriaForm').find('input:checkbox:checked'));
        var checkboxArr=$('#moreCriteriaForm').find('input:checkbox:checked');
        for(var i=0;i<checkboxArr.length;i++){
       //     console.log($(checkboxArr[i]).attr('name'));
            var checkName=$(checkboxArr[i]).attr('name');
        //    console.log($(checkboxArr[i]).parents('td').next().find('input').val());
            var inpArr=$(checkboxArr[i]).parents('td').next().find('input');
            if(inpArr.length==1){
    //            console.log(inpArr.val());
                if(inpArr.val()==null){
    //                console.log('未输入');
                }else{
                    keysOption[checkName]=inpArr.val();

                    var typeName=inpArr.prev().prev('select').attr('name');
                    keysOption[typeName]=inpArr.prev().prev('select').val();
                }
            }else{
                //选择为时间

                if($(inpArr[0]).attr('name')=='bookExpectLeavePortStart'||$(inpArr[0]).attr('name')=='bookLeavePortStart'){
                    keysOption[$(inpArr[0]).attr('name')]=$(inpArr[0]).val()+" 00:00";
                    keysOption[$(inpArr[1]).attr('name')]=$(inpArr[1]).val()+" 00:00";
                }else{
                    keysOption[$(inpArr[0]).attr('name')]=$(inpArr[0]).val();
                    keysOption[$(inpArr[1]).attr('name')]=$(inpArr[1]).val();
                }
            }
        }
        $('.FCLexport #moreCriteriaModal').modal('hide');
    }
    /*新增*/
    function newBusiness(){
    //	alert('点击了新增按钮');
    	$.ajax({
    		type:"POST",
    		url:getShipContextPath()+'/shippingBillEntrust/generateServiceCode.do',
    		success:function(data){
    		//	alert(data);
    			$('.FCLexport div#newWT input[name=entrServiceCode]').val(data);
    		}
    	});
    }
    /*提交新增数据详情*/
    function newDetail(){
    	var text=$('.FCLexport div#newWT input[name=entrServiceCode]').val();

    	$.ajax({
    		type:"POST",
    		url:getShipContextPath()+'/shippingBillEntrust/insert.do',
    		data:{'businessCode':text},
    		success:function(data){
    		//	alert(data);
    		    //创建新标签叶   且跳转到委托菜单
    			//创建新的tab菜单
    			var billId=1234;
                var mbLNo=$($(this).find('td')[2]).text();
                $('.FCLexport ul.Big').find('li').removeClass('active');
                $('.FCLexport ul.Big').append('<li role="presentation" class="active" billId='+billId+'> <a href="#smallTab" aria-controls="home" role="tab" data-toggle="tab">出口-整箱-'+text+'<span class="glyphicon glyphicon-remove closeTab" closeTabid='+billId+' style="borderr-radius:50%;background:#4122e5;color:white;margin-left:5px;"></span></a></li>');
                $('.FCLexport div.Big').find('>div.tab-pane').removeClass('active');
                $('.FCLexport div.smallTab').addClass('active');
                changeZLmain(1);
                //向后台请求数据
                FCLexportDetail(billId,1);
    		}
    	});
    }
    /*新增箱货信息*/
    function addContainer(){
     // alert('点击了新增箱货信息');
     //   console.log($('form#XHXX table tr div table tr.cloneDemo'));
        var num=$('form#XHXX table tr div table tr.createNew').length;
       /* var $tr=$($('form#XHXX table tr div table tr.cloneDemo')[0]).clone().removeClass('cloneDemo').css('display','table-row').addClass('createNew');*/
        var $tr=$('<tr class="createNew" style="display:table-row;" onclick="FCLexport.chooseContainer(this)" shippingContainerGoods=\'{"accessGroup": 0,"amendTime": "","amender": 0,"billId":0,"boxType": "20GP","containerGoodsId": 0,"createTime": "","creator": 0,"dangerGoodsAttribute": "","dangerGoodsClassification": 0,"dangerGoodsPackage": "","dangerLabel": "","defrostSettings": "","description": "","emergMeasuresNo": "","emptyWeight": "","flashPoint": "","folio": "","fullSpell": "","goodsAttribute": "普通货物","height": "","humidityValue": "","isDeleted": 0,"length": "","maxFreezTemperature": "","medicalEmergNo": "","minFreezTemperature": "","number":0,"recordVersion": 0,"setTemperature": "","soc": 0,"temperatureUnit": "","teu":0,"unitedNationsCode": "","ventilationSettings": "","wide": "0"}\'>'+
        ' <td>'+
        '<select name="boxType_goods" data-type="goods">'+
        '<option name="20GP" value="20GP">20GP</option>'+
        '<option name="40GP" value="40GP">40GP</option>'+
        '<option name="40HQ" value="40HQ">40HQ</option>'+
        '<option name="45HQ" value="45HQ">45HQ</option>'+
        '</select>'+
        '</td>'+
        '<td style="padding:0px;"><input style="width:100%;border:none;" type="text" name="number_goods" data-type="goods" value="1"></td>'+
        '<td>'+
        '<select name="fullSpell_goods" data-type="goods">'+
        '<option name="FCL" value="FCL">FCL</option>'+
        '<option name="LCL" value="LCL">LCL</option>'+
        '</select>'+
        '</td>'+
        '<td>'+
        '<select name="emptyWeight_goods" data-type="goods">'+
        '<option name="F" value="F">F</option>'+
        '<option name="E" value="E">E</option>'+
        '</select>'+
        '</td>'+
        '<td>'+
        '<input type="checkbox" name="soc_goods" data-type="goods" value="0">'+
        '</td>'+
        '<td>'+
        '<select name="goodsAttribute_goods" data-type="goods">'+
        '<option name="普通货物" value="普通货物" data-val=0>普通货物</option>'+
        '<option name="危险品" value="危险品" data-val=1>危险品</option>'+
        '<option name="冷冻柜" value="冻柜" data-val=2>冻柜</option>'+
        '<option name="大件货" value="大件货" data-val=3>大件货</option>'+
        '</select>'+
        '</td>'+
        '<td>'+
        '<a onclick="FCLexport.ContainerDetail(this)">详情</a>'+
        '</td>'+
        '</tr>');
        var shipOBJ=JSON.parse($tr.attr('shippingContainerGoods'));
        shipOBJ.billId=$('.FCLexport ul.Big>li.active').attr('billid');
        $tr.attr('shippingContainerGoods',JSON.stringify(shipOBJ));
        $tr.attr('containergoodsid','new'+num);
        $('form#XHXX table tr td div table.myTable').append($tr);
   }
    /*复制箱货信息*/
    function copyContainer(d){
    //	alert('点击了复制箱货信息');
    //	console.log($(d).parents('form#XHXX').find('tr.chooseContainer').clone());
    	var trOBJ=JSON.parse($(d).parents('form#XHXX').find('tr.chooseContainer').attr('shippingContainerGoods'));
    	trOBJ['containerGoodsId']=0;
  //  	console.log(trOBJ);
    	//复制选中的信息，移除chooseContainer类，将containerGoodsId设置为0
    	$(d).parents('form#XHXX').find('tr.chooseContainer').clone().removeClass('chooseContainer').attr('shippingContainerGoods',JSON.stringify(trOBJ)).appendTo($(d).parents('form#XHXX').find('table.myTable tbody'));

    }
    /*删除箱货信息*/
    function delContainer(d){
   // 	alert('点击了删除箱货信息');
   //  	alert($(d).parents('form#XHXX').find('tr.chooseContainer').hasClass('createNew'));
    	if($(d).parents('form#XHXX').find('tr.chooseContainer').hasClass('createNew')){
    		$(d).parents('form#XHXX').find('tr.chooseContainer').remove();
    	}else{
    	 var trOBJ=JSON.parse($(d).parents('form#XHXX').find('tr.chooseContainer').attr('shippingContainerGoods'));
    	 trOBJ['isDeleted']=1;
    	 $(d).parents('form#XHXX').find('tr.chooseContainer').attr('shippingContainerGoods',JSON.stringify(trOBJ)).css('display','none');
    	}
    }
    /*点击单行箱货信息背景颜色改变*/
    function chooseContainer(d){
    	$(d).parent().find('tr').removeClass('chooseContainer');
    	$(d).addClass('chooseContainer');
    	return false;
    }
	/*箱货信息详情*/
    function ContainerDetail(d){
    	var DetailObj=$.parseJSON($(d).parents('tr').attr('shippingContainerGoods'));
    	var id=$(d).parent().prev('td').find('select').val();
    	if(id!='普通货物'){

    		$('#ContainerDetail').find('div.row>div').css('display','none');
    		switch(id){
    			case "危险品":id=1;
    				   break;
    			case "冻柜":id=2;
    				   break;
    			case "大件货":id=3;
    					break;
    		}
        	$('#ContainerDetail').find('div.row>div.div'+id).css('display','block');
        	var arrInput=$('#ContainerDetail').find('div.row>div.div'+id+' input');
        	$.each(arrInput,function(a,b){
        		$(this).val(DetailObj[$(this).attr('name')]);
        	});
        	$('#ContainerDetail .modal-footer').find('button:eq(0)').attr('data-id',$(d).parents('tr').attr('containergoodsid'));
        	$('#ContainerDetail').modal('show');

    	}else{
    		$(d).css('disabled');
    	}
    }
    function ContainerDetailSubmit(d) {
          search_data=$('.FCLexport #ContainerDetailForm').serializeObject();
          $('#ContainerDetail').modal('hide');
          var shipOBJ=JSON.parse($('.FCLexport #XHXX table table tr[containergoodsid='+$(d).attr('data-id')+']').attr('shippingContainerGoods'));
          for(var key in search_data){
              shipOBJ[key]=search_data[key];
          }
          $('.FCLexport #XHXX table table tr[containergoodsid='+$(d).attr('data-id')+']').attr('shippingContainerGoods',JSON.stringify(shipOBJ));
    }
    //关闭DIV
    function closeDetail(id){
    	 $('.FCLexport div'+id).css('display','none');
    }
    /*选择发货人*/
    function choseConsignor(d){
        var customerId=$('.FCLexport #entrustBase input[name="customerId"]').val();
        if(!customerId){
            customerId=0;
        }
        callAlert(customerId);
    	 $.ajax({
    	 	"type":"POST",
    		"url":getContextPath()+'/saleBillCustomer/getByCustomerId.do',
    	 	"data":{id:customerId},
    	 	"success":function(data){

    	 	}
    	 });
    	$('#shipperDetail').modal('show');
    }
    /*委托页面保存*/
 /*   function entrustSave() {
      alert('点击了委托保存');
    //    alert($('.FCLexport ul.Big li.active').attr('billid'));
        var liId=$('.FCLexport ul.Big li.active').attr('billid');
        $.ajax({
            "type" : "POST",
            "url" : getShipContextPath()+'/shippingBillEntrust/save.do',
            contentType: "application/json;charset=UTF-8",
            "data" : function (){
            	search_dataBase=$('.FCLexport #entrustBase').serializeObject();
                search_dataMBL=$('.FCLexport #HYTD').serializeObject();
                console.log(search_dataMBL);
                search_dataHBL=$('.FCLexport #HDTD').serializeObject();
                console.log(search_dataHBL);
                search_dataXHXX=$('.FCLexport #XHXX').serializeObject();
                console.log(search_dataXHXX);
                console.log($(this));
                search_dataGoods=$('.FCLexport div#xhxx form#XHXX table td div table.myTable tr.appendNew,.FCLexport div#xhxx form#XHXX table td div table.myTable tr.createNew');
                var k={};
                var hbl={};
                var mbl={};
                var shippingContainerGoods=[];
                k={'billId':liId};
                if(search_dataBase.isAppFreightForwarder=='on'){
                    search_dataBase.isAppFreightForwarder=1;
                }else {
                    search_dataBase.isAppFreightForwarder=0;
                };
                if(search_dataBase.isAppShipCompany=='on'){
                    search_dataBase.isAppShipCompany=1;
                }else {
                    search_dataBase.isAppShipCompany=0;
                };
                if(search_dataBase.isBooking=='on'){
                    search_dataBase.isBooking=1;
                }else {
                    search_dataBase.isBooking=0;
                };
                if(search_dataBase.isPureDrag=='on'){
                    search_dataBase.isPureDrag=1;
                }else {
                    search_dataBase.isPureDrag=0;
                };
                if(search_dataBase.isPureDragPureReport=='on'){
                    search_dataBase.isPureDragPureReport=1;
                }else {
                    search_dataBase.isPureDragPureReport=0;
                };
                if(search_dataBase.isPureReport=='on'){
                    search_dataBase.isPureReport=1;
                }else {
                    search_dataBase.isPureReport=0;
                };
                for(var key in search_dataBase){
                	k[key]=search_dataBase[key];
                };
                for(var key in search_dataMBL){
                	mbl[key]=search_dataMBL[key];
                };
                for(var key in search_dataHBL){
                	hbl[key]=search_dataHBL[key];
                };
                for(var key in search_dataXHXX){
                	//if()
                	console.log(key.split('_goods'));
                	if(key.split('_goods').length>1){

                	}else{
                		k[key]=search_dataXHXX[key];
                	}
                };
                for(var i=0;i<search_dataGoods.length;i++){
                  var trOBJ=$.parseJSON($(search_dataGoods[i]).attr('shippingContainerGoods'));
                  $.each($(search_dataGoods[i]).find('input,select,textarea'),function(){
                	  if($(this).attr('name')=='soc_goods'){
                		  console.log($(this).is(':checked'));
                		  if($(this).is(':checked')){
                			  trOBJ[$(this).attr('name').split('_goods')[0]]=1;
                		  }else{
                			  trOBJ[$(this).attr('name').split('_goods')[0]]=0;
                		  }
                	  }else{
                		  trOBJ[$(this).attr('name').split('_goods')[0]]=$(this).val();
                	  }

                  });
                    delete trOBJ.createTime;
                    delete trOBJ.amendTime;
                  shippingContainerGoods.push(trOBJ);
                }

                k['hbl']=hbl;
                k['mbl']=mbl;
                k['shippingContainerGoods']=shippingContainerGoods;
                return JSON.stringify(k);
            }()
        });
    }*/
    //页面保存
    function FCLexportSave() {
        //获取billId
        var liId = $('.FCLexport ul.Big li.active').attr('billid');
        //获取当前li
       var num= $("#smallTab .ZLmain>ul>li.active").index()+1;
        switch (num) {
            case 2:
             //   alert('点击了委托保存');
                $.ajax({
                    "type": "POST",
                    "url": getShipContextPath() + '/shippingBillEntrust/save.do',
                    contentType: "application/json;charset=UTF-8",
                    "data": function () {
                        search_dataBase = $('.FCLexport #entrustBase').serializeObject();
                        search_dataMBL = $('.FCLexport #HYTD').serializeObject();
                        search_dataHBL = $('.FCLexport #HDTD').serializeObject();
                        search_dataXHXX = $('.FCLexport #XHXX').serializeObject();
                        search_dataGoods = $('.FCLexport div#xhxx form#XHXX table td div table.myTable tr.appendNew,.FCLexport div#xhxx form#XHXX table td div table.myTable tr.createNew');
                        var k = {};
                        var hbl = {};
                        var mbl = {};
                        var shippingContainerGoods = [];
                        k = {'billId': liId};
                        for (var key in search_dataBase) {
                            k[key] = search_dataBase[key];
                        };
                        for (var key in search_dataMBL) {
                            mbl[key] = search_dataMBL[key];
                        };
                        for (var key in search_dataHBL) {
                            hbl[key] = search_dataHBL[key];
                        };
                        for (var key in search_dataXHXX) {
                           if (key.split('_goods').length > 1) {

                            } else {
                                k[key] = search_dataXHXX[key];
                            }
                        };

                        for (var i = 0; i < search_dataGoods.length; i++) {

                            var trOBJ = $.parseJSON($(search_dataGoods[i]).attr('shippingContainerGoods'));

                            $.each($(search_dataGoods[i]).find('input,select,textarea'), function () {

                                if ($(this).attr('name') == 'soc_goods') {

                                    if ($(this).is(':checked')) {
                                        trOBJ[$(this).attr('name').split('_goods')[0]] = 1;
                                    } else {
                                        trOBJ[$(this).attr('name').split('_goods')[0]] = 0;
                                    }
                                } else {
                                    trOBJ[$(this).attr('name').split('_goods')[0]] = $(this).val();
                                }

                            });
                            delete trOBJ.createTime;
                            delete trOBJ.amendTime;
                            shippingContainerGoods.push(trOBJ);
                        }

                        k['hbl'] = hbl;
                        k['mbl'] = mbl;
                        k['shippingContainerGoods'] = shippingContainerGoods;
                        return JSON.stringify(k);
                    }()
                });
                break;
            case 3:
              //   alert("##保存订舱信息");
                $.ajax({
                    "type": "POST",
                    "url": getShipContextPath() + '/shippingBillBooking/saveBooking.do',
                    contentType: "application/json;charset=UTF-8",
                    "data": function () {
                       var pzxx_data  = $('.FCLexport #PZXX').serializeObject();
                       var dcxx_data  = $('.FCLexport #DCXX').serializeObject();
                       var k = {'billId': liId};
                        for (var key in pzxx_data){
                            k[key]=pzxx_data[key];
                        }
                        for (var key in dcxx_data){
                            k[key]=dcxx_data[key];
                        }
                        //console.log(JSON.stringify(k));
                    return JSON.stringify(k);
                    }()
                });
                break;
            case 4:
            	packings.savePackings();
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                break;
            case 8:
                break;
        }
    }
    /*删除当前业务*/
    function deleteBusiness(d){
        var liId=$('.FCLexport ul.Big li.active').attr('billid');
        $.ajax({
            "type":"POST",
            "url":getShipContextPath()+'/shippingBill/delete.do',
            "data":{billIds:liId},
            "success":function(data){
                var data=JSON.parse(data);
         //     alert(data.message);
              if(data.code==0){
                  //删除当前业务，跳转到主页
                  $("#smallTab").removeClass("active");
                  $(".FCLexport ul.Big>li.active").remove();
                  $($('.FCLexport div.Big>div')[0]).addClass('active');
                  FCLexport_table.ajax.reload();
              }
            }
        });
    }
    //批量删除
    function deleteBusinessAll() {
        var info;
        var selectedRowData = FCLexport_table.rows('.selected').data();
        if (selectedRowData.length < 1) {
            info = "请选择需要删除的数据！";
            callAlert(info);
            return;
        }
        info = "确定要删除" + selectedRowData.length + "条数据吗?";
        callAlertModal(info,'FCLexport_BusinessDelete');

//先解除click捆绑事件否则每次都会造成连续捆绑。
        $('.FCLexport_BusinessDelete').unbind('click').click(function () {
            var ids=[];
            var selectedRowData = FCLexport_table.rows('.selected').data();
            for(var i =0;i<selectedRowData.length;i++){
                ids.push(selectedRowData[i].billId);
            }
         $.ajax({
                url: getShipContextPath() + '/shippingBill/delete.do',
                data: {
                    billIds: ids.join(',')
                },
                dataType: 'json',
                beforeSend: function () {
                    showMask();//显示遮罩层
                },
                success: function (rsp) {
                    hideMask();

                    if (rsp.code == 0) {
                        callSuccess(rsp.message);
                        FCLexport_table.ajax.reload();
                    } else
                        callAlert(rsp.message);
                },
                error: function () {
                    hideMask();
                    callAlert("删除失败！")
                }
            });
        })

    }

//显示查询结果的表格
    var FCLexport_table;
    var paral = {
        "entrServiceCode":"业务编号",
        "billLadingNo":"提单号",
        "bookShipCompanyCode":"航空公司",
        "serviceLineId":"航班号",
        "actualDeparturedate": "实际离港日期",
        "bookingRoom": "订舱方",
        "bookingNumber":"订舱号",
        "goodsname":"品名",
		"customsdeclarationnumber":"报关单号",
		"operator":"操作员",
		"entryTime":"录入时间",
		"newestStatus":"最新状态"
    };
    InitShippingSurcharge();
    function InitShippingSurcharge() {
    	FCLexport_table = $("#FCLexportTable").DataTable({
            fnRowCallback:rightClick,   //利用行回调函数来实现右键事件
            fnDrawCallback:changePage,  //重绘的回调函数，调用changePage方法用来初始化跳转到指定页面
            //动态分页加载数据方式
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
                "type": "POST",
                // url: '../mock_data/ShippingSurcharge.json',

                "url": getShipContextPath() + 'shippingBill/listByPage.do',
                "data": function (d) {
                    search_data = $('#shippingSurchargeSearchForm').serializeObject();
                    var k={};
                    var i=0;
                    for(var key in search_data){
                    	//console.log(key);
						if(i==6){
                            if(search_data[key]==""||search_data[key]==null){
                            }else if(keysOption[key]){

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
                  //console.log(k);
                    if(k.entrEntrustTimeEnd){
                        k.entrEntrustTimeEnd=k.entrEntrustTimeEnd+' 00:00';
                    }
                    if(k.entrEntrustTimeStart){
                        k.entrEntrustTimeStart=k.entrEntrustTimeStart+' 00:00';
                    }

                    k=JSON.stringify(k);
                    kO=JSON.stringify(keysOption);

                    d.keys=k;
                    d.keysOperator=kO;

                }
            },
            language: {
                "url": "js/Chinese.json"
            },
            columns: [
                {
                    "sClass": "text-center",
                    "data": "WorkId",
                    "title": "<input type='checkbox' class='checkall' />全选",
                    "render": function (data, type,row, meta) {
                    //	console.log(row)
                        return '<input type="checkbox"  class="checkchild" id="'+row.billId+'"  value="' +row.billId+ '" />';
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
                {title: "业务编号", data: "entrServiceCode"},
                {title: "提单号", data: "mbLNo"},
                {title: "航空公司", data: "airlineCompany"},
                {title: "航班号", data: "flyNumber"},
                {title: "实际离港日期", data: "actualDeparturedate"},
                {title: "订舱方", data: "bookingRoom"},
                {title:'订舱号',data:"bookingNuber"},
                {title:'品名',data:"goodsname"},
                {title:'报关单号',data:"customsdeclarationnumber"},
                {title:'操作员',data:"operator"},
                {title:'录入时间',data:"entryTime"},
                {title:'最新状态',data:"newestStatus"}
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
                    targets: [1, 2, 3, 4, 5, 6, 7,8,9,10,11,12]
                }
            ],
            select: {
                // blurable: true,
                style: 'multi',//选中多行
                selector: 'td:first-child'//选中效果仅对第一列有效
                // info: false
            }

        });
    }
    // 点击第一格才能选中
    $('#FCLexportTable tbody').on('click', 'tr td:first-child', function () {
        // $(".selected").not(this).removeClass("selected");
        $(this).toggleClass("selected");
        var check = $(this).hasClass("selected");
        $(this).children("input[class=checkchild]").prop("checked", check);//把查找到checkbox并且勾选
        // console.log(table.rows('.selected').data().length);

    });

//作为fnRowCallback的回调函数增加右键菜单功能
//作为checkbox值初始化
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
 // select/not select all
     $('body').on('click', '.FCLexport .checkall', function () {
         var check = $(this).prop("checked");
         $(".FCLexport .checkchild").prop("checked", check);
         //通过调用datatables的select事件来触发选中
         $("#FCLexportTable tbody tr").each(function () {

             if ( FCLexport_table.row( this, { selected: true } ).any() ) {//FCLexport.js:339 Uncaught TypeError: Cannot read property 'row' of undefined
                 FCLexport_table.row( this ).deselect();
             }
             else {
                 FCLexport_table.row( this ).select();
             }
         });
     });

 //表单重置
    $('button.search_reset').on('click',function () {
        $('#shippingSurchargeSearchForm')[0].reset();
        //初始化时间输入框
        setTimeInput();
        $('#shippingSurchargeSearchForm').find('.select2-selection__rendered').attr('title','其他条件').text('其他条件');
        $('.FCLexport #moreCriteriaModal').find('input').attr('checked',false);
        keysOption={};
    })

 //监听其他条件变化
    $('select.otherConditions').on('change',function (e) {
       $(this).parent().find('input').attr('name',$(this).val());
    })
     return {
    	 doSearch:doSearch,
         otherSearch:otherSearch,
        /* entrustSave:entrustSave,*/
         newBusiness:newBusiness,
         newDetail:newDetail,
         addContainer:addContainer,
         ContainerDetail:ContainerDetail,
         choseConsignor:choseConsignor,
         delContainer:delContainer,
         copyContainer:copyContainer,
         chooseContainer:chooseContainer,
         ContainerDetailSubmit:ContainerDetailSubmit,
         deleteBusiness:deleteBusiness,
         deleteBusinessAll:deleteBusinessAll,
         closeDetail:closeDetail,
         FCLexportSave:FCLexportSave,
         checkEnter:checkEnter,   //禁止text area换行
         FCLexportDetail:FCLexportDetail
     };
})();

// 开始时间
$('#qBeginTime').datepicker({
    todayBtn : "linked",
    autoclose : true,
    language:"zh-CN",//语言设置
    todayHighlight : true,
    // endDate : new Date(),
    format: "yyyy-mm-dd"
}).on('changeDate',function(e){
    var startTime = e.date;

    $('#qEndTime').datepicker('setStartDate',startTime);
});
//结束时间：
$('#qEndTime').datepicker({
    todayBtn : "linked",
    autoclose : true,
    language:"zh-CN",//语言设置
    todayHighlight : true,
    // endDate : new Date(),
    format: "yyyy-mm-dd"
}).on('changeDate',function(e){
    var endTime = e.date;

    $('#qBeginTime').datepicker('setEndDate',endTime);
});