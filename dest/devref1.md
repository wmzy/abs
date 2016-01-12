# 27.1\. /dev

<tt class="FILENAME">/dev</tt>目录包含物理_设备_的条目, 这些设备可能会以硬件的形式出现, 也可能不会. [[1]](#FTN.AEN14826) 包含有挂载文件系统的硬驱动器分区, 在<tt class="FILENAME">/dev</tt>目录中都有对应的条目, 就像[df](system.md#DFREF)命令所展示的那样.

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">df</kbd>
<samp class="COMPUTEROUTPUT">Filesystem           1k-blocks      Used Available Use%
 Mounted on
 /dev/hda6               495876    222748    247527  48% /
 /dev/hda1                50755      3887     44248   9% /boot
 /dev/hda8               367013     13262    334803   4% /home
 /dev/hda5              1714416   1123624    503704  70% /usr</samp>
	      </pre>

 |

在其他方面, <tt class="FILENAME">/dev</tt>目录也包含_环回_设备, 比如<tt class="FILENAME">/dev/loop0</tt>. 一个环回设备就是一种机制, 可以让一般文件访问起来就像块设备那样. [[2]](#FTN.AEN14844) 这使得我们可以挂载一个完整的文件系统, 这个文件系统是在一个大文件中所创建的. 参考[例子 13-8](system.md#CREATEFS)和[例子 13-7](system.md#ISOMOUNTREF).

<tt class="FILENAME">/dev</tt>中还有少量的伪设备用于其它特殊目的, 比如[/dev/null](zeros.md#ZEROSREF), [/dev/zero](zeros.md#ZEROSREF1), [/dev/urandom](randomvar.md#URANDOMREF), <tt class="FILENAME">/dev/sda1</tt>, <tt class="FILENAME">/dev/udp</tt>, 和<tt class="FILENAME">/dev/tcp</tt>.

举个例子:

为了[挂载(mount)](system.md#MOUNTREF)一个USB闪存驱动器, 将下边一行附加到<tt class="FILENAME">/etc/fstab</tt>中. [[3]](#FTN.AEN14865)

| 

<pre class="PROGRAMLISTING">  1 /dev/sda1    /mnt/flashdrive    auto    noauto,user,noatime    0 0</pre>

 |

(也请参考[例子 A-24](contributed-scripts.md#USBINST).)

当在<tt class="FILENAME">/dev/tcp/$host/$port</tt>伪设备文件上执行一个命令的时候, Bash会打开一个TCP连接, 也就是打开相关的_socket_. [[4]](#FTN.AEN14880)

从<tt class="FILENAME">nist.gov</tt>上获取时间:

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cat </dev/tcp/time.nist.gov/13</kbd>
<samp class="COMPUTEROUTPUT">53082 04-03-18 04:26:54 68 0 0 502.3 UTC(NIST) *</samp>
	      </pre>

 |

[Mark贡献了上面的例子.]

下载一个URL:

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">exec 5<>/dev/tcp/www.net.cn/80</kbd>
<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo -e "GET / HTTP/1.0\n" >&5</kbd>
<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cat <&5</kbd>
	      </pre>

 |

[感谢, Mark和Mihai Maties.]

* * *

**例子 27-1\. 利用<tt class="FILENAME">/dev/tcp</tt>来检修故障**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # dev-tcp.sh: 利用/dev/tcp重定向来检查Internet连接. 
  3 
  4 # 本脚本由Troy Engel编写. 
  5 # 经过授权在本书中使用. 
  6  
  7 TCP_HOST=www.dns-diy.com   # 一个已知的对垃圾邮件友好的ISP. 
  8 TCP_PORT=80                # 端口80是http. 
  9   
 10 # 尝试连接. (有些像'ping' . . .) 
 11 echo "HEAD / HTTP/1.0" >/dev/tcp/${TCP_HOST}/${TCP_PORT}
 12 MYEXIT=$?
 13 
 14 : <<EXPLANATION
 15 If bash was compiled with --enable-net-redirections, it has the capability of
 16 using a special character device for both TCP and UDP redirections. These
 17 redirections are used identically as STDIN/STDOUT/STDERR. The device entries
 18 are 30,36 for /dev/tcp:
 19 
 20   mknod /dev/tcp c 30 36
 21 
 22 >From the bash reference:
 23 /dev/tcp/host/port
 24     If host is a valid hostname or Internet address, and port is an integer
 25 port number or service name, Bash attempts to open a TCP connection to the
 26 corresponding socket.
 27 EXPLANATION
 28 
 29    
 30 if [ "X$MYEXIT" = "X0" ]; then
 31   echo "Connection successful. Exit code: $MYEXIT"
 32 else
 33   echo "Connection unsuccessful. Exit code: $MYEXIT"
 34 fi
 35 
 36 exit $MYEXIT</pre>

 |

* * *

译者注: 由于上边例子的输出大部分都是英文, 所以译者补充一下脚本输出的译文.

如果bash以--enable-net-redirections选项来编译, 那么它就拥有了使用一个特殊字符设备的能力, 这个特殊字符设备用于TCP和UDP重定向. 这种重定向的能力就像STDIN/STDOUT/STDERR一样被使用. 该设备/dev/tcp的主次设备号是30, 36:

| 

<pre class="PROGRAMLISTING">  1 mknod /dev/tcp c 30 36</pre>

 |

>摘自bash参考手册:

/dev/tcp/host/port

如果host是一个有效的主机名或Internet地址, 并且port是一个整数端口号或者是服务器名称, Bash将会打开一个TCP连接, 到相应的socket上.

### 注意事项

| [[1]](devref1.md#AEN14826) | 

<tt class="FILENAME">/dev</tt>目录中的条目为各种物理设备和虚拟设备提供挂载点. 这些条目占用非常少的硬盘空间.

某些设备, 比如<tt class="FILENAME">/dev/null</tt>, <tt class="FILENAME">/dev/zero</tt>, 和<tt class="FILENAME">/dev/urandom</tt>都是虚拟的. 它们都不是真实的物理设备, 它们仅仅存在于软件中.

 |
| [[2]](devref1.md#AEN14844) | 

_块设备_都是以块为单位进行读写的, 与之相对应的_字符设备_都是以字符为单位进行访问的. 典型的块设备比如硬盘和CD ROM驱动器. 典型的字符设备例如键盘.

 |
| [[3]](devref1.md#AEN14865) | 

当然, 挂载点<tt class="FILENAME">/mnt/flashdrive</tt>必须存在. 如果不存在, 请使用root用户来执行**mkdir /mnt/flashdrive**.

为了能够真正的挂载驱动器, 请使用下面的命令: **mount /mnt/flashdrive**

对于现在比较新的Linux发行版来说, 都会自动把闪存驱动器设备挂载到<tt class="FILENAME">/media</tt>目录上.

 |
| [[4]](devref1.md#AEN14880) | 

_socket_是一个通讯节点, 这个通讯节点与一个特殊的I/O端口相关联. 它允许数据传输, 可以在同一台机器的不同硬件设备间传输, 可以在同一个网络中的不同主机之间传输, 可以在不同网络的不同主机间传输, 当然, 也可以在Internet上的不同地区之间的不同主机之间传输.

 |