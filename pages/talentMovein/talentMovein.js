// pages/talentMovein/talentMovein.js
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
        isIosSystem:app.isIosSystem,
        safeBottom: app.safeBottom,
        shadeShowing: false,
        currStep: 1 ,//当前步骤  1，2，3 三步 默认第一步
        headImgs:{},//头像
        currrArea: [], //省市区
        currrAreaCode: '',
        userInfo:{},
        columnsLanguage :[{id:10,text:'中文'},{id:20,text:'英文'}],
        columnsLanguageIndex:1,
        hasPhoneDialog:true,
        hasWechatDialog:true,

        title: '',
        total: 0,
        currTreeSelectNavIndex: 0,
        skillType: '全部类型',
        markList: [],
        prod: {
            title: '',
            summarize: '',
            hourlyWage: '',
            budgetType:'0',//薪资类型 0 时薪 ， 1 一口价 ，2 面议
            jobCateId: '', //岗位
            skills: [], //技能
            images: []//images
        },
        treeData: [],
        demandType: '全部类型',

        chooseImageRadioIndex:1, //1 默认图片 ，2 自定义图片
        choosePriceRadioIndex:0,//0 时薪 ，1一口价 ，2面议

        imagepreview:[{url:'https://howwork-1301749332.file.myqcloud.com/production/2020-10-29/tmp_8e102f0cb7834f977f9c7103b2803446.jpg',selected:false}],//预览图片集合
        chooseImagePrevewRadioIndex:1, //1选中 2为选中

        isClickbtn:false,//是否可以发布预览

        currentPhotoIndex:1,
        
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
            currStep:options.currStep || 1,
        })
        this.getCurrentInfo()
        this.loadjobTree()
        if (options.prodId) {
            this.setData({
                prodId: options.prodId
            })
            this.getProdDetail()
        }
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
            
                console.log(res)

                let currrLanguage=''
                for(let i in this.data.columnsLanguage){
                    if(this.data.columnsLanguage[i].id == res.freelancerInfo.language){
                        currrLanguage = this.data.columnsLanguage[i].text
                        break
                    }
                }
                this.setData({
                    [`headImgs.fullPath`]:res.headImg,
                    name:res.name,
                    phone:res.freelancerInfo.phone,
                    desc:res.freelancerInfo.skillSummarize,
                    wechat:res.freelancerInfo.accountCode,
                    currrLanguage:currrLanguage,
                    columnsLanguageIndex:res.freelancerInfo.language/10-1,
                    prevViewfreelancerInfo:res.freelancerInfo//预览页面用
                })

                if(res.freelancerInfo.provinceCode){
                    this.onFillArea(res.freelancerInfo.provinceCode,res.freelancerInfo.cityCode,res.freelancerInfo.districtCode)

                }

            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
                console.log("个人信息拉去完成", res)
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
        console.log(e.currentTarget.dataset.type)
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

    //获取技能数据
    loadjobTree() {
        let that =this
        REST.noVerfiyget({
            url: API.loadTreeData,
            success: res => {
                console.log(res);
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
        console.log(selectFromatObject)

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
        if(this.data.prod.jobCateId){
            col1Keys.forEach((col1Key,col1Index)=>{
                dataSet[col1Key].forEach((col2Item,col2Index)=>{
                    if(col2Item.jobCateId === that.data.prod.jobCateId){
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
        console.log(`当前值：${value}, 当前索引：${index}`);

        this.setData({
            shadeShowing: false,
            demandType: value[0].jobCateName + "-" + value[1].jobCateName,
            'prod.jobCateId': value[1].jobCateId,
            'demandColumns[0].defaultIndex':index[0],
            'demandColumns[1].values':this.data.selectFromatObject[value[0].jobCateId],
            'demandColumns[1].defaultIndex':index[1],
        });

        this.watchInputSelectStatus();
        this.getSkillByJob(value[1].jobCateId)
    },
    onDemandChange(event) {
        const {
            picker,
            value,
            index
        } = event.detail;
        picker.setColumnValues(1, this.data.selectFromatObject[value[0].jobCateId]);
    },

    getProdDetail() {
        let that = this
        REST.get({
            url: API.getProdDetail,
            data: {
                id: this.data.prodId
            },
            success(res) {
                that.setData({
                    'prod.id':res.id,
                    'prod.code':res.code,
                    'prod.title':res.title,
                    'prod.summarize': res.summarize,
                    'prod.images': res.images,
                    'prod.jobCateId': res.postCate.id,
                    'prod.hourlyWage': res.hourlyWage,
                    'prod.budgetType': res.budgetType,
                    choosePriceRadioIndex:res.budgetType,
                    'markList':that.data.markList,
                    total:res.summarize.length,
                    'prod.domainCate':res.domainCate,
                    'prod.postCate':res.postCate,
                    'prod.freelancerInfo':res.freelancerInfo,


                })
                
                that.onFillDemandType()
                that.getSkillByJob(res.postCate.id,res.skills)
                that.watchInputSelectStatus();

            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
                console.log("初始化作品详情:", that.data.prodDetail)
            }
        })
    },

    getSkillByJob(jobCateId,skills){
        let that = this
        REST.get({
            url: API.getSkillList,
            data: {
                jobCateId: jobCateId
            },
            success(res) {
                if(res){
                    let tmpList=[]
                    res.forEach((item)=>{
                        let arr = {
                            val: item.skillName,
                            id: item.id,
                            select: false
                        }
                        tmpList.push(arr)
                })
                    that.setData({
                        markList: tmpList
                    })

                    //传入编辑技能，待使用promise
                    if(skills){
                        let editSkillList = []
                        that.data.markList.forEach((item)=>{
                            skills.forEach((chooseItem)=>{
                            if(item.id === chooseItem.jobSkillId){
                            item.select = true
                            editSkillList.push({jobSkillId:item.id})                        }
                    })
                    })
                        that.setData({
                            'prod.skills': editSkillList,
                            markList:that.data.markList
                        })
                    }
                }

            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
                console.log("加载岗位的技能:", that.data.markList)
            }
        })
    },
    //选择技能类型取消
    onCancel() {
        this.setData({
            shadeShowing: false,
        });
    },
    //去除首尾空格
    trimStr(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    //点击标签事件
    tapChooseMarks(e) {
        let id = e.currentTarget.dataset.id
        let selectJobSkillId =this.data.markList[id].id

        if(this.data.prod.skills){
            let hasNode = false
            let deleteIndex = 0
            this.data.prod.skills.forEach((item,index)=>{
                if(item.jobSkillId === selectJobSkillId){
                    hasNode = true
                    deleteIndex = index
                    return
                }
            })
            if(hasNode){
                this.data.prod.skills.splice(deleteIndex,1)
            }else{
                this.data.prod.skills.push({jobSkillId:selectJobSkillId})
            }
        }
        console.log(this.data.prod.skills)
        this.setData({
            [`markList[${id}].select`]: !this.data.markList[id].select,
            'prod.skills':this.data.prod.skills
        })
    },
    //作品图片 类型切换事件
    tapChooseImageRadio(e){
        let index = e.currentTarget.dataset.index
        this.setData({
            chooseImageRadioIndex: index
        })

    },
    bindTitleInput(e) {
        let title = e.detail.value;
        this.setData({
            'prod.title': title
        });
        this.watchInputSelectStatus()
    },
    //初始化富文本编辑器
    onEditorReady() {
        const that = this
        wx.createSelectorQuery().select('#editor').context(function (res) {
            that.editorCtx = res.context
            that.getProdDetail()
        }).exec()
    },
    //编辑器内容改变时触发
    bindEditorInput(e) {
        let description = e.detail.value;
        if (description.length > 300) {
            wx.showToast({
                title: '请输入300字以内',
                icon: 'none',
                duration: 2000
            });
            return
        }
        this.setData({
            total: description.length,
            'prod.summarize': description,
        });
        console.log(this.data.description)
        this.watchInputSelectStatus();
    },
    //删除html标签
    deleteHtmlTag(html) {
        var dd = html.replace(/<[^>]+>/g, ""); //截取html标签
        var dds = dd.replace(/&nbsp;/ig, ""); //截取空格等特殊标签
        return dds
    },
    //上传作品
    tapUploadProduct(e) {

        if (this.data.prod.images.length >= 8) {
            wx.showToast({
                title: '最多上传8张哦',
                icon: 'none',
                duration: 2000
            });
            return
        }

        //清空为你推荐选中的照片
        for(let i = 0 ; i<this.data.imagepreview.length; i++){
            if(this.data.imagepreview[i].selected){
                this.setData({
                    [`imagepreview[${i}].selected`]:false
                })
            }
        }

        this.setData({
            hasImagepreview:{selected:false, index:'-1'}
        })

        //参数详见 :utils/upload.js 
        uploadFile('production',(filePath)=>{
            let attachment = {
                    type: 1, //图片
                    name: '',
                    path: filePath.filePath, //相对路径
                    otherPath:filePath.filePath, //相对路径
                    fullPath:filePath.fullPath, //全路径
            }
            this.data.prod.images.push(attachment)
            this.setData({
                'prod.images': this.data.prod.images,
                shadeShowing:false
            })
        })
    },
    //删除图片
    deletePhotos(e) {
        let currIndex = e.currentTarget.dataset.index;
        console.log(currIndex);
        this.data.prod.images.splice(currIndex, 1);
        this.setData({
            'prod.images': this.data.prod.images,
        })
        this.watchInputSelectStatus()

    },
    // 点击图片
    tapBanner(e) {
        let current = e.currentTarget.dataset.item

        let urls = []
        for (let item of this.data.prod.images) {
            urls.push(item)
        }

        wx.previewImage({
            current,
            urls,
        })
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
    //时薪
    bindhourlywageInput(e) {
        let salary = this.clearNoNum(e.detail.value)
        this.setData({
            'prod.hourlyWage': salary,
        });
        this.watchInputSelectStatus()

    },

    //薪资计算方式 切换事件
    tapChoosePriceRadio(e){
        let index = e.currentTarget.dataset.index
        this.setData({
            choosePriceRadioIndex: index,
            'prod.hourlyWage': index == 2 ? 0 :this.data.prod.hourlyWage,
            'prod.budgetType': index,
        }) 

        console.log(this.data.prod.budgetType+"=========")
    },
    //个人信息点击下一步
    tapUpdateUserInfo(e){

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
                skillSummarize:this.data.desc,
                accountCode:this.data.wechat,
                phone:this.data.phone
            },

        }
        REST.post({
            url:API.updateAll ,
            data: data,
            success: res => {
                let currstep = e.currentTarget.dataset.currstep
                this.setData({
                    currStep: currstep
                }) 
            },
            failed: res => {
                wx.showToast({
                    title: '保存失败',
                    icon: 'none',
                    duration: 2000
                });
            },
        })

    },
    //上一步
    tapPrev(e){
        let currstep = e.currentTarget.dataset.currstep
        this.setData({
            currStep: currstep
        }) 
    },
    //选中推荐图片 切换事件
    tapChooseImagePrevewRadio(e){
        let index = e.currentTarget.dataset.index
        for(let i = 0 ; i<this.data.imagepreview.length; i++){
            if(this.data.imagepreview[i].selected && i != index){
                this.setData({
                    [`imagepreview[${i}].selected`]:false
                })
            }
        }
        this.setData({
            [`imagepreview[${index}].selected`]:!this.data.imagepreview[index].selected,
            'hasImagepreview.selected':!this.data.imagepreview[index].selected,
            'hasImagepreview.index':!this.data.imagepreview[index].selected ? index : '-1'

        })
    },
    //作品图片 推荐作品添加事件
    tapAddRecommendImage(e){
        let index = e.currentTarget.dataset.index
        if(index >= 0){
            let url = this.data.imagepreview[index].url
            let attachment = {
                type: 1, //图片
                name: '',
                path: url.split(".com/")[1], //相对路径
                otherPath:url.split(".com/")[1], //相对路径
                fullPath:url, //全路径
            }
            this.data.prod.images.push(attachment)
            this.setData({
                'prod.images': this.data.prod.images,
                shadeShowing:false
            })

            this.watchInputSelectStatus()
        }else {
            wx.showToast({
                title: '请选择一张你心仪的图片',
                icon: 'none',
                duration: 2000
            });
            return
        }
    },
    //监听输入框，选择框 状态 copy
    watchInputSelectStatus() {
        if (this.trimStr(this.data.prod.title) == '' ||
            this.data.total <= 0 ||
            this.data.prod.images.length<=0||
            this.data.prod.jobCateId == '' ||
            (this.data.prod.hourlyWage == 0 && this.data.prod.budgetType != 2) ) {
            this.setData({
                isClickbtn: false
            })
        } else {
            this.setData({
                isClickbtn: true
            })
        }

    },
    //发布预览
    tapPushPreview(e){
        this.watchInputSelectStatus()
        if (this.data.prod.jobCateId == '') {
            wx.showToast({
                title: '请选择技能类型',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (this.data.total <= 0) {
            wx.showToast({
                title: '请描述您的技能，尽可能清晰具体哦～',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (this.data.prod.images.length <= 0) {
            wx.showToast({
                title: '至少上传一张作品图片哦',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (this.data.prod.hourlyWage == 0 && this.data.prod.budgetType != 2) {
            wx.showToast({
                title: '请填写您的服务定价',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (this.trimStr(this.data.prod.title) == '') {
            wx.showToast({
                title: '请填写标题',
                icon: 'none',
                duration: 2000
            });
            return 
        }
        this.getCurrentInfo()

        let currstep = e.currentTarget.dataset.currstep
        this.setData({
            currStep: currstep
        }) 
    },
    //切换图片
    changeSwiper(e) {
        let currentPhotoIndex = e.detail.current + 1
        this.setData({
            currentPhotoIndex
        })
    },
    // 图片预览
    tapPreviewBanner(e) {
        let current = e.currentTarget.dataset.item
        let urls = []
        for (let item of this.data.prod.images) {
            urls.push(item.fullPath)
        }
        wx.previewImage({
            current,
            urls,
        })
    },
    //一键复制
    tapCopy(e){
        let content = e.currentTarget.dataset.content;
        wx.setClipboardData({
            data: content,
            success (res) {
                console.log(res);
            }
        })
    },
    //一键呼叫
    freeTell(e){
        let content = e.currentTarget.dataset.content;
        wx.makePhoneCall({

            phoneNumber: content,
      
          })
    },
    tapCreateProd() {        
        let that = this
        wx.requestSubscribeMessage({
            tmplIds: ['cv5hTnU_ABBjp8spFDvQacYttU2ZC3guvvJAoGKC8bA','0mfM9FVKOJzkD-tbXC9M1d5d5pfouIhjxDMBUzYogFI'], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
            success:res=> {
                console.log(res) //'accept'表示用户接受；'reject'表示用户拒绝；'ban'表示已被后台封禁
                REST.post({
                    url: this.data.prodId ? API.modifyProd : API.createProd,
                    data: this.data.prod,
                    success(res) {
                        app.globalData.selectedTab = 2
                        
                        setTimeout(() => {
                            wx.switchTab({
                                url: '/pages/mine/mine',
                                success: function (e) {
                                    let page = getCurrentPages().pop();
                                    if (page == undefined || page == null) {
                                        return
                                    };
                                    page.getProductionListByFreelancerId();
                                }
                            })  
                        }, 100);
                        
                    },
                    failed(res) {
                        console.error(res)
                    },
                    complete(res) {
                        console.log("初始化作品详情:", that.data.prodDetail)
                    }
                })

            },
            fail:res=>{
                console.log(res)
            },
            complete:res=>{
                console.log(res)
            },
    
        })

    },
})