const app = getApp()
var that;
import Api from '../../config/api';
import Util from '../../utils/util';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    tabIndex:0,
    bgs:['bg-green','bg-red','bg-grey'],
    statusArr:[{title:'是',value:2},{title:'否',value:1}],
    navs:[{title:'全部',status:''},{title:'待确认',status:0},{title:'已同意',status:1},{title:'已拒绝',status:2}],
    orders:[],
    today:Util.formatTime(new Date(),'yyyy-MM-dd')
  },
  onLoad(options) {
    that = this;
    that.setData({
      orderTime:Util.formatTime((options.orderTime|| new Date()),'yyyy-MM-dd')
    })
  },
  onReady() {
    getApp().watch(function (value) {
      console.log(value)
      if(value.login && value.auth){
        that.getList();
      }else{
        that.showTips(value.msg)
      }     
    })   
  },
  getList(){
    Api.servePackOrderCallback().then(res=>{
      that.setData({
        orders:res.data
      })
    },err=>{
      that.showTips(err.msg);
    });  
  },
  onShow() {

  },
  handle(e){
    console.log(e);
    that.setData({
      modalhandle:true,
      ['formData.id']:e.currentTarget.dataset.id
    })
  },
  pickerChange(e){
    console.log(e);
    let name = e.currentTarget.dataset.name;
    that.setData({
      ['formData.'+name]:e.detail.value
    })
  },
  submit(e){
    console.log(e);
    let data = e.detail.value;
    console.log(data);
    if(!data.suggest){
      return that.showTips("请输入接单建议");
    }
    Api.orderUpdate(JSON.stringify(data)).then(res=>{
      console.log(res);
      that.getList();
      that.setData({
        modalhandle:false
      })
    },err=>{
      console.log(err);
    })
  }
})