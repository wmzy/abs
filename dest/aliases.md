# 24\. 别名

Bash_别名_本质上来说不过就是个简称, 缩写, 是一种避免输入长命令序列的手段. 举个例子, 如果我们添加**alias lm="ls -l | more"**到文件[~/.bashrc](files.md#FILESREF1)中, 那么每次在命令行中键入<kbd class="USERINPUT">lm</kbd>就可以自动转换为 **ls -l | more**. 这可以让你在命令行上少敲好多次, 而且也可以避免记忆复杂的命令和繁多的选项. 设置**alias rm="rm -i"**(删除的时候提示), 可以让你在犯了错误之后也不用悲伤, 因为它可以让你避免意外删除重要文件.

在脚本中, 别名就没那么重要了. 如果把别名机制想象成C预处理器的某些功能的话, 就很形象, 比如说宏扩展, 但不幸的是, Bash不能在别名中扩展参数. [[1]](#FTN.AEN14578) 而且在脚本中, 别名不能够用在<span class="QUOTE">"混合型结构"</span>中, 比如[if/then](tests.md#IFTHEN)结构, 循环, 和函数. 还有一个限制, 别名不能递归扩展. 绝大多数情况下, 我们期望别名能够完成的工作, 都能够用[函数](functions.md#FUNCTIONREF)更高效的完成.

* * *

**例子 24-1\. 用在脚本中的别名**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # alias.sh
  3 
  4 shopt -s expand_aliases
  5 # 必须设置这个选项, 否则脚本不会打开别名功能. 
  6 
  7 
  8 # 首先, 来点有趣的. 
  9 alias Jesse_James='echo "\"Alias Jesse James\" was a 1959 comedy starring Bob Hope."'
 10 Jesse_James
 11 
 12 echo; echo; echo;
 13 
 14 alias ll="ls -l"
 15 # 可以使用单引号(')或双引号(")来定义一个别名. 
 16 
 17 echo "Trying aliased \"ll\":"
 18 ll /usr/X11R6/bin/mk*   #* 别名工作了. 
 19 
 20 echo
 21 
 22 directory=/usr/X11R6/bin/
 23 prefix=mk*  # 看一下通配符会不会引起麻烦. 
 24 echo "Variables \"directory\" + \"prefix\" = $directory$prefix"
 25 echo
 26 
 27 alias lll="ls -l $directory$prefix"
 28 
 29 echo "Trying aliased \"lll\":"
 30 lll         # 详细列出/usr/X11R6/bin目录下所有以mk开头的文件. 
 31 # 别名能处理连接变量 -- 包括通配符 -- o.k. 
 32 
 33 
 34 
 35 
 36 TRUE=1
 37 
 38 echo
 39 
 40 if [ TRUE ]
 41 then
 42   alias rr="ls -l"
 43   echo "Trying aliased \"rr\" within if/then statement:"
 44   rr /usr/X11R6/bin/mk*   #* 产生错误信息! 
 45   # 别名不能在混合结构中使用. 
 46   echo "However, previously expanded alias still recognized:"
 47   ll /usr/X11R6/bin/mk*
 48 fi  
 49 
 50 echo
 51 
 52 count=0
 53 while [ $count -lt 3 ]
 54 do
 55   alias rrr="ls -l"
 56   echo "Trying aliased \"rrr\" within \"while\" loop:"
 57   rrr /usr/X11R6/bin/mk*   #* 这里, 别名也不会扩展. 
 58                            #  alias.sh: line 57: rrr: command not found
 59   let count+=1
 60 done 
 61 
 62 echo; echo
 63 
 64 alias xyz='cat $0'   # 脚本打印自身内容. 
 65                      # 注意是单引号(强引用). 
 66 xyz
 67 #  虽然Bash文档建议, 它不能正常运行, 
 68 #+ 不过它看起来是可以运行的. 
 69 #
 70 #  然而, 就像Steve Jacobson所指出的那样, 
 71 #+ 参数"$0"立即扩展成了这个别名的声明. 
 72 
 73 exit 0</pre>

 |

* * *

**unalias**命令用来删除之前设置的_别名_.

* * *

**例子 24-2\. **unalias**: 设置与删除别名**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # unalias.sh
  3 
  4 shopt -s expand_aliases  # 启用别名扩展. 
  5 
  6 alias llm='ls -al | more'
  7 llm
  8 
  9 echo
 10 
 11 unalias llm              # 删除别名.
 12 llm
 13 # 产生错误信息, 因为'llm'已经不再有效了. 
 14 
 15 exit 0</pre>

 |

* * *

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">./unalias.sh</kbd>
<samp class="COMPUTEROUTPUT">total 6
drwxrwxr-x    2 bozo     bozo         3072 Feb  6 14:04 .
drwxr-xr-x   40 bozo     bozo         2048 Feb  6 14:04 ..
-rwxr-xr-x    1 bozo     bozo          199 Feb  6 14:04 unalias.sh

./unalias.sh: llm: command not found</samp></pre>

 |

### 注意事项

| [[1]](aliases.md#AEN14578) | 

然而, 别名好像能够扩展位置参数.

 |