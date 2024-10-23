class LocalStorage {
    /**
     * 设置LocalStorage
     *
     * @param cname
     * @param cvalue
     */
    static setLocalStorage(cname: string, cvalue: string): boolean {
        let result = true;
        try {
            localStorage.setItem(cname, cvalue);
        } catch (error) {
            result = false;
        }
        return result;
    }

    /**
     * 获取LocalStorage
     *
     * @param cname
     */
    static getLocalStorage(cname: string): string | null {
        return localStorage.getItem(cname);
    }

    /**
     * 移除一个对象
     * 
     * @param cname 
     */
    static remove(cname: string) {
        localStorage.removeItem(cname);
    }
}

export default LocalStorage;
