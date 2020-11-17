// pages/evaluateList/evaluateList.js
const app = getApp()
const REST = require("../../utils/restful.js")
const API = require("../../utils/api.js")
const area = require("../../utils/area");
const util = require("../../utils/util.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        safeBottom: app.safeBottom,
        currTap: '-1',
        currentPage:1,
        loadmoreShowing:false,
        stars: [0, 1, 2, 3, 4],
        normalSrc: '/images/common/star/icon-normal.png',   
        half_0_1_point5_src:"/images/common/star/icon-half-0.5-1.5.png",
        half_2_point5_src:"/images/common/star/icon-half-2.5.png",
        half_3_point5_src:"/images/common/star/icon-half-3.5.png",
        half_4_point5_src: '/images/common/star/icon-half-4.5.png',
        selected_1_2_src: '/images/common/star/icon-selected-1-2.png',
        selected_3_src: '/images/common/star/icon-selected-3.png',
        selected_4_src: '/images/common/star/icon-selected-4.png',
        selected_5_src: '/images/common/star/icon-selected-5.png',

        ellipsis:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //禁止转发 分享朋友圈
        wx.hideShareMenu({
            menus: ['shareAppMessage', 'shareTimeline']
        })
        this.setData({
            jobCateId:options.jobCateId,
            freelancerId:options.freelancerId
        })
        this.loadData()
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

        this.setData({
            currentPage:1
        })
        this.loadData()

        wx.stopPullDownRefresh({
            success:(e)=>{
            },
            fail:(e)=>{
            },
            complete:(e)=>{
            },
        }) 
        
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.noMoreProduct) {
            return
        }

        this.data.currentPage += 1

        this.loadData()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    tapSort(e){
        let index =  e.currentTarget.dataset.index
        this.setData({
            currTap:index,
            currentPage:1
        })
        if(index == 0){
            this.setData({
                storeSort:20,
                timeSort:0
            })
        }else if(index == 1){
            this.setData({
                storeSort:0,
                timeSort:20
            })
        }
        wx.pageScrollTo({
            scrollTop: 0,
            duration:100
        })
        this.loadData()

    },
    loadData(){
        this.setData({
            loadmoreShowing: true
        })
        REST.noVerfiyget({
            url: API.findByCateAndFreelancer,
            data:{ 
                jobCateId : this.data.jobCateId,
                freelancerId : this.data.freelancerId,
                currentPage:this.data.currentPage,
                pageSize:10,
                storeSort:this.data.storeSort || 0 ,//20降序 ，10 升序
                timeSort:this.data.timeSort || 0 ,//20降序 ，10 升序
            },
            success: res => {    
                if(!res.data) return
                if(res.totalPages >= this.data.currentPage){ //有数据了
                    this.noMoreProduct = false
                }else{
                    this.noMoreProduct = true
                }
                let keys = this.fromatData(res.data)

                if (this.data.currentPage == 1) {
                    this.setData({
                        evaluationDetailInfos:keys
                    })
                    
                } else {
                    this.setData({
                        evaluationDetailInfos: this.data.evaluationDetailInfos.concat(keys)
                    })
                }
                // for(let i = 0 ;i<keys.length;i++){
                //     this.updateExtendShow(i)
                // }
                console.log(keys)


            },
            fail: res => {
                wx.showToast({
                    title: '获取失败',
                    icon: 'none',
                    duration: 2000
                });
            },
            complete:res => {
                this.setData({
                    loadmoreShowing: false
                })
            }
        })
    },
    fromatData(keys){
    
        for(let i = 0;i < keys.length;i++){
            keys[i].i=i
            keys[i].description = util.deleteHtmlTag(keys[i].description)
            keys[i].autoHeight = true
            keys[i].ellipsis = false
           // keys[i].descriptionRows = keys[i].description.split("\n").length
            if(keys[i].totalScore <= 0.5){
                keys[i].half = this.data.half_0_1_point5_src
                keys[i].selected=this.data.selected_1_2_src
            }else if(keys[i].totalScore <=1){
                keys[i].half = this.data.half_0_1_point5_src
                keys[i].selected=this.data.selected_1_2_src
            }else if(keys[i].totalScore <= 1.5){
                keys[i].half = this.data.half_0_1_point5_src
                keys[i].selected=this.data.selected_1_2_src
            }else if(keys[i].totalScore <=2){
                keys[i].half = this.data.half_0_1_point5_src
                keys[i].selected=this.data.selected_1_2_src
            }else if(keys[i].totalScore <= 2.5){
                keys[i].half = this.data.half_2_point5_src
                keys[i].selected=this.data.selected_3_src
            }else if(keys[i].totalScore <= 3){
                keys[i].half = this.data.half_2_point5_src
                keys[i].selected=this.data.selected_3_src
            }else if(keys[i].totalScore <= 3.5){
                keys[i].half = this.data.half_3_point5_src
                keys[i].selected=this.data.selected_4_src
            }else if(keys[i].totalScore <= 4){
                keys[i].half = this.data.half_3_point5_src
                keys[i].selected=this.data.selected_4_src
            }else if(keys[i].totalScore <= 4.5){
                keys[i].half = this.data.half_4_point5_src
                keys[i].selected=this.data.selected_5_src
            }else if(keys[i].totalScore <= 5){
                keys[i].half = this.data.half_4_point5_src
                keys[i].selected=this.data.selected_5_src
            }
      }
        return keys
    },
    /**
    * 收起/展开按钮点击事件
    */
    ellipsis: function (e) {  
        const index = e.currentTarget.dataset.index

        this.setData({
            [`evaluationDetailInfos[${index}].ellipsis`]:!this.data.evaluationDetailInfos[index].ellipsis
        })
    },
     /**
     * 评论内容ID下标
     * @param {Number} index
     */
    updateExtendShow(index) {
        var query = wx.createSelectorQuery()
        query
          .select(`#evaluate-news-${index}`)
          .boundingClientRect((rect) => {
            
          })
          .exec(rect=>{
            if (rect != null) {
                const height = rect[0].height
                console.log(height)

                this.setData({
                    [`evaluationDetailInfos[${index}].realheight`]:height,
                })

                if (height > 88) { //line-height 22 * 1 行
                  this.setData({
                      [`evaluationDetailInfos[${index}].autoHeight`]:false,
                      [`evaluationDetailInfos[${index}].height`]:88,
                      [`evaluationDetailInfos[${index}].ellipsis`]:true
                  })
                }else{
                    
                }
              }
          })
    },
    // 点击图片
    tapBanner(e) {
        let current =  e.currentTarget.dataset.item
        let index =  e.currentTarget.dataset.index

        let urls = []
        for (let item of this.data.evaluationDetailInfos[index].images) {
            urls.push(item.fullPath)
        }

        wx.previewImage({
            current,
            urls,
        })
    },
    loadEndImage(e){
        let index =  e.currentTarget.dataset.index
        this.updateExtendShow(index)
    }
})