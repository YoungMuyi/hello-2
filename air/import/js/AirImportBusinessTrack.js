//@ sourceURL=AirImportBusinessTrack.js
//流程跟踪
var AirImportBusinessTrack=(
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
						$("."+htmlName+" #exportProTrack_tab ").append("<tr class='tr_track' num='"+ i +"'>"+
                            "<td>"+(i+1)+
                            "<input style='display:none' type='text' name='trackageId' value='"+resp.aaData[i].trackageId+"'/>" +
                            "</td>"+
                            "<td>"+resp.aaData[i].stepName+"</td>"+
                            "<td>"+
                            "<input type='text' name='expectedTimeAuto' class='firstValue' style='border: none;' value='"+resp.aaData[i].expectedTimeAuto+"' readonly='readonly'>"+
                            "<input type='text'"+ "name='expectedTime'  value='"+ resp.aaData[i].expectedTime.split(" ")[0] +"' class='second_track' style='display: none;width: 100%;' />"+
                            "</td>"+
                            "<td>"+
                            "<input type ='checkbox' class='track_auto' value='1' checked='checked' />"+
                            "</td>"+
                            "<td>"+
                            "<input type='text' name='trackExecutorAuto' style='border: none;' value='"+resp.aaData[i].trackExecutorAuto+"' class='firstValue' readonly='readonly'>"+
                            "<input type='text' name='trackExecutor' value='"+ resp.aaData[i].trackExecutor +"'"+" class='second_track' style='display: none;width: 100%;'/>"+
                            "</td>"+
                            "<td>"+resp.aaData[i].trackOperator+"</td>"+
                            "<td bgcolor ='"+AirImportBusinessTrack.autoChangeColor(resp.aaData[i].trackSchedule)+"'>"+resp.aaData[i].trackSchedule+"</td>"+
                            "<td>"+resp.aaData[i].actualTime+"</td>"+
                            "<td>"+
                            "<input type='text' name='expectedDescription' style='border: none;' value='"+resp.aaData[i].expectedDescription+"' class='firstValue' readonly='readonly'>"+
                            "<input type='text' name='actualDescription' value='"+resp.aaData[i].actualDescription+"'class='second_track' style='display: none;width: 100%;'/>"+
                            "</td>"+
                            +
                                "</tr>")
							 
					}
					
				 }
				});
			}
			//保存流程跟踪的修改,param 数组
			function saveBusinessTrack(htmlName){
				//获取table中数据的条数
				var dataArray = [];
				$("."+htmlName+" #exportProTrack_tab .tr_track").each(function(){
					var detailDate=$(this).serializeObject();
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
	
})
