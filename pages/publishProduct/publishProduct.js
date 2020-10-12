// pages/product/product.js
const app = getApp()
const REST = require("../../utils/restful.js")
const API = require("../../utils/api.js")
const uploadFile = require("./../../utils/upload.js")


Page({

    /**
     * 页面的初始数据
     */
    data: {
        safeBottom: app.safeBottom,
        title: '',
        total: 0,
        shadeShowing: false,
        currTreeSelectNavIndex: 0,
        skillType: '全部类型',
        markList: [],
        prod: {
            title: '',
            summarize: '',
            hourlyWage: '',
            jobCateId: '', //岗位
            skills: [], //技能
            images: []//images
        },
        treeData: [],
        demandType: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadjobTree()
        if (options.prodId) {
            this.setData({
                prodId: options.prodId
            })
            this.getProdDetail()
        }

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
        let title = e.detail.value;
        this.setData({
            'prod.title': title
        });
    },
    //初始化富文本编辑器
    onEditorReady() {
        const that = this
        wx.createSelectorQuery().select('#editor').context(function (res) {
            if(that.data.prod.summarize){
                that.setEditorData(that.data.prod.summarize)
            }
        }).exec()
    },
    //编辑器内容改变时触发
    bindEditorInput(e) {
        let summarize = this.deleteHtmlTag(e.detail.html);
        if (summarize.length > 300) {
            wx.showToast({
                title: '请输入300字以内',
                icon: 'none',
                duration: 2000
            });
            return
        }
        this.setData({
            total: summarize.length,
            'prod.summarize': summarize,
        });
    },
    //删除html标签
    deleteHtmlTag(html) {
        var dd = html.replace(/<[^>]+>/g, ""); //截取html标签
        var dds = dd.replace(/&nbsp;/ig, ""); //截取空格等特殊标签
        return dds
    },
    //上传作品
    tapUpload(e) {
        if (this.data.prod.images.length >= 8) {
            wx.showToast({
                title: '最多上传8张哦',
                icon: 'none',
                duration: 2000
            });
            return
        }

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
                'prod.images': this.data.prod.images
            })
        })
        // wx.chooseImage({
        //     count: 8 - this.data.prod.images.length,
        //     sizeType: ['compressed'],
        //     success: (res) => {
        //         let attachment = {
        //             type: 1, //图片
        //             name: '',
        //             path: res.tempFilePaths[0]
        //         }
        //         this.data.prod.images.push(attachment)
        //         this.setData({
        //             'prod.images': this.data.prod.images
        //         })
        //     }
        // });
    },
    //删除图片
    deletePhotos(e) {
        let currIndex = e.currentTarget.dataset.index;
        console.log(currIndex);
        this.data.prod.images.splice(currIndex, 1);
        this.setData({
            'prod.images': this.data.prod.images,
        })
    },
    // 点击图片
    tapBanner(e) {
        //let current = 'http:' + e.currentTarget.dataset.item
        let current = e.currentTarget.dataset.item

        let urls = []
        for (let item of this.data.prod.images) {
            //urls.push('http:' + item)
            urls.push(item)
        }

        wx.previewImage({
            current,
            urls,
        })
    },
    //显示隐藏
    shadeShowing(e) {
        console.log(111);
        if (e.currentTarget.dataset.id != "shadeMain") {
            this.setData({
                shadeShowing: !this.data.shadeShowing
            });
        }
    },
    // //点击树形左侧菜单
    // tapTreeSelectNav(e) {
    //     let currTreeSelectNavIndex=e.currentTarget.dataset.index
    //     this.setData({
    //         currTreeSelectNavIndex
    //     })
    // },
    //选择技能
    onSkillsChange(event) {
        const {
            picker,
            value,
            index
        } = event.detail;
        console.log(`当前值：${value}, 当前索引：${index}`);
        this.setData({
            shadeShowing: false,
            skillType: `${value}`
        });
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
    },
    //跳转到我的作品列表
    validSubmit() {
        if (this.trimStr(this.data.prod.title) == '') {
            wx.showToast({
                title: '请填写标题',
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
        if (this.data.skillType == '全部类型') {
            wx.showToast({
                title: '请选择技能类型',
                icon: 'none',
                duration: 2000
            });
            return
        }
        //todo 技能
        /**
         * let chooseMarkList=[]
        for(var i = 0; i < this.data.markList.length; i++){
            if(this.data.markList[i].select){
                chooseMarkList.push(this.data.markList[i]);
            }
        }
        this.setData({
            chooseMarkList 
        })
        */

        if (this.data.markList.length <= 0) {
            wx.showToast({
                title: '请选择技能标签',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (this.data.prod.hourlyWage <= 0) {
            wx.showToast({
                title: '请输入您的时薪',
                icon: 'none',
                duration: 2000
            });
            return
        }
        app.globalData.selectedTab = 2
        wx.switchTab({
            url: '/pages/mine/mine',
        })
    },
    //点击标签事件
    tapChooseMarks(e) {
        let id = e.currentTarget.dataset.id

        this.data.prod.skills.push({jobSkillId:this.data.markList[id].id})

        this.setData({
            [`markList[${id}].select`]: !this.data.markList[id].select,
            'prod.skills':this.data.prod.skills
        })
    },
    tapCreateProd() {
        this.validSubmit()
        let that = this
        REST.post({
            url: this.data.prodId ? API.modifyProd : API.createProd,
            data: this.data.prod,
            success(res) {
                console.log(res);
                app.globalData.selectedTab = 2
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
            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
                console.log("初始化作品详情:", that.data.prodDetail)
            }
        })
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
    //监听输入框，选择框 状态 copy
    watchInputSelectStatus() {
        if (this.trimStr(this.data.prod.title) == '' ||
            this.data.total <= 0 ||
            this.data.prod.jobCateId == '' ||
            this.data.prod.hourlyWage == 0) {
            this.setData({
                isClickbtn: false
            })
        } else {
            this.setData({
                isClickbtn: true
            })
        }

    },
    onCancel() {
        this.setData({
            shadeShowing: false,
        });
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
                    'prod.title':res.title,
                    'prod.summarize': res.summarize,
                    'prod.images': res.images,
                    'prod.jobCateId': res.postCate.id,
                    'prod.hourlyWage': res.hourlyWage,
                    'markList':that.data.markList

                })
                
                that.onEditorReady()
                that.onFillDemandType()
                that.getSkillByJob(res.postCate.id,res.skills)
            },
            failed(res) {
                console.error(res)
            },
            complete(res) {
                console.log("初始化作品详情:", that.data.prodDetail)
            }
        })
    },
    //需求详情，富文本框回填编辑值 
    setEditorData(desc) {
        this.editorCtx.setContents({
            html: desc,
            success: function () {
                this.bindEditorInput({detail: {html: desc}})            
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
    }
})