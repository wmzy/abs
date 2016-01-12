# 9.3\. 参数替换

**处理和(或)扩展变量**

*   <kbd class="USERINPUT">${parameter}</kbd>
*   与<tt class="REPLACEABLE">_$parameter_</tt>相同, 也就是变量<tt class="REPLACEABLE">_parameter_</tt>的值. 在某些上下文中, <tt class="REPLACEABLE">_${parameter}_</tt>很少会产生混淆.

    可以把变量和字符串组合起来使用.

    | 

    <pre class="PROGRAMLISTING">  1 your_id=${USER}-on-${HOSTNAME}
      2 echo "$your_id"
      3 #
      4 echo "Old \$PATH = $PATH"
      5 PATH=${PATH}:/opt/bin  #在脚本的生命周期中, /opt/bin会被添加到$PATH变量中.
      6 echo "New \$PATH = $PATH"</pre>

     |

*   <kbd class="USERINPUT">${parameter-default}</kbd>, <kbd class="USERINPUT">${parameter:-default}</kbd>
*   ${parameter-default} -- 如果变量parameter没被声明, 那么就使用默认值.

    ${parameter:-default} -- 如果变量parameter没被设置, 那么就使用默认值.

    | 

    <pre class="PROGRAMLISTING">  1 echo ${username-`whoami`}
      2 # 如果变量$username还没有被声明, 那么就echoe出`whoami`的结果(译者注: 也就是把'whoami'的结果赋值给变量$username). </pre>

     |

    | ![Note](./images/note.gif) | 

    <tt class="REPLACEABLE">_${parameter-default}_</tt> 和<tt class="REPLACEABLE">_${parameter:-default}_</tt>在绝大多数的情况下都是相同的. 只有在_parameter_已经被声明, 但是被赋null值得时候, 这个额外的<span class="TOKEN">:</span>才会产生不同的结果.

     |

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # param-sub.sh
      3 
      4 #  一个变量是否被声明或设置,
      5 #+ 将会影响这个变量是否使用默认值, 
      6 #+ 即使这个变量值为空(null).
      7 
      8 username0=
      9 echo "username0 has been declared, but is set to null."
     10 echo "username0 = ${username0-`whoami`}"
     11 # 不会有输出.
     12 
     13 echo
     14 
     15 echo username1 has not been declared.
     16 echo "username1 = ${username1-`whoami`}"
     17 # 将会输出默认值.
     18 
     19 username2=
     20 echo "username2 has been declared, but is set to null."
     21 echo "username2 = ${username2:-`whoami`}"
     22 #                            ^
     23 # 会输出, 因为:-会比-多一个条件测试.
     24 # 可以与上边的例子比较一下.
     25 
     26 
     27 #
     28 
     29 # 再来一个:
     30 
     31 variable=
     32 # 变量已经被声明, 但是设为空值. 
     33 
     34 echo "${variable-0}"    # (没有输出)
     35 echo "${variable:-1}"   # 1
     36 #               ^
     37 
     38 unset variable
     39 
     40 echo "${variable-2}"    # 2
     41 echo "${variable:-3}"   # 3
     42 
     43 exit 0</pre>

     |

    如果脚本并没有接收到来自命令行的参数, 那么_默认参数_结构将会提供一个默认值给脚本.

    | 

    <pre class="PROGRAMLISTING">  1 DEFAULT_FILENAME=generic.data
      2 filename=${1:-$DEFAULT_FILENAME}
      3 #  如果没有指定值, 那么下面的代码块将会使用filename
      4 #+ 变量的默认值"generic.data".
      5 #
      6 #  后续的命令. </pre>

     |

    参考[例子 3-4](special-chars.md#EX58), [例子 28-2](zeros.md#EX73), 和[例子 A-6](contributed-scripts.md#COLLATZ).

    与[使用一个与列表来提供一个默认的命令行参数](list-cons.md#ANDDEFAULT)的方法相比较.

*   <kbd class="USERINPUT">${parameter=default}</kbd>, <kbd class="USERINPUT">${parameter:=default}</kbd>
*   ${parameter=default} -- 如果变量parameter没声明, 那么就把它的值设为default.

    ${parameter:=default} -- 如果变量parameter没设置, 那么就把它的值设为default.

    这两种形式基本上是一样的. 只有在变量_$parameter_被声明并且被设置为null值的时候, <span class="TOKEN">:</span>才会引起这两种形式的不同. [[1]](#FTN.AEN4933) 如上边所示.

    | 

    <pre class="PROGRAMLISTING">  1 echo ${username=`whoami`}
      2 # 变量"username"现在被赋值为`whoami`.</pre>

     |

*   <kbd class="USERINPUT">${parameter+alt_value}</kbd>, <kbd class="USERINPUT">${parameter:+alt_value}</kbd>
*   ${parameter+alt_value} -- 如果变量parameter被声明了, 那么就使用<kbd class="USERINPUT">alt_value</kbd>, 否则就使用null字符串.

    ${parameter:+alt_value} -- 如果变量parameter被设置了, 那么就使用<kbd class="USERINPUT">alt_value</kbd>, 否则就使用null字符串.

    这两种形式绝大多数情况下都一样. 只有在_parameter_被声明并且设置为null值的时候, 多出来的这个<span class="TOKEN">:</span>才会引起这两种形式的不同, 具体请看下边的例子.

    | 

    <pre class="PROGRAMLISTING">  1 echo "###### \${parameter+alt_value} ########"
      2 echo
      3 
      4 a=${param1+xyz}
      5 echo "a = $a"      # a =
      6 
      7 param2=
      8 a=${param2+xyz}
      9 echo "a = $a"      # a = xyz
     10 
     11 param3=123
     12 a=${param3+xyz}
     13 echo "a = $a"      # a = xyz
     14 
     15 echo
     16 echo "###### \${parameter:+alt_value} ########"
     17 echo
     18 
     19 a=${param4:+xyz}
     20 echo "a = $a"      # a =
     21 
     22 param5=
     23 a=${param5:+xyz}
     24 echo "a = $a"      # a =
     25 # 产生与a=${param5+xyz}不同的结果.
     26 
     27 param6=123
     28 a=${param6:+xyz}
     29 echo "a = $a"      # a = xyz</pre>

     |

*   <kbd class="USERINPUT">${parameter?err_msg}</kbd>, <kbd class="USERINPUT">${parameter:?err_msg}</kbd>
*   ${parameter?err_msg} -- 如果parameter已经被声明, 那么就使用设置的值, 否则打印err_msg错误消息.

    ${parameter:?err_msg} -- 如果parameter已经被设置, 那么就使用设置的值, 否则打印err_msg错误消息.

    这两种形式绝大多数情况都是一样的. 和上边所讲的情况一样, 只有在_parameter_被声明并设置为null值的时候, 多出来的<span class="TOKEN">:</span>才会引起这两种形式的不同.

* * *

**例子 9-15\. 使用参数替换和错误消息**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 #  检查一些系统环境变量.
  4 #  这是一种可以做一些预防性保护措施的好习惯.
  5 #  比如, 如果$USER(用户在控制台上中的名字)没有被设置的话,
  6 #+ 那么系统就会不认你.
  7 
  8 : ${HOSTNAME?} ${USER?} ${HOME?} ${MAIL?}
  9   echo
 10   echo "Name of the machine is $HOSTNAME."
 11   echo "You are $USER."
 12   echo "Your home directory is $HOME."
 13   echo "Your mail INBOX is located in $MAIL."
 14   echo
 15   echo "If you are reading this message,"
 16   echo "critical environmental variables have been set."
 17   echo
 18   echo
 19 
 20 # ------------------------------------------------------
 21 
 22 #  ${variablename?}结构
 23 #+ 也能够检查脚本中变量的设置情况.
 24 
 25 ThisVariable=Value-of-ThisVariable
 26 #  注意, 顺便提一下, 
 27 #+ 这个字符串变量可能会被设置一些非法字符.
 28 : ${ThisVariable?}
 29 echo "Value of ThisVariable is $ThisVariable".
 30 echo
 31 echo
 32 
 33 
 34 : ${ZZXy23AB?"ZZXy23AB has not been set."}
 35 #  如果变量ZZXy23AB没有被设置的话, 
 36 #+ 那么这个脚本会打印一个错误信息, 然后结束.
 37 
 38 # 你可以自己指定错误消息.
 39 # : ${variablename?"ERROR MESSAGE"}
 40 
 41 
 42 # 等价于:    dummy_variable=${ZZXy23AB?}
 43 #            dummy_variable=${ZZXy23AB?"ZXy23AB has not been set."}
 44 #
 45 #            echo ${ZZXy23AB?} >/dev/null
 46 
 47 #  使用命令"set -u"来比较这些检查变量是否被设置的方法.
 48 #
 49 
 50 
 51 
 52 echo "You will not see this message, because script already terminated."
 53 
 54 HERE=0
 55 exit $HERE   # 不会在这里退出.
 56 
 57 # 事实上, 这个脚本将会以返回值1作为退出状态(echo $?).</pre>

 |

* * *

* * *

**例子 9-16\. 参数替换和<span class="QUOTE">"usage"</span>消息(译者注: 通常就是帮助信息)**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # usage-message.sh
  3 
  4 : ${1?"Usage: $0 ARGUMENT"}
  5 #  如果没有提供命令行参数的话, 那么脚本就在这里退出了, 
  6 #+ 并且打印如下错误消息.
  7 #    usage-message.sh: 1: Usage: usage-message.sh ARGUMENT
  8 
  9 echo "These two lines echo only if command-line parameter given."
 10 echo "command line parameter = \"$1\""
 11 
 12 exit 0  # 如果提供了命令行参数, 那么脚本就会在这里退出.
 13 
 14 # 分别检查有命令行参数时和没有命令行参数时, 脚本的退出状态.
 15 # 如果有命令行参数, 那么"$?"就是0.
 16 # 如果没有的话, 那么"$?"就是1.</pre>

 |

* * *

**参数替换与(或)扩展.** 下边这些表达式都是对如何<tt class="REPLACEABLE">_在_</tt>**expr**字符串操作中进行**match**的补充. 参考[例子 12-9](moreadv.md#EX45)). 这些特定的使用方法一般都用来解析文件所在的目录名.

**变量长度/子串删除**

*   <kbd class="USERINPUT">${#var}</kbd>
*   <kbd class="USERINPUT">字符串长度</kbd>(变量`$var`得字符个数). 对于[array](arrays.md#ARRAYREF)来说, **${#array}**表示的是数组中第一个元素的长度.

    | ![Note](./images/note.gif) | 

    例外情况:

    *   **${#*}**和**${#@}**表示_位置参数的个数_.

    *   对于数组来说, **${#array[*]}**和**${#array[@]}**表示数组中元素的个数.

     |

    * * *

    **例子 9-17\. 变量长度**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # length.sh
      3 
      4 E_NO_ARGS=65
      5 
      6 if [ $# -eq 0 ]  # 这个演示脚本必须有命令行参数.
      7 then
      8   echo "Please invoke this script with one or more command-line arguments."
      9   exit $E_NO_ARGS
     10 fi  
     11 
     12 var01=abcdEFGH28ij
     13 echo "var01 = ${var01}"
     14 echo "Length of var01 = ${#var01}"
     15 # 现在, 让我们试试在变量中嵌入一个空格.
     16 var02="abcd EFGH28ij"
     17 echo "var02 = ${var02}"
     18 echo "Length of var02 = ${#var02}"
     19 
     20 echo "Number of command-line arguments passed to script = ${#@}"
     21 echo "Number of command-line arguments passed to script = ${#*}"
     22 
     23 exit 0</pre>

     |

    * * *

*   <kbd class="USERINPUT">${var#Pattern}</kbd>, <kbd class="USERINPUT">${var##Pattern}</kbd>
*   从变量`$var`的<tt class="REPLACEABLE">_开头_</tt>删除最短或最长匹配`$Pattern`的子串. (译者注: 这是一个很常见的用法, 请读者牢记, 一个<span class="QUOTE">"#"</span>表示匹配最短, <span class="QUOTE">"##"</span>表示匹配最长.)

    [例子 A-7](contributed-scripts.md#DAYSBETWEEN)中的一个用法示例:

    | 

    <pre class="PROGRAMLISTING">  1 # 摘自例子"days-between.sh"的一个函数.
      2 # 去掉传递进来参数开头的0.
      3 
      4 strip_leading_zero () #  去掉从参数中传递进来的,
      5 {                     #+ 可能存在的开头的0(也可能有多个0).
      6   return=${1#0}       #  "1"表示的是"$1" -- 传递进来的参数.
      7 }                     #  "0"就是我们想从"$1"中删除的子串 -- 去掉零.</pre>

     |

    下边是Manfred Schwarb给出的一个更加详细的例子:

    | 

    <pre class="PROGRAMLISTING">  1 strip_leading_zero2 () # 去掉开头可能存在的0(也可能有多个0), 因为如果不取掉的话,
      2 {                      # Bash就会把这个值当作8进制的值来解释. 
      3   shopt -s extglob     # 打开扩展的通配(globbing).
      4   local val=${1##+(0)} # 使用局部变量, 匹配最长连续的一个或多个0.
      5   shopt -u extglob     # 关闭扩展的通配(globbing).
      6   _strip_leading_zero2=${val:-0}
      7                        # 如果输入为0, 那么返回0来代替"".
      8 }</pre>

     |

    另一个用法示例:

    | 

    <pre class="PROGRAMLISTING">  1 echo `basename $PWD`        # 当前工作目录的basename(就是去掉目录名).
      2 echo "${PWD##*/}"           # 当前工作目录的basename(就是去掉目录名). 
      3 echo
      4 echo `basename $0`          # 脚本名字.
      5 echo $0                     # 脚本名字.
      6 echo "${0##*/}"             # 脚本名字.
      7 echo
      8 filename=test.data
      9 echo "${filename##*.}"      # data
     10                             # 文件扩展名.</pre>

     |

*   <kbd class="USERINPUT">${var%Pattern}</kbd>, <kbd class="USERINPUT">${var%%Pattern}</kbd>
*   从变量`$var`的<tt class="REPLACEABLE">_结尾_</tt>删除最短或最长匹配`$Pattern`的子串. (译者注: 这是一个很常见的用法, 请读者牢记, 一个<span class="QUOTE">"%"</span>表示匹配最短, <span class="QUOTE">"%%"</span>表示匹配最长.)

Bash的[版本2](bashver2.md#BASH2REF)添加了一些额外选项.

* * *

**例子 9-18\. 参数替换中的模式匹配**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # patt-matching.sh
  3 
  4 # 使用# ## % %%来进行参数替换操作的模式匹配. parameter substitution operators.
  5 
  6 var1=abcd12345abc6789
  7 pattern1=a*c  # *(通配符)匹配a - c之间的任意字符.
  8 
  9 echo
 10 echo "var1 = $var1"           # abcd12345abc6789
 11 echo "var1 = ${var1}"         # abcd12345abc6789
 12                               # (另一种形式)
 13 echo "Number of characters in ${var1} = ${#var1}"
 14 echo
 15 
 16 echo "pattern1 = $pattern1"   # a*c  (匹配'a'到'c'之间的任意字符)
 17 echo "--------------"
 18 echo '${var1#$pattern1}  =' "${var1#$pattern1}"    #         d12345abc6789
 19 # 最短的可能匹配, 去掉abcd12345abc6789的前3个字符.
 20 #                     |-|               ^^^^^
 21 echo '${var1##$pattern1} =' "${var1##$pattern1}"   #                  6789
 22 # 最长的可能匹配, 去掉abcd12345abc6789的前12个字符
 23 #                     |----------|      ^^^^^^
 24 
 25 echo; echo; echo
 26 
 27 pattern2=b*9            # 匹配'b'到'9'之间的任意字符
 28 echo "var1 = $var1"     # 还是abcd12345abc6789
 29 echo
 30 echo "pattern2 = $pattern2"
 31 echo "--------------"
 32 echo '${var1%pattern2}  =' "${var1%$pattern2}"     #     abcd12345a
 33 # 最短的可能匹配, 去掉abcd12345abc6789的最后6个字符
 34 #                               |----|  ^^^^^^^
 35 echo '${var1%%pattern2} =' "${var1%%$pattern2}"    #     a
 36 # 最长的可能匹配, 去掉abcd12345abc6789的最后12个字符
 37 #                      |-------------|  ^^^^^^^^
 38 
 39 # 牢记, #和##是从字符串左边开始, 并且去掉左边的字符串, 
 40 #       %和%%从字符串的右边开始, 并且去掉右边的字符串. 
 41 # (译者注: 有个好记的方法, 那就是察看键盘顺序, 记住#在%的左边. ^_^)
 42 echo
 43 
 44 exit 0</pre>

 |

* * *

* * *

**例子 9-19\. 修改文件扩展名<span class="TOKEN">:</span>**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # rfe.sh: 修改文件扩展名.
  3 #
  4 # 用法:		rfe old_extension new_extension
  5 #
  6 # 示例:
  7 # 将指定目录中所有的*.gif文件都重命名为*.jpg,
  8 # 用法:		rfe gif jpg
  9 
 10 
 11 E_BADARGS=65
 12 
 13 case $# in
 14   0|1)             # 竖线"|"在这里表示"或"操作.
 15   echo "Usage: `basename $0` old_file_suffix new_file_suffix"
 16   exit $E_BADARGS  # 如果只有0个或1个参数的话, 那么就退出脚本.
 17   ;;
 18 esac
 19 
 20 
 21 for filename in *.$1
 22 # 以第一个参数为扩展名的全部文件的列表.
 23 do
 24   mv $filename ${filename%$1}$2
 25   #  把筛选出来的文件的扩展名去掉, 因为筛选出来的文件的扩展名都是第一个参数,
 26   #+ 然后把第2个参数作为扩展名, 附加到这些文件的后边.
 27 done
 28 
 29 exit 0</pre>

 |

* * *

**变量扩展/子串替换**

*   这些结构都是从_ksh_中引入的.

*   <kbd class="USERINPUT">${var:pos}</kbd>
*   变量<tt class="REPLACEABLE">_var_</tt>从位置<tt class="REPLACEABLE">_pos_</tt>开始扩展(译者注: 也就是pos之前的字符都丢弃).

*   <kbd class="USERINPUT">${var:pos:len}</kbd>
*   变量<tt class="REPLACEABLE">_var_</tt>从位置<tt class="REPLACEABLE">_pos_</tt>开始, 并扩展<tt class="REPLACEABLE">_len_</tt>个字符. 参考[例子 A-14](contributed-scripts.md#PW), 这个例子展示了这种操作的一个创造性的用法.

*   <kbd class="USERINPUT">${var/Pattern/Replacement}</kbd>
*   使用<tt class="REPLACEABLE">_Replacement_</tt>来替换变量<tt class="REPLACEABLE">_var_</tt>中第一个匹配<tt class="REPLACEABLE">_Pattern_</tt>的字符串.

    如果省略<tt class="REPLACEABLE">_Replacement_</tt>, 那么第一个匹配<tt class="REPLACEABLE">_Pattern_</tt>的字符串将被替换为_空_, 也就是被删除了.

*   <kbd class="USERINPUT">${var//Pattern/Replacement}</kbd>
*   **全局替换.** 所有在变量<tt class="REPLACEABLE">_var_</tt>匹配<tt class="REPLACEABLE">_Pattern_</tt>的字符串, 都会被替换为<tt class="REPLACEABLE">_Replacement_</tt>.

    和上边一样, 如果省略<tt class="REPLACEABLE">_Replacement_</tt>, 那么所有匹配<tt class="REPLACEABLE">_Pattern_</tt>的字符串, 都将被替换为_空_, 也就是被删除掉.

    * * *

    **例子 9-20\. 使用模式匹配来解析任意字符串**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 var1=abcd-1234-defg
      4 echo "var1 = $var1"
      5 
      6 t=${var1#*-*}
      7 echo "var1 (with everything, up to and including first - stripped out) = $t"
      8 #  t=${var1#*-}  也一样,
      9 #+ 因为#匹配最短的字符串,
     10 #+ 同时*匹配任意前缀, 包括空字符串. 
     11 # (感谢, Stephane Chazelas, 指出这点.)
     12 
     13 t=${var1##*-*}
     14 echo "If var1 contains a \"-\", returns empty string...   var1 = $t"
     15 
     16 
     17 t=${var1%*-*}
     18 echo "var1 (with everything from the last - on stripped out) = $t"
     19 
     20 echo
     21 
     22 # -------------------------------------------
     23 path_name=/home/bozo/ideas/thoughts.for.today
     24 # -------------------------------------------
     25 echo "path_name = $path_name"
     26 t=${path_name##/*/}
     27 echo "path_name, stripped of prefixes = $t"
     28 # 在这个特例中, 与	t=`basename $path_name`		效果相同. 
     29 #  t=${path_name%/}; t=${t##*/}   是更一般的解决方法.
     30 #+ 但有时还是会失败.
     31 #  如果$path_name以一个换行符结尾的话, 那么	`basename $path_name` 就不能正常工作了,
     32 #+ 但是上边的表达式可以.
     33 # (感谢, S.C.)
     34 
     35 t=${path_name%/*.*}
     36 # 与	t=`dirname $path_name`	效果相同.
     37 echo "path_name, stripped of suffixes = $t"
     38 # 在某些情况下将失效, 比如 "../", "/foo////", # "foo/", "/".
     39 #  删除后缀, 尤其是在basename没有后缀的情况下,
     40 #+ 但是dirname可以, 不过这同时也使问题复杂化了.
     41 # (感谢, S.C.)
     42 
     43 echo
     44 
     45 t=${path_name:11}
     46 echo "$path_name, with first 11 chars stripped off = $t"
     47 t=${path_name:11:5}
     48 echo "$path_name, with first 11 chars stripped off, length 5 = $t"
     49 
     50 echo
     51 
     52 t=${path_name/bozo/clown}
     53 echo "$path_name with \"bozo\" replaced  by \"clown\" = $t"
     54 t=${path_name/today/}
     55 echo "$path_name with \"today\" deleted = $t"
     56 t=${path_name//o/O}
     57 echo "$path_name with all o's capitalized = $t"
     58 t=${path_name//o/}
     59 echo "$path_name with all o's deleted = $t"
     60 
     61 exit 0</pre>

     |

    * * *

*   <kbd class="USERINPUT">${var/#Pattern/Replacement}</kbd>
*   如果变量<tt class="REPLACEABLE">_var_</tt>的_前缀_匹配<tt class="REPLACEABLE">_Pattern_</tt>, 那么就使用<tt class="REPLACEABLE">_Replacement_</tt>来替换匹配到<tt class="REPLACEABLE">_Pattern_</tt>的字符串.

*   <kbd class="USERINPUT">${var/%Pattern/Replacement}</kbd>
*   如果变量<tt class="REPLACEABLE">_var_</tt>的_后缀_匹配<tt class="REPLACEABLE">_Pattern_</tt>, 那么就使用<tt class="REPLACEABLE">_Replacement_</tt>来替换匹配到<tt class="REPLACEABLE">_Pattern_</tt>的字符串.

    * * *

    **例子 9-21\. 对字符串的前缀和后缀使用匹配模式**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # var-match.sh:
      3 # 对字符串的前缀和后缀进行模式替换的一个演示.
      4 
      5 v0=abc1234zip1234abc    # 变量原始值.
      6 echo "v0 = $v0"         # abc1234zip1234abc
      7 echo
      8 
      9 # 匹配字符串的前缀(开头).
     10 v1=${v0/#abc/ABCDEF}    # abc1234zip1234abc
     11                         # |-|
     12 echo "v1 = $v1"         # ABCDEF1234zip1234abc
     13                         # |----|
     14 
     15 # 匹配字符串的后缀(结尾).
     16 v2=${v0/%abc/ABCDEF}    # abc1234zip123abc
     17                         #              |-|
     18 echo "v2 = $v2"         # abc1234zip1234ABCDEF
     19                         #               |----|
     20 
     21 echo
     22 
     23 #  ----------------------------------------------------
     24 #  必须匹配字符串的开头或结尾,
     25 #+ 否则是不会产生替换结果的.
     26 #  ----------------------------------------------------
     27 v3=${v0/#123/000}       # 匹配, 但不是在开头.
     28 echo "v3 = $v3"         # abc1234zip1234abc
     29                         # 不会发生替换.
     30 v4=${v0/%123/000}       # 匹配, 但不是在结尾.
     31 echo "v4 = $v4"         # abc1234zip1234abc
     32                         # 不会发生替换. 
     33 
     34 exit 0			</pre>

     |

    * * *

*   <kbd class="USERINPUT">${!varprefix*}</kbd>, <kbd class="USERINPUT">${!varprefix@}</kbd>
*   匹配所有之前声明过的, 并且以_varprefix_开头的变量.

    | 

    <pre class="PROGRAMLISTING">  1 xyz23=whatever
      2 xyz24=
      3 
      4 a=${!xyz*}      # 展开所有以"xyz"开头的, 并且之前声明过的变量名.
      5 echo "a = $a"   # a = xyz23 xyz24
      6 a=${!xyz@}      # 同上.
      7 echo "a = $a"   # a = xyz23 xyz24
      8 
      9 # Bash, 版本2.04, 添加了这个功能.</pre>

     |

### 注意事项

| [[1]](parameter-substitution.md#AEN4933) | 

如果在一个非交互脚本中, $parameter被设置为null的话, 那么这个脚本将会返回[127作为退出状态码](exitcodes.md#EXITCODESREF)(127返回码对应的Bash错误码为命令未发现<span class="QUOTE">"command not found"</span>).

 |