// pages/homeList/homeList.js
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

            cateName:options.cateName,
            domaintype:options.domaintype
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
                console.log(res);
                if(this.data.domaintype == 'allchilds'){//为你推荐 所有岗位

                    let childs=[]
                    for( var i = 0; i<res.length; i++){
                        childs = childs.concat(res[i].childs)
                    }
                    this.setData({
                        types:childs
                    })

                }else if(this.data.domaintype == 'currchilds'){//专辑推荐 当前岗位下所有同级岗位
                    let cateName=this.data.cateName
                    if(cateName){
                        this.filterSiblings(res,cateName)
                    }
                }else{//当前领域下岗位
                    for(let i=0 ;i<res.length; i++){
                        if(res[i].value.cateName == this.data.cateName){

                             this.setData({
                                selectedType:'全部',
                                catePost:'',
                                types:allTag.concat(res[i].childs),
                                parentCateName:res[i].value.cateName,
                                cateDomain:res[i].value.id 
                             })
                             this.loadProducts()
                             console.log(this.data.types);
                        }
                    }
                }
                this.setData({
                    treeData:res
                })
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
    //根据cateName 查找同类
    filterSiblings(treeData,cateName){
        let filterCateCode=(treeData,cateName)=>{
            for (var i=0; i < treeData.length; i++){
                let childs=treeData[i].childs
                if(childs.length > 0){
                    for(var n=0; n < childs.length;n++){
                        if(childs[n].value.cateName == cateName){
                            console.log(childs);
                            this.setData({
                                selectedType:cateName || '全部',
                                catePost:cateName?childs[n].value.id : '' ,
                                types:allTag.concat(childs),
                                parentCateName:treeData[i].value.cateName,
                                cateDomain:treeData[i].value.id 
                            })
                            console.log(this.data.types);

                            this.loadProducts()

                            break
                        }
                    }
                    filterCateCode(treeData[i],cateName)
                }
            }

        }
        if(cateName){
            filterCateCode(treeData,cateName)
        }
    },
    // 切换tab
    tapTypeTab(e) {
        let i = e.currentTarget.dataset.i
        let catePost = e.currentTarget.dataset.catepost
        
        this.setData({
            selectedType: i,
            catePost: catePost || '',
            currentPage: 1,
            pageSize:10
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
    //查找当前领域下的岗位
    tapFindChilds(e){
        let cateName = e.currentTarget.dataset.catename
        for (var i=0; i < this.data.treeData.length; i++){
            if(cateName == this.data.treeData[i].value.cateName){
                let childs= this.data.treeData[i].childs
                this.setData({
                    selectedType: '全部',
                    types:allTag.concat(childs),
                    menuShowing:false,
                    parentCateName:cateName,
                    products:[],
                    cateDomain:this.data.treeData[i].value.id
                })
                this.loadProducts()
            }
        }
    },
    //根据岗位获取作品
    loadProducts(){
        let url='',data={}
        if(this.data.selectedType == '全部'){
            url=API.getByCateDomain //领域下数据
            data={
                cateDomain: this.data.cateDomain || '',
                currentPage: this.data.currentPage,
                pageSize:10
            }
        }else{
            url=API.getByCatePost //岗位下数据
            data={
                catePost: this.data.catePost || '',
                currentPage: this.data.currentPage,
                pageSize:10
            }
        }
        REST.noVerfiyget({
            url: url,
            data:data,
            success: res => {
                console.log(res);

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
                console.log(this.data.products);

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
        })  
    }
})