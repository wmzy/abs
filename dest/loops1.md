# 10.1\. 循环

_循环_就是_迭代_(重复)一些命令的代码块, 如果_循环控制条件_不满足的话, 就结束循环.

**for循环**

*   **for `arg` in <tt class="REPLACEABLE">_[list]_</tt>**
*   这是一个基本的循环结构. 它与C语言中的for循环结构有很大的不同.

    **for** <tt class="REPLACEABLE">_arg_</tt> in [<tt class="REPLACEABLE">_list_</tt>]
    do
    <tt class="REPLACEABLE">_燾ommand(s)_</tt>...
    done

    | ![Note](./images/note.gif) | 

    在循环的每次执行中, <tt class="REPLACEABLE">_arg_</tt>将顺序的访问<tt class="REPLACEABLE">_list_</tt>中列出的变量.

     |

    | 

    <pre class="PROGRAMLISTING">  1 for arg in "$var1" "$var2" "$var3" ... "$varN"  
      2 # 在第1次循环中, arg = $var1	    
      3 # 在第2次循环中, arg = $var2	    
      4 # 在第3次循环中, arg = $var3	    
      5 # ...
      6 # 在第N此循环中, arg = $varN
      7 
      8 # 在[list]中的参数加上双引号是为了阻止单词分割.</pre>

     |

    <tt class="REPLACEABLE">_list_</tt>中的参数允许包含通配符.

    如果_do_和_for_想在同一行中出现, 那么在它们之间需要添加一个分号.

    **for** <tt class="REPLACEABLE">_arg_</tt> in [<tt class="REPLACEABLE">_list_</tt>] ; do

    * * *

    **例子 10-1\. 一个简单的**for**循环**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 列出所有的行星名称. (译者注: 现在的太阳系行星已经有了变化^_^)
      3 
      4 for planet in Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune Pluto
      5 do
      6   echo $planet  # 每个行星都被单独打印在一行上.
      7 done
      8 
      9 echo
     10 
     11 for planet in "Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune Pluto"
     12 # 所有的行星名称都打印在同一行上.
     13 # 整个'list'都被双引号封成了一个变量. 
     14 do
     15   echo $planet
     16 done
     17 
     18 exit 0</pre>

     |

    * * *

    | ![Note](./images/note.gif) | 

    每个<kbd class="USERINPUT">[list]</kbd>中的元素都可能包含多个参数. 在处理参数组时, 这是非常有用的. 在这种情况下, 使用[set](internal.md#SETREF)命令(参见 [例子 11-15](internal.md#EX34))来强制解析每个<kbd class="USERINPUT">[list]</kbd>中的元素, 并且将每个解析出来的部分都分配到一个位置参数中.

     |

    * * *

    **例子 10-2\. 每个[list]元素中都带有两个参数的**for**循环**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 还是行星.
      3 
      4 # 用行星距太阳的距离来分配行星的名字.
      5 
      6 for planet in "Mercury 36" "Venus 67" "Earth 93"  "Mars 142" "Jupiter 483"
      7 do
      8   set -- $planet  # 解析变量"planet"并且设置位置参数. 
      9   # "--" 将防止$planet为空, 或者是以一个破折号开头. 
     10 
     11   # 可能需要保存原始的位置参数, 因为它们被覆盖了.
     12   # 一种方法就是使用数组.
     13   #        original_params=("$@")
     14 
     15   echo "$1		$2,000,000 miles from the sun"
     16   #-------two  tabs---把后边的0和2连接起来
     17 done
     18 
     19 # (感谢, S.C., 对此问题进行的澄清.)
     20 
     21 exit 0</pre>

     |

    * * *

    可以将一个变量放在_for循环_的<kbd class="USERINPUT">[list]</kbd>位置上.

    * * *

    **例子 10-3\. _文件信息:_ 对包含在变量中的文件列表进行操作**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # fileinfo.sh
      3 
      4 FILES="/usr/sbin/accept
      5 /usr/sbin/pwck
      6 /usr/sbin/chroot
      7 /usr/bin/fakefile
      8 /sbin/badblocks
      9 /sbin/ypbind"     # 这是你所关心的文件列表.
     10                   # 扔进去一个假文件, /usr/bin/fakefile.
     11 
     12 echo
     13 
     14 for file in $FILES
     15 do
     16 
     17   if [ ! -e "$file" ]       # 检查文件是否存在.
     18   then
     19     echo "$file does not exist."; echo
     20     continue                # 继续下一个.
     21    fi
     22 
     23   ls -l $file | awk '{ print $9 "         file size: " $5 }'  # 打印两个域.
     24   whatis `basename $file`   # 文件信息.
     25   # 注意whatis数据库需要提前建立好.
     26   # 要想达到这个目的, 以root身份运行/usr/bin/makewhatis.
     27   echo
     28 done  
     29 
     30 exit 0</pre>

     |

    * * *

    如果在_for循环_的<kbd class="USERINPUT">[list]</kbd>中有通配符 (<span class="TOKEN">*</span>和<span class="TOKEN">?</span>), 那么将会发生[通配(globbing)](globbingref.md), 也就是文件名扩展.

    * * *

    **例子 10-4\. **在for循环中操作文件****

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # list-glob.sh: 使用"globbing", 在for循环中产生[list]
      3 
      4 echo
      5 
      6 for file in *
      7 #           ^  在表达式中识别文件名匹配时,
      8 #+             Bash将执行文件名扩展.
      9 do
     10   ls -l "$file"  # 列出在$PWD(当前目录)中的所有文件.
     11   #  回想一下,通配符"*"能够匹配所有文件,
     12   #+ 然而,在"globbing"中,是不能比配"."文件的.
     13 
     14   #  如果没匹配到任何文件,那它将扩展成自己.
     15   #  为了不让这种情况发生,那就设置nullglob选项
     16   #+   (shopt -s nullglob).
     17   #  感谢, S.C.
     18 done
     19 
     20 echo; echo
     21 
     22 for file in [jx]*
     23 do
     24   rm -f $file    # 只删除当前目录下以"j"或"x"开头的文件.
     25   echo "Removed file \"$file\"".
     26 done
     27 
     28 echo
     29 
     30 exit 0</pre>

     |

    * * *

    在一个_for循环_中忽略<kbd class="USERINPUT">in [list]</kbd>部分的话, 将会使循环操作<span class="TOKEN">$@</span> -- 从命令行传递给脚本的[位置参数](internalvariables.md#POSPARAMREF). 一个非常好的例子, 参见[例子 A-16](contributed-scripts.md#PRIMES). 参见[例子 11-16](internal.md#REVPOSPARAMS).

    * * *

    **例子 10-5\. 在**for**循环中省略<kbd class="USERINPUT">in [list]</kbd>部分**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 #  使用两种方式来调用这个脚本, 一种带参数, 另一种不带参数,
      4 #+ 并观察在这两种情况下, 此脚本的行为.
      5 
      6 for a
      7 do
      8  echo -n "$a "
      9 done
     10 
     11 #  省略'in list'部分, 因此循环将会操作'$@'
     12 #+ (包括空白的命令行参数列表).
     13 
     14 echo
     15 
     16 exit 0</pre>

     |

    * * *

    也可以使用[命令替换](commandsub.md#COMMANDSUBREF) 来产生_for循环_的<kbd class="USERINPUT">[list]</kbd>. 参见[例子 12-49](extmisc.md#EX53), [例子 10-10](loops1.md#SYMLINKS)和[例子 12-43](mathc.md#BASE).

    * * *

    **例子 10-6\. 使用命令替换来产生**for**循环的[list]**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 #  for-loopcmd.sh: 带[list]的for循环, 
      3 #+ [list]是由命令替换所产生的.
      4 
      5 NUMBERS="9 7 3 8 37.53"
      6 
      7 for number in `echo $NUMBERS`  # for number in 9 7 3 8 37.53
      8 do
      9   echo -n "$number "
     10 done
     11 
     12 echo 
     13 exit 0</pre>

     |

    * * *

    下边是一个用命令替换来产生[list]的更复杂的例子.

    * * *

    **例子 10-7\. 对于二进制文件的[grep](textproc.md#GREPREF)替换**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # bin-grep.sh: 在一个二进制文件中定位匹配字串.
      3 
      4 # 对于二进制文件的"grep"替换. 
      5 # 与"grep -a"的效果相似
      6 
      7 E_BADARGS=65
      8 E_NOFILE=66
      9 
     10 if [ $# -ne 2 ]
     11 then
     12   echo "Usage: `basename $0` search_string filename"
     13   exit $E_BADARGS
     14 fi
     15 
     16 if [ ! -f "$2" ]
     17 then
     18   echo "File \"$2\" does not exist."
     19   exit $E_NOFILE
     20 fi  
     21 
     22 
     23 IFS=/pre>\012'       # 由Paulo Marcel Coelho Aragao提出的建议.
     24                   # 也就是:  IFS="\n"
     25 for word in $( strings "$2" | grep "$1" )
     26 # "strings" 命令列出二进制文件中的所有字符串.
     27 # 输出到管道交给"grep",然后由grep命令来过滤字符串.
     28 do
     29   echo $word
     30 done
     31 
     32 # S.C. 指出, 行23 - 29 可以被下边的这行来代替,
     33 #    strings "$2" | grep "$1" | tr -s "$IFS" '[\n*]'
     34 
     35 
     36 # 试试用"./bin-grep.sh mem /bin/ls"来运行这个脚本.
     37 
     38 exit 0</pre>

     |

    * * *

    大部分相同.

    * * *

    **例子 10-8\. 列出系统上的所有用户**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # userlist.sh
      3 
      4 PASSWORD_FILE=/etc/passwd
      5 n=1           # User number
      6 
      7 for name in $(awk 'BEGIN{FS=":"}{print $1}' < "$PASSWORD_FILE" )
      8 # 域分隔 = :             ^^^^^^
      9 # 打印出第一个域                 ^^^^^^^^
     10 # 从password文件中取得输入                     ^^^^^^^^^^^^^^^^^
     11 do
     12   echo "USER #$n = $name"
     13   let "n += 1"
     14 done  
     15 
     16 
     17 # USER #1 = root
     18 # USER #2 = bin
     19 # USER #3 = daemon
     20 # ...
     21 # USER #30 = bozo
     22 
     23 exit 0
     24 
     25 #  练习:
     26 #  -----
     27 #  一个普通用户(或者是一个普通用户运行的脚本)
     28 #+ 怎么才能够读取/etc/passwd呢?
     29 #  这是否是一个安全漏洞? 为什么是?为什么不是?</pre>

     |

    * * *

    关于用命令替换来产生[list]的最后一个例子.

    * * *

    **例子 10-9\. 在目录的所有文件中查找源字串**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # findstring.sh:
      3 # 在一个指定目录的所有文件中查找一个特定的字符串.
      4 
      5 directory=/usr/bin/
      6 fstring="Free Software Foundation"  # 查看哪个文件中包含FSF.
      7 
      8 for file in $( find $directory -type f -name '*' | sort )
      9 do
     10   strings -f $file | grep "$fstring" | sed -e "s%$directory%%"
     11   #  在"sed"表达式中,
     12   #+ 我们必须替换掉正常的替换分隔符"/",
     13   #+ 因为"/"碰巧是我们需要过滤的字符串之一.
     14   #  如果不用"%"代替"/"作为分隔符,那么这个操作将失败,并给出一个错误消息.(试一试).
     15 done  
     16 
     17 exit 0
     18 
     19 #  练习 (很简单):
     20 #  ---------------
     21 #  转换这个脚本, 用命令行参数
     22 #+ 代替内部用的$directory和$fstring.</pre>

     |

    * * *

    _for循环_的输出也可以通过管道传递到一个或多个命令中.

    * * *

    **例子 10-10\. 列出目录中所有的[符号链接](basic.md#SYMLINKREF)**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # symlinks.sh: 列出目录中所有的符号链接文件.
      3 
      4 
      5 directory=${1-`pwd`}
      6 #  如果没有其他特殊的指定,
      7 #+ 默认为当前工作目录.
      8 #  下边的代码块, 和上边这句等价.
      9 # ----------------------------------------------------------
     10 # ARGS=1                 # 需要一个命令行参数.
     11 #
     12 # if [ $# -ne "$ARGS" ]  # 如果不是单个参数的话...
     13 # then
     14 #   directory=`pwd`      # 当前工作目录
     15 # else
     16 #   directory=$1
     17 # fi
     18 # ----------------------------------------------------------
     19 
     20 echo "symbolic links in directory \"$directory\""
     21 
     22 for file in "$( find $directory -type l )"   # -type l = 符号链接
     23 do
     24   echo "$file"
     25 done | sort                                  # 否则的话, 列出的文件都是未经排序的.
     26 #  严格意义上说, 这里并不一定非要一个循环不可.
     27 #+ 因为"find"命令的输出将被扩展成一个单词. 
     28 #  然而, 这种方式很容易理解也很容易说明.
     29 
     30 #  就像Dominik 'Aeneas' Schnitzer所指出的,
     31 #+ 如果没将$( find $directory -type l )用""引用起来的话,
     32 #+ 那么将会把一个带有空白部分的文件名拆分成以空白分隔的两部分(文件名允许有空白).
     33 #  即使这里只会取出每个参数的第一个域.
     34 
     35 exit 0
     36 
     37 
     38 # Jean Helou建议采用下边的方法: 
     39 
     40 echo "symbolic links in directory \"$directory\""
     41 # 当前IFS的备份. 要小心使用这个值.
     42 OLDIFS=$IFS
     43 IFS=:
     44 
     45 for file in $(find $directory -type l -printf "%p$IFS")
     46 do     #                              ^^^^^^^^^^^^^^^^
     47        echo "$file"
     48        done|sort</pre>

     |

    * * *

    循环的<tt class="FILENAME">stdout</tt>可以[重定向](io-redirection.md#IOREDIRREF)到文件中, 我们对上边的例子做了一点修改.

    * * *

    **例子 10-11\. 将目录中所有符号链接文件的名字保存到一个文件中**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # symlinks.sh: 列出目录中所有的符号链接文件.
      3 
      4 OUTFILE=symlinks.list                         # 保存符号链接文件名的文件
      5 
      6 directory=${1-`pwd`}
      7 #  如果没有其他特殊的指定,
      8 #+ 默认为当前工作目录.
      9 
     10 
     11 echo "symbolic links in directory \"$directory\"" > "$OUTFILE"
     12 echo "---------------------------" >> "$OUTFILE"
     13 
     14 for file in "$( find $directory -type l )"    # -type l = 符号链接
     15 do
     16   echo "$file"
     17 done | sort >> "$OUTFILE"                     # 循环的stdout
     18 #           ^^^^^^^^^^^^^                       重定向到一个文件中.
     19 
     20 exit 0</pre>

     |

    * * *

    有一种非常像C语言_for循环_的语法形式. 需要使用(()).

    * * *

    **例子 10-12\. 一个C风格的**for**循环**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 两种循环到10的方法.
      3 
      4 echo
      5 
      6 # 标准语法.
      7 for a in 1 2 3 4 5 6 7 8 9 10
      8 do
      9   echo -n "$a "
     10 done  
     11 
     12 echo; echo
     13 
     14 # +==========================================+
     15 
     16 # 现在, 让我们用C风格语法来做相同的事情.
     17 
     18 LIMIT=10
     19 
     20 for ((a=1; a <= LIMIT ; a++))  # 双圆括号, 并且"LIMIT"变量前面没有"$".
     21 do
     22   echo -n "$a "
     23 done                           # 这是一个借用'ksh93'的结构.
     24 
     25 echo; echo
     26 
     27 # +=========================================================================+
     28 
     29 # 让我们使用C语言的"逗号操作符", 来同时增加两个变量的值. 
     30 
     31 for ((a=1, b=1; a <= LIMIT ; a++, b++))  # 逗号将同时进行两条操作.
     32 do
     33   echo -n "$a-$b "
     34 done
     35 
     36 echo; echo
     37 
     38 exit 0</pre>

     |

    * * *

    参考[例子 26-15](arrays.md#QFUNCTION), [例子 26-16](arrays.md#TWODIM), 和[例子 A-6](contributed-scripts.md#COLLATZ).

    ---

    现在, 让我们来看一个<span class="QUOTE">"现实生活"</span>中使用_for循环_的例子.

    * * *

    **例子 10-13\. 在batch mode中使用**efax****

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # Faxing (前提是'fax'必须已经安装好).
      3 
      4 EXPECTED_ARGS=2
      5 E_BADARGS=65
      6 
      7 if [ $# -ne $EXPECTED_ARGS ]
      8 # 检查命令行参数的个数是否正确.
      9 then
     10    echo "Usage: `basename $0` phone# text-file"
     11    exit $E_BADARGS
     12 fi
     13 
     14 
     15 if [ ! -f "$2" ]
     16 then
     17   echo "File $2 is not a text file"
     18   exit $E_BADARGS
     19 fi
     20   
     21 
     22 fax make $2              # 从纯文本文件中创建传真格式的文件.
     23 
     24 for file in $(ls $2.0*)  # 连接转换过的文件.
     25                          # 在变量列表中使用通配符.
     26 do
     27   fil="$fil $file"
     28 done  
     29 
     30 efax -d /dev/ttyS3 -o1 -t "T$1" $fil   # 干活的地方.
     31 
     32 
     33 # S.C. 指出, 通过下边的命令可以省去for循环.
     34 #    efax -d /dev/ttyS3 -o1 -t "T$1" $2.0*
     35 # 但这并不十分具有讲解意义[嘿嘿].
     36 
     37 exit 0</pre>

     |

    * * *

*   **while**
*   这种结构在循环的开头判断条件是否满足, 如果条件一直满足, 那么就一直循环下去 (返回<span class="RETURNVALUE">0</span>作为[退出状态码](exit-status.md#EXITSTATUSREF)). 与[for循环](loops1.md#FORLOOPREF1)的区别是, _while循环_更适合在循环次数未知的情况下使用.

    **while** [<tt class="REPLACEABLE">_condition_</tt>]
    do
    <tt class="REPLACEABLE">_燾ommand_</tt>...
    done

    [与for循环一样](loops1.md#NEEDSEMICOLON), 如果想把_do_和条件判断放到同一行上的话, 还是需要一个分号.

    **while** [<tt class="REPLACEABLE">_condition_</tt>] ; do

    需要注意一下某种特定的_while循环_, 比如[getopts结构](internal.md#GETOPTSX), 好像和这里所介绍的模版有点脱节.

    * * *

    **例子 10-14\. 简单的**while**循环**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 var0=0
      4 LIMIT=10
      5 
      6 while [ "$var0" -lt "$LIMIT" ]
      7 do
      8   echo -n "$var0 "        # -n 将会阻止产生新行. 
      9   #             ^           空格, 数字之间的分隔.
     10 
     11   var0=`expr $var0 + 1`   # var0=$(($var0+1))  也可以.
     12                           # var0=$((var0 + 1)) 也可以.
     13                           # let "var0 += 1"    也可以.
     14 done                      # 使用其他的方法也行.
     15 
     16 echo
     17 
     18 exit 0</pre>

     |

    * * *

    * * *

    **例子 10-15\. 另一个**while**循环**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 echo
      4                                # 等价于:
      5 while [ "$var1" != "end" ]     # while test "$var1" != "end"
      6 do
      7   echo "Input variable #1 (end to exit) "
      8   read var1                    # 为什么不使用'read $var1'?
      9   echo "variable #1 = $var1"   # 因为包含"#", 所以需要""
     10   # 如果输入为'end', 那么就在这里echo.
     11   # 不在这里判断结束, 在循环顶判断.
     12   echo
     13 done  
     14 
     15 exit 0</pre>

     |

    * * *

    一个_while循环_可以有多个判断条件. 但是只有最后一个才能够决定是否能够退出循环. 然而这里需要一种有点特殊的循环语法.

    * * *

    **例子 10-16\. 多条件的**while**循环**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 var1=unset
      4 previous=$var1
      5 
      6 while echo "previous-variable = $previous"
      7       echo
      8       previous=$var1
      9       [ "$var1" != end ] # 纪录之前的$var1.
     10       # 这个"while"中有4个条件, 但是只有最后一个能够控制循环.
     11       # *最后*的退出状态就是由这最后一个条件来决定. 
     12 do
     13 echo "Input variable #1 (end to exit) "
     14   read var1
     15   echo "variable #1 = $var1"
     16 done  
     17 
     18 # 尝试理解这个脚本的运行过程.
     19 # 这里还是有点小技巧的.
     20 
     21 exit 0</pre>

     |

    * * *

    与_for循环_一样, _while循环_也可以通过(())来使用C风格的语法. (参考[例子 9-31](dblparens.md#CVARS)).

    * * *

    **例子 10-17\. C风格的**while**循环**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # wh-loopc.sh: 循环10次的"while"循环.
      3 
      4 LIMIT=10
      5 a=1
      6 
      7 while [ "$a" -le $LIMIT ]
      8 do
      9   echo -n "$a "
     10   let "a+=1"
     11 done           # 到目前为止都没有什么令人惊奇的地方.
     12 
     13 echo; echo
     14 
     15 # +=================================================================+
     16 
     17 # 现在, 重复C风格的语法.
     18 
     19 ((a = 1))      # a=1
     20 # 双圆括号允许赋值两边的空格, 就像C语言一样.
     21 
     22 while (( a <= LIMIT ))   # 双圆括号, 变量前边没有"$".
     23 do
     24   echo -n "$a "
     25   ((a += 1))   # let "a+=1"
     26   # Yes, 看到了吧.
     27   # 双圆括号允许像C风格的语法一样增加变量的值.
     28 done
     29 
     30 echo
     31 
     32 # 现在, C程序员可以在Bash中找到回家的感觉了吧.
     33 
     34 exit 0</pre>

     |

    * * *

    | ![Note](./images/note.gif) | 

    _while循环_的<tt class="FILENAME">stdin</tt>可以使用<span class="TOKEN"><</span>来[重定向到一个文件](redircb.md#REDIRREF).

    _while循环_的<tt class="FILENAME">stdin</tt>支持[管道](internal.md#READPIPEREF).

     |

*   **until**
*   这个结构在循环的顶部判断条件, 并且如果条件一直为false, 那么就一直循环下去. (与_while循环_相反).

    **until** [<tt class="REPLACEABLE">_condition-is-true_</tt>]
    do
    <tt class="REPLACEABLE">_nbsp;command_</tt>...
    done

    注意, _until循环_的条件判断在循环的顶部, 这与某些编程语言是不同的.

    与_for循环_一样, 如果想把_do_和条件判断放在同一行里, 那么就需要使用分号.

    **until** [<tt class="REPLACEABLE">_condition-is-true_</tt>] ; do

    * * *

    **例子 10-18\. **until**循环**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 END_CONDITION=end
      4 
      5 until [ "$var1" = "$END_CONDITION" ]
      6 # 在循环的顶部进行条件判断.
      7 do
      8   echo "Input variable #1 "
      9   echo "($END_CONDITION to exit)"
     10   read var1
     11   echo "variable #1 = $var1"
     12   echo
     13 done  
     14 
     15 exit 0</pre>

     |

    * * *