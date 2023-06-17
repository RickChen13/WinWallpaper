class Cookie {
	/**
	 * 设置cookie
	 * @param cname 
	 * @param cvalue 
	 * @param time 
	 */
	static setCookie(cname: string, cvalue: string, time = 0) {
		let d = new Date()
		if (time == 0) {
			document.cookie = cname + "=" + cvalue
		} else {
			d.setTime(time)
			let expires = "expires=" + d.toUTCString()
			document.cookie = cname + "=" + cvalue + "" + expires + "path=/"
		}

	}
	/**
	 * 获取cookie
	 * @param cname 
	 */
	static getCookie(cname: string) {
		var result = '';
		if (document.cookie.length > 0) {
			var arr = document.cookie.split('; ')//这里显示的格式需要切割一下自己可输出看下
			for (var i = 0; i < arr.length; i++) {
				var arr2 = arr[i].split('=') //再次切割
				//判断查找相对应的值
				if (arr2[0] == cname) {
					result = arr2[1]
				}
			}
		}
		return result
	}
}

export default Cookie