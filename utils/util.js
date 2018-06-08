const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatTimeText = date => {
  let minute = 60000;// 1分钟 
  let hour = 3600000;// 1小时 
  let day = 86400000;// 1天 
  let month = 2592000000;// 月 
  let year = 31104000000;// 年

  if (date == null) {
    return null;
  }
  let diff = new Date().getTime() - new Date(date).getTime();
  let r = 0;
  if (diff > year) {
    r = parseInt(diff / year)
    return r + "年前"
  }
  if (diff > month) {
    r = parseInt(diff / month)
    return r + "个月前"
  }
  if (diff > day) {
    r = parseInt(diff / day)
    return r + "天前"
  }
  if (diff > hour) {
    r = parseInt(diff / hour)
    return r + "小时前"
  }
  if (diff > minute) {
    r = parseInt(diff / minute)
    return r + "分钟前"
  }
  return "刚刚"
}

//删除左右两端的空格
const trim = str => { 
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

const uuid = () => {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

module.exports = {
  formatTime: formatTime,
  formatTimeText: formatTimeText,
  trim: trim,
  uuid: uuid
}
