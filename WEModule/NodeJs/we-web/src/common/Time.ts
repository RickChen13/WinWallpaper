class Time {
	/**
	 * 获取年
	 * 
	 * @param date 
	 * @returns 
	 */
	static getYear(date: string | number | Date | null = null) {
		if (date == null) {
			date = this.microtime();
		}
		const thisDate = new Date(date);
		const year = thisDate.getFullYear();
		return year;
	}

	/**
	 * 获取日期
	 * @param date 
	 * @returns 
	 */
	static getYmdHis(date: number | null = null) {
		if (date == null) {
			date = this.microtime();
		}
		const thisDate = new Date(date);
		const Y = thisDate.getFullYear();
		const m = this.formatZero(thisDate.getMonth() + 1, 2);
		const d = this.formatZero(thisDate.getDate(), 2);
		const H = this.formatZero(thisDate.getHours(), 2);
		const i = this.formatZero(thisDate.getMinutes(), 2);
		const s = this.formatZero(thisDate.getSeconds(), 2);
		const YmdHis = `${Y}-${m}-${d} ${H}:${i}:${s}`;
		return YmdHis;
	}

	/**
	 * 获取日期信息
	 * @param date 
	 * @returns 
	 */
	static getDayInfo(date: number | null = null) {
		if (date == null) {
			date = this.microtime();
		}
		const thisDate = new Date(date);
		const Y = thisDate.getFullYear();
		const m = thisDate.getMonth() + 1;
		const d = thisDate.getDate();
		const H = thisDate.getHours();
		const i = thisDate.getMinutes();
		const s = thisDate.getSeconds();
		return { Y, m, d, H, i, s };
	}

	/**
	 * 不足位数前面补0
	 * @param {*} num 
	 * @param {*} len 
	 * @returns 
	 */
	static formatZero(num: number, len: number) {
		if (String(num).length > len) {
			return num;
		}
		return (Array(len).join('0') + num).slice(-len);
	}

	/**
	 * 获取毫秒时间戳(13位)
	 * 
	 * @returns 
	 */
	static microtime() {
		return new Date().getTime();
	}

	/**
	 * 获取秒时间戳(10位)
	 */
	static time() {
		return Math.round(Time.microtime() / 1000);
	}

	static getMonday(date: number | null = null) {
		if (date == null) {
			date = this.microtime();
		}
		let today = new Date(date);
		let currentDay = today.getDay();
		currentDay = currentDay == 0 ? 7 : currentDay;
		let start = new Date(today);
		start.setDate(today.getDate() - currentDay + 1);
		let ymd = Time.getDayInfo(start.getTime());
		return Date.parse(`${ymd.Y}-${ymd.m}-${ymd.d} 00:00:00`);
	}

	/**
	 * 获取两个时间的差值(如果end<=str,将返回0)
	 * 
	 * @param endTime 
	 * @param stratTime 
	 * @returns 
	 */
	static getDifference(endTime: number, stratTime = Time.microtime()) {
		let result = 0;
		if (endTime > stratTime) {
			result = endTime - stratTime;
		}
		return result;
	}
}

export default Time;
