//@ sourceURL=AirBusinessTrack.js
//流程跟踪
var AirBusinessTrack=(
		function(){
			//根据进度修改背景颜色
			function autoChangeColor(trackSchedule){
				switch(trackSchedule){
				case "未做":
					return "red";
				case "完成":
					return "green";
					
				}
			}
			// $(".track_auto").
			//展示流程跟踪的信息
			function showBusinessTrack(htmlName,billId,businessType){
				$.ajax({
					type: "POST",
                    url: getContextPath() +'airTrackSecondController/listByPageAir.do', // 'logisticsTrack/listByPage.do',
					// 空运出口用第一个接口 空运进口用第二个接口
                    data: {
                        // "keys":'{"businessCode":"'+selectedRowData[0].businessCode+'"}'
                        "keys":'{"billId":'+billId+','+'"businessType":"'+businessType+'"}',
                        "start":0,
                        "length":20
                    },
				success:function(data){
                    $('.AIRexport div#tracing  ul#myTab li').removeClass('active');
                    $('.AIRexport div#tracing ul#myTab li:first').addClass('active');
                    $('.AIRexport div#tracing div#myTabContent>div').removeClass('active');
                    $('.AIRexport div#tracing div#myTabContent>div:first').addClass('active').removeClass('fade')
					$("."+htmlName+" #exportProTrack_tab").find("tr:gt(1)").remove();
					var resp = JSON.parse(data);
					console.log(resp);
					console.log(htmlName);
					for(var i=0;i<resp.aaData.length;i++){
						$("."+htmlName+" #exportProTrack_tab ").append("<tr class='tr_track' step='"+resp.aaData[i].step+"'   trackageId='"+ resp.aaData[i].trackageId +"'>"+
                            "<td>"+resp.aaData[i].stepName+"</td>"+
                            "<td>"+
                            "<input type='text'"+ "name='expectedTime' disabled='disabled' readonly='readonly' value='"+ resp.aaData[i].expectedTime+"'  class='form-control seconds' />"+
                            "</td>"+
                            "<td>"+
                            "<input type='text' name='trackExecutor' readonly='readonly' value='"+ resp.aaData[i].trackExecutor +"'"+" class='form-control'/>"+
                            "</td>"+
                            "<td>"+
                            "<select name='status' disabled>" +
                            "<option value='"+resp.aaData[i]['listStatus'][0]['sign']+"'>"+resp.aaData[i]['listStatus'][0]['name']+"</option>" +
                            "<option value='"+resp.aaData[i]['listStatus'][1]['sign']+"'>"+resp.aaData[i]['listStatus'][1]['name']+"</option>" +
                            "</select>"+
                            "</td>"+
                            "<td>" +
                            "<input type='text' name='actualTime' disabled='disabled' readonly='readonly' value='"+ resp.aaData[i].actualTime +"'"+" class='form-control seconds'/>"+
                            "</td>"+
                            "<td>"+
                            "<input type='text' name='trackOperator' readonly='readonly' value='"+ resp.aaData[i].trackOperator +"'"+" class='form-control'/>"+
                            "</td>"+
                            "<td>"+
                            "<input type='text' name='actualDescription' readonly='readonly' value='"+resp.aaData[i].actualDescription+"' class='form-control'/>"+
                            "</td>"+
                            "</tr>");
						$("."+htmlName+" #exportProTrack_tab tr:last").find('select[name="status"]').val(resp.aaData[i]['status']);
					}
                    $('.AIRexport div#tracing div#myTabContent .seconds').datetimepicker({
                        autoclose:true,
                        format:"yyyy-mm-dd hh:ii",
                        locale: moment.locale('zh-cn'),
                        minuteStep:1
                    })
					
				 }
				});
			}
			//保存流程跟踪的修改,param 数组
			function saveBusinessTrack(htmlName){
				//获取table中数据的条数
				var dataArray = [];
				$("."+htmlName+" #exportProTrack_tab .tr_track").each(function(){
					var detailDate=$(this).serializeObject();
                    detailDate['trackageId']=$(this).attr('trackageId');
                    detailDate['billId']=$('.AIRexport ul.Big>li.active').attr('billid');
                    detailDate['businessType']="空运出口";
                    detailDate['step']=$(this).attr('step');
                    detailDate['stepName']=$(this).find('td:first').text();
                    // if(detailDate.goodsType!=null&&detailDate.goodsType!="") {
		            dataArray.push(detailDate);
					
				})
				$.ajax({
					type:"POST",
					url:getContextPath() + 'logisticsTrack/updateList.do',
					contentType:"application/json",
					data: JSON.stringify(dataArray),
//					data: {logisticsTrackList:JSON.stringify(dataArray)},
					success:function(data){
						var data = JSON.parse(data);
						callAlert(data.message);
						var billId=$('.AIRexport ul.Big>li.active').attr('billid');
						AirBusinessTrack.showBusinessTrack('AIRexport',billId,'空运出口');
					}
				});
			}
			return{
				autoChangeColor:autoChangeColor,
				showBusinessTrack:showBusinessTrack,
				saveBusinessTrack:saveBusinessTrack
			};
		}
)();
//勾选自动输入框到只读模式
$(function(){
    //勾选自动输入框到只读模式
    $('.AIRexport table#exportProTrack_tab tbody').on('click',function(){
        $(this).find("tr").each(function(i,e){
            if($(e).find("input.track_auto").prop("checked")){
                $(e).find("input.second_track").css('display','none');
                $(e).find('input.firstValue').css('display','block');
            }else{
                $(e).find("input.second_track").css('display','block');
                $(e).find('input.firstValue').css('display','none');
            }
        })
    })
	$('table#exportProTrack_tab tbody').on('click',function(){
		$(this).find("tr").each(function(i,e){
			if($(e).find("input.track_auto").prop("checked")){
				$(e).find("input.second_track").attr("readonly","readonly");
			}else{
				$(e).find("input.second_track").attr("readonly",false);
			}
		})
	})
    //编辑事件
    $('.AIRexport div#tracing div#exportProTrack span.canEdit').on('click',function (data) {
        $('.AIRexport div#tracing div#exportProTrack').find('input').removeAttr('readonly').removeAttr('disabled');
        $('.AIRexport div#tracing div#exportProTrack').find('select').removeAttr('disabled');
    })
	
})
