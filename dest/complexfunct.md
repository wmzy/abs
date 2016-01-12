# 23.1\. 复杂函数和函数复杂性

函数可以处理传递给它的参数, 并且能返回它的[退出状态码](exit-status.md#EXITSTATUSREF)给脚本, 以便后续处理.

| 

<pre class="PROGRAMLISTING">  1 function_name $arg1 $arg2</pre>

 |

函数以位置来引用传递过来的参数(就好像它们是[位置参数](internalvariables.md#POSPARAMREF)), 例如, `$1`, `$2`, 等等.

* * *

**例子 23-2\. 带参数的函数**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # 函数和参数
  3 
  4 DEFAULT=default                             # 默认参数值. 
  5 
  6 func2 () {
  7    if [ -z "$1" ]                           # 第一个参数是否长度为零? 
  8    then
  9      echo "-Parameter #1 is zero length.-"  # 或者没有参数被传递进来. 
 10    else
 11      echo "-Param #1 is \"$1\".-"
 12    fi
 13 
 14    variable=${1-$DEFAULT}                   #  这里的参数替换
 15    echo "variable = $variable"              #+ 表示什么? 
 16                                             #  ---------------------------
 17                                             #  为了区分没有参数的情况, 
 18                                             #+ 和只有一个null参数的情况. 
 19 
 20    if [ "$2" ]
 21    then
 22      echo "-Parameter #2 is \"$2\".-"
 23    fi
 24 
 25    return 0
 26 }
 27 
 28 echo
 29    
 30 echo "Nothing passed."   
 31 func2                          # 不带参数调用
 32 echo
 33 
 34 
 35 echo "Zero-length parameter passed."
 36 func2 ""                       # 使用0长度的参数进行调用
 37 echo
 38 
 39 echo "Null parameter passed."
 40 func2 "$uninitialized_param"   # 使用未初始化的参数进行调用
 41 echo
 42 
 43 echo "One parameter passed."   
 44 func2 first           # 带一个参数调用
 45 echo
 46 
 47 echo "Two parameters passed."   
 48 func2 first second    # 带两个参数调用
 49 echo
 50 
 51 echo "\"\" \"second\" passed."
 52 func2 "" second       # 带两个参数调用, 
 53 echo                  # 第一个参数长度为0, 第二个参数是由ASCII码组成的字符串. 
 54 
 55 exit 0</pre>

 |

* * *

| ![Important](./images/important.gif) | 

也可以使用[shift](othertypesv.md#SHIFTREF)命令来处理传递给函数的参数(请参考[例子 33-15](assortedtips.md#MULTIPLICATION)).

 |

但是, 传给脚本的命令行参数怎么办? 在函数内部, 这些传给脚本的命令行参数也可见么? 好, 现在让我们弄清楚这个问题.

* * *

**例子 23-3\. 函数与传递给脚本的命令行参数**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # func-cmdlinearg.sh
  3 #  调用这个脚本, 并且带一个命令行参数. 
  4 #+ 类似于 $0 arg1.
  5 
  6 
  7 func ()
  8 
  9 {
 10 echo "$1"
 11 }
 12 
 13 echo "First call to function: no arg passed."
 14 echo "See if command-line arg is seen."
 15 func
 16 # 不行! 命令行参数不可见. 
 17 
 18 echo "============================================================"
 19 echo
 20 echo "Second call to function: command-line arg passed explicitly."
 21 func $1
 22 # 现在可见了! 
 23 
 24 exit 0</pre>

 |

* * *

与别的编程语言相比, shell脚本一般只会传值给函数. 如果把变量名(事实上就是指针)作为参数传递给函数的话, 那将被解释为字面含义, 也就是被看作字符串. _函数只会以字面含义来解释函数参数._

[变量的间接引用](ivr.md#IVRREF)(请参考[例子 34-2](bashver2.md#EX78))提供了一种笨拙的机制, 来将变量指针传递给函数.

* * *

**例子 23-4\. 将一个间接引用传递给函数**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # ind-func.sh: 将一个间接引用传递给函数. 
  3 
  4 echo_var ()
  5 {
  6 echo "$1"
  7 }
  8 
  9 message=Hello
 10 Hello=Goodbye
 11 
 12 echo_var "$message"        # Hello
 13 # 现在，让我们传递一个间接引用给函数. 
 14 echo_var "${!message}"     # Goodbye
 15 
 16 echo "-------------"
 17 
 18 # 如果我们改变"hello"变量的值会发生什么? 
 19 Hello="Hello, again!"
 20 echo_var "$message"        # Hello
 21 echo_var "${!message}"     # Hello, again!
 22 
 23 exit 0</pre>

 |

* * *

接下来的一个逻辑问题就是, 将参数传递给函数_之后_, 参数能否被解除引用.

* * *

**例子 23-5\. 对一个传递给函数的参数进行解除引用的操作**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # dereference.sh
  3 # 对一个传递给函数的参数进行解除引用的操作. 
  4 # 此脚本由Bruce W. Clare所编写. 
  5 
  6 dereference ()
  7 {
  8      y=\$"$1"   # 变量名. 
  9      echo $y    # $Junk
 10 
 11      x=`eval "expr \"$y\" "`
 12      echo $1=$x
 13      eval "$1=\"Some Different Text \""  # 赋新值. 
 14 }
 15 
 16 Junk="Some Text"
 17 echo $Junk "before"    # Some Text before
 18 
 19 dereference Junk
 20 echo $Junk "after"     # Some Different Text after
 21 
 22 exit 0</pre>

 |

* * *

* * *

**例子 23-6\. 再来一次, 对一个传递给函数的参数进行解除引用的操作**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # ref-params.sh: 解除传递给函数的参数引用.
  3 #                (复杂的例子)
  4 
  5 ITERATIONS=3  # 取得输入的次数. 
  6 icount=1
  7 
  8 my_read () {
  9   #  用my_read varname这种形式来调用, 
 10   #+ 将之前用括号括起的值作为默认值输出, 
 11   #+ 然后要求输入一个新值. 
 12 
 13   local local_var
 14 
 15   echo -n "Enter a value "
 16   eval 'echo -n "[/pre>$1'] "'  #  之前的值. 
 17 # eval echo -n "[\$1] "     #  更容易理解, 
 18                              #+ 但会丢失用户在尾部输入的空格. 
 19   read local_var
 20   [ -n "$local_var" ] && eval $1=\$local_var
 21 
 22   # "与列表": 如果"local_var"的测试结果为true, 则把变量"$1"的值赋给它. 
 23 }
 24 
 25 echo
 26 
 27 while [ "$icount" -le "$ITERATIONS" ]
 28 do
 29   my_read var
 30   echo "Entry #$icount = $var"
 31   let "icount += 1"
 32   echo
 33 done  
 34 
 35 
 36 # 感谢Stephane Chazelas提供这个例子. 
 37 
 38 exit 0</pre>

 |

* * *

**退出与返回**

*   **退出状态码**
*   函数返回一个值, 被称为_退出状态码_. 退出状态码可以由**return**命令明确指定, 也可以由函数中最后一条命令的退出状态码来指定(如果成功则返回<span class="RETURNVALUE">0</span>, 否则返回非0值). 可以在脚本中使用[$?](internalvariables.md#XSTATVARREF)来引用[退出状态码](exit-status.md#EXITSTATUSREF). 因为有了这种机制, 所以脚本函数也可以象C函数一样有<span class="QUOTE">"返回值"</span>.

*   **return**
*   终止一个函数. **return**命令 [[1]](#FTN.AEN14444) 可选的允许带一个_整型_参数, 这个整数将作为函数的<span class="QUOTE">"退出状态码"</span>返回给调用这个函数的脚本, 并且这个整数也被赋值给变量[$?](internalvariables.md#XSTATVARREF).

    * * *

    **例子 23-7\. 取两个数中的最大值**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # max.sh: 取两个整数中的最大值. 
      3 
      4 E_PARAM_ERR=-198    # 如果传给函数的参数少于2个时, 就返回这个值. 
      5 EQUAL=-199          # 如果两个整数相等时, 返回这个值. 
      6 #  任意超出范围的
      7 #+ 参数值都可能传递到函数中. 
      8 
      9 max2 ()             # 返回两个整数中的最大值. 
     10 {                   # 注意: 参与比较的数必须小于257\. 
     11 if [ -z "$2" ]
     12 then
     13   return $E_PARAM_ERR
     14 fi
     15 
     16 if [ "$1" -eq "$2" ]
     17 then
     18   return $EQUAL
     19 else
     20   if [ "$1" -gt "$2" ]
     21   then
     22     return $1
     23   else
     24     return $2
     25   fi
     26 fi
     27 }
     28 
     29 max2 33 34
     30 return_val=$?
     31 
     32 if [ "$return_val" -eq $E_PARAM_ERR ]
     33 then
     34   echo "Need to pass two parameters to the function."
     35 elif [ "$return_val" -eq $EQUAL ]
     36   then
     37     echo "The two numbers are equal."
     38 else
     39     echo "The larger of the two numbers is $return_val."
     40 fi  
     41 
     42   
     43 exit 0
     44 
     45 #  练习(简单):
     46 #  -----------
     47 #  把这个脚本转化为交互式脚本, 
     48 #+ 也就是, 修改这个脚本, 让其要求调用者输入2个数. </pre>

     |

    * * *

    | ![Tip](./images/tip.gif) | 

    为了让函数可以返回字符串或是数组, 可以使用一个在函数外可见的专用全局变量.

    | 

    <pre class="PROGRAMLISTING">  1 count_lines_in_etc_passwd()
      2 {
      3   [[ -r /etc/passwd ]] && REPLY=$(echo $(wc -l < /etc/passwd))
      4   #  如果/etc/passwd是可读的, 那么就把REPLY设置为文件的行数. 
      5   #  这样就可以同时返回参数值与状态信息. 
      6   #  'echo'看上去没什么用, 可是 . . .
      7   #+ 它的作用是删除输出中的多余空白字符. 
      8 }
      9 
     10 if count_lines_in_etc_passwd
     11 then
     12   echo "There are $REPLY lines in /etc/passwd."
     13 else
     14   echo "Cannot count lines in /etc/passwd."
     15 fi  
     16 
     17 # 感谢, S.C.</pre>

     |

     |

    * * *

    **例子 23-8\. 将阿拉伯数字转化为罗马数字**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 # 将阿拉伯数字转化为罗马数字
      4 # 范围: 0 - 200
      5 # 比较粗糙, 但可以正常工作. 
      6 
      7 # 扩展范围, 并且完善这个脚本, 作为练习. 
      8 
      9 # 用法: roman number-to-convert
     10 
     11 LIMIT=200
     12 E_ARG_ERR=65
     13 E_OUT_OF_RANGE=66
     14 
     15 if [ -z "$1" ]
     16 then
     17   echo "Usage: `basename $0` number-to-convert"
     18   exit $E_ARG_ERR
     19 fi  
     20 
     21 num=$1
     22 if [ "$num" -gt $LIMIT ]
     23 then
     24   echo "Out of range!"
     25   exit $E_OUT_OF_RANGE
     26 fi  
     27 
     28 to_roman ()   # 在第一次调用函数前必须先定义它. 
     29 {
     30 number=$1
     31 factor=$2
     32 rchar=$3
     33 let "remainder = number - factor"
     34 while [ "$remainder" -ge 0 ]
     35 do
     36   echo -n $rchar
     37   let "number -= factor"
     38   let "remainder = number - factor"
     39 done  
     40 
     41 return $number
     42        # 练习:
     43        # -----
     44        # 解释这个函数是如何工作的. 
     45        # 提示: 依靠不断的除, 来分割数字. 
     46 }
     47    
     48 
     49 to_roman $num 100 C
     50 num=$?
     51 to_roman $num 90 LXXXX
     52 num=$?
     53 to_roman $num 50 L
     54 num=$?
     55 to_roman $num 40 XL
     56 num=$?
     57 to_roman $num 10 X
     58 num=$?
     59 to_roman $num 9 IX
     60 num=$?
     61 to_roman $num 5 V
     62 num=$?
     63 to_roman $num 4 IV
     64 num=$?
     65 to_roman $num 1 I
     66 
     67 echo
     68 
     69 exit 0</pre>

     |

    * * *

    也请参考[例子 10-28](testbranch.md#ISALPHA).

    | ![Important](./images/important.gif) | 

    函数所能返回最大的正整数是255\. **return**命令与[退出状态码](exit-status.md#EXITSTATUSREF)的概念被紧密联系在一起, 并且退出状态码的值受此限制. 幸运的是, 如果想让函数返回大整数的话, 有好多种不同的[工作区](assortedtips.md#RVT)能够应付这个情况.

    * * *

    **例子 23-9\. 测试函数最大的返回值**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # return-test.sh
      3 
      4 # 函数所能返回的最大正整数为255\. 
      5 
      6 return_test ()         # 传给函数什么值, 就返回什么值. 
      7 {
      8   return $1
      9 }
     10 
     11 return_test 27         # o.k.
     12 echo $?                # 返回27.
     13   
     14 return_test 255        # 依然是o.k.
     15 echo $?                # 返回255.
     16 
     17 return_test 257        # 错误!
     18 echo $?                # 返回1 (对应各种错误的返回码). 
     19 
     20 # ======================================================
     21 return_test -151896    # 能返回一个大负数么? 
     22 echo $?                # 能否返回-151896?
     23                        # 显然不行! 只返回了168.
     24 #  Bash 2.05b以前的版本
     25 #+ 允许返回大负数. 
     26 #  Bash的新版本(2.05b之后)修正了这个漏洞. 
     27 #  这可能会影响以前所编写的脚本. 
     28 #  一定要小心! 
     29 # ======================================================
     30 
     31 exit 0</pre>

     |

    * * *

    如果你想获得大整数<span class="QUOTE">"返回值"</span>的话, 其实最简单的办法就是将<span class="QUOTE">"要返回的值"</span>保存到一个全局变量中.

    | 

    <pre class="PROGRAMLISTING">  1 Return_Val=   # 用于保存函数特大返回值的全局变量. 
      2 
      3 alt_return_test ()
      4 {
      5   fvar=$1
      6   Return_Val=$fvar
      7   return   # 返回0 (成功). 
      8 }
      9 
     10 alt_return_test 1
     11 echo $?                              # 0
     12 echo "return value = $Return_Val"    # 1
     13 
     14 alt_return_test 256
     15 echo "return value = $Return_Val"    # 256
     16 
     17 alt_return_test 257
     18 echo "return value = $Return_Val"    # 257
     19 
     20 alt_return_test 25701
     21 echo "return value = $Return_Val"    #25701</pre>

     |

    一种更优雅的做法是在函数中使用**echo**命令将<span class="QUOTE">"返回值输出到<tt class="FILENAME">stdout</tt>"</span>, 然后使用[命令替换](commandsub.md#COMMANDSUBREF)来捕捉此值. 请参考[Section 33.7](assortedtips.md)中[关于这种用法的讨论](assortedtips.md#RVT).

    * * *

    **例子 23-10\. 比较两个大整数**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # max2.sh: 取两个大整数中的最大值. 
      3 
      4 #  这是前一个例子"max.sh"的修改版, 
      5 #+ 这个版本可以比较两个大整数. 
      6 
      7 EQUAL=0             # 如果两个值相等, 那就返回这个值. 
      8 E_PARAM_ERR=-99999  # 没有足够多的参数传递给函数. 
      9 #           ^^^^^^    任意超出范围的参数都可以传递进来. 
     10 
     11 max2 ()             # "返回"两个整数中最大的那个. 
     12 {
     13 if [ -z "$2" ]
     14 then
     15   echo $E_PARAM_ERR
     16   return
     17 fi
     18 
     19 if [ "$1" -eq "$2" ]
     20 then
     21   echo $EQUAL
     22   return
     23 else
     24   if [ "$1" -gt "$2" ]
     25   then
     26     retval=$1
     27   else
     28     retval=$2
     29   fi
     30 fi
     31 
     32 echo $retval        # 输出(到stdout), 而没有用返回值. 
     33                     # 为什么? 
     34 }
     35 
     36 
     37 return_val=$(max2 33001 33997)
     38 #            ^^^^             函数名
     39 #                 ^^^^^ ^^^^^ 传递进来的参数
     40 #  这其实是命令替换的一种形式: 
     41 #+ 可以把函数看作为一个命令, 
     42 #+ 然后把函数的stdout赋值给变量"return_val." 
     43 
     44 
     45 # ========================= OUTPUT ========================
     46 if [ "$return_val" -eq "$E_PARAM_ERR" ]
     47   then
     48   echo "Error in parameters passed to comparison function!"
     49 elif [ "$return_val" -eq "$EQUAL" ]
     50   then
     51     echo "The two numbers are equal."
     52 else
     53     echo "The larger of the two numbers is $return_val."
     54 fi
     55 # =========================================================
     56   
     57 exit 0
     58 
     59 #  练习:
     60 #  -----
     61 #  1) 找到一种更优雅的方法, 
     62 #+    来测试传递给函数的参数. 
     63 #  2) 简化"输出"段的if/then结构. 
     64 #  3) 重写这个脚本, 使其能够从命令行参数中获得输入. </pre>

     |

    * * *

    这是另一个能够捕捉函数<span class="QUOTE">"返回值"</span>的例子. 要想搞明白这个例子, 需要一些[awk](awk.md#AWKREF)的知识.

    | 

    <pre class="PROGRAMLISTING">  1 month_length ()  # 把月份作为参数. 
      2 {                # 返回该月包含的天数. 
      3 monthD="31 28 31 30 31 30 31 31 30 31 30 31"  # 作为局部变量声明? 
      4 echo "$monthD" | awk '{ print /pre>"${1}"' }'    # 小技巧. 
      5 #                             ^^^^^^^^^
      6 # 传递给函数的参数($1 -- 月份号), 然后传给awk. 
      7 # Awk把参数解释为"print $1 . . . print $12"(这依赖于月份号)
      8 # 这是一个模版, 用于将参数传递给内嵌awk的脚本: 
      9 #                                 /pre>"${script_parameter}"'
     10 
     11 #  需要做一些错误检查, 来保证月份号正确, 在范围(1-12)之间, 
     12 #+ 别忘了检查闰年的二月. 
     13 }
     14 
     15 # ----------------------------------------------
     16 # 用例:
     17 month=4        # 以四月为例. 
     18 days_in=$(month_length $month)
     19 echo $days_in  # 30
     20 # ----------------------------------------------</pre>

     |

    也请参考[例子 A-7](contributed-scripts.md#DAYSBETWEEN).

    <kbd class="USERINPUT">练习:</kbd> 使用目前我们已经学到的知识, 来扩展之前的例子[将阿拉伯数字转化为罗马数字](complexfunct.md#EX61), 让它能够接受任意大的输入.

     |

**重定向**

*   <tt class="REPLACEABLE">_重定向函数的stdin_</tt>
*   函数本质上其实就是一个[代码块](special-chars.md#CODEBLOCKREF), 这就意味着它的<tt class="FILENAME">stdin</tt>可以被重定向(比如[例子 3-1](special-chars.md#EX8)).

    * * *

    **例子 23-11\. 从username中取得用户的真名**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # realname.sh
      3 #
      4 # 依靠username, 从/etc/passwd中获得"真名". 
      5 
      6 
      7 ARGCOUNT=1       # 需要一个参数. 
      8 E_WRONGARGS=65
      9 
     10 file=/etc/passwd
     11 pattern=$1
     12 
     13 if [ $# -ne "$ARGCOUNT" ]
     14 then
     15   echo "Usage: `basename $0` USERNAME"
     16   exit $E_WRONGARGS
     17 fi  
     18 
     19 file_excerpt ()  # 按照要求的模式来扫描文件, 然后打印文件相关的部分. 
     20 {
     21 while read line  # "while"并不一定非得有"[ condition ]"不可. 
     22 do
     23   echo "$line" | grep $1 | awk -F":" '{ print $5 }'  # awk用":"作为界定符. 
     24 done
     25 } <$file  # 重定向到函数的stdin. 
     26 
     27 file_excerpt $pattern
     28 
     29 # 是的, 整个脚本其实可以被缩减为
     30 #       grep PATTERN /etc/passwd | awk -F":" '{ print $5 }'
     31 # 或
     32 #       awk -F: '/PATTERN/ {print $5}'
     33 # 或
     34 #       awk -F: '($1 == "username") { print $5 }' # 从username中获得真名. 
     35 # 但是, 这些起不到示例的作用. 
     36 
     37 exit 0</pre>

     |

    * * *

    还有一个办法, 或许能够更好的理解重定向函数的<tt class="FILENAME">stdin</tt>. 它在函数内添加了一对大括号, 并且将重定向<tt class="FILENAME">stdin</tt>的行为放在这对添加的大括号上.

    | 

    <pre class="PROGRAMLISTING">  1 # 用下面的方法来代替它:
      2 Function ()
      3 {
      4  ...
      5  } < file
      6 
      7 # 试试这个: 
      8 Function ()
      9 {
     10   {
     11     ...
     12    } < file
     13 }
     14 
     15 # 同样的,
     16 
     17 Function ()  # 没问题.
     18 {
     19   {
     20    echo $*
     21   } | tr a b
     22 }
     23 
     24 Function ()  # 不行. 
     25 {
     26   echo $*
     27 } | tr a b   # 这儿的内嵌代码块是被强制的. 
     28 
     29 
     30 # 感谢, S.C.</pre>

     |

### 注意事项

| [[1]](complexfunct.md#AEN14444) | 

**return**命令是Bash[内建命令builtin](internal.md#BUILTINREF).

 |