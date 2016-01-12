# 34.1\. Bash, 版本2

当前比较流行的_Bash_版本有两个, 版本2.xx.y或版本3.xx.y, 这两个中的某一个估计就运行在你的机器上.

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $BASH_VERSION</kbd>
<samp class="COMPUTEROUTPUT">2.05.b.0(1)-release</samp>
	      </pre>

 |

经典Bash脚本语言版本2的主要升级内容, 增加了数组变量, [[1]](#FTN.AEN16155) 字符串和参数扩展, 还添加了间接变量引用的一种更好的方法, 以及其他特性.

* * *

**例子 34-1\. 字符串扩展**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 # 字符串扩展. 
  4 # Bash版本2中引入的特性. 
  5 
  6 #  /pre>xxx'格式的字符串
  7 #+ 具备解释里面标准转义字符的能力. 
  8 
  9 echo /pre>Ringing bell 3 times \a \a \a'
 10      # 可能在某些终端中, 只会响一次铃. 
 11 echo /pre>Three form feeds \f \f \f'
 12 echo /pre>10 newlines \n\n\n\n\n\n\n\n\n\n'
 13 echo /pre>\102\141\163\150'   # Bash
 14                            # 8进制的等价字符. 
 15 
 16 exit 0</pre>

 |

* * *

* * *

**例子 34-2\. 间接变量引用 - 新方法**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 # 间接变量引用. 
  4 # 这种方法比较像C++中的引用特性. 
  5 
  6 
  7 a=letter_of_alphabet
  8 letter_of_alphabet=z
  9 
 10 echo "a = $a"           # 直接引用. 
 11 
 12 echo "Now a = ${!a}"    # 间接引用. 
 13 # ${!variable}表示法比老式的"eval var1=\$var2"表示法高级的多. 
 14 
 15 echo
 16 
 17 t=table_cell_3
 18 table_cell_3=24
 19 echo "t = ${!t}"                      # t = 24
 20 table_cell_3=387
 21 echo "Value of t changed to ${!t}"    # 387
 22 
 23 #  在引用数组成员或者引用表的时候, 这种方法非常有用, 
 24 #+ 还可以用来模拟多维数组. 
 25 #  如果有能够索引的选项(类似于指针的算术运算)
 26 #+ 就更好了. 可惜. 
 27 
 28 exit 0</pre>

 |

* * *

* * *

**例子 34-3\. 使用间接变量引用的简单数据库应用**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # resistor-inventory.sh
  3 # 使用间接变量引用的简单数据库应用. 
  4 
  5 # ============================================================== #
  6 # 数据
  7 
  8 B1723_value=470                                   # 欧姆
  9 B1723_powerdissip=.25                             # 瓦特
 10 B1723_colorcode="yellow-violet-brown"             # 颜色
 11 B1723_loc=173                                     # 位置
 12 B1723_inventory=78                                # 数量
 13 
 14 B1724_value=1000
 15 B1724_powerdissip=.25
 16 B1724_colorcode="brown-black-red"
 17 B1724_loc=24N
 18 B1724_inventory=243
 19 
 20 B1725_value=10000
 21 B1725_powerdissip=.25
 22 B1725_colorcode="brown-black-orange"
 23 B1725_loc=24N
 24 B1725_inventory=89
 25 
 26 # ============================================================== #
 27 
 28 
 29 echo
 30 
 31 PS3='Enter catalog number: '
 32 
 33 echo
 34 
 35 select catalog_number in "B1723" "B1724" "B1725"
 36 do
 37   Inv=${catalog_number}_inventory
 38   Val=${catalog_number}_value
 39   Pdissip=${catalog_number}_powerdissip
 40   Loc=${catalog_number}_loc
 41   Ccode=${catalog_number}_colorcode
 42 
 43   echo
 44   echo "Catalog number $catalog_number:"
 45   echo "There are ${!Inv} of [${!Val} ohm / ${!Pdissip} watt] resistors in stock."
 46   echo "These are located in bin # ${!Loc}."
 47   echo "Their color code is \"${!Ccode}\"."
 48 
 49   break
 50 done
 51 
 52 echo; echo
 53 
 54 # 练习:
 55 # -----
 56 # 1) 重写脚本, 使其从外部文件读取数据. 
 57 # 2) 重写脚本, 
 58 #+   用数组来代替间接变量引用, 
 59 #    因为使用数组更简单, 更易懂. 
 60 
 61 
 62 # 注:
 63 # ---
 64 #  除了最简单的数据库应用, 事实上, Shell脚本本身并不适合于数据库应用. 
 65 #+ 因为它太依赖于工作环境和机器的运算能力. 
 66 #  更好的办法还是使用支持数据结构的本地语言, 
 67 #+ 比如C++或者Java(或者甚至可以是Perl). 
 68 
 69 exit 0</pre>

 |

* * *

* * *

**例子 34-4\. 使用数组和其他的小技巧来处理4人随机打牌**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 # 纸牌: 
  4 # 处理4人打牌. 
  5 
  6 UNPICKED=0
  7 PICKED=1
  8 
  9 DUPE_CARD=99
 10 
 11 LOWER_LIMIT=0
 12 UPPER_LIMIT=51
 13 CARDS_IN_SUIT=13
 14 CARDS=52
 15 
 16 declare -a Deck
 17 declare -a Suits
 18 declare -a Cards
 19 #  使用一个3维数组来代替这3个一维数组来描述数据, 
 20 #+ 可以更容易实现, 而且可以增加可读性. 
 21 #  或许在Bash未来的版本上会支持多维数组. 
 22 
 23 
 24 initialize_Deck ()
 25 {
 26 i=$LOWER_LIMIT
 27 until [ "$i" -gt $UPPER_LIMIT ]
 28 do
 29   Deck[i]=$UNPICKED   # 将整副"牌"的每一张都设置为无人持牌的状态. 
 30   let "i += 1"
 31 done
 32 echo
 33 }
 34 
 35 initialize_Suits ()
 36 {
 37 Suits[0]=C #梅花
 38 Suits[1]=D #方块
 39 Suits[2]=H #红心
 40 Suits[3]=S #黑桃
 41 }
 42 
 43 initialize_Cards ()
 44 {
 45 Cards=(2 3 4 5 6 7 8 9 10 J Q K A)
 46 # 另一种初始化数组的方法. 
 47 }
 48 
 49 pick_a_card ()
 50 {
 51 card_number=$RANDOM
 52 let "card_number %= $CARDS"
 53 if [ "${Deck[card_number]}" -eq $UNPICKED ]
 54 then
 55   Deck[card_number]=$PICKED
 56   return $card_number
 57 else  
 58   return $DUPE_CARD
 59 fi
 60 }
 61 
 62 parse_card ()
 63 {
 64 number=$1
 65 let "suit_number = number / CARDS_IN_SUIT"
 66 suit=${Suits[suit_number]}
 67 echo -n "$suit-"
 68 let "card_no = number % CARDS_IN_SUIT"
 69 Card=${Cards[card_no]}
 70 printf %-4s $Card
 71 # 使用整洁的列形式来打印每张牌. 
 72 }
 73 
 74 seed_random ()  # 种子随机数产生器. 
 75 {               # 如果不这么做, 会发生什么? 
 76 seed=`eval date +%s`
 77 let "seed %= 32766"
 78 RANDOM=$seed
 79 #  还有其他的方法
 80 #+ 能够产生种子随机数么? 
 81 }
 82 
 83 deal_cards ()
 84 {
 85 echo
 86 
 87 cards_picked=0
 88 while [ "$cards_picked" -le $UPPER_LIMIT ]
 89 do
 90   pick_a_card
 91   t=$?
 92 
 93   if [ "$t" -ne $DUPE_CARD ]
 94   then
 95     parse_card $t
 96 
 97     u=$cards_picked+1
 98     # 将数组索引改为从1(译者注: 数组都是从0开始索引的)开始(临时的). 为什么? 
 99     let "u %= $CARDS_IN_SUIT"
100     if [ "$u" -eq 0 ]   # 内嵌的if/then条件测试. 
101     then
102      echo
103      echo
104     fi
105     # 分手. 
106 
107     let "cards_picked += 1"
108   fi  
109 done  
110 
111 echo
112 
113 return 0
114 }
115 
116 
117 # 结构化编程: 
118 # 将函数中的整个程序逻辑模块化. 
119 
120 #================
121 seed_random
122 initialize_Deck
123 initialize_Suits
124 initialize_Cards
125 deal_cards
126 #================
127 
128 exit 0
129 
130 
131 
132 # 练习1:
133 # 完整的注释这个脚本. 
134 
135 # 练习2:
136 # 添加一个例程(函数)按照花色打印出每手牌. 
137 # 如果你喜欢, 可以添加任何你想要添加的代码. 
138 
139 # 练习3:
140 # 简化并理顺脚本逻辑. </pre>

 |

* * *

### 注意事项

| [[1]](bashver2.md#AEN16155) | 

Chet Ramey承诺会在Bash未来的版本中支持关联数组(一个Perl特性). 但是到了版本3, 他的承诺还没兑现.

 |