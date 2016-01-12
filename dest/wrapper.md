# 33.2\. Shell包装

<span class="QUOTE">"包装"</span>脚本指的是内嵌系统命令或工具的脚本, 并且这种脚本保留了传递给命令的一系列参数. [[1]](#FTN.AEN15634) 因为包装脚本中包含了许多带有参数的命令, 使它能够完成特定的目的, 所以这样就大大简化了命令行的输入. 这对于[sed](sedawk.md#SEDREF)和[awk](awk.md#AWKREF)命令特别有用.

**sed**或 **awk**脚本通常都是在命令行中被调用的, 使用的形式一般为<kbd class="USERINPUT">sed -e <tt class="REPLACEABLE">_'commands'_</tt></kbd> 或<kbd class="USERINPUT">awk <tt class="REPLACEABLE">_'commands'_</tt></kbd>. 将这样的脚本(译者注: 指的是包装了sed和awk的脚本)嵌入到Bash脚本中将会使调用更加简单, 并且还可以<span class="QUOTE">"重复利用"</span>. 也可以将**sed**与**awk**的功能结合起来使用, 比如, 可以将一系列**sed**命令的输出通过[管道](special-chars.md#PIPEREF)传递给**awk**. 还可以保存为可执行文件, 这样你就可以重复的调用它了, 如果功能不满足, 你还可以修改它, 这么做可以让省去每次都在命令行上输入命令的麻烦.

* * *

**例子 33-1\. **shell包装****

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 # 这个简单的脚本可以把文件中所有的空行删除. 
  4 # 没做参数检查. 
  5 #
  6 # 你或许想添加如下代码: 
  7 #
  8 # E_NOARGS=65
  9 # if [ -z "$1" ]
 10 # then
 11 #  echo "Usage: `basename $0` target-file"
 12 #  exit $E_NOARGS
 13 # fi
 14 
 15 
 16 # 这个脚本调用起来的效果, 
 17 # 等价于从命令行上调用: 
 18 # sed -e '/^$/d' filename. 
 19 
 20 sed -e /^$/d "$1"
 21 #  '-e'意味着后边跟的是"编辑"命令. (在这里是可选的). 
 22 #  '^'匹配行首, '/pre>匹配行尾. 
 23 #  这条语句用来匹配行首与行尾之间什么都没有的行, 
 24 #+ 即空白行. 
 25 #  'd'为删除命令. 
 26 
 27 #  将命令行参数引用起来, 
 28 #+ 就意味着可以在文件名中使用空白字符或者特殊字符. 
 29 
 30 #  注意, 这个脚本其实并不能真正的修改目标文件. 
 31 #  如果你想保存修改, 可以将它的输出重定向. 
 32 
 33 exit 0</pre>

 |

* * *

* * *

**例子 33-2\. 稍微复杂一些的**shell包装****

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 #  "替换", 这个脚本的用途: 
  4 #+ 将一个文件中的某个字符串(或匹配模式), 替换为另一个字符串(或匹配模式), 
  5 #+ 比如, "subst Smith Jones letter.txt".
  6 
  7 ARGS=3         # 这个脚本需要3个参数. 
  8 E_BADARGS=65   # 传递给脚本的参数个数不对. 
  9 
 10 if [ $# -ne "$ARGS" ]
 11 # 测试脚本的参数个数(这是个好办法). 
 12 then
 13   echo "Usage: `basename $0` old-pattern new-pattern filename"
 14   exit $E_BADARGS
 15 fi
 16 
 17 old_pattern=$1
 18 new_pattern=$2
 19 
 20 if [ -f "$3" ]
 21 then
 22     file_name=$3
 23 else
 24     echo "File \"$3\" does not exist."
 25     exit $E_BADARGS
 26 fi
 27 
 28 
 29 #  下面是实现功能的代码. 
 30 
 31 # -----------------------------------------------
 32 sed -e "s/$old_pattern/$new_pattern/g" $file_name
 33 # -----------------------------------------------
 34 
 35 #  's'在sed中是替换命令, 
 36 #+ /pattern/表示匹配模式. 
 37 #  "g", 即全局标志, 用来自动替换掉每行中
 38 #+ 出现的全部$old_pattern模式, 而不仅仅替换掉第一个匹配.
 39 #  如果想深入了解, 可以参考'sed'命令的相关书籍. 
 40 
 41 exit 0    # 成功调用脚本, 将会返回0\. </pre>

 |

* * *

* * *

**例子 33-3\. 一个通用的**shell包装**, 用来写日志文件**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 #  通用的shell包装, 
  3 #+ 执行一个操作, 然后把所作的操作写入到日志文件中. 
  4 
  5 # 需要设置如下两个变量. 
  6 OPERATION=
  7 #         可以是一个复杂的命令链, 
  8 #+        比如awk脚本或者一个管道 . . .
  9 LOGFILE=
 10 #         命令行参数, 不管怎么样, 操作一般都需要参数. (译者注: 这行解释的是下面的OPTIONS变量, 不是LOGFILE.)
 11 
 12 
 13 OPTIONS="$@"
 14 
 15 
 16 # 记录下来. 
 17 echo "`date` + `whoami` + $OPERATION "$@"" >> $LOGFILE
 18 # 现在, 执行操作. 
 19 exec $OPERATION "$@"
 20 
 21 # 必须在操作执行之前, 记录到日志文件中. 
 22 # 为什么? </pre>

 |

* * *

* * *

**例子 33-4\. 包装awd脚本的**shell包装****

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # pr-ascii.sh: 打印ASCII码的字符表. 
  3 
  4 START=33   # 可打印的ASCII字符的范围(十进制). 
  5 END=125
  6 
  7 echo " Decimal   Hex     Character"   # 表头. 
  8 echo " -------   ---     ---------"
  9 
 10 for ((i=START; i<=END; i++))
 11 do
 12   echo $i | awk '{printf("  %3d       %2x         %c\n", $1, $1, $1)}'
 13 # 在这种上下文中, 不会运行Bash内建的printf命令: 
 14 #     printf "%c" "$i"
 15 done
 16 
 17 exit 0
 18 
 19 
 20 #  十进制   16进制     字符
 21 #  -------  ------   ---------
 22 #    33       21         !
 23 #    34       22         "
 24 #    35       23         #
 25 #    36       24         $
 26 #
 27 #    . . .
 28 #
 29 #   122       7a         z
 30 #   123       7b         {
 31 #   124       7c         |
 32 #   125       7d         }
 33 
 34 
 35 #  将脚本的输出重定向到一个文件中, 
 36 #+ 或者通过管道传递给"more":  sh pr-asc.sh | more</pre>

 |

* * *

* * *

**例子 33-5\. 另一个包装awd脚本的**shell包装****

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 # 给目标文件添加(由数字组成的)指定的一列. 
  4 
  5 ARGS=2
  6 E_WRONGARGS=65
  7 
  8 if [ $# -ne "$ARGS" ] # 检查命令行参数个数是否正确. 
  9 then
 10    echo "Usage: `basename $0` filename column-number"
 11    exit $E_WRONGARGS
 12 fi
 13 
 14 filename=$1
 15 column_number=$2
 16 
 17 #  将shell变量传递给脚本的awk部分, 需要一点小技巧. 
 18 #  一种办法是, 将awk脚本中的Bash脚本变量, 
 19 #+ 强引用起来. 
 20 #     /pre>$BASH_SCRIPT_VAR'
 21 #      ^                ^
 22 #  在下面的内嵌awd脚本中, 就会这么做. 
 23 #  请参考awk的相关文档来了解更多的细节. 
 24 
 25 # 多行awk脚本的调用格式为:  awk ' ..... '
 26 
 27 
 28 # 开始awk脚本. 
 29 # -----------------------------
 30 awk '
 31 
 32 { total += /pre>"${column_number}"'
 33 }
 34 END {
 35      print total
 36 }     
 37 
 38 ' "$filename"
 39 # -----------------------------
 40 # 结束awk脚本. 
 41 
 42 
 43 #   将shell变量传递给内嵌awk脚本可能是不安全的, 
 44 #+  所以Stephane Chazelas提出了下边这种替代方法: 
 45 #   ---------------------------------------
 46 #   awk -v column_number="$column_number" '
 47 #   { total += $column_number
 48 #   }
 49 #   END {
 50 #       print total
 51 #   }' "$filename"
 52 #   ---------------------------------------
 53 
 54 
 55 exit 0</pre>

 |

* * *

如果那些脚本需要的是一个全功能(多合一)的工具, 一把瑞士军刀, 那么只能使用Perl了. Perl兼顾**sed**和**awk**的能力, 并且包含了**C**的很大的一个子集, 用于引导. 它是模块化的, 并且包含从面向对象编程到厨房水槽的所有功能(译者注: 就是表示Perl无所不能). 小段的Perl脚本可以内嵌到shell脚本中, 以至于有人声称Perl可以完全代替shell脚本(不过本文作者对此持怀疑态度).

* * *

**例子 33-6\. 将Perl嵌入到**Bash**脚本中**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 # Shell命令可以放到Perl脚本的前面. 
  4 echo "This precedes the embedded Perl script within \"$0\"."
  5 echo "==============================================================="
  6 
  7 perl -e 'print "This is an embedded Perl script.\n";'
  8 # 类似于sed, Perl也可以使用"-e"选项. 
  9 
 10 echo "==============================================================="
 11 echo "However, the script may also contain shell and system commands."
 12 
 13 exit 0</pre>

 |

* * *

甚至可以将Bash脚本和Perl脚本放到同一个文件中. 这依赖于如何调用这个脚本, 或者执行Bash部分, 或者执行Perl部分.

* * *

**例子 33-7\. 将Bash和Perl脚本写到同一个文件中**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # bashandperl.sh
  3 
  4 echo "Greetings from the Bash part of the script."
  5 # 这里可以放置更多的Bash命令. 
  6 
  7 exit 0
  8 # 脚本的Bash部分结束. 
  9 
 10 # =======================================================
 11 
 12 #!/usr/bin/perl
 13 # 脚本的这部分必须使用-x选项来调用. 
 14 
 15 print "Greetings from the Perl part of the script.\n";
 16 # 这里可以放置更多的Perl命令. 
 17 
 18 # 脚本的Perl部分结束. </pre>

 |

* * *

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">bash bashandperl.sh</kbd>
<samp class="COMPUTEROUTPUT">Greetings from the Bash part of the script.</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">perl -x bashandperl.sh</kbd>
<samp class="COMPUTEROUTPUT">Greetings from the Perl part of the script.</samp>
	      </pre>

 |

### 注意事项

| [[1]](wrapper.md#AEN15634) | 

事实上, Linux中相当一部分工具都是shell包装脚本. 比如<tt class="FILENAME">/usr/bin/pdf2ps</tt>, <tt class="FILENAME">/usr/bin/batch</tt>, 和<tt class="FILENAME">/usr/X11R6/bin/xmkmf</tt>.

 |