/**
 * AreaEditor
 * @version 1.0
 * @license MIT
 */
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {  // UMD 兼容模式
        define([], factory);// AMD 支持
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();// CommonJS 支持
    } else {
        global.AreaEditor = factory();// 浏览器全局变量
    }
}(this, function () {
    'use strict';

    /**
     * 主构造函数
     * @param {HTMLElement|string} element Textarea元素或选择器
     * @param {Object} options 配置选项
     */
    function AreaEditor(element, options) {
        if (!(this instanceof AreaEditor)) { return new AreaEditor(element, options); }
        this.element = typeof element === 'string' ? document.querySelectorAll(element) : element;
        this.init();
    }

    // 初始化
    AreaEditor.prototype.init = function() {
        for(var _i = 0; _i < this.element.length; _i++){
            if (!this.element[_i]) {
                console.error('AreaEditor: Missing element');
                return;
            }
    
            if (this.element[_i].tagName !== 'TEXTAREA') {
                console.error('AreaEditor: The element must be a textarea');
                return;
            }
    
            this.indentType = this._detectFirstIndent(this.element[_i].value);  // 缩进类型
            this.tabChar = (this.indentType.type === 'tab') ? '\t' : Array(this.indentType.count + 1).join(' ');  // 缩进字符
            this.tabLength = this.indentType.count;  // 缩进字符的长度
            this.setupEvents(this.element[_i]);
        }
        
    };

    // 设置事件监听
    AreaEditor.prototype.setupEvents = function(element) {
        element.addEventListener('keydown', this.onKeyDown.bind(this));
    };

    // 按键事件处理
    AreaEditor.prototype.onKeyDown = function(e) {
        var start = e.target.selectionStart;
        var end = e.target.selectionEnd;
        var value = e.target.value;

        // 回车键处理
        if (e.key === 'Enter') {
            e.preventDefault();
            
            var lineStart = value.lastIndexOf('\n', start - 1) + 1;
            var currentLine = value.substring(lineStart, start);
            var indent = currentLine.match(/^\s*/)[0];
            var pairs = {
                '{': '}',
                '[': ']',
                '(': ')'
            };
            var lastChar = currentLine.trim().slice(-1);
            var nextChar = value.substring(start, start + 1);
            var newText;
            if (pairs[lastChar]) {  // 如果当前字符是开括号
                if (nextChar === pairs[lastChar]) {  // 下一个字符是闭括号
                    newText = '\n' + indent + this.tabChar + '\n' + indent;
                } else {
                    newText = '\n' + indent + this.tabChar;
                }
                e.target.value = value.substring(0, start) + newText + value.substring(end);
                e.target.selectionStart = e.target.selectionEnd = start + indent.length + 1 + this.tabLength;
            } else {
                newText = '\n' + indent;
                e.target.value = value.substring(0, start) + newText + value.substring(end);
                e.target.selectionStart = e.target.selectionEnd = start + newText.length;
            }
            return;
        }

        // 自动补全括号
        var autoPairs = {
            '{': '}',
            '[': ']',
            '(': ')',
            '"': '"',
            "'": "'",
            '`': '`'
        };
        if (['{', '(', '[', '"', "'", '`', ']', '}', ')'].includes(e.key) && start === end) {
            e.preventDefault();
            var pairChar = autoPairs[e.key];
            if (['"', "'", '`', ']', '}', ')'].includes(e.key) && e.target.value.charAt(start) === e.key) {  // 特殊处理符号（如果下一个字符已经是指定字符则不插入）
                e.target.selectionStart = this.selectionEnd = start + 1;
                return;
            }
            e.target.value = value.substring(0, start) + e.key + pairChar + value.substring(start);
            e.target.selectionStart = e.target.selectionEnd = start + 1;
        }

        // TAB 相关
        if (e.key === 'Tab') {
            e.preventDefault();
            if (start === end) {  // 光标未选中任何字符
                e.target.value = value.substring(0, start) + this.tabChar + value.substring(end);
                e.target.selectionStart = e.target.selectionEnd = start + this.tabLength;
                return;
            } else {
                var contentArr = value.split('\n');
                var contentArrOriginal = value.split('\n');
                var startLine = (value.substring(0, start).match(/\n/g) || []).length;
                var endLine = (value.substring(0, end).match(/\n/g) || []).length;
                if (event.shiftKey) {  // 如果按下了 shift（删去缩进）
                    for (var _i = startLine; _i <= endLine; _i++) {
                        contentArr[_i] = this._removeLeadingSpaces(contentArr[_i], this.tabLength);
                    }
                    e.target.value = contentArr.join('\n');
                    var lengthDiff = contentArrOriginal[startLine].length - contentArrOriginal[startLine].trimStart().length; // start 所在行有多少缩进
                    var moveLength = Math.min(this.tabLength, lengthDiff);
                    var limitLineNum = this._arrSum(contentArr, startLine); // 计算 start 能减小到的最小值，比如防止start在开始时是在第5行，在删去缩进后，变到了第四行
                    var startPoint = limitLineNum > start - moveLength - startLine ? limitLineNum + startLine : start - moveLength; // 兼容选择框起点选在了缩进处（也就是空格上）的情况
                    e.target.selectionStart = lengthDiff > 0 ? startPoint : start;
                    e.target.selectionEnd = end - (contentArrOriginal.join('\n').length - e.target.value.length);
                } else {  // 只按下了 tab（增加缩进）
                    for (var _i = startLine; _i <= endLine; _i++) {
                        contentArr[_i] = this.tabChar + contentArr[_i];
                    }
                    e.target.value = contentArr.join('\n');
                    e.target.selectionStart = start + this.tabLength;
                    e.target.selectionEnd = end + this.tabLength * (startLine === endLine ? 1 : endLine - startLine + 1);
                }
            }
        }

    };

    // 获取该文档的第一个缩进
    AreaEditor.prototype._detectFirstIndent = function(fileContent) {
        var lines = fileContent.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line.length > 0 && /^\s/.test(line)) {
            var indent = line.match(/^\s+/)[0];
            var type = indent.indexOf('\t') !== -1 ? 'tab' : 'space';
            var count = (type === 'tab') ? 1 : indent.length;
            return { type: type, count: count };
            }
        }
        return { type: 'space', count: 4 }; // 默认缩进是 4 个空格
    };

     // 删去文本字符串前面缩进部分的几个字符数量
    AreaEditor.prototype._removeLeadingSpaces = function(str, n) {
        var regex = new RegExp("^([ \\t]{0,".concat(n, "})"));
        return str.replace(regex, '');
    };

    // 此函数可计算字符串数组前 n 字符 length 之和
    AreaEditor.prototype._arrSum = function(a, n) {
        var s = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        return a.slice(0, n).map(function (x) {
            return s += x.length;
        }), s;
    };

    return AreaEditor;
}));
