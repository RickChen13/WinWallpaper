import Cookie from "@/common/Cookie"
import LocalStorage from "@/common/LocalStorage"
class Token {
    /**
     * 驱动
     * @var string
     */
    drive: string

    /**
     * 构造函数
     */
    constructor(drive = "cookie") {
        this.drive = drive
    }

    /**
     * 设置token
     * 
     * @param cvalue 
     * @param time 
     */
    setToken(tokenName: string, cvalue: string, time: number) {
        switch (this.drive) {
            case "cookie":
                this.cookieSet(tokenName, cvalue, time)
                break
            case "localStorage":
                this.localStorageSet(tokenName, cvalue, time)
                break
            default:
                break
        }
    }

    /**
     * cookie设置
     * 
     * @param tokenName 
     * @param cvalue 
     * @param time 
     */
    private cookieSet(tokenName: string, cvalue: string, time: number) {
        Cookie.setCookie(tokenName, cvalue, time)
    }

    /**
     * localStorage设置
     * 
     * @param tokenName 
     * @param cvalue 
     * @param time 
     */
    private localStorageSet(tokenName: string, cvalue: string, time: number) {
        LocalStorage.setLocalStorage(tokenName, cvalue)
        LocalStorage.setLocalStorage(tokenName + 'expiresTime', time.toString())
    }

    /**
     * 获取token
     * 
     * @returns 
     */
    getToken(tokenName: string) {
        let result: any = ""
        switch (this.drive) {
            case "cookie":
                result = this.cookieGet(tokenName)
                break
            case "localStorage":
                result = this.localStorageGet(tokenName)
                break
            default:
                break
        }
        return result
    }

    /**
     * cookie获取
     * 
     * @param tokenName 
     * @returns 
     */
    private cookieGet(tokenName: string) {
        const token = Cookie.getCookie(tokenName)
        return token
    }

    /**
     * localStorage获取
     * 
     * @param tokenName 
     * @returns 
     */
    private localStorageGet(tokenName: string) {
        let result: string
        let token = LocalStorage.getLocalStorage(tokenName)
        if (token != null) {
            const expiresTime = LocalStorage.getLocalStorage(tokenName + 'expiresTime')
            if (expiresTime != null) {
                const tDate: any = new Date()
                if (Number(Math.round(tDate)) >= Number(expiresTime)) {
                    token = ''
                }
            } else {
                token = ''
            }
            result = token
        } else {
            result = ''
        }
        return result
    }
}

export default Token