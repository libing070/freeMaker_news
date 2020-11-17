module.exports = {
    //系统数据
    getByCateDomain:"/v1/productionListApi/getByCateDomain"
    ,getByCatePost:"/v1/productionListApi/getByCatePost"
    ,configs:"/v1/display/configs"
    ,loadTreeData:"/v1/jobTree/treeData"
    ,getCateLevelIds:"/v1/jobTree/getCateLevelIds"
    ,getSkillList:"/v1/jobTree/getSkillList"
    //个人信息
    ,syncUserInfo: "/v1/miniApp/syncUserInfo"
    ,getTotalIncome: "/v1/freelancer/income"
    ,updatePhone:"/v1/miniApp/updatePhone"
    ,updateAll:'/v1/userApi/updateAll'
    ,getCurrentInfo:'/v1/userApi/getCurrentInfo'
    ,referralCode:"/v1/freelancer/referralCode"
    ,myRecord:"/v1/freelancer/myRecord"
    //订单
    ,getOrderDetail: "/v1/orderApi/getOrderInfoById"
    ,updateOrderStatus: "/v1/orderApi/updateOrderStatus"
    ,getOrderListByStakeholder: "/v1/orderApi/getOrderListByStakeholder"
    ,saveOrder: "/v1/orderApi/save"
    ,modifyOrderMny: "/v1/orderApi/modifyOrderMny"
    ,getOrderUnAcceptInfo: "/v1/orderApi/getOrderUnAcceptInfo"
    ,getPaymentVoucherInfo:"/v1/orderApi/getPaymentVoucherInfo"
    ,uploadPayAttachment:"/v1/orderApi/uploadPayAttachment"
    ,updateOrderMny:"/v1/orderApi/updateOrderMny"
    
    //作品
    ,getProductionListByFreelancerId: "/v1/productionListApi/getByFreelancer" 
    ,getProdDetail: "/v1/productionViewApi/getById"
    ,delStatusById: "/v1/productionApi/delStatusById"
    ,createProd:"/v1/productionApi/release"
    ,modifyProd:"/v1/productionApi/modify"
    ,getByCatePostOther: "/v1/productionListApi/getByCatePostOther"
    ,getByLoginUser:"/v1/productionViewApi/getByLoginUser"
    ,getReviewNotPassInfo:"/v1/productionViewApi/getReviewNotPassInfo"
    ,publishStatus:"/v1/productionApi/publishStatus"
    ,getDefaultImage:"/v1/JobDefaultImage/getDefaultImage"
    //需求
    ,getDemandListByEmployerId: "/v1/demandApi/getPageByEmployerId"
    ,updateDemandStatus: "/v1/demandApi/updateStatus"
    ,getDemandGroupCount: "/v1/demandApi/getDemandGroupCount"
    ,publishDemand: "/v1/demandApi/publish"
    ,getDemandDetail: "/v1/demandApi/getByCode"
    ,updateDemand: "/v1/demandApi/updateByCode"
    ,getByFreelancer: "/v1/productionListApi/getByFreelancer"
    ,getRecommendProductionInfoByDemandId:"/v1/demandApi/getRecommendProductionInfoByDemandId"
    ,getDemandCenterPage:"/v1/demandCenterApi/getDemandCenterPage"
    ,getDemandCenterDtlByCode:"/v1/demandCenterApi/getDemandCenterDtlByCode"
    ,recommend:"/v1/demandProductionRelationApi/recommend"
    ,findRecommend:"/v1/demandProductionRelationApi/findRecommend"
    // 评价信息
    ,findByCateAndFreelancer:"/v1/evaluation/findByCateAndFreelancer"
    ,findOverallEvaluationByCateAndFreelancer:"/v1/evaluation/findOverallEvaluationByCateAndFreelancer"
    ,publishEvaluation:"/v1/evaluation/publish"
    ,findByOrderId: "/v1/evaluation/findByOrderId"
    ,getTagByJobCateId: "/v1/jobTag/getTagByJobCateId"
}