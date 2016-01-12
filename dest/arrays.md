# 26\. 数组

新版本的Bash支持一维数组. 数组元素可以使用符号<kbd class="USERINPUT">variable[xx]</kbd>来初始化. 另外, 脚本可以使用<kbd class="USERINPUT">declare -a variable</kbd>语句来指定一个数组. 如果想解引用一个数组元素(也就是取值), 可以使用_大括号_, 访问形式为<kbd class="USERINPUT">${variable[xx]}</kbd>.

* * *

**例子 26-1\. 简单的数组使用**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 
  4 area[11]=23
  5 area[13]=37
  6 area[51]=UFOs
  7 
  8 #  数组成员不一定非得是相邻或连续的. 
  9 
 10 #  数组的部分成员可以不被初始化. 
 11 #  数组中允许空缺元素. 
 12 #  实际上, 保存着稀疏数据的数组("稀疏数组")
 13 #+ 在电子表格处理软件中是非常有用的. 
 14 
 15 
 16 echo -n "area[11] = "
 17 echo ${area[11]}    #  需要{大括号}. 
 18 
 19 echo -n "area[13] = "
 20 echo ${area[13]}
 21 
 22 echo "Contents of area[51] are ${area[51]}."
 23 
 24 # 没被初始化的数组成员打印为空值(null变量). 
 25 echo -n "area[43] = "
 26 echo ${area[43]}
 27 echo "(area[43] unassigned)"
 28 
 29 echo
 30 
 31 # 两个数组元素的和被赋值给另一个数组元素
 32 area[5]=`expr ${area[11]} + ${area[13]}`
 33 echo "area[5] = area[11] + area[13]"
 34 echo -n "area[5] = "
 35 echo ${area[5]}
 36 
 37 area[6]=`expr ${area[11]} + ${area[51]}`
 38 echo "area[6] = area[11] + area[51]"
 39 echo -n "area[6] = "
 40 echo ${area[6]}
 41 # 这里会失败, 是因为不允许整数与字符串相加. 
 42 
 43 echo; echo; echo
 44 
 45 # -----------------------------------------------------------------
 46 # 另一个数组, "area2".
 47 # 另一种给数组变量赋值的方法...
 48 # array_name=( XXX YYY ZZZ ... )
 49 
 50 area2=( zero one two three four )
 51 
 52 echo -n "area2[0] = "
 53 echo ${area2[0]}
 54 # 阿哈, 从0开始计算数组下标(也就是数组的第一个元素为[0], 而不是[1]). 
 55 
 56 echo -n "area2[1] = "
 57 echo ${area2[1]}    # [1]是数组的第2个元素. 
 58 # -----------------------------------------------------------------
 59 
 60 echo; echo; echo
 61 
 62 # -----------------------------------------------
 63 # 第3个数组, "area3".
 64 # 第3种给数组元素赋值的方法...
 65 # array_name=([xx]=XXX [yy]=YYY ...)
 66 
 67 area3=([17]=seventeen [24]=twenty-four)
 68 
 69 echo -n "area3[17] = "
 70 echo ${area3[17]}
 71 
 72 echo -n "area3[24] = "
 73 echo ${area3[24]}
 74 # -----------------------------------------------
 75 
 76 exit 0</pre>

 |

* * *

| ![Note](./images/note.gif) | 

Bash允许把变量当成数组来操作, 即使这个变量没有明确地被声明为数组.

| 

<pre class="PROGRAMLISTING">  1 string=abcABC123ABCabc
  2 echo ${string[@]}               # abcABC123ABCabc
  3 echo ${string[*]}               # abcABC123ABCabc 
  4 echo ${string[0]}               # abcABC123ABCabc
  5 echo ${string[1]}               # 没有输出! 
  6                                 # 为什么? 
  7 echo ${#string[@]}              # 1
  8                                 # 数组中只有一个元素. 
  9                                 # 就是这个字符串本身. 
 10 
 11 # 感谢, Michael Zick, 指出这一点. </pre>

 |

类似的示范可以参考[Bash变量是无类型的](untyped.md#BVUNTYPED). |

* * *

**例子 26-2\. 格式化一首诗**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # poem.sh: 将本书作者非常喜欢的一首诗, 漂亮的打印出来. 
  3 
  4 # 诗的行数(单节). 
  5 Line[1]="I do not know which to prefer,"
  6 Line[2]="The beauty of inflections"
  7 Line[3]="Or the beauty of innuendoes,"
  8 Line[4]="The blackbird whistling"
  9 Line[5]="Or just after."
 10 
 11 # 出处. 
 12 Attrib[1]=" Wallace Stevens"
 13 Attrib[2]="\"Thirteen Ways of Looking at a Blackbird\""
 14 # 这首诗已经是公共版权了(版权已经过期了). 
 15 
 16 echo
 17 
 18 for index in 1 2 3 4 5    # 5行. 
 19 do
 20   printf "     %s\n" "${Line[index]}"
 21 done
 22 
 23 for index in 1 2          # 出处为2行. 
 24 do
 25   printf "          %s\n" "${Attrib[index]}"
 26 done
 27 
 28 echo
 29 
 30 exit 0
 31 
 32 # 练习:
 33 # -----
 34 # 修改这个脚本, 使其能够从一个文本数据文件中提取出一首诗的内容, 然后将其漂亮的打印出来. </pre>

 |

* * *

数组元素有它们独特的语法, 甚至标准Bash命令和操作符, 都有特殊的选项用以配合数组操作.

* * *

**例子 26-3\. 多种数组操作**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # array-ops.sh: 更多有趣的数组用法. 
  3 
  4 
  5 array=( zero one two three four five )
  6 # 数组元素 0   1   2    3     4    5
  7 
  8 echo ${array[0]}       #  0
  9 echo ${array:0}        #  0
 10                        #  第一个元素的参数扩展, 
 11                        #+ 从位置0(#0)开始(即第一个字符). 
 12 echo ${array:1}        #  ero
 13                        #  第一个元素的参数扩展, 
 14                        #+ 从位置1(#1)开始(即第2个字符). 
 15 
 16 echo "--------------"
 17 
 18 echo ${#array[0]}      #  4
 19                        #  第一个数组元素的长度. 
 20 echo ${#array}         #  4
 21                        #  第一个数组元素的长度. 
 22                        #  (另一种表示形式)
 23 
 24 echo ${#array[1]}      #  3
 25                        #  第二个数组元素的长度. 
 26                        #  Bash中的数组是从0开始索引的. 
 27 
 28 echo ${#array[*]}      #  6
 29                        #  数组中的元素个数. 
 30 echo ${#array[@]}      #  6
 31                        #  数组中的元素个数.
 32 
 33 echo "--------------"
 34 
 35 array2=( [0]="first element" [1]="second element" [3]="fourth element" )
 36 
 37 echo ${array2[0]}      # 第一个元素
 38 echo ${array2[1]}      # 第二个元素
 39 echo ${array2[2]}      #
 40                        # 因为并没有被初始化, 所以此值为null. 
 41 echo ${array2[3]}      # 第四个元素
 42 
 43 
 44 exit 0</pre>

 |

* * *

大部分标准[字符串操作](string-manipulation.md#STRINGMANIP)都可以用于数组中.

* * *

**例子 26-4\. 用于数组的字符串操作**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # array-strops.sh: 用于数组的字符串操作. 
  3 # 本脚本由Michael Zick所编写. 
  4 # 授权使用在本书中. 
  5 
  6 #  一般来说, 任何类似于${name ... }(这种形式)的字符串操作
  7 #+ 都能够应用于数组中的所有字符串元素, 
  8 #+ 比如说${name[@] ... }或${name[*] ...}这两种形式. 
  9 
 10 
 11 arrayZ=( one two three four five five )
 12 
 13 echo
 14 
 15 # 提取尾部的子串
 16 echo ${arrayZ[@]:0}     # one two three four five five
 17                         # 所有元素. 
 18 
 19 echo ${arrayZ[@]:1}     # two three four five five
 20                         # element[0]后边的所有元素. 
 21 
 22 echo ${arrayZ[@]:1:2}   # two three
 23                         # 只提取element[0]后边的两个元素. 
 24 
 25 echo "-----------------------"
 26 
 27 #  子串删除
 28 #  从字符串的开头删除最短的匹配, 
 29 #+ 匹配的子串也可以是正则表达式. 
 30 
 31 echo ${arrayZ[@]#f*r}   # one two three five five
 32                         # 匹配将应用于数组的所有元素. 
 33                         # 匹配到了"four", 并且将它删除. 
 34 
 35 # 从字符串的开头删除最长的匹配
 36 echo ${arrayZ[@]##t*e}  # one two four five five
 37                         # 匹配将应用于数组的所有元素. 
 38                         # 匹配到了"three", 并且将它删除. 
 39 
 40 # 从字符串的结尾删除最短的匹配
 41 echo ${arrayZ[@]%h*e}   # one two t four five five
 42                         # 匹配将应用于数组的所有元素. 
 43                         # 匹配到了"hree", 并且将它删除. 
 44 
 45 # 从字符串的结尾删除最长的匹配
 46 echo ${arrayZ[@]%%t*e}  # one two four five five
 47                         # 匹配将应用于数组的所有元素. 
 48                         # 匹配到了"three", 并且将它删除. 
 49 
 50 echo "-----------------------"
 51 
 52 # 子串替换
 53 
 54 # 第一个匹配到的子串将会被替换
 55 echo ${arrayZ[@]/fiv/XYZ}   # one two three four XYZe XYZe
 56                             # 匹配将应用于数组的所有元素. 
 57 
 58 # 所有匹配到的子串都会被替换
 59 echo ${arrayZ[@]//iv/YY}    # one two three four fYYe fYYe
 60                             # 匹配将应用于数组的所有元素. 
 61 
 62 # 删除所有的匹配子串
 63 # 如果没有指定替换字符串的话, 那就意味着'删除'
 64 echo ${arrayZ[@]//fi/}      # one two three four ve ve
 65                             # 匹配将应用于数组的所有元素. 
 66 
 67 # 替换字符串前端子串
 68 echo ${arrayZ[@]/#fi/XY}    # one two three four XYve XYve
 69                             # 匹配将应用于数组的所有元素. 
 70 
 71 # 替换字符串后端子串
 72 echo ${arrayZ[@]/%ve/ZZ}    # one two three four fiZZ fiZZ
 73                             # 匹配将应用于数组的所有元素. 
 74 
 75 echo ${arrayZ[@]/%o/XX}     # one twXX three four five five
 76                             # 为什么? 
 77 
 78 echo "-----------------------"
 79 
 80 
 81 # 在将处理后的结果发送到awk(或者其他的处理工具)之前 --
 82 # 回忆一下:
 83 #   $( ... )是命令替换. 
 84 #   函数作为子进程运行. 
 85 #   函数结果输出到stdout. 
 86 #   用read来读取函数的stdout. 
 87 #   使用name[@]表示法指定了一个"for-each"操作. 
 88 
 89 newstr() {
 90     echo -n "!!!"
 91 }
 92 
 93 echo ${arrayZ[@]/%e/$(newstr)}
 94 # on!!! two thre!!! four fiv!!! fiv!!!
 95 # Q.E.D: 替换动作实际上是一个'赋值'. 
 96 
 97 #  使用"For-Each"形式的
 98 echo ${arrayZ[@]//*/$(newstr optional_arguments)}
 99 #  现在, 如果Bash只将匹配到的子串作为$0
100 #+ 传递给将被调用的函数 . . .
101 
102 echo
103 
104 exit 0</pre>

 |

* * *

[命令替换](commandsub.md#COMMANDSUBREF)可以构造数组的独立元素. (译者注: 换句话说, 就是命令替换也能够给数组赋值.)

* * *

**例子 26-5\. 将脚本的内容赋值给数组**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # script-array.sh: 将这个脚本的内容赋值给数组. 
  3 # 这个脚本的灵感来自于Chris Martin的e-mail(感谢!). 
  4 
  5 script_contents=( $(cat "$0") )  #  将这个脚本的内容($0)
  6                                  #+ 赋值给数组. 
  7 
  8 for element in $(seq 0 $((${#script_contents[@]} - 1)))
  9   do                #  ${#script_contents[@]}
 10                     #+ 表示数组元素的个数. 
 11                     #
 12                     #  一个小问题:
 13                     #  为什么必须使用seq 0? 
 14                     #  用seq 1来试一下. 
 15   echo -n "${script_contents[$element]}"
 16                     # 在同一行上显示脚本中每个域的内容. 
 17   echo -n " -- "    # 使用 " -- " 作为域分割符. 
 18 done
 19 
 20 echo
 21 
 22 exit 0
 23 
 24 # 练习:
 25 # -----
 26 #  修改这个脚本, 
 27 #+ 让这个脚本能够按照它原本的格式输出, 
 28 #+ 连同空白, 换行, 等等. </pre>

 |

* * *

在数组环境中, 某些Bash[内建命令](internal.md#BUILTINREF)的含义可能会有些轻微的改变. 比如, [unset](internal.md#UNSETREF)命令可以删除数组元素, 甚至能够删除整个数组.

* * *

**例子 26-6\. 一些数组专用的小道具**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 declare -a colors
  4 #  脚本中所有的后续命令都会把
  5 #+ 变量"colors"看作数组. 
  6 
  7 echo "Enter your favorite colors (separated from each other by a space)."
  8 
  9 read -a colors    # 至少需要键入3种颜色, 以便于后边的演示. 
 10 #  'read'命令的特殊选项, 
 11 #+ 允许给数组元素赋值. 
 12 
 13 echo
 14 
 15 element_count=${#colors[@]}
 16 # 提取数组元素个数的特殊语法. 
 17 #     用element_count=${#colors[*]}也一样. 
 18 #
 19 #  "@"变量允许在引用中存在单词分割(word splitting)
 20 #+ (依靠空白字符来分隔变量). 
 21 #
 22 #  这就好像"$@"和"$*"
 23 #+ 在位置参数中的所表现出来的行为一样. 
 24 
 25 index=0
 26 
 27 while [ "$index" -lt "$element_count" ]
 28 do    # 列出数组中的所有元素. 
 29   echo ${colors[$index]}
 30   let "index = $index + 1"
 31   # 或:
 32   #    index+=1
 33   # 如果你运行的Bash版本是3.1以后的话, 才支持这种语法. 
 34 done
 35 # 每个数组元素被列为单独的一行. 
 36 # 如果没有这种要求的话, 可以使用echo -n "${colors[$index]} "
 37 #
 38 # 也可以使用"for"循环来做: 
 39 #   for i in "${colors[@]}"
 40 #   do
 41 #     echo "$i"
 42 #   done
 43 # (感谢, S.C.)
 44 
 45 echo
 46 
 47 # 再次列出数组中的所有元素, 不过这次的做法更优雅. 
 48   echo ${colors[@]}          # 用echo ${colors[*]}也行. 
 49 
 50 echo
 51 
 52 # "unset"命令即可以删除数组数据, 也可以删除整个数组. 
 53 unset colors[1]              # 删除数组的第2个元素. 
 54                              # 作用等效于   colors[1]=
 55 echo  ${colors[@]}           # 再次列出数组内容, 第2个元素没了. 
 56 
 57 unset colors                 # 删除整个数组. 
 58                              #  unset colors[*] 或
 59                              #+ unset colors[@] 都可以. 
 60 echo; echo -n "Colors gone."			   
 61 echo ${colors[@]}            # 再次列出数组内容, 内容为空. 
 62 
 63 exit 0</pre>

 |

* * *

正如我们在前面例子中所看到的, **${array_name[@]}**或**${array_name[*]}**都与数组中的_所有_元素相关. 同样的, 为了计算数组的元素个数, 可以使用**${#array_name[@]}**或**${#array_name[*]}**. **${#array_name}**是数组第一个元素的长度, 也就是**${array_name[0]}**的长度(字符个数).

* * *

**例子 26-7\. 空数组与包含空元素的数组**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # empty-array.sh
  3 
  4 #  感谢Stephane Chazelas制作这个例子的原始版本, 
  5 #+ 同时感谢Michael Zick对这个例子所作的扩展. 
  6 
  7 
  8 # 空数组与包含有空元素的数组, 这两个概念不同. 
  9 
 10 array0=( first second third )
 11 array1=( '' )   # "array1"包含一个空元素. 
 12 array2=( )      # 没有元素 . . . "array2"为空. 
 13 
 14 echo
 15 ListArray()
 16 {
 17 echo
 18 echo "Elements in array0:  ${array0[@]}"
 19 echo "Elements in array1:  ${array1[@]}"
 20 echo "Elements in array2:  ${array2[@]}"
 21 echo
 22 echo "Length of first element in array0 = ${#array0}"
 23 echo "Length of first element in array1 = ${#array1}"
 24 echo "Length of first element in array2 = ${#array2}"
 25 echo
 26 echo "Number of elements in array0 = ${#array0[*]}"  # 3
 27 echo "Number of elements in array1 = ${#array1[*]}"  # 1  (惊奇!)
 28 echo "Number of elements in array2 = ${#array2[*]}"  # 0
 29 }
 30 
 31 # ===================================================================
 32 
 33 ListArray
 34 
 35 # 尝试扩展这些数组. 
 36 
 37 # 添加一个元素到这个数组. 
 38 array0=( "${array0[@]}" "new1" )
 39 array1=( "${array1[@]}" "new1" )
 40 array2=( "${array2[@]}" "new1" )
 41 
 42 ListArray
 43 
 44 # 或
 45 array0[${#array0[*]}]="new2"
 46 array1[${#array1[*]}]="new2"
 47 array2[${#array2[*]}]="new2"
 48 
 49 ListArray
 50 
 51 # 如果你按照上边的方法对数组进行扩展的话; 数组比较象'栈' 
 52 # 上边的操作就是'压栈' 
 53 # 栈'高'为: 
 54 height=${#array2[@]}
 55 echo
 56 echo "Stack height for array2 = $height"
 57 
 58 # '出栈'就是: 
 59 unset array2[${#array2[@]}-1]	#  数组从0开始索引, 
 60 height=${#array2[@]}            #+ 这意味着第一个数组下标为0\. 
 61 echo
 62 echo "POP"
 63 echo "New stack height for array2 = $height"
 64 
 65 ListArray
 66 
 67 # 只列出数组array0的第二个和第三个元素.
 68 from=1		# 从0开始索引. 
 69 to=2		#
 70 array3=( ${array0[@]:1:2} )
 71 echo
 72 echo "Elements in array3:  ${array3[@]}"
 73 
 74 # 处理方式就像是字符串(字符数组). 
 75 # 试试其他的"字符串"形式. 
 76 
 77 # 替换: 
 78 array4=( ${array0[@]/second/2nd} )
 79 echo
 80 echo "Elements in array4:  ${array4[@]}"
 81 
 82 # 替换掉所有匹配通配符的字符串. 
 83 array5=( ${array0[@]//new?/old} )
 84 echo
 85 echo "Elements in array5:  ${array5[@]}"
 86 
 87 # 当你开始觉得对此有把握的时候 . . .
 88 array6=( ${array0[@]#*new} )
 89 echo # 这个可能会让你感到惊奇. 
 90 echo "Elements in array6:  ${array6[@]}"
 91 
 92 array7=( ${array0[@]#new1} )
 93 echo # 数组array6之后就没有惊奇了. 
 94 echo "Elements in array7:  ${array7[@]}"
 95 
 96 # 看起来非常像 . . .
 97 array8=( ${array0[@]/new1/} )
 98 echo
 99 echo "Elements in array8:  ${array8[@]}"
100 
101 #  所以, 让我们怎么形容呢? 
102 
103 #  对数组var[@]中的每个元素
104 #+ 进行连续的字符串操作. 
105 #  因此: 如果结果是长度为0的字符串, 
106 #+ Bash支持字符串向量操作, 
107 #+ 元素会在结果赋值中消失不见. 
108 
109 #  一个问题, 这些字符串是强引用还是弱引用? 
110 
111 zap='new*'
112 array9=( ${array0[@]/$zap/} )
113 echo
114 echo "Elements in array9:  ${array9[@]}"
115 
116 # 当你还在考虑, 你身在Kansas州何处时 . . .
117 array10=( ${array0[@]#$zap} )
118 echo
119 echo "Elements in array10:  ${array10[@]}"
120 
121 # 比较array7和array10\. 
122 # 比较array8和array9\. 
123 
124 # 答案: 必须是弱引用. 
125 
126 exit 0</pre>

 |

* * *

**${array_name[@]}**和**${array_name[*]}**的关系非常类似于[$@ and $*](internalvariables.md#APPREF). 这种数组用法用处非常广泛.

| 

<pre class="PROGRAMLISTING">  1 # 复制一个数组. 
  2 array2=( "${array1[@]}" )
  3 # 或
  4 array2="${array1[@]}"
  5 #
  6 #  然而, 如果在"缺项"数组中使用的话, 将会失败, 
  7 #+ 也就是说数组中存在空洞(中间的某个元素没赋值), 
  8 #+ 这个问题由Jochen DeSmet指出. 
  9 # ------------------------------------------
 10   array1[0]=0
 11 # array1[1]没赋值
 12   array1[2]=2
 13   array2=( "${array1[@]}" )       # 拷贝它? 
 14 
 15 echo ${array2[0]}      # 0
 16 echo ${array2[2]}      # (null), 应该是2
 17 # ------------------------------------------
 18 
 19 
 20 
 21 # 添加一个元素到数组. 
 22 array=( "${array[@]}" "new element" )
 23 # 或
 24 array[${#array[*]}]="new element"
 25 
 26 # 感谢, S.C.</pre>

 |

| ![Tip](./images/tip.gif) | 

**array=( element1 element2 ... elementN )**初始化操作, 如果有[命令替换](commandsub.md#COMMANDSUBREF)的帮助, 就可以将一个文本文件的内容加载到数组.

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 filename=sample_file
  4 
  5 #            cat sample_file
  6 #
  7 #            1 a b c
  8 #            2 d e fg
  9 
 10 
 11 declare -a array1
 12 
 13 array1=( `cat "$filename"`)                #  将$filename的内容
 14 #         List file to stdout              #+ 加载到数组array1\. 
 15 #
 16 #  array1=( `cat "$filename" | tr '\n' ' '`)
 17 #                            把文件中的换行替换为空格. 
 18 #  其实这么做是没必要的, Not necessary because Bash does word splitting,
 19 #+ 因为Bash在做单词分割(word splitting)的时候, 将会把换行转换为空格. 
 20 
 21 echo ${array1[@]}            # 打印数组. 
 22 #                              1 a b c 2 d e fg
 23 #
 24 #  文件中每个被空白符分隔的"单词"
 25 #+ 都被保存到数组的一个元素中. 
 26 
 27 element_count=${#array1[*]}
 28 echo $element_count          # 8</pre>

 |

 |

出色的技巧使得数组的操作技术又多了一种.

* * *

**例子 26-8\. 初始化数组**

| 

<pre class="PROGRAMLISTING">  1 #! /bin/bash
  2 # array-assign.bash
  3 
  4 #  数组操作是Bash所特有的, 
  5 #+ 所以才使用".bash"作为脚本扩展名. 
  6 
  7 # Copyright (c) Michael S. Zick, 2003, All rights reserved.
  8 # License: Unrestricted reuse in any form, for any purpose.
  9 # Version: $ID$
 10 #
 11 # 说明与注释由William Park所添加. 
 12 
 13 #  基于Stephane Chazelas所提供的
 14 #+ 出现在本书中的一个例子. 
 15 
 16 # 'times'命令的输出格式: 
 17 # User CPU <space> System CPU
 18 # User CPU of dead children <space> System CPU of dead children
 19 
 20 #  Bash有两种方法, 
 21 #+ 可以将一个数组的所有元素都赋值给一个新的数组变量. 
 22 #  在2.04, 2.05a和2.05b版本的Bash中, 
 23 #+ 这两种方法都会丢弃数组中的"空引用"(null值)元素. 
 24 #  另一种给数组赋值的方法将会被添加到新版本的Bash中, 
 25 #+ 这种方法采用[subscript]=value形式, 来维护数组下标与元素值之间的关系. 
 26 
 27 #  可以使用内部命令来构造一个大数组, 
 28 #+ 当然, 构造一个包含上千元素数组的其他方法
 29 #+ 也能很好的完成任务. 
 30 
 31 declare -a bigOne=( /dev/* )
 32 echo
 33 echo 'Conditions: Unquoted, default IFS, All-Elements-Of'
 34 echo "Number of elements in array is ${#bigOne[@]}"
 35 
 36 # set -vx
 37 
 38 
 39 
 40 echo
 41 echo '- - testing: =( ${array[@]} ) - -'
 42 times
 43 declare -a bigTwo=( ${bigOne[@]} )
 44 #                 ^              ^
 45 times
 46 
 47 echo
 48 echo '- - testing: =${array[@]} - -'
 49 times
 50 declare -a bigThree=${bigOne[@]}
 51 # 这次没用括号. 
 52 times
 53 
 54 #  正如Stephane Chazelas所指出的, 通过比较, 
 55 #+ 可以了解到第二种格式的赋值比第三或第四种形式更快. 
 56 #
 57 #  William Park解释: 
 58 #+ 数组bigTwo是作为一个单个字符串被赋值的, 
 59 #+ 而数组bigThree, 则是一个元素一个元素进行的赋值. 
 60 #  所以, 实质上是: 
 61 #                   bigTwo=( [0]="... ... ..." )
 62 #                   bigThree=( [0]="..." [1]="..." [2]="..." ... )
 63 
 64 
 65 #  在本书的例子中, 我还是会继续使用第一种形式, 
 66 #+ 因为我认为这种形式更有利于将问题阐述清楚. 
 67 
 68 #  在我所使用的例子中, 在其中复用的部分, 
 69 #+ 还是使用了第二种形式, 那是因为这种形式更快. 
 70 
 71 # MSZ: 很抱歉早先的疏忽(译者: 应是指本书的老版本). 
 72 
 73 
 74 #  注意事项:
 75 #  ---------
 76 #  31行和43行的"declare -a"语句其实不是必需的, 
 77 #+ 因为Array=( ... )形式
 78 #+ 只能用于数组赋值. 
 79 #  然而, 如果省略这些声明的话, 
 80 #+ 会导致脚本后边的相关操作变慢. 
 81 #  试一下, 看看发生了什么. 
 82 
 83 exit 0</pre>

 |

* * *

| ![Note](./images/note.gif) | 

在数组声明的时候添加一个额外的**declare -a**语句, 能够加速后续的数组操作速度.

 |

* * *

**例子 26-9\. 拷贝和连接数组**

| 

<pre class="PROGRAMLISTING">  1 #! /bin/bash
  2 # CopyArray.sh
  3 #
  4 # 这个脚本由Michael Zick所编写. 
  5 # 已通过作者授权, 可以在本书中使用. 
  6 
  7 #  如何"通过名字传值&通过名字返回"(译者注: 这里可以理解为C中的"数组指针", 或C++中的"数组引用")
  8 #+ 或者"建立自己的赋值语句". 
  9 
 10 
 11 CpArray_Mac() {
 12 
 13 # 建立赋值命令
 14 
 15     echo -n 'eval '
 16     echo -n "$2"                    # 目的参数名
 17     echo -n '=( ${'
 18     echo -n "$1"                    # 原参数名
 19     echo -n '[@]} )'
 20 
 21 # 上边这些语句会构成一条命令. 
 22 # 这仅仅是形式上的问题. 
 23 }
 24 
 25 declare -f CopyArray                # 函数"指针"
 26 CopyArray=CpArray_Mac               # 构造语句
 27 
 28 Hype()
 29 {
 30 
 31 # 需要连接的数组名为$1\. 
 32 # (把这个数组与字符串"Really Rocks"结合起来, 形成一个新数组.)
 33 # 并将结果从数组$2中返回. 
 34 
 35     local -a TMP
 36     local -a hype=( Really Rocks )
 37 
 38     $($CopyArray $1 TMP)
 39     TMP=( ${TMP[@]} ${hype[@]} )
 40     $($CopyArray TMP $2)
 41 }
 42 
 43 declare -a before=( Advanced Bash Scripting )
 44 declare -a after
 45 
 46 echo "Array Before = ${before[@]}"
 47 
 48 Hype before after
 49 
 50 echo "Array After = ${after[@]}"
 51 
 52 # 连接的太多了? 
 53 
 54 echo "What ${after[@]:3:2}?"
 55 
 56 declare -a modest=( ${after[@]:2:1} ${after[@]:3:2} )
 57 #                    ----       子串提取       ----
 58 
 59 echo "Array Modest = ${modest[@]}"
 60 
 61 # 'before'发生了什么变化么? 
 62 
 63 echo "Array Before = ${before[@]}"
 64 
 65 exit 0</pre>

 |

* * *

* * *

**例子 26-10\. 关于串联数组的更多信息**

| 

<pre class="PROGRAMLISTING">  1 #! /bin/bash
  2 # array-append.bash
  3 
  4 # Copyright (c) Michael S. Zick, 2003, All rights reserved.
  5 # License: Unrestricted reuse in any form, for any purpose.
  6 # Version: $ID$
  7 #
  8 # 在格式上, 由M.C做了一些修改. 
  9 
 10 
 11 # 数组操作是Bash特有的属性. 
 12 # 传统的UNIX /bin/sh缺乏类似的功能. 
 13 
 14 
 15 #  将这个脚本的输出通过管道传递给'more', 
 16 #+ 这么做的目的是防止输出的内容超过终端能够显示的范围. 
 17 
 18 
 19 # 依次使用下标. 
 20 declare -a array1=( zero1 one1 two1 )
 21 # 数组中存在空缺的元素([1]未定义). 
 22 declare -a array2=( [0]=zero2 [2]=two2 [3]=three2 )
 23 
 24 echo
 25 echo '- Confirm that the array is really subscript sparse. -'
 26 echo "Number of elements: 4"        # 仅仅为了演示, 所以就写死了. 
 27 for (( i = 0 ; i < 4 ; i++ ))
 28 do
 29     echo "Element [$i]: ${array2[$i]}"
 30 done
 31 # 也可以参考一个更通用的例子, basics-reviewed.bash. 
 32 
 33 
 34 declare -a dest
 35 
 36 # 将两个数组合并(附加)到第3个数组. 
 37 echo
 38 echo 'Conditions: Unquoted, default IFS, All-Elements-Of operator'
 39 echo '- Undefined elements not present, subscripts not maintained. -'
 40 # # 那些未定义的元素不会出现; 组合时会丢弃这些元素. 
 41 
 42 dest=( ${array1[@]} ${array2[@]} )
 43 # dest=${array1[@]}${array2[@]}     # 令人奇怪的结果, 或许是个bug. 
 44 
 45 # 现在, 打印结果. 
 46 echo
 47 echo '- - Testing Array Append - -'
 48 cnt=${#dest[@]}
 49 
 50 echo "Number of elements: $cnt"
 51 for (( i = 0 ; i < cnt ; i++ ))
 52 do
 53     echo "Element [$i]: ${dest[$i]}"
 54 done
 55 
 56 # 将数组赋值给一个数组中的元素(两次). 
 57 dest[0]=${array1[@]}
 58 dest[1]=${array2[@]}
 59 
 60 # 打印结果. 
 61 echo
 62 echo '- - Testing modified array - -'
 63 cnt=${#dest[@]}
 64 
 65 echo "Number of elements: $cnt"
 66 for (( i = 0 ; i < cnt ; i++ ))
 67 do
 68     echo "Element [$i]: ${dest[$i]}"
 69 done
 70 
 71 # 检查第二个元素的修改状况. 
 72 echo
 73 echo '- - Reassign and list second element - -'
 74 
 75 declare -a subArray=${dest[1]}
 76 cnt=${#subArray[@]}
 77 
 78 echo "Number of elements: $cnt"
 79 for (( i = 0 ; i < cnt ; i++ ))
 80 do
 81     echo "Element [$i]: ${subArray[$i]}"
 82 done
 83 
 84 #  如果你使用'=${ ... }'形式
 85 #+ 将一个数组赋值到另一个数组的一个元素中, 
 86 #+ 那么这个数组的所有元素都会被转换为一个字符串, 
 87 #+ 这个字符串中的每个数组元素都以空格进行分隔(其实是IFS的第一个字符). 
 88 
 89 # 如果原来数组中的所有元素都不包含空白符 . . .
 90 # 如果原来的数组下标都是连续的 . . .
 91 # 那么我们就可以将原来的数组进行恢复. 
 92 
 93 # 从修改过的第二个元素中, 将原来的数组恢复出来. 
 94 echo
 95 echo '- - Listing restored element - -'
 96 
 97 declare -a subArray=( ${dest[1]} )
 98 cnt=${#subArray[@]}
 99 
100 echo "Number of elements: $cnt"
101 for (( i = 0 ; i < cnt ; i++ ))
102 do
103     echo "Element [$i]: ${subArray[$i]}"
104 done
105 echo '- - Do not depend on this behavior. - -'
106 echo '- - This behavior is subject to change - -'
107 echo '- - in versions of Bash newer than version 2.05b - -'
108 
109 # MSZ: 抱歉, 之前混淆了一些要点(译者注: 指的是本书以前的版本). 
110 
111 exit 0</pre>

 |

* * *

--

有了数组, 我们就可以在脚本中实现一些比较熟悉的算法. 这么做, 到底是不是一个好主意, 我们在这里不做讨论, 还是留给读者决定吧.

* * *

**例子 26-11\. 一位老朋友: _冒泡排序_**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # bubble.sh: 一种排序方式, 冒泡排序. 
  3 
  4 # 回忆一下冒泡排序的算法. 我们在这里要实现它...
  5 
  6 #  依靠连续的比较数组元素进行排序, 
  7 #+ 比较两个相邻元素, 如果顺序不对, 就交换这两个元素的位置. 
  8 #  当第一轮比较结束之后, 最"重"的元素就会被移动到最底部. 
  9 #  当第二轮比较结束之后, 第二"重"的元素就会被移动到次底部的位置. 
 10 #  依此类推. 
 11 #  这意味着每轮比较不需要比较之前已经"沉淀"好的数据. 
 12 #  因此你会注意到后边的数据在打印的时候会快一些. 
 13 
 14 
 15 exchange()
 16 {
 17   # 交换数组中的两个元素. 
 18   local temp=${Countries[$1]} #  临时保存
 19                               #+ 要交换的那个元素. 
 20   Countries[$1]=${Countries[$2]}
 21   Countries[$2]=$temp
 22   
 23   return
 24 }  
 25 
 26 declare -a Countries  #  声明数组, 
 27                       #+ 此处是可选的, 因为数组在下面被初始化. 
 28 
 29 #  我们是否可以使用转义符(\)
 30 #+ 来将数组元素的值放在不同的行上? 
 31 #  可以. 
 32 
 33 Countries=(Netherlands Ukraine Zaire Turkey Russia Yemen Syria \
 34 Brazil Argentina Nicaragua Japan Mexico Venezuela Greece England \
 35 Israel Peru Canada Oman Denmark Wales France Kenya \
 36 Xanadu Qatar Liechtenstein Hungary)
 37 
 38 # "Xanadu"虚拟出来的世外桃源. 
 39 #+ 
 40 
 41 
 42 clear                      # 开始之前的清屏动作. 
 43 
 44 echo "0: ${Countries[*]}"  # 从索引0开始列出整个数组. 
 45 
 46 number_of_elements=${#Countries[@]}
 47 let "comparisons = $number_of_elements - 1"
 48 
 49 count=1 # 传递数字. 
 50 
 51 while [ "$comparisons" -gt 0 ]          # 开始外部循环
 52 do
 53 
 54   index=0  # 在每轮循环开始之前, 重置索引. 
 55 
 56   while [ "$index" -lt "$comparisons" ] # 开始内部循环
 57   do
 58     if [ ${Countries[$index]} \> ${Countries[`expr $index + 1`]} ]
 59     #  如果原来的排序次序不对...
 60     #  回想一下, 在单括号中, 
 61     #+ \>是ASCII码的比较操作符. 
 62 
 63     #  if [[ ${Countries[$index]} > ${Countries[`expr $index + 1`]} ]]
 64     #+ 这样也行. 
 65     then
 66       exchange $index `expr $index + 1`  # 交换. 
 67     fi  
 68     let "index += 1"  # 或者,   index+=1   在Bash 3.1之后的版本才能这么用. 
 69   done # 内部循环结束
 70 
 71 # ----------------------------------------------------------------------
 72 # Paulo Marcel Coelho Aragao建议我们可以使用更简单的for循环. 
 73 #
 74 # for (( last = $number_of_elements - 1 ; last > 1 ; last-- ))
 75 # do
 76 #     for (( i = 0 ; i < last ; i++ ))
 77 #     do
 78 #         [[ "${Countries[$i]}" > "${Countries[$((i+1))]}" ]] \
 79 #             && exchange $i $((i+1))
 80 #     done
 81 # done
 82 # ----------------------------------------------------------------------
 83   
 84 
 85 let "comparisons -= 1" #  因为最"重"的元素到了底部, 
 86                        #+ 所以每轮我们可以少做一次比较. 
 87 
 88 echo
 89 echo "$count: ${Countries[@]}"  # 每轮结束后, 都打印一次数组. 
 90 echo
 91 let "count += 1"                # 增加传递计数. 
 92 
 93 done                            # 外部循环结束
 94                                 # 至此, 全部完成. 
 95 
 96 exit 0</pre>

 |

* * *

--

我们可以在数组中嵌套数组么?

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # "嵌套"数组. 
  3 
  4 #  Michael Zick提供了这个用例, 
  5 #+ William Park做了一些修正和说明. 
  6 
  7 AnArray=( $(ls --inode --ignore-backups --almost-all \
  8 	--directory --full-time --color=none --time=status \
  9 	--sort=time -l ${PWD} ) )  # 命令及选项. 
 10 
 11 # 空格是有意义的 . . . 并且不要在上边用引号引用任何东西. 
 12 
 13 SubArray=( ${AnArray[@]:11:1}  ${AnArray[@]:6:5} )
 14 #  这个数组有六个元素: 
 15 #+     SubArray=( [0]=${AnArray[11]} [1]=${AnArray[6]} [2]=${AnArray[7]}
 16 #      [3]=${AnArray[8]} [4]=${AnArray[9]} [5]=${AnArray[10]} )
 17 #
 18 #  Bash数组是字符串(char *)类型
 19 #+ 的(循环)链表. 
 20 #  因此, 这不是真正意义上的嵌套数组, 
 21 #+ 只不过功能很相似而已. 
 22 
 23 echo "Current directory and date of last status change:"
 24 echo "${SubArray[@]}"
 25 
 26 exit 0</pre>

 |

--

如果将<span class="QUOTE">"嵌套数组"</span>与[间接引用](bashver2.md#VARREFNEW)组合起来使用的话, 将会产生一些非常有趣的用法.

* * *

**例子 26-12\. 嵌套数组与间接引用**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # embedded-arrays.sh
  3 # 嵌套数组和间接引用. 
  4 
  5 # 本脚本由Dennis Leeuw编写. 
  6 # 经过授权, 在本书中使用. 
  7 # 本书作者做了少许修改. 
  8 
  9 
 10 ARRAY1=(
 11         VAR1_1=value11
 12         VAR1_2=value12
 13         VAR1_3=value13
 14 )
 15 
 16 ARRAY2=(
 17         VARIABLE="test"
 18         STRING="VAR1=value1 VAR2=value2 VAR3=value3"
 19         ARRAY21=${ARRAY1[*]}
 20 )       # 将ARRAY1嵌套到这个数组中. 
 21 
 22 function print () {
 23         OLD_IFS="$IFS"
 24         IFS=/pre>\n'       #  这么做是为了每行
 25                         #+ 只打印一个数组元素.
 26         TEST1="ARRAY2[*]"
 27         local ${!TEST1} # 删除这一行, 看看会发生什么? 
 28         #  间接引用. 
 29 	#  这使得$TEST1
 30 	#+ 只能够在函数内被访问. 
 31 
 32 
 33         #  让我们看看还能干点什么. 
 34         echo
 35         echo "\$TEST1 = $TEST1"       #  仅仅是变量名字. 
 36         echo; echo
 37         echo "{\$TEST1} = ${!TEST1}"  #  变量内容. 
 38                                       #  这就是
 39                                       #+ 间接引用的作用. 
 40         echo
 41         echo "-------------------------------------------"; echo
 42         echo
 43 
 44 
 45         # 打印变量
 46         echo "Variable VARIABLE: $VARIABLE"
 47 	
 48         # 打印一个字符串元素
 49         IFS="$OLD_IFS"
 50         TEST2="STRING[*]"
 51         local ${!TEST2}      # 间接引用(同上). 
 52         echo "String element VAR2: $VAR2 from STRING"
 53 
 54         # 打印一个数组元素
 55         TEST2="ARRAY21[*]"
 56         local ${!TEST2}      # 间接引用(同上). 
 57         echo "Array element VAR1_1: $VAR1_1 from ARRAY21"
 58 }
 59 
 60 print
 61 echo
 62 
 63 exit 0
 64 
 65 #   脚本作者注, 
 66 #+ "你可以很容易的将其扩展成一个能创建hash的Bash脚本." 
 67 #   (难) 留给读者的练习: 实现它. </pre>

 |

* * *

--

数组使得_埃拉托色尼素数筛子_有了shell版本的实现. 当然, 如果你需要的是追求效率的应用, 那么就应该使用编译行语言来实现, 比如C语言. 因为脚本运行的太慢了.

* * *

**例子 26-13\. 复杂的数组应用: _埃拉托色尼素数筛子_**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # sieve.sh (ex68.sh)
  3 
  4 # 埃拉托色尼素数筛子
  5 # 找素数的经典算法. 
  6 
  7 #  在同等数值的范围内, 
  8 #+ 这个脚本运行的速度比C版本慢的多. 
  9 
 10 LOWER_LIMIT=1       # 从1开始. 
 11 UPPER_LIMIT=1000    # 到1000\. 
 12 # (如果你时间很多的话 . . . 你可以将这个数值调的很高.)
 13 
 14 PRIME=1
 15 NON_PRIME=0
 16 
 17 let SPLIT=UPPER_LIMIT/2
 18 # 优化: 
 19 # 只需要测试中间到最大的值(为什么?). 
 20 # (译者注: 这个变量在脚本正文并没有被使用, 仅仅在107行之后的优化部分才使用.)
 21 
 22 declare -a Primes
 23 # Primes[]是个数组. 
 24 
 25 
 26 initialize ()
 27 {
 28 # 初始化数组. 
 29 
 30 i=$LOWER_LIMIT
 31 until [ "$i" -gt "$UPPER_LIMIT" ]
 32 do
 33   Primes[i]=$PRIME
 34   let "i += 1"
 35 done
 36 #  假定所有数组成员都是需要检查的(素数)
 37 #+ 直到检查完成. 
 38 }
 39 
 40 print_primes ()
 41 {
 42 # 打印出所有数组Primes[]中被标记为素数的元素. 
 43 
 44 i=$LOWER_LIMIT
 45 
 46 until [ "$i" -gt "$UPPER_LIMIT" ]
 47 do
 48 
 49   if [ "${Primes[i]}" -eq "$PRIME" ]
 50   then
 51     printf "%8d" $i
 52     # 每个数字打印前先打印8个空格, 在偶数列才打印. 
 53   fi
 54   
 55   let "i += 1"
 56   
 57 done
 58 
 59 }
 60 
 61 sift () # 查出非素数. 
 62 {
 63 
 64 let i=$LOWER_LIMIT+1
 65 # 我们都知道1是素数, 所以我们从2开始. 
 66 # (译者注: 从2开始并不是由于1是素数, 而是因为要去掉以后每个数的倍数, 感谢网友KevinChen.)
 67 until [ "$i" -gt "$UPPER_LIMIT" ]
 68 do
 69 
 70 if [ "${Primes[i]}" -eq "$PRIME" ]
 71 # 不要处理已经过滤过的数字(被标识为非素数).
 72 then
 73 
 74   t=$i
 75 
 76   while [ "$t" -le "$UPPER_LIMIT" ]
 77   do
 78     let "t += $i "
 79     Primes[t]=$NON_PRIME
 80     # 标识为非素数. 
 81   done
 82 
 83 fi  
 84 
 85   let "i += 1"
 86 done  
 87 
 88 
 89 }
 90 
 91 
 92 # ==============================================
 93 # main ()
 94 # 继续调用函数. 
 95 initialize
 96 sift
 97 print_primes
 98 # 这里就是被称为结构化编程的东西. 
 99 # ==============================================
100 
101 echo
102 
103 exit 0
104 
105 
106 
107 # -------------------------------------------------------- #
108 # 因为前面的'exit'语句, 所以后边的代码不会运行. 
109 
110 #  下边的代码, 是由Stephane Chazelas所编写的埃拉托色尼素数筛子的改进版本, 
111 #+ 这个版本可以运行的快一些. 
112 
113 # 必须在命令行上指定参数(这个参数就是: 寻找素数的限制范围). 
114 
115 UPPER_LIMIT=$1                  # 来自于命令行. 
116 let SPLIT=UPPER_LIMIT/2         # 从中间值到最大值. 
117 
118 Primes=( '' $(seq $UPPER_LIMIT) )
119 
120 i=1
121 until (( ( i += 1 ) > SPLIT ))  # 仅需要从中间值检查. 
122 do
123   if [[ -n $Primes[i] ]]
124   then
125     t=$i
126     until (( ( t += i ) > UPPER_LIMIT ))
127     do
128       Primes[t]=
129     done
130   fi  
131 done  
132 echo ${Primes[*]}
133 
134 exit 0</pre>

 |

* * *

上边的这个例子是基于数组的素数产生器, 还有不使用数组的素数产生器[例子 A-16](contributed-scripts.md#PRIMES), 让我们来比较一番.

--

数组可以进行一定程度上的扩展, 这样就可以模拟一些Bash原本不支持的数据结构.

* * *

**例子 26-14\. 模拟一个下推堆栈**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # stack.sh: 模拟下推堆栈
  3 
  4 #  类似于CPU栈, 下推堆栈依次保存数据项, 
  5 #+ 但是取数据时, 却反序进行, 后进先出. 
  6 
  7 BP=100            #  栈数组的基址指针. 
  8                   #  从元素100开始. 
  9 
 10 SP=$BP            #  栈指针. 
 11                   #  将其初始化为栈"基址"(栈底). 
 12 
 13 Data=             #  当前栈的数据内容. 
 14                   #  必须定义为全局变量, 
 15                   #+ 因为函数所能够返回的整数存在范围限制. 
 16 
 17 declare -a stack
 18 
 19 
 20 push()            # 压栈.
 21 {
 22 if [ -z "$1" ]    # 没有可压入的数据项? 
 23 then
 24   return
 25 fi
 26 
 27 let "SP -= 1"     # 更新栈指针. 
 28 stack[$SP]=$1
 29 
 30 return
 31 }
 32 
 33 pop()                    # 从栈中弹出数据项. 
 34 {
 35 Data=                    # 清空保存数据项的中间变量. 
 36 
 37 if [ "$SP" -eq "$BP" ]   # 栈空? 
 38 then
 39   return
 40 fi                       #  这使得SP不会超过100, 
 41                          #+ 例如, 这可以防止堆栈失控. 
 42 
 43 Data=${stack[$SP]}
 44 let "SP += 1"            # 更新栈指针. 
 45 return
 46 }
 47 
 48 status_report()          # 打印当前状态. 
 49 {
 50 echo "-------------------------------------"
 51 echo "REPORT"
 52 echo "Stack Pointer = $SP"
 53 echo "Just popped \""$Data"\" off the stack."
 54 echo "-------------------------------------"
 55 echo
 56 }
 57 
 58 
 59 # =======================================================
 60 # 现在, 来点乐子. 
 61 
 62 echo
 63 
 64 # 看你是否能从空栈里弹出数据项来. 
 65 pop
 66 status_report
 67 
 68 echo
 69 
 70 push garbage
 71 pop
 72 status_report     # 压入garbage, 弹出garbage.       
 73 
 74 value1=23; push $value1
 75 value2=skidoo; push $value2
 76 value3=FINAL; push $value3
 77 
 78 pop              # FINAL
 79 status_report
 80 pop              # skidoo
 81 status_report
 82 pop              # 23
 83 status_report    # 后进, 先出! 
 84 
 85 #  注意: 栈指针在压栈时减, 
 86 #+ 在弹出时加. 
 87 
 88 echo
 89 
 90 exit 0
 91 
 92 # =======================================================
 93 
 94 
 95 # 练习:
 96 # -----
 97 
 98 # 1)  修改"push()"函数, 
 99 #   + 使其调用一次就能够压入多个数据项. 
100 
101 # 2)  修改"pop()"函数, 
102 #   + 使其调用一次就能弹出多个数据项. 
103 
104 # 3)  给那些有临界操作的函数添加出错检查. 
105 #     说明白一些, 就是让这些函数返回错误码, 
106 #   + 返回的错误码依赖于操作是否成功完成, 
107 #   + 如果没有成功完成, 那么就需要启动合适的处理动作. 
108 
109 # 4)  以这个脚本为基础, 
110 #   + 编写一个用栈实现的四则运算计算器. </pre>

 |

* * *

--

如果想对数组<span class="QUOTE">"下标"</span>做一些比较诡异的操作, 可能需要使用中间变量. 对于那些有这种需求的项目来说, 还是应该考虑使用功能更加强大的编程语言, 比如Perl或C.

* * *

**例子 26-15\. 复杂的数组应用: _探索一个神秘的数学序列_**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 # Douglas Hofstadter的声名狼藉的序列"Q-series":
  4 
  5 # Q(1) = Q(2) = 1
  6 # Q(n) = Q(n - Q(n-1)) + Q(n - Q(n-2)), 当n>2时
  7 
  8 # 这是一个令人感到陌生的, 没有规律的"乱序"整数序列. 
  9 # 序列的头20项, 如下所示: 
 10 # 1 1 2 3 3 4 5 5 6 6 6 8 8 8 10 9 10 11 11 12 
 11 
 12 #  请参考相关书籍, Hofstadter的, "_Goedel, Escher, Bach: An Eternal Golden Braid_",
 13 #+ 第137页. 
 14 
 15 
 16 LIMIT=100     # 需要计算的数列长度. 
 17 LINEWIDTH=20  # 每行打印的个数. 
 18 
 19 Q[1]=1        # 数列的头两项都为1\. 
 20 Q[2]=1
 21 
 22 echo
 23 echo "Q-series [$LIMIT terms]:"
 24 echo -n "${Q[1]} "             # 输出数列头两项. 
 25 echo -n "${Q[2]} "
 26 
 27 for ((n=3; n <= $LIMIT; n++))  # C风格的循环条件. 
 28 do   # Q[n] = Q[n - Q[n-1]] + Q[n - Q[n-2]]  当n>2时
 29 #  需要将表达式拆开, 分步计算, 
 30 #+ 因为Bash不能够很好的处理复杂数组的算术运算. 
 31 
 32   let "n1 = $n - 1"        # n-1
 33   let "n2 = $n - 2"        # n-2
 34   
 35   t0=`expr $n - ${Q[n1]}`  # n - Q[n-1]
 36   t1=`expr $n - ${Q[n2]}`  # n - Q[n-2]
 37   
 38   T0=${Q[t0]}              # Q[n - Q[n-1]]
 39   T1=${Q[t1]}              # Q[n - Q[n-2]]
 40 
 41 Q[n]=`expr $T0 + $T1`      # Q[n - Q[n-1]] + Q[n - Q[n-2]]
 42 echo -n "${Q[n]} "
 43 
 44 if [ `expr $n % $LINEWIDTH` -eq 0 ]    # 格式化输出. 
 45 then   #      ^ 取模操作
 46   echo # 把每行都拆为20个数字的小块. 
 47 fi
 48 
 49 done
 50 
 51 echo
 52 
 53 exit 0
 54 
 55 # 这是Q-series的一个迭代实现. 
 56 # 更直接明了的实现是使用递归, 请读者作为练习完成. 
 57 # 警告: 使用递归的方法来计算这个数列的话, 会花费非常长的时间. </pre>

 |

* * *

--

Bash仅仅支持一维数组, 但是我们可以使用一个小手段, 这样就可以模拟多维数组了.

* * *

**例子 26-16\. 模拟一个二维数组, 并使他倾斜**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # twodim.sh: 模拟一个二维数组. 
  3 
  4 # 一维数组由单行组成. 
  5 # 二维数组由连续的多行组成. 
  6 
  7 Rows=5
  8 Columns=5
  9 # 5 X 5 的数组.
 10 
 11 declare -a alpha     # char alpha [Rows] [Columns];
 12                      # 没必要声明. 为什么?
 13 
 14 load_alpha ()
 15 {
 16 local rc=0
 17 local index
 18 
 19 for i in A B C D E F G H I J K L M N O P Q R S T U V W X Y
 20 do     # 你可以随你的心意, 使用任意符号. 
 21   local row=`expr $rc / $Columns`
 22   local column=`expr $rc % $Rows`
 23   let "index = $row * $Rows + $column"
 24   alpha[$index]=$i
 25 # alpha[$row][$column]
 26   let "rc += 1"
 27 done  
 28 
 29 #  更简单的方法: 
 30 #+   declare -a alpha=( A B C D E F G H I J K L M N O P Q R S T U V W X Y )
 31 #+ 但是如果写的话, 就缺乏二维数组的"风味"了. 
 32 }
 33 
 34 print_alpha ()
 35 {
 36 local row=0
 37 local index
 38 
 39 echo
 40 
 41 while [ "$row" -lt "$Rows" ]   #  以"行序为主"进行打印: 
 42 do                             #+ 行号不变(外层循环),
 43                                #+ 列号进行增长. (译者注: 就是按行打印)
 44   local column=0
 45 
 46   echo -n "       "            #  按照行方向打印"正方形"数组. 
 47 
 48   while [ "$column" -lt "$Columns" ]
 49   do
 50     let "index = $row * $Rows + $column"
 51     echo -n "${alpha[index]} "  # alpha[$row][$column]
 52     let "column += 1"
 53   done
 54 
 55   let "row += 1"
 56   echo
 57 
 58 done  
 59 
 60 # 更简单的等价写法为: 
 61 #     echo ${alpha[*]} | xargs -n $Columns
 62 
 63 echo
 64 }
 65 
 66 filter ()     # 过滤掉负的数组下标. 
 67 {
 68 
 69 echo -n "  "  # 产生倾斜. 
 70               # 解释一下, 这是怎么做到的. 
 71 
 72 if [[ "$1" -ge 0 &&  "$1" -lt "$Rows" && "$2" -ge 0 && "$2" -lt "$Columns" ]]
 73 then
 74     let "index = $1 * $Rows + $2"
 75     # 现在, 按照旋转方向进行打印. 
 76     echo -n " ${alpha[index]}"
 77     #           alpha[$row][$column]
 78 fi    
 79 
 80 }
 81   
 82 
 83 
 84 
 85 rotate ()  #  将数组旋转45度 --
 86 {          #+ 从左下角进行"平衡". 
 87 local row
 88 local column
 89 
 90 for (( row = Rows; row > -Rows; row-- ))
 91   do       # 反向步进数组, 为什么? 
 92 
 93   for (( column = 0; column < Columns; column++ ))
 94   do
 95 
 96     if [ "$row" -ge 0 ]
 97     then
 98       let "t1 = $column - $row"
 99       let "t2 = $column"
100     else
101       let "t1 = $column"
102       let "t2 = $column + $row"
103     fi  
104 
105     filter $t1 $t2   # 将负的数组下标过滤出来. 
106                      # 如果你不做这一步, 将会怎样? 
107   done
108 
109   echo; echo
110 
111 done 
112 
113 #  数组旋转的灵感来源于Herbert Mayer所著的
114 #+ "Advanced C Programming on the IBM PC"的例子(第143-146页)
115 #+ (参见参考书目). 
116 #  由此可见, C语言能够做到的好多事情, 
117 #+ 用shell脚本一样能够做到. 
118 
119 }
120 
121 
122 #--------------- 现在, 让我们开始吧. ------------#
123 load_alpha     # 加载数组. 
124 print_alpha    # 打印数组.   
125 rotate         # 逆时钟旋转45度打印. 
126 #-----------------------------------------------------#
127 
128 exit 0
129 
130 # 这是有点做作, 不是那么优雅. 
131 
132 # 练习:
133 # -----
134 # 1)  重新实现数组加载和打印函数, 
135 #     让其更直观, 可读性更强. 
136 #
137 # 2)  详细地描述旋转函数的原理. 
138 #     提示: 思考一下倒序索引数组的实现. 
139 #
140 # 3)  重写这个脚本, 扩展它, 让不仅仅能够支持非正方形的数组. 
141 #     比如6 X 4的数组. 
142 #     尝试一下, 在数组旋转时, 做到最小"失真". </pre>

 |

* * *

二维数组本质上其实就是一个一维数组, 只不过是添加了_行_和_列_的寻址方式, 来引用和操作数组的元素而已.

这里有一个精心制作的模拟二维数组的例子, 请参考[例子 A-10](contributed-scripts.md#LIFESLOW).

--

还有两个使用脚本的更有趣的例子, 请参考:

*   [例子 14-3](commandsub.md#AGRAM2)和[例子 A-23](contributed-scripts.md#HASHEX2)