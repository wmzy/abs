# 27.2\. /proc

<tt class="FILENAME">/proc</tt>目录实际上是一个伪文件系统. <tt class="FILENAME">/proc</tt>目录中的文件用来映射当前运行的系统, 内核_进程_以及与它们相关的状态与统计信息.

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cat /proc/devices</kbd>
<samp class="COMPUTEROUTPUT">Character devices:
   1 mem
   2 pty
   3 ttyp
   4 ttyS
   5 cua
   7 vcs
  10 misc
  14 sound
  29 fb
  36 netlink
 128 ptm
 136 pts
 162 raw
 254 pcmcia

 Block devices:
   1 ramdisk
   2 fd
   3 ide0
   9 md</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cat /proc/interrupts</kbd>
 <samp class="COMPUTEROUTPUT">CPU0       
   0:      84505          XT-PIC  timer
   1:       3375          XT-PIC  keyboard
   2:          0          XT-PIC  cascade
   5:          1          XT-PIC  soundblaster
   8:          1          XT-PIC  rtc
  12:       4231          XT-PIC  PS/2 Mouse
  14:     109373          XT-PIC  ide0
 NMI:          0 
 ERR:          0</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cat /proc/partitions</kbd>
<samp class="COMPUTEROUTPUT">major minor  #blocks  name     rio rmerge rsect ruse wio wmerge wsect wuse running use aveq

    3     0    3007872 hda 4472 22260 114520 94240 3551 18703 50384 549710 0 111550 644030
    3     1      52416 hda1 27 395 844 960 4 2 14 180 0 800 1140
    3     2          1 hda2 0 0 0 0 0 0 0 0 0 0 0
    3     4     165280 hda4 10 0 20 210 0 0 0 0 0 210 210
    ...</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cat /proc/loadavg</kbd>
<samp class="COMPUTEROUTPUT">0.13 0.42 0.27 2/44 1119</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cat /proc/apm</kbd>
<samp class="COMPUTEROUTPUT">1.16 1.2 0x03 0x01 0xff 0x80 -1% -1 ?</samp>
         </pre>

 |

Shell脚本可以从<tt class="FILENAME">/proc</tt>目录下的某些特定文件中提取数据. [[1]](#FTN.AEN14936)

| 

<pre class="PROGRAMLISTING">  1 FS=iso                       # 内核是否支持ISO文件系统? 
  2 
  3 grep $FS /proc/filesystems   # iso9660</pre>

 |

| 

<pre class="PROGRAMLISTING">  1 kernel_version=$( awk '{ print $3 }' /proc/version )</pre>

 |

| 

<pre class="PROGRAMLISTING">  1 CPU=$( awk '/model name/ {print $4}' < /proc/cpuinfo )
  2 
  3 if [ $CPU = Pentium ]
  4 then
  5   run_some_commands
  6   ...
  7 else
  8   run_different_commands
  9   ...
 10 fi</pre>

 |

| 

<pre class="PROGRAMLISTING">  1 devfile="/proc/bus/usb/devices"
  2 USB1="Spd=12"
  3 USB2="Spd=480"
  4 
  5 
  6 bus_speed=$(grep Spd $devfile | awk '{print $9}')
  7 
  8 if [ "$bus_speed" = "$USB1" ]
  9 then
 10   echo "USB 1.1 port found."
 11   # 可以在这里添加操作USB 1.1的相关动作. 
 12 fi</pre>

 |

<tt class="FILENAME">/proc</tt>目录下包含有许多以不同数字命名的子目录. 这些作为子目录名字的数字, 代表的是当前正在运行进程的[进程ID](internalvariables.md#PPIDREF). 在这些以数字命名的子目录中, 每一个子目录都有许多文件用来保存对应进程的可用信息. 文件<tt class="FILENAME">stat</tt>和<tt class="FILENAME">status</tt>保存着进程运行时的各项统计信息, 文件<tt class="FILENAME">cmdline</tt>保存着进程被调用时的命令行参数, 而文件<tt class="FILENAME">exe</tt>是一个符号链接, 这个符号链接指向这个运行进程的完整路径. 还有许多类似这样的文件, 如果从脚本的视角来看它们的话, 这些文件都非常的有意思.

* * *

**例子 27-2\. 找出与给定PID相关联的进程**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # pid-identifier.sh: 给出与指定pid相关联进程的完整路径名. 
  3 
  4 ARGNO=1  # 期望的参数个数. 
  5 E_WRONGARGS=65
  6 E_BADPID=66
  7 E_NOSUCHPROCESS=67
  8 E_NOPERMISSION=68
  9 PROCFILE=exe
 10 
 11 if [ $# -ne $ARGNO ]
 12 then
 13   echo "Usage: `basename $0` PID-number" >&2  # Error message >stderr(错误信息重定向到标准错误). 
 14   exit $E_WRONGARGS
 15 fi  
 16 
 17 pidno=$( ps ax | grep $1 | awk '{ print $1 }' | grep $1 )
 18 # 从"ps"命令的输出中搜索带有pid的行, pid位置在第一列#1, 由awk过滤出来. 
 19 # 然后再次确认这就是我们所要找的进程, 而不是由这个脚本调用所产生的进程. 
 20 # 最后的"grep $1"就是用来过滤掉这种可能性. 
 21 #
 22 #    pidno=$( ps ax | awk '{ print $1 }' | grep $1 )
 23 #    这么写就可以了, 这一点由Teemu Huovila指出. 
 24 
 25 if [ -z "$pidno" ]  # 如果经过所有的过滤之后, 得到的结果是一个长度为0的字符串, 
 26 then                # 那就说明这个pid没有相应的进程在运行. 
 27   echo "No such process running."
 28   exit $E_NOSUCHPROCESS
 29 fi  
 30 
 31 # 也可以这么写: 
 32 #   if ! ps $1 > /dev/null 2>&1
 33 #   then                # 没有与给定pid相匹配的进程在运行. 
 34 #     echo "No such process running."
 35 #     exit $E_NOSUCHPROCESS
 36 #    fi
 37 
 38 # 为了简化整个过程, 可以使用"pidof". 
 39 
 40 
 41 if [ ! -r "/proc/$1/$PROCFILE" ]  # 检查读权限. 
 42 then
 43   echo "Process $1 running, but..."
 44   echo "Can't get read permission on /proc/$1/$PROCFILE."
 45   exit $E_NOPERMISSION  # 一般用户不能访问/proc目录下的某些文件. 
 46 fi  
 47 
 48 # 最后两个测试可以使用下面的语句来代替: 
 49 #    if ! kill -0 $1 > /dev/null 2>&1 # '0'不是一个信号, but
 50                                       # 但是这么做, 可以测试一下是否
 51                                       # 可以向该进程发送信号. 
 52 #    then echo "PID doesn't exist or you're not its owner" >&2
 53 #    exit $E_BADPID
 54 #    fi
 55 
 56 
 57 
 58 exe_file=$( ls -l /proc/$1 | grep "exe" | awk '{ print $11 }' )
 59 # 或       exe_file=$( ls -l /proc/$1/exe | awk '{print $11}' )
 60 #
 61 # /proc/pid-number/exe是一个符号链接, 
 62 # 指向这个调用进程的完整路径名. 
 63 
 64 if [ -e "$exe_file" ]  # 如果/proc/pid-number/exe存在...
 65 then                 # 那么相应的进程就存在. 
 66   echo "Process #$1 invoked by $exe_file."
 67 else
 68   echo "No such process running."
 69 fi  
 70 
 71 
 72 # 这个精心制作的脚本, *几乎*能够被下边这一行所替代: 
 73 # ps ax | grep $1 | awk '{ print $5 }'
 74 # 但是, 这样并不会工作...
 75 # 因为'ps'输出的第5列是进程的argv[0](译者注: 这是命令行第一个参数, 即调用时程序用的程序路径本身.)
 76 # 而不是可执行文件的路径. 
 77 #
 78 # 然而, 下边这两种方法都能正确地完成这个任务. 
 79 #       find /proc/$1/exe -printf '%l\n'
 80 #       lsof -aFn -p $1 -d txt | sed -ne 's/^n//p'
 81 
 82 # 附加注释, 是Stephane Chazelas添加的. 
 83 
 84 exit 0</pre>

 |

* * *

* * *

**例子 27-3\. 网络连接状态**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 PROCNAME=pppd        # ppp守护进程
  4 PROCFILENAME=status  # 在这里寻找信息. 
  5 NOTCONNECTED=65
  6 INTERVAL=2           # 每2秒刷新一次. 
  7 
  8 pidno=$( ps ax | grep -v "ps ax" | grep -v grep | grep $PROCNAME | awk '{ print $1 }' )
  9 # 找出'pppd'所对应的进程号, 即'ppp守护进程'. 
 10 # 必须过滤掉由搜索本身所产生的进程行. 
 11 #
 12 #  然而, 就像Oleg Philon所指出的那样, 
 13 #+ 如果使用"pidof"的话, 就会非常简单. 
 14 #  pidno=$( pidof $PROCNAME )
 15 #
 16 #  从经验中总结出来的忠告: 
 17 #+ 当命令序列变得非常复杂的时候, 一定要找到更简洁的方法. 
 18 
 19 
 20 if [ -z "$pidno" ]   # 如果没有找到匹配的pid, 那么就说明相应的进程没运行. 
 21 then
 22   echo "Not connected."
 23   exit $NOTCONNECTED
 24 else
 25   echo "Connected."; echo
 26 fi
 27 
 28 while [ true ]       # 死循环, 这里可以改进一下. 
 29 do
 30 
 31   if [ ! -e "/proc/$pidno/$PROCFILENAME" ]
 32   # 进程运行时, 相应的"status"文件就会存在. 
 33   then
 34     echo "Disconnected."
 35     exit $NOTCONNECTED
 36   fi
 37 
 38 netstat -s | grep "packets received"  # 获得一些连接统计. 
 39 netstat -s | grep "packets delivered"
 40 
 41 
 42   sleep $INTERVAL
 43   echo; echo
 44 
 45 done
 46 
 47 exit 0
 48 
 49 # 如果你想停止这个脚本, 只能使用Control-C. 
 50 
 51 #    练习:
 52 #    -----
 53 #    改进这个脚本, 使它可以按"q"键退出. 
 54 #    提高这个脚本的用户友好性. </pre>

 |

* * *

| ![Warning](./images/warning.gif) | 

一般来说, 在<tt class="FILENAME">/proc</tt>目录中, 进行_写_文件操作是非常危险的, 因为这么做可能会破坏文件系统, 甚至于摧毁整个机器.

 |

### 注意事项

| [[1]](procref1.md#AEN14936) | 

某些系统命令也可做类似的事情, 比如[procinfo](system.md#PROCINFOREF), [free](system.md#FREEREF), [vmstat](system.md#VMSTATREF), [lsdev](system.md#LSDEVREF), 和[uptime](system.md#UPTIMEREF).

 |