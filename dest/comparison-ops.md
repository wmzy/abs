# 7.3\. 其他比较操作符

_二元_比较操作符用来比较两个变量或数字. 注意整数比较与字符串比较的区别.

**整数比较**

*   <span class="TOKEN">-eq</span>
*   等于

    <kbd class="USERINPUT">if [ "$a" -eq "$b" ]</kbd>

*   <span class="TOKEN">-ne</span>
*   不等于

    <kbd class="USERINPUT">if [ "$a" -ne "$b" ]</kbd>

*   <span class="TOKEN">-gt</span>
*   大于

    <kbd class="USERINPUT">if [ "$a" -gt "$b" ]</kbd>

*   <span class="TOKEN">-ge</span>
*   大于等于

    <kbd class="USERINPUT">if [ "$a" -ge "$b" ]</kbd>

*   <span class="TOKEN">-lt</span>
*   小于

    <kbd class="USERINPUT">if [ "$a" -lt "$b" ]</kbd>

*   <span class="TOKEN">-le</span>
*   小于等于

    <kbd class="USERINPUT">if [ "$a" -le "$b" ]</kbd>

*   <span class="TOKEN"><</span>
*   小于(在[双括号](dblparens.md)中使用)

    <kbd class="USERINPUT">(("$a" < "$b"))</kbd>

*   <span class="TOKEN"><=</span>
*   小于等于(在双括号中使用)

    <kbd class="USERINPUT">(("$a" <= "$b"))</kbd>

*   <span class="TOKEN">></span>
*   大于(在双括号中使用)

    <kbd class="USERINPUT">(("$a" > "$b"))</kbd>

*   <span class="TOKEN">>=</span>
*   大于等于(在双括号中使用)

    <kbd class="USERINPUT">(("$a" >= "$b"))</kbd>

**字符串比较**

*   <span class="TOKEN">=</span>
*   等于

    <kbd class="USERINPUT">if [ "$a" = "$b" ]</kbd>

*   <span class="TOKEN">==</span>
*   等于

    <kbd class="USERINPUT">if [ "$a" == "$b" ]</kbd>

    与<span class="TOKEN">=</span>等价.

    | ![Note](./images/note.gif) | 

    <span class="TOKEN">==</span>比较操作符在[双中括号对](testconstructs.md#DBLBRACKETS)和单中括号对中的行为是不同的.

    | 

    <pre class="PROGRAMLISTING">  1 [[ $a == z* ]]    # 如果$a以"z"开头(模式匹配)那么结果将为真
      2 [[ $a == "z*" ]]  # 如果$a与z*相等(就是字面意思完全一样), 那么结果为真.
      3 
      4 [ $a == z* ]      # 文件扩展匹配(file globbing)和单词分割有效. 
      5 [ "$a" == "z*" ]  # 如果$a与z*相等(就是字面意思完全一样), 那么结果为真. 
      6 
      7 # 感谢, Stephane Chazelas</pre>

     |

     |

*   <span class="TOKEN">!=</span>
*   不等号

    <kbd class="USERINPUT">if [ "$a" != "$b" ]</kbd>

    这个操作符将在[[[ ... ]]](testconstructs.md#DBLBRACKETS)结构中使用模式匹配.

*   <span class="TOKEN"><</span>
*   小于, 按照ASCII字符进行排序

    <kbd class="USERINPUT">if [[ "$a" < "$b" ]]</kbd>

    <kbd class="USERINPUT">if [ "$a" \< "$b" ]</kbd>

    注意<span class="QUOTE">"<"</span>使用在<kbd class="USERINPUT">[ ]</kbd>结构中的时候需要被转义.

*   <span class="TOKEN">></span>
*   大于, 按照ASCII字符进行排序

    <kbd class="USERINPUT">if [[ "$a" > "$b" ]]</kbd>

    <kbd class="USERINPUT">if [ "$a" \> "$b" ]</kbd>

    注意<span class="QUOTE">">"</span>使用在<kbd class="USERINPUT">[ ]</kbd>结构中的时候需要被转义.

    参考[例子 26-11](arrays.md#BUBBLE), 这个例子展示了如何使用这个比较操作符.

*   <span class="TOKEN">-z</span>
*   字符串为<span class="QUOTE">"null"</span>, 意思就是字符串长度为零

*   <span class="TOKEN">-n</span>
*   字符串不为<span class="QUOTE">"null"</span>.

    | ![Caution](./images/caution.gif) | 

    当<kbd class="USERINPUT">-n</kbd>使用在中括号中进行条件测试的时候, 必须要把字符串用双引号引用起来. 如果采用了未引用的字符串来使用<kbd class="USERINPUT">! -z</kbd>, 甚至是在条件测试中括号(参见[例子 7-6](comparison-ops.md#STRTEST))中只使用未引用的字符串的话, 一般也是可以工作的, 然而, 这是一种不安全的习惯. _习惯于_使用引用的测试字符串才是正路. [[1]](#FTN.AEN2980)

     |

* * *

**例子 7-5\. 算术比较与字符串比较**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 a=4
  4 b=5
  5 
  6 #  这里的"a"和"b"既可以被认为是整型也可被认为是字符串. 
  7 #  这里在算术比较与字符串比较之间是容易让人产生混淆, 
  8 #+ 因为Bash变量并不是强类型的.
  9 
 10 #  Bash允许对于变量进行整形操作与比较操作.
 11 #+ 但前提是变量中只能包含数字字符.
 12 #  不管怎么样, 还是要小心. 
 13 
 14 echo
 15 
 16 if [ "$a" -ne "$b" ]
 17 then
 18   echo "$a is not equal to $b"
 19   echo "(arithmetic comparison)"
 20 fi
 21 
 22 echo
 23 
 24 if [ "$a" != "$b" ]
 25 then
 26   echo "$a is not equal to $b."
 27   echo "(string comparison)"
 28   #     "4"  != "5"
 29   # ASCII 52 != ASCII 53
 30 fi
 31 
 32 # 在这个特定的例子中, "-ne"和"!="都可以. 
 33 
 34 echo
 35 
 36 exit 0</pre>

 |

* * *

* * *

**例子 7-6\. 检查字符串是否为_null_**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 #  str-test.sh: 检查null字符串和未引用的字符串,
  3 #+ but not strings and sealing wax, not to mention cabbages and kings . . .
  4 #+ 但不是字符串和封蜡, 也并没有提到卷心菜和国王. . . ??? (没看懂, rojy bug)
  5 
  6 # 使用   if [ ... ]
  7 
  8 
  9 # 如果字符串并没有被初始化, 那么它里面的值未定义.
 10 # 这种状态被称为"null" (注意这与零值不同).
 11 
 12 if [ -n $string1 ]    # $string1 没有被声明和初始化.
 13 then
 14   echo "String \"string1\" is not null."
 15 else  
 16   echo "String \"string1\" is null."
 17 fi  
 18 # 错误的结果.
 19 # 显示$string1为非null, 虽然这个变量并没有被初始化.
 20 
 21 
 22 echo
 23 
 24 
 25 # 让我们再试一下.
 26 
 27 if [ -n "$string1" ]  # 这次$string1被引号扩起来了. 
 28 then
 29   echo "String \"string1\" is not null."
 30 else  
 31   echo "String \"string1\" is null."
 32 fi                    # 注意一定要将引用的字符放到中括号结构中!
 33 
 34 
 35 echo
 36 
 37 
 38 if [ $string1 ]       # 这次, 就一个$string1, 什么都不加.
 39 then
 40   echo "String \"string1\" is not null."
 41 else  
 42   echo "String \"string1\" is null."
 43 fi  
 44 # 这种情况运行的非常好.
 45 # [ ] 测试操作符能够独立检查string是否为null.
 46 # 然而, 使用("$string1")是一种非常好的习惯.
 47 #
 48 # 就像Stephane Chazelas所指出的,
 49 #    if [ $string1 ]    只有一个参数, "]"
 50 #    if [ "$string1" ]  有两个参数, 一个是空的"$string1", 另一个是"]" 
 51 
 52 
 53 
 54 echo
 55 
 56 
 57 
 58 string1=initialized
 59 
 60 if [ $string1 ]       # 再来, 还是只有$string1, 什么都不加.
 61 then
 62   echo "String \"string1\" is not null."
 63 else  
 64   echo "String \"string1\" is null."
 65 fi  
 66 # 再来试一下, 给出了正确的结果.
 67 # 再强调一下, 使用引用的("$string1")还是更好一些, 原因我们上边已经说过了.
 68 
 69 
 70 string1="a = b"
 71 
 72 if [ $string1 ]       # 再来, 还是只有$string1, 什么都不加.
 73 then
 74   echo "String \"string1\" is not null."
 75 else  
 76   echo "String \"string1\" is null."
 77 fi  
 78 # 未引用的"$string1", 这回给出了错误的结果! 
 79 
 80 exit 0
 81 # 也感谢Florian Wisser, 给出了上面这个"足智多谋"的例子.</pre>

 |

* * *

* * *

**例子 7-7\. **zmore****

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # zmore
  3 
  4 #使用'more'来查看gzip文件
  5 
  6 NOARGS=65
  7 NOTFOUND=66
  8 NOTGZIP=67
  9 
 10 if [ $# -eq 0 ] # 与if [ -z "$1" ]效果相同
 11 # (译者注: 上边这句注释有问题), $1是可以存在的, 可以为空, 如:  zmore "" arg2 arg3
 12 then
 13   echo "Usage: `basename $0` filename" >&2
 14   # 错误消息输出到stderr.
 15   exit $NOARGS
 16   # 返回65作为脚本的退出状态的值(错误码).
 17 fi  
 18 
 19 filename=$1
 20 
 21 if [ ! -f "$filename" ]   # 将$filename引用起来, 这样允许其中包含空白字符. 
 22 then
 23   echo "File $filename not found!" >&2
 24   # 错误消息输出到stderr.
 25   exit $NOTFOUND
 26 fi  
 27 
 28 if [ ${filename##*.} != "gz" ]
 29 # 在变量替换中使用中括号结构.
 30 then
 31   echo "File $1 is not a gzipped file!"
 32   exit $NOTGZIP
 33 fi  
 34 
 35 zcat $1 | more
 36 
 37 # 使用过滤命令'more.'
 38 # 当然, 如果你愿意, 也可以使用'less'.
 39 
 40 
 41 exit $?   # 脚本将把管道的退出状态作为返回值.
 42 # 事实上, 也不一定非要加上"exit $?", 因为在任何情况下,
 43 # 脚本都会将最后一条命令的退出状态作为返回值.</pre>

 |

* * *

**compound comparison**

*   <span class="TOKEN">-a</span>
*   逻辑与

    <tt class="REPLACEABLE">_exp1 -a exp2_</tt> 如果表达式exp1和exp2_都_为真的话, 那么结果为真.

*   <span class="TOKEN">-o</span>
*   逻辑或

    <tt class="REPLACEABLE">_exp1 -o exp2_</tt> 如果表达式exp1和exp2中_至少_有一个为真的话, 那么结果为真.

这与Bash中的比较操作符**&&**和**||**非常相像, 但是这个两个操作符是用在[双中括号结构](testconstructs.md#DBLBRACKETS)中的.

| 

<pre class="PROGRAMLISTING">  1 [[ condition1 && condition2 ]]</pre>

 |

**-o**和**-a**操作符一般都是和**test**命令或者是单中括号结构一起使用的.

| 

<pre class="PROGRAMLISTING">  1 if [ "$exp1" -a "$exp2" ]</pre>

 |

请参考[例子 8-3](ops.md#ANDOR), [例子 26-16](arrays.md#TWODIM), 和[例子 A-29](contributed-scripts.md#WHX), 这几个例子演示了混合比较操作符的行为.

### 注意事项

| [[1]](comparison-ops.md#AEN2980) | 

就像S.C.所指出的那样, 在一个混合测试中, 即使使用引用的字符串变量也可能还不够. 如果`$string`为空的话, <kbd class="USERINPUT">[ -n "$string" -o "$a" = "$b" ]</kbd>可能会在某些版本的Bash中产生错误. 安全的做法是附加一个额外的字符给可能的空变量, <kbd class="USERINPUT">[ "x$string" != x -o "x$a" = "x$b" ]</kbd> (<span class="QUOTE">"x"</span>字符是可以相互抵消的).

 |