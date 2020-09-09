// pages/demand/demand.js
const util = require("../../utils/util");
const area = require("../../utils/area");
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        safeBottom:app.safeBottom,
        title:'',
        summarize:'',
        total: 0,
        shadeShowing:false,
        currTreeSelectNavIndex:0,
        currPicker:'',
        minDate: new Date().getTime(),
        maxDate: new Date().getTime() +(86400000 * 365 * 10),
        currentDate: new Date().getTime(),
        currentDateStr:'请选择>',//交付时间
        formatter(type, value) {
            if (type === 'year') {
              return `${value}年`;
            } else if (type === 'month') {
              return `${value}月`;
            } else if (type === 'day') {
                return `${value}日`;
            }
            return value;
        },

        currrArea:[],//省市区
        currrAreaCode:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            areaList:area.default
        });
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
    bindTitleInput(e) {
        let title=e.detail.value;
        this.setData({
            title
        });
    },
    //初始化富文本编辑器
    onEditorReady() {
        const that = this
        wx.createSelectorQuery().select('#editor').context(function (res) {
            that.editorCtx = res.context
        }).exec()
    },
    //编辑器内容改变时触发
    bindEditorInput(e) {
        let summarize=this.deleteHtmlTag(e.detail.html);
        if(summarize.length > 300){
            wx.showToast({
                title: '请输入300字以内',
                icon: 'none',
                duration: 2000
            });
            return
        }
        this.setData({
            total: summarize.length,
            summarize: e.detail.html
        });
    },
    //删除html标签
    deleteHtmlTag(html) {
        var dd=html.replace(/<[^>]+>/g,"");//截取html标签
        var dds=dd.replace(/&nbsp;/ig,"");//截取空格等特殊标签
        return dds
    },
    //显示隐藏
    shadeShowing(e) {
        console.log(111);
        if (e.currentTarget.dataset.id != "shadeMain") {
             this.setData({
                shadeShowing: !this.data.shadeShowing,
                currPicker: e.currentTarget.dataset.type
            });
        }
    },    
    //点击树形左侧菜单
    tapTreeSelectNav(e) {
        let currTreeSelectNavIndex=e.currentTarget.dataset.index
        this.setData({
            currTreeSelectNavIndex
        })
    },
    //时间下拉确定按钮事件
    dateTapDone(e) {
        let currentDate=e.detail;
        let currentDateStr=util.formatDate(currentDate)
        this.setData({
            shadeShowing: false,
            currentDate:currentDate,
            currentDateStr:currentDateStr
        });
    },
    //省份下拉确认按钮事件
    areaTapDone(e) {
        console.log(e);
        let currrArea=e.detail.values;
        if(currrArea[0].name == "" || currrArea[0].name == "请选择"){
            wx.showToast({
                title: '请选择所在省份',
                icon: 'none',
                duration: 2000
            });
            return 
        }
        if(currrArea[1].name == "" || currrArea[1].name == "请选择"){
            wx.showToast({
                title: '请选择所在城市',
                icon: 'none',
                duration: 2000
            });
            return 
        }
        if(currrArea[2].name == "" || currrArea[2].name == "请选择"){
            wx.showToast({
                title: '请选择所在区域',
                icon: 'none',
                duration: 2000
            });
            return 
        }


        this.setData({
            shadeShowing: false,
            currrArea: [currrArea[0].name,currrArea[1].name,currrArea[2].name],
            currrAreaCode: currrArea[2].code
        });
        
    },
    //取消按钮事件
    // 点击遮罩层
    tapCancel(e) {
        this.setData({
            shadeShowing: false
        });
    },
})