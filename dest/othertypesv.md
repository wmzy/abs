# 4.4\. 特殊的变量类型

*   <tt class="REPLACEABLE">_局部变量_</tt>
*   这种变量只有在[代码块](special-chars.md#CODEBLOCKREF)或者函数中(参见[函数](functions.md#FUNCTIONREF)中的[局部变量](localvar.md#LOCALREF))才可见.

*   <tt class="REPLACEABLE">_环境变量_</tt>
*   这种变量将影响用户接口和shell的行为

    | ![Note](./images/note.gif) | 

    在通常情况下, 每个进程都有自己的<span class="QUOTE">"环境"</span>, 这个环境是由一组变量组成的, 这些变量中存有进程可能需要引用的信息. 在这种情况下, shell与一个一般的进程没什么区别.

    每次当一个shell启动时, 它都将创建适合于自己环境变量的shell变量. 更新或者添加一个新的环境变量的话, 这个shell都会立刻更新它自己的环境(译者注: 换句话说, 更改或增加的变量会立即生效), 并且所有的shell子进程(即这个shell所执行的命令)都会继承这个环境. (译者注: 准确地说, 应该是后继生成的子进程才会继承Shell的新环境变量, 已经运行的子进程并不会得到它的新环境变量).

     |

    | ![Caution](./images/caution.gif) | 

    分配给环境变量的空间是有限的. 创建太多环境变量, 或者给一个环境变量分配太多的空间都会引起错误.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">eval "`seq 10000 | sed -e 's/.*/export var&=ZZZZZZZZZZZZZZ/'`"</kbd>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">du</kbd>
    <samp class="COMPUTEROUTPUT">bash: /usr/bin/du: Argument list too long</samp>
    	          </pre>

     |

    (感谢 Stephane Chazelas 对这个问题的澄清, 并且提供了上边的例子程序.)

     |

    如果一个脚本要设置一个环境变量, 那么需要将这些变量<span class="QUOTE">"export"</span>出来, 也就是需要通知到脚本本地的环境. 这是[export](internal.md#EXPORTREF)命令的功能.

    | ![Note](./images/note.gif) | 

    一个脚本只能够**export**变量到这个脚本所产生的子进程, 也就是说只能够对这个脚本所产生的命令和进程起作用. 如果脚本是从命令行中调用的, 那么这个脚本所export的变量是<tt class="REPLACEABLE">_不能_</tt>影响命令行环境的. 也就是说, _[子进程](internal.md#FORKREF)是不能够export变量来影响产生自己的父进程的环境的._

     |

    ---

*   <tt class="REPLACEABLE">_位置参数_</tt>
*   从命令行传递到脚本的参数: `$0`, `$1`, `$2`, `$3` . . .

    `$0`就是脚本文件自身的名字, `$1` 是第一个参数, `$2`是第二个参数, `$3`是第三个参数, 然后是第四个. [[1]](#FTN.AEN1957) `$9`之后的位置参数就必须用大括号括起来了, 比如, `${10}`, `${11}`, `${12}`.

    两个比较特殊的变量[$*和$@](internalvariables.md#APPREF) 表示_所有的_位置参数.

    * * *

    **例子 4-5\. 位置参数**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 # 作为用例, 调用这个脚本至少需要10个参数, 比如:
      4 # ./scriptname 1 2 3 4 5 6 7 8 9 10
      5 MINPARAMS=10
      6 
      7 echo
      8 
      9 echo "The name of this script is \"$0\"."
     10 # 添加./是表示当前目录
     11 echo "The name of this script is \"`basename $0`\"."
     12 # 去掉路径名, 剩下文件名, (参见'basename')
     13 
     14 echo
     15 
     16 if [ -n "$1" ]              # 测试变量被引用.
     17 then
     18  echo "Parameter #1 is $1"  # 需要引用才能够转义"#"
     19 fi 
     20 
     21 if [ -n "$2" ]
     22 then
     23  echo "Parameter #2 is $2"
     24 fi 
     25 
     26 if [ -n "$3" ]
     27 then
     28  echo "Parameter #3 is $3"
     29 fi 
     30 
     31 # ...
     32 
     33 
     34 if [ -n "${10}" ]  # 大于$9的参数必须用{}括起来.
     35 then
     36  echo "Parameter #10 is ${10}"
     37 fi 
     38 
     39 echo "-----------------------------------"
     40 echo "All the command-line parameters are: "$*""
     41 
     42 if [ $# -lt "$MINPARAMS" ]
     43 then
     44   echo
     45   echo "This script needs at least $MINPARAMS command-line arguments!"
     46 fi  
     47 
     48 echo
     49 
     50 exit 0</pre>

     |

    * * *

    _{}标记法_提供了一种提取从命令行传递到脚本的_最后_一个位置参数的简单办法. 但是这种方法同时还需要使用[间接引用](bashver2.md#VARREFNEW).

    | 

    <pre class="PROGRAMLISTING">  1 args=$#           # 位置参数的个数.
      2 lastarg=${!args}
      3 # 或:       lastarg=${!#}
      4 #           (感谢, Chris Monson.)
      5 # 注意, 不能直接使用 lastarg=${!$#} , 这会产生错误.</pre>

     |

    一些脚本可能会依赖于使用不同的调用名字, 来表现出不同的行为. 如果想要达到这种目的, 一般都需要在脚本中检查`$0`. 因为脚本只能够有一个真正的文件名, 如果要产生多个名字, 必须使用符号链接. 参见[例子 12-2](basic.md#HELLOL).

    | ![Tip](./images/tip.gif) | 

    如果脚本需要一个命令行参数, 而在调用的时候, 这个参数没被提供, 那么这就可能造成给这个参数赋一个null变量, 通常情况下, 这都会产生问题. 一种解决这个问题的办法就是使用添加额外字符的方法, 在使用这个位置参数的变量和位置参数本身的后边全部添加同样的额外字符.

     |

    | 

    <pre class="PROGRAMLISTING">  1 variable1_=$1_  # 而不是 variable1=$1
      2 # 这将阻止报错, 即使在调用时没提供这个位置参数.
      3 
      4 critical_argument01=$variable1_
      5 
      6 # 这个扩展的字符是可以被消除掉的, 就像这样.
      7 variable1=${variable1_/_/}
      8 # 副作用就是$variable1_多了一个下划线.
      9 # 这里使用了参数替换模版的一种形式(后边会有具体的讨论).
     10 # (在一个删除动作中, 节省了一个替换模式.)
     11 
     12 #  处理这个问题的一个更简单的办法就是
     13 #+ 判断一下这个位置参数是否传递下来了. 
     14 if [ -z $1 ]
     15 then
     16   exit $E_MISSING_POS_PARAM
     17 fi
     18 
     19 
     20 #  然而, 象Fabian Kreutz所指出的那样,
     21 #+ 上边的方法将可能产生一个意外的副作用.
     22 #  参数替换才是更好的方法:
     23 #         ${1:-$DefaultVal}
     24 #  具体参见"参数替换"的相关章节
     25 #+ 在"变量重游"那章.</pre>

     |

    ---

    * * *

    **例子 4-6\. **wh**, [whois](communications.md#WHOISREF)节点名字查询**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # ex18.sh
      3 
      4 # 是否'whois domain-name'能够找到如下3个服务之一: 
      5 #                    ripe.net, cw.net, radb.net
      6 
      7 # 把这个脚本重命名为'wh', 然后放到/usr/local/bin目录下.
      8 
      9 # 需要符号链接:
     10 # ln -s /usr/local/bin/wh /usr/local/bin/wh-ripe
     11 # ln -s /usr/local/bin/wh /usr/local/bin/wh-cw
     12 # ln -s /usr/local/bin/wh /usr/local/bin/wh-radb
     13 
     14 E_NOARGS=65
     15 
     16 
     17 if [ -z "$1" ]
     18 then
     19   echo "Usage: `basename $0` [domain-name]"
     20   exit $E_NOARGS
     21 fi
     22 
     23 # 检查脚本名字, 然后调用合适的服务.
     24 case `basename $0` in    # Or:    case ${0##*/} in
     25     "wh"     ) whois $1@whois.ripe.net;;
     26     "wh-ripe") whois $1@whois.ripe.net;;
     27     "wh-radb") whois $1@whois.radb.net;;
     28     "wh-cw"  ) whois $1@whois.cw.net;;
     29     *        ) echo "Usage: `basename $0` [domain-name]";;
     30 esac 
     31 
     32 exit $?</pre>

     |

    * * *

    ---

    **shift**命令会重新分配位置参数, 其实就是把所有的位置参数都向左移动一个位置.

    `$1` <--- `$2`, `$2` <--- `$3`, `$3` <--- `$4`, 等等.

    原来的`$1`就消失了, 但是_`$0` (脚本名)是不会改变的_. 如果传递了大量的位置参数到脚本中, 那么**shift**命令允许你访问的位置参数的数量超过<tt class="LITERAL">10</tt>个, 当然[{}标记法](othertypesv.md#BRACKETNOTATION)也提供了这样的功能.

    * * *

    **例子 4-7\. 使用**shift**命令**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 使用'shift'来逐步存取所有的位置参数. 
      3 
      4 #  给脚本命个名, 比如shft,
      5 #+ 然后给脚本传递一些位置参数, 比如: 
      6 #          ./shft a b c def 23 skidoo
      7 
      8 until [ -z "$1" ]  # 直到所有的位置参数都被存取完...
      9 do
     10   echo -n "$1 "
     11   shift
     12 done
     13 
     14 echo               # 额外的换行.
     15 
     16 exit 0</pre>

     |

    * * *

    | ![Note](./images/note.gif) | 

    在将参数传递到[函数](functions.md#FUNCTIONREF)中的时候, **shift**命令的工作方式也差不多. 参考[例子 33-15](assortedtips.md#MULTIPLICATION).

     |

### 注意事项

| [[1]](othertypesv.md#AEN1957) | 

`$0`参数是由调用这个脚本的进程所设置的. 按照约定, 这个参数一般就是脚本的名字. 具体请参考**execv**的man页.

 |