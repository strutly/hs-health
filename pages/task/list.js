const app = getApp()
var that;
import Api from '../../config/api';
import Util from '../../utils/util';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    bgs:['bg-green','bg-red','bg-grey'],
    statusArr:[{title:'是',value:1},{title:'否',value:2}],
    navs:[{title:'全部',status:''},{title:'待确认',status:0},{title:'已同意',status:1},{title:'已拒绝',status:2}],
    appointments:[],
    today:Util.formatTime(new Date(),'yyyy-MM-dd')
  },
  onLoad(options) {
    that = this;
    that.setData({
      startDate:Util.formatTime((options.startDate|| new Date()),'yyyy-MM-dd')
    })
  },
  onShow() {
    that.getList(Util.formatTime(that.data.startDate,'yyyy-MM-dd'));
  },
  getList(startDate){
    Api.serveRecordList({startDate}).then(res=>{
      console.log(res);
      that.setData({
        records:res.data
      })
    },err=>{
      console.log(err)
    });
  },
  dayChange(e){
    let startDate = that.data.startDate;
    let date = new Date(startDate);
    let day = date.getDate();
    let add = e.currentTarget.dataset.add;
    date.setDate(day + parseInt(add));
    that.setData({
      startDate:Util.formatTime(date,'yyyy-MM-dd')
    })
    that.getList(Util.formatTime(date,'yyyy-MM-dd'));
  },
  onShow() {

  },
})