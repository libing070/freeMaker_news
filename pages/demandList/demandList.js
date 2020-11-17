const app = getApp()
const REST = require("../../utils/restful.js")
const API = require("../../utils/api.js")
const allTag=[{
    parentNode:'',
    value:{
        id:'',
        ts:'',
        cateName:'全部',
        cateCode:'',
        cateType:''
    },
    childs:[],
    leaf:true,
}]
Page({

    /**
     * 页面的初始数据
     */
    data: {
        safeBottom: app.safeBottom,
        parentCateName:"",
        menuShowing:false,
        selectedType:  '全部',
        types: [],
        cateName:'',
        currentPage:1,
        scrollLeft:0,
        loadmoreShowing:false
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
        })
        this.loadjobTree()
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
        this.loadProducts()

        wx.stopPullDownRefresh({
            success:(e)=>{
            },
            fail:(e)=>{
            },
            complete:(e)=>{
            },
        }) 
        
    },
    onPageScroll(e) {

    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.noMoreProduct) {
            return
        }

        this.data.currentPage += 1

        this.loadProducts()

        
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    loadjobTree(){
        REST.noVerfiyget({
            url: '/v1/jobTree/treeData',
            success: res => {
                this.setData({
                    types:allTag.concat(res),
                   // scrollLeft:200
                })
                this.loadProducts()

            },
            failed: res => {
                wx.showToast({
                    title: '获取失败',
                    icon: 'none',
                    duration: 2000
                });
            },
        })
    },
   
    // 切换tab
    tapTypeTab(e) {
        let i = e.currentTarget.dataset.i
        let jobCateId = e.currentTarget.dataset.jobcateid
        
        this.setData({
            selectedType: i,
            jobCateId: jobCateId || '',
            currentPage: 1,
            pageSize:10,
            products:[]
        })
        wx.pageScrollTo({
            scrollTop: 0,
            duration:100
        })
        this.loadProducts()
        

    },

    
    //菜单显示隐藏
    menuShowing(e) {
        if (e.currentTarget.dataset.id != "shadeMain") {
            this.setData({
                menuShowing: !this.data.menuShowing
            });
        }

    },

    //根据岗位获取作品
    loadProducts(){
        this.setData({
            loadmoreShowing: true
        })
        let  data={
            attestation:1,//已发布
            jobCateId: this.data.jobCateId || '',
            currentPage: this.data.currentPage,
            pageSize:10
        }
        
        REST.noVerfiyget({
            url: API.getDemandCenterPage,
            data:data,
            success: res => {

                if(!res.data) return
                if(res.totalPages >= this.data.currentPage){ //有数据了
                    this.noMoreProduct = false
                }else{
                    this.noMoreProduct = true
                }
                if (this.data.currentPage == 1) {
                    this.setData({
                        products:res.data
                    })

                } else {
                    this.setData({
                        products: this.data.products.concat(res.data)
                    })
                }

                this.setData({
                    selectedType:this.data.selectedType
                })
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
    //跳转到需求详情
    tapToExtDemandDetails(e){
        let code = e.currentTarget.dataset.code
        wx.navigateTo({
            url: '/pages/extDemandDetails/extDemandDetails?code='+code,
        }) 
    }
})