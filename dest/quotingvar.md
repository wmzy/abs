# 5.1\. 引用变量

在一个双引号中通过直接使用变量名的方法来引用变量, 一般情况下都是没问题的. 这么做将阻止所有在引号中的特殊字符被重新解释 -- 包括变量名 [[1]](#FTN.AEN2090) -- 但是<span class="TOKEN">$</span>,<span class="TOKEN">`</span>(后置引用), 和<span class="TOKEN">\</span>(转义符)除外. [[2]](#FTN.AEN2096) 保留<span class="TOKEN">$</span>作为特殊字符的意义是为了能够在双引号中也能够正常的引用变量(<tt class="REPLACEABLE">_"$variable"_</tt>), 也就是说, 这个变量将被它的值所取代(参见上边的[例子 4-1](varsubn.md#EX9)).

使用双引号还能够阻止单词分割(word splitting). [[3]](#FTN.AEN2120) 如果一个参数被双引号扩起来的话, 那么这个参数将认为是一个单元, 即使这个参数包含有[空白](special-chars.md#WHITESPACEREF), 那里面的单词也不会被分隔开.

| 

<pre class="PROGRAMLISTING">  1 variable1="a variable containing five words"
  2 COMMAND This is $variable1    # 用下面7个参数执行COMMAND命令: 
  3 # "This" "is" "a" "variable" "containing" "five" "words"
  4 
  5 COMMAND "This is $variable1"  # 用下面1个参数执行COMMAND命令:
  6 # "This is a variable containing five words"
  7 
  8 
  9 variable2=""    # Empty.
 10 
 11 COMMAND $variable2 $variable2 $variable2        # COMMAND将不带参数执行. 
 12 COMMAND "$variable2" "$variable2" "$variable2"  # COMMAND将以3个空参数来执行. 
 13 COMMAND "$variable2 $variable2 $variable2"      # COMMAND将以1个参数来执行(2空格). 
 14 
 15 # 感谢, Stephane Chazelas.</pre>

 |

| ![Tip](./images/tip.gif) | 

在**echo**语句中, 只有在单词分割(word splitting)或者需要保留[空白](special-chars.md#WHITESPACEREF)的时候, 才需要把参数用双引号括起来.

 |

* * *

**例子 5-1\. echo出一些诡异变量**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # weirdvars.sh: echo出一些诡异变量.
  3 
  4 var="'(]\\{}\$\""
  5 echo $var        # '(]\{}$"
  6 echo "$var"      # '(]\{}$"     和上一句没什么区别.Doesn't make a difference.
  7 
  8 echo
  9 
 10 IFS='\'
 11 echo $var        # '(] {}$"     \ 字符被空白符替换了, 为什么?
 12 echo "$var"      # '(]\{}$"
 13 
 14 # 这个例子由Stephane Chazelas提供.
 15 
 16 exit 0</pre>

 |

* * *

单引号(<span class="TOKEN">' '</span>)操作与双引号基本一样, 但是不允许引用变量, 因为<span class="TOKEN">$</span>的特殊意义被关闭了. 在单引号中, _任何_特殊字符都按照字面的意思进行解释, 除了<span class="TOKEN">'</span>. 所以说单引号(<span class="QUOTE">"全引用"</span>)是一种比双引号(<span class="QUOTE">"部分引用"</span>)更严格的引用方法.

| ![Note](./images/note.gif) | 

因为即使是转义符(<span class="TOKEN">\</span>)在单引号中也是按照字面意思解释的, 所以如果想在一对单引号中显示一个单引号是不行的(译者注: 因为单引号对是按照就近原则完成的).

| 

<pre class="PROGRAMLISTING">  1 echo "Why can't I write 's between single quotes"
  2 
  3 echo
  4 
  5 # 一种绕弯的方法.
  6 echo 'Why can'\''t I write '"'"'s between single quotes'
  7 #    |-------|  |----------|   |-----------------------|
  8 # 三个被单引号引用的字符串, 在这三个字符串之间有一个用转义符转义的单引号, 和一个用双引号括起来的单引号.
  9 
 10 # 这个例子由Stephane Chazelas所捐赠.</pre>

 |

 |

### 注意事项

| [[1]](quotingvar.md#AEN2090) | 

即使是变量的_值_也会有副作用的(见下边)

 |
| [[2]](quotingvar.md#AEN2096) | 

_当在命令行中使用时_, 如果在双引号中包含<span class="QUOTE">"!"</span>的话, 那么会产生一个错误(译者注: 比如, echo "hello!"). 这是因为感叹号被解释成[历史命令](histcommands.md)了. 但是如果在脚本中, 就不会存在这个问题, 因为在脚本中Bash历史机制是被禁用的.

在双引号中使用<span class="QUOTE">"\"</span>也可能会出现一些不一致的行为.

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo hello\!</kbd>
<samp class="COMPUTEROUTPUT">hello!</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo "hello\!"</kbd>
<samp class="COMPUTEROUTPUT">hello\!</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo -e x\ty</kbd>
<samp class="COMPUTEROUTPUT">xty</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo -e "x\ty"</kbd>
<samp class="COMPUTEROUTPUT">x       y</samp>
	      </pre>

 |

(感谢, Wayne Pollock, 指出这个问题.) |
| [[3]](quotingvar.md#AEN2120) | 

<span class="QUOTE">"单词分割(Word splitting)"</span>, 在这种上下文中, 意味着将一个字符串分隔成一些不连续的, 分离的参数.

 |