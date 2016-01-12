# 33.7\. 各种小技巧

*   为了记录在某个(或某些)特定会话中用户脚本的运行状态, 可以将下面的代码添加到你想要跟踪记录的脚本中. 添加的这段代码会将脚本名和调用次数记录到一个连续的文件中.

    | 

    <pre class="PROGRAMLISTING">  1 # 添加(>>)下面的代码, 到你想跟踪记录的脚本末尾. 
      2 
      3 whoami>> $SAVE_FILE    # 记录调用脚本的用户. 
      4 echo $0>> $SAVE_FILE   # 脚本名. 
      5 date>> $SAVE_FILE      # 记录日期和时间. 
      6 echo>> $SAVE_FILE      # 空行作为分隔符. 
      7 
      8 #  当然, 我们应该在~/.bashrc中定义并导出变量SAVE_FILE. 
      9 #+ (看起来有点像~/.scripts-run)</pre>

     |

*   <span class="TOKEN">>></span>操作符可以在文件末尾添加内容. 如果你想在文件的_头部_添加内容怎么办, 难道要粘贴到文件头?

    | 

    <pre class="PROGRAMLISTING">  1 file=data.txt
      2 title="***This is the title line of data text file***"
      3 
      4 echo $title | cat - $file >$file.new
      5 # "cat -" 将stdout连接到$file.
      6 #  最后的结果就是生成了一新文件, 
      7 #+ 并且成功的将$title的内容附加到了文件的*开头*. </pre>

     |

    这是之前的[例子 17-13](x13628.md#PREPENDEX)脚本的简化版本. 当然, [sed](sedawk.md#SEDREF)也能做到.

*   shell脚本也可以象一个内嵌到脚本的命令那样被调用, 比如_Tcl_或_wish_脚本, 甚至是[Makefile](filearchiv.md#MAKEFILEREF). 在C语言中, 它们可以作为一个外部的shell命令被<tt class="REPLACEABLE">_system()_</tt>函数调用, 比如, <tt class="REPLACEABLE">_system("script_name");_</tt>.

*   将一个内嵌_sed_或_awk_的脚本内容赋值给一个变量, 能够提高[shell包装](wrapper.md#SHWRAPPER)脚本的可读性. 请参考[例子 A-1](contributed-scripts.md#MAILFORMAT)和[例子 11-19](internal.md#COLTOTALER3).

*   将你最喜欢的变量定义和函数实现都放到一个文件中. 在你需要的时候, 通过使用[点](special-chars.md#DOTREF)(**.**)命令, 或者[source](internal.md#SOURCEREF)命令, 来将这些<span class="QUOTE">"库文件"</span><span class="QUOTE">"包含"</span>到脚本中.

    | 

    <pre class="PROGRAMLISTING">  1 # 脚本库
      2 # ------ -------
      3 
      4 # 注:
      5 # 这里没有"#!". 
      6 # 也没有"真正需要执行的代码". 
      7 
      8 
      9 # 有用的变量定义
     10 
     11 ROOT_UID=0             # root用户的$UID为0\. 
     12 E_NOTROOT=101          # 非root用户的出错代码. 
     13 MAXRETVAL=255          # 函数最大的返回值(正值). 
     14 SUCCESS=0
     15 FAILURE=-1
     16 
     17 
     18 
     19 # Functions
     20 
     21 Usage ()               # "Usage:"信息. (译者注: 即帮助信息)
     22 {
     23   if [ -z "$1" ]       # 没有参数传递进来. 
     24   then
     25     msg=filename
     26   else
     27     msg=$@
     28   fi
     29 
     30   echo "Usage: `basename $0` "$msg""
     31 }  
     32 
     33 
     34 Check_if_root ()       # 检查运行脚本的用户是否为root. 
     35 {                      # 摘自"ex39.sh". 
     36   if [ "$UID" -ne "$ROOT_UID" ]
     37   then
     38     echo "Must be root to run this script."
     39     exit $E_NOTROOT
     40   fi
     41 }  
     42 
     43 
     44 CreateTempfileName ()  # 创建"唯一"的临时文件. 
     45 {                      # 摘自"ex51.sh". 
     46   prefix=temp
     47   suffix=`eval date +%s`
     48   Tempfilename=$prefix.$suffix
     49 }
     50 
     51 
     52 isalpha2 ()            # 测试*整个字符串*是否都是由字母组成的. 
     53 {                      # 摘自"isalpha.sh". 
     54   [ $# -eq 1 ] || return $FAILURE
     55 
     56   case $1 in
     57   *[!a-zA-Z]*|"") return $FAILURE;;
     58   *) return $SUCCESS;;
     59   esac                 # 感谢, S.C.
     60 }
     61 
     62 
     63 abs ()                           # 绝对值. 
     64 {                                # 注意: 最大的返回值 = 255\. 
     65   E_ARGERR=-999999
     66 
     67   if [ -z "$1" ]                 # 需要传递参数. 
     68   then
     69     return $E_ARGERR             # 返回错误. 
     70   fi
     71 
     72   if [ "$1" -ge 0 ]              # 如果是非负值, 
     73   then                           #
     74     absval=$1                    # 那就是绝对值本身. 
     75   else                           # 否则, 
     76     let "absval = (( 0 - $1 ))"  # 改变符号. 
     77   fi  
     78 
     79   return $absval
     80 }
     81 
     82 
     83 tolower ()             #  将传递进来的参数字符串
     84 {                      #+ 转换为小写. 
     85 
     86   if [ -z "$1" ]       #  如果没有参数传递进来. 
     87   then                 #+ 打印错误消息
     88     echo "(null)"      #+ (C风格的void指针错误消息)
     89     return             #+ 并且从函数中返回. 
     90   fi  
     91 
     92   echo "$@" | tr A-Z a-z
     93   # 转换所有传递进来的参数($@). 
     94 
     95   return
     96 
     97 # 使用命令替换, 将函数的输出赋值给变量. 
     98 # 举例: 
     99 #    oldvar="A seT of miXed-caSe LEtTerS"
    100 #    newvar=`tolower "$oldvar"`
    101 #    echo "$newvar"    # 一串混合大小写的字符全部转换为小写
    102 #
    103 # 练习: 重写这个函数, 
    104 #           将传递进来的参数全部转换为大写[容易].
    105 }</pre>

     |

*   使用特殊目的注释头来增加脚本的条理性和可读性.

    | 

    <pre class="PROGRAMLISTING">  1 ## 表示注意. 
      2 rm -rf *.zzy   ##  "rm"命令的"-rf"选项非常的危险. 
      3                ##+ 尤其对通配符, 就更危险. 
      4 
      5 #+ 表示继续上一行. 
      6 #  这是多行注释的第一行, 
      7 #+ 
      8 #+ 这是最后一行. 
      9 
     10 #* 表示标注. 
     11 
     12 #o 表示列表项. 
     13 
     14 #> 表示另一种观点. 
     15 while [ "$var1" != "end" ]    #> while test "$var1" != "end"</pre>

     |

*   [if-test](testconstructs.md#TESTCONSTRUCTS1)结构有一种聪明的用法, 用来注释代码块.

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 COMMENT_BLOCK=
      4 #  如果给上面的变量赋值, 
      5 #+ 就会出现令人不快的结果. 
      6 
      7 if [ $COMMENT_BLOCK ]; then
      8 
      9 Comment block --
     10 =================================
     11 This is a comment line.
     12 This is another comment line.
     13 This is yet another comment line.
     14 =================================
     15 
     16 echo "This will not echo."
     17 
     18 Comment blocks are error-free! Whee!
     19 
     20 fi
     21 
     22 echo "No more comments, please."
     23 
     24 exit 0</pre>

     |

    比较这种用法, 和[使用here document注释代码块](here-docs.md#CBLOCK1)之间的区别.

*   使用[$?退出状态变量](internalvariables.md#XSTATVARREF), 因为脚本可能需要测试一个参数是否都是数字, 以便于后边可以把它当作一个整数来处理.

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 SUCCESS=0
      4 E_BADINPUT=65
      5 
      6 test "$1" -ne 0 -o "$1" -eq 0 2>/dev/null
      7 # 整数要不就是0, 要不就是非0值. (译者注: 感觉像废话 . . .)
      8 # 2>/dev/null禁止输出错误信息. 
      9 
     10 if [ $? -ne "$SUCCESS" ]
     11 then
     12   echo "Usage: `basename $0` integer-input"
     13   exit $E_BADINPUT
     14 fi
     15 
     16 let "sum = $1 + 25"             # 如果$1不是整数, 就会产生错误. 
     17 echo "Sum = $sum"
     18 
     19 # 任何变量都可以使用这种方法来测试, 而不仅仅适用于命令行参数. 
     20 
     21 exit 0</pre>

     |

*   函数的返回值严格限制在0 - 255之间. 使用全局变量或者其他方法来代替函数返回值, 通常都很容易产生问题. 从函数中, 返回一个值到脚本主体的另一个办法是, 将这个"返回值"写入到<tt class="FILENAME">stdout</tt>(通常都使用[echo](internal.md#ECHOREF)命令), 然后将其赋值给一个变量. 这种做法其实就是[命令替换](commandsub.md#COMMANDSUBREF)的一个变种.

    * * *

    **例子 33-15\. 返回值小技巧**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # multiplication.sh
      3 
      4 multiply ()                     # 将乘数作为参数传递进来. 
      5 {                               # 可以接受多个参数. 
      6 
      7   local product=1
      8 
      9   until [ -z "$1" ]             # 直到处理完所有的参数...
     10   do
     11     let "product *= $1"
     12     shift
     13   done
     14 
     15   echo $product                 #  不会echo到stdout, 
     16 }                               #+ 因为要把它赋值给一个变量. 
     17 
     18 mult1=15383; mult2=25211
     19 val1=`multiply $mult1 $mult2`
     20 echo "$mult1 X $mult2 = $val1"
     21                                 # 387820813
     22 
     23 mult1=25; mult2=5; mult3=20
     24 val2=`multiply $mult1 $mult2 $mult3`
     25 echo "$mult1 X $mult2 X $mult3 = $val2"
     26                                 # 2500
     27 
     28 mult1=188; mult2=37; mult3=25; mult4=47
     29 val3=`multiply $mult1 $mult2 $mult3 $mult4`
     30 echo "$mult1 X $mult2 X $mult3 X $mult4 = $val3"
     31                                 # 8173300
     32 
     33 exit 0</pre>

     |

    * * *

    相同的技术也可以用在字符串上. 这意味着函数可以<span class="QUOTE">"返回"</span>非数字的值.

    | 

    <pre class="PROGRAMLISTING">  1 capitalize_ichar ()          #  将传递进来的字符串的
      2 {                            #+ 首字母转换为大写. 
      3 
      4   string0="$@"               # 能够接受多个参数. 
      5 
      6   firstchar=${string0:0:1}   # 首字母. 
      7   string1=${string0:1}       # 余下的字符. 
      8 
      9   FirstChar=`echo "$firstchar" | tr a-z A-Z`
     10                              # 将首字母转换为大写. 
     11 
     12   echo "$FirstChar$string1"  # 输出到stdout. 
     13 
     14 }  
     15 
     16 newstring=`capitalize_ichar "every sentence should start with a capital letter."`
     17 echo "$newstring"          # Every sentence should start with a capital letter.</pre>

     |

    使用这种办法甚至能够<span class="QUOTE">"返回"</span>多个值.

    * * *

    **例子 33-16\. 返回多个值的技巧**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # sum-product.sh
      3 # 可以"返回"超过一个值的函数. 
      4 
      5 sum_and_product ()   # 计算所有传递进来的参数的总和, 与总乘积. 
      6 {
      7   echo $(( $1 + $2 )) $(( $1 * $2 ))
      8 # 将每个计算出来的结果输出到stdout, 并以空格分隔. 
      9 }
     10 
     11 echo
     12 echo "Enter first number "
     13 read first
     14 
     15 echo
     16 echo "Enter second number "
     17 read second
     18 echo
     19 
     20 retval=`sum_and_product $first $second`      # 将函数的输出赋值给变量. 
     21 sum=`echo "$retval" | awk '{print $1}'`      # 赋值第一个域. 
     22 product=`echo "$retval" | awk '{print $2}'`  # 赋值第二个域. 
     23 
     24 echo "$first + $second = $sum"
     25 echo "$first * $second = $product"
     26 echo
     27 
     28 exit 0</pre>

     |

    * * *

*   下一个技巧, 是将[数组](arrays.md#ARRAYREF)传递给[函数](functions.md#FUNCTIONREF)的技术, 然后<span class="QUOTE">"返回"</span>一个数组给脚本的主体.

    使用[命令替换](commandsub.md#COMMANDSUBREF)将数组中的所有元素(元素之间用空格分隔)赋值给一个变量, 这样就可以将数组传递到函数中了. 我们之前提到过一种返回值的策略, 就是将要从函数中返回的内容, 用_echo_命令输出出来, 然后使用命令替换或者**( ... )**操作符, 将函数的输出(也就是我们想要得返回值)保存到一个变量中. 如果我们想让函数<span class="QUOTE">"返回"</span>数组, 当然也可以使用这种策略.

    * * *

    **例子 33-17\. 传递数组到函数, 从函数中返回数组**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # array-function.sh: 将数组传递到函数中与...
      3 #                   从函数中"返回"一个数组
      4 
      5 
      6 Pass_Array ()
      7 {
      8   local passed_array   # 局部变量. 
      9   passed_array=( `echo "$1"` )
     10   echo "${passed_array[@]}"
     11   #  列出这个新数组中的所有元素, 
     12   #+ 这个新数组是在函数内声明的, 也是在函数内赋值的. 
     13 }
     14 
     15 
     16 original_array=( element1 element2 element3 element4 element5 )
     17 
     18 echo
     19 echo "original_array = ${original_array[@]}"
     20 #                      列出原始数组的所有元素. 
     21 
     22 
     23 # 下面是关于如何将数组传递给函数的技巧. 
     24 # **********************************
     25 argument=`echo ${original_array[@]}`
     26 # **********************************
     27 #  将原始数组中所有的元素都用空格进行分隔, 
     28 #+ 然后合并成一个字符串, 最后赋值给一个变量. 
     29 #
     30 # 注意, 如果只把数组传递给函数, 那是不行的. 
     31 
     32 
     33 # 下面是让数组作为"返回值"的技巧. 
     34 # *****************************************
     35 returned_array=( `Pass_Array "$argument"` )
     36 # *****************************************
     37 # 将函数中'echo'出来的输出赋值给数组变量. 
     38 
     39 echo "returned_array = ${returned_array[@]}"
     40 
     41 echo "============================================================="
     42 
     43 #  现在, 再试一次, 
     44 #+ 尝试一下, 在函数外面访问(列出)数组. 
     45 Pass_Array "$argument"
     46 
     47 # 函数自身可以列出数组, 但是...
     48 #+ 从函数外部访问数组是被禁止的. 
     49 echo "Passed array (within function) = ${passed_array[@]}"
     50 # NULL值, 因为这个变量是函数内部的局部变量. 
     51 
     52 echo
     53 
     54 exit 0</pre>

     |

    * * *

    如果想更加了解如何将数组传递到函数中, 请参考[例子 A-10](contributed-scripts.md#LIFESLOW), 这是一个精心制作的例子.

*   利用双括号结构, 就可以让我们使用C风格的语法, 在[for](loops1.md#FORLOOPREF1)循环和[while](loops1.md#WHILELOOPREF)循环中, 设置或者增加变量. 请参考[例子 10-12](loops1.md#FORLOOPC)和[例子 10-17](loops1.md#WHLOOPC).

*   如果在脚本的开头设置[path](internalvariables.md#PATHREF)和[umask](system.md#UMASKREF)的话, 就可以增加脚本的<span class="QUOTE">"可移植性"</span> -- 即使在那些被用户将`$PATH`和**umask**弄糟了的机器上, 也可以运行.

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 PATH=/bin:/usr/bin:/usr/local/bin ; export PATH
      3 umask 022   # 脚本创建的文件所具有的权限是755\. 
      4 
      5 # 感谢Ian D. Allen提出这个技巧. </pre>

     |

*   一项很有用的技术是, _重复地_将一个过滤器的输出(通过管道)传递给这个相同的过滤器, 但是这两次使用不同的参数和选项. 尤其是[tr](textproc.md#TRREF)和[grep](textproc.md#GREPREF), 非常适合于这种情况.

    | 

    <pre class="PROGRAMLISTING">  1 # 摘自例子"wstrings.sh". 
      2 
      3 wlist=`strings "$1" | tr A-Z a-z | tr '[:space:]' Z | \
      4 tr -cs '[:alpha:]' Z | tr -s '\173-\377' Z | tr Z ' '`</pre>

     |

    * * *

    **例子 33-18\. anagram游戏**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # agram.sh: 使用anagram来玩游戏. 
      3 
      4 # 寻找anagram...
      5 LETTERSET=etaoinshrdlu
      6 FILTER='.......'       # 最少有多少个字母? 
      7 #       1234567
      8 
      9 anagram "$LETTERSET" | # 找出这个字符串中所有的anagram...
     10 grep "$FILTER" |       # 至少需要7个字符, 
     11 grep '^is' |           # 以'is'开头
     12 grep -v 's/pre> |         # 不是复数(指英文单词的复数)
     13 grep -v 'ed/pre>          # 不是过去时(也指英文单词)
     14 # 可以添加许多种组合条件和过滤器. 
     15 
     16 #  使用"anagram"工具, 
     17 #+ 这是作者的"yawl"文字表软件包中的一部分. 
     18 #  http://ibiblio.org/pub/Linux/libs/yawl-0.3.2.tar.gz
     19 #  http://personal.riverusers.com/~thegrendel/yawl-0.3.2.tar.gz
     20 
     21 exit 0                 # 代码结束. 
     22 
     23 
     24 bash$ sh agram.sh
     25 islander
     26 isolate
     27 isolead
     28 isotheral
     29 
     30 
     31 
     32 #  练习:
     33 #  -----
     34 #  修改这个脚本, 使其能够让LETTERSET作为命令行参数. 
     35 #  将第11 - 13行的过滤器参数化(比如, 可以使用变量$FILTER), 
     36 #+ 这样我们就可以根据传递的参数来指定功能. 
     37 
     38 #  可以参考脚本agram2.sh, 
     39 #+ 与这个例子稍微有些不同. </pre>

     |

    * * *

    也请参考[例子 27-3](procref1.md#CONSTAT), [例子 12-22](textproc.md#CRYPTOQUOTE), 和[例子 A-9](contributed-scripts.md#SOUNDEX).

*   使用<span class="QUOTE">"[匿名的here document](here-docs.md#ANONHEREDOC0)"</span>来注释代码块, 这样就不用在每个注释行前面都加上<span class="TOKEN">#</span>了. 请参考[例子 17-11](here-docs.md#COMMENTBLOCK).

*   如果一个脚本的运行依赖于某个命令, 而且这个命令没被安装到运行这个脚本的机器上, 那么在运行的时候就会产生错误. 我们可以使用[whatis](filearchiv.md#WHATISREF)命令来避免这种可能产生的问题.

    | 

    <pre class="PROGRAMLISTING">  1 CMD=command1                 # 第一选择. 
      2 PlanB=command2               # 如果第一选择不存在就选用这个. 
      3 
      4 command_test=$(whatis "$CMD" | grep 'nothing appropriate')
      5 #  如果在系统中没找到'command1', 
      6 #+ 那么'whatis'将返回"command1: nothing appropriate."
      7 #
      8 #  另一种更安全的做法是: 
      9 #     command_test=$(whereis "$CMD" | grep \/)
     10 #  但是下面的测试条件应该反过来, 
     11 #+ 因为变量$command_test只有在$CMD存在于系统上的时候, 
     12 #+ 才会有内容. 
     13 #     (感谢, bojster.)
     14 
     15 
     16 if [[ -z "$command_test" ]]  # 检查命令是否存在. 
     17 then
     18   $CMD option1 option2       #  使用选项来调用command1\. 
     19 else                         #  否则,
     20   $PlanB                     #+ 运行command2\.  
     21 fi</pre>

     |

*   在错误的情况下, [if-grep test](testconstructs.md#IFGREPREF)可能不会返回期望的结果, 因为出错文本是输出到<tt class="FILENAME">stderr</tt>上, 而不是<tt class="FILENAME">stdout</tt>.

    | 

    <pre class="PROGRAMLISTING">  1 if ls -l nonexistent_filename | grep -q 'No such file or directory'
      2   then echo "File \"nonexistent_filename\" does not exist."
      3 fi</pre>

     |

    将<tt class="FILENAME">stderr</tt>[重定向](io-redirection.md#IOREDIRREF)到<tt class="FILENAME">stdout</tt>上, 就可以解决这个问题.

    | 

    <pre class="PROGRAMLISTING">  1 if ls -l nonexistent_filename 2>&1 | grep -q 'No such file or directory'
      2 #                             ^^^^
      3   then echo "File \"nonexistent_filename\" does not exist."
      4 fi
      5 
      6 # 感谢, Chris Martin指出这一点.</pre>

     |

*   [run-parts](extmisc.md#RUNPARTSREF)命令可以很方便的依次运行一组命令脚本, 尤其是和[cron](system.md#CRONREF)或[at](timedate.md#ATREF)组合使用的时候.

*   如果可以在shell脚本中调用X-Windows的小工具, 那该有多好. 目前已经有一些工具包可以完成这种功能, 比如_Xscript_, _Xmenu_, 和_widtools_. 头两种工具包已经不再被维护了. 幸运的是, 我们还可以从[这里](http://www.batse.msfc.nasa.gov/~mallozzi/home/software/xforms/src/widtools-2.0.tgz)下载第三种工具包, _widtools_.

    | ![Caution](./images/caution.gif) | 

    要想使用_widtools_(widget tools)工具包, 必须先安装_XForms_库. 除此之外, 在典型的Linux系统上编译之前, 需要正确的编辑它的[Makefile](filearchiv.md#MAKEFILEREF). 最后, 在提供的6个部件中, 有3个不能工作(事实上, 会产生段错误).

     |

    _dialog_工具集提供了一种从shell脚本中调用<span class="QUOTE">"对话框"</span>窗口部件的方法. The 原始的**dialog**工具包只能工作在文本的控制台模式下, 但是后续的类似工具, 比如**gdialog**, **Xdialog**, 和**kdialog**都是基于X-Windows窗口部件集合的.

    * * *

    **例子 33-19\. **从shell脚本中调用窗口部件****

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # dialog.sh: 使用'gdialog'窗口部件. 
      3 # 必须在你的系统上安装'gdialog'才能运行这个脚本. 
      4 # 版本1.1 (04/05/05最后修正)
      5 
      6 # 这个脚本的灵感来源于下面的文章. 
      7 #     "Scripting for X Productivity," by Marco Fioretti,
      8 #      LINUX JOURNAL, Issue 113, September 2003, pp. 86-9.
      9 # 感谢你们, 所有的LINUX JOURNAL好人. 
     10 
     11 
     12 # 在对话框窗口中的输入错误. 
     13 E_INPUT=65
     14 # 输入窗口的显示尺寸. 
     15 HEIGHT=50
     16 WIDTH=60
     17 
     18 # 输出文件名(由脚本名构造). 
     19 OUTFILE=$0.output
     20 
     21 # 将脚本的内容显示到文本窗口中. 
     22 gdialog --title "Displaying: $0" --textbox $0 $HEIGHT $WIDTH
     23 
     24 
     25 
     26 # 现在, 我们将输入保存到文件中. 
     27 echo -n "VARIABLE=" > $OUTFILE
     28 gdialog --title "User Input" --inputbox "Enter variable, please:" \
     29 $HEIGHT $WIDTH 2>> $OUTFILE
     30 
     31 
     32 if [ "$?" -eq 0 ]
     33 # 检查退出状态码, 是一个好习惯. 
     34 then
     35   echo "Executed \"dialog box\" without errors."
     36 else
     37   echo "Error(s) in \"dialog box\" execution."
     38         # 或者, 点"Cancel"按钮, 而不是"OK". 
     39   rm $OUTFILE
     40   exit $E_INPUT
     41 fi
     42 
     43 
     44 
     45 # 现在, 我们将重新获得并显示保存的变量. 
     46 . $OUTFILE   # 'Source'(执行)保存的文件. 
     47 echo "The variable input in the \"input box\" was: "$VARIABLE""
     48 
     49 
     50 rm $OUTFILE  # 清除临时文件. 
     51              # 某些应用可能需要保留这个文件. 
     52 
     53 exit $?</pre>

     |

    * * *

    其他在脚本中使用窗口部件的工具, 比如_Tk_或_wish_ (_Tcl_派生物), _PerlTk_(带有Tk扩展的Perl), _tksh_(带有Tk扩展的ksh), _XForms4Perl_(带有XForms扩展的Perl), _Gtk-Perl_(带有Gtk扩展的Perl), 或_PyQt_(带有Qt扩展的Python).

*   为了对复杂脚本做多次的修正, 可以使用_rcs_修订控制系统包.

    使用这个软件包的好处之一就是可以自动升级ID头标志. _rcs_包中的**co**命令可以对特定的保留关键字作参数替换, 比如, 可以使用下面这行代码来替换掉脚本中的`#$Id$`,

    | 

    <pre class="PROGRAMLISTING">  1 #$Id: hello-world.sh,v 1.1 2004/10/16 02:43:05 bozo Exp $</pre>

     |