# 10.4\. 测试与分支(case与select结构)

**case**和**select**结构在技术上说并不是循环, 因为它们并不对可执行代码块进行迭代. 但是和循环相似的是, 它们也依靠在代码块顶部或底部的条件判断来决定程序的分支.

**在代码块中控制程序分支**

*   **case (in) / esac**
*   在shell中的**case**结构与C/C++中的**switch**结构是相同的. 它允许通过判断来选择代码块中多条路径中的一条. 它的作用和多个<span class="TOKEN">if/then/else</span>语句的作用相同, 是它们的简化结构, 特别适用于创建菜单.

    **case** "$<tt class="REPLACEABLE">_variable_</tt>" in

    �"$<tt class="REPLACEABLE">_condition1_</tt>" )
    �<tt class="REPLACEABLE">_command_</tt>...
    �;;

    �"$<tt class="REPLACEABLE">_condition2_</tt>" )
    �<tt class="REPLACEABLE">_command_</tt>...
    �;;

    esac

    | ![Note](./images/note.gif) | 

    *   对变量使用""并不是强制的, 因为不会发生单词分割.

    *   每句测试行, 都以右小括号<span class="TOKEN">)</span>来结尾.

    *   每个条件判断语句块都以_一对_分号结尾 <span class="TOKEN">;;</span>.

    *   **case**块以**esac** (_case_的反向拼写)结尾.

     |

    * * *

    **例子 10-24\. 使用**case****

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 测试字符串范围.
      3 
      4 echo; echo "Hit a key, then hit return."
      5 read Keypress
      6 
      7 case "$Keypress" in
      8   [[:lower:]]   ) echo "Lowercase letter";;
      9   [[:upper:]]   ) echo "Uppercase letter";;
     10   [0-9]         ) echo "Digit";;
     11   *             ) echo "Punctuation, whitespace, or other";;
     12 esac      #  允许字符串的范围出现在[中括号]中,
     13           #+ 或者出现在POSIX风格的[[双中括号中.
     14 
     15 #  在这个例子的第一个版本中,
     16 #+ 测试大写和小写字符串的工作使用的是
     17 #+ [a-z] 和 [A-Z].
     18 #  这种用法在某些特定场合的或某些Linux发行版中不能够正常工作.
     19 #  POSIX 的风格更具可移植性.
     20 #  感谢Frank Wang指出了这点.
     21 
     22 #  练习:
     23 #  -----
     24 #  就像这个脚本所表现出来的, 它只允许单次的按键, 然后就结束了.
     25 #  修改这个脚本, 让它能够接受重复输入,
     26 #+ 报告每次按键, 并且只有在"X"被键入时才结束. 
     27 #  暗示: 将这些代码都用"while"循环圈起来. 
     28 
     29 exit 0</pre>

     |

    * * *

    * * *

    **例子 10-25\. 使用**case**来创建菜单**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 # 未经处理的地址资料
      4 
      5 clear # 清屏.
      6 
      7 echo "          Contact List"
      8 echo "          ------- ----"
      9 echo "Choose one of the following persons:" 
     10 echo
     11 echo "[E]vans, Roland"
     12 echo "[J]ones, Mildred"
     13 echo "[S]mith, Julie"
     14 echo "[Z]ane, Morris"
     15 echo
     16 
     17 read person
     18 
     19 case "$person" in
     20 # 注意, 变量是被""引用的.
     21 
     22   "E" | "e" )
     23   # 接受大写或者小写输入.
     24   echo
     25   echo "Roland Evans"
     26   echo "4321 Floppy Dr."
     27   echo "Hardscrabble, CO 80753"
     28   echo "(303) 734-9874"
     29   echo "(303) 734-9892 fax"
     30   echo "revans@zzy.net"
     31   echo "Business partner & old friend"
     32   ;;
     33 # 注意, 每个选项后边都要以双分号;;结尾.
     34 
     35   "J" | "j" )
     36   echo
     37   echo "Mildred Jones"
     38   echo "249 E. 7th St., Apt. 19"
     39   echo "New York, NY 10009"
     40   echo "(212) 533-2814"
     41   echo "(212) 533-9972 fax"
     42   echo "milliej@loisaida.com"
     43   echo "Ex-girlfriend"
     44   echo "Birthday: Feb. 11"
     45   ;;
     46 
     47 # 后边的 Smith 和 Zane 的信息在这里就省略了.
     48 
     49           * )
     50    # 默认选项.
     51    # 空输入(敲回车RETURN), 也适用于这里. 
     52    echo
     53    echo "Not yet in database."
     54   ;;
     55 
     56 esac
     57 
     58 echo
     59 
     60 #  练习:
     61 #  -----
     62 #  修改这个脚本, 让它能够接受多个输入,
     63 #+ 并且能够显示多个地址.
     64 
     65 exit 0</pre>

     |

    * * *

    一个**case**的非常聪明的用法, 用来测试命令行参数.

    | 

    <pre class="PROGRAMLISTING">  1 #! /bin/bash
      2 
      3 case "$1" in
      4 "") echo "Usage: ${0##*/} <filename>"; exit $E_PARAM;;  # 没有命令行参数,
      5                                                         # 或者第一个参数为空.
      6 # 注意: ${0##*/} 是 ${var##pattern} 的一种替换形式. 得到的结果为$0.
      7 
      8 -*) FILENAME=./$1;;   #  如果传递进来的文件名参数($1)以一个破折号开头, 
      9                       #+ 那么用./$1来代替.
     10                       #+ 这样后边的命令将不会把它作为一个选项来解释.
     11 
     12 * ) FILENAME=$1;;     # 否则, $1.
     13 esac</pre>

     |

    这是一个命令行参数处理的更容易理解的例子:

    | 

    <pre class="PROGRAMLISTING">  1 #! /bin/bash
      2 
      3 
      4 while [ $# -gt 0 ]; do    # 直到你用完所有的参数 . . .
      5   case "$1" in
      6     -d|--debug)
      7               # 是 "-d" 或 "--debug" 参数?
      8               DEBUG=1
      9               ;;
     10     -c|--conf)
     11               CONFFILE="$2"
     12               shift
     13               if [ ! -f $CONFFILE ]; then
     14                 echo "Error: Supplied file doesn't exist!"
     15                 exit $E_CONFFILE     # 错误: 文件未发现.
     16               fi
     17               ;;
     18   esac
     19   shift       # 检查剩余的参数.
     20 done
     21 
     22 #  来自Stefano Falsetto的 "Log2Rot" 脚本,
     23 #+ 并且是他的"rottlog"包的一部分. 
     24 #  已得到使用许可. </pre>

     |

    * * *

    **例子 10-26\. 使用命令替换来产生**case**变量**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # case-cmd.sh: 使用命令替换来产生"case"变量.
      3 
      4 case $( arch ) in   # "arch" 返回机器体系的类型.
      5                     # 等价于 'uname -m' ...
      6 i386 ) echo "80386-based machine";;
      7 i486 ) echo "80486-based machine";;
      8 i586 ) echo "Pentium-based machine";;
      9 i686 ) echo "Pentium2+-based machine";;
     10 *    ) echo "Other type of machine";;
     11 esac
     12 
     13 exit 0</pre>

     |

    * * *

    **case**结构也可以过滤[通配(globbing)](globbingref.md)模式的字符串.

    * * *

    **例子 10-27\. 简单的字符串匹配**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # match-string.sh: 简单的字符串匹配
      3 
      4 match_string ()
      5 {
      6   MATCH=0
      7   NOMATCH=90
      8   PARAMS=2     # 此函数需要2个参数.
      9   BAD_PARAMS=91
     10 
     11   [ $# -eq $PARAMS ] || return $BAD_PARAMS
     12 
     13   case "$1" in
     14   "$2") return $MATCH;;
     15   *   ) return $NOMATCH;;
     16   esac
     17 
     18 }  
     19 
     20 
     21 a=one
     22 b=two
     23 c=three
     24 d=two
     25 
     26 
     27 match_string $a     # 参数个数错误.
     28 echo $?             # 91
     29 
     30 match_string $a $b  # 不匹配
     31 echo $?             # 90
     32 
     33 match_string $b $d  # 匹配
     34 echo $?             # 0
     35 
     36 
     37 exit 0		    </pre>

     |

    * * *

    * * *

    **例子 10-28\. 检查输入字符是否为字母**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # isalpha.sh: 使用"case"结构来过滤字符串. 
      3 
      4 SUCCESS=0
      5 FAILURE=-1
      6 
      7 isalpha ()  # 检查输入的 *第一个字符* 是不是字母表上的字符.
      8 {
      9 if [ -z "$1" ]                # 没有参数传进来?
     10 then
     11   return $FAILURE
     12 fi
     13 
     14 case "$1" in
     15 [a-zA-Z]*) return $SUCCESS;;  # 以一个字母开头?
     16 *        ) return $FAILURE;;
     17 esac
     18 }             # 同C语言的"isalpha ()"函数比较一下. 
     19 
     20 
     21 isalpha2 ()   # 测试 *整个字符串* 是否都是字母表上的字符.
     22 {
     23   [ $# -eq 1 ] || return $FAILURE
     24 
     25   case $1 in
     26   *[!a-zA-Z]*|"") return $FAILURE;;
     27                *) return $SUCCESS;;
     28   esac
     29 }
     30 
     31 isdigit ()    # 测试 *整个字符串* 是否都是数字.
     32 {             # 换句话说, 就是测试一下是否是整数变量.
     33   [ $# -eq 1 ] || return $FAILURE
     34 
     35   case $1 in
     36   *[!0-9]*|"") return $FAILURE;;
     37             *) return $SUCCESS;;
     38   esac
     39 }
     40 
     41 
     42 
     43 check_var ()  # 测试isalpha().
     44 {
     45 if isalpha "$@"
     46 then
     47   echo "\"$*\" begins with an alpha character."
     48   if isalpha2 "$@"
     49   then        # 不需要测试第一个字符是否是non-alpha.
     50     echo "\"$*\" contains only alpha characters."
     51   else
     52     echo "\"$*\" contains at least one non-alpha character."
     53   fi  
     54 else
     55   echo "\"$*\" begins with a non-alpha character."
     56               # 如果没有参数传递进来, 也是"non-alpha". 
     57 fi
     58 
     59 echo
     60 
     61 }
     62 
     63 digit_check ()  # 测试isdigit().
     64 {
     65 if isdigit "$@"
     66 then
     67   echo "\"$*\" contains only digits [0 - 9]."
     68 else
     69   echo "\"$*\" has at least one non-digit character."
     70 fi
     71 
     72 echo
     73 
     74 }
     75 
     76 a=23skidoo
     77 b=H3llo
     78 c=-What?
     79 d=What?
     80 e=`echo $b`   # 命令替换.
     81 f=AbcDef
     82 g=27234
     83 h=27a34
     84 i=27.34
     85 
     86 check_var $a
     87 check_var $b
     88 check_var $c
     89 check_var $d
     90 check_var $e
     91 check_var $f
     92 check_var     # 没有参数传递进来, 将会发生什么?
     93 #
     94 digit_check $g
     95 digit_check $h
     96 digit_check $i
     97 
     98 
     99 exit 0        # S.C改进了这个脚本.
    100 
    101 # 练习:
    102 # -----
    103 #  编写一个'isfloat ()'函数来测试浮点数.
    104 #  暗示: 这个函数基本上与'isdigit ()'相同,
    105 #+ 但是要添加一些小数点部分的处理.</pre>

     |

    * * *

*   **select**
*   **select**结构是建立菜单的另一种工具, 这种结构是从ksh中引入的.

    **select** <tt class="REPLACEABLE">_variable_</tt> [in <tt class="REPLACEABLE">_list_</tt>]
    do
    �<tt class="REPLACEABLE">_command_</tt>...
    燽reak
    done

    提示用户输入选择的内容(比如放在变量列表中). 注意: **select**命令使用`PS3`提示符, 默认为(<samp class="PROMPT">#?</samp>), 当然, 这可以修改.

    * * *

    **例子 10-29\. 使用**select**来创建菜单**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 PS3='Choose your favorite vegetable: ' # 设置提示符字串.
      4 
      5 echo
      6 
      7 select vegetable in "beans" "carrots" "potatoes" "onions" "rutabagas"
      8 do
      9   echo
     10   echo "Your favorite veggie is $vegetable."
     11   echo "Yuck!"
     12   echo
     13   break  # 如果这里没有 'break' 会发生什么?
     14 done
     15 
     16 exit 0</pre>

     |

    * * *

    如果忽略了<kbd class="USERINPUT">in <tt class="REPLACEABLE">_list_</tt></kbd>列表, 那么**select**命令将会使用传递到脚本的命令行参数(`$@`), 或者是函数参数(当**select**是在函数中时).

    与忽略<kbd class="USERINPUT">in <tt class="REPLACEABLE">_list_</tt></kbd>的

    **for** <tt class="REPLACEABLE">_variable_</tt> [in <tt class="REPLACEABLE">_list_</tt>]

    结构比较一下.

    * * *

    **例子 10-30\. 使用函数中的**select**结构来创建菜单**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 PS3='Choose your favorite vegetable: '
      4 
      5 echo
      6 
      7 choice_of()
      8 {
      9 select vegetable
     10 # [in list]被忽略, 所以'select'使用传递给函数的参数.
     11 do
     12   echo
     13   echo "Your favorite veggie is $vegetable."
     14   echo "Yuck!"
     15   echo
     16   break
     17 done
     18 }
     19 
     20 choice_of beans rice carrots radishes tomatoes spinach
     21 #         $1    $2   $3      $4       $5       $6
     22 #         传递给choice_of()的参数
     23 
     24 exit 0</pre>

     |

    * * *

    参考[例子 34-3](bashver2.md#RESISTOR).