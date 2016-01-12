# Appendix B. 参考卡片

下面的参考卡片提供了对于某些特定的脚本概念的一个_总结_. 之前我们已经对这里所提及的概念进行了详细的解释, 并且给出了使用的例子.

* * *

**表格 B-1\. 特殊的shell变量**

<colgroup><col><col></colgroup>
| 变量 | 含义 |
| --- | --- |
| `$0` | 脚本名字 |
| `$1` | 位置参数 #1 |
| `$2 - $9` | 位置参数 #2 - #9 |
| `${10}` | 位置参数 #10 |
| `$#` | 位置参数的个数 |
| `"$*"` | 所有的位置参数(作为单个字符串) * |
| `"$@"` | 所有的位置参数(每个都作为独立的字符串) |
| `${#*}` | 传递到脚本中的命令行参数的个数 |
| `${#@}` | 传递到脚本中的命令行参数的个数 |
| `$?` | 返回值 |
| `$$` | 脚本的进程ID(PID) |
| `$-` | 传递到脚本中的标志(使用_set_) |
| `$_` | 之前命令的最后一个参数 |
| `$!` | 运行在后台的最后一个作业的进程ID(PID) |

* * *

***** _必须被引用起来_, 否则默认为<span class="QUOTE">"`$@`"</span>.

* * *

**表格 B-2\. 测试操作: 二元比较**

<colgroup><col><col><col><col><col></colgroup>
| 操作 | 描述 | ----- | 操作 | 描述 |
| --- | --- | --- | --- | --- |
| 算术比较 | 字符串比较 |
| `-eq` | 等于 | `=` | 等于 |
 `==` | 等于 |
| `-ne` | 不等于 | `!=` | 不等于 |
| `-lt` | 小于 | `\<` | 小于 (ASCII) * |
| `-le` | 小于等于 |
| `-gt` | 大于 | `\>` | 大于 (ASCII) * |
| `-ge` | 大于等于 |
 `-z` | 字符串为空 |
 `-n` | 字符串不为空 |
| 算术比较 | 双括号(( ... ))结构 |
| `>` | 大于 |
| `>=` | 大于等于 |
| `<` | 小于 |
| `<=` | 小于等于 |

* * *

***** _如果在双中括号_ [[ ... ]] _测试结构中使用的话, 那么就不需要使用转义符_\_了._

* * *

**表格 B-3\. 文件类型的测试操作**

<colgroup><col><col><col><col><col></colgroup>
| 操作 | 测试条件 | ----- | 操作 | 测试条件 |
| --- | --- | --- | --- | --- |
| `-e` | 文件是否存在 | `-s` | 文件大小不为0 |
| `-f` | 是一个_标准_文件 |
| `-d` | 是一个_目录_ | `-r` | 文件具有_读_权限 |
| `-h` | 文件是一个_符号链接_ | `-w` | 文件具有_写_权限 |
| `-L` | 文件是一个_符号链接_ | `-x` | 文件具有_执行_权限 |
| `-b` | 文件是一个_块设备_ |
| `-c` | 文件是一个_字符设备_ | `-g` | 设置了_sgid_标记 |
| `-p` | 文件是一个_管道_ | `-u` | 设置了_suid_标记 |
| `-S` | 文件是一个[socket](devref1.md#SOCKETREF) | `-k` | 设置了<span class="QUOTE">"粘贴位"</span> |
| `-t` | 文件与一个_终端_相关联 |
| `-N` | 从这个文件最后一次被读取之后, 它被修改过 | `F1 -nt F2` | 文件F1比文件F2_新_ * |
| `-O` | 这个文件的宿主是你 | `F1 -ot F2` | 文件F1比文件F2_旧_ * |
| `-G` | 文件的_组id_与你所属的组相同 | `F1 -ef F2` | 文件F1和文件F2都是同一个文件的_硬链接_ * |
| `!` | <span class="QUOTE">"非"</span> (反转上边的测试结果) |

* * *

***** _二元_操作符(需要两个操作数).

* * *

**表格 B-4\. 参数替换和扩展**

<colgroup><col><col></colgroup>
| 表达式 | 含义 |
| --- | --- |
| `${var}` | 变量`var`的值, 与`$var`相同 |
| `${var-DEFAULT}` | 如果`var`没有被声明, 那么就以`$DEFAULT`作为其值 * |
| `${var:-DEFAULT}` | 如果`var`没有被声明, 或者其值为空, 那么就以`$DEFAULT`作为其值 * |
| `${var=DEFAULT}` | 如果`var`没有被声明, 那么就以`$DEFAULT`作为其值 * |
| `${var:=DEFAULT}` | 如果`var`没有被声明, 或者其值为空, 那么就以`$DEFAULT`作为其值 * |
| `${var+OTHER}` | 如果`var`声明了, 那么其值就是`$OTHER`, 否则就为null字符串 |
| `${var:+OTHER}` | 如果`var`被设置了, 那么其值就是`$OTHER`, 否则就为null字符串 |
| `${var?ERR_MSG}` | 如果`var`没被声明, 那么就打印`$ERR_MSG` * |
| `${var:?ERR_MSG}` | 如果`var`没被设置, 那么就打印`$ERR_MSG` * |
| `${!varprefix*}` | 匹配之前所有以`varprefix`开头进行声明的变量 |
| `${!varprefix@}` | 匹配之前所有以`varprefix`开头进行声明的变量 |

* * *

***** 当然, 如果变量`var`已经被设置的话, 那么其值就是`$var`.

* * *

**表格 B-5\. 字符串操作**

<colgroup><col><col></colgroup>
| 表达式 | 含义 |
| --- | --- |
| `${#string}` | `$string`的长度 |
| `${string:position}` | 在`$string`中, 从位置`$position`开始提取子串 |
| `${string:position:length}` | 在`$string`中, 从位置`$position`开始提取长度为`$length`的子串 |
| `${string#substring}` | 从变量`$string`的开头, 删除最短匹配`$substring`的子串 |
| `${string##substring}` | 从变量`$string`的开头, 删除最长匹配`$substring`的子串 |
| `${string%substring}` | 从变量`$string`的结尾, 删除最短匹配`$substring`的子串 |
| `${string%%substring}` | 从变量`$string`的结尾, 删除最长匹配`$substring`的子串 |
| `${string/substring/replacement}` | 使用`$replacement`, 来代替第一个匹配的`$substring` |
| `${string//substring/replacement}` | 使用`$replacement`, 代替_所有_匹配的`$substring` |
| `${string/#substring/replacement}` | 如果`$string`的_前缀_匹配`$substring`, 那么就用`$replacement`来代替匹配到的`$substring` |
| `${string/%substring/replacement}` | 如果`$string`的_后缀_匹配`$substring`, 那么就用`$replacement`来代替匹配到的`$substring` |
| `expr match "$string" '$substring'` | 匹配`$string`开头的`$substring`*的长度 |
| `expr "$string" : '$substring'` | 匹配`$string`开头的`$substring`*的长度 |
| `expr index "$string" $substring` | 在`$string`中匹配到的`$substring`的第一个字符出现的位置 |
| `expr substr $string $position $length` | 在`$string`中从位置`$position`开始提取长度为`$length`的子串 |
| `expr match "$string" '\($substring\)'` | 从`$string`的开头位置提取`$substring`* |
| `expr "$string" : '\($substring\)'` | 从`$string`的开头位置提取`$substring`* |
| `expr match "$string" '.*\($substring\)'` | 从`$string`的结尾提取`$substring`* |
| `expr "$string" : '.*\($substring\)'` | 从`$string`的结尾提取`$substring`* |

* * *

***** `$substring`是一个_正则表达式_.

* * *

**表格 B-6\. 一些结构的汇总**

<colgroup><col><col></colgroup>
| 表达式 | 解释 |
| --- | --- |
| _中括号_ |
| `if [ CONDITION ]` | 测试结构 |
| `if [[ CONDITION ]]` | 扩展的测试结构 |
| `Array[1]=element1` | 数组初始化 |
| `[a-z]` | [正则表达式](regexp.md#REGEXREF)的字符范围 |
| _大括号_ |
| `${variable}` | 参数替换 |
| `${!variable}` | [间接变量引用](ivr.md#IVRREF) |
| `{ command1; command2; . . . commandN; }` | 代码块 |
| `{string1,string2,string3,...}` | 大括号扩展 |
| _圆括号_ |
| `( command1; command2 )` | [子shell](subshells.md#SUBSHELLSREF)中执行的命令组 |
| `Array=(element1 element2 element3)` | 数组初始化 |
| `result=$(COMMAND)` | 在子shell中执行命令, 并将结果赋值给变量 |
| `>(COMMAND)` | [进程替换](process-sub.md#PROCESSSUBREF) |
| `<(COMMAND)` | 进程替换 |
| _双圆括号_ |
| `(( var = 78 ))` | 整型运算 |
| `var=$(( 20 + 5 ))` | 整型运算, 并将结果赋值给变量 |
| _引号_ |
| `"$variable"` | "弱"引用 |
| `'string'` | "强"引用 |
| _后置引用_ |
| `result=`COMMAND`` | 在子shell中运行命令, 并将结果赋值给变量 |

* * *