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
        userInfo:{},
        columnsLanguage :[{id:10,text:'中文'},{id:20,text:'英文'}],
        columnsLanguageIndex:1,
        hasPhoneDialog:true,
        hasWechatDialog:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getCurrentInfo()

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
    //获取个人信息接口
    getCurrentInfo(){
        REST.get({
            url: API.getCurrentInfo,
            success:res => {
              
                let currrLanguage=''
                for(let i in this.data.columnsLanguage){
                    if(this.data.columnsLanguage[i].id == res.freelancerInfo.language){
                        currrLanguage = this.data.columnsLanguage[i].text
                        break
                    }
                }
                this.setData({
                    phone:res.freelancerInfo.phone,
                    desc:res.freelancerInfo.skillSummarize,
                    wechat:res.freelancerInfo.accountCode,
                    currrLanguage:currrLanguage,
                    columnsLanguageIndex:res.freelancerInfo.language/10,
                    jobTitle:res.employerInfo.jobTitle,
                    company:res.employerInfo.company,
                })

                if(res.freelancerInfo.provinceCode){
                    this.onFillArea(res.freelancerInfo.provinceCode,res.freelancerInfo.cityCode,res.freelancerInfo.districtCode)
                }

            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
            }
        })
    },
    //省份显示回填
    onFillArea(provincCode,cityCode,districtCode){
        this.setData({
            currrArea: [area.default.province_list[provincCode],area.default.city_list[cityCode],area.default.county_list[districtCode]],
            currrAreaCode: [provincCode,cityCode,districtCode],

        })
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
        let currrLanguage = e.detail.value.text;
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
    //公司
    bindCompanyNameInput(e){
        let company = e.detail.value
        this.setData({
            company,
        });
    },
    tapHasCompany(){
        if(!this.data.company){
            wx.showToast({
                title: '请先填写公司名称',
                icon: 'none',
                duration: 2000
            });
            return
        }
    },
    //职务
    bindJobInput(e){
        let jobTitle = e.detail.value
        this.setData({
            jobTitle,
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
        var regmobile = /^[1][3,5,6,7,8,9][0-9]{9}$/;
        if (this.data.phone.length >=1 && (!regmobile.test(this.data.phone) || this.data.phone.length != 11)) {
            wx.showToast({
                title: '请输入正确的手机号',
                icon: 'none',
                duration: 2000
            });
            return;
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

        // if (!this.data.company && this.data.jobTitle) {
        //     wx.showToast({
        //         title: '请先填写公司名称',
        //         icon: 'none',
        //         duration: 2000
        //     });
        //     return
        // }

        let data={
            provinceCode: this.data.currrAreaCode[0],
            cityCode: this.data.currrAreaCode[1],
            districtCode:this.data.currrAreaCode[2],
            name:this.data.name,
            headImg:this.data.headImgs.path,
            freelancerInfo:{
                language:this.data.currrLanguage == '中文' ? 10 :20,
                skillSummarize:this.data.desc,
                accountCode:this.data.wechat,
                phone:this.data.phone,
                name:this.data.name,
                headImg:this.data.headImgs.path,
            },
            // employerInfo:{
            //     company:this.data.company,
            //     jobTitle:this.data.jobTitle
            // }

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