# 12.7\. 终端控制命令

**影响控制台或终端的命令**

*   **tput**
*   初始化终端或者从<tt class="FILENAME">terminfo</tt>数据中取得终端信息. 这个命令有许多选项, 每个选项都允许特定操作. **tput clear**与后边所介绍的**clear**命令等价, **tput reset**与后边所介绍的**reset**命令等价, **tput sgr0**可以复位终端, 但是并不清除屏幕.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">tput longname</kbd>
    <samp class="COMPUTEROUTPUT">xterm terminal emulator (XFree86 4.0 Window System)</samp>
    	      </pre>

     |

    使用**tput cup X Y**将会把光标移动到当前终端的(X,Y)坐标上, 使用这个命令之前一般都要先用**clear**命令清屏.

    注意: [stty](system.md#STTYREF)提供了一个更强大的命令专门用来设置如何控制终端.

*   **infocmp**
*   这个命令会打印出大量当前终端的信息. 事实上它是引用了_terminfo_数据库的内容.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">infocmp</kbd>
    <samp class="COMPUTEROUTPUT">#       通过infocmp显示出来, 内容都来自于文件:
     /usr/share/terminfo/r/rxvt
     rxvt|rxvt terminal emulator (X Window System), 
             am, bce, eo, km, mir, msgr, xenl, xon, 
             colors#8, cols#80, it#8, lines#24, pairs#64, 
             acsc=``aaffggjjkkllmmnnooppqqrrssttuuvvwwxxyyzz{{||}}~~, 
             bel=^G, blink=\E[5m, bold=\E[1m,
             civis=\E[?25l, 
             clear=\E[H\E[2J, cnorm=\E[?25h, cr=^M, 
             ...</samp>
    	      </pre>

     |

*   **reset**
*   复位终端参数并且清除屏幕. 与**clear**命令一样, 光标和提示符将会重新出现在终端的左上角.

*   **clear**
*   **clear**命令只不过是简单的清除控制台或者_xterm_的屏幕. 光标和提示符将会重新出现在屏幕或者xterm window的左上角. 这个命令既可以用在命令行中也可以用在脚本中. 请参考[例子 10-25](testbranch.md#EX30).

*   **script**
*   这个工具将会记录(保存到一个文件中)所有的用户按键信息(在控制台下的或在xterm window下的按键信息). 这其实就是创建了一个会话记录.