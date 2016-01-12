# 17\. Here Document

 _Here and now, boys._ |
 _Aldous Huxley, "Island"_ |

一个_here document_就是一段带有特殊目的的代码段. 它使用[I/O重定向](io-redirection.md#IOREDIRREF)的形式将一个命令序列传递到一个交互程序或者命令中, 比如[ftp](communications.md#FTPREF), [cat](basic.md#CATREF), 或者_ex_文本编辑器.

| 

<pre class="PROGRAMLISTING">  1 COMMAND <<InputComesFromHERE
  2 ...
  3 InputComesFromHERE</pre>

 |

_limit string_用来界定命令序列的范围(译者注: 两个相同的limit string之间就是命令序列). 特殊符号<span class="TOKEN"><<</span>用来标识limit string. 这个符号的作用就是将文件的输出重定向到程序或命令的<tt class="FILENAME">stdin</tt>中. 与<kbd class="USERINPUT">interactive-program < command-file</kbd>很相似, 其中<tt class="FILENAME">command-file</tt>包含:

| 

<pre class="PROGRAMLISTING">  1 command #1
  2 command #2
  3 ...</pre>

 |

而_here document_看上去是下面这个样子:

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 interactive-program <<LimitString
  3 command #1
  4 command #2
  5 ...
  6 LimitString</pre>

 |

选择一个名字非常诡异_limit string_能够有效的避免命令列表与_limit string_重名的问题.

注意, 某些情况下, 把_here document_用在非交互工具或命令中, 也会取得非常好的效果, 比如, [wall](system.md#WALLREF).

* * *

**例子 17-1\. **广播**: 将消息发送给每个登陆的用户**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 wall <<zzz23EndOfMessagezzz23
  4 E-mail your noontime orders for pizza to the system administrator.
  5     (Add an extra dollar for anchovy or mushroom topping.)
  6 # 附加的消息文本放在这里. 
  7 # 注意: 'wall'命令会把注释行也打印出来. 
  8 zzz23EndOfMessagezzz23
  9 
 10 # 当然, 更有效率的做法是: 
 11 #         wall <message-file
 12 #  然而, 将消息模版嵌入到脚本中
 13 #+ 只是一种"小吃店"(译者注: 方便但是不卫生)的做法, 而且这种做法是一次性的. 
 14 
 15 exit 0</pre>

 |

* * *

对于某些看上去不太可能的工具, 比如_vi_, 也能够使用_here document_.

* * *

**例子 17-2\. **虚拟文件**: 创建一个2行的虚拟文件**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 # 用非交互的方式来使用'vi'编辑一个文件. 
  4 # 模仿'sed'.
  5 
  6 E_BADARGS=65
  7 
  8 if [ -z "$1" ]
  9 then
 10   echo "Usage: `basename $0` filename"
 11   exit $E_BADARGS
 12 fi
 13 
 14 TARGETFILE=$1
 15 
 16 # 在文件中插入两行, 然后保存. 
 17 #--------Begin here document-----------#
 18 vi $TARGETFILE <<x23LimitStringx23
 19 i
 20 This is line 1 of the example file.
 21 This is line 2 of the example file.
 22 ^[
 23 ZZ
 24 x23LimitStringx23
 25 #----------End here document-----------#
 26 
 27 #  注意上边^[是一个转义符, 键入Ctrl+v <Esc>就行,
 28 #+ 事实上它是<Esc>键;. 
 29 
 30 #  Bram Moolenaar指出这种方法不能使用在'vim'上, (译者注: Bram Moolenaar是vim作者)
 31 #+ 因为可能会存在终端相互影响的问题. 
 32 
 33 exit 0</pre>

 |

* * *

上边的脚本也可以不用**vi**而改用**ex**来实现, _here document_包含**ex**命令列表的形式足以形成自己的类别了, 称为_ex script_.

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 #  把所有后缀为".txt"文件
  3 #+ 中的"Smith"都替换成"Jones". 
  4 
  5 ORIGINAL=Smith
  6 REPLACEMENT=Jones
  7 
  8 for word in $(fgrep -l $ORIGINAL *.txt)
  9 do
 10   # -------------------------------------
 11   ex $word <<EOF
 12   :%s/$ORIGINAL/$REPLACEMENT/g
 13   :wq
 14 EOF
 15   # :%s是"ex"的替换命令. (译者注: 与vi和vim的基本命令相同)
 16   # :wq是保存并退出的意思. 
 17   # -------------------------------------
 18 done</pre>

 |

与<span class="QUOTE">"ex script"</span>相似的是_cat script_.

* * *

**例子 17-3\. 使用**cat**的多行消息**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 #  'echo'对于打印单行消息来说是非常好用的, 
  4 #+  但是在打印消息块时可能就有点问题了. 
  5 #   'cat' here document可以解决这个限制. 
  6 
  7 cat <<End-of-message
  8 -------------------------------------
  9 This is line 1 of the message.
 10 This is line 2 of the message.
 11 This is line 3 of the message.
 12 This is line 4 of the message.
 13 This is the last line of the message.
 14 -------------------------------------
 15 End-of-message
 16 
 17 #  用下边这行代替上边的第7行, 
 18 #+   cat > $Newfile <<End-of-message
 19 #+       ^^^^^^^^^^
 20 #+ 那么就会把输出写到文件$Newfile中, 而不是stdout. 
 21 
 22 exit 0
 23 
 24 
 25 #--------------------------------------------
 26 # 下边的代码不会运行, 因为上边有"exit 0". 
 27 
 28 # S.C. 指出下边代码也能够达到相同目的. 
 29 echo "-------------------------------------
 30 This is line 1 of the message.
 31 This is line 2 of the message.
 32 This is line 3 of the message.
 33 This is line 4 of the message.
 34 This is the last line of the message.
 35 -------------------------------------"
 36 # 然而, 文本中可能不允许包含双引号, 除非它们被转义. </pre>

 |

* * *

`-`选项用来标记here document的limit string (<kbd class="USERINPUT"><<-LimitString</kbd>), 可以抑制输出时前边的tab(不是空格). 这么做可以增加一个脚本的可读性.

* * *

**例子 17-4\. 带有抑制tab功能的多行消息**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # 与之前的例子相同, 但是... 
  3 
  4 #  - 选项对于here docutment来说, 
  5 #+ <<-可以抑制文档体前边的tab, 
  6 #+ 而*不*是空格. 
  7 
  8 cat <<-ENDOFMESSAGE
  9 	This is line 1 of the message.
 10 	This is line 2 of the message.
 11 	This is line 3 of the message.
 12 	This is line 4 of the message.
 13 	This is the last line of the message.
 14 ENDOFMESSAGE
 15 # 脚本在输出的时候左边将被刷掉. 
 16 # 就是说每行前边的tab将不会显示. 
 17 
 18 # 上边5行"消息"的前边都是tab, 而不是空格. 
 19 # 空格是不受<<-影响的. 
 20 
 21 # 注意, 这个选项对于*嵌在*中间的tab没作用. 
 22 
 23 exit 0</pre>

 |

* * *

_here document_支持参数和命令替换. 所以也可以给here document的消息体传递不同的参数, 这样相应的也会修改输出.

* * *

**例子 17-5\. 使用参数替换的here document**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # 一个使用'cat'命令的here document, 使用了参数替换. 
  3 
  4 # 不传命令行参数给它,   ./scriptname
  5 # 传一个命令行参数给它,   ./scriptname Mortimer
  6 # 传一个包含2个单词(用引号括起来)的命令行参数给它, 
  7 #                           ./scriptname "Mortimer Jones"
  8 
  9 CMDLINEPARAM=1     #  所期望的最少的命令行参数个数. 
 10 
 11 if [ $# -ge $CMDLINEPARAM ]
 12 then
 13   NAME=$1          #  如果命令行参数超过1个, 
 14                    #+ 那么就只取第一个参数. 
 15 else
 16   NAME="John Doe"  #  默认情况下, 如果没有命令行参数的话. 
 17 fi  
 18 
 19 RESPONDENT="the author of this fine script"  
 20   
 21 
 22 cat <<Endofmessage
 23 
 24 Hello, there, $NAME.
 25 Greetings to you, $NAME, from $RESPONDENT.
 26 
 27 # This comment shows up in the output (why?).
 28 
 29 Endofmessage
 30 
 31 # 注意上边的空行也打印输出, 
 32 # 而上边那行"注释"当然也会打印到输出. 
 33 # (译者注: 这就是为什么不翻译那行注释的原因, 尽量保持代码的原样)
 34 exit 0</pre>

 |

* * *

这是一个非常有用的脚本, 其中使用了包含参数替换的here document.

* * *

**例子 17-6\. 上传一个文件对到<span class="QUOTE">"Sunsite"</span>的incoming目录**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # upload.sh
  3 
  4 #  上传这一对文件(Filename.lsm, Filename.tar.gz)
  5 #+ 到Sunsite/UNC (ibiblio.org)的incoming目录. 
  6 #  Filename.tar.gz是自身的tar包. 
  7 #  Filename.lsm是描述文件. 
  8 #  Sunsite需要"lsm"文件, 否则就拒绝上传. 
  9 
 10 
 11 E_ARGERROR=65
 12 
 13 if [ -z "$1" ]
 14 then
 15   echo "Usage: `basename $0` Filename-to-upload"
 16   exit $E_ARGERROR
 17 fi  
 18 
 19 
 20 Filename=`basename $1`           # 从文件名中去掉目录字符串. 
 21 
 22 Server="ibiblio.org"
 23 Directory="/incoming/Linux"
 24 #  在这里也不一定非得将上边的参数写死在这个脚本中, 
 25 #+ 可以使用命令行参数的方法来替换. 
 26 
 27 Password="your.e-mail.address"   # 可以修改成相匹配的密码. 
 28 
 29 ftp -n $Server <<End-Of-Session
 30 # -n选项禁用自动登录. 
 31 
 32 user anonymous "$Password"
 33 binary
 34 bell                             # 在每个文件传输后, 响铃. 
 35 cd $Directory
 36 put "$Filename.lsm"
 37 put "$Filename.tar.gz"
 38 bye
 39 End-Of-Session
 40 
 41 exit 0</pre>

 |

* * *

在here document的开头, 引用或转义<span class="QUOTE">"limit string"</span>, 会使得here document消息体中的参数替换被禁用.

* * *

**例子 17-7\. 关闭参数替换**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 #  一个使用'cat'的here document, 但是禁用了参数替换. 
  3 
  4 NAME="John Doe"
  5 RESPONDENT="the author of this fine script"  
  6 
  7 cat <<'Endofmessage'
  8 
  9 Hello, there, $NAME.
 10 Greetings to you, $NAME, from $RESPONDENT.
 11 
 12 Endofmessage
 13 
 14 #  如果"limit string"被引用或转义的话, 那么就禁用了参数替换. 
 15 #  下边的两种方式具有相同的效果. 
 16 #  cat <<"Endofmessage"
 17 #  cat <<\Endofmessage
 18 
 19 exit 0</pre>

 |

* * *

禁用了参数替换后, 将允许输出文本本身(译者注: 就是未转义的原文). 如果你想产生脚本甚至是程序代码的话, 那么可以使用这种办法.

* * *

**例子 17-8\. 生成另外一个脚本的脚本**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # generate-script.sh
  3 # 这个脚本的诞生基于Albert Reiner的一个主意. 
  4 
  5 OUTFILE=generated.sh         # 所产生文件的名字. 
  6 
  7 
  8 # -----------------------------------------------------------
  9 # 'Here document包含了需要产生的脚本的代码. 
 10 (
 11 cat <<'EOF'
 12 #!/bin/bash
 13 
 14 echo "This is a generated shell script."
 15 #  Note that since we are inside a subshell,
 16 #+ we can't access variables in the "outside" script.
 17 
 18 echo "Generated file will be named: $OUTFILE"
 19 #  Above line will not work as normally expected
 20 #+ because parameter expansion has been disabled.
 21 #  Instead, the result is literal output.
 22 
 23 a=7
 24 b=3
 25 
 26 let "c = $a * $b"
 27 echo "c = $c"
 28 
 29 exit 0
 30 EOF
 31 ) > $OUTFILE
 32 # -----------------------------------------------------------
 33 
 34 #  将'limit string'引用起来将会阻止上边
 35 #+ here document消息体中的变量扩展. 
 36 #  这会使得输出文件中的内容保持here document消息体中的原文. 
 37 
 38 if [ -f "$OUTFILE" ]
 39 then
 40   chmod 755 $OUTFILE
 41   # 让所产生的文件具有可执行权限. 
 42 else
 43   echo "Problem in creating file: \"$OUTFILE\""
 44 fi
 45 
 46 #  这个方法也可以用来产生
 47 #+ C程序代码, Perl程序代码, Python程序代码, makefile, 
 48 #+ 和其他的一些类似的代码. 
 49 #  (译者注: 中间一段没译的注释将会被here document打印出来)
 50 exit 0</pre>

 |

* * *

也可以将here document的输出保存到变量中.

| 

<pre class="PROGRAMLISTING">  1 variable=$(cat <<SETVAR
  2 This variable
  3 runs over multiple lines.
  4 SETVAR)
  5 
  6 echo "$variable"</pre>

 |

A here document can supply input to a function in the same script.

* * *

**例子 17-9\. Here document与函数**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # here-function.sh
  3 
  4 GetPersonalData ()
  5 {
  6   read firstname
  7   read lastname
  8   read address
  9   read city 
 10   read state 
 11   read zipcode
 12 } # 这个函数看起来就是一个交互函数, 但是... 
 13 
 14 
 15 # 给上边的函数提供输入.
 16 GetPersonalData <<RECORD001
 17 Bozo
 18 Bozeman
 19 2726 Nondescript Dr.
 20 Baltimore
 21 MD
 22 21226
 23 RECORD001
 24 
 25 
 26 echo
 27 echo "$firstname $lastname"
 28 echo "$address"
 29 echo "$city, $state $zipcode"
 30 echo
 31 
 32 exit 0</pre>

 |

* * *

也可以这么使用<span class="TOKEN">:</span>(冒号), 做一个假命令来从一个here document中接收输出. 这么做事实上就是创建了一个<span class="QUOTE">"匿名"</span>的here document.

* * *

**例子 17-10\. <span class="QUOTE">"匿名"</span>的here Document**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 : <<TESTVARIABLES
  4 ${HOSTNAME?}${USER?}${MAIL?}  # 如果其中某个变量没被设置, 那么就打印错误信息. 
  5 TESTVARIABLES
  6 
  7 exit 0</pre>

 |

* * *

| ![Tip](./images/tip.gif) | 

上边所示技术的一种变化, 可以用来<span class="QUOTE">"注释"</span>掉代码块.

 |

* * *

**例子 17-11\. 注释掉一段代码块**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # commentblock.sh
  3 
  4 : <<COMMENTBLOCK
  5 echo "This line will not echo."
  6 This is a comment line missing the "#" prefix.
  7 This is another comment line missing the "#" prefix.
  8 
  9 &*@!!++=
 10 The above line will cause no error message,
 11 because the Bash interpreter will ignore it.
 12 COMMENTBLOCK
 13 
 14 echo "Exit value of above \"COMMENTBLOCK\" is $?."   # 0
 15 # 这里将不会显示任何错误. 
 16 
 17 
 18 #  上边的这种技术当然也可以用来注释掉
 19 #+ 一段正在使用的代码, 如果你有某些特定调试要求的话. 
 20 #  这比在每行前边都敲入"#"来得方便的多, 
 21 #+ 而且如果你想恢复的话, 还得将添加上的"#"删除掉. 
 22 
 23 : <<DEBUGXXX
 24 for file in *
 25 do
 26  cat "$file"
 27 done
 28 DEBUGXXX
 29 
 30 exit 0</pre>

 |

* * *

| ![Tip](./images/tip.gif) | 

关于这种小技巧的另一个应用就是能够产生<span class="QUOTE">"自文档化(self-documenting)"</span>的脚本.

 |

* * *

**例子 17-12\. 一个自文档化(self-documenting)的脚本**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # self-document.sh: 自文档化(self-documenting)的脚本
  3 # 修改于"colm.sh".
  4 
  5 DOC_REQUEST=70
  6 
  7 if [ "$1" = "-h"  -o "$1" = "--help" ]     # 请求帮助. 
  8 then
  9   echo; echo "Usage: $0 [directory-name]"; echo
 10   sed --silent -e '/DOCUMENTATIONXX$/,/^DOCUMENTATIONXX$/p' "$0" |
 11   sed -e '/DOCUMENTATIONXX$/d'; exit $DOC_REQUEST; fi
 12 
 13 
 14 : <<DOCUMENTATIONXX
 15 List the statistics of a specified directory in tabular format.
 16 ---------------------------------------------------------------
 17 The command line parameter gives the directory to be listed.
 18 If no directory specified or directory specified cannot be read,
 19 then list the current working directory.
 20 
 21 DOCUMENTATIONXX
 22 
 23 if [ -z "$1" -o ! -r "$1" ]
 24 then
 25   directory=.
 26 else
 27   directory="$1"
 28 fi  
 29 
 30 echo "Listing of "$directory":"; echo
 31 (printf "PERMISSIONS LINKS OWNER GROUP SIZE MONTH DAY HH:MM PROG-NAME\n" \
 32 ; ls -l "$directory" | sed 1d) | column -t
 33 
 34 exit 0</pre>

 |

* * *

使用[cat脚本](here-docs.md#CATSCRIPTREF)也能够完成相同的目的.

| 

<pre class="PROGRAMLISTING">  1 DOC_REQUEST=70
  2 
  3 if [ "$1" = "-h"  -o "$1" = "--help" ]     # 请求帮助. 
  4 then                                       # 使用"cat脚本" . . . 
  5   cat <<DOCUMENTATIONXX
  6 List the statistics of a specified directory in tabular format.
  7 ---------------------------------------------------------------
  8 The command line parameter gives the directory to be listed.
  9 If no directory specified or directory specified cannot be read,
 10 then list the current working directory.
 11 
 12 DOCUMENTATIONXX
 13 exit $DOC_REQUEST
 14 fi</pre>

 |

请参考[例子 A-28](contributed-scripts.md#ISSPAMMER2)可以看到更多关于<span class="QUOTE">"自文档化"</span>脚本的好例子.

| ![Note](./images/note.gif) | 

Here document创建临时文件, 但是这些文件将在打开后被删除, 并且不能够被任何其他进程所访问.

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">bash -c 'lsof -a -p $ -d0' << EOF</kbd>
<samp class="PROMPT">></samp> <kbd class="USERINPUT">EOF</kbd>
<samp class="COMPUTEROUTPUT">lsof    1213 bozo    0r   REG    3,5    0 30386 /tmp/t1213-0-sh (deleted)</samp>
	      </pre>

 |

 |

| ![Caution](./images/caution.gif) | 

某些工具是不能放入_here document_中运行的.

 |

| ![Warning](./images/warning.gif) | 

结尾的_limit string_, 就是here document最后一行的limit string, 必须从_第一个_字符开始. 它的前面不能够有任何_前置的空白_. 而在这个limit string后边的空白也会引起异常. 空白将会阻止limit string的识别. (译者注: 下边这个脚本由于结束limit string的问题, 造成脚本无法结束, 所有内容全部被打印出来, 所以注释就不译了, 保持这个例子脚本的原样.)

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 echo "----------------------------------------------------------------------"
  4 
  5 cat <<LimitString
  6 echo "This is line 1 of the message inside the here document."
  7 echo "This is line 2 of the message inside the here document."
  8 echo "This is the final line of the message inside the here document."
  9      LimitString
 10 #^^^^Indented limit string. Error! This script will not behave as expected.
 11 
 12 echo "----------------------------------------------------------------------"
 13 
 14 #  These comments are outside the 'here document',
 15 #+ and should not echo.
 16 
 17 echo "Outside the here document."
 18 
 19 exit 0
 20 
 21 echo "This line had better not echo."  # Follows an 'exit' command.</pre>

 |

 |

对于那些使用<span class="QUOTE">"here document"</span>, 并且非常复杂的任务, 最好考虑使用**expect**脚本语言, 这种语言就是为了达到向交互程序添加输入的目的而量身定做的.