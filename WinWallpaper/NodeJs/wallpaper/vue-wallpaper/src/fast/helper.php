<?php

declare(strict_types=1);

define('BASE_PATH', dirname(__DIR__, 2));
define('BASE_APP_PATH', BASE_PATH . "/src/app");

GenerateBackgroundConfig();

Views::quick("danmaku", 2, "/danmaku");

/**
 * 页面与组件生成
 */
class Views
{
    /**
     * 快速生成页面与组件
     *
     * @param string $name 名称
     * @param integer $type 类型:1=页面,2=组件
     * @param string $append 路径后缀
     * @return void
     */
    public static function quick(string $name, int $type = 1, string $append = "/")
    {
        if ($name == "") {
            exit("文件名称不能为空~");
        }
        switch ($type) {
            case 1:
                $typeName = "/views";
                break;
            case 2:
                $typeName = "/components";
                break;
            default:
                $typeName = "/views";
                break;
        }
        self::vue($name, $typeName, $append);
        self::scss($name, $typeName, $append);
        self::bll($name, $typeName, $append);
    }

    /**
     * 添加vue文件
     *
     * @param string $name
     * @param string $typeName
     * @param string $append
     * @return void
     */
    private static function vue(string $name, string $typeName = "/views", string $append = "/")
    {

        if ($name == "") {
            exit("文件名称不能为空~");
        }
        $Fullmc = "{$name}.vue";
        Write::formatFrist($append);
        Write::formatLast($append);
        $dir =  BASE_APP_PATH .   "{$typeName}{$append}";
        $content =
            #region
            <<<EOL
<template>
<div>
    {$name}
</div>
</template>

<script lang="ts">
import Component from "@/app{$typeName}{$append}{$name}"
const components = new Component();
export default components.vue();
</script>

<style lang="scss" scoped>
@import "@/app{$typeName}{$append}{$name}.scss";
</style>
EOL;
        #endregion
        Write::put($dir, $Fullmc, $content);
    }

    /**
     * 添加scss文件
     *
     * @param string $name
     * @param string $typeName
     * @param string $append
     * @return void
     */
    private static function scss(string $name, string $typeName = "/views", string $append = "/")
    {
        if ($name == "") {
            exit("文件名称不能为空~");
        }
        $Fullmc = "{$name}.scss";
        Write::formatFrist($append);
        Write::formatLast($append);
        $dir = BASE_APP_PATH . "{$typeName}{$append}";
        $content = "";
        Write::put($dir, $Fullmc, $content);
    }

    /**
     * 添加bll层
     *
     * @param string $name
     * @param string $typeName
     * @param string $append
     * @return void
     */
    private static function bll(string $name, string $typeName = "/views", string $append = "/")
    {

        if ($name == "") {
            exit("文件名称不能为空~");
        }
        $Fullmc = "{$name}.ts";
        Write::formatFrist($append);
        Write::formatLast($append);
        $dir = BASE_APP_PATH .   "{$typeName}{$append}";
        $content =
            #region
            <<<EOL
import BaseViews from "@/fast/base/BaseView";
import { defineComponent, getCurrentInstance } from "vue"

class Component extends BaseViews {
    constructor() {
        super()
    }

    public vue() {
        const vue = defineComponent({
            name: "{$name}",
            setup() {
                const proxy = getCurrentInstance();
                return {
                    proxy,
                };
            },
            created() { },
            methods: {},
            components: {
            },
        })
        return vue
    }
}

export default Component
EOL;
        #endregion
        Write::put($dir, $Fullmc, $content);
    }
}

/**
 * 文件写入
 */
class Write
{
    /**
     * 文件写入
     *
     * @param string $dir 目录
     * @param string $Fullmc 文件名称
     * @param string $content 内容
     * @return void
     */
    public static function put(string $dir, string $Fullmc, string $content)
    {

        self::formatLast($dir, false);
        if (!is_dir($dir)) {
            mkdir($dir, 755, true);
        }
        $filename = $dir . "/" . $Fullmc;
        self::formatPath($filename);
        if (!file_exists($filename)) {
            touch($filename, 755);
            file_put_contents($filename, $content);
        } else {
            echo "文件已经存在~";
        }
    }

    /**
     * 格式化路径
     *
     * @param string $path
     * @return void
     */
    public static function formatPath(string &$path)
    {
        if (PHP_OS == "WINNT") {
            $path = strtr($path, "/", "\\");
        } else {
            $path = strtr($path, "\\", "/");
        }
    }

    /**
     * 格式化路径
     *
     * @param string $str
     * @param boolean $append
     * @return void
     */
    public static function formatFrist(string &$str, bool $append = true)
    {
        $frist = substr($str, 0, 1);
        if ($append) {
            if ($frist != "/") {
                $str = "/" . $str;
            }
        } else {
            if ($frist == "/") {
                $str =  substr($str, 1, -1);
            }
        }
    }

    /**
     * 格式化路径
     *
     * @param string $str
     * @param boolean $append
     * @return void
     */
    public static function formatLast(string &$str, bool $append = true)
    {
        $last = substr($str, -1, 1);
        if ($append) {
            if ($last != "/") {
                $str .= "/";
            }
        } else {
            if ($last == "/") {
                $str =  substr($str, 0, strlen($str) - 1);
            }
        }
    }
}

class Path
{
    /**
     * 格式化路径
     *
     * @param string $path
     * @return string
     */
    public static function formatPath(string $path): string
    {
        if (PHP_OS == "WINNT") {
            $path = strtr($path, "/", "\\");
        } else {
            $path = strtr($path, "\\", "/");
        }
        return $path;
    }

    /**
     * 获取分隔符
     *
     * @return string
     */
    public static function getDelimiter(): string
    {
        if (PHP_OS == "WINNT") {
            $Delimiter =  "\\";
        } else {
            $Delimiter =  "/";
        }
        return $Delimiter;
    }

    /**
     * 格式化路径
     *
     * @param string $str
     * @param boolean $append true:在str最前面添加分隔符 false:去除str最前面的分隔符
     * @return string
     */
    public static function formatFrist(string $str, bool $append = true): string
    {
        $frist = substr($str, 0, 1);
        $Delimiter = self::getDelimiter();
        if ($append) {
            if ($frist != $Delimiter) {
                $str = $Delimiter . $str;
            }
        } else {
            if ($frist == $Delimiter) {
                $str =  substr($str, 1, -1);
            }
        }
        return $str;
    }

    /**
     * 格式化路径
     *
     * @param string $str
     * @param boolean $append true:在str最后面添加分隔符 false:去除str最后面前面的分隔符
     * @return string
     */
    public static function formatLast(string $str, bool $append = true): string
    {
        $last = substr($str, -1, 1);
        $Delimiter = self::getDelimiter();
        if ($append) {
            if ($last != $Delimiter) {
                $str .= $Delimiter;
            }
        } else {
            if ($last == $Delimiter) {
                $str =  substr($str, 0, strlen($str) - 1);
            }
        }
        return $str;
    }

    /**
     * 获取文件目录列表,该方法返回数组
     *
     * @param string $dir
     * @return array
     */
    public static function getDir(string $dir): array
    {
        $dirArray = [];
        if (false != ($handle = opendir($dir))) {
            while (false !== ($file = readdir($handle))) {
                if ($file != "." && $file != "..") {
                    if (is_dir(Path::formatPath($dir . '/' . $file))) {
                        $dirArray[] =  $file;
                    }
                }
            }
            //关闭句柄
            closedir($handle);
        }
        return $dirArray;
    }

    /**
     * 获取文件列表
     *
     * @param string $dir
     * @return array
     */
    public static function getFile(string $dir): array
    {
        $fileArray = [];
        if (false != ($handle = opendir($dir))) {
            while (false !== ($file = readdir($handle))) {
                if ($file != "." && $file != "..") {
                    if (is_file(Path::formatPath($dir . '/' . $file))) {
                        $fileArray[] =  $file;
                    }
                }
            }

            closedir($handle);
        }
        return $fileArray;
    }

    /**
     * 获取目录下全部的文件夹和文件，0文件夹，1文件
     *
     * @param string $dir
     * @return array
     */
    public static function get_dir(string $dir): array
    {
        $dirArray = [];
        $fileArray = [];
        if (false != ($handle = opendir($dir))) {
            while (false !== ($file = readdir($handle))) {
                if ($file != "." && $file != "..") {
                    if (is_dir(Path::formatPath($dir . '/' . $file))) {
                        $dirArray[] =  $file;
                    } else {
                        $fileArray[] =  $file;
                    }
                }
            }
            //关闭句柄
            closedir($handle);
        }
        return [$dirArray, $fileArray];
    }
}


/**
 * 生成backgroundConfig.ts
 *
 * @return void
 */
function GenerateBackgroundConfig()
{
    $imgPatth = BASE_PATH . "\\public\\images";
    $arr = Path::getFile($imgPatth);
    $imgArr = [];
    foreach ($arr as $value) {
        $name = explode('.', $value);
        $imgArr[$name[0]] = $value;
    }
    ksort($imgArr);
    $string = "";
    foreach ($imgArr as $value) {
        if ($value == ".gitignore") {
            continue;
        }
        $name = "image";
        $valArr = explode('.', $value);
        foreach ($valArr as  $val) {
            $name .= ucfirst($val);
        }
        // $import .= "import $name from \"@/images/{$value}\";";
        $string .= "{class:\"\",path:'./images/{$value}',},";
    }



    $imgString = $string;

    $putString =
        #region
        <<<EOL

let backgroundConfig = {
    imgArr:[
        {$imgString}
    ],
};

export default backgroundConfig;

EOL;
    #endregion
    $filename = BASE_PATH . "/src/app/components/background/backgroundConfig.ts";
    if (file_exists($filename)) {
        unlink($filename);
    }

    file_put_contents($filename, $putString);
}
