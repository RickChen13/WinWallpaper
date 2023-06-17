class LocalStorage {
    /**
     * 设置LocalStorage
     * 
     * @param cname 
     * @param cvalue  
     */
    static setLocalStorage(cname: string, cvalue: string) {
        let result = true
        try {
            localStorage.setItem(cname, cvalue)
        } catch (error) {
            result = false
        }
        return result
    }

    /**
     * 获取LocalStorage
     * 
     * @param cname 
     */
    static getLocalStorage(cname: string) {
        let result = ""
        const cvalue = localStorage.getItem(cname)
        if (cvalue != null) {
            result = cvalue
        }
        return result
    }
}

export default LocalStorage