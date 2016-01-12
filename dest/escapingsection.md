# 5.2\. 转义

_转义_是一种引用单个字符的方法. 一个前面放上<span class="TOKEN">转义符</span> (<span class="TOKEN">\</span>)的字符就是告诉shell这个字符按照字面的意思进行解释, 换句话说, 就是这个字符失去了它的特殊含义.

| ![Caution](./images/caution.gif) | 

在某些特定的命令和工具中, 比如[echo](internal.md#ECHOREF)和[sed](sedawk.md#SEDREF), 转义符往往会起到相反效果 - 它反倒可能会引发出这个字符的特殊含义.

 |

**特定的转义符的特殊的含义**

*   **echo**和**sed**命令中使用

*   <span class="TOKEN">\n</span>
*   表示新的一行

*   <span class="TOKEN">\r</span>
*   表示回车

*   <span class="TOKEN">\t</span>
*   表示水平制表符

*   <span class="TOKEN">\v</span>
*   表示垂直制表符

*   <span class="TOKEN">\b</span>
*   表示后退符

*   <span class="TOKEN">\a</span>
*   表示<span class="QUOTE">"alert"</span>(蜂鸣或者闪烁)

*   <span class="TOKEN">\0xx</span>
*   转换为八进制的ASCII码, 等价于<tt class="REPLACEABLE">_0xx_</tt>

    * * *

    **例子 5-2\. 转义符**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # escaped.sh: 转义符
      3 
      4 echo; echo
      5 
      6 echo "\v\v\v\v"      # 逐字的打印\v\v\v\v.
      7 # 使用-e选项的'echo'命令来打印转义符.
      8 echo "============="
      9 echo "VERTICAL TABS"
     10 echo -e "\v\v\v\v"   # 打印4个垂直制表符.
     11 echo "=============="
     12 
     13 echo "QUOTATION MARK"
     14 echo -e "\042"       # 打印" (引号, 8进制的ASCII 码就是42).
     15 echo "=============="
     16 
     17 # 如果使用/pre>\X'结构,那-e选项就不必要了.
     18 echo; echo "NEWLINE AND BEEP"
     19 echo /pre>\n'           # 新行.
     20 echo /pre>\a'           # 警告(蜂鸣).
     21 
     22 echo "==============="
     23 echo "QUOTATION MARKS"
     24 # 版本2以后Bash允许使用/pre>\nnn'结构.
     25 # 注意在这里, '\nnn\'是8进制的值.
     26 echo /pre>\t \042 \t'   # 被水平制表符括起来的引号(").
     27 
     28 # 当然,也可以使用16进制的值,使用/pre>\xhhh' 结构.
     29 echo /pre>\t \x22 \t'  # 被水平制表符括起来的引号(").
     30 # 感谢, Greg Keraunen, 指出了这点.
     31 # 早一点的Bash版本允许'\x022'这种形式.
     32 echo "==============="
     33 echo
     34 
     35 
     36 # 分配ASCII字符到变量中.
     37 # ----------------------------------------
     38 quote=/pre>\042'        # " 被赋值到变量中.
     39 echo "$quote This is a quoted string, $quote and this lies outside the quotes."
     40 
     41 echo
     42 
     43 # 变量中的连续的ASCII字符.
     44 triple_underline=/pre>\137\137\137'  # 137是八进制的'_'.
     45 echo "$triple_underline UNDERLINE $triple_underline"
     46 
     47 echo
     48 
     49 ABC=/pre>\101\102\103\010'           # 101, 102, 103是八进制码的A, B, C.
     50 echo $ABC
     51 
     52 echo; echo
     53 
     54 escape=/pre>\033'                    # 033 是八进制码的esc.
     55 echo "\"escape\" echoes as $escape"
     56 #                                   没有变量被输出.
     57 
     58 echo; echo
     59 
     60 exit 0</pre>

     |

    * * *

    参考[例子 34-1](bashver2.md#EX77), 这是关于<kbd class="USERINPUT">/kbd> '</kbd>字符串扩展结构的一个例子.

*   <span class="TOKEN">\"</span>
*   表示引号字面的意思

    | 

    <pre class="PROGRAMLISTING">  1 echo "Hello"                  # Hello
      2 echo "\"Hello\", he said."    # "Hello", he said.</pre>

     |

*   <span class="TOKEN">\$</span>
*   表示$本身子面的含义(跟在<span class="TOKEN">\$</span>后边的变量名将不能引用变量的值)

    | 

    <pre class="PROGRAMLISTING">  1 echo "\$variable01"  # 结果是$variable01</pre>

     |

*   <span class="TOKEN">\\</span>
*   表示反斜线字面的意思

    | 

    <pre class="PROGRAMLISTING">  1 echo "\\"  # 结果是\
      2 
      3 # 反之 . . .
      4 
      5 echo "\"   # 如果从命令行调用的话, 会出现SP2, 也就是2级提示符(译者注: 提示你命令不全, 在添加一个"就好了.
      6            # 如果在脚本中调用的话, 那么会报错. </pre>

     |

| ![Note](./images/note.gif) | 

<span class="TOKEN">\</span>的行为依赖于它自身是否被转义, 被引用(""), 或者是否出现在[命令替换](commandsub.md#COMMANDSUBREF)或[here document](here-docs.md#HEREDOCREF)中.

| 

<pre class="PROGRAMLISTING">  1                       #  简单的转义和引用
  2 echo \z               #  z
  3 echo \\z              # \z
  4 echo '\z'             # \z
  5 echo '\\z'            # \\z
  6 echo "\z"             # \z
  7 echo "\\z"            # \z
  8 
  9                       #  命令替换
 10 echo `echo \z`        #  z
 11 echo `echo \\z`       #  z
 12 echo `echo \\\z`      # \z
 13 echo `echo \\\\z`     # \z
 14 echo `echo \\\\\\z`   # \z
 15 echo `echo \\\\\\\z`  # \\z
 16 echo `echo "\z"`      # \z
 17 echo `echo "\\z"`     # \z
 18 
 19                       # Here document
 20 cat <<EOF              
 21 \z                      
 22 EOF                   # \z
 23 
 24 cat <<EOF              
 25 \\z                     
 26 EOF                   # \z
 27 
 28 # 这些例子是由Stephane Chazelas所提供的.</pre>

 |

赋值给变量的字符串的元素也会被转义, 但是不能把一个单独的转义符赋值给变量.

| 

<pre class="PROGRAMLISTING">  1 variable=\
  2 echo "$variable"
  3 # 不能正常运行 - 会报错:
  4 # test.sh: : command not found
  5 # 一个"裸体的"转义符是不能够安全的赋值给变量的.
  6 #
  7 #  事实上在这里"\"转义了一个换行符(变成了续航符的含义), 
  8 #+ 效果就是				variable=echo "$variable"
  9 #+                      不可用的变量赋值
 10 
 11 variable=\
 12 23skidoo
 13 echo "$variable"        #  23skidoo
 14                         #  这句是可以的, 因为
 15                         #+ 第2行是一个可用的变量赋值.
 16 
 17 variable=\ 
 18 #        \^    转义一个空格
 19 echo "$variable"        # 显示空格
 20 
 21 variable=\\
 22 echo "$variable"        # \
 23 
 24 variable=\\\
 25 echo "$variable"
 26 # 不能正常运行 - 报错:
 27 # test.sh: \: command not found
 28 #
 29 #  第一个转义符把第2个\转义了,但是第3个又变成"裸体的"了,
 30 #+ 与上边的例子的原因相同.
 31 
 32 variable=\\\\
 33 echo "$variable"        # \\
 34                         # 第2和第4个反斜线被转义了.
 35                         # 这是正确的. </pre>

 |

 |

转义一个空格会阻止命令行参数列表的<span class="QUOTE">"单词分割"</span>问题.

| 

<pre class="PROGRAMLISTING">  1 file_list="/bin/cat /bin/gzip /bin/more /usr/bin/less /usr/bin/emacs-20.7"
  2 # 列出的文件都作为命令的参数.
  3 
  4 # 加两个文件到参数列表中, 列出所有的文件信息.
  5 ls -l /usr/X11R6/bin/xsetroot /sbin/dump $file_list
  6 
  7 echo "-------------------------------------------------------------------------"
  8 
  9 # 如果我们将上边的两个空个转义了会产生什么效果?
 10 ls -l /usr/X11R6/bin/xsetroot\ /sbin/dump\ $file_list
 11 # 错误: 因为前3个路径被合并成一个参数传递给了'ls -l'
 12 #       而且两个经过转义的空格组织了参数(单词)分割. </pre>

 |

<span class="TOKEN">转义符</span>也提供续行功能, 也就是编写多行命令的功能. 一般的, 每一个单独行都包含一个不同的命令, 但是每行结尾的<span class="TOKEN">转义符</span>都会_转义换行符_, 这样下一行会与上一行一起形成一个命令序列.

| 

<pre class="PROGRAMLISTING">  1 (cd /source/directory && tar cf - . ) | \
  2 (cd /dest/directory && tar xpvf -)
  3 # 重复Alan Cox的目录数拷贝命令,
  4 # 但是分成两行是为了增加可读性.
  5 
  6 # 也可以使用如下方式:
  7 tar cf - -C /source/directory . |
  8 tar xpvf - -C /dest/directory
  9 # 察看下边的注意事项.
 10 # (感谢, Stephane Chazelas.)</pre>

 |

| ![Note](./images/note.gif) | 

如果一个脚本以<span class="TOKEN">|</span>结束, 管道符, 那么就不用非的加上转义符<span class="TOKEN">\</span>了. 但是一个好的编程风格, 还是应该在行尾加上转义符.

 |

| 

<pre class="PROGRAMLISTING">  1 echo "foo
  2 bar" 
  3 #foo
  4 #bar
  5 
  6 echo
  7 
  8 echo 'foo
  9 bar'    # 没什么区别.
 10 #foo
 11 #bar
 12 
 13 echo
 14 
 15 echo foo\
 16 bar     # 换行符被转义.
 17 #foobar
 18 
 19 echo
 20 
 21 echo "foo\
 22 bar"     # 与上边一样, \在部分引用中还是被解释为续行符. 
 23 #foobar
 24 
 25 echo
 26 
 27 echo 'foo\
 28 bar'     # 由于是全引用, 所以\没有被解释成续行符. 
 29 #foo\
 30 #bar
 31 
 32 # 由Stephane Chazelas所建议的用例.</pre>

 |