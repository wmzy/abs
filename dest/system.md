# 13\. 系统与管理命令

在<tt class="FILENAME">/etc/rc.d</tt>目录中的启动和关机脚本中包含了好多有用的(和没用的)系统管理命令. 这些命令通常总是被root用户使用, 用于系统维护或者是紧急系统文件修复. 一定要小心使用这些工具, 因为如果滥用的话, 它们会损坏你的系统.

**User和Group类**

*   **users**
*   显示所有的登录用户. 这个命令与**who -q**基本一致.

*   **groups**
*   列出当前用户和他所属的组. 这相当于[$GROUPS](internalvariables.md#GROUPSREF)内部变量, 但是这个命令将会给出组名字, 而不是数字.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">groups</kbd>
    <samp class="COMPUTEROUTPUT">bozita cdrom cdwriter audio xgrp</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $GROUPS</kbd>
    <samp class="COMPUTEROUTPUT">501</samp></pre>

     |

*   **chown**, **chgrp**
*   **chown**命令将会修改一个或多个文件的所有权. 对于<tt class="REPLACEABLE">_root_</tt>用户来说, 如果他想将文件的所有权从一个用户换到另一个用户的话, 那么使用这个命令是非常好的选择. 一个普通用户不能修改文件的所有权, 即使他是文件的宿主也不行. [[1]](#FTN.AEN10989)

    | 

    <pre class="SCREEN"><samp class="PROMPT">root#</samp> <kbd class="USERINPUT">chown bozo *.txt</kbd>
    <samp class="COMPUTEROUTPUT"></samp>
    	      </pre>

     |

    **chgrp**将会修改一个或多个文件的<tt class="REPLACEABLE">_group_</tt>所有权. 但前提是你必须是这些文件的宿主, 并且必须是目的组的成员(或者是<tt class="REPLACEABLE">_root_</tt>), 这样你才能够使用这个命令.

    | 

    <pre class="PROGRAMLISTING">  1 chgrp --recursive dunderheads *.data
      2 #  "dunderheads"(译者: 晕,蠢才...) 组现在拥有了所有的"*.data"文件. 
      3 #+ 包括所有$PWD目录下的子目录中的文件(--recursive的作用就是包含子目录). </pre>

     |

*   **useradd**, **userdel**
*   **useradd**管理命令将会在系统上添加一个用户帐号, 并且如果指定的话, 还会为特定的用户创建home目录. 相应的, **userdel**命令将会从系统上删除一个用户帐号, [[2]](#FTN.AEN11020) 并且会删除相应的文件.

    | ![Note](./images/note.gif) | 

    **adduser**与**useradd**是完全相同的, **adduser**通常仅仅是个符号链接.

     |

*   **usermod**
*   修改用户帐号. 可以修改给定用户帐号的密码, 组身份, 截止日期, 或者其他一些属性. 使用这个命令, 用户的密码可能会被锁定, 因为密码会影响到帐号的有效性.

*   **groupmod**
*   修改指定组. 组名字或者ID号都可以用这个命令来修改.

*   **id**
*   **id**命令将会列出当前进程真实有效的用户ID, 还有用户的组ID. 这与Bash内部变量[$UID](internalvariables.md#UIDREF), [$EUID](internalvariables.md#EUIDREF), 和[$GROUPS](internalvariables.md#GROUPSREF)很相像.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">id</kbd>
    <samp class="COMPUTEROUTPUT">uid=501(bozo) gid=501(bozo) groups=501(bozo),22(cdrom),80(cdwriter),81(audio)</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $UID</kbd>
    <samp class="COMPUTEROUTPUT">501</samp></pre>

     |

    | ![Note](./images/note.gif) | 

    **id**命令只有在_有效_ID与_实际_ID不符时, 才会显示_有效_ID.

     |

    请参考[例子 9-5](internalvariables.md#AMIROOT).

*   **who**
*   显示系统上所有已经登录的用户.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">who</kbd>
    <samp class="COMPUTEROUTPUT">bozo  tty1     Apr 27 17:45
     bozo  pts/0    Apr 27 17:46
     bozo  pts/1    Apr 27 17:47
     bozo  pts/2    Apr 27 17:49</samp>
    	      </pre>

     |

    `-m`选项将会给出当前用户的详细信息. 将任意两个参数传递到**who**中, 都等价于**who -m**, 就像**who am i**或**who The Man**.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">who -m</kbd>
    <samp class="COMPUTEROUTPUT">localhost.localdomain!bozo  pts/2    Apr 27 17:49</samp>
    	      </pre>

     |

    **whoami**与**who -m**很相似, 但是只列出用户名.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">whoami</kbd>
    <samp class="COMPUTEROUTPUT">bozo</samp>
    	      </pre>

     |

*   **w**
*   显示所有的登录用户和属于它们的进程. 这是一个**who**命令的扩展版本. **w**的输出可以通过管道传递到**grep**命令中, 这样就可以查找指定的用户或进程.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">w | grep startx</kbd>
    <samp class="COMPUTEROUTPUT">bozo  tty1     -                 4:22pm  6:41   4.47s  0.45s  startx</samp></pre>

     |

*   **logname**
*   显示当前用户的登录名(可以在<tt class="FILENAME">/var/run/utmp</tt>中找到). 这与上边的[whoami](system.md#WHOAMIREF)很相近.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">logname</kbd>
    <samp class="COMPUTEROUTPUT">bozo</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">whoami</kbd>
    <samp class="COMPUTEROUTPUT">bozo</samp></pre>

     |

    然而...

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">su</kbd>
    <samp class="COMPUTEROUTPUT">Password: ......</samp>

    <samp class="PROMPT">bash#</samp> <kbd class="USERINPUT">whoami</kbd>
    <samp class="COMPUTEROUTPUT">root</samp>
    <samp class="PROMPT">bash#</samp> <kbd class="USERINPUT">logname</kbd>
    <samp class="COMPUTEROUTPUT">bozo</samp></pre>

     |

    | ![Note](./images/note.gif) | 

    **logname**只会打印出登录的用户名, 而**whoami**将会给出附着到当前进程的用户名. 就像我们上边看到的那样, 这两个名字有时会不同.

     |

*   **su**
*   使用替换的用户(_s_ubstitute _u_ser)身份来运行一个程序或脚本. **su rjones**将会以用户_rjones_的身份来启动shell. 使用**su**命令时, 如果不使用任何参数的话, 那默认就是_root_用户. 请参考[例子 A-15](contributed-scripts.md#FIFO).

*   **sudo**
*   以root(或其他用户)的身份来运行一个命令. 这个命令可以用在脚本中, 这样就允许以正规的用户身份来运行脚本.

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 # 某些命令. 
      4 sudo cp /root/secretfile /home/bozo/secret
      5 # 其余的命令. </pre>

     |

    文件<tt class="FILENAME">/etc/sudoers</tt>中保存有允许调用**sudo**命令的用户名.

*   **passwd**
*   设置, 修改, 或者管理用户的密码.

    **passwd**命令可以用在脚本中, 但是_估计你不想这么用_, 呵呵.

    * * *

    **例子 13-1\. 设置一个新密码**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 #  setnew-password.sh: 这个脚本仅仅用于说明passwd命令. 
      3 #                      如果你真想运行这个脚本, 很遗憾, 这可不是个好主意. 
      4 #  这个脚本必须以root身份来运行. 
      5 
      6 ROOT_UID=0         # Root的$UID为0.
      7 E_WRONG_USER=65    # 不是root用户?
      8 
      9 E_NOSUCHUSER=70
     10 SUCCESS=0
     11 
     12 
     13 if [ "$UID" -ne "$ROOT_UID" ]
     14 then
     15   echo; echo "Only root can run this script."; echo
     16   exit $E_WRONG_USER
     17 else
     18   echo
     19   echo "You should know better than to run this script, root."
     20   echo "Even root users get the blues... "
     21   echo
     22 fi  
     23 
     24 
     25 username=bozo
     26 NEWPASSWORD=security_violation
     27 
     28 # 检查bozo是否在这里. 
     29 grep -q "$username" /etc/passwd
     30 if [ $? -ne $SUCCESS ]
     31 then
     32   echo "User $username does not exist."
     33   echo "No password changed."
     34   exit $E_NOSUCHUSER
     35 fi  
     36 
     37 echo "$NEWPASSWORD" | passwd --stdin "$username"
     38 #  'passwd'命令的'--stdin'选项允许
     39 #+ 从stdin(或者管道)中获得一个新的密码. 
     40 
     41 echo; echo "User $username's password changed!"
     42 
     43 # 在脚本中使用'passwd'命令是非常危险的. 
     44 
     45 exit 0</pre>

     |

    * * *

    **passwd**命令的`-l`, `-u`, 和`-d`选项允许锁定, 解锁, 和删除一个用户的密码. 只有root用户可以使用这些选项.

*   **ac**
*   显示用户登录的连接时间, 就像从<tt class="FILENAME">/var/log/wtmp</tt>中读取一样. 这是一个GNU统计工具.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ac</kbd>
     <samp class="COMPUTEROUTPUT">total       68.08</samp></pre>

     |

*   **last**
*   用户_最后_登录的信息, 就像从<tt class="FILENAME">/var/log/wtmp</tt>中读出来一样. 这个命令也可以用来显示远端登录.

    比如, 显示最后几次系统的重启信息:

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">last reboot</kbd>
    <samp class="COMPUTEROUTPUT">reboot   system boot  2.6.9-1.667      Fri Feb  4 18:18          (00:02)    
     reboot   system boot  2.6.9-1.667      Fri Feb  4 15:20          (01:27)    
     reboot   system boot  2.6.9-1.667      Fri Feb  4 12:56          (00:49)    
     reboot   system boot  2.6.9-1.667      Thu Feb  3 21:08          (02:17)    
     . . .

     wtmp begins Tue Feb  1 12:50:09 2005</samp></pre>

     |

*   **newgrp**
*   不用登出就可以修改用户的组ID. 并且允许访问新组的文件. 因为用户可能同时属于多个组, 这个命令很少被使用.

**终端类命令**

*   **tty**
*   显示当前用户终端的名字. 注意每一个单独的_xterm_窗口都被算作一个不同的终端.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">tty</kbd>
    <samp class="COMPUTEROUTPUT">/dev/pts/1</samp></pre>

     |

*   **stty**
*   显示并(或)修改终端设置. 这个复杂命令可以用在脚本中, 并可以用来控制终端的行为和其显示输出的方法. 参见这个命令的info页, 并仔细学习它.

    * * *

    **例子 13-2\. 设置一个擦除字符**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # erase.sh: 在读取输入时使用"stty"来设置一个擦除字符. 
      3 
      4 echo -n "What is your name? "
      5 read name                      #  试试用退格键
      6                                #+ 来删除输入的字符. 
      7                                #  有什么问题? 
      8 echo "Your name is $name."
      9 
     10 stty erase '#'                 #  将"hashmark"(#)设置为退格字符. 
     11 echo -n "What is your name? "
     12 read name                      #  使用#来删除最后键入的字符. 
     13 echo "Your name is $name."
     14 
     15 # 警告: 即使在脚本退出后, 新的键值还是保持着这个设置. (译者: 可以使用stty erase '^?'进行恢复)
     16 
     17 exit 0</pre>

     |

    * * *

    * * *

    **例子 13-3\. **保密密码**: 关闭终端对于密码的echo**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # secret-pw.sh: 保护密码不被显示
      3 
      4 echo
      5 echo -n "Enter password "
      6 read passwd
      7 echo "password is $passwd"
      8 echo -n "If someone had been looking over your shoulder, "
      9 echo "your password would have been compromised."
     10 
     11 echo && echo  # 在一个"与列表"中产生两个换行. 
     12 
     13 
     14 stty -echo    # 关闭屏幕的echo. 
     15 
     16 echo -n "Enter password again "
     17 read passwd
     18 echo
     19 echo "password is $passwd"
     20 echo
     21 
     22 stty echo     # 恢复屏幕的echo. 
     23 
     24 exit 0
     25 
     26 # 详细的阅读stty命令的info页, 以便于更好的掌握这个有用并且狡猾的工具. </pre>

     |

    * * *

    一个创造性的**stty**命令的用法, 检测用户所按的键(不用敲**回车**).

    * * *

    **例子 13-4\. 按键检测**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # keypress.sh: 检测用户按键("hot keys").
      3 
      4 echo
      5 
      6 old_tty_settings=$(stty -g)   # 保存老的设置(为什么?). 
      7 stty -icanon
      8 Keypress=$(head -c1)          # 或者使用$(dd bs=1 count=1 2> /dev/null)
      9                               # 在非GNU系统上
     10 
     11 echo
     12 echo "Key pressed was \""$Keypress"\"."
     13 echo
     14 
     15 stty "$old_tty_settings"      # 恢复老的设置. 
     16 
     17 # 感谢, Stephane Chazelas.
     18 
     19 exit 0</pre>

     |

    * * *

    请参考[例子 9-3](internalvariables.md#TIMEOUT).

    | 

    **终端与模式terminals and modes**

    一般情况下, 一个终端都是工作在_canonical_(标准)模式下. 当用户按键后, 事实上所产生的字符并没有马上传递到运行在当前终端上的程序. 终端上的一个本地缓存保存了这些按键. 当用按下**回车**键的时候, 才会将所有保存的按键信息传递到运行的程序中. 这就意味着在终端内部存在一个基本的行编辑器.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">stty -a</kbd>
    <samp class="COMPUTEROUTPUT">speed 9600 baud; rows 36; columns 96; line = 0;
     intr = ^C; quit = ^\; erase = ^H; kill = ^U; eof = ^D; eol = <undef>; eol2 = <undef>;
     start = ^Q; stop = ^S; susp = ^Z; rprnt = ^R; werase = ^W; lnext = ^V; flush = ^O;
     ...
     isig icanon iexten echo echoe echok -echonl -noflsh -xcase -tostop -echoprt</samp>
                    </pre>

     |

    在使用canonical模式的时候, 可以对本地终端行编辑器所定义的特殊按键进行重新定义.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cat > filexxx</kbd>
    <kbd class="USERINPUT">wha<ctl-W>I<ctl-H>foo bar<ctl-U>hello world<ENTER></kbd>
    <kbd class="USERINPUT"><ctl-D></kbd>
    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cat filexxx</kbd>
    <samp class="COMPUTEROUTPUT">hello world</samp>		
    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">wc -c < filexxx</kbd>
    <samp class="COMPUTEROUTPUT">12</samp>		
                    </pre>

     |

    控制终端的进程只保存了12个字符(11个字母加上一个换行), 虽然用户敲了26个按键.

    在non-canonical((<span class="QUOTE">"raw"</span>)模式下, 每次按键(包括特殊定义的按键, 比如**ctl-H**)都将会立即发送一个字符到控制进程中.

    Bash提示符禁用了`icanon`和`echo`, 因为它用自己的行编辑器代替了终端的基本行编辑器, 因为Bash的行编辑器更好. 比如, 当你在Bash提示符下敲**ctl-A**的时候, 终端将不会显示**^A**, 但是Bash将会获得**\1**字符, 然后解释这个字符, 这样光标就移动到行首了.

    _Stephane Chazelas_

     |

*   **setterm**
*   设置特定的终端属性. 这个命令将向它所在终端的<tt class="FILENAME">stdout</tt>发送一个字符串, 这个字符串将修改终端的行为.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">setterm -cursor off</kbd>
    <samp class="COMPUTEROUTPUT">bash$</samp>
    	      </pre>

     |

    **setterm**命令可以放在脚本中用来修改写入到<tt class="FILENAME">stdout</tt>上的文本的外观. 当然, 如果你只想完成这个目的的话, 还有[更合适的工具](colorizing.md#COLORIZINGREF)可以用.

    | 

    <pre class="PROGRAMLISTING">  1 setterm -bold on
      2 echo bold hello
      3 
      4 setterm -bold off
      5 echo normal hello</pre>

     |

*   **tset**
*   显示或初始化终端设置. 可以把它看成一个功能比较弱的**stty**命令.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">tset -r</kbd>
    <samp class="COMPUTEROUTPUT">Terminal type is xterm-xfree86.
     Kill is control-U (^U).
     Interrupt is control-C (^C).</samp>
    	      </pre>

     |

*   **setserial**
*   设置或者显示串口参数. 这个脚本只能被root用户来运行, 并且通常都在系统安装脚本中使用.

    | 

    <pre class="PROGRAMLISTING">  1 # 来自于/etc/pcmcia/serial脚本: 
      2 
      3 IRQ=`setserial /dev/$DEVICE | sed -e 's/.*IRQ: //'`
      4 setserial /dev/$DEVICE irq 0 ; setserial /dev/$DEVICE irq $IRQ</pre>

     |

*   **getty**, **agetty**
*   一个终端的初始化过程通常都是使用**getty**或**agetty**来建立, 这样才能让用户登录. 这些命令并不用在用户的shell脚本中. 它们的行为与**stty**很相似.

*   **mesg**
*   启用或禁用当前用户终端的访问权限. 禁用访问权限将会阻止网络上的另一用户向这个终端[写](communications.md#WRITEREF)消息.

    | ![Tip](./images/tip.gif) | 

    当你正在编写文本文件的时候, 在文本中间突然来了一个莫名其妙的消息, 你会觉得非常烦人. 在多用户的网络环境下, 如果你不想被打断, 那么你必须关闭其他用户对你终端的写权限.

     |

*   **wall**
*   这是一个缩写单词<span class="QUOTE">"[write](communications.md#WRITEREF) all"</span>, 也就是, 向登录到网络上的所有终端的所有用户都发送一个消息. 最早这是一个管理员的工具, 很有用, 比如, 当系统有问题的时候, 管理可以警告系统上的所有人暂时离开(请参考[例子 17-1](here-docs.md#EX70)).

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">wall System going down for maintenance in 5 minutes!</kbd>
    <samp class="COMPUTEROUTPUT">Broadcast message from bozo (pts/1) Sun Jul  8 13:53:27 2001...

     System going down for maintenance in 5 minutes!</samp>
    	      </pre>

     |

    | ![Note](./images/note.gif) | 

    如果某个特定终端使用**mesg**来禁止了写权限, 那么**wall**将不会给它发消息.

     |

**信息与统计类**

*   **uname**
*   显示系统信息(OS, 内核版本, 等等.) ,输出到<tt class="FILENAME">stdout</tt>上. 使用`-a`选项, 将会给出详细的系统信息(请参考[例子 12-5](moreadv.md#EX41)). 使用`-s`选项只会输出OS类型.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">uname -a</kbd>
    <samp class="COMPUTEROUTPUT">Linux localhost.localdomain 2.2.15-2.5.0 #1 Sat Feb 5 00:13:43 EST 2000 i686 unknown</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">uname -s</kbd>
    <samp class="COMPUTEROUTPUT">Linux</samp></pre>

     |

*   **arch**
*   显示系统的硬件体系结构. 等价于**uname -m**. 请参考[例子 10-26](testbranch.md#CASECMD).

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">arch</kbd>
    <samp class="COMPUTEROUTPUT">i686</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">uname -m</kbd>
    <samp class="COMPUTEROUTPUT">i686</samp></pre>

     |

*   **lastcomm**
*   给出前一个命令的信息, 存储在<tt class="FILENAME">/var/account/pacct</tt>文件中. 命令名字和用户名字都可以通过选项来指定. 这是GNU的一个统计工具.

*   **lastlog**
*   列出系统上所有用户最后登录的时间. 然后保存到<tt class="FILENAME">/var/log/lastlog</tt>文件中.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">lastlog</kbd>
    <samp class="COMPUTEROUTPUT">root          tty1                      Fri Dec  7 18:43:21 -0700 2001
     bin                                     **Never logged in**
     daemon                                  **Never logged in**
     ...
     bozo          tty1                      Sat Dec  8 21:14:29 -0700 2001</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">lastlog | grep root</kbd>
    <samp class="COMPUTEROUTPUT">root          tty1                      Fri Dec  7 18:43:21 -0700 2001</samp>
    	      </pre>

     |

    | ![Caution](./images/caution.gif) | 

    如果用户对于文件<tt class="FILENAME">/var/log/lastlog</tt>没有读权限的话, 那么调用这个命令就会失败.

     |

*   **lsof**
*   列出打开的文件. 这个命令将会把所有当前打开的文件都列出到一份详细的表格中, 包括文件的宿主信息, 尺寸, 还有与它们相关的信息等等. 当然, **lsof**也可以通过管道输出到[grep](textproc.md#GREPREF)和(或)[awk](awk.md#AWKREF)中, 来分析它的内容.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">lsof</kbd>
    <samp class="COMPUTEROUTPUT">COMMAND    PID    USER   FD   TYPE     DEVICE    SIZE     NODE NAME
     init         1    root  mem    REG        3,5   30748    30303 /sbin/init
     init         1    root  mem    REG        3,5   73120     8069 /lib/ld-2.1.3.so
     init         1    root  mem    REG        3,5  931668     8075 /lib/libc-2.1.3.so
     cardmgr    213    root  mem    REG        3,5   36956    30357 /sbin/cardmgr
     ...</samp>
    	      </pre>

     |

*   **strace**
*   系统跟踪(**S**ystem **trace**): 是跟踪_系统调用_和信号的诊断和调试工具. 如果你想了解特定的程序或者工具包为什么运行失败的话, 那么这个命令和下边的**ltrace**命令就显得非常有用了, . . . 当然, 这种失败现象可能是由缺少相关的库, 或者其他问题所引起.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">strace df</kbd>
    <samp class="COMPUTEROUTPUT">execve("/bin/df", ["df"], [/* 45 vars */]) = 0
     uname({sys="Linux", node="bozo.localdomain", ...}) = 0
     brk(0)                                  = 0x804f5e4

     ...</samp>
    	    </pre>

     |

    这是Solaris **truss**命令的Linux的等价工具.

*   **ltrace**
*   库跟踪工具(**L**ibrary **trace**): 跟踪给定命令的_调用库_的相关信息.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ltrace df</kbd>
    <samp class="COMPUTEROUTPUT">__libc_start_main(0x804a910, 1, 0xbfb589a4, 0x804fb70, 0x804fb68 <unfinished ...>:
     setlocale(6, "")                                 = "en_US.UTF-8"
    bindtextdomain("coreutils", "/usr/share/locale") = "/usr/share/locale"
    textdomain("coreutils")                          = "coreutils"
    __cxa_atexit(0x804b650, 0, 0, 0x8052bf0, 0xbfb58908) = 0
    getenv("DF_BLOCK_SIZE")                          = NULL

     ...</samp>
    	    </pre>

     |

*   **nmap**
*   网络映射(**N**etwork **map**per)与端口扫描程序. 这个命令将会扫描一个服务器来定位打开的端口, 并且定位与这些端口相关的服务. 这个命令也能够上报一些包过滤与防火墙的信息. 这是一个防止网络被黑客入侵的非常重要的安全工具.

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 SERVER=$HOST                           # localhost.localdomain (127.0.0.1).
      4 PORT_NUMBER=25                         # SMTP端口.
      5 
      6 nmap $SERVER | grep -w "$PORT_NUMBER"  # 察看指定端口是否打开?
      7 #              grep -w 匹配整个单词. 
      8 #+             这样就不会匹配类似于1025这种含有25的端口了. 
      9 
     10 exit 0
     11 
     12 # 25/tcp     open        smtp</pre>

     |

*   **nc**
*   **nc**(_netcat_)工具是一个完整的工具包, 可以用它连接和监听TCP和UDP端口. 它能作为诊断和测试工具, 也能作为基于脚本的HTTP客户端和服务器组件.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">nc localhost.localdomain 25</kbd>
    <samp class="COMPUTEROUTPUT">220 localhost.localdomain ESMTP Sendmail 8.13.1/8.13.1; Thu, 31 Mar 2005 15:41:35 -0700</samp></pre>

     |

    * * *

    **例子 13-5\. 扫描远程机器上的_identd_服务进程**

    | 

    <pre class="PROGRAMLISTING">  1 #! /bin/sh
      2 ## 使用netcat工具写的和DaveG写的ident-scan扫描器有同等功能的东西. 噢, 他会被气死的. 
      3 ## 参数: target port [port port port ...]
      4 ## 标准输出和标准输入被混到一块.
      5 ##
      6 ##  优点: 运行起来比ident-scan慢, 这样使远程机器inetd进程更不易注意而不会产生警告, 
      7 ##+ 并且只有很少的知名端口会被指定. 
      8 ##  缺点: 要求数字端口参数, 输出中无法区分标准输出和标准错误, 
      9 ##+ 并且当远程服务监听在很高的端口时无法工作. 
     10 # 脚本作者: Hobbit <hobbit@avian.org>
     11 # 已征得作者同意在ABS指南中使用. 
     12 
     13 # ---------------------------------------------------
     14 E_BADARGS=65       # 至少需要两个参数. 
     15 TWO_WINKS=2        # 睡眠多长时间. 
     16 THREE_WINKS=3
     17 IDPORT=113         # indent协议的认证端口. 
     18 RAND1=999
     19 RAND2=31337
     20 TIMEOUT0=9
     21 TIMEOUT1=8
     22 TIMEOUT2=4
     23 # ---------------------------------------------------
     24 
     25 case "${2}" in
     26   "" ) echo "Need HOST and at least one PORT." ; exit $E_BADARGS ;;
     27 esac
     28 
     29 # 测试目标主机看是否运行了identd守护进程.
     30 nc -z -w $TIMEOUT0 "$1" $IDPORT || { echo "Oops, $1 isn't running identd." ; exit 0 ; }
     31 #  -z 选项扫描监听进程.
     32 #     -w $TIMEOUT = 尝试连接多长时间.
     33 
     34 # 产生一个随机的本地起点源端口.
     35 RP=`expr $ % $RAND1 + $RAND2`
     36 
     37 TRG="$1"
     38 shift
     39 
     40 while test "$1" ; do
     41   nc -v -w $TIMEOUT1 -p ${RP} "$TRG" ${1} < /dev/null > /dev/null &
     42   PROC=$!
     43   sleep $THREE_WINKS
     44   echo "${1},${RP}" | nc -w $TIMEOUT2 -r "$TRG" $IDPORT 2>&1
     45   sleep $TWO_WINKS
     46 
     47 # 这看上去是不是像个残疾的脚本或是其他类似的东西... ?
     48 # ABS作者评注 : "这不是真的那么糟糕,
     49 #+               事实上, 做得非常聪明."
     50 
     51   kill -HUP $PROC
     52   RP=`expr ${RP} + 1`
     53   shift
     54 done
     55 
     56 exit $?
     57 
     58 #  注意事项:
     59 #  ---------
     60 
     61 #  试着把第30行去掉, 
     62 #+ 然后以"localhost.localdomain 25"为参数来运行脚本.
     63 
     64 #  关于Hobbit写的更多'nc'例子脚本,
     65 #+ 可以在以下文档中找到:
     66 #+ /usr/share/doc/nc-X.XX/scripts 目录.</pre>

     |

    * * *

    并且, 当然, 这里还有Dr. Andrew Tridgell在BistKeeper事件中臭名卓著的一行脚本:

    | 

    <pre class="PROGRAMLISTING">  1 echo clone | nc thunk.org 5000 > e2fsprogs.dat</pre>

     |

*   **free**
*   使用表格形式来显示内存和缓存的使用情况. 这个命令的输出非常适合于使用[grep](textproc.md#GREPREF), [awk](awk.md#AWKREF)或者**Perl**来分析. **procinfo**将会显示**free**命令所能显示的所有信息, 而且更加详细.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> **free**
     <samp class="COMPUTEROUTPUT">total       used       free     shared    buffers     cached
       Mem:         30504      28624       1880      15820       1608       16376
       -/+ buffers/cache:      10640      19864
       Swap:        68540       3128      65412</samp></pre>

     |

    打印出未使用的RAM内存:

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> **free | grep Mem | awk '{ print $4 }'**
    <samp class="COMPUTEROUTPUT">1880</samp></pre>

     |

*   **procinfo**
*   从[/proc pseudo-filesystem](devproc.md#DEVPROCREF)中提取并显示所有信息和统计资料. 这个命令将给出更详细的信息.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">procinfo | grep Bootup</kbd>
    <samp class="COMPUTEROUTPUT">Bootup: Wed Mar 21 15:15:50 2001    Load average: 0.04 0.21 0.34 3/47 6829</samp></pre>

     |

*   **lsdev**
*   列出系统设备, 也就是显示所有安装的硬件.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">lsdev</kbd>
    <samp class="COMPUTEROUTPUT">Device            DMA   IRQ  I/O Ports
     ------------------------------------------------
     cascade             4     2 
     dma                          0080-008f
     dma1                         0000-001f
     dma2                         00c0-00df
     fpu                          00f0-00ff
     ide0                     14  01f0-01f7 03f6-03f6
     ...</samp>
    	      </pre>

     |

*   **du**
*   递归的显示(磁盘)文件的使用状况. 除非特殊指定, 否则默认是当前工作目录.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> **du -ach**
    <samp class="COMPUTEROUTPUT">1.0k    ./wi.sh
     1.0k    ./tst.sh
     1.0k    ./random.file
     6.0k    .
     6.0k    total</samp></pre>

     |

*   **df**
*   使用列表的形式显示文件系统的使用状况.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> **df**
    <samp class="COMPUTEROUTPUT">Filesystem           1k-blocks      Used Available Use% Mounted on
     /dev/hda5               273262     92607    166547  36% /
     /dev/hda8               222525    123951     87085  59% /home
     /dev/hda7              1408796   1075744    261488  80% /usr</samp></pre>

     |

*   **dmesg**
*   将所有的系统启动消息输出到<tt class="FILENAME">stdout</tt>上. 方便除错, 并且可以查出安装了哪些设备驱动和察看使用了哪些系统中断. **dmesg**命令的输出当然也放在脚本中, 并使用[grep](textproc.md#GREPREF), [sed](sedawk.md#SEDREF), 或[awk](awk.md#AWKREF)来进行分析.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">dmesg | grep hda</kbd>
    <samp class="COMPUTEROUTPUT">Kernel command line: ro root=/dev/hda2
     hda: IBM-DLGA-23080, ATA DISK drive
     hda: 6015744 sectors (3080 MB) w/96KiB Cache, CHS=746/128/63
     hda: hda1 hda2 hda3 < hda5 hda6 hda7 > hda4</samp>
    	      </pre>

     |

*   **stat**
*   显示一个或多个给定文件(也可以是目录文件或设备文件)的详细统计信息(_stat_istic).

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">stat test.cru</kbd>
     <samp class="COMPUTEROUTPUT">File: "test.cru"
       Size: 49970        Allocated Blocks: 100          Filetype: Regular File
       Mode: (0664/-rw-rw-r--)         Uid: (  501/ bozo)  Gid: (  501/ bozo)
     Device:  3,8   Inode: 18185     Links: 1    
     Access: Sat Jun  2 16:40:24 2001
     Modify: Sat Jun  2 16:40:24 2001
     Change: Sat Jun  2 16:40:24 2001</samp>
    	      </pre>

     |

    如果目标文件不存在, **stat**将会返回一个错误消息.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">stat nonexistent-file</kbd>
    <samp class="COMPUTEROUTPUT">nonexistent-file: No such file or directory</samp>
    	      </pre>

     |

*   **vmstat**
*   显示虚拟内存的统计信息.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">vmstat</kbd>
     <samp class="COMPUTEROUTPUT">procs                      memory    swap          io system         cpu
     r  b  w   swpd   free   buff  cache  si  so    bi    bo   in    cs  us  sy id
     0  0  0      0  11040   2636  38952   0   0    33     7  271    88   8   3 89</samp>
    	    </pre>

     |

*   **netstat**
*   显示当前网络的统计状况和信息, 比如路由表和激活的连接, 这个工具将访问<tt class="FILENAME">/proc/net</tt>( [27](devproc.md))中的信息. 请参考[例子 27-3](procref1.md#CONSTAT).

    **netstat -r**等价于[route](system.md#ROUTEREF)命令.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">netstat</kbd>
    <samp class="COMPUTEROUTPUT">Active Internet connections (w/o servers)
     Proto Recv-Q Send-Q Local Address           Foreign Address         State      
     Active UNIX domain sockets (w/o servers)
     Proto RefCnt Flags       Type       State         I-Node Path
     unix  11     [ ]         DGRAM                    906    /dev/log
     unix  3      [ ]         STREAM     CONNECTED     4514   /tmp/.X11-unix/X0
     unix  3      [ ]         STREAM     CONNECTED     4513
     . . .</samp></pre>

     |

*   **uptime**
*   显示系统运行的时间, 还有其他的一些统计信息.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">uptime</kbd>
    <samp class="COMPUTEROUTPUT">10:28pm  up  1:57,  3 users,  load average: 0.17, 0.34, 0.27</samp></pre>

     |

    | ![Note](./images/note.gif) | 

    _load average_如果小于或等于1, 那么就意味着系统会马上处理. 如果大于1, 那么就意味着进程需要排队. 如果大于3, 那么就意味着, 系统性能已经显著下降了.

     |

*   **hostname**
*   显示系统的主机名字. 这个命令在<tt class="FILENAME">/etc/rc.d</tt>安装脚本(或类似的<tt class="FILENAME">/etc/rc.d/rc.sysinit</tt>)中设置主机名. 等价于**uname -n**, 并且与[$HOSTNAME](internalvariables.md#HOSTNAMEREF)内部变量很相像.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">hostname</kbd>
    <samp class="COMPUTEROUTPUT">localhost.localdomain</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $HOSTNAME</kbd>
    <samp class="COMPUTEROUTPUT">localhost.localdomain</samp></pre>

     |

    与**hostname**命令很相像的命令还有**domainname**, **dnsdomainname**, **nisdomainname**, 和**ypdomainname**命令. 使用这些命令来显示(或设置)系统DNS或NIS/YP域名. 对于**hostname**命令来说, 使用不同的选项就可以分别达到上边这些命令的目的.

*   **hostid**
*   用16进制表示法来显示主机的32位ID.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">hostid</kbd>
    <samp class="COMPUTEROUTPUT">7f0100</samp></pre>

     |

    | ![Note](./images/note.gif) | 

    这个命令据说对于特定系统可以获得一个<span class="QUOTE">"唯一"</span>的序号. 某些产品的注册过程可能会需要这个序号来作为用户的许可证. 不幸的是, **hostid**只会使用字节对转换的方法来返回机器的网络地址, 网络地址用16进制表示.

    对于一个典型的没有网络的Linux机器来说, 它的网络地址保存在<tt class="FILENAME">/etc/hosts</tt>中.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cat /etc/hosts</kbd>
    <samp class="COMPUTEROUTPUT">127.0.0.1               localhost.localdomain localhost</samp></pre>

     |

    碰巧, 通过对<kbd class="USERINPUT">127.0.0.1</kbd>进行字节转换, 我们获得了<kbd class="USERINPUT">0.127.1.0</kbd>, 用16进制表示就是<kbd class="USERINPUT">007f0100</kbd>, 这就是上边**hostid**命令返回的结果. 这样几乎所有的无网络的Linux机器都会得到这个_hostid_.

     |

*   **sar**
*   **sar**(System Activity Reporter系统活动报告)命令将会给出系统统计的一个非常详细的概要. Santa Cruz Operation(<span class="QUOTE">"以前的"</span>SCO)公司在1999年4月份以开源软件的形式发布了**sar**.

    这个命令并不是基本Linux发行版的一部分, 但是你可以从[sysstat utilities](http://perso.wanadoo.fr/sebastien.godard/)所编写的[Sebastien Godard](mailto:sebastien.godard@wanadoo.fr)包中获得这个工具.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">sar</kbd>
    <samp class="COMPUTEROUTPUT">Linux 2.4.9 (brooks.seringas.fr) 	09/26/03

    10:30:00          CPU     %user     %nice   %system   %iowait     %idle
    10:40:00          all      2.21     10.90     65.48      0.00     21.41
    10:50:00          all      3.36      0.00     72.36      0.00     24.28
    11:00:00          all      1.12      0.00     80.77      0.00     18.11
    Average:          all      2.23      3.63     72.87      0.00     21.27

    14:32:30          LINUX RESTART

    15:00:00          CPU     %user     %nice   %system   %iowait     %idle
    15:10:00          all      8.59      2.40     17.47      0.00     71.54
    15:20:00          all      4.07      1.00     11.95      0.00     82.98
    15:30:00          all      0.79      2.94      7.56      0.00     88.71
    Average:          all      6.33      1.70     14.71      0.00     77.26</samp>
               </pre>

     |

*   **readelf**
*   这个命令会显示_elf_格式的二进制文件的统计信息. 这个工具是_binutils_工具包的一部分.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">readelf -h /bin/bash</kbd>
    <samp class="COMPUTEROUTPUT">ELF Header:
       Magic:   7f 45 4c 46 01 01 01 00 00 00 00 00 00 00 00 00 
       Class:                             ELF32
       Data:                              2's complement, little endian
       Version:                           1 (current)
       OS/ABI:                            UNIX - System V
       ABI Version:                       0
       Type:                              EXEC (Executable file)
       . . .</samp></pre>

     |

*   **size**
*   **size [/path/to/binary]**命令可以显示2进制可执行文件或归档文件每部分的尺寸. 这个工具主要提供给程序员使用.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">size /bin/bash</kbd>
     <samp class="COMPUTEROUTPUT">text    data     bss     dec     hex filename
      495971   22496   17392  535859   82d33 /bin/bash</samp>
    	      </pre>

     |

**系统日志类**

*   **logger**
*   附加一个用户产生的消息到系统日志中(<tt class="FILENAME">/var/log/messages</tt>). 即使不是root用户, 也可以调用**logger**.

    | 

    <pre class="PROGRAMLISTING">  1 logger Experiencing instability in network connection at 23:10, 05/21.
      2 # 现在, 运行'tail /var/log/messages'.</pre>

     |

    通过在脚本中调用**logger**命令, 就可以将调试信息写到<tt class="FILENAME">/var/log/messages</tt>中.

    | 

    <pre class="PROGRAMLISTING">  1 logger -t $0 -i Logging at line "$LINENO".
      2 # "-t"选项可以为日志入口指定标签. 
      3 # "-i"选项记录进程ID.
      4 
      5 # tail /var/log/message
      6 # ...
      7 # Jul  7 20:48:58 localhost ./test.sh[1712]: Logging at line 3.</pre>

     |

*   **logrotate**
*   这个工具用来管理系统的log文件, 可以在合适的时候轮换, 压缩, 删除, 或(和)e-mail它们. 这个工具将从旧的log文件中取得一些杂乱的记录, 并保存到<tt class="FILENAME">/var/log</tt>中. 一般的, 每天都是通过[cron](system.md#CRONREF)来运行**logrotate**.

    在<tt class="FILENAME">/etc/logrotate.conf</tt>中添加合适的入口就可以管理自己的log文件了, 就像管理系统log文件一样.

    | ![Note](./images/note.gif) | 

    Stefano Falsetto创造了[rottlog](http://www.gnu.org/software/rottlog/), 他认为这是**logrotate**的改进版本.

     |

**作业控制类**

*   **ps**
*   进程统计(<tt class="REPLACEABLE">_P_</tt>rocess <tt class="REPLACEABLE">_S_</tt>tatistics): 通过进程宿主或PID(进程ID)来列出当前正在执行的进程. 通常都是使用`ax`或`aux`选项来调用这个命令, 并且结果可以通过管道传递到[grep](textproc.md#GREPREF)或[sed](sedawk.md#SEDREF)中来搜索特定的进程(请参考[例子 11-12](internal.md#EX44)和[例子 27-2](procref1.md#PIDID)).

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$ </samp><kbd class="USERINPUT"> ps ax | grep sendmail</kbd>
    <samp class="COMPUTEROUTPUT">295 ?	   S	  0:00 sendmail: accepting connections on port 25</samp></pre>

     |

    如果想使用<span class="QUOTE">"树"</span>的形式来显示系统进程: 那么就使用**ps afjx**或**ps ax --forest**.

*   **pgrep**, **pkill**
*   **ps**命令可以与[grep](textproc.md#GREPREF)或[kill](x6756.md#KILLREF)结合使用.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ps a | grep mingetty</kbd>
    <samp class="COMPUTEROUTPUT">2212 tty2     Ss+    0:00 /sbin/mingetty tty2
     2213 tty3     Ss+    0:00 /sbin/mingetty tty3
     2214 tty4     Ss+    0:00 /sbin/mingetty tty4
     2215 tty5     Ss+    0:00 /sbin/mingetty tty5
     2216 tty6     Ss+    0:00 /sbin/mingetty tty6
     4849 pts/2    S+     0:00 grep mingetty</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">pgrep mingetty</kbd>
    <samp class="COMPUTEROUTPUT">2212 mingetty
     2213 mingetty
     2214 mingetty
     2215 mingetty
     2216 mingetty</samp>
    	      </pre>

     |

*   **pstree**
*   使用<span class="QUOTE">"树"</span>形式列出当前执行的进程. `-p`选项显示PID, 也就是进程名字.

*   **top**
*   连续不断的显示cpu占有率最高的进程. `-b`选项将会以文本方式来显示, 以便于可以在脚本中进行分析或访问.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">top -b</kbd>
     <samp class="COMPUTEROUTPUT">8:30pm  up 3 min,  3 users,  load average: 0.49, 0.32, 0.13
     45 processes: 44 sleeping, 1 running, 0 zombie, 0 stopped
     CPU states: 13.6% user,  7.3% system,  0.0% nice, 78.9% idle
     Mem:    78396K av,   65468K used,   12928K free,       0K shrd,    2352K buff
     Swap:  157208K av,       0K used,  157208K free                   37244K cached

       PID USER     PRI  NI  SIZE  RSS SHARE STAT %CPU %MEM   TIME COMMAND
       848 bozo      17   0   996  996   800 R     5.6  1.2   0:00 top
         1 root       8   0   512  512   444 S     0.0  0.6   0:04 init
         2 root       9   0     0    0     0 SW    0.0  0.0   0:00 keventd
       ...</samp>  
    	      </pre>

     |

*   **nice**
*   使用经过修改的优先级来运行一个后台作业. 优先级从19(最低)到-20(最高) 只有_root_用户可以设置负的(相对比较高的)优先级. 相关的命令还有**renice**, **snice**, 和**skill**.

*   **nohup**
*   保持一个命令进程处于运行状态, 即使这个命令进程所属的用户登出系统. 这个命令进程将会运行在前台, 除非在它前面加上<span class="TOKEN">&</span>. 如果你在脚本中使用**nohup**命令, 那么你最好同时使用[wait](x6756.md#WAITREF)命令, 这样就可以避免产生孤儿进程或僵尸进程.

*   **pidof**
*   获取一个正在运行作业的_进程ID(PID)_. 因为一些作业控制命令, 比如[kill](x6756.md#KILLREF)和**renice**只能使用进程的_PID_(而不是它的名字)作为参数, 所以有的时候必须得取得_PID_. **pidof**命令与[$PPID](internalvariables.md#PPIDREF)内部变量非常相似.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">pidof xclock</kbd>
    <samp class="COMPUTEROUTPUT">880</samp>
    	      </pre>

     |

    * * *

    **例子 13-6\. 使用**pidof**命令帮忙kill一个进程**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # kill-process.sh
      3 
      4 NOPROCESS=2
      5 
      6 process=xxxyyyzzz  # 使用不存在的进程. 
      7 # 只不过是为了演示...
      8 # ... 并不想在这个脚本中杀掉任何真正的进程. 
      9 #
     10 # 举个例子, 如果你想使用这个脚本来断线Internet, 
     11 #     process=pppd
     12 
     13 t=`pidof $process`       # 取得$process的pid(进程id). 
     14 # 'kill'只能使用pid(不能用程序名)作为参数. 
     15 
     16 if [ -z "$t" ]           # 如果没这个进程, 'pidof' 返回空. 
     17 then
     18   echo "Process $process was not running."
     19   echo "Nothing killed."
     20   exit $NOPROCESS
     21 fi  
     22 
     23 kill $t                  # 对于某些顽固的进程可能需要使用'kill -9'. 
     24 
     25 # 这里需要做一个检查, 看看进程是否允许自身被kill. 
     26 # 或许另一个 " t=`pidof $process` " 或许 ...
     27 
     28 
     29 # 整个脚本都可以使用下边这句来替换: 
     30 #        kill $(pidof -x process_name)
     31 # 或者
     32 #        killall process_name
     33 # 但是这就没有教育意义了. 
     34 
     35 exit 0</pre>

     |

    * * *

*   **fuser**
*   或取一个正在访问某个或某些文件(或目录)的进程ID. 使用`-k`选项将会kill这些进程. 对于系统安全来说, 尤其是在脚本中想阻止未被授权的用户访问系统服务的时候, 这个命令就显得非常有用了.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">fuser -u /usr/bin/vim</kbd>
    <samp class="COMPUTEROUTPUT">/usr/bin/vim:         3207e(bozo)</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">fuser -u /dev/null</kbd>
    <samp class="COMPUTEROUTPUT">/dev/null:            3009(bozo)  3010(bozo)  3197(bozo)  3199(bozo)</samp>
    	      </pre>

     |

    在进行正常插入或删除保存的媒体(比如CD ROM或者USB闪存设备)的时候, **fuser**命令非常的有用. 某些情况下, 也就是当你[umount](system.md#UMOUNTREF)一个设备失败的时候, 会出现<span class="ERRORNAME">设备忙</span>错误消息. 这意味着某些用户或进程正在访问这个设备. 可以使用**fuser -um /dev/device_name**来解决这种问题, 这样你就可以kill所有相关的进程.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">umount /mnt/usbdrive</kbd>
    <samp class="COMPUTEROUTPUT">umount: /mnt/usbdrive: device is busy</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">fuser -um /dev/usbdrive</kbd>
    <samp class="COMPUTEROUTPUT">/mnt/usbdrive:        1772c(bozo)</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">kill -9 1772</kbd>
    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">umount /mnt/usbdrive</kbd>
    	      </pre>

     |

    **fuser**命令的`-n`选项可以获得正在访问某一_端口_的进程. 当和[nmap](system.md#NMAPREF)命令结合使用的时候尤其有用.

    | 

    <pre class="SCREEN"><samp class="PROMPT">root#</samp> <kbd class="USERINPUT">nmap localhost.localdomain</kbd>
    <samp class="COMPUTEROUTPUT">PORT     STATE SERVICE
     25/tcp   open  smtp</samp>

    <samp class="PROMPT">root#</samp> <kbd class="USERINPUT">fuser -un tcp 25</kbd>
    <samp class="COMPUTEROUTPUT">25/tcp:               2095(root)</samp>

    <samp class="PROMPT">root#</samp> <kbd class="USERINPUT">ps ax | grep 2095 | grep -v grep</kbd>
    <samp class="COMPUTEROUTPUT">2095 ?        Ss     0:00 sendmail: accepting connections</samp>
    	      </pre>

     |

*   **cron**
*   管理程序调度器, 用来执行一些日常任务, 比如清除和删除系统log文件, 或者更新<span class="DATABASE">slocate</span>数据库. 这是[at](timedate.md#ATREF)命令的超级用户版本(虽然每个用户都可以有自己的<tt class="FILENAME">crontab</tt>文件, 并且这个文件可以使用**crontab**命令来修改). 它以[幽灵进程](communications.md#DAEMONREF)的身份来运行, 并且从<tt class="FILENAME">/etc/crontab</tt>中获得执行的调度入口.

    | ![Note](./images/note.gif) | 

    一般Linux风格的系统都使用**crond**, 用的是Matthew Dillon版本的**cron**.

     |

**启动与进程控制类**

*   **init**
*   **init**命令是所有进程的[父进程](internal.md#FORKREF). 在系统启动的最后一步调用, **init**将会依据<tt class="FILENAME">/etc/inittab</tt>来决定系统的运行级别. 只能使用root身份来运行它的别名 - **telinit**.

*   **telinit**
*   **init**命令的符号链接, 这是一种修改系统运行级别的手段, 通常在系统维护的时候, 或者在紧急的文件系统修复的时候才能用. 只能使用root身份调用. 调用这个命令是非常危险的 - 在你使用之前确定你已经很好地了解它!

*   **runlevel**
*   显示当前的和最后的运行级别, 也就是, 判断系统是处于终止状态(runlevel为<tt class="LITERAL">0</tt>), 单用户模式(<tt class="LITERAL">1</tt>), 多用户模式(<tt class="LITERAL">2</tt>或<tt class="LITERAL">3</tt>), X Windows(<tt class="LITERAL">5</tt>), 还是正处于重起状态(<tt class="LITERAL">6</tt>). 这个命令将会访问<tt class="FILENAME">/var/run/utmp</tt>文件.

*   **halt**, **shutdown**, **reboot**
*   设置系统关机的命令, 通常比电源关机的优先级高.

*   **service**
*   开启或停止一个系统_服务_. 在<tt class="FILENAME">/etc/init.d</tt> 和<tt class="FILENAME">/etc/rc.d</tt>中的启动脚本使用这个命令来启动服务.

    | 

    <pre class="SCREEN"><samp class="PROMPT">root#</samp> <kbd class="USERINPUT">/sbin/service iptables stop</kbd>
    <samp class="COMPUTEROUTPUT">Flushing firewall rules:                                   [  OK  ]
     Setting chains to policy ACCEPT: filter                    [  OK  ]
     Unloading iptables modules:                                [  OK  ]</samp>
    	      </pre>

     |

**网络类**

*   **ifconfig**
*   网络的_接口配置_和调试工具.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ifconfig -a</kbd>
    <samp class="COMPUTEROUTPUT">lo        Link encap:Local Loopback
               inet addr:127.0.0.1  Mask:255.0.0.0
               UP LOOPBACK RUNNING  MTU:16436  Metric:1
               RX packets:10 errors:0 dropped:0 overruns:0 frame:0
               TX packets:10 errors:0 dropped:0 overruns:0 carrier:0
               collisions:0 txqueuelen:0 
               RX bytes:700 (700.0 b)  TX bytes:700 (700.0 b)</samp></pre>

     |

    **ifconfig**命令绝大多数情况都是在启动的时候设置接口, 或者在重启的时候关闭它们.

    | 

    <pre class="PROGRAMLISTING">  1 # 来自于/etc/rc.d/init.d/network中的代码片断
      2 
      3 # ...
      4 
      5 # 检查网络是否启动. 
      6 [ ${NETWORKING} = "no" ] && exit 0
      7 
      8 [ -x /sbin/ifconfig ] || exit 0
      9 
     10 # ...
     11 
     12 for i in $interfaces ; do
     13   if ifconfig $i 2>/dev/null | grep -q "UP" >/dev/null 2>&1 ; then
     14     action "Shutting down interface $i: " ./ifdown $i boot
     15   fi
     16 # grep命令的GNU指定选项"-q"的意思是"安静", 也就是, 不产生输出. 
     17 # 这样, 后边重定向到/dev/null的操作就有点多余了.
     18        
     19 # ...
     20 
     21 echo "Currently active devices:"
     22 echo `/sbin/ifconfig | grep ^[a-z] | awk '{print $1}'`
     23 #                            ^^^^^  应该被引用以防止通配(globbing). 
     24 #  下边这段也能工作. 
     25 #    echo $(/sbin/ifconfig | awk '/^[a-z]/ { print $1 })'
     26 #    echo $(/sbin/ifconfig | sed -e 's/ .*//')
     27 #  感谢, S.C., 做了额外的注释. </pre>

     |

    请参考[例子 29-6](debugging.md#ONLINE).

*   **iwconfig**
*   这是为了配置无线网络的命令集合. 可以说是上边的**ifconfig**的无线版本.

*   **route**
*   显示内核路由表信息, 或者查看内核路由表的修改情况.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">route</kbd>
    <samp class="COMPUTEROUTPUT">Destination     Gateway         Genmask         Flags   MSS Window  irtt Iface
     pm3-67.bozosisp *               255.255.255.255 UH       40 0          0 ppp0
     127.0.0.0       *               255.0.0.0       U        40 0          0 lo
     default         pm3-67.bozosisp 0.0.0.0         UG       40 0          0 ppp0</samp>
    	      </pre>

     |

*   **chkconfig**
*   检查网络配置. 这个命令负责显示和管理在启动过程中所开启的网络服务 (这些服务都是从<tt class="FILENAME">/etc/rc?.d</tt>目录中开启的).

    最开始是从IRIX到Red Hat Linux的一个接口, **chkconfig**在某些Linux发行版中并不是核心安装的一部分.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">chkconfig --list</kbd>
    <samp class="COMPUTEROUTPUT">atd             0:off   1:off   2:off   3:on    4:on    5:on    6:off
     rwhod           0:off   1:off   2:off   3:off   4:off   5:off   6:off
     ...</samp>
    	      </pre>

     |

*   **tcpdump**
*   网络包的<span class="QUOTE">"嗅探器"</span>. 这是一个用来分析和调试网络上传输情况的工具, 它所使用的手段是把所有匹配指定规则的包头都显示出来.

    显示主机_bozoville_和主机_caduceus_之间所有传输的ip包.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">tcpdump ip host bozoville and caduceus</kbd>
    	      </pre>

     |

    当然, **tcpdump**的输出是可以进行分析的, 可以用我们之前讨论的[文本处理工具](textproc.md#TPCOMMANDLISTING1)来分析结果.

**文件系统类**

*   **mount**
*   加载一个文件系统, 通常都用来安装外部设备, 比如软盘或CDROM. 文件<tt class="FILENAME">/etc/fstab</tt>将会提供一个方便的列表, 这个列表列出了所有可用的文件系统, 分区和设备, 另外还包括某些选项, 比如是否可以自动或者手动的mount. 文件<tt class="FILENAME">/etc/mtab</tt>显示了当前已经mount的文件系统和分区(包括虚拟的, 比如<tt class="FILENAME">/proc</tt>).

    **mount -a**将会mount所有出现在<tt class="FILENAME">/etc/fstab</tt>中的文件系统和分区, 除了那些标记有`noauto`(非自动)选项的. 启动的时候, 在<tt class="FILENAME">/etc/rc.d</tt>中的一个启动脚本(<tt class="FILENAME">rc.sysinit</tt>或者一些相似的脚本)将会调用**mount -a**, 目的是mount所有可用的文件系统和分区.

    | 

    <pre class="PROGRAMLISTING">  1 mount -t iso9660 /dev/cdrom /mnt/cdrom
      2 # 加载CDROM
      3 mount /mnt/cdrom
      4 # 如果/mnt/cdrom包含在/etc/fstab中的话, 那么这么调用就是一种简便的方法. </pre>

     |

    这个多功能的命令甚至可以将一个普通文件mount到块设备中, 这样一来, 就可以象做操作文件系统一样来操作这个文件. 先将这个文件与一个[loopback device](devref1.md#LOOPBACKREF)设备相关联, 然后**Mount**就能达到这个目的了. 这种应用一般都是用来mount或检查一个ISO9660镜像, 经过检查后这个镜像会被烧录到CDR上. [[3]](#FTN.AEN12376)

    * * *

    **例子 13-7\. 检查一个CD镜像**

    | 

    <pre class="PROGRAMLISTING">  1 # 以root身份...
      2 
      3 mkdir /mnt/cdtest  # 准备一个mount入口, 如果你没准备的话. 
      4 
      5 mount -r -t iso9660 -o loop cd-image.iso /mnt/cdtest   # mount这个镜像.
      6 #                  "-o loop" option equivalent to "losetup /dev/loop0"
      7 cd /mnt/cdtest     # 现在检查这个镜像. 
      8 ls -alR            # 列出目录树中的文件. 
      9                    # 诸如此类. </pre>

     |

    * * *

*   **umount**
*   卸除一个当前已经mount的文件系统. 在删除已经mount上的软盘或CDROM之前, 这个设备必须被**umount**, 否则文件系统将会被损坏.

    | 

    <pre class="PROGRAMLISTING">  1 umount /mnt/cdrom
      2 # 现在你可以按下弹出键(指的是cdrom或软盘驱动器上的弹出按键), 并安全的弹出光盘. </pre>

     |

    | ![Note](./images/note.gif) | 

    **automount**工具, 如果对这个工具进行了适当的安装, 那么当需要访问或退出磁盘(或软盘)的时候, 就能够自动的mount和unmount它们了. 但是如果在带有软躯或光驱的笔记本电脑上使用的话, 可能会引起问题.

     |

*   **sync**
*   当你需要更新硬盘buffer中的数据时, 这个命令可以强制将你buffer上的数据立即写入到硬盘上(同步带有buffer的驱动器). 在某些情况下, 一个**sync**命令可能会挽救你刚刚更新的数据, 比如说突然断电, 所以这个命令可以给系统管理员和普通用户一些保障. 以前, 系统重启前都使用<kbd class="USERINPUT">sync; sync</kbd> (两次, 为了保证绝对可靠), 这是一种谨慎小心的可靠方法.

    某些时候, 比如说当你想安全删除文件的时候(请参考[例子 12-55](extmisc.md#BLOTOUT)), 或者当磁盘灯开始闪烁的时候, 你可能需要强制对buffer进行立即刷新.

*   **losetup**
*   建立和配置[loopback设备](devref1.md#LOOPBACKREF).

    * * *

    **例子 13-8\. 在一个文件中创建文件系统**

    | 

    <pre class="PROGRAMLISTING">  1 SIZE=1000000  # 1 meg
      2 
      3 head -c $SIZE < /dev/zero > file  # 建立指定尺寸的文件. 
      4 losetup /dev/loop0 file           # 作为loopback设备来创建. 
      5 mke2fs /dev/loop0                 # 创建文件系统. 
      6 mount -o loop /dev/loop0 /mnt     # mount.
      7 
      8 # 感谢, S.C.</pre>

     |

    * * *

*   **mkswap**
*   创建一个交换分区或文件. 交换区域随后必须马上使用**swapon**来启用.

*   **swapon**, **swapoff**
*   启用/禁用交换分区或文件. 这两个命令通常在启动和关机的时候才有效.

*   **mke2fs**
*   创建Linux ext2文件系统. 这个命令必须以root身份调用.

    * * *

    **例子 13-9\. 添加一个新的硬盘驱动器**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 # 在系统上添加第二块硬盘驱动器. 
      4 # 软件配置. 假设硬件已经安装了. 
      5 # 来自于本书作者的一篇文章. 
      6 # 在"Linux Gazette"的问题#38上, http://www.linuxgazette.com. 
      7 
      8 ROOT_UID=0     # 这个脚本必须以root身份运行. 
      9 E_NOTROOT=67   # 非root用户将会产生这个错误. 
     10 
     11 if [ "$UID" -ne "$ROOT_UID" ]
     12 then
     13   echo "Must be root to run this script."
     14   exit $E_NOTROOT
     15 fi  
     16 
     17 # 要非常谨慎小心的使用! 
     18 # 如果某步错了, 可能会彻底摧毁你当前的文件系统. 
     19 
     20 
     21 NEWDISK=/dev/hdb         # 假设/dev/hdb空白. 检查一下!
     22 MOUNTPOINT=/mnt/newdisk  #或者选择其他的mount入口. 
     23 
     24 
     25 fdisk $NEWDISK
     26 mke2fs -cv $NEWDISK1   # 检查坏块, 并且详细输出. 
     27 #  注意:    /dev/hdb1, *不是* /dev/hdb!
     28 mkdir $MOUNTPOINT
     29 chmod 777 $MOUNTPOINT  # 让所有用户都具有全部权限. 
     30 
     31 
     32 # 现在, 测试一下...
     33 # mount -t ext2 /dev/hdb1 /mnt/newdisk
     34 # 尝试创建一个目录. 
     35 # 如果运行起来了, umount它, 然后继续. 
     36 
     37 # 最后一步:
     38 # 将下边这行添加到/etc/fstab.
     39 # /dev/hdb1  /mnt/newdisk  ext2  defaults  1 1
     40 
     41 exit 0</pre>

     |

    * * *

    请参考[例子 13-8](system.md#CREATEFS)和[例子 28-3](zeros.md#RAMDISK).

*   **tune2fs**
*   调整ext2文件系统. 可以用来修改文件系统参数, 比如mount的最大数量. 必须以root身份调用.

    | ![Warning](./images/warning.gif) | 

    这是一个非常危险的命令. 一旦用错, 你需要自己负责, 因为它可能会破坏你的文件系统.

     |

*   **dumpe2fs**
*   打印(输出到<tt class="FILENAME">stdout</tt>)非常详细的文件系统信息. 必须以root身份调用.

    | 

    <pre class="SCREEN"><samp class="PROMPT">root#</samp> **dumpe2fs /dev/hda7 | grep 'ount count'**
    <samp class="COMPUTEROUTPUT">dumpe2fs 1.19, 13-Jul-2000 for EXT2 FS 0.5b, 95/08/09
     Mount count:              6
     Maximum mount count:      20</samp></pre>

     |

*   **hdparm**
*   显示或修改硬盘参数. 这个命令必须以root身份调用, 如果滥用的话会有危险.

*   **fdisk**
*   在存储设备上(通常都是硬盘)创建和修改一个分区表. 必须以root身份使用.

    | ![Warning](./images/warning.gif) | 

    谨慎使用这个命令. 如果出错, 会破坏你现存的文件系统.

     |

*   **fsck**, **e2fsck**, **debugfs**
*   文件系统的检查, 修复, 和除错命令集合.

    **fsck**: 检查UNIX文件系统的前端工具(也可以调用其它的工具). 文件系统的类型一般都是默认的ext2\.

    **e2fsck**: ext2文件系统检查器.

    **debugfs**: ext2文件系统除错器. 这个功能多 - 并且危险的工具, 主要用处之一就是(尝试)恢复删除的文件. 只有高级用户才能用!

    | ![Caution](./images/caution.gif) | 

    上边的这几个命令都必须以root身份调用, 这些命令都很危险, 如果滥用的话会破坏文件系统.

     |

*   **badblocks**
*   检查存储设备的坏块(物理损坏). 这个命令在格式化新安装的硬盘时候, 或者在测试"备份媒体"完整性的时候会被用到. [[4]](#FTN.AEN12567) 举个例子, **badblocks /dev/fd0**用来测试软盘.

    如果**badblocks**使用不慎的话, 可能会引起比较糟糕的结果(覆盖所有数据), 但是在只读模式下就不会发生这种情况. 如果root用户要测试某个设备(这是通常情况), 那么root用户必须使用这个命令.

*   **lsusb**, **usbmodules**
*   **lsusb**命令会显示所有USB(Universal Serial Bus通用串行总线)总线和使用USB的设备.

    **usbmodules**命令会输出连接USB设备的驱动模块的信息.

    | 

    <pre class="SCREEN"><samp class="PROMPT">root#</samp> <kbd class="USERINPUT">lsusb</kbd>
    <samp class="COMPUTEROUTPUT">Bus 001 Device 001: ID 0000:0000  
     Device Descriptor:
       bLength                18
       bDescriptorType         1
       bcdUSB               1.00
       bDeviceClass            9 Hub
       bDeviceSubClass         0 
       bDeviceProtocol         0 
       bMaxPacketSize0         8
       idVendor           0x0000 
       idProduct          0x0000

       . . .</samp>
    	      </pre>

     |

*   **lspci**
*   显示_pci_总线及其设备.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">lspci</kbd>
    <samp class="COMPUTEROUTPUT">00:00.0 Host bridge: Intel Corporation 82845 845 (Brookdale) Chipset Host Bridge (rev 04)
     00:01.0 PCI bridge: Intel Corporation 82845 845 (Brookdale) Chipset AGP Bridge (rev 04)
     00:1d.0 USB Controller: Intel Corporation 82801CA/CAM USB (Hub #1) (rev 02)
     00:1d.1 USB Controller: Intel Corporation 82801CA/CAM USB (Hub #2) (rev 02)
     00:1d.2 USB Controller: Intel Corporation 82801CA/CAM USB (Hub #3) (rev 02)
     00:1e.0 PCI bridge: Intel Corporation 82801 Mobile PCI Bridge (rev 42)

       . . .</samp>
    	      </pre>

     |

*   **mkbootdisk**
*   创建启动软盘, 启动盘可以唤醒系统, 比如当MBR(master boot record主启动记录)坏掉的时候. **mkbootdisk**命令其实是一个Bash脚本, 由Erik Troan所编写, 放在<tt class="FILENAME">/sbin</tt>目录中.

*   **chroot**
*   修改ROOT目录. 一般的命令都是从[$PATH](internalvariables.md#PATHREF)中获得的, 相对的, 默认根目录是 /. 这个命令将会把根目录修改为另一个目录(并且也将把工作目录修改到那). 这个命令对于安全目的非常有用, 举个例子, 某些情况下, 系统管理员希望限制一些特定的用户, 比如那些[telnet](communications.md#TELNETREF)上来的用户, 将他们限定到文件系统上一个安全的地方(有时候, 这被称为将一个guest用户限制在<span class="QUOTE">"chroot监牢"</span>中). 注意, 在使用**chroot**命令后, 系统的二进制可执行文件的目录就不再可用了.

    <kbd class="USERINPUT">chroot /opt</kbd>将会使得原来的<tt class="FILENAME">/usr/bin</tt>变为<tt class="FILENAME">/opt/usr/bin</tt>. 同样, <kbd class="USERINPUT">chroot /aaa/bbb /bin/ls</kbd>将会使得**ls**命令以<tt class="FILENAME">/aaa/bbb</tt>作为根目录, 而不是之前的<tt class="FILENAME">/</tt>. 如果使用**alias XX 'chroot /aaa/bbb ls'**, 并把这句放到用户的<tt class="FILENAME">~/.bashrc</tt>文件中的话, 这样可以有效地限制运行命令<span class="QUOTE">"XX"</span>时, 命令<span class="QUOTE">"XX"</span>可以使用文件系统的范围.

    当从启动盘恢复的时候(**chroot**到<tt class="FILENAME">/dev/fd0</tt>), 或者当系统从死机状态恢复过来并作为**lilo**选项的时候, **chroot**命令都是非常方便的. 其它的应用还包括从不同的文件系统进行安装(一个[rpm](filearchiv.md#RPMREF)选项)或者从CDROM上运行一个只读文件系统. 只能以root身份调用, 小心使用.

    | ![Caution](./images/caution.gif) | 

    由于正常的`$PATH`不再被关联, 所以可能需要将一些特定的系统文件拷贝到_chroot_之后的目录中,

     |

*   **lockfile**
*   这个工具是**procmail**包的一部分([www.procmail.org](http://www.procmail.org)). 它可以创建一个_锁定文件_, _锁定文件_是一种用来控制访问文件, 设备或资源的标记文件. 锁定文件就像一个标记一样被使用, 如果特定的文件, 设备, 或资源正在被一个特定的进程所使用(<span class="QUOTE">"busy"</span>), 那么对于其它进程来说, 就只能进行受限访问(或者不能访问).

    | 

    <pre class="PROGRAMLISTING">  1 lockfile /home/bozo/lockfiles/$0.lock
      2 # 创建一个以脚本名字为前缀的写保护锁定文件. </pre>

     |

    锁定文件用在一些特定的场合, 比如说保护系统的mail目录以防止多个用户同时修改, 或者提示一个modem端口正在被访问, 或者显示<span class="APPLICATION">Netscape</span>的一个实例正在使用它的缓存. 脚本可以做一些检查工作, 比如说一个特定的进程可以创建一个锁定文件, 那么只要检查这个特定的进程是否在运行, 就可以判断出锁定文件是否存在了. 注意如果脚本尝试创建一个已经存在的锁定文件的话, 那么脚本很可能被挂起.

    一般情况下, 应用对于锁定文件的创建和检查都放在<tt class="FILENAME">/var/lock</tt>目录中. [[5]](#FTN.AEN12688) 脚本可以使用下面的方法来检测锁定文件是否存在.

    | 

    <pre class="PROGRAMLISTING">  1 appname=xyzip
      2 # 应用"xyzip"创建锁定文件"/var/lock/xyzip.lock". 
      3 
      4 if [ -e "/var/lock/$appname.lock" ]
      5 then
      6   ...</pre>

     |

*   **flock**
*   **flock**命令不像**lockfile**那么有用. 它在一个文件上设置一个<span class="QUOTE">"咨询性"</span>的锁, (译者注: <span class="QUOTE">"咨询性"</span>的锁有时也称为<span class="QUOTE">"建议性"</span>的锁, 这种锁只对协同进程起作用, 还有一种锁叫<span class="QUOTE">"强制性"</span>锁, 这种锁加锁的对象读写操作都会由内核做检查, 更多的细节请参考flock(1), flock(2), /usr/src/linux/Documentation/locks.txt和mandatory.txt), 然后在锁持续的期间可以执行一个命令. 这样可以避免这个命令完成前有另外的进程试图在这个文件上设置锁.

    | 

    <pre class="PROGRAMLISTING">  1 flock $0 cat $0 > lockfile__$0
      2 #  上面这行表示脚本正处于列出自身内容到标准输出的过程中, 
      3 #+ 设置一把锁锁住脚本文件自身. </pre>

     |

    | ![Note](./images/note.gif) | 

    与**lockfile**不同, **flock**_不会_自动创建一个锁定文件.

     |

*   **mknod**
*   创建块或者字符设备文件(当在系统上安装新硬盘时, 必须这么做). **MAKEDEV**工具事实上具有**mknod**的全部功能, 而且更容易使用.

*   **MAKEDEV**
*   创建设备文件的工具. 必须在<tt class="FILENAME">/dev</tt>目录下, 并且以root身份使用.

    | 

    <pre class="SCREEN"><samp class="PROMPT">root#</samp> **./MAKEDEV**</pre>

     |

    这是**mknod**的高级版本.
*   **tmpwatch**
*   自动删除在指定时间内未被访问过的文件. 通常都是被[cron](system.md#CRONREF)调用, 用来删掉旧的log文件.

**备份类**

*   **dump**, **restore**
*   **dump**命令是一个精巧的文件系统备份工具, 通常都用在比较大的安装版本和网络上. [[6]](#FTN.AEN12775) 它读取原始的磁盘分区并且以二进制形式来写备份文件. 需要备份的文件可以保存到各种各样的存储设备上, 包括磁盘和磁带. **restore**命令用来恢复 **dump**所产生的备份.

*   **fdformat**
*   对软盘进行低级格式化.

**系统资源类**

*   **ulimit**
*   设置系统资源的使用_上限_. 通常情况下都是使用`-f`选项来调用, `-f`用来设置文件尺寸的限制(**ulimit -f 1000**就是将文件大小限制为1M). `-c`(译者注: 这里应该是作者笔误, 作者写的是`-t`)选项来限制coredump尺寸(**ulimit -c 0**就是不要coredump). 一般情况下, **ulimit**的值应该设置在<tt class="FILENAME">/etc/profile</tt>和(或)<tt class="FILENAME">~/.bash_profile</tt>中(请参考[Appendix G](files.md)).

    | ![Important](./images/important.gif) | 

    合理的使用**ulimit**命令可以保护系统免受可怕的_fork炸弹_的迫害.

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 这个脚本只是为了展示用. 
      3 # 你要自己为运行这个脚本的后果负责 -- 它*将*凝固你的系统. 
      4 
      5 while true  #  死循环. 
      6 do
      7   $0 &      #  这个脚本调用自身 . . .
      8             #+ fork无限次 . . .
      9             #+ 直到系统完全不动, 因为所有的资源都耗尽了. 
     10 done        #  这就像令人郁闷的<span class="QUOTE">"魔术师不断变出雨伞"</span>的场景. 
     11 
     12 exit 0      #  这里不会真正的退出, 因为这个脚本不会终止. </pre>

     |

    当这个脚本超过预先设置的限制时, 在<tt class="FILENAME">/etc/profile</tt>中的**ulimit -Hu XX**(_XX_就是需要限制的用户进程)可以终止这个脚本的运行.

     |

*   **quota**
*   显示用户或组的磁盘配额.

*   **setquota**
*   从命令行中设置用户或组的磁盘配额.

*   **umask**
*   设定用户创建文件时缺省的权限_mask_(掩码). 也可以用来限制特定用户的默认文件属性. 所有用户创建的文件属性都是由**umask**所指定的. 传递给umask命令的值(8进制)定义了文件的_屏蔽_权限. 比如, **umask 022**将会使得新文件的权限最多为755(777与022进行<span class="QUOTE">"与非"</span>操作). [[7]](#FTN.AEN12863) 当然, 用户随后可以使用[chmod](basic.md#CHMODREF)来修改指定文件的属性. 用户一般都将设置**umask**值得地方放在<tt class="FILENAME">/etc/profile</tt>或(和)<tt class="FILENAME">~/.bash_profile</tt>中(请参考[Appendix G](files.md)).

    * * *

    **例子 13-10\. 用**umask**将输出文件隐藏起来**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # rot13a.sh: 与"rot13.sh"脚本相同, 但是会将输出写到"安全"文件中. 
      3 
      4 # 用法: ./rot13a.sh filename
      5 # 或     ./rot13a.sh <filename
      6 # 或     ./rot13a.sh同时提供键盘输入(stdin)
      7 
      8 umask 177               #  文件创建掩码. 
      9                         #  被这个脚本所创建的文件
     10                         #+ 将具有600权限. 
     11 
     12 OUTFILE=decrypted.txt   #  结果保存在"decrypted.txt"中
     13                         #+ 这个文件只能够被
     14                         #  这个脚本的调用者(或者root)所读写. 
     15 
     16 cat "$@" | tr 'a-zA-Z' 'n-za-mN-ZA-M' > $OUTFILE 
     17 #    ^^ 从stdin 或文件中输入.         ^^^^^^^^^^ 输出重定向到文件中. 
     18 
     19 exit 0</pre>

     |

    * * *

*   **rdev**
*   取得root device, swap space, 或video mode的相关信息, 或者对它们进行修改. 一般情况下, **rdev**的功能都是被**lilo**所使用, 但是在建立一个ram disk的时候, 这个命令也很有用. 小心使用, 这是一个危险的命令.

**模块类**

*   **lsmod**
*   显示所有安装的内核模块.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">lsmod</kbd>
    <samp class="COMPUTEROUTPUT">Module                  Size  Used by
     autofs                  9456   2 (autoclean)
     opl3                   11376   0
     serial_cs               5456   0 (unused)
     sb                     34752   0
     uart401                 6384   0 [sb]
     sound                  58368   0 [opl3 sb uart401]
     soundlow                 464   0 [sound]
     soundcore               2800   6 [sb sound]
     ds                      6448   2 [serial_cs]
     i82365                 22928   2
     pcmcia_core            45984   0 [serial_cs ds i82365]</samp>
    	      </pre>

     |

    | ![Note](./images/note.gif) | 

    使用**cat /proc/modules**可以得到同样的结果.

     |

*   **insmod**
*   强制安装一个内核模块(如果可能的话, 使用**modprobe**来代替). 必须以root身份调用.

*   **rmmod**
*   强制卸载一个内核模块. 必须以root身份调用.

*   **modprobe**
*   模块装载器, 一般情况下都是在启动脚本中自动调用. 必须以root身份来运行.

*   **depmod**
*   创建模块依赖文件, 一般都是在启动脚本中调用.

*   **modinfo**
*   输出一个可装载模块的信息.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">modinfo hid</kbd>
    <samp class="COMPUTEROUTPUT">filename:    /lib/modules/2.4.20-6/kernel/drivers/usb/hid.o
     description: "USB HID support drivers"
     author:      "Andreas Gal, Vojtech Pavlik <vojtech@suse.cz>"
     license:     "GPL"</samp>
    	      </pre>

     |

**杂项类**

*   **env**
*   使用设置过的或修改过(并不是修改整个系统环境)的[环境变量](othertypesv.md#ENVREF)来运行一个程序或脚本. 使用`[varname=xxx]`形式可以在脚本中修改环境变量. 如果没有指定参数, 那么这个命令将会显示所有设置的环境变量.

    | ![Note](./images/note.gif) | 

    在Bash或其它Bourne shell的衍生物中, 是可以在同一命令行上设置多个变量的.

    | 

    <pre class="PROGRAMLISTING">  1 var1=value1 var2=value2 commandXXX
      2 # $var1和$var2只设置在'commandXXX'的环境中. </pre>

     |

     |

    | ![Tip](./images/tip.gif) | 

    当不知道shell或解释器路径的时候, 脚本的第一行(#!<span class="QUOTE">"sha-bang"</span>行)可以使用**env**.

    | 

    <pre class="PROGRAMLISTING">  1 #! /usr/bin/env perl
      2 
      3 print "This Perl script will run,\n";
      4 print "even when I don't know where to find Perl.\n";
      5 
      6 # 在不知道perl程序路径的时候, 
      7 # 这么写有利于跨平台移植. 
      8 # 感谢, S.C.</pre>

     |

     |

*   **ldd**
*   显示一个可执行文件和它所需要共享库之间依赖关系.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ldd /bin/ls</kbd>
    <samp class="COMPUTEROUTPUT">libc.so.6 => /lib/libc.so.6 (0x4000c000)
    /lib/ld-linux.so.2 => /lib/ld-linux.so.2 (0x80000000)</samp></pre>

     |

*   **watch**
*   以指定的时间间隔来重复运行一个命令.

    默认的时间间隔是2秒, 但是可以使用`-n`选项进行修改.

    | 

    <pre class="PROGRAMLISTING">  1 watch -n 5 tail /var/log/messages
      2 # 每隔5秒钟显示系统log文件(/var/log/messages)的结尾. </pre>

     |

*   **strip**
*   从可执行文件中去掉调试符号的引用. 这样做可以减小可执行文件的尺寸, 但是就不能调试了.

    这个命令一般都用在[Makefile](filearchiv.md#MAKEFILEREF)中, 但是很少用在shell脚本中.

*   **nm**
*   列出未strip过的, 经过编译的, 2进制文件的全部符号.

*   **rdist**
*   远程分布客户端: 在远端服务器上同步, 克隆, 或者备份一个文件系统.

### 注意事项

| [[1]](system.md#AEN10989) | 

这是在Linux机器上或者在带有磁盘配额的UNIX系统上的真实情况.

 |
| [[2]](system.md#AEN11020) | 

如果正在被删除的特定用户已经登录了主机, 那么**userdel**命令将会失败.

 |
| [[3]](system.md#AEN12376) | 

关于烧录CDR的更多细节, 可以参考Alex Withers的文章, [创建 CD](http://www2.linuxjournal.com/lj-issues/issue66/3335.md), 这篇文章是1999年10月在[Linux Journal](http://www.linuxjournal.com)上发表的.

 |
| [[4]](system.md#AEN12567) | 

[mke2fs](system.md#MKE2FSREF)的`-c`选项也会进行磁盘坏块检查.

 |
| [[5]](system.md#AEN12688) | 

因为只有_root_用户才具有对<tt class="FILENAME">/var/lock</tt>目录的写权限, 一般的用户脚本不能在那里设置一个锁定文件.

 |
| [[6]](system.md#AEN12775) | 

单用户Linux系统的操作更倾向于使用简单的备份工具, 比如**tar**.

 |
| [[7]](system.md#AEN12863) | 

NAND<span class="QUOTE">"_与非_"</span>是一种逻辑操作. 事实上, 这种操作与减法很相像.

 |