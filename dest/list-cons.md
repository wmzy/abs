# 25\. 列表结构

<span class="QUOTE">"与列表"</span>和<span class="QUOTE">"或列表"</span>结构能够提供一种手段, 这种手段能够用来处理一串连续的命令. 这样就可以有效的替换掉嵌套的**if**/**then**结构, 甚至能够替换掉**case**语句.

**把命令连接到一起**

*   与列表
*   | 

    <pre class="PROGRAMLISTING">  1 command-1 && command-2 && command-3 && ... command-n</pre>

     |

    如果每个命令执行后都返回<span class="RETURNVALUE">true</span>(0)的话, 那么命令将会依次执行下去. 如果其中的某个命令返回<span class="RETURNVALUE">false</span>(非零值)的话, 那么这个命令链就会被打断, 也就是结束执行, (那么第一个返回<span class="RETURNVALUE">false</span>的命令, 就是最后一个执行的命令, 其后的命令都不会执行).

    * * *

    **例子 25-1\. 使用<span class="QUOTE">"与列表"</span>来测试命令行参数**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # "与列表"
      3 
      4 if [ ! -z "$1" ] && echo "Argument #1 = $1" && [ ! -z "$2" ] && echo "Argument #2 = $2"
      5 then
      6   echo "At least 2 arguments passed to script."
      7   # 所有连接起来的命令都返回true. 
      8 else
      9   echo "Less than 2 arguments passed to script."
     10   # 整个命令列表中至少有一个命令返回false. 
     11 fi  
     12 # 注意, "if [ ! -z $1 ]"也可以, 但它是有所假定的等价物. 
     13 #   if [ -n $1 ] 这个不行. 
     14 #     然而, 如果加了引用就行了. 
     15 #  if [ -n "$1" ] 这样就行了. 
     16 #     小心!
     17 # 最好将你要测试的变量引用起来, 这么做是非常好的习惯. 
     18 
     19 
     20 # 下面这段代码与上面代码是等价的, 不过下面这段代码使用的是"纯粹"的if/then结构. 
     21 if [ ! -z "$1" ]
     22 then
     23   echo "Argument #1 = $1"
     24 fi
     25 if [ ! -z "$2" ]
     26 then
     27   echo "Argument #2 = $2"
     28   echo "At least 2 arguments passed to script."
     29 else
     30   echo "Less than 2 arguments passed to script."
     31 fi
     32 # 这么写的话, 行数太多了, 没有"与列表"来的精简. 
     33 
     34 
     35 exit 0</pre>

     |

    * * *

    * * *

    **例子 25-2\. 使用<span class="QUOTE">"与列表"</span>来测试命令行参数的另一个例子**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 ARGS=1        # 期望的参数个数. 
      4 E_BADARGS=65  # 如果传递的参数个数不正确, 那么给出这个退出码. 
      5 
      6 test $# -ne $ARGS && echo "Usage: `basename $0` $ARGS argument(s)" && exit $E_BADARGS
      7 #  如果"条件1"测试为true (表示传递给脚本的参数个数不对), 
      8 #+ 则余下的命令会被执行, 并且脚本将结束运行. 
      9 
     10 # 只有当上面的测试条件为false的时候, 这行代码才会被执行. 
     11 echo "Correct number of arguments passed to this script."
     12 
     13 exit 0
     14 
     15 # 为了检查退出码, 在脚本结束的时候可以使用"echo $?"来查看退出码. </pre>

     |

    * * *

    当然, _与列表_也可以给变量_设置_默认值.

    | 

    <pre class="PROGRAMLISTING">  1 arg1=$@       # 不管怎样, 将$arg1设置为命令行参数. 
      2 
      3 [ -z "$arg1" ] && arg1=DEFAULT
      4               # 如果没有指定命令行参数, 则把$arg1设置为DEFAULT. </pre>

     |

*   或列表
*   | 

    <pre class="PROGRAMLISTING">  1 command-1 || command-2 || command-3 || ... command-n</pre>

     |

    如果每个命令都返回<span class="RETURNVALUE">false</span>, 那么命令链就会执行下去. 一旦有一个命令返回<span class="RETURNVALUE">true</span>, 命令链就会被打断, 也就是结束执行, (第一个返回<span class="RETURNVALUE">true</span>的命令将会是最后一个执行的命令). 显然, 这和<span class="QUOTE">"与列表"</span>完全相反.

    * * *

    **例子 25-3\. 将<span class="QUOTE">"或列表"</span>和<span class="QUOTE">"与列表"</span>结合使用**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 #  delete.sh, 不是很聪明的文件删除方法. 
      4 #  Usage: delete filename
      5 
      6 E_BADARGS=65
      7 
      8 if [ -z "$1" ]
      9 then
     10   echo "Usage: `basename $0` filename"
     11   exit $E_BADARGS  # 没有参数? 退出脚本. 
     12 else  
     13   file=$1          # 设置文件名.
     14 fi  
     15 
     16 
     17 [ ! -f "$file" ] && echo "File \"$file\" not found. \
     18 Cowardly refusing to delete a nonexistent file."
     19 # 与列表, 在文件不存在时将会给出错误信息. 
     20 # 注意echo命令使用了一个续行符, 这样下一行的内容, 也会作为echo命令的参数. 
     21 
     22 [ ! -f "$file" ] || (rm -f $file; echo "File \"$file\" deleted.")
     23 # 或列表, 如果文件存在, 那就删除此文件. 
     24 
     25 # 注意, 上边的两个逻辑相反. 
     26 # 与列表在true的情况下才执行, 或列表在false的时候才执行. 
     27 
     28 exit 0</pre>

     |

    * * *

    | ![Caution](./images/caution.gif) | 

    如果<span class="QUOTE">"或列表"</span>中的第一个命令返回<span class="RETURNVALUE">true</span>, 那么, <span class="QUOTE">"或列表"</span>中的第一个命令还是<tt class="REPLACEABLE">_会_</tt>执行.

     |

| 

<pre class="PROGRAMLISTING">  1 # ==> 下面的片断摘自于脚本/etc/rc.d/init.d/single, 这个脚本由Miquel van Smoorenburg所编写. 
  2 #+==> 用于展示"与"/"或"列表的使用. 
  3 # ==> "箭头"注释是由本书作者添加的. 
  4 
  5 [ -x /usr/bin/clear ] && /usr/bin/clear
  6   # ==> 如果/usr/bin/clear存在, 那么就调用它. 
  7   # ==> 在调用一个命令前, 检查一下它是否存在. 
  8   #+==> 这样可以避免错误信息, 和其他愚蠢的结果. 
  9 
 10   # ==> . . .
 11 
 12 # 如果他们想在单用户模式下运行某些程序, 可能也会运行它...
 13 for i in /etc/rc1.d/S[0-9][0-9]* ; do
 14         # 检查一下脚本是否在那里. 
 15         [ -x "$i" ] || continue
 16   # ==> 如果在$PWD中没发现相应的文件, 
 17   #+==> 则会使用"continue"跳过本次循环. 
 18 
 19         # 不接受备份文件, 也不接受由rpm产生的文件. 
 20         case "$1" in
 21                 *.rpmsave|*.rpmorig|*.rpmnew|*~|*.orig)
 22                         continue;;
 23         esac
 24         [ "$i" = "/etc/rc1.d/S00single" ] && continue
 25   # ==> 设置脚本名, 但现在还不执行它. 
 26         $i start
 27 done
 28 
 29   # ==> . . .</pre>

 |

| ![Important](./images/important.gif) | 

<kbd class="USERINPUT">与列表</kbd>和<kbd class="USERINPUT">或列表</kbd>的[退出状态码](exit-status.md#EXITSTATUSREF)由最后一个命令的退出状态所决定.

 |

可以灵活的将<span class="QUOTE">"与"</span>/<span class="QUOTE">"或"</span>列表组合在一起, 但是这么做的话, 会使得逻辑变得很复杂, 并且需要经过仔细的测试.

| 

<pre class="PROGRAMLISTING">  1 false && true || echo false         # false
  2 
  3 # 与下面的结果相同
  4 ( false && true ) || echo false     # false
  5 # But *not*
  6 false && ( true || echo false )     # (没有输出)
  7 
  8 #  注意, 以从做到右的顺序进行分组与求值, 
  9 #+ 这是因为逻辑操作符"&&"和"||"具有相同的优先级. 
 10 
 11 #  最好避免这么复杂的情况, 除非你非常了解你到底在做什么. 
 12 
 13 #  感谢, S.C.</pre>

 |

也请参考[例子 A-7](contributed-scripts.md#DAYSBETWEEN)和[例子 7-4](fto.md#BROKENLINK), 这两个例子展示了如何使用<kbd class="USERINPUT">与/或列表</kbd>来测试变量.