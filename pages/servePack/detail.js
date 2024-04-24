var that;
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    pack:{}
  },
  onLoad(options) {
    that = this;
  },
  onReady() {
    Api.servePackDetail({id:that.data.options.id}).then(res=>{
      that.setData({
        pack:res.data
      })
    },err=>{
      that.showTips(err.msg);
    })
  },
  showDes(e){
    that.setData({
      modaldes:true,
      des:e.currentTarget.dataset.des
    })
  }

})