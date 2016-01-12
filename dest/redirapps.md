# 16.3\. 重定向的应用

巧妙地运用I/O重定向, 能够解析和粘合命令输出的各个片断(请参考[例子 11-7](internal.md#READREDIR)). 这样就可以产生报告与日志文件.

* * *

**例子 16-12\. 事件纪录**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # logevents.sh, 由Stephane Chazelas所编写. 
  3 
  4 # 把事件记录在一个文件中. 
  5 # 必须以root身份运行 (这样才有权限访问/var/log). 
  6 
  7 ROOT_UID=0     # 只有$UID值为0的用户才具有root权限.
  8 E_NOTROOT=67   # 非root用户的退出错误. 
  9 
 10 
 11 if [ "$UID" -ne "$ROOT_UID" ]
 12 then
 13   echo "Must be root to run this script."
 14   exit $E_NOTROOT
 15 fi  
 16 
 17 
 18 FD_DEBUG1=3
 19 FD_DEBUG2=4
 20 FD_DEBUG3=5
 21 
 22 # 去掉下边两行注释中的一行, 来激活脚本. 
 23 # LOG_EVENTS=1
 24 # LOG_VARS=1
 25 
 26 
 27 log()  # 把时间和日期写入日志文件. 
 28 {
 29 echo "$(date)  $*" >&7     # 这会把日期*附加*到文件中. 
 30                               # 参考下边的代码. 
 31 }
 32 
 33 
 34 
 35 case $LOG_LEVEL in
 36  1) exec 3>&2         4> /dev/null 5> /dev/null;;
 37  2) exec 3>&2         4>&2         5> /dev/null;;
 38  3) exec 3>&2         4>&2         5>&2;;
 39  *) exec 3> /dev/null 4> /dev/null 5> /dev/null;;
 40 esac
 41 
 42 FD_LOGVARS=6
 43 if [[ $LOG_VARS ]]
 44 then exec 6>> /var/log/vars.log
 45 else exec 6> /dev/null               # 丢弃输出. 
 46 fi
 47 
 48 FD_LOGEVENTS=7
 49 if [[ $LOG_EVENTS ]]
 50 then
 51   # then exec 7 >(exec gawk '{print strftime(), $0}' >> /var/log/event.log)
 52   # 上面这行不能在2.04版本的Bash上运行. 
 53   exec 7>> /var/log/event.log        # 附加到"event.log". 
 54   log                                      # 记录日期与时间. 
 55 else exec 7> /dev/null                  # 丢弃输出. 
 56 fi
 57 
 58 echo "DEBUG3: beginning" >&${FD_DEBUG3}
 59 
 60 ls -l >&5 2>&4                       # command1 >&5 2>&4
 61 
 62 echo "Done"                                # command2 
 63 
 64 echo "sending mail" >&${FD_LOGEVENTS}   # 将字符串"sending mail"写到文件描述符#7\. 
 65 
 66 
 67 exit 0</pre>

 |

* * *