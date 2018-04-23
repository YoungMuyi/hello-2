//@ sourceURL=AirImportStatusTrack.js
//状态跟踪
var AirImportStatusTrack = (function(){
	//点击航班信息，根据当前业务获取运单号（业务编号）
	function getNumInfo(billExportId,html){
	/*	if(html=="AIRexport"){
			$.ajax({
			type:'post',
            url:getShipContextPath()+'airBillExportController/searchById.do',
            data:{"id":billExportId},
            success : function(data) {
				var data = JSON.parse(data);
				if($("."+html+" #tracing div#jzx div.transportOrder a").length <= 0){
				$("."+html+" #tracing div#jzx div.transportOrder").append('<a>'+data.billLadingNo+'</a>');
				}
            }
		})
		}else{*/
			$.ajax({
			type:'post',
            url:'/SeawinWebappBase/airBillImportController/searchTotalInfoById.do',
            data:{"id":billExportId},
            success : function(data) {
				var data = JSON.parse(data);
                $("."+html+" #tracing div#imjzx div.transportOrder a").remove();
				$("."+html+" #tracing div#imjzx div.transportOrder").append('<a>'+data.billLadingNo+'</a>');
			            }
		    })
	//	}
		
	}
	//点击运单号，根据运单号获取航班信息
	function askDetail(conNum,html){
		$.ajax({
            url:'http://test.logink.org:86/OceanTracking/AirService?',
            type:'POST',
            data:{
                method:'logink.track.air',
                result_format:1,
                sec:JSON.stringify({"userID":"901001","token":"NzY1MjBkNTgtZGNmOS00YjMxLTlmNGYtZmZmNjcyNzBjMmI5VF9UXzBBU19JRF9sb2dpbmtfMA"}),
                charset:'utf-8',
                biz_version:'',
                biz_content:JSON.stringify({"waybillNo":"784-73541090"}),//JSON.stringify({"waybillNo":conNum}),//用作接口测试 JSON.stringify({"waybillNo":"784-73541090"}),
            },
            success:function (data) {
            	//alert('success');
                //console.log(typeof data);
                //console.log(data);
                if(data.biz_result.trackList instanceof Array){
                    if(data.biz_result.trackList[0]){
                        $("."+html+" div#tracing div#imjzx table.table_air_status tbody>tr").remove();
                        //var newStatusNum = data.biz_result[0].ContainerInfo[0].ContainerStatusInformation.length - 1;
                        var $TR1='<tr class="appendNew" >'+
                            '<td style="text-align:center;">'+
                            '<span>'+data.biz_result.waybillNo+'</span>'+
                            '</td>'+
                            '<td style="text-align:center;">'+
                            '<span>'+data.biz_result.trackList[0].dateTime+'</span>'+
                            '</td>'+
                            '<td style="text-align:center;">'+
                            '<span>'+data.biz_result.trackList[0].airPortName+'</span>'+
                            '</td>'+
                            '<td style="text-align:center;">'+
                            '<span>'+data.biz_result.trackList[0].statusName+'</span>'+
                            '</td>'+
                            '</tr>';
                        $("."+html+" div#tracing div#imjzx table.table_air_status tbody").append($TR1);
                    }else{
                        //console.log(data.biz_result[0].trackList[0].statusCode);
                        //console.log(data.biz_result.waybillNo);
                        //console.log(data.biz_result.trackList[0].statusName);
                        //为下面的箱子赋值
                        //callAlert("查询不到航班信息");
                        callAlert("查询不到航班信息");
                    }
                }else{
                    callAlert(data['error']);
                }

            },
            error:function (data) {
                console.log(data);
            }
        })
	}
	//点击通关，根据当前业务获取报关单号和提单号(出口)
	function getNumInfosByBusinessId(billExportId,html,childUrl){
		$.ajax({
			type:'post',
			url:getShipContextPath()+childUrl,
			data:{"id":billExportId},
			success : function(data) {
				var data = JSON.parse(data);
				//console.log(data);
				if(typeof(data.billLandingNo) == "undefined"){
					data.billLandingNo = data.billLadingNo;
				}
				/*if($("."+html+" #tracing divim#tg div.customId a").length <= 0){
				    $("."+html+" #tracing div#imtg div.customId").append('<a name=customId>'+data.billLandingNo+'</a>');
				} 报关单号*/
                $("."+html+" #tracing div#imtg div.billLandingId a").remove();
				//if($("."+html+" #tracing div#imtg div.billLandingId a").length <= 0){
					$("."+html+" #tracing div#imtg div.billLandingId").append('<a name=billLandingId>'+data.billLandingNo+'</a>');
				//}
            }
		})	
	}
	//根据报关单号或提单号获取通关信息
	function getClearanceInfo(conNum,labNum,html){
		$.ajax({
			type:'post',
			url:'http://test.logink.org:86/OceanTracking/ClearanceStatus',
			data:{
                method:'logink.track.customs',
                result_format:1,
                sec:JSON.stringify({"userid":"901001","token":"NzY1MjBkNTgtZGNmOS00YjMxLTlmNGYtZmZmNjcyNzBjMmI5VF9UXzBBU19JRF9sb2dpbmtfMA"}),
                charset:'utf-8',
                biz_version:'',
                biz_content:JSON.stringify({"GoodsDeclarationNumber":"","LadingBillNumber":"93307780732_105","PartyFunctionCode":"ZJEPORT"}),//JSON.stringify({"GoodsDeclarationNumber":conNum,"LadingBillNumber":labNum,"PortCodeList":"CNNGB,JPOSA","PartyFunctionCode":"ZJEPORT"})
            },
            success:function (data) {
                if(data.error){
                    callAlert(data.error);
                }else{
                	//为下面的箱子赋值
                    $('.'+html+' div#tracing div#imtg table.table_1 tbody>tr').remove();
                    $('.'+html+' div#tracing div#imtg table.table_2 tbody>tr').remove();
                    var $strTR;
                    for(var i = 0; i < data.biz_result[0].clearingStatusInformation.length; i++) {
                        $strTR= $strTR+'<tr class="appendNew" style="height: 30px;" >' +
                            '<td>' +
                            '<span>' + data.biz_result[0].clearingStatusInformation[i].customsClearingStatus + '</span>' +
                            '</td>' +
                            '<td>' +
                            '<span>' + data.biz_result[0].clearingStatusInformation[i].statusChangeDateTime + '</span>' +
                            '</td>' +
                            '<td>' +
                            '<span>' + data.biz_result[0].goodsDeclarationNumber + '</span>' +
                            '</td>' +
                            '<td>' +
                            '<span>' + data.biz_result[0].ladingBillNumber + '</span>' +
                            '</td>' +
                            '<td>' +
                            '<span>' + data.biz_result[0].containerNumber + '</span>' +
                            '</td>'
                        '</tr>';
                    }
                    $('.'+html+' div#tracing div#imtg table.table_1 tbody').append($strTR);
                    var $TR='';
                    for(var i = 0; i < data.biz_result[0].clearingStatusInformation.length; i++) {
                        $TR=$TR+'<tr class="appendNew" style="height: 30px;" >'+
                            '<td>'+
                            '<span>'+data.biz_result[0].clearingStatusInformation[i].customsClearingStatus+'</span>'+
                            '</td>'+
                            '<td>'+
                            '<span>'+data.biz_result[0].clearingStatusInformation[i].statusChangeDateTime+'</span>'+
                            '</td>'
                            '</tr>';
                    }
                    $('.'+html+' div#tracing div#imtg table.table_2 tbody').append($TR);
                }
            }
		})
		
	}
	
	return {
		getNumInfo:getNumInfo,
		getNumInfosByBusinessId:getNumInfosByBusinessId,
		askDetail:askDetail,
		getClearanceInfo:getClearanceInfo
	}
})();
//初始化加载
$(function(){
    //空运进口航班信息
    $('.AIRimport div.trace').on('click','>ul>li',function(){
        var id = $(".AIRimport ul.Big").find('li.active').attr('billId');
        AirImportStatusTrack.getNumInfo(id,"AIRimport");
    })
    $('.AIRimport #tracing div#imjzx div.transportOrder').on('click','a',function(){
        var conNum=$(this).text();
        AirImportStatusTrack.askDetail(conNum,"AIRimport");
    })
	//进口
	$('.AIRimport div#myTabContent div#imexportStatusTrack').on('click','li.imtg',function(){
		var id = $(".AIRimport ul.Big").find('li.active').attr('billId');
		AirImportStatusTrack.getNumInfosByBusinessId(id,"AIRimport","airBillImportController/searchTotalInfoById.do");
	})
	$('.AIRimport #tracing div#imtg div.billLandingId').on('click','a',function(){
		var labNum=$(this).text();
        AirImportStatusTrack.getClearanceInfo("",labNum,"AIRimport");
	})
    /*
    报关单号
	$('.AIRimport #tracing div#imtg div.customId').on('click','a',function(){
		var conNum=$(this).text();
        AirImportStatusTrack.getClearanceInfo(conNum,"","AIRimport");
	})*/
})