# 9.6\. $RANDOM: 产生随机整数

`$RANDOM`是Bash的内部[函数](functions.md#FUNCTIONREF) (并不是常量), 这个函数将返回一个_伪随机_ [[1]](#FTN.AEN5276) 整数, 范围在0 - 32767之间. 它<tt class="REPLACEABLE">_不_</tt>应该被用来产生密匙.

* * *

**例子 9-25\. 产生随机整数**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 # 每次调用$RANDOM都会返回不同的随机整数. 
  4 # 一般范围为: 0 - 32767 (有符号的16-bit整数).
  5 
  6 MAXCOUNT=10
  7 count=1
  8 
  9 echo
 10 echo "$MAXCOUNT random numbers:"
 11 echo "-----------------"
 12 while [ "$count" -le $MAXCOUNT ]      # 产生10 ($MAXCOUNT)个随机整数.
 13 do
 14   number=$RANDOM
 15   echo $number
 16   let "count += 1"  # 增加计数.
 17 done
 18 echo "-----------------"
 19 
 20 # 如果你需要在特定范围内产生随机整数, 那么使用'modulo'(模)操作.(译者注: 事实上, 这不是一个非常好的办法. 理由见man 3 rand)
 21 # 取模操作会返回除法的余数.
 22 
 23 RANGE=500
 24 
 25 echo
 26 
 27 number=$RANDOM
 28 let "number %= $RANGE"
 29 #           ^^
 30 echo "Random number less than $RANGE  ---  $number"
 31 
 32 echo
 33 
 34 
 35 
 36 #  如果你需要产生一个大于某个下限的随机整数.
 37 #+ 那么建立一个test循环来丢弃所有小于此下限值的整数. 
 38 
 39 FLOOR=200
 40 
 41 number=0   #初始化
 42 while [ "$number" -le $FLOOR ]
 43 do
 44   number=$RANDOM
 45 done
 46 echo "Random number greater than $FLOOR ---  $number"
 47 echo
 48 
 49    # 让我们对上边的循环尝试一个小改动, 如下:
 50    #       let "number = $RANDOM + $FLOOR"
 51    # 这将不再需要那个while循环, 并且能够运行的更快.
 52    # 但是, 这可能会产生一个问题, 思考一下是什么问题?
 53 
 54 
 55 
 56 # 结合上边两个例子, 来在指定的上下限之间来产生随机数.
 57 number=0   #initialize
 58 while [ "$number" -le $FLOOR ]
 59 do
 60   number=$RANDOM
 61   let "number %= $RANGE"  # 让$number依比例落在$RANGE的范围内.
 62 done
 63 echo "Random number between $FLOOR and $RANGE ---  $number"
 64 echo
 65 
 66 
 67 
 68 # 产生二元值, 就是, "true" 或 "false" 两个值.
 69 BINARY=2
 70 T=1
 71 number=$RANDOM
 72 
 73 let "number %= $BINARY"
 74 #  注意 let "number >>= 14"    将会给出一个更好的随机分配. #(译者注: 正如man页中提到的, 更高位的随机分布更加平均)
 75 #+ (右移14位将把所有的位全部清空, 除了第15位, 因为有符号, 第16位是符号位). #取模操作使用低位来产生随机数会相对不平均)
 76 if [ "$number" -eq $T ]
 77 then
 78   echo "TRUE"
 79 else
 80   echo "FALSE"
 81 fi  
 82 
 83 echo
 84 
 85 
 86 # 抛骰子.
 87 SPOTS=6   # 模6给出的范围是0 - 5.
 88           # 加1会得到期望的范围1 - 6.
 89           # 感谢, Paulo Marcel Coelho Aragao, 对此进行的简化.
 90 die1=0
 91 die2=0
 92 # 是否让SPOTS=7会比加1更好呢? 解释行或者不行的原因?
 93 
 94 # 每次抛骰子, 都会给出均等的机会.
 95 
 96     let "die1 = $RANDOM % $SPOTS +1" # 抛第一次.
 97     let "die2 = $RANDOM % $SPOTS +1" # 抛第二次.
 98     #  上边的算术操作中, 哪个具有更高的优先级呢 --
 99     #+ 模(%) 还是加法操作(+)?
100 
101 
102 let "throw = $die1 + $die2"
103 echo "Throw of the dice = $throw"
104 echo
105 
106 
107 exit 0</pre>

 |

* * *

* * *

**例子 9-26\. 从一幅扑克牌中取出一张随机的牌**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # pick-card.sh
  3 
  4 # 这是一个从数组中取出随机元素的一个例子.
  5 
  6 
  7 # 抽取一张牌, 任何一张.
  8 
  9 Suites="Clubs
 10 Diamonds
 11 Hearts
 12 Spades"
 13 
 14 Denominations="2
 15 3
 16 4
 17 5
 18 6
 19 7
 20 8
 21 9
 22 10
 23 Jack
 24 Queen
 25 King
 26 Ace"
 27 
 28 # 注意变量的多行展开.
 29 
 30 
 31 suite=($Suites)                # 读入一个数组.
 32 denomination=($Denominations)
 33 
 34 num_suites=${#suite[*]}        # 计算有多少个数组元素.
 35 num_denominations=${#denomination[*]}
 36 
 37 echo -n "${denomination[$((RANDOM%num_denominations))]} of "
 38 echo ${suite[$((RANDOM%num_suites))]}
 39 
 40 
 41 # $bozo sh pick-cards.sh
 42 # Jack of Clubs
 43 
 44 
 45 # 感谢, "jipe," 指出$RANDOM的这个用法.
 46 exit 0</pre>

 |

* * *

_Jipe_展示了一套技巧来在一个指定范围内产生随机数.

| 

<pre class="PROGRAMLISTING">  1 #  在6 到 30之间产生随机数.
  2    rnumber=$((RANDOM%25+6))	
  3 
  4 #  还是在6 - 30之间产生随机数,
  5 #+ 但是这个数还必须能够被3整除.
  6    rnumber=$(((RANDOM%30/3+1)*3))
  7 
  8 #  注意, 并不是在所有情况下都能正确运行.
  9 #  如果$RANDOM返回0, 那么就会失败.
 10 
 11 #  Frank Wang 建议用下边的方法:
 12    rnumber=$(( RANDOM%27/3*3+6 ))</pre>

 |

_Bill Gradwohl_给出了一个改良公式, 这个公式只适用于正书.

| 

<pre class="PROGRAMLISTING">  1 rnumber=$(((RANDOM%(max-min+divisibleBy))/divisibleBy*divisibleBy+min))</pre>

 |

这里Bill展示了一个通用公式, 这个函数返回两个指定值之间的随机数.

* * *

**例子 9-27\. 两个指定值之间的随机数**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # random-between.sh
  3 # 产生两个指定值之间的随机数.
  4 # 由Bill Gradwohl编写, 本书作者做了一些修改.
  5 # 脚本作者允许在这里使用.
  6 
  7 
  8 randomBetween() {
  9    #  在$min和$max之间,
 10    #+ 产生一个正的或负的随机数.
 11    #+ 并且可以被$divisibleBy所整除.
 12    #  给出一个合理的随机分配的返回值.
 13    #
 14    #  Bill Gradwohl - Oct 1, 2003
 15 
 16    syntax() {
 17    # 在函数中内嵌函数
 18       echo
 19       echo    "Syntax: randomBetween [min] [max] [multiple]"
 20       echo
 21       echo    "Expects up to 3 passed parameters, but all are completely optional."
 22       echo    "min is the minimum value"
 23       echo    "max is the maximum value"
 24       echo    "multiple specifies that the answer must be a multiple of this value."
 25       echo    "    i.e. answer must be evenly divisible by this number."
 26       echo    
 27       echo    "If any value is missing, defaults area supplied as: 0 32767 1"
 28       echo    "Successful completion returns 0, unsuccessful completion returns"
 29       echo    "function syntax and 1."
 30       echo    "The answer is returned in the global variable randomBetweenAnswer"
 31       echo    "Negative values for any passed parameter are handled correctly."
 32    }
 33 
 34    local min=${1:-0}
 35    local max=${2:-32767}
 36    local divisibleBy=${3:-1}
 37    # 默认值分配, 用来处理没有参数传递进来的情况.
 38 
 39    local x
 40    local spread
 41 
 42    # 确认divisibleBy是正值.
 43    [ ${divisibleBy} -lt 0 ] && divisibleBy=$((0-divisibleBy))
 44 
 45    # 完整性检查.
 46    if [ $# -gt 3 -o ${divisibleBy} -eq 0 -o  ${min} -eq ${max} ]; then 
 47       syntax
 48       return 1
 49    fi
 50 
 51    # 查看min和max是否颠倒了.
 52    if [ ${min} -gt ${max} ]; then
 53       # 交换它们.
 54       x=${min}
 55       min=${max}
 56       max=${x}
 57    fi
 58 
 59    #  如果min自己并不能够被$divisibleBy所整除,
 60    #+ 那么就调整max的值, 使其能够被$divisibleBy所整除, 前提是不能放大范围.
 61    if [ $((min/divisibleBy*divisibleBy)) -ne ${min} ]; then 
 62       if [ ${min} -lt 0 ]; then
 63          min=$((min/divisibleBy*divisibleBy))
 64       else
 65          min=$((((min/divisibleBy)+1)*divisibleBy))
 66       fi
 67    fi
 68 
 69    #  如果min自己并不能够被$divisibleBy所整除,
 70    #+ 那么就调整max的值, 使其能够被$divisibleBy所整除, 前提是不能放大范围.
 71    if [ $((max/divisibleBy*divisibleBy)) -ne ${max} ]; then 
 72       if [ ${max} -lt 0 ]; then
 73          max=$((((max/divisibleBy)-1)*divisibleBy))
 74       else
 75          max=$((max/divisibleBy*divisibleBy))
 76       fi
 77    fi
 78 
 79    #  ---------------------------------------------------------------------
 80    #  现在, 来做点真正的工作.
 81 
 82    #  注意, 为了得到对于端点来说合适的分配,
 83    #+ 随机值的范围不得不落在
 84    #+ 0 和 abs(max-min)+divisibleBy 之间, 而不是 abs(max-min)+1.
 85 
 86    #  对于端点来说,
 87    #+ 这个少量的增加将会产生合适的分配.
 88 
 89    #  如果修改这个公式, 使用 abs(max-min)+1 来代替 abs(max-min)+divisibleBy的话, 
 90    #+ 也能够得到正确的答案, 但是在这种情况下所生成的随机值对于正好为端点倍数
 91    #+ 的这种情况来说将是不完美的, 因为正好为端点倍数情况下的随机率比较低,
 92    #+ 因为你才加1而已, 这比正常的公式下所产生的几率要小的多(正常为加divisibleBy).
 93    #  ---------------------------------------------------------------------
 94 
 95    spread=$((max-min))
 96    [ ${spread} -lt 0 ] && spread=$((0-spread))
 97    let spread+=divisibleBy
 98    randomBetweenAnswer=$(((RANDOM%spread)/divisibleBy*divisibleBy+min))   
 99 
100    return 0
101 
102    #  然而, Paulo Marcel Coelho Aragao 指出
103    #+ 当 $max 和 $min 不能够被$divisibleBy所整除时,
104    #+ 这个公式将会失败.
105    #
106    #  他建议使用如下公式:
107    #    rnumber = $(((RANDOM%(max-min+1)+min)/divisibleBy*divisibleBy))
108 
109 }
110 
111 # 让我们测试一下这个函数.
112 min=-14
113 max=20
114 divisibleBy=3
115 
116 
117 #  产生一个所期望的数组answers, 数组下标用来表示在范围内可能出现的值,
118 #+ 而元素内容记录的是这个值所出现的次数, 如果我们循环足够多次, 那么我们一定会得到至少一次出现机会.
119 
120 declare -a answer
121 minimum=${min}
122 maximum=${max}
123    if [ $((minimum/divisibleBy*divisibleBy)) -ne ${minimum} ]; then 
124       if [ ${minimum} -lt 0 ]; then
125          minimum=$((minimum/divisibleBy*divisibleBy))
126       else
127          minimum=$((((minimum/divisibleBy)+1)*divisibleBy))
128       fi
129    fi
130 
131 
132 132    #  如果max本身并不能够被$divisibleBy整除,
133 133    #+ 那么就调整max的值, 使其能够被$divisibleBy整除, 前提是不能放大范围.
134 
135    if [ $((maximum/divisibleBy*divisibleBy)) -ne ${maximum} ]; then 
136       if [ ${maximum} -lt 0 ]; then
137          maximum=$((((maximum/divisibleBy)-1)*divisibleBy))
138       else
139          maximum=$((maximum/divisibleBy*divisibleBy))
140       fi
141    fi
142 
143 
144 #  我们需要产生一个下标全部为正的数组.
145 #+ 所以我们需要一个displacement, 
146 #+ 这样就可以保证结果都为正. 
147 
148 displacement=$((0-minimum))
149 for ((i=${minimum}; i<=${maximum}; i+=divisibleBy)); do
150    answer[i+displacement]=0
151 done
152 
153 
154 # 现在, 让我们循环足够多的次数, 来得到我们想要的答案.
155 loopIt=1000   #  脚本作者建议循环 100000 次,
156               #+ 但是这需要的时间太长了.
157 
158 for ((i=0; i<${loopIt}; ++i)); do
159 
160    #  注意, 我们在这里调用randomBetweenAnswer函数时, 估计将min和max颠倒顺序.
161    #+ 这是为了测试在这种情况下, 此函数是否还能正确的运行.
162 
163    randomBetween ${max} ${min} ${divisibleBy}
164 
165    # 如果答案不是我们所期望的, 就报错.
166    [ ${randomBetweenAnswer} -lt ${min} -o ${randomBetweenAnswer} -gt ${max} ] && echo MIN or MAX error - ${randomBetweenAnswer}!
167    [ $((randomBetweenAnswer%${divisibleBy})) -ne 0 ] && echo DIVISIBLE BY error - ${randomBetweenAnswer}!
168 
169    # 将统计值保存到answer中.
170    answer[randomBetweenAnswer+displacement]=$((answer[randomBetweenAnswer+displacement]+1))
171 done
172 
173 
174 
175 # 让我们来察看一下结果.
176 
177 for ((i=${minimum}; i<=${maximum}; i+=divisibleBy)); do
178    [ ${answer[i+displacement]} -eq 0 ] && echo "We never got an answer of $i." || echo "${i} occurred ${answer[i+displacement]} times."
179 done
180 
181 
182 exit 0</pre>

 |

* * *

`$RANDOM`到底有多随机? 最好的方法就是编写脚本来测试一下, 跟踪`$RANDOM`所产生的<span class="QUOTE">"随机"</span>数的分布情况. 让我们用`$RANDOM`来摇骰子. . .

* * *

**例子 9-28\. 用随机数来摇单个骰子**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # RANDOM到底有多随机?
  3 
  4 RANDOM=$       # 使用脚本的进程ID来作为随机数的种子.
  5 
  6 PIPS=6          # 一个骰子有6个面.
  7 MAXTHROWS=600   # 如果你没别的事做, 可以增加这个数值.
  8 throw=0         # 抛骰子的次数.
  9 
 10 ones=0          #  必须把所有的count都初始化为0,
 11 twos=0          #+ 因为未初始化的变量为null, 不是0.
 12 threes=0
 13 fours=0
 14 fives=0
 15 sixes=0
 16 
 17 print_result ()
 18 {
 19 echo
 20 echo "ones =   $ones"
 21 echo "twos =   $twos"
 22 echo "threes = $threes"
 23 echo "fours =  $fours"
 24 echo "fives =  $fives"
 25 echo "sixes =  $sixes"
 26 echo
 27 }
 28 
 29 update_count()
 30 {
 31 case "$1" in
 32   0) let "ones += 1";;   # 因为骰子没有"零", 所以给1.
 33   1) let "twos += 1";;   # 把这个设为2, 后边也一样.
 34   2) let "threes += 1";;
 35   3) let "fours += 1";;
 36   4) let "fives += 1";;
 37   5) let "sixes += 1";;
 38 esac
 39 }
 40 
 41 echo
 42 
 43 
 44 while [ "$throw" -lt "$MAXTHROWS" ]
 45 do
 46   let "die1 = RANDOM % $PIPS"
 47   update_count $die1
 48   let "throw += 1"
 49 done  
 50 
 51 print_result
 52 
 53 exit 0
 54 
 55 #  如果RANDOM是真正的随机, 那么摇出来结果应该是平均的.
 56 #  把$MAXTHROWS设为600, 那么每个面应该是100, 上下的出入不应该超过20.
 57 #
 58 #  记住RANDOM毕竟是一个伪随机数,
 59 #+ 并且不是十分完美.
 60 
 61 #  随机数的生成是一个十分深奥并复杂的问题.
 62 #  足够长的随机序列, 不但会展现其杂乱无章的一面,
 63 #+ 同样也会展现其机会均等的一面.
 64 
 65 # 练习 (很简单):
 66 # --------------
 67 # 重写这个脚本, 做成抛1000次硬币的形式.
 68 # 分为"头"和"字"两面.</pre>

 |

* * *

就像我们在上边的例子中所看到的, 最好在每次产生`RANDOM`的时候都使用新的种子. 因为如果使用同样种子的话, 那么`RANDOM`将会产生相同的序列. [[2]](#FTN.AEN5309) (_C_语言中的<tt class="REPLACEABLE">_random()_</tt>函数也会有这样的行为.)

* * *

**例子 9-29\. 重新分配随机数种子**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # seeding-random.sh: 设置RANDOM变量作为种子.
  3 
  4 MAXCOUNT=25       # 决定产生多少个随机数.
  5 
  6 random_numbers ()
  7 {
  8 count=0
  9 while [ "$count" -lt "$MAXCOUNT" ]
 10 do
 11   number=$RANDOM
 12   echo -n "$number "
 13   let "count += 1"
 14 done  
 15 }
 16 
 17 echo; echo
 18 
 19 RANDOM=1          # 为随机数的产生来设置RANDOM种子.
 20 random_numbers
 21 
 22 echo; echo
 23 
 24 RANDOM=1          # 设置同样的种子...
 25 random_numbers    # ...将会和上边产生的随机序列相同.
 26                   #
 27                   # 复制一个相同的"随机"序列在什么情况下有用呢?
 28 
 29 echo; echo
 30 
 31 RANDOM=2          # 在试一次, 但是这次使用不同的种子...
 32 random_numbers    # 这次将得到一个不同的随机序列.
 33 
 34 echo; echo
 35 
 36 # RANDOM=$  使用脚本的进程ID来作为产生随机数的种子.
 37 # 从 'time' 或 'date' 命令中取得RANDOM作为种子也是常用的做法.
 38 
 39 # 一个很有想象力的方法...
 40 SEED=$(head -1 /dev/urandom | od -N 1 | awk '{ print $2 }')
 41 #  首先从/dev/urandom(系统伪随机设备文件)中取出一行,
 42 #+ 然后将这个可打印行转换为8进制数, 使用"od"命令来转换.
 43 #+ 最后使用"awk"来获得一个数,
 44 #+ 这个数将作为产生随机数的种子.
 45 RANDOM=$SEED
 46 random_numbers
 47 
 48 echo; echo
 49 
 50 exit 0</pre>

 |

* * *

| ![Note](./images/note.gif) | 

<tt class="FILENAME">/dev/urandom</tt>设备文件提供了一种比单独使用$RANDOM更好的, 能够产生更加<span class="QUOTE">"随机"</span>的随机数的方法. <kbd class="USERINPUT">dd if=/dev/urandom of=targetfile bs=1 count=XX</kbd>能够产生一个很分散的伪随机数序列. 然而, 如果想要将这个数赋值到一个脚本文件的变量中, 还需要可操作性, 比如使用[od](extmisc.md#ODREF)命令 (就像上边的例子, 还有[例子 12-13](textproc.md#RND)), 或者使用[dd](extmisc.md#DDREF)命令 (参见[例子 12-55](extmisc.md#BLOTOUT)), 或者通过管道传递到[md5sum](filearchiv.md#MD5SUMREF)命令中 (参见[例子 33-14](colorizing.md#HORSERACE)).

当然还有其他的产生伪随机数的方法. **awk**就能提供一个方便的方法来做到这点.

* * *

**例子 9-30\. 使用[awk](awk.md#AWKREF)来产生伪随机数**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # random2.sh: 产生一个范围在 0 - 1 之间的伪随机数.
  3 # 使用了awk的rand()函数.
  4 
  5 AWKSCRIPT=' { srand(); print rand() } '
  6 #            Command(s) / 传递到awk中的参数
  7 # 注意, srand()是awk中用来产生伪随机数种子的函数.
  8 
  9 
 10 echo -n "Random number between 0 and 1 = "
 11 
 12 echo | awk "$AWKSCRIPT"
 13 # 如果你省去'echo', 会怎样?
 14 
 15 exit 0
 16 
 17 
 18 # 练习:
 19 # -----
 20 
 21 # 1) 使用循环结构, 打印出10个不同的随机数.
 22 #      (提示: 在每次循环过程中, 你必须使用"srand()"函数来生成不同的种子,
 23 #+     如果你不这么做会怎样?)
 24 
 25 # 2) 使用整数乘法作为一个比例因子, 在10到100的范围之间,
 26 #+   来产生随机数.
 27 
 28 # 3) 同上边的练习#2, 但是这次产生随机整数.</pre>

 |

* * *

[date](timedate.md#DATEREF)命令也可以用来[产生伪随机整数序列](timedate.md#DATERANDREF).

 |

### 注意事项

| [[1]](randomvar.md#AEN5276) | 

真正的<span class="QUOTE">"随机事件, "</span>在它存在的范围内, 只发生在特定的几个未知的自然界现象中, 比如放射性衰变. 计算机只能产生模拟的随机事件, 并且计算机产生的<span class="QUOTE">"随机"</span>数只能称为_伪随机数_.

 |
| [[2]](randomvar.md#AEN5309) | 

计算机用来产生伪随机数的_种子_可以被看成是一种标识标签. 比如, 使用种子_23_所产生的随机序列就被称为_序列 #23_.

一个伪随机序列的特点就是在这个序列开始重复之前的所有元素个数的总和, 也就是这个序列的长度. 一个好的伪随机产生算法可以产生一个非常长的不重复序列.

 |