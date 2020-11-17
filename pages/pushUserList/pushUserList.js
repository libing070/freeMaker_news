// pages/pushUserList/pushUserList.js
const app = getApp()
const API = require("../../utils/api.js")
const REST = require("../../utils/restful.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        safeBottom:app.safeBottom,
        currentDemandId:'',
        pushUserList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options && options.id){
            this.setData({
                currentDemandId: options.id //需求详情页面传入的ID
            });
            this.getPushUserList();
        }

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    //跳转到作品详情
    tapToProductDetails(e){
        wx.navigateTo({
            url: '/pages/productDetails/productDetails?productionId='+e.currentTarget.dataset.prodId,
        })
    },
    getPushUserList(){
        let that = this
        REST.get({
            url: API.getRecommendProductionInfoByDemandId,
            data: {
                demandId: this.data.currentDemandId
            },
            success(res) {
                that.setData({
                    pushUserList: res
                });
            },
            failed(res) {
                console.error(res)
            },
            complete(res) {}
        })
    }
})