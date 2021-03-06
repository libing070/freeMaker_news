// pages/demand/demand.js
const util = require("../../utils/util");
const area = require("../../utils/area");
const REST = require("../../utils/restful.js")
const API = require("../../utils/api.js")

const app = getApp()
const citys = {
    浙江: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
    福建: ['福州', '厦门', '莆田', '三明', '泉州'],
};
const watch = require("../../utils/watch.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        safeBottom: app.safeBottom,
        collect: false,
        title: '',
        description: '',
        total: 0,
        shadeShowing: false,
        currTreeSelectNavIndex: 0,
        currPicker: '',
        minDate: new Date().getTime(),
        maxDate: new Date().getTime() + (86400000 * 365 * 10),
        currentDate: new Date().getTime(),
        currentDateStr: '请选择', //期望交付时间（视图展示）
        expectDeliveryTime: '', //期望交付时间
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

        currrArea: [], //省市区
        currrAreaCode: '',

        demandType: '请选择',
        demandColumns: [
            // {
            //   values: Object.keys(citys),
            //   className: 'column1',
            // },
            // {
            //   values: citys['浙江'],
            //   className: 'column2',
            //   defaultIndex: 2,
            // },
        ],
        budget: '',
        hourlywage: '¥400/时',
        isClickbtn: false,
        buysum: 1,
        jobCateId: '',
        editDemandCode: '', //编辑的需求编号
        editOrderCode: '', //编辑的订单编号
        demandDetail:{},
        orderDetail:{},
        choosePriceRadioIndex:'',//0 时薪 ，1一口价 ，2面议
        choosePayRadioIndex:0,//0 远程，1 现场
        chooseEmployerRadioIndex:'',//0 企业， 1个人

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //禁止转发 分享朋友圈
        wx.hideShareMenu({
            menus: ['shareAppMessage', 'shareTimeline']
        })
        watch.setWatcher(this); // 设置监听器，建议在onLoad下调用
        this.setData({
            areaList: area.default,
            editDemandCode: options.demandCode || '' //查看详情页面传入的code
        });
        this.loadjobTree()
        if(options.type == 0){
            this.getCurrentInfo()
        }

        wx.setNavigationBarTitle({
            title: options.type == 0 ? '发布需求':'编辑需求'
        })        
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
    //初始化编辑的需求
    initEditDemandInfo(){

    },
    //初始化编辑的订单
    initEditOrderInfo(){

    },
    //获取技能数据
    loadjobTree() {
        let that =this
        REST.noVerfiyget({
            url: API.loadTreeData,
            success: res => {
                this.filterTreeData(res);
                this.setData({
                    treeData: res
                })
                if(this.data.editDemandCode){
                    this.getDemandDetail()
                }
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
    filterTreeData(data) {
        let 
        selectFromatObject = {},
        level1List = []
        if (data.length > 0) {
            let level1 = []
            for (let i in data) {
                level1 = {
                    jobCateId: data[i].value.id,
                    jobCateName: data[i].value.cateName
                }
                level1List.push(level1)
                let level2 = []
                let childs = data[i].childs
                for (let child of childs) {
                    level2.push({
                        jobCateId: child.value.id,
                        jobCateName: child.value.cateName
                    })
                }
                selectFromatObject[level1.jobCateId] = level2
            }
        }

        let demandColumns = [{
                values: level1List,
                className: 'column1',
            },
            {
                values: selectFromatObject[level1List[0].jobCateId],
                className: 'column2',
                defaultIndex: 0,
            },
        ]
        this.setData({
            demandColumns,
            selectFromatObject
        })
       
    },
    //根据岗位id回填选择框
    onFillDemandType(){
        let that = this
        let dataSet = this.data.selectFromatObject
        let col1Keys = Object.keys(dataSet)
        if(this.data.jobCateId){
            col1Keys.forEach((col1Key,col1Index)=>{
                dataSet[col1Key].forEach((col2Item,col2Index)=>{
                    if(col2Item.jobCateId === that.data.jobCateId){
                        that.setData({
                            'demandColumns[1].values':dataSet[col1Key],
                            'demandColumns[1].defaultIndex':col2Index,
                            'demandColumns[0].defaultIndex':col1Index,
                            demandType: that.data.demandColumns[0].values[col1Index].jobCateName + "-" + col2Item.jobCateName,
                        })
                    }
                })
            })
        }
    },
    onDemandConfirm(event) {
        const {
            picker,
            value,
            index
        } = event.detail;

        this.setData({
            shadeShowing: false,
            demandType: value[0].jobCateName + "-" + value[1].jobCateName,
            jobCateId: value[1].jobCateId,
            'demandColumns[0].defaultIndex':index[0],
            'demandColumns[1].values':this.data.selectFromatObject[value[0].jobCateId],
            'demandColumns[1].defaultIndex':index[1],
        });

        this.watchInputSelectStatus();
    },
    onDemandChange(event) {
        const {
            picker,
            value,
            index
        } = event.detail;
        picker.setColumnValues(1, this.data.selectFromatObject[value[0].jobCateId]);
    },
    onCancel() {
        this.setData({
            shadeShowing: false,
        });
    },
    watch: {
        'title': function (value, oldValue) {
            if (value == '') {
                this.setData({
                    //  isClickbtn:false
                })
            }

        },
    },
    tapCollect(e) {
        this.setData({
            collect: !this.data.collect
        })

        if (this.data.collect) {
            wx.showToast({
                title: '收藏成功',
                icon: 'none',
                duration: 2000
            });
        } else {
            wx.showToast({
                title: '已取消收藏',
                icon: 'none',
                duration: 2000
            });
        }
    },
    //去除首尾空格
    trimStr(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    //对输入金额进行校验
    clearNoNum(value) {
        value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
        value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是字符
        value = value.replace(/\.{2,}/g, "."); //只保留第一个.清除多余的
        value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
        return value
    },
    //监听输入框，选择框 状态
    watchInputSelectStatus() {
       
        if (this.trimStr(this.data.title) == '' ||
            this.data.total <= 0 ||
            this.data.demandType == '请选择' ||
            this.data.currentDateStr == '请选择' ||
            (this.data.budget == 0 && this.data.budgetType != 2)||
            this.data.currrArea.length <= 0) {
            this.setData({
                isClickbtn: false
            })
        } else {
            this.setData({
                isClickbtn: true
            })
        }
        
    },
    bindTitleInput(e) {
        let title = e.detail.value;
        this.setData({
            title,
        });
        this.watchInputSelectStatus();
    },

    //时薪 一口价
    bindhourlywageInput(e) {
        let budget = this.clearNoNum(e.detail.value)
        this.setData({
            budget,
        });
        this.watchInputSelectStatus();
    },
    //计算购买数量
    calcQuantity(e) {
        let type = e.currentTarget.dataset.type
        let buysum = this.data.buysum
        if (type == 'plussign') {
            buysum++
        } else {
            if (buysum > 1) {
                buysum--
            } else {
                wx.showToast({
                    title: '至少购买一份，不能再减啦',
                    icon: 'none',
                    duration: 2000
                });
                return
            }

        }

        this.setData({
            buysum
        })


    },
    //初始化富文本编辑器
    onEditorReady() {
        const that = this
        wx.createSelectorQuery().select('#editor').context(function (res) {
            that.editorCtx = res.context
            that.loadjobTree()
        }).exec()
    },
    //编辑器内容改变时触发
    bindEditorInput(e) {
       // let description = this.deleteHtmlTag(e.detail.html);
        let description = e.detail.value;

        if (description.length > 500) {
            wx.showToast({
                title: '请输入500字以内',
                icon: 'none',
                duration: 2000
            });
            return
        }
        this.setData({
            total: description.length,
            description: description,
        });
        this.watchInputSelectStatus();
    },
    //删除html标签
    deleteHtmlTag(html) {
        var dd = html.replace(/<[^>]+>/g, ""); //截取html标签
        var dds = dd.replace(/&nbsp;/ig, ""); //截取空格等特殊标签
        return dds
    },
    //薪资计算方式 切换事件
    tapChoosePriceRadio(e){
        let index = e.currentTarget.dataset.index
        this.setData({
            choosePriceRadioIndex: index,
            budget: this.data.budget,
            budgetType: index,
        }) 

    },
    //交付方式 切换事件
    tapChoosePayRadio(e){
        let index = e.currentTarget.dataset.index
        this.setData({
            choosePayRadioIndex: index,
        }) 

    },
    bindCompanyInput(e) {
        let company = e.detail.value;
        this.setData({
            company,
        });
        this.watchInputSelectStatus();
    },
    bindJobTitleInput(e) {
        let jobTitle = e.detail.value;
        this.setData({
            jobTitle,
        });
        this.watchInputSelectStatus();
    },
    //雇佣者 类型切换事件
    tapChooseEmployerRadio(e){
        let index = e.currentTarget.dataset.index
        this.setData({
          chooseEmployerRadioIndex: index
        })
        if( index == 0 && this.data.company == '个体经营者'){
            this.setData({
                company: ''
            })
        }
        if( index == 0 && this.data.jobTitle == '个体雇主'){
            this.setData({
                jobTitle: ''
            })
        }
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
    //点击树形左侧菜单
    tapTreeSelectNav(e) {
        let currTreeSelectNavIndex = e.currentTarget.dataset.index
        this.setData({
            currTreeSelectNavIndex
        })
    },
    //时间下拉确定按钮事件
    dateTapDone(e) {
        let currentDate = e.detail;
        let currentDateStr = util.formatDate(currentDate, '年月日')
        let expectDeliveryTime = util.formatDate(currentDate, 'yyyy-mm-dd')
        this.setData({
            shadeShowing: false,
            currentDate: currentDate,
            currentDateStr: currentDateStr,
            expectDeliveryTime: expectDeliveryTime
        });
        this.watchInputSelectStatus();
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
        this.watchInputSelectStatus();
    },
    //省份显示回填
    onFillArea(provincCode,cityCode,districtCode){
        this.setData({
            currrAreaCode: [provincCode,cityCode,districtCode],
            currrArea: [area.default.province_list[provincCode],area.default.city_list[cityCode],area.default.county_list[districtCode]]
        })
    },
    //取消按钮事件
    // 点击遮罩层
    tapCancel(e) {
        this.setData({
            shadeShowing: false
        });
    },

    //根据选择的需求类型查找cateTreeCode编码
    findCateTreeCode() {
        let treeData = this.data.treeData
        //todo 声明匿名函数和抽出方法的区别？
        let filterCateCode = (treeData, cateName) => {
            for (var i = 0; i < treeData.length; i++) {
                let childs = treeData[i].childs
                if (childs.length > 0) {
                    for (var n = 0; n < childs.length; n++) {
                        if (childs[n].value.cateName == cateName) {
                            let cateCode = childs[n].value.cateCode
                            this.setData({
                                cateCode
                            })
                            break
                        }
                    }
                    filterCateCode(treeData[i], cateName)
                }
            }

        }

        let cateName = this.data.demandType.split('-')[1]
        if (cateName) {
            filterCateCode(treeData, cateName)
        }


    },
    //跳转到我的作品列表
    tapPublishDemand() {
      //  this.findCateTreeCode()

        if (this.trimStr(this.data.title) == '') {
            wx.showToast({
                title: '请填写标题',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (this.data.total <= 0) {
            wx.showToast({
                title: '请填写需求描述',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (this.data.demandType == '请选择') {
            wx.showToast({
                title: '请选择需求类型',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (this.data.currentDateStr == '请选择') {
            wx.showToast({
                title: '请选择期望交付时间',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (this.data.budget == '' && this.data.budgetType != 2) {
            wx.showToast({
                title: '请填写您的服务定价',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (this.data.currrArea.length <= 0) {
            wx.showToast({
                title: '请选择省份城市',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (!this.data.company  && this.data.chooseEmployerRadioIndex == 0) {
            wx.showToast({
                title: '请填写公司名称',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (!this.data.jobTitle && this.data.chooseEmployerRadioIndex == 0) {
            wx.showToast({
                title: '请填写您的职务',
                icon: 'none',
                duration: 2000
            });
            return
        }

        let data = {
            code:this.data.editDemandCode,
            summarize: this.data.title, //标题
            description: this.data.description, //描述
            budget: this.data.budgetType == 2 ? 0: this.data.budget, //预算
            budgetType:this.data.choosePriceRadioIndex == '' ? 0: this.data.choosePriceRadioIndex,
            deliveryType:this.data.choosePayRadioIndex,//交付方式
            companyName:this.data.chooseEmployerRadioIndex == 0 ? this.data.company : '个体经营者',//企业信息
            jobTitle:this.data.chooseEmployerRadioIndex == 0 ? this.data.jobTitle : '个体雇主',
            cateTreeCode: this.data.cateCode, //需求类型岗位tree编码
            jobCateId: this.data.jobCateId, //需求类型岗位编码
            expectDeliveryTime: this.data.expectDeliveryTime, //期望交付时间
            provinceCode: this.data.currrAreaCode[0], //省份
            cityCode: this.data.currrAreaCode[1], //城市
            districtCode: this.data.currrAreaCode[2], //区
        }

        wx.requestSubscribeMessage({
            tmplIds: ['cv5hTnU_ABBjp8spFDvQacYttU2ZC3guvvJAoGKC8bA','0mfM9FVKOJzkD-tbXC9M1d5d5pfouIhjxDMBUzYogFI'], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
            success:res=> {
                 //'accept'表示用户接受；'reject'表示用户拒绝；'ban'表示已被后台封禁
                REST.post({
                    url: this.data.editDemandCode?API.updateDemand:API.publishDemand ,
                    data: data,
                    success: res => {
                        app.globalData.selectedTab = 0
                        wx.showToast({
                            title: '提交成功',
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
                            title: '提交失败',
                            icon: 'none',
                            duration: 2000
                        });
                    },
                })
            },
            fail:res=>{
            },
            complete:res=>{
            },
    
        }) 

    },
    //todo 和demandDetail的需求查看详情 待抽取共用
    getDemandDetail() {
        let that = this
        REST.get({
            url: API.getDemandDetail,
            data: {
                demandCode: this.data.editDemandCode
            },
            success(res) {
                that.setData({
                    title: res.summarize,
                   // description: that.setEditorData(res.description),
                    description: res.description,
                    total:res.description.length,
                    jobCateId: res.jobCateId,//todo 回显
                    currentDateStr: util.formatDate(res.expectDeliveryTime, '年月日'),
                    expectDeliveryTime : res.expectDeliveryTime,
                    budget: res.budget,
                    budgetType:res.budgetType,
                    choosePriceRadioIndex:res.budgetType,
                    chooseEmployerRadioIndex:res.companyName == '个体经营者'? 1 : 0,
                    company:res.companyName,
                    jobTitle:res.jobTitle,
                    choosePayRadioIndex:res.deliveryType,
                    currrAreaCode: res.districtCode//todo 回显
                }) 
                that.onFillDemandType()
                that.onFillArea(res.provinceCode,res.cityCode,res.districtCode)
                that.watchInputSelectStatus()
            },
            failed(res) {
                console.error(res)
            },
            complete(res) {}
        })
    },
    //需求详情，富文本框回填编辑值 用lambda试试
    setEditorData(desc){
        let that = this
        this.editorCtx.setContents({
        html: desc,
        success: function () {
            that.setEditorDesc(desc)
        }
        })
    },
    setEditorDesc(desc){
        let e = {
            detail:{
                html:desc
            }
        }
        this.bindEditorInput(e)
    },
    //todo 试验函数 可删除 需求类型，编辑时回填 
    setEditDemandType(){
        // this.filterPickerTree(10006)
    },
    //todo 试验函数 可删除 需求类型，编辑时回填 
    filterPickerTree(value){
        let treeData = this.data.treeData
        let filterCateCode = (treeData, cateId) => {
            for (var i = 0; i < treeData.length; i++) {
                let childs = treeData[i].childs
                if (childs.length > 0) {
                    for (var n = 0; n < childs.length; n++) {
                        if (childs[n].value.id == cateId) {
                            let cateCode = childs[n].value.cateCode
                            this.setData({
                                cateCode
                            })
                            break
                        }
                    }
                    filterCateCode(treeData[i], cateId)
                }
            }

        }

        if (value) {
            filterCateCode(treeData, value)
        }
    },
    //获取个人信息接口 判断是 企业雇主 还是个体雇主 根据 公司名称来判断 为空代表个体 反之 企业
    getCurrentInfo(){
        REST.get({
            url: API.getCurrentInfo,
            success:res => {
                this.setData({
                    chooseEmployerRadioIndex:res.employerInfo.company == '个体经营者'? 1 : 0,
                    company:res.employerInfo.company,
                    jobTitle:res.employerInfo.jobTitle
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
})