// pages/myInfo/myInfo.js
const API = require("../../utils/api.js")
const REST = require("../../utils/restful.js")
const util = require("../../utils/util.js")
const area = require("../../utils/area");

const app = getApp()
const uploadFile = require("./../../utils/upload.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        headImgs:{},//头像
        safeBottom: app.safeBottom,
        shadeShowing: false,
        currrArea: [], //省市区
        currrAreaCode: '',

        columnsLanguage :['中文', '英语'],

        hasPhoneDialog:true,
        hasWechatDialog:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            areaList: area.default,
            [`headImgs.fullPath`]:options.headImg,
            name:options.name
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
    //上传头像
    uploadHead(){
        //参数详见 :utils/upload.js 
        uploadFile('user',(filePath)=>{
            let headImgs = {
                    path: filePath.filePath, //相对路径
                    otherPath:filePath.filePath, //相对路径
                    fullPath:filePath.fullPath, //全路径
            }
            this.setData({
                headImgs:headImgs
            })
        })
    },
    //名字
    bindNameInput(e){
        let name = e.detail.value
        this.setData({
            name,
        });
    },
    //手机号码
    bindPhoneInput(e){
        let phone = e.detail.value
        this.setData({
            phone,
        });
    },
    //微信号码
    bindWeChatInput(e){
        let wechat = e.detail.value
        this.setData({
            wechat,
        });
    },
     //显示隐藏
    shadeShowing(e) {
        if (e.currentTarget.dataset.id != "shadeMain") {
            this.setData({
                shadeShowing: !this.data.shadeShowing,
                currPicker: e.currentTarget.dataset.type
            });
        }
    },
    //省份下拉确认按钮事件
    areaTapDone(e) {
        console.log(e);
        let currrArea = e.detail.values;
        if (currrArea[0].name == "" || currrArea[0].name == "请选择") {
            wx.showToast({
                title: '请选择所在省份',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (currrArea[1].name == "" || currrArea[1].name == "请选择") {
            wx.showToast({
                title: '请选择所在城市',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (currrArea[2].name == "" || currrArea[2].name == "请选择") {
            wx.showToast({
                title: '请选择所在区域',
                icon: 'none',
                duration: 2000
            });
            return
        }


        this.setData({
            shadeShowing: false,
            currrArea: [currrArea[0].name, currrArea[1].name, currrArea[2].name],
            currrAreaCode: [currrArea[0].code, currrArea[1].code, currrArea[2].code]
        });
    },
    //语言
    onLanguageConfirm(e){
        let currrLanguage = e.detail.value;
        this.setData({
            shadeShowing: false,
            currrLanguage
        });
    },
    //个人介绍
    bindDescInput(e){
        let desc = e.detail.value
        this.setData({
            desc,
        });
    },
    // 点击遮罩层
    tapCancel(e) {
        this.setData({
            shadeShowing: false
        });
    },
    //隐藏覆盖在电话输入框的遮罩
    hasPhoneDialog(){
        this.setData({
            shadeShowing: false,
            hasPhoneDialog:false
        });
    },
    //隐藏覆盖在微信输入框的遮罩
    hasWechatDialog(){
        this.setData({
            shadeShowing: false,
            hasWechatDialog:false
        });
    },
    //保存
    tapSaveInfo(){
        if (this.data.name == "" ) {
            wx.showToast({
                title: '请填写用户名',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (!this.data.currrAreaCode) {
            wx.showToast({
                title: '请添加区域',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (!this.data.currrLanguage) {
            wx.showToast({
                title: '请添加语言',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (!this.data.desc) {
            wx.showToast({
                title: '简单介绍一下自己呗',
                icon: 'none',
                duration: 2000
            });
            return
        }

        let data={
            provinceCode: this.data.currrAreaCode[0],
            cityCode: this.data.currrAreaCode[1],
            districtCode:this.data.currrAreaCode[2],
            name:this.data.name,
            headImg:this.data.headImgs.path,
            freelancerInfo:{
                language:this.data.currrLanguage == '中文' ? 10 :20,
                skillSummarize:this.data.desc
            },

        }
        REST.post({
            url:API.updateAll ,
            data: data,
            success: res => {
                wx.showToast({
                    title: '保存成功',
                    duration: 2000
                })
                setTimeout(()=>{
                    wx.switchTab({
                        url: '/pages/mine/mine',
                        success: function (e) {
                            let page = getCurrentPages().pop();
                            if (page == undefined || page == null) {
                                return
                            };
                            page.onLoad();
                        }
                    })
                },2000)
            },
            failed: res => {
                wx.showToast({
                    title: '保存失败',
                    icon: 'none',
                    duration: 2000
                });
            },
        })

    }
})