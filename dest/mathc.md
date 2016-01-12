# 12.8\. 数学计算命令

**<span class="QUOTE">"操作数字"</span>**

*   **factor**
*   将一个正数分解为多个素数.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">factor 27417</kbd>
    <samp class="COMPUTEROUTPUT">27417: 3 13 19 37</samp>
    	      </pre>

     |

*   **bc**
*   Bash不能处理浮点运算, 并且缺乏特定的一些操作, 这些操作都是一些重要的计算功能. 幸运的是, **bc**可以解决这个问题.

    **bc**不仅仅是个多功能灵活的精确计算工具, 且它还提供许多编程语言才具备的一些方便功能.

    **bc**比较类似于C语言的语法.

    因为它是一个完整的UNIX工具, 所以它可以用在[pipe](special-chars.md#PIPEREF)中, **bc**在脚本中也是很常用的.

    这里有一个简单的使用**bc**命令的模版, 可以用来计算脚本中的变量. 这个模版经常用于[命令替换](commandsub.md#COMMANDSUBREF)中.

    | 

    <pre class="SCREEN">	      <kbd class="USERINPUT">variable=$(echo "OPTIONS; OPERATIONS" | bc)</kbd>
    	      </pre>

     |

    * * *

    **例子 12-42\. 按月偿还贷款**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # monthlypmt.sh: 计算按月偿还贷款的数量. 
      3 
      4 
      5 #  这份代码是一份修改版本, 原始版本在"mcalc"(贷款计算)包中, 
      6 #+ 这个包的作者是Jeff Schmidt和Mendel Cooper(本书作者). 
      7 #   http://www.ibiblio.org/pub/Linux/apps/financial/mcalc-1.6.tar.gz  [15k]
      8 
      9 echo
     10 echo "Given the principal, interest rate, and term of a mortgage,"
     11 echo "calculate the monthly payment."
     12 
     13 bottom=1.0
     14 
     15 echo
     16 echo -n "Enter principal (no commas) "
     17 read principal
     18 echo -n "Enter interest rate (percent) "  # 如果是12%, 那就键入"12", 而不是".12". 
     19 read interest_r
     20 echo -n "Enter term (months) "
     21 read term
     22 
     23 
     24  interest_r=$(echo "scale=9; $interest_r/100.0" | bc) # 转换成小数. 
     25                  # "scale"指定了有效数字的个数.
     26   
     27 
     28  interest_rate=$(echo "scale=9; $interest_r/12 + 1.0" | bc)
     29  
     30 
     31  top=$(echo "scale=9; $principal*$interest_rate^$term" | bc)
     32 
     33  echo; echo "Please be patient. This may take a while."
     34 
     35  let "months = $term - 1"
     36 # ==================================================================== 
     37  for ((x=$months; x > 0; x--))
     38  do
     39    bot=$(echo "scale=9; $interest_rate^$x" | bc)
     40    bottom=$(echo "scale=9; $bottom+$bot" | bc)
     41 #  bottom = $(($bottom + $bot"))
     42  done
     43 # ==================================================================== 
     44 
     45 # -------------------------------------------------------------------- 
     46 #  Rick Boivie给出了一个对上边循环的修改方案, 
     47 #+ 这个修改更加有效率, 将会节省大概2/3的时间. 
     48 
     49 # for ((x=1; x <= $months; x++))
     50 # do
     51 #   bottom=$(echo "scale=9; $bottom * $interest_rate + 1" | bc)
     52 # done
     53 
     54 
     55 #  然后他又想出了一个更加有效率的版本, 
     56 #+ 将会节省95%的时间! 
     57 
     58 # bottom=`{
     59 #     echo "scale=9; bottom=$bottom; interest_rate=$interest_rate"
     60 #     for ((x=1; x <= $months; x++))
     61 #     do
     62 #          echo 'bottom = bottom * interest_rate + 1'
     63 #     done
     64 #     echo 'bottom'
     65 #     } | bc`       # 在命令替换中嵌入一个'for循环'. 
     66 # --------------------------------------------------------------------------
     67 #  另一方面, Frank Wang建议: 
     68 #  bottom=$(echo "scale=9; ($interest_rate^$term-1)/($interest_rate-1)" | bc)
     69 
     70 #  因为 . . .
     71 #  在循环后边的算法
     72 #+ 事实上是一个等比数列的求和公式. 
     73 #  求和公式是 e0(1-q^n)/(1-q), 
     74 #+ e0是第一个元素, q=e(n+1)/e(n), 
     75 #+ n是元素数量.
     76 # --------------------------------------------------------------------------
     77 
     78 
     79  # let "payment = $top/$bottom"
     80  payment=$(echo "scale=2; $top/$bottom" | bc)
     81  # 使用2位有效数字来表示美元和美分. 
     82  
     83  echo
     84  echo "monthly payment = \$payment"  # 在总和的前边显示美元符号. 
     85  echo
     86 
     87 
     88  exit 0
     89 
     90 
     91  # 练习: 
     92  #   1) 处理输入允许本金总数中的逗号. 
     93  #   2) 处理输入允许按照百分号和小数点的形式输入利率. 
     94  #   3) 如果你真正想好好编写这个脚本, 
     95  #      那么就扩展这个脚本让它能够打印出完整的分期付款表. </pre>

     |

    * * *

    * * *

    **例子 12-43\. 数制转换**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 ##########################################################################
      3 # 脚本       :	base.sh - 用不同的数制来打印数字 (Bourne Shell)
      4 # 作者       :	Heiner Steven (heiner.steven@odn.de)
      5 # 日期       :	07-03-95
      6 # 类型       :	桌面
      7 # $Id: base.sh,v 1.2 2000/02/06 19:55:35 heiner Exp $
      8 # ==> 上边这行是RCS ID信息. 
      9 ##########################################################################
     10 # 描述
     11 #
     12 # 修改纪录
     13 # 21-03-95 stv	fixed error occuring with 0xb as input (0.2)
     14 ##########################################################################
     15 
     16 # ==> 在本书中使用这个脚本通过了原作者的授权. 
     17 # ==> 注释是本书作者添加的. 
     18 
     19 NOARGS=65
     20 PN=`basename "$0"`			       # 程序名
     21 VER=`echo '$Revision: 1.2 /pre> | cut -d' ' -f2`  # ==> VER=1.2
     22 
     23 Usage () {
     24     echo "$PN - print number to different bases, $VER (stv '95)
     25 usage: $PN [number ...]
     26 
     27 If no number is given, the numbers are read from standard input.
     28 A number may be
     29     binary (base 2)		starting with 0b (i.e. 0b1100)
     30     octal (base 8)		starting with 0  (i.e. 014)
     31     hexadecimal (base 16)	starting with 0x (i.e. 0xc)
     32     decimal			otherwise (i.e. 12)" >&2
     33     exit $NOARGS 
     34 }   # ==> 打印出用法信息的函数. 
     35 
     36 Msg () {
     37     for i   # ==> 省略[list].
     38     do echo "$PN: $i" >&2
     39     done
     40 }
     41 
     42 Fatal () { Msg "$@"; exit 66; }
     43 
     44 PrintBases () {
     45     # 决定数字的数制
     46     for i      # ==> 省略[list]...
     47     do         # ==> 所以是对命令行参数进行操作. 
     48 	case "$i" in
     49 	    0b*)		ibase=2;;	# 2进制
     50 	    0x*|[a-f]*|[A-F]*)	ibase=16;;	# 16进制
     51 	    0*)			ibase=8;;	# 8进制
     52 	    [1-9]*)		ibase=10;;	# 10进制
     53 	    *)
     54 		Msg "illegal number $i - ignored"
     55 		continue;;
     56 	esac
     57 
     58 	# 去掉前缀, 将16进制数字转换为大写(bc命令需要这么做)
     59 	number=`echo "$i" | sed -e 's:^0[bBxX]::' | tr '[a-f]' '[A-F]'`
     60 	# ==> 使用":" 作为sed分隔符, 而不使用"/".
     61 
     62 	# 将数字转换为10进制
     63 	dec=`echo "ibase=$ibase; $number" | bc`  # ==> 'bc'是个计算工具.
     64 	case "$dec" in
     65 	    [0-9]*)	;;			 # 数字没问题
     66 	    *)		continue;;		 # 错误: 忽略
     67 	esac
     68 
     69 	# 在一行上打印所有转换后的数字. 
     70 	# ==> 'here document'提供命令列表给'bc'. 
     71 	echo `bc <<!
     72 	    obase=16; "hex="; $dec
     73 	    obase=10; "dec="; $dec
     74 	    obase=8;  "oct="; $dec
     75 	    obase=2;  "bin="; $dec
     76 !
     77     ` | sed -e 's: :	:g'
     78 
     79     done
     80 }
     81 
     82 while [ $# -gt 0 ]
     83 # ==>  这里必须使用一个"while循环", 
     84 # ==>+ 因为所有的case都可能退出循环或者
     85 # ==>+ 结束脚本. 
     86 # ==> (感谢, Paulo Marcel Coelho Aragao.)
     87 do
     88     case "$1" in
     89 	--)     shift; break;;
     90 	-h)     Usage;;                 # ==> 帮助信息. 
     91 	-*)     Usage;;
     92          *)     break;;			# 第一个数字
     93     esac   # ==> 对于非法输入进行更严格检查是非常有用的. 
     94     shift
     95 done
     96 
     97 if [ $# -gt 0 ]
     98 then
     99     PrintBases "$@"
    100 else					# 从stdin中读取
    101     while read line
    102     do
    103 	PrintBases $line
    104     done
    105 fi
    106 
    107 
    108 exit 0</pre>

     |

    * * *

    调用**bc**的另一种方法就是[here document](here-docs.md#HEREDOCREF), 并把它嵌入到[命令替换](commandsub.md#COMMANDSUBREF)块中. 当一个脚本需要将一个选项列表和多个命令传递到**bc**中时, 这种方法就显得非常合适了.

    | 

    <pre class="PROGRAMLISTING">  1 variable=`bc << LIMIT_STRING
      2 options
      3 statements
      4 operations
      5 LIMIT_STRING
      6 `
      7 
      8 ...or...
      9 
     10 
     11 variable=$(bc << LIMIT_STRING
     12 options
     13 statements
     14 operations
     15 LIMIT_STRING
     16 )</pre>

     |

    * * *

    **例子 12-44\. 使用<span class="QUOTE">"here document"</span>来调用**bc****

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 使用命令替换来调用'bc'
      3 # 并与'here document'相结合. 
      4 
      5 
      6 var1=`bc << EOF
      7 18.33 * 19.78
      8 EOF
      9 `
     10 echo $var1       # 362.56
     11 
     12 
     13 #  使用$( ... )这种标记法也可以. 
     14 v1=23.53
     15 v2=17.881
     16 v3=83.501
     17 v4=171.63
     18 
     19 var2=$(bc << EOF
     20 scale = 4
     21 a = ( $v1 + $v2 )
     22 b = ( $v3 * $v4 )
     23 a * b + 15.35
     24 EOF
     25 )
     26 echo $var2       # 593487.8452
     27 
     28 
     29 var3=$(bc -l << EOF
     30 scale = 9
     31 s ( 1.7 )
     32 EOF
     33 )
     34 # 返回弧度为1.7的正弦. 
     35 # "-l"选项将会调用'bc'算数库. 
     36 echo $var3       # .991664810
     37 
     38 
     39 # 现在, 在函数中试一下...
     40 hyp=             # 声明全局变量. 
     41 hypotenuse ()    # 计算直角三角形的斜边. 
     42 {
     43 hyp=$(bc -l << EOF
     44 scale = 9
     45 sqrt ( $1 * $1 + $2 * $2 )
     46 EOF
     47 )
     48 # 不幸的是, 不能从bash函数中返回浮点值. 
     49 }
     50 
     51 hypotenuse 3.68 7.31
     52 echo "hypotenuse = $hyp"    # 8.184039344
     53 
     54 
     55 exit 0</pre>

     |

    * * *

    * * *

    **例子 12-45\. 计算圆周率**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # cannon.sh: Approximating PI by firing cannonballs.
      3 
      4 # 这事实上是一个"Monte Carlo"蒙特卡洛模拟的非常简单的实例:
      5 #+ 蒙特卡洛模拟是一种由现实事件抽象出来的数学模型,
      6 #+ 由于要使用随机抽样统计来估算数学函数, 所以使用伪随机数来模拟真正的随机数.
      7 
      8 #  想象有一个完美的正方形土地, 边长为10000个单位.
      9 #  在这块土地的中间有一个完美的圆形湖,
     10 #+ 这个湖的直径是10000个单位.
     11 #  这块土地的绝大多数面积都是水, 当然只有4个角上有一些土地.
     12 #  (可以把这个湖想象成为这个正方形的内接圆.)
     13 #
     14 #  我们将使用老式的大炮和铁炮弹
     15 #+ 向这块正方形的土地上开炮.
     16 #  所有的炮弹都会击中这块正方形土地的某个地方.
     17 #+ 或者是打到湖上, 或者是打到4个角的土地上.
     18 #  因为这个湖占据了这个区域大部分地方,
     19 #+ 所以大部分的炮弹都会"扑通"一声落到水里.
     20 #  而只有很少的炮弹会"砰"的一声落到4个
     21 #+ 角的土地上.
     22 #
     23 #  如果我们发出的炮弹足够随机的落到这块正方形区域中的话,
     24 #+ 那么落到水里的炮弹与打出炮弹总数的比率,
     25 #+ 大概非常接近于PI/4.
     26 #
     27 #  原因是所有的炮弹事实上都
     28 #+ 打在了这个土地的右上角,
     29 #+ 也就是, 笛卡尔坐标系的第一象限.
     30 #  (之前的解释只是一个简化.)
     31 #
     32 #  理论上来说, 如果打出的炮弹越多, 就越接近这个数字.
     33 #  然而, 对于shell 脚本来说一定会做些让步的,
     34 #+ 因为它肯定不能和那些内建就支持浮点运算的编译语言相比.
     35 #  当然就会降低精度.
     36 
     37 
     38 DIMENSION=10000  # 这块土地的边长.
     39                  # 这也是所产生随机整数的上限.
     40                                                                          
     41 MAXSHOTS=1000    # 开炮次数.
     42                  # 10000或更多次的话, 效果应该更好, 但有点太浪费时间了.
     43 PMULTIPLIER=4.0  # 接近于PI的比例因子.
     44 
     45 get_random ()
     46 {
     47 SEED=$(head -1 /dev/urandom | od -N 1 | awk '{ print $2 }')
     48 RANDOM=$SEED                                  #  来自于"seeding-random.sh"
     49                                               #+ 的例子脚本.
     50 let "rnum = $RANDOM % $DIMENSION"             #  范围小于10000.
     51 echo $rnum
     52 }
     53 
     54 distance=        # 声明全局变量.
     55 hypotenuse ()    # 从"alt-bc.sh"例子来的,
     56 {                # 计算直角三角形的斜边的函数.
     57 distance=$(bc -l << EOF
     58 scale = 0
     59 sqrt ( $1 * $1 + $2 * $2 )
     60 EOF
     61 )
     62 #  设置 "scale" 为 0 , 好让结果四舍五入为整数值,
     63 #+ 这也是这个脚本中必须折中的一个地方.
     64 #  不幸的是, 这将降低模拟的精度.
     65 }
     66 
     67 
     68 # main() {
     69 
     70 # 初始化变量. 
     71 shots=0
     72 splashes=0
     73 thuds=0
     74 Pi=0
     75 
     76 while [ "$shots" -lt  "$MAXSHOTS" ]           # 主循环.
     77 do                                                                      
     78                                                                         
     79   xCoord=$(get_random)                        # 取得随机的 X 与 Y 坐标.
     80   yCoord=$(get_random)                                                  
     81   hypotenuse $xCoord $yCoord                  #  直角三角形斜边 =
     82                                               #+ distance.
     83   ((shots++))                                                           
     84                                                                         
     85   printf "#%4d   " $shots                                               
     86   printf "Xc = %4d  " $xCoord                                           
     87   printf "Yc = %4d  " $yCoord                                           
     88   printf "Distance = %5d  " $distance         #  到湖中心的
     89                                               #+ 距离 --
     90                                               #  起始坐标点 --
     91                                               #+  (0,0).
     92 
     93   if [ "$distance" -le "$DIMENSION" ]
     94   then
     95     echo -n "SPLASH!  "
     96     ((splashes++))
     97   else
     98     echo -n "THUD!    "
     99     ((thuds++))
    100   fi
    101 
    102   Pi=$(echo "scale=9; $PMULTIPLIER*$splashes/$shots" | bc)
    103   # 将比例乘以4.0.
    104   echo -n "PI ~ $Pi"
    105   echo
    106 
    107 done
    108 
    109 echo
    110 echo "After $shots shots, PI looks like approximately $Pi."
    111 # 如果不太准的话, 那么就提高一下运行的次数. . .
    112 # 可能是由于运行错误和随机数随机程度不高造成的.
    113 echo
    114 
    115 # }
    116 
    117 exit 0
    118 
    119 #  要想知道一个shell脚本到底适不适合对计算应用进行模拟的话?
    120 #+ (一种需要对复杂度和精度都有要求的计算应用).
    121 #
    122 #  一般至少需要两个判断条件.
    123 #  1) 作为一种概念的验证: 来显示它可以做到. 
    124 #  2) 在使用真正的编译语言来实现一个算法之前, 
    125 #+    使用脚本来测试和验证这个算法. </pre>

     |

    * * *

*   **dc**
*   **dc**(桌面计算器**d**esk **c**alculator)工具是面向栈的, 并且使用RPN(逆波兰表达式<span class="QUOTE">"Reverse Polish Notation"</span>又叫<span class="QUOTE">"后缀表达式"</span>). 与**bc**命令很相似, 但是这个工具具备好多只有编程语言才具备的能力.

    | 

    <pre class="PROGRAMLISTING">  1 (
      2 译者注: 正常表达式      逆波兰表达式
      3         a+b             a,b,+
      4         a+(b-c)         a,b,c,-,+
      5         a+(b-c)*d       a,d,b,c,-,*,+
      6 )
      7 		</pre>

     |

    绝大多数人都避免使用这个工具, 因为它需要非直观的RPN输入, 但是, 它却有特定的用途.

    * * *

    **例子 12-46\. 将10进制数字转换为16进制数字**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # hexconvert.sh: 将10进制数字转换为16进制数字.
      3 
      4 E_NOARGS=65 # 缺少命令行参数错误.
      5 BASE=16     # 16进制.
      6 
      7 if [ -z "$1" ]
      8 then
      9   echo "Usage: $0 number"
     10   exit $E_NOARGS
     11   # 需要一个命令行参数. 
     12 fi
     13 # 练习: 添加命令行参数检查. 
     14 
     15 
     16 hexcvt ()
     17 {
     18 if [ -z "$1" ]
     19 then
     20   echo 0
     21   return    # 如果没有参数传递到这个函数中的话就"return" 0.
     22 fi
     23 
     24 echo ""$1" "$BASE" o p" | dc
     25 #                 "o" 设置输出的基数(数制).
     26 #                   "p" 打印栈顶.
     27 # 参考dc的man页来了解其他的选项. 
     28 return
     29 }
     30 
     31 hexcvt "$1"
     32 
     33 exit 0</pre>

     |

    * * *

    通过仔细学习**dc**的_info_页, 可以更深入的理解这个复杂的命令. 但是, 有一些精通_dc巫术_小组经常会炫耀他们使用这个强大而又晦涩难懂的工具时的一些技巧, 并以此为乐.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo "16i[q]sa[ln0=aln100%Pln100/snlbx]sbA0D68736142snlbxq" | dc"</kbd>
    <samp class="COMPUTEROUTPUT">Bash</samp>
    	      </pre>

     |

    * * *

    **例子 12-47\. 因子分解**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # factr.sh: 分解约数
      3 
      4 MIN=2       # 如果比这个数小就不行了.
      5 E_NOARGS=65
      6 E_TOOSMALL=66
      7 
      8 if [ -z $1 ]
      9 then
     10   echo "Usage: $0 number"
     11   exit $E_NOARGS
     12 fi
     13 
     14 if [ "$1" -lt "$MIN" ]
     15 then
     16   echo "Number to factor must be $MIN or greater."
     17   exit $E_TOOSMALL
     18 fi  
     19 
     20 # 练习: 添加类型检查(防止非整型的参数).
     21 
     22 echo "Factors of $1:"
     23 # ---------------------------------------------------------------------------------
     24 echo "$1[p]s2[lip/dli%0=1dvsr]s12sid2%0=13sidvsr[dli%0=1lrli2+dsi!>.]ds.xd1<2" | dc
     25 # ---------------------------------------------------------------------------------
     26 # 上边这行代码是Michel Charpentier编写的<charpov@cs.unh.edu>.
     27 # 在此使用经过授权(感谢). 
     28 
     29  exit 0</pre>

     |

    * * *

*   **awk**
*   在脚本中使用浮点运算的另一种方法是使用[awk](awk.md#AWKREF)内建的数学运算函数, 可以用在[shell包装](wrapper.md#SHWRAPPER)中.

    * * *

    **例子 12-48\. 计算直角三角形的斜边**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # hypotenuse.sh: 返回直角三角形的斜边. 
      3 #               (直角边长的平方和,然后对和取平方根)
      4 
      5 ARGS=2                # 需要将2个直角边作为参数传递进来. 
      6 E_BADARGS=65          # 错误的参数值.
      7 
      8 if [ $# -ne "$ARGS" ] # 测试传递到脚本中的参数值.
      9 then
     10   echo "Usage: `basename $0` side_1 side_2"
     11   exit $E_BADARGS
     12 fi
     13 
     14 
     15 AWKSCRIPT=' { printf( "%3.7f\n", sqrt($1*$1 + $2*$2) ) } '
     16 #             命令 / 传递给awk的参数
     17 
     18 
     19 # 现在, 将参数通过管道传递给awk. 
     20 echo -n "Hypotenuse of $1 and $2 = "
     21 echo $1 $2 | awk "$AWKSCRIPT"
     22 
     23 exit 0</pre>

     |

    * * *