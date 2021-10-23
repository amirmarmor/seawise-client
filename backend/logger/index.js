const level = process.env.VERBOSE || 0

function formatDate(format) {
  let date = new Date()
  if (!format)
    format = "MM/dd/yyyy"

  let month = date.getMonth() + 1
  let year = date.getFullYear()

  format = format.replace("MM", padL(month.toString(), 2, "0"))

  if (format.indexOf("yyyy") > -1)
    format = format.replace("yyyy", year.toString())
  else if (format.indexOf("yy") > -1)
    format = format.replace("yy", year.toString().substr(2, 2))

  format = format.replace("dd", padL(date.getDate().toString(),2, "0"))

  let hours = date.getHours()
  if (format.indexOf("t") > -1) {
    if (hours > 11)
      format = format.replace("t", "pm")
    else
      format = format.replace("t", "am")
  }
  if (format.indexOf("HH") > -1)
    format = format.replace("HH", padL(hours.toString(),2, "0"))
  if (format.indexOf("hh") > -1) {
    if (hours > 12) {
      hours = hours - 12
    }
    if (hours === 0) {
      hours = 12
    }
    format = format.replace("hh", padL(hours.toString(), 2, "0"))
  }
  if (format.indexOf("mm") > -1)
    format = format.replace("mm", padL(date.getMinutes().toString(),2, "0"))
  if (format.indexOf("ss") > -1)
    format = format.replace("ss", padL(date.getSeconds().toString(), 2, "0"))
  return format
}

function padL(s, width, pad) {
  if (!width || width < 1) {
    return s
  }

  if (!pad) pad = " "
  let length = width - s.length
  if (length < 1) return s.substr(0, width)

  return (repeat(pad, length) + s).substr(0, width)
}

function repeat(chr, count) {
  let str = ""
  for (let x = 0; x < count; x++) {
    str += chr
  }

  return str
}

function debug(msg) {
  if(level > 4 ) {
    log(msg)
  }
}

function warn(msg) {
  if(level >= 0 ) {
    log(msg)
  }
}

function info(msg) {
  if(level > 2 ) {
    log(msg)
  }
}

function log(msg) {
  let now = formatDate("yyyy-MM-dd HH:mm:ss")
  if(typeof msg === 'object'){
    msg = JSON.stringify(msg)
  }
  console.log(`[${now}] ${msg}`)
}

const logger = {
  debug,
  info,
  log,
  warn
}

module.exports = logger