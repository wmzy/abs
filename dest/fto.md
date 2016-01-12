# 7.2\. 文件测试操作符

**如果下面的条件成立将会返回真.**

*   <span class="TOKEN">-e</span>
*   文件存在

*   <span class="TOKEN">-a</span>
*   文件存在

    这个选项的效果与<span class="TOKEN">-e</span>相同. 但是它已经被<span class="QUOTE">"弃用"</span>了, 并且不鼓励使用.

*   <span class="TOKEN">-f</span>
*   表示这个文件是一个<tt class="REPLACEABLE">_一般_</tt>文件(并不是目录或者设备文件)

*   <span class="TOKEN">-s</span>
*   文件大小不为零

*   <span class="TOKEN">-d</span>
*   表示这是一个目录

*   <span class="TOKEN">-b</span>
*   表示这是一个块设备(软盘, 光驱, 等等.)

*   <span class="TOKEN">-c</span>
*   表示这是一个字符设备(键盘, modem, 声卡, 等等.)

*   <span class="TOKEN">-p</span>
*   这个文件是一个[管道](special-chars.md#PIPEREF)

*   <span class="TOKEN">-h</span>
*   这是一个[符号链接](basic.md#SYMLINKREF)

*   <span class="TOKEN">-L</span>
*   这是一个符号链接

*   <span class="TOKEN">-S</span>
*   表示这是一个[socket](devref1.md#SOCKETREF)

*   <span class="TOKEN">-t</span>
*   文件([描述符](io-redirection.md#FDREF))被关联到一个终端设备上

    这个测试选项一般被用来检测脚本中的<tt class="FILENAME">stdin</tt>(<kbd class="USERINPUT">[ -t 0 ]</kbd>) 或者<tt class="FILENAME">stdout</tt>(<kbd class="USERINPUT">[ -t 1 ]</kbd>)是否来自于一个终端.

*   <span class="TOKEN">-r</span>
*   文件是否具有可读权限(_指的是正在运行这个测试命令的用户是否具有读权限_)

*   <span class="TOKEN">-w</span>
*   文件是否具有可写权限(指的是正在运行这个测试命令的用户是否具有写权限)

*   <span class="TOKEN">-x</span>
*   文件是否具有可执行权限(指的是正在运行这个测试命令的用户是否具有可执行权限)

*   <span class="TOKEN">-g</span>
*   set-group-id(sgid)标记被设置到文件或目录上

    如果目录具有<tt class="REPLACEABLE">_sgid_</tt>标记的话, 那么在这个目录下所创建的文件将属于拥有这个目录的用户组, 而不必是创建这个文件的用户组. 这个特性对于在一个工作组中共享目录非常有用.

*   <span class="TOKEN">-u</span>
*   set-user-id (suid)标记被设置到文件上

    如果一个_root_用户所拥有的二进制可执行文件设置了<tt class="REPLACEABLE">_set-user-id_</tt>标记位的话, 那么普通用户也会以_root_权限来运行这个文件. [[1]](#FTN.AEN2740) 这对于需要访问系统硬件的执行程序(比如**pppd**和**cdrecord**)非常有用. 如果没有_suid_标志的话, 这些二进制执行程序是不能够被非root用户调用的.

    | 

    <pre class="SCREEN">	      <samp class="COMPUTEROUTPUT">-rwsr-xr-t    1 root       178236 Oct  2  2000 /usr/sbin/pppd</samp>
    	      </pre>

     |

    对于设置了<tt class="REPLACEABLE">_suid_</tt>标志的文件, 在它的权限列中将会以_s_表示.
*   <span class="TOKEN">-k</span>
*   设置<tt class="REPLACEABLE">_粘贴位_</tt>

    对于<span class="QUOTE">"粘贴位"</span>的一般了解, _save-text-mode_标志是一个文件权限的特殊类型. 如果文件设置了这个标志, 那么这个文件将会被保存到缓存中, 这样可以提高访问速度. [[2]](#FTN.AEN2760) 粘贴位如果设置在目录中, 那么它将限制写权限. 对于设置了粘贴位的文件或目录, 在它们的权限标记列中将会显示_t_.

    | 

    <pre class="SCREEN">	      <samp class="COMPUTEROUTPUT">drwxrwxrwt    7 root         1024 May 19 21:26 tmp/</samp>
    	      </pre>

     |

    如果用户并不拥有这个设置了粘贴位的目录, 但是他在这个目录下具有写权限, 那么这个用户只能在这个目录下删除自己所拥有的文件. 这将有效的防止用户在一个公共目录中不慎覆盖或者删除别人的文件. 比如说<tt class="FILENAME">/tmp</tt>目录. (当然, 目录的所有者或者_root_用户可以随意删除或重命名其中的文件.)
*   <span class="TOKEN">-O</span>
*   判断你是否是文件的拥有者

*   <span class="TOKEN">-G</span>
*   文件的group-id是否与你的相同

*   <span class="TOKEN">-N</span>
*   从文件上一次被读取到现在为止, 文件是否被修改过

*   <span class="TOKEN">f1 -nt f2</span>
*   文件<tt class="REPLACEABLE">_f1_</tt>比文件<tt class="REPLACEABLE">_f2_</tt>新

*   <span class="TOKEN">f1 -ot f2</span>
*   文件<tt class="REPLACEABLE">_f1_</tt>比文件<tt class="REPLACEABLE">_f2_</tt>旧

*   <span class="TOKEN">f1 -ef f2</span>
*   文件<tt class="REPLACEABLE">_f1_</tt>和文件<tt class="REPLACEABLE">_f2_</tt>是相同文件的硬链接

*   <span class="TOKEN">!</span>
*   <span class="QUOTE">"非"</span> -- 反转上边所有测试的结果(如果没给出条件, 那么返回真).

* * *

**例子 7-4\. 测试那些断掉的链接文件**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # broken-link.sh
  3 # 由Lee bigelow所编写 <ligelowbee@yahoo.com>
  4 # 已经争得作者的授权引用在本书中.
  5 
  6 #一个纯粹的shell脚本用来找出那些断掉的符号链接文件并且输出它们所指向的文件.
  7 #以便于它们可以把输出提供给xargs来进行处理 :)
  8 #比如. broken-link.sh /somedir /someotherdir|xargs rm
  9 #
 10 #下边的方法, 不管怎么说, 都是一种更好的办法:
 11 #
 12 #find "somedir" -type l -print0|\
 13 #xargs -r0 file|\
 14 #grep "broken symbolic"|
 15 #sed -e 's/^\|: *broken symbolic.*$/"/g'
 16 #
 17 #但这不是一个纯粹的bash脚本, 最起码现在不是.
 18 #注意: 谨防在/proc文件系统和任何死循环链接中使用!
 19 ##############################################################
 20 
 21 
 22 #如果没有参数被传递到脚本中, 那么就使用
 23 #当前目录. 否则就是用传递进来的参数作为目录
 24 #来搜索.
 25 ####################
 26 [ $# -eq 0 ] && directorys=`pwd` || directorys=$@
 27 
 28 #编写函数linkchk用来检查传递进来的目录或文件是否是链接, 
 29 #并判断这些文件或目录是否存在. 然后打印它们所指向的文件.
 30 #如果传递进来的元素包含子目录, 
 31 #那么把子目录也放到linkcheck函数中处理, 这样就达到了递归的目的.
 32 ##########
 33 linkchk () {
 34     for element in $1/*; do
 35     [ -h "$element" -a ! -e "$element" ] && echo \"$element\"
 36     [ -d "$element" ] && linkchk $element
 37     # 当然, '-h'用来测试符号链接, '-d'用来测试目录.
 38     done
 39 }
 40 
 41 #把每个传递到脚本的参数都送到linkchk函数中进行处理, 
 42 #检查是否有可用目录. 如果没有, 那么就打印错误消息和
 43 #使用信息.
 44 ################
 45 for directory in $directorys; do
 46     if [ -d $directory ]
 47 	then linkchk $directory
 48 	else 
 49 	    echo "$directory is not a directory"
 50 	    echo "Usage: $0 dir1 dir2 ..."
 51     fi
 52 done
 53 
 54 exit 0</pre>

 |

* * *

[例子 28-1](zeros.md#COOKIES), [例子 10-7](loops1.md#BINGREP), [例子 10-3](loops1.md#FILEINFO), [例子 28-3](zeros.md#RAMDISK), 和[例子 A-1](contributed-scripts.md#MAILFORMAT)也会演示文件测试操作的使用过程.

### 注意事项

| [[1]](fto.md#AEN2740) | 

在将_suid_标记设置到二进制可执行文件的时候, 一定要小心. 因为这可能会引发安全漏洞. 但是_suid_标记不会影响shell脚本.

 |
| [[2]](fto.md#AEN2760) | 

在当代UNIX系统中, 文件中已经不使用粘贴位了, 粘贴位只使用在目录中.

 |