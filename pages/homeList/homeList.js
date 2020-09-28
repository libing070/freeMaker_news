// pages/homeList/homeList.js
const app = getApp()
const REST = require("../../utils/restful.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        safeBottom: app.safeBottom,

        menuShowing:false,

        types: [],
        cateName:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            selectedType:  0,
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
    loadjobTree(){
        REST.request({
            url: '/v1/jobTree/treeData',
            method: 'GET',
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
                                 types:res[i].childs
                             })
                        }
                    }
                }
                this.setData({
                    treeData:res
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
                                types:childs
                            })
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
        this.setData({
            selectedType: i,
        })
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
                    types:childs,
                    menuShowing:false
                })
            }
        }
    }
})