# 19.1\. 一份简要的正则表达式介绍

正则表达式就是由一系列特殊字符组成的字符串, 其中每个特殊字符都被称为_元字符_, 这些_元字符_并不表示为它们字面上的含义, 而会被解释为一些特定的含义. 具个例子, 比如引用符号, 可能就是表示某人的演讲内容, _同上_, 也可能表示为我们下面将要讲到的符号的元-含义. 正则表达式其实是由普通字符和元字符共同组成的集合, 这个集合用来匹配(或指定)模式.

一个正则表达式会包含下列一项或多项:

*   _一个字符集_. 这里所指的字符集只包含普通字符, 这些字符只表示它们的字面含义. 正则表达式的最简单形式就是_只_包含字符集, 而不包含元字符.

*   _锚_. _锚_指定了正则表达式所要匹配的文本在文本行中所处的位置. 比如, <span class="TOKEN">^</span>, 和<span class="TOKEN">$</span>就是锚.

*   _修饰符_. 它们扩大或缩小(_修改_)了正则表达式匹配文本的范围. 修饰符包含星号, 括号, 和反斜杠.

正则表达式最主要的目的就是用于(_RE_)文本搜索与字符串操作. (译者注: 以下正则表达式也会被简称为_RE_.) RE能够_匹配_单个字符或者一个字符集 -- 即, 一个字符串, 或者一个字符串的一部分.

*   星号 -- <span class="TOKEN">*</span> -- 用来匹配它前面字符的任意多次, _包括0次_.

    <span class="QUOTE">"1133*"</span>匹配<tt class="REPLACEABLE">_11 + 一个或多个3 + 也允许后边还有其他字符_</tt>: <tt class="REPLACEABLE">_113_</tt>, <tt class="REPLACEABLE">_1133_</tt>, <tt class="REPLACEABLE">_111312_</tt>, 等等.

*   点 -- <span class="TOKEN">.</span> -- 用于匹配任意一个字符, 除了换行符. [[1]](#FTN.AEN13683)

    <span class="QUOTE">"13."</span> 匹配<tt class="REPLACEABLE">_13 + 至少一个任意字符(包括空格)_</tt>: <tt class="REPLACEABLE">_1133_</tt>, <tt class="REPLACEABLE">_11333_</tt>, 但不能匹配<tt class="REPLACEABLE">_13_</tt> (因为缺少"."所能匹配的至少一个任意字符).

*   脱字符号 -- <span class="TOKEN">^</span> -- 匹配行首, 但是某些时候需要依赖上下文环境, 在RE中, 有时候也表示对一个字符集取反.

*   美元符 -- <span class="TOKEN">$</span> -- 在RE中用来匹配行尾.

    <span class="QUOTE">"XXX$"</span> 匹配行尾的_XXX_.

    <span class="QUOTE">"^$"</span> 匹配空行.

*   中括号 -- <span class="TOKEN">[...]</span> -- 在RE中, 将匹配中括号字符集中的某一个字符.

    <span class="QUOTE">"[xyz]"</span> 将会匹配字符<tt class="REPLACEABLE">_x_</tt>, <tt class="REPLACEABLE">_y_</tt>, 或<tt class="REPLACEABLE">_z_</tt>.

    <span class="QUOTE">"[c-n]"</span> 匹配字符<tt class="REPLACEABLE">_c_</tt>到字符<tt class="REPLACEABLE">_n_</tt>之间的任意一个字符.

    <span class="QUOTE">"[B-Pk-y]"</span> 匹配从<tt class="REPLACEABLE">_B_</tt>到<tt class="REPLACEABLE">_P_</tt>, 或者从<tt class="REPLACEABLE">_k_</tt>到<tt class="REPLACEABLE">_y_</tt>之间的任意一个字符.

    <span class="QUOTE">"[a-z0-9]"</span> 匹配任意小写字母或数字.

    <span class="QUOTE">"[^b-d]"</span> 将会匹配范围在<tt class="REPLACEABLE">_b_</tt>到<tt class="REPLACEABLE">_d_</tt>_之外的_任意一个字符. 这就是使用<span class="TOKEN">^</span>对字符集取反的一个实例. (就好像在某些情况下, <span class="TOKEN">!</span>所表达的含义).

    将多个中括号字符集组合使用, 能够匹配一般的单词或数字. <span class="QUOTE">"[Yy][Ee][Ss]"</span>能够匹配<tt class="REPLACEABLE">_yes_</tt>, <tt class="REPLACEABLE">_Yes_</tt>, <tt class="REPLACEABLE">_YES_</tt>, <tt class="REPLACEABLE">_yEs_</tt>, 等等. <span class="QUOTE">"[0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9]"</span> 可以匹配社保码(Social Security number).

*   反斜杠 -- <span class="TOKEN">\</span> -- 用来[转义](escapingsection.md#ESCP)某个特殊含义的字符, 这意味着, 这个特殊字符将会被解释为字面含义.

    <span class="QUOTE">"\$"</span>将会被解释成字符<span class="QUOTE">"$"</span>, 而不是RE中匹配行尾的特殊字符. 相似的, <span class="QUOTE">"\\"</span>将会被解释为字符<span class="QUOTE">"\"</span>.

*   [转义](escapingsection.md#ESCP)的<span class="QUOTE">"尖括号"</span> -- <span class="TOKEN">\<...\></span> -- 用于匹配单词边界.

    尖括号必须被转义才含有特殊的含义, 否则它就表示尖括号的字面含义.

    <span class="QUOTE">"\<the\>"</span> 完整匹配单词<span class="QUOTE">"the"</span>, 不会匹配<span class="QUOTE">"them"</span>, <span class="QUOTE">"there"</span>, <span class="QUOTE">"other"</span>, 等等.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cat textfile</kbd>
    <samp class="COMPUTEROUTPUT">This is line 1, of which there is only one instance.
     This is the only instance of line 2.
     This is line 3, another line.
     This is line 4.</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">grep 'the' textfile</kbd>
    <samp class="COMPUTEROUTPUT">This is line 1, of which there is only one instance.
     This is the only instance of line 2.
     This is line 3, another line.</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">grep '\<the\>' textfile</kbd>
    <samp class="COMPUTEROUTPUT">This is the only instance of line 2.</samp>
    	      </pre>

     |

| 

要想确定一个RE能否正常工作, 唯一的办法就是测试它.

| 

<pre class="PROGRAMLISTING">TEST FILE: tstfile                          # 不匹配.
                                            # 不匹配.
Run   grep "1133*"  on this file.           # 匹配.
                                            # 不匹配.
                                            # 不匹配.
This line contains the number 113\.          # 匹配.
This line contains the number 13\.           # 不匹配.
This line contains the number 133\.          # 不匹配.
This line contains the number 1133\.         # 匹配.
This line contains the number 113312\.       # 匹配.
This line contains the number 1112\.         # 不匹配.
This line contains the number 113312312\.    # 匹配.
This line contains no numbers at all.       # 不匹配. </pre>

 |

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">grep "1133*" tstfile</kbd>
<samp class="COMPUTEROUTPUT">Run   grep "1133*"  on this file.           # 匹配.
 This line contains the number 113\.          # 匹配.
 This line contains the number 1133\.         # 匹配.
 This line contains the number 113312\.       # 匹配.
 This line contains the number 113312312\.    # 匹配.</samp> 
	      </pre>

 |

 |

*   **扩展的正则表达式.** 添加了一些额外的匹配字符到基本集合中. 用于[egrep](textproc.md#EGREPREF), [awk](awk.md#AWKREF), 和[Perl](wrapper.md#PERLREF).

*   问号 -- <span class="TOKEN">?</span> -- 匹配它前面的字符, 但是只能匹配1次或0次. 通常用来匹配单个字符.

*   加号 -- <span class="TOKEN">+</span> -- 匹配它前面的字符, 能够匹配一次或多次. 与前面讲的<span class="TOKEN">*</span>号作用类似, 但是_不能_匹配0个字符的情况.

    | 

    <pre class="PROGRAMLISTING"># GNU版本的sed和awk能够使用"+",
    # 但是它需要被转义一下. 

    echo a111b | sed -ne '/a1\+b/p'
    echo a111b | grep 'a1\+b'
    echo a111b | gawk '/a1+b/'
    # 上边3句的作用相同. 

    # 感谢, S.C.</pre>

     |

*   [转义](escapingsection.md#ESCP)<span class="QUOTE">"大括号"</span> -- <span class="TOKEN">\{ \}</span> -- 在转义后的大括号中加上一个数字, 这个数字就是它前面的RE所能匹配的次数.

    大括号必须经过转义, 否则, 大括号仅仅表示字面含意. 这种用法并不是基本RE集合中的一部分, 仅仅是个技巧而以.

    <span class="QUOTE">"[0-9]\{5\}"</span> 精确匹配5个数字 (所匹配的字符范围是0到9).

    | ![Note](./images/note.gif) | 

    使用大括号形式的RE是不能够在<span class="QUOTE">"经典"</span>(非POSIX兼容)的[awk](awk.md#AWKREF)版本中正常运行的. 然而, **gawk**命令中有一个`--re-interval`选项, 使用这个选项就允许使用大括号形式的RE了(无需转义).

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo 2222 | gawk --re-interval '/2{3}/'</kbd>
    <samp class="COMPUTEROUTPUT">2222</samp>
    	      </pre>

     |

    **Perl**与某些版本的**egrep**不需要转义大括号.

     |

*   圆括号 -- **( )** -- 括起一组正则表达式. 当你想使用[expr](moreadv.md#EXPRREF)进行[子字符串提取(substring extraction)](string-manipulation.md#EXPRPAREN)的时候, 圆括号就有用了. 如果和下面要讲的<span class="QUOTE">"<span class="TOKEN">|</span>"</span>操作符结合使用, 也非常有用.

*   竖线 -- **|** -- 就是RE中的<span class="QUOTE">"或"</span>操作符, 使用它能够匹配一组可选字符中的任意一个.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">egrep 're(a|e)d' misc.txt</kbd>
    <samp class="COMPUTEROUTPUT">People who read seem to be better informed than those who do not.
     The clarinet produces sound by the vibration of its reed.</samp>
    	      </pre>

     |

| ![Note](./images/note.gif) | 

与GNU工具一样, 某些版本的**sed**, **ed**, 和**ex**一样能够支持扩展正则表达式, 上边这部分就描述了扩展正则表达式.

 |

*   **POSIX字符类.** <kbd class="USERINPUT">[:class:]</kbd>

    这是另外一种, 用于指定匹配字符范围的方法.

*   <kbd class="USERINPUT">[:alnum:]</kbd> 匹配字母和数字. 等价于<kbd class="USERINPUT">A-Za-z0-9</kbd>.

*   <kbd class="USERINPUT">[:alpha:]</kbd> 匹配字母. 等价于<kbd class="USERINPUT">A-Za-z</kbd>.

*   <kbd class="USERINPUT">[:blank:]</kbd> 匹配一个空格或是一个制表符(tab).

*   <kbd class="USERINPUT">[:cntrl:]</kbd> 匹配控制字符.

*   <kbd class="USERINPUT">[:digit:]</kbd> 匹配(十进制)数字. 等价于<kbd class="USERINPUT">0-9</kbd>.

*   <kbd class="USERINPUT">[:graph:]</kbd> (可打印的图形字符). 匹配ASCII码值范围在33 - 126之间的字符. 与下面所提到的<kbd class="USERINPUT">[:print:]</kbd>类似, 但是不包括空格字符(空格字符的ASCII码是32).

*   <kbd class="USERINPUT">[:lower:]</kbd> 匹配小写字母. 等价于<kbd class="USERINPUT">a-z</kbd>.

*   <kbd class="USERINPUT">[:print:]</kbd> (可打印的图形字符). 匹配ASCII码值范围在32 - 126之间的字符. 与上边的<kbd class="USERINPUT">[:graph:]</kbd>类似, 但是包含空格.

*   <kbd class="USERINPUT">[:space:]</kbd> 匹配空白字符(空格和水平制表符).

*   <kbd class="USERINPUT">[:upper:]</kbd> 匹配大写字母. 等价于<kbd class="USERINPUT">A-Z</kbd>.

*   <kbd class="USERINPUT">[:xdigit:]</kbd> 匹配16进制数字. 等价于<kbd class="USERINPUT">0-9A-Fa-f</kbd>.

    | ![Important](./images/important.gif) | 

    POSIX字符类通常都要用引号或[双中括号](testconstructs.md#DBLBRACKETS)([[ ]])引起来.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">grep [[:digit:]] test.file</kbd>
    <samp class="COMPUTEROUTPUT">abc=723</samp>
    	      </pre>

     |

    如果在一个受限的范围内, 这些字符类甚至可以用在[通配(globbing)](globbingref.md)中.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ls -l ?[[:digit:]][[:digit:]]?</kbd>
    <samp class="COMPUTEROUTPUT">-rw-rw-r--    1 bozo  bozo         0 Aug 21 14:47 a33b</samp>
    	      </pre>

     |

    如果想了解POSIX字符类在脚本中的使用情况, 请参考[例子 12-18](textproc.md#EX49)和[例子 12-19](textproc.md#LOWERCASE).

     |

[Sed](sedawk.md#SEDREF), [awk](awk.md#AWKREF), 和[Perl](wrapper.md#PERLREF)在脚本中一般都被用作过滤器, 这些过滤器将会以RE为参数, 对文件或者I/O流进行"过滤"或转换. 请参考[例子 A-12](contributed-scripts.md#BEHEAD)和[例子 A-17](contributed-scripts.md#TREE), 来详细了解这种用法.

对于RE这个复杂的主题, 标准的参考材料是Friedl的_Mastering Regular Expressions_. 由Dougherty和Robbins所编写的_Sed & Awk_这本书, 也对RE进行了清晰的论述. 如果想获得这些书的更多信息, 请察看[参考文献](biblio.md).

### 注意事项

| [[1]](intro_regular.md#AEN13683) | 

因为[sed](sedawk.md#SEDREF), [awk](awk.md#AWKREF), 和[grep](textproc.md#GREPREF)通常用于处理单行, 但是不能匹配一个换行符. 如果你想处理多行输入的话, 那么你可以使用"点"来匹配换行符.

| 

<pre class="PROGRAMLISTING">#!/bin/bash

sed -e 'N;s/.*/[&]/' << EOF   # Here Document
line1
line2
EOF
# 输出:
# [line1
# line2]

echo

awk '{ $0=$1 "\n" $2; if (/line.1/) {print}}' << EOF
line 1
line 2
EOF
# 输出:
# line
# 1

# 感谢, S.C.

exit 0</pre>

 |

 |