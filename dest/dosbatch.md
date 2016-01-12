# Appendix L. 将DOS批处理文件转换为Shell脚本

相当多的在PC上学习脚本的程序员都在运行DOS. 事实上, 残废的DOS批处理文件语言还是可以编写出一些比较强大的脚本来的, 虽然它们一般都需要借助于外部的工具. 所以说, 某些时候, 我们还是需要将老式的DOS批处理文件转换为UNIX shell脚本. 一般来说, 做这种事情并不困难, 因为DOS批处理文件操作不过是等价的shell脚本的一个受限子集.

* * *

**表格 L-1\. 批处理文件关键字 / 变量 / 操作符, 和等价的shell符号**

<colgroup><col><col><col></colgroup>
| 批处理文件操作符 | Shell脚本等价符号 | 含义 |
| --- | --- | --- |
| `%` | $ | 命令行参数前缀 |
| `/` | - | 命令选项标记 |
| `\` | / | 目录路径分隔符 |
| `==` | = | (等于)字符串比较测试 |
| `!==!` | != | (不等)字符串比较测试 |
| `|` | | | 管道 |
| `@` | set `+v` | 不打印当前命令 |
| `*` | * | 文件名<span class="QUOTE">"通配符"</span> |
| `>` | > | 文件重定向(覆盖) |
| `>>` | >> | 文件重定向(附加) |
| `<` | < | 重定向<tt class="FILENAME">stdin</tt> |
| `%VAR%` | $VAR | 环境变量 |
| `REM` | # | 注释 |
| `NOT` | ! | 取反 |
| `NUL` | <tt class="FILENAME">/dev/null</tt> | <span class="QUOTE">"黑洞"</span>用来阻止命令输出 |
| `ECHO` | echo | 打印(Bash中有更多选项) |
| `ECHO.` | echo | 打印空行 |
| `ECHO OFF` | set `+v` | 不打印后续的命令 |
| `FOR %%VAR IN (LIST) DO` | for var in [list]; do | <span class="QUOTE">"for"</span>循环 |
| `:LABEL` | 没有等价物(多余) | 标签 |
| `GOTO` | 没有等价物(使用函数) | 跳转到脚本的另一个位置 |
| `PAUSE` | sleep | 暂停或等待一段时间 |
| `CHOICE` | case or select | 菜单选择 |
| `IF` | if | if条件语句 |
| `IF EXIST <tt class="REPLACEABLE">_FILENAME_</tt>` | if [ -e filename ] | 测试文件是否存在 |
| `IF !%N==!` | if [ -z "$N" ] | 参数<span class="QUOTE">"N"</span>是否存在 |
| `CALL` | source命令或.(点操作符) | <span class="QUOTE">"include"</span>另一个脚本 |
| `COMMAND /C` | source命令或.(点操作符) | <span class="QUOTE">"include"</span>另一个脚本(与CALL相同) |
| `SET` | export | 设置一个环境变量 |
| `SHIFT` | shift | 左移命令行参数列表 |
| `SGN` | -lt或-gt | (整形)符号 |
| `ERRORLEVEL` | $? | 退出状态 |
| `CON` | <tt class="FILENAME">stdin</tt> | <span class="QUOTE">"控制台"</span>(<tt class="FILENAME">stdin</tt>) |
| `PRN` | <tt class="FILENAME">/dev/lp0</tt> | (一般的)打印设备 |
| `LPT1` | <tt class="FILENAME">/dev/lp0</tt> | 第一个打印设备 |
| `COM1` | <tt class="FILENAME">/dev/ttyS0</tt> | 第一个串口 |

* * *

批处理文件一般都包含DOS命令. 我们必须把它转换为UNIX的等价命令, 这样我们才能把批处理文件转换为shell脚本文件.

* * *

**表格 L-2\. DOS命令与UNIX的等价命令**

<colgroup><col><col><col></colgroup>
| DOS命令 | UNIX等价命令 | 效果 |
| --- | --- | --- |
| `ASSIGN` | ln | 链接文件或目录 |
| `ATTRIB` | chmod | 修改文件权限 |
| `CD` | cd | 更换目录 |
| `CHDIR` | cd | 更换目录 |
| `CLS` | clear | 清屏 |
| `COMP` | diff, comm, cmp | 文件比较 |
| `COPY` | cp | 文件拷贝 |
| `Ctl-C` | Ctl-C | 中断(信号) |
| `Ctl-Z` | Ctl-D | EOF(文件结束) |
| `DEL` | rm | 删除文件 |
| `DELTREE` | rm -rf | 递归删除目录 |
| `DIR` | ls -l | 列出目录内容 |
| `ERASE` | rm | 删除文件 |
| `EXIT` | exit | 退出当前进程 |
| `FC` | comm, cmp | 文件比较 |
| `FIND` | grep | 在文件中查找字符串 |
| `MD` | mkdir | 新建目录 |
| `MKDIR` | mkdir | 新建目录 |
| `MORE` | more | 分页显示文本文件 |
| `MOVE` | mv | 移动文件 |
| `PATH` | $PATH | 可执行文件的路径 |
| `REN` | mv | 重命名(移动) |
| `RENAME` | mv | 重命名(移动) |
| `RD` | rmdir | 删除目录 |
| `RMDIR` | rmdir | 删除目录 |
| `SORT` | sort | 排序文件 |
| `TIME` | date | 显示系统时间 |
| `TYPE` | cat | 将文件输出到<tt class="FILENAME">stdout</tt> |
| `XCOPY` | cp | (扩展的)文件拷贝 |

* * *

| ![Note](./images/note.gif) | 

事实上, 几乎所有的UNIX和shell操作符, 还有命令都有许多的选项, 对比DOS和批处理文件来说, 它们要强大的多. 许多DOS批处理文件都需要依靠辅助工具, 比如**ask.com**, 这是一个比[read](internal.md#READREF)命令差很多的类似副本.

DOS对于文件名[通配符扩展](globbingref.md)支持的非常有限, 并且很不完整, 仅仅识别<span class="TOKEN">*</span>和<span class="TOKEN">?</span>.

 |

将DOS批处理文件转换为sehll脚本, 通常是一件很简单的事情, 而且转换的结果通常都比原始的批处理文件好.

* * *

**例子 L-1\. VIEWDATA.BAT: DOS批处理文件**

| 

<pre class="PROGRAMLISTING">  1 REM VIEWDATA
  2 
  3 REM 灵感来自于例子"DOS POWERTOOLS"
  4 REM                           PAUL SOMERSON编写
  5 
  6 
  7 @ECHO OFF
  8 
  9 IF !%1==! GOTO VIEWDATA
 10 REM  如果没有命令行参数...
 11 FIND "%1" C:\BOZO\BOOKLIST.TXT
 12 GOTO EXIT0
 13 REM  打印出字符串匹配的行, 然后退出. 
 14 
 15 :VIEWDATA
 16 TYPE C:\BOZO\BOOKLIST.TXT | MORE
 17 REM  显示整个文件, 一次一页. 
 18 
 19 :EXIT0</pre>

 |

* * *

转换脚本作了一些改进.

* * *

**例子 L-2\. viewdata.sh: 转换自VIEWDATA.BAT的shell脚本**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # viewdata.sh
  3 # 转换自VIEWDATA.BAT的shell脚本. 
  4 
  5 DATAFILE=/home/bozo/datafiles/book-collection.data
  6 ARGNO=1
  7 
  8 # @ECHO OFF                 这个命令在这里就不需要了. 
  9 
 10 if [ $# -lt "$ARGNO" ]    # IF !%1==! GOTO VIEWDATA
 11 then
 12   less $DATAFILE          # TYPE C:\MYDIR\BOOKLIST.TXT | MORE
 13 else
 14   grep "$1" $DATAFILE     # FIND "%1" C:\MYDIR\BOOKLIST.TXT
 15 fi  
 16 
 17 exit 0                    # :EXIT0
 18 
 19 #  跳转, 标签, 还有其他一些小手段, 在shell脚本中就不需要了. 
 20 #  我们可以说, 转换后的脚本比原始批处理文件好的多, 
 21 #+ 它更短, 看起来更整洁, 更优雅. </pre>

 |

* * *

Ted Davis的[Shell Scripts on the PC](http://www.maem.umr.edu/~batch/)站点上有许多关于老式的批处理文件编程的教程, 他使用的某些独创性的技术, 和shell脚本有异曲同工之妙.