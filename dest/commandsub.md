# 14\. 命令替换

**命令替换**能够重新分配一个[[1]](#FTN.AEN13093) 甚至是多个命令的输出; 它会将命令的输出如实地添加到另一个上下文中. [[2]](#FTN.AEN13099)

命令替换的典型用法形式, 是使用_后置引用_(`...`). 使用后置引用的(反引号)命令会产生命令行文本.

| 

<pre class="PROGRAMLISTING">  1 script_name=`basename $0`
  2 echo "The name of this script is $script_name."</pre>

 |

**这样一来, 命令的输出就能够保存到变量中, 或者传递到另一个命令中作为这个命令的参数, 甚至可以用来产生[for](loops1.md#FORLOOPREF1)循环的参数列表. .**

| 

<pre class="PROGRAMLISTING">  1 rm `cat filename`   # <span class="QUOTE">"filename"</span>包含了需要被删除的文件列表. 
  2 #
  3 # S. C. 指出, 这种使用方法可能会产生"参数列表太长"的错误. 
  4 # 更好的方法是              xargs rm -- < filename 
  5 # ( -- 同时涵盖了某些特殊情况, 这种特殊情况就是, 以<span class="QUOTE">"-"</span>开头的文件名会产生不良结果.)
  6 
  7 textfile_listing=`ls *.txt`
  8 # 变量中包含了当前工作目录下所有的*.txt文件. 
  9 echo $textfile_listing
 10 
 11 textfile_listing2=$(ls *.txt)   # 这是命令替换的另一种形式. 
 12 echo $textfile_listing2
 13 # 同样的结果. 
 14 
 15 # 如果将文件列表放入到一个字符串中的话, 
 16 # 可能会混入一个新行. 
 17 #
 18 # 一种安全的将文件列表传递到参数中的方法就是使用数组. 
 19 #      shopt -s nullglob    # 如果不匹配, 那就不进行文件名扩展. 
 20 #      textfile_listing=( *.txt )
 21 #
 22 # 感谢, S.C.</pre>

 |

| ![Note](./images/note.gif) | 

命令替换将会调用一个[subshell](subshells.md#SUBSHELLSREF).

 |

| ![Caution](./images/caution.gif) | 

命令替换可能会引起单词分割(word split).

| 

<pre class="PROGRAMLISTING">  1 COMMAND `echo a b`     # 两个参数: a and b
  2 
  3 COMMAND "`echo a b`"   # 1个参数: "a b"
  4 
  5 COMMAND `echo`         # 无参数
  6 
  7 COMMAND "`echo`"       # 一个空参数
  8 
  9 
 10 # 感谢, S.C.</pre>

 |

即使没有引起单词分割(word split), 命令替换也会去掉多余的新行.

| 

<pre class="PROGRAMLISTING">  1 # cd "`pwd`"  # 这句总能正常运行. 
  2 # 然而...
  3 
  4 mkdir 'dir with trailing newline
  5 '
  6 
  7 cd 'dir with trailing newline
  8 '
  9 
 10 cd "`pwd`"  # 错误消息:
 11 # bash: cd: /tmp/file with trailing newline: No such file or directory
 12 
 13 cd "$PWD"   # 运行良好.
 14 
 15 
 16 
 17 
 18 
 19 old_tty_setting=$(stty -g)   # 保存旧的终端设置. 
 20 echo "Hit a key "
 21 stty -icanon -echo           # 对终端禁用"canonical"模式. 
 22                              # 这样的话, 也会禁用了*本地*的echo. 
 23 key=$(dd bs=1 count=1 2> /dev/null)   #  使用'dd'命令来取得一个按键. 
 24 stty "$old_tty_setting"      # 恢复旧的设置. 
 25 echo "You hit ${#key} key."  # ${#variable} = number of characters in $variable
 26 #
 27 # 除了回车, 你随便敲任何按键都会输出"You hit 1 key."
 28 # 如果敲回车, 那么输出就是"You hit 0 key."
 29 # 新行已经被命令替换吃掉了. 
 30 
 31 感谢, S.C.</pre>

 |

 |

| ![Caution](./images/caution.gif) | 

如果用**echo**命令输出一个_未引用_变量, 而且这个变量以命令替换的结果作为值, 那么这个变量中的换行符将会被删除. 这可能会引起一些异常状况.

| 

<pre class="PROGRAMLISTING">  1 dir_listing=`ls -l`
  2 echo $dir_listing     # 未引用, 就是没用引号括起来
  3 
  4 # 期望打印出经过排序的目录列表. 
  5 
  6 # 可惜, 我们只能获得这些: 
  7 # total 3 -rw-rw-r-- 1 bozo bozo 30 May 13 17:15 1.txt -rw-rw-r-- 1 bozo
  8 # bozo 51 May 15 20:57 t2.sh -rwxr-xr-x 1 bozo bozo 217 Mar 5 21:13 wi.sh
  9 
 10 # 新行消失了. 
 11 
 12 
 13 echo "$dir_listing"   # 引用起来
 14 # -rw-rw-r--    1 bozo       30 May 13 17:15 1.txt
 15 # -rw-rw-r--    1 bozo       51 May 15 20:57 t2.sh
 16 # -rwxr-xr-x    1 bozo      217 Mar  5 21:13 wi.sh</pre>

 |

 |

命令替换甚至允许将整个文件的内容放到变量中, 可以使用[重定向](io-redirection.md#IOREDIRREF)或者[cat](basic.md#CATREF)命令.

| 

<pre class="PROGRAMLISTING">  1 variable1=`<file1`      #  将"file1"的内容放到"variable1"中. 
  2 variable2=`cat file2`   #  将"file2"的内容放到"variable2"中. 
  3                         #  但是这行将会fork一个新进程, 
  4                         #+ 所以这行代码将会比第一行代码执行得慢. 
  5 
  6 #  注意:
  7 #  变量中可以包含空白, 
  8 #+ 甚至是(厌恶至极的), 控制字符. </pre>

 |

| 

<pre class="PROGRAMLISTING">  1 #  摘录自系统文件, /etc/rc.d/rc.sysinit
  2 #+ (这是红帽系统中的)
  3 
  4 
  5 if [ -f /fsckoptions ]; then
  6         fsckoptions=`cat /fsckoptions`
  7 ...
  8 fi
  9 #
 10 #
 11 if [ -e "/proc/ide/${disk[$device]}/media" ] ; then
 12              hdmedia=`cat /proc/ide/${disk[$device]}/media`
 13 ...
 14 fi
 15 #
 16 #
 17 if [ ! -n "`uname -r | grep -- "-"`" ]; then
 18        ktag="`cat /proc/version`"
 19 ...
 20 fi
 21 #
 22 #
 23 if [ $usb = "1" ]; then
 24     sleep 5
 25     mouseoutput=`cat /proc/bus/usb/devices 2>/dev/null|grep -E "^I.*Cls=03.*Prot=02"`
 26     kbdoutput=`cat /proc/bus/usb/devices 2>/dev/null|grep -E "^I.*Cls=03.*Prot=01"`
 27 ...
 28 fi</pre>

 |

| ![Caution](./images/caution.gif) | 

不要将一个_长_文本文件的全部内容设置到变量中, 除非你有一个非常好的原因非这么做不可, 也不要将_二进制_文件的内容保存到变量中, 即使是开玩笑也不行.

* * *

**例子 14-1\. 愚蠢的脚本策略**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # stupid-script-tricks.sh: 朋友, 别在家试这个脚本. 
  3 # 来自于"Stupid Script Tricks," 卷I.
  4 
  5 
  6 dangerous_variable=`cat /boot/vmlinuz`   # 这是压缩过的Linux内核自身. 
  7 
  8 echo "string-length of \$dangerous_variable = ${#dangerous_variable}"
  9 # 这个字符串变量的长度是$dangerous_variable = 794151
 10 # (不要使用as 'wc -c /boot/vmlinuz'来计算长度.)
 11 
 12 # echo "$dangerous_variable"
 13 # 千万别尝试这么做! 这样将挂起这个脚本. 
 14 
 15 
 16 #  脚本作者已经意识到将二进制文件设置到
 17 #+ 变量中一点作用都没有. 
 18 
 19 exit 0</pre>

 |

* * *

注意, 在这里不会发生_缓冲区溢出_错误. 因为这是一个解释型语言的实例, Bash就是一种解释型语言, 解释型语言会比编译型语言提供更多的对程序错误的保护措施.

 |

变量替换允许将一个[loop](loops1.md#FORLOOPREF1)的输出设置到一个变量中. 这么做的关键就是将循环中[echo](internal.md#ECHOREF)命令的输出全部截取.

* * *

**例子 14-2\. 将一个循环输出的内容设置到变量中**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # csubloop.sh: 将循环输出的内容设置到变量中. 
  3 
  4 variable1=`for i in 1 2 3 4 5
  5 do
  6   echo -n "$i"                 #  对于在这里的命令替换来说
  7 done`                          #+ 这个'echo'命令是非常关键的. 
  8 
  9 echo "variable1 = $variable1"  # variable1 = 12345
 10 
 11 
 12 i=0
 13 variable2=`while [ "$i" -lt 10 ]
 14 do
 15   echo -n "$i"                 # 再来一个, 'echo'是必需的. 
 16   let "i += 1"                 # 递增. 
 17 done`
 18 
 19 echo "variable2 = $variable2"  # variable2 = 0123456789
 20 
 21 #  这就证明了在一个变量的声明中
 22 #+ 嵌入一个循环是可行的. 
 23 
 24 exit 0</pre>

 |

* * *

| 

命令替换使得扩展有效Bash工具集变为可能 这样, 写一段小程序或者一段脚本就可以达到目的. 因为程序或脚本的输出会传到<tt class="FILENAME">stdout</tt>上(就像一个标准UNIX工具所做的那样), 然后重新将这些输出保存到变量中. (译者: 作者的意思就是在这种情况下写脚本和写程序作用是一样的.)

| 

<pre class="PROGRAMLISTING">  1 #include <stdio.h>
  2 
  3 /*  "Hello, world." C program  */		
  4 
  5 int main()
  6 {
  7   printf( "Hello, world." );
  8   return (0);
  9 }</pre>

 |

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">gcc -o hello hello.c</kbd>
	      </pre>

 |

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # hello.sh		
  3 
  4 greeting=`./hello`
  5 echo $greeting</pre>

 |

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">sh hello.sh</kbd>
<samp class="COMPUTEROUTPUT">Hello, world.</samp>
	        </pre>

 |

 |

| ![Note](./images/note.gif) | 

对于命令替换来说, **$(COMMAND)**形式已经取代了后置引用"`".

| 

<pre class="PROGRAMLISTING">  1 output=$(sed -n /"$1"/p $file)   # 来自于例子"grp.sh". 
  2 	      
  3 # 将文本文件的内容保存到一个变量中. 
  4 File_contents1=$(cat $file1)      
  5 File_contents2=$(<$file2)        # Bash也允许这么做. </pre>

 |

**$(...)**形式的命令替换在处理双反斜线(\\)时与**`...`**形式不同.

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo `echo \\`</kbd>
<samp class="COMPUTEROUTPUT"></samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $(echo \\)</kbd>
<samp class="COMPUTEROUTPUT">\</samp>
	      </pre>

 |

**$(...)**形式的命令替换是允许嵌套的. [[3]](#FTN.AEN13182)

| 

<pre class="PROGRAMLISTING">  1 word_count=$( wc -w $(ls -l | awk '{print $9}') )</pre>

 |

或者, 可以更加灵活 . . .

* * *

**例子 14-3\. 找anagram(回文构词法, 可以将一个有意义的单词, 变换为1个或多个有意义的单词, 但是还是原来的子母集合)**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # agram2.sh
  3 # 关于命令替换嵌套的例子. 
  4 
  5 #  使用"anagram"工具. 
  6 #+ 这是作者的"yawl"文字表软件包中的一部分. 
  7 #  http://ibiblio.org/pub/Linux/libs/yawl-0.3.2.tar.gz
  8 #  http://personal.riverusers.com/~thegrendel/yawl-0.3.2.tar.gz
  9 
 10 E_NOARGS=66
 11 E_BADARG=67
 12 MINLEN=7
 13 
 14 if [ -z "$1" ]
 15 then
 16   echo "Usage $0 LETTERSET"
 17   exit $E_NOARGS         # 脚本需要一个命令行参数. 
 18 elif [ ${#1} -lt $MINLEN ]
 19 then
 20   echo "Argument must have at least $MINLEN letters."
 21   exit $E_BADARG
 22 fi
 23 
 24 
 25 
 26 FILTER='.......'         # 必须至少有7个字符. 
 27 #       1234567
 28 Anagrams=( $(echo $(anagram $1 | grep $FILTER) ) )
 29 #           |     |    嵌套的命令替换.       | |
 30 #        (              数组分配                 )
 31 
 32 echo
 33 echo "${#Anagrams[*]}  7+ letter anagrams found"
 34 echo
 35 echo ${Anagrams[0]}      # 第一个anagram. 
 36 echo ${Anagrams[1]}      # 第二个anagram. 
 37                          # 等等. 
 38 
 39 # echo "${Anagrams[*]}"  # 在一行上列出所有的anagram . . .
 40 
 41 #  考虑到后边还有单独的一章, 对"数组"进行详细的讲解, 
 42 #+ 所以在这里就不深入讨论了. 
 43 
 44 # 可以参考脚本agram.sh, 这也是一个找出anagram的例子. 
 45 
 46 exit $?</pre>

 |

* * *

 |

命令替换在脚本中使用的例子:

1.  [例子 10-7](loops1.md#BINGREP)

2.  [例子 10-26](testbranch.md#CASECMD)

3.  [例子 9-29](randomvar.md#SEEDINGRANDOM)

4.  [例子 12-3](moreadv.md#EX57)

5.  [例子 12-19](textproc.md#LOWERCASE)

6.  [例子 12-15](textproc.md#GRP)

7.  [例子 12-49](extmisc.md#EX53)

8.  [例子 10-13](loops1.md#EX24)

9.  [例子 10-10](loops1.md#SYMLINKS)

10.  [例子 12-29](filearchiv.md#STRIPC)

11.  [例子 16-8](redircb.md#REDIR4)

12.  [例子 A-17](contributed-scripts.md#TREE)

13.  [例子 27-2](procref1.md#PIDID)

14.  [例子 12-42](mathc.md#MONTHLYPMT)

15.  [例子 12-43](mathc.md#BASE)

16.  [例子 12-44](mathc.md#ALTBC)

### 注意事项

| [[1]](commandsub.md#AEN13093) | 

对于_命令替换_来说, 这个**命令**既可以是外部的系统命令, 也可以是内部脚本的_内建命令_, 甚至可以是[脚本函数](assortedtips.md#RVT).

 |
| [[2]](commandsub.md#AEN13099) | 

从技术的角度来讲, _命令替换_将会抽取一个命令的输出, 然后使用<span class="TOKEN">=</span>操作将其赋值到一个变量中.

 |
| [[3]](commandsub.md#AEN13182) | 

事实上, 对于后置引用的嵌套是可行的, 但是只能将内部的反引号转义才行, 就像John默认指出的那样.

| 

<pre class="PROGRAMLISTING">  1 word_count=` wc -w \`ls -l | awk '{print $9}'\` `</pre>

 |

 |