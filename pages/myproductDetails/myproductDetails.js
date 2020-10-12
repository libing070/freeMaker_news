// pages/myproductDetails/myproductDetails.js
const app = getApp()
const API = require("../../utils/api.js")
const REST = require("../../utils/restful.js")
const util = require("../../utils/util.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        safeBottom: app.safeBottom,
        collect:false,
        currentPhotoIndex:1,
        obj:{
            imgList:["//img14.360buyimg.com/pop/jfs/t1/114735/33/2427/35818/5ea17d3aE7018d774/acf7950db4ef2c51.jpg",
            "//img14.360buyimg.com/pop/jfs/t1/88961/36/19902/34141/5ea17d3aEf82710e9/6465b378faf4ea0b.jpg",
            "//img14.360buyimg.com/pop/jfs/t1/111272/19/2307/93015/5ea17d3aEb521c837/7b9ac8fb948993f0.jpg",
            "//img14.360buyimg.com/pop/jfs/t1/110316/1/13554/178993/5ea17d3aE88af5e39/1e6dfb8dfb8259f6.jpg",
            "//img14.360buyimg.com/pop/jfs/t1/119502/34/1004/98273/5ea17d49Ed74b4fa5/49e7bdfc7ab97813.png"]
        },
        prodId:'', //作品编码
        prodDetail:{},
        publishDate:'' //作品发布日期（创建时间）
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            prodId:options.prodId
        })
        this.getProdDetail()
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
        this.loginSuccess()
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
        // mark: 登录成功
    loginSuccess(login) {
        this.setData({
            user: app.user,  
        })
        if(login){
               //do something.....
        }
    },

    //切换图片
    changeSwiper(e) {
        let currentPhotoIndex = e.detail.current + 1
        this.setData({
            currentPhotoIndex
        })

    },
    // 点击图片
    tapBanner(e) {
       let current = e.currentTarget.dataset.item

       let urls = []
       for (let item of this.data.prodDetail.images) {
           urls.push(item.fullPath)
       }

       wx.previewImage({
           current,
           urls,
       })
    },
    //关闭需求
    tapDeleteProduct(){
        let that = this
        wx.showModal({
            title: '提示信息',
            content: '确认删除当前作品吗？',
            showCancel: true,
            confirmColor: '#FFBA20',
            confirmText: '确定',
            success: res => {
                if (res.confirm) {
                    that.delProdByCode(this.data.prodId)
                    wx.showToast({
                        title: '作品已关闭',
                        icon: 'none',
                        duration: 1000,
                        success: ()=> {
                            wx.navigateBack({
                                delta: 1,
                                success: function (e) {
                                    let page = getCurrentPages().pop();
                                    if (page == undefined || page == null) {
                                        return
                                    };
                                    page.getProductionListByFreelancerId();
                                }
                            })
                        }
                    }); 
                }
            },
        })
    },
      //跳转到作品编辑页面（发布作品页面）
    tapEditProduct(){
        wx.navigateTo({
            url: '/pages/publishProduct/publishProduct?prodId='+this.data.prodId,
        })
    },
    getProdDetail(){
        let that = this
        REST.get({
            url: API.getProdDetail,
            data:{
                id:this.data.prodId
            },
            success(res) {
                that.setData({
                    prodDetail: res,
                    publishDate:util.formatDate(res.createTime,'年月日'),
                    shadeShowing:res.status == 30 ? true:false
                })
                if(that.data.prodDetail.status == 30 && that.data.shadeShowing){
                    that.getReviewNotPassInfo(that.data.prodDetail.id)
                }
            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
                console.log("初始化作品详情:", that.data.prodDetail)
            }
        })
    },
    //审核未通过原因
    getReviewNotPassInfo(id){
        let that = this
        REST.get({
            url: API.getReviewNotPassInfo,
            data:{
                id:id
            },
            success(res) {
                that.setData({
                    reviewerOpinion:res[0].reviewerOpinion
                })
            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
            }
        })
    },
    delProdByCode(){
        let that = this
        REST.post({
            url: API.delStatusById,
            data:{
                id:this.data.prodId
            },
            success(res) {
                that.setData({
                    prodDetail: res,
                    publishDate:util.formatDate(res.createTime,'年月日')
                })
            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
                console.log("初始化作品详情:", that.data.prodDetail)
            }
        })
    },
    //显示隐藏
    shadeShowing(e) {
        if (e.currentTarget.dataset.id != "shadeMain") {
            this.setData({
                shadeShowing: !this.data.shadeShowing,
                currPicker: e.currentTarget.dataset.type
            });
        }
        if(this.data.prodDetail.status == 30 && this.data.shadeShowing){
            this.getReviewNotPassInfo(this.data.prodDetail.id)
        }
    },
})