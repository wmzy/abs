# 2\. 带着一个Sha-Bang出发(Sha-Bang指的是#!)

 _Shell程序设计是1950年的光盘机 . . ._ |
 _Larry Wall_ |

*   **目录**
*   2.1\. [调用一个脚本](invoking.md)
*   2.2\. [初步的练习](prelimexer.md)

在一个最简单的例子中, 一个shell脚本其实就是将一堆系统命令列在一个文件中. 它的最基本的用处就是, 在你每次输入这些特定顺序的命令时可以少敲一些字.

* * *

**例子 2-1\. **清除**: 清除/var/log下的log文件**

| 

<pre class="PROGRAMLISTING">  1 # 清除
  2 # 当然要使用root身份来运行这个脚本.
  3 
  4 cd /var/log
  5 cat /dev/null > messages
  6 cat /dev/null > wtmp
  7 echo "Logs cleaned up."</pre>

 |

* * *

这根本就没什么稀奇的, 只不过是命令的堆积, 来让从console或者_xterm_中一个一个的输入命令更方便一些. 好处就是把所有命令都放在一个脚本中,不用每次都敲它们. 这样的话, 这个脚本就成为了一个_工具_, 对于特定的应用来说,这个脚本就很容易被修改或定制.

* * *

**例子 2-2\. **清除**:一个改良的清除脚本**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # 一个Bash脚本的正确的开头部分.
  3 
  4 # Cleanup, 版本 2
  5 
  6 # 当然要使用root身份来运行.
  7 # 在此处插入代码,来打印错误消息,并且在不是root身份的时候退出.
  8 
  9 LOG_DIR=/var/log
 10 # 如果使用变量,当然比把代码写死的好.
 11 cd $LOG_DIR
 12 
 13 cat /dev/null > messages
 14 cat /dev/null > wtmp
 15 
 16 
 17 echo "Logs cleaned up."
 18 
 19 exit # 这个命令是一种正确并且合适的退出脚本的方法.</pre>

 |

* * *

现在,让我们看一下一个真正意义的脚本.而且我们可以走得更远 . . .

* * *

**例子 2-3\. **清除**: 一个增强的和广义的删除logfile的脚本**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # 清除, 版本 3
  3 
  4 #  警告:
  5 #  -----
  6 #  这个脚本有好多特征,
  7 #+ 这些特征是在后边章节进行解释的.
  8 #  大概是进行到本书的一半的时候,
  9 #+ 你就会觉得它没有什么神秘的了.
 10 
 11 
 12 
 13 LOG_DIR=/var/log
 14 ROOT_UID=0     # $UID为0的时候,用户才具有root用户的权限
 15 LINES=50       # 默认的保存行数
 16 E_XCD=66       # 不能修改目录?
 17 E_NOTROOT=67   # 非root用户将以error退出
 18 
 19 
 20 # 当然要使用root用户来运行.
 21 if [ "$UID" -ne "$ROOT_UID" ]
 22 then
 23   echo "Must be root to run this script."
 24   exit $E_NOTROOT
 25 fi  
 26 
 27 if [ -n "$1" ]
 28 # 测试是否有命令行参数(非空).
 29 then
 30   lines=$1
 31 else  
 32   lines=$LINES # 默认,如果不在命令行中指定.
 33 fi  
 34 
 35 
 36 #  Stephane Chazelas 建议使用下边
 37 #+ 的更好方法来检测命令行参数.
 38 #+ 但对于这章来说还是有点超前.
 39 #
 40 #    E_WRONGARGS=65  # 非数值参数(错误的参数格式)
 41 #
 42 #    case "$1" in
 43 #    ""      ) lines=50;;
 44 #    *[!0-9]*) echo "Usage: `basename $0` file-to-cleanup"; exit $E_WRONGARGS;;
 45 #    *       ) lines=$1;;
 46 #    esac
 47 #
 48 #* 直到"Loops"的章节才会对上边的内容进行详细的描述.
 49 
 50 
 51 cd $LOG_DIR
 52 
 53 if [ `pwd` != "$LOG_DIR" ]  # 或者	if[ "$PWD" != "$LOG_DIR" ]
 54                             # 不在 /var/log中?
 55 then
 56   echo "Can't change to $LOG_DIR."
 57   exit $E_XCD
 58 fi  # 在处理log file之前,再确认一遍当前目录是否正确.
 59 
 60 # 更有效率的做法是:
 61 #
 62 # cd /var/log || {
 63 #   echo "Cannot change to necessary directory." >&2
 64 #   exit $E_XCD;
 65 # }
 66 
 67 
 68 
 69 
 70 tail -$lines messages > mesg.temp # 保存log file消息的最后部分.
 71 mv mesg.temp messages             # 变为新的log目录.
 72 
 73 
 74 # cat /dev/null > messages
 75 #* 不再需要了,使用上边的方法更安全.
 76 
 77 cat /dev/null > wtmp  #  ': > wtmp' 和 '> wtmp'具有相同的作用
 78 echo "Logs cleaned up."
 79 
 80 exit 0
 81 #  退出之前返回0,
 82 #+ 返回0表示成功.</pre>

 |

* * *

因为你可能希望将系统log全部消灭, 这个版本留下了log消息最后的部分. 你将不断地找到新的方法来完善这个脚本,并提高效率.

要注意,在每个脚本的开头都使用 _sha-bang_ ( <span class="TOKEN">#!</span>), 这意味着告诉你的系统这个文件的执行需要指定一个解释器. <span class="TOKEN">#!</span> 实际上是一个2字节的 [[1]](#FTN.AEN206) _魔法数字_, 这是指定一个文件类型的特殊标记, 换句话说, 在这种情况下, 指的就是一个可执行的脚本(键入<kbd class="USERINPUT">man magic</kbd>来获得关于这个迷人话题的更多详细信息). 在_sha-bang_之后接着是一个_路径名_. 这个路径名就是解释脚本中命令的解释程序所在的路径, 可能是一个shell, 也可能是一个程序语言, 也可能是一个工具包中的命令程序. 这个解释程序从头开始解释并且执行脚本中的命令(从_sha-bang_行下边的一行开始), 忽略注释. [[2]](#FTN.AEN217)

| 

<pre class="PROGRAMLISTING">  1 #!/bin/sh
  2 #!/bin/bash
  3 #!/usr/bin/perl
  4 #!/usr/bin/tcl
  5 #!/bin/sed -f
  6 #!/usr/awk -f</pre>

 |

上边每一个脚本头的行都指定了一个不同的命令解释器, 如果是<tt class="FILENAME">/bin/sh</tt>, 那么就是默认shell (在Linux系统上默认就是**bash**), 否则的话就是其他解释器. [[3]](#FTN.AEN233) 使用<kbd class="USERINPUT">#!/bin/sh</kbd>, 因为大多数的商业UNIX系统上都是以Bourne shell作为默认shell, 这样可以使脚本[移植](portabilityissues.md)到non-Linux的机器上, 虽然这将会牺牲Bash一些独特的特征. 但是脚本将与<acronym class="ACRONYM">POSIX</acronym> [[4]](#FTN.AEN246) 的**sh**标准相一致.

注意<span class="QUOTE">"sha-bang"</span>后边给出的路径名必须是正确的, 否则将会出现一个错误消息 -- 通常是<span class="QUOTE">"Command not found"</span> -- 这将是你运行这个脚本时所得到的唯一结果.

当然<span class="TOKEN">#!</span>也可以被忽略, 不过这样你的脚本文件就只能是一些命令的集合, 不能够使用shell内建的指令了. 上边第二个例子必须以<span class="TOKEN">#!</span>开头, 是因为分配变量了, <kbd class="USERINPUT">lines=50</kbd>, 这就使用了一个shell特有的用法. [[5]](#FTN.AEN263) 再次提醒你<kbd class="USERINPUT">#!/bin/sh</kbd>将会调用默认的shell解释器, 在Linux机器上默认是<tt class="FILENAME">/bin/bash</tt>.

| ![Tip](./images/tip.gif) | 

这个例子鼓励你使用模块化的方式来编写脚本. 平时也要多注意收集一些比较有代表性的 <span class="QUOTE">"模版"</span>代码, 这些零碎的代码可能用在你将来编写的脚本中. 最后你就能生成一个很好的可扩展的例程库. 以下边这个脚本为例, 这个脚本用来测试脚本被调用的参数数量是否正确.

| 

<pre class="PROGRAMLISTING">  1 E_WRONG_ARGS=65
  2 script_parameters="-a -h -m -z"
  3 #                  -a = all, -h = help, 等等.
  4 
  5 if [ $# -ne $Number_of_expected_args ]
  6 then
  7   echo "Usage: `basename $0` $script_parameters"
  8   # `basename $0` 是这个脚本的文件名.
  9   exit $E_WRONG_ARGS
 10 fi</pre>

 |

大多数情况下,你需要编写一个脚本来执行一个特定的任务, 在本章中第一个脚本就是一个这样的例子, 然后你会修改它来完成一个不同的, 但比较相似的任务. 使用变量来代替写死(<span class="QUOTE">"硬编码(hard-wired)"</span>)的常量, 就是一个很好的习惯, 将重复的代码放到一个[函数](functions.md#FUNCTIONREF)中,也是一种好习惯.

 |

### 注意事项

| [[1]](sha-bang.md#AEN206) | 

那些具有UNIX味道的脚本(基于4.2BSD)需要一个4字节的魔法数字, 在<span class="TOKEN">!</span>后边需要一个空格 -- <kbd class="USERINPUT">#! /bin/sh</kbd>.

 |
| [[2]](sha-bang.md#AEN217) | 

脚本中的<span class="TOKEN">#!</span>所在的行的最重要的任务就是告诉系统本脚本是使用哪种命令解释器. (**sh**或者**bash**). 因为这行是以<span class="TOKEN">#</span>作为行的开头, 当命令解释器执行这个脚本的时候,会把它作为一个注释行. 当然, 在这之前, 这行语句已经完成了它的任务, 就是调用命令解释器.

如果脚本中还包含有 _其他_的<span class="TOKEN">#!</span>行, 那么**bash**将会把它看成是一个一般的注释行.

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 echo "Part 1 of script."
  4 a=1
  5 
  6 #!/bin/bash
  7 # 这将*不会*启动一个新脚本.
  8 
  9 echo "Part 2 of script."
 10 echo $a  # Value of $a stays at 1.</pre>

 |

 |
| [[3]](sha-bang.md#AEN233) | 

这里可以玩一些小技巧.

| 

<pre class="PROGRAMLISTING">  1 #!/bin/rm
  2 # 自删除脚本.
  3 
  4 # 当你运行这个脚本时, 基本上什么都不会发生. . . 当然这个文件消失不见了. 
  5 
  6 WHATEVER=65
  7 
  8 echo "This line will never print (betcha!)."
  9 
 10 exit $WHATEVER  # 不要紧, 脚本是不会在这退出的. </pre>

 |

当然,你还可以试试在一个<tt class="FILENAME">README</tt>文件的开头加上一个<kbd class="USERINPUT">#!/bin/more</kbd>, 并让它具有执行权限. 结果将是文档自动列出自己的内容. (一个使用[cat](basic.md#CATREF)命令的 [here document](here-docs.md#HEREDOCREF)在这里可能是一个更好的选择, -- 参见[例子 17-3](here-docs.md#EX71)).

 |
| [[4]](sha-bang.md#AEN246) | 

**P**ortable **O**perating **S**ystem _I_nterface(可移植的操作系统接口), 标准化类UNI**X**操作系统的一种尝试. POSIX规范可以在[Open Group site](http://www.opengroup.org/onlinepubs/007904975/toc.htm)中进行查阅.

 |
| [[5]](sha-bang.md#AEN263) | 

如果Bash是你的默认shell, 那么脚本的开头也不用非得写上<span class="TOKEN">#!</span>. 但是如果你使用不同的shell来开启一个脚本的话, 比如_tcsh_, 那么你就_必须_需要<span class="TOKEN">#!</span>了.

 |