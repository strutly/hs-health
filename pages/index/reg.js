const app = getApp()
var that;
import Api from '../../config/api';
import WxValidate from '../../utils/WxValidate';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    sexArr:[{title:"男",value:1},{title:"女",value:2}],
    educationArr:['初中','中专','大专','高中','本科','研究生','博士','其他'],
    formData:{certificates:[]},
    orgs:[],
    errorMsg:'',
    errorShow:false,
    errorType:'info'
  },
  onLoad(options) {
    that = this;
    that.initValidate();
  },
  onReady() {
    Api.getAllAgencyOrg().then(res=>{
      console.log(res);
      that.setData({
        orgs:res.data
      })
    },err=>{
      that.showTips(err.msg);
    })
  },
  initValidate() {
    let rules = {
      name: {
        required: true
      },
      pic: {
        required: true
      },
      cardNo: {
        required: true,
        idcard:true
      },
      cardPic: {
        required: true
      },
      phone: {
        required: true
      },
      agencyOrgId: {
        required: true
      },
      sex: {
        required: true
      },
      education: {
        required: true
      },
      district: {
        required: true
      },
      address: {
        required: true
      },
      des: {
        required: true
      },
      certificates:{
        size: 1
      }
    }, messages = {
      name: {
        required: "请输入姓名"
      },
      pic: {
        required: "请选择头像"
      },
      cardNo: {
        required: "请输入正确的身份证号码",
        idcard:"请输入正确的身份证号码"
      },
      cardPic: {
        required: "请上传身份证照片"
      },
      phone: {
        required: "请输入正确的手机号"
      },
      agencyOrgId: {
        required: "请选择挂靠机构"
      },
      sex: {
        required: "请选择性别"
      },
      education: {
        required: "请选择学历"
      },
      district: {
        required: "请选择省市区"
      },
      address: {
        required: "请输入详细地址"
      },
      des: {
        required: "请输入简介信息"
      },
      certificates:{
        size: "请至少上传一个个人证书"
      }
    };
    that.WxValidate = new WxValidate(rules, messages);
  },
  inputChange(e){
    let name = e.currentTarget.dataset.name;
    that.setData({
      [name]:e.detail.value
    })
  },
  pickerChange(e){
    console.log(e);
    let type = e.currentTarget.dataset.type;
    let formData = that.data.formData;
    formData[type] = e.detail.value;
    that.setData({
      formData:formData
    })
  },
  regionChange(e){
    console.log(e);
    let formData = that.data.formData;
    formData.province = e.detail.value[0];
    formData.city = e.detail.value[1];
    formData.district = e.detail.value[2];
    that.setData({
      formData:formData
    })
  },
  chooseAddress(){
    wx.chooseLocation({
      success(res){
        console.log(res);
        let formData = that.data.formData;
        formData.address = res.address;
        that.setData({
          formData:formData
        })
      },
      fail(err){
        console.log("err",err)
      }
    })
  },
  async getPhoneNumber(e){
    console.log(e);
    if (e.detail.errMsg === "getPhoneNumber:ok") {
      let code = await Api.getCode();
      Api.getPhoneNumber({
        encryptedData: e.detail.encryptedData,
        code: code,
        iv: e.detail.iv
      }).then(res=>{
        console.log("success",res);
        that.setData({
          ['formData.phone']:res.data
        })
      },err=>{
        console.log("err",err);
      })
    }
  },
  showCardNo(e){
    console.log(e)
  },
  chooseAvatra(e){
    console.log(e);    
    Api.uploadFile(e.detail.avatarUrl,false).then(res=>{
      console.log(res);
      that.setData({
        ['formData.pic']:res.data,
      })
    },err=>{
      that.showTips(err.msg);
    })
  },
  addCertificate(){
    let index = that.data.formData.certificates.length;
    that.setData({
      modalcertificate:true,
      certificate:{index}
    })
  },
  editCertificate(e){
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let formData = that.data.formData;
    let certificate = formData.certificates[index];
    that.setData({
      certificate:certificate,
      modalcertificate:true
    })
  },
  removeCertificate(e){
    let index = e.currentTarget.dataset.index;
    let formData = that.data.formData;
    let certificates = formData.certificates;
    certificates.splice(index,1);
    that.setData({
      formData:formData
    })
  },
  submitCertificate(e){
    console.log(e)
    let {index,title,src} = e.detail.value;
    console.log({index,title,src});
    if(!title) return that.showTips("请输入证书名称");
    if(!src) return that.showTips("请上传证书照片");
    let formData = that.data.formData;
    formData.certificates[index] = {title,src};
    that.setData({
      formData:formData,
      certificate:{},
      modalcertificate:false
    })
  },
  addPic(e){
    console.log(e)
    that.uploadPic(1).then(res=>{
      Api.uploadFile(res[0].tempFilePath,false).then(res=>{
        console.log("endupload",res);
        that.setData({
          [e.currentTarget.dataset.target]:res.data
        })
      },err=>{
        that.showTips(err.msg);
      })
    },err=>{
      that.showTips(err.msg);
    })
  },
  submit(e){
    console.log(e);
    let data = e.detail.value;
    if (!that.WxValidate.checkForm(data)) {
      console.log(that.WxValidate)
      let error = that.WxValidate.errorList[0]
      that.showTips(error.msg)
      return false;
    }
    Api.caregiverReg(data).then(res=>{
      console.log(res);
    },err=>{
      that.showTips(err.msg);
    })
  }
})