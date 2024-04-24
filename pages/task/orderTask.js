const app = getApp()
var that;
import Api from '../../config/api';
import Util from '../../utils/util';
import WxValidate from '../../utils/WxValidate';
import CustomPage from '../../CustomPage';
CustomPage({

  data: {
    record:{}
  },
  onLoad(options) {
    that = this;
    that.initValidate();
  },
  onReady() {

  },
  initValidate() {
    let rules = {      
      serveItems: {
        size: 1
      },
      serveContent: {
        required: true
      },
    }, messages = {
      serveItems: {
        size: "请选择完成的项目"
      },
      serveContent: {
        required: "请填写具体服务内容"
      },
    };
    that.WxValidate = new WxValidate(rules, messages);
  },
  onShow() {
    Api.serveRecordDetail({id:that.data.options.id}).then(res=>{
      console.log(res);
      that.setData({
        record:res.data
      })
    },err=>{
      that.showTips(err.msg);
    })
  },
  submit(e){
    console.log(e)
    let data = e.detail.value;
    if (!that.WxValidate.checkForm(data)) {
      console.log(that.WxValidate)
      let error = that.WxValidate.errorList[0]
      that.showTips(error.msg)
      return false;
    }
    Api.serveRecordUpdate(data).then(res=>{
      console.log(res);
      that.showTips("提交成功","success");
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    },err=>{
      that.showTips(err.msg);
    })
  }
  
})