# 4.1\. 变量替换

变量的_名字_就是变量保存_值_的地方. 引用变量的值就叫做_变量替换_.

*   <span class="TOKEN">$</span>
*   让我们仔细的区别变量的_名字_和变量的_值_. 如果<kbd class="USERINPUT">variable1</kbd>是一个变量的名字, 那么<kbd class="USERINPUT">$variable1</kbd>就是引用这变量的_值_, 即这边变量所包含的数据.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">variable=23</kbd>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo variable</kbd>
    <samp class="COMPUTEROUTPUT">variable</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $variable</kbd>
    <samp class="COMPUTEROUTPUT">23</samp></pre>

     |

    当变量<span class="QUOTE">"裸体"</span>出现的时候 -- 也就是说没有<span class="TOKEN">$</span>前缀的时候 -- 那么变量可能存在如下几种情况. 变量被声明或被赋值, 变量被_unset_, 变量被[exporte](internal.md#EXPORTREF), 或者是变量处在一种特殊的情况 -- 变量代表一种[信号](debugging.md#SIGNALD)(参见 [例子 29-5](debugging.md#EX76)). 变量赋值可以使用<span class="TOKEN">=</span>(比如 _var1=27_), 也可以在[read](internal.md#READREF)命令中或者循环头进行赋值 (_for var2 in 1 2 3_).

    被一对_双引号_(<span class="TOKEN">" "</span>)括起来的变量替换是不会被阻止的. 所以双引号被称为_部分引用_, 有时候又被称为<span class="QUOTE">"弱引用"</span>. 但是如果使用单引号的话(<span class="TOKEN">' '</span>), 那么变量替换就会被禁止了, 变量名只会被解释成字面的意思, 不会发生变量替换. 所以单引号被称为_全引用_, 有时候也被称为<span class="QUOTE">"强引用"</span>. 详细讨论参见 [5](quoting.md).

    注意<kbd class="USERINPUT">$variable</kbd>事实上只是<kbd class="USERINPUT">${variable}</kbd>的简写形式. 在某些上下文中<kbd class="USERINPUT">$variable</kbd>可能会引起错误, 这时候你就需要用<kbd class="USERINPUT">${variable}</kbd>了(参见下边的[Section 9.3](parameter-substitution.md)).

    * * *

    **例子 4-1\. 变量赋值和替换**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 # 变量赋值和替换
      4 
      5 a=375
      6 hello=$a
      7 
      8 #-------------------------------------------------------------------------
      9 # 强烈注意, 在赋值的的时候, 等号前后一定不要有空格.
     10 # 如果出现空格会怎么样?
     11 
     12 #  "VARIABLE =value"
     13 #           ^
     14 #% 脚本将尝试运行一个"VARIABLE"的命令, 带着一个"=value"参数.
     15 
     16 #  "VARIABLE= value"
     17 #            ^
     18 #% 脚本将尝试运行一个"value"的命令, 
     19 #+ 并且带着一个被赋值成""的环境变量"VARIABLE". 
     20 #-------------------------------------------------------------------------
     21 
     22 
     23 echo hello    # 没有变量引用, 只是个hello字符串.
     24 
     25 echo $hello
     26 echo ${hello} # 同上.
     27 
     28 echo "$hello"
     29 echo "${hello}"
     30 
     31 echo
     32 
     33 hello="A B  C   D"
     34 echo $hello   # A B C D
     35 echo "$hello" # A B  C   D
     36 # 就象你看到的echo $hello   和    echo "$hello"   将给出不同的结果.
     37 # ===============================================================
     38 # 引用一个变量将保留其中的空白, 当然, 如果是变量替换就不会保留了.
     39 # ===============================================================
     40 
     41 echo
     42 
     43 echo '$hello'  # $hello
     44 #    ^      ^
     45 #  全引用的作用将会导致"$"被解释为单独的字符,
     46 #+ 而不是变量前缀. 
     47 
     48 # 注意这两种引用所产生的不同的效果.
     49 
     50 
     51 hello=    # 设置为空值.
     52 echo "\$hello (null value) = $hello"
     53 #  注意设置一个变量为null, 与unset这个变量, 并不是一回事
     54 #+ 虽然最终的结果相同(具体见下边).
     55 
     56 # --------------------------------------------------------------
     57 
     58 #  可以在同一行上设置多个变量, 
     59 #+ 但是必须以空白进行分隔.
     60 #  慎用, 这么做会降低可读性, 并且不可移植.
     61 
     62 var1=21  var2=22  var3=$V3
     63 echo
     64 echo "var1=$var1   var2=$var2   var3=$var3"
     65 
     66 # 在老版本的"sh"上可能会引起问题.
     67 
     68 # --------------------------------------------------------------
     69 
     70 echo; echo
     71 
     72 numbers="one two three"
     73 #           ^   ^
     74 other_numbers="1 2 3"
     75 #               ^ ^
     76 #  如果在变量中存在空白, If there is whitespace embedded within a variable,
     77 #+ 那么就必须加上引用.
     78 #  other_numbers=1 2 3                  # 给出一个错误消息. 
     79 echo "numbers = $numbers"
     80 echo "other_numbers = $other_numbers"   # other_numbers = 1 2 3
     81 #  不过也可以采用将空白转义的方法.
     82 mixed_bag=2\ ---\ Whatever
     83 #           ^    ^ 在转义符后边的空格(\).
     84 
     85 echo "$mixed_bag"         # 2 --- Whatever
     86 
     87 echo; echo
     88 
     89 echo "uninitialized_variable = $uninitialized_variable"
     90 # Uninitialized变量为null(就是没有值). 
     91 uninitialized_variable=   #  声明, 但是没有初始化这个变量, 
     92                           #+ 其实和前边设置为空值的作用是一样的. 
     93 echo "uninitialized_variable = $uninitialized_variable"
     94                           # 还是一个空值.
     95 
     96 uninitialized_variable=23       # 赋值.
     97 unset uninitialized_variable    # Unset这个变量.
     98 echo "uninitialized_variable = $uninitialized_variable"
     99                                 # 还是一个空值.
    100 echo
    101 
    102 exit 0</pre>

     |

    * * *

    | ![Caution](./images/caution.gif) | 

    一个未初始化的变量将会是<span class="QUOTE">"null"</span>值 - 就是未赋值(但并不是代表值是0!). 在给变量赋值之前就使用这个变量通常都会引起问题.

    但是在执行算术操作的时候, 仍然有可能使用未初始化过的变量.

    | 

    <pre class="PROGRAMLISTING">  1 echo "$uninitialized"                                # (blank line)
      2 let "uninitialized += 5"                             # Add 5 to it.
      3 echo "$uninitialized"                                # 5
      4 
      5 #  结论:
      6 #  一个未初始化的变量是没有值的, 
      7 #+ 但是在做算术操作的时候, 这个未初始化的变量看起来值为0\. 
      8 #  这是一个未文档化(并且可能不具可移植性)的行为. </pre>

     |

    参见[例子 11-22](internal.md#SELFSOURCE). |