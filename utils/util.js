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

const formatDate = (datetime, format) => {
  var date = new Date(datetime); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var year = date.getFullYear(),
    month = ("0" + (date.getMonth() + 1)).slice(-2),
    sdate = ("0" + date.getDate()).slice(-2),
    hour = ("0" + date.getHours()).slice(-2),
    minute = ("0" + date.getMinutes()).slice(-2),
    second = ("0" + date.getSeconds()).slice(-2);

  // 拼接
  let result
  if (format === 'yyyy/mm/dd') {
    result = year + "/" + month + "/" + sdate;
  } else if (format === 'yyyy-mm-dd') {
    result = year + "-" + month + "-" + sdate;
  } else if (format === '年月日') {
    result = year + "年" + month + "月" + sdate + "日";
  } else {
    result = year + "/" + month + "/" + sdate;
  }
  // 返回
  return result;
}

const deleteHtmlTag = (html) => {
  var dd = html.replace(/<[^>]+>/g, ""); //截取html标签
  var dds = dd.replace(/&nbsp;/ig, ""); //截取空格等特殊标签
  return dds
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  deleteHtmlTag: deleteHtmlTag
}