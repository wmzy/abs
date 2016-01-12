# 28\. Zero与Null

**<tt class="FILENAME">/dev/zero</tt>与<tt class="FILENAME">/dev/null</tt>**

*   使用<tt class="FILENAME">/dev/null</tt>
*   可以把<tt class="FILENAME">/dev/null</tt>想象为一个<span class="QUOTE">"黑洞"</span>. 它非常接近于一个只写文件. 所有写入它的内容都会永远丢失. 而如果想从它那读取内容, 则什么也读不到. 但是, 对于命令行和脚本来说, <tt class="FILENAME">/dev/null</tt>却非常的有用.

    禁用<tt class="FILENAME">stdout</tt>.

    | 

    <pre class="PROGRAMLISTING">  1 cat $filename >/dev/null
      2 # 文件的内容不会输出到stdout. </pre>

     |

    禁用<tt class="FILENAME">stderr</tt> (来自于[例子 12-3](moreadv.md#EX57)).

    | 

    <pre class="PROGRAMLISTING">  1 rm $badname 2>/dev/null
      2 #           错误消息[stderr]就这么被丢到太平洋去了. </pre>

     |

    禁用<tt class="FILENAME">stdout</tt>和<tt class="FILENAME">stderr</tt>.

    | 

    <pre class="PROGRAMLISTING">  1 cat $filename 2>/dev/null >/dev/null
      2 # 如果"$filename"不存在, 将不会有错误消息输出. 
      3 # 如果"$filename"存在, 文件内容不会输出到stdout. 
      4 # 因此, 上边的代码根本不会产生任何输出. 
      5 #
      6 #  如果你只想测试一下命令的返回码, 而不想要任何输出时, 
      7 #+ 这么做就非常有用了. 
      8 #
      9 # cat $filename &>/dev/null
     10 #     也可以, 由Baris Cicek指出. </pre>

     |

    删除一个文件的内容, 但是保留文件本身, 并且保留所有的文件访问权限(来自于[例子 2-1](sha-bang.md#EX1)和[例子 2-3](sha-bang.md#EX2)):

    | 

    <pre class="PROGRAMLISTING">  1 cat /dev/null > /var/log/messages
      2 #  : > /var/log/messages   具有同样的效果, 但是不会产生新进程.(译者注: 因为是内建的)
      3 
      4 cat /dev/null > /var/log/wtmp</pre>

     |

    自动清空日志文件的内容(特别适用于处理那些由商业站点发送的, 令人厌恶的<span class="QUOTE">"cookie"</span>):

    * * *

    **例子 28-1\. 隐藏令人厌恶的cookie**

    | 

    <pre class="PROGRAMLISTING">  1 if [ -f ~/.netscape/cookies ]  # 如果存在, 就删除. 
      2 then
      3   rm -f ~/.netscape/cookies
      4 fi
      5 
      6 ln -s /dev/null ~/.netscape/cookies
      7 # 现在所有的cookie都被扔到黑洞里去了, 这样就不会保存在我们的磁盘中了. </pre>

     |

    * * *

*   使用<tt class="FILENAME">/dev/zero</tt>
*   类似于<tt class="FILENAME">/dev/null</tt>, <tt class="FILENAME">/dev/zero</tt>也是一个伪文件, 但事实上它会产生一个null流(二进制的0流, 而不是ASCII类型). 如果你想把其他命令的输出写入它的话, 那么写入的内容会消失, 而且如果你想从<tt class="FILENAME">/dev/zero</tt>中读取一连串null的话, 也非常的困难, 虽然可以使用[od](extmisc.md#ODREF)或者一个16进制编辑器来达到这个目的. <tt class="FILENAME">/dev/zero</tt>的主要用途就是用来创建一个指定长度, 并且初始化为空的文件, 这种文件一般都用作临时交换文件.

    * * *

    **例子 28-2\. 使用<tt class="FILENAME">/dev/zero</tt>来建立一个交换文件**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 创建一个交换文件. 
      3 
      4 ROOT_UID=0         # Root用户的$UID为0\. 
      5 E_WRONG_USER=65    # 不是root?
      6 
      7 FILE=/swap
      8 BLOCKSIZE=1024
      9 MINBLOCKS=40
     10 SUCCESS=0
     11 
     12 
     13 # 这个脚本必须以root身份来运行. 
     14 if [ "$UID" -ne "$ROOT_UID" ]
     15 then
     16   echo; echo "You must be root to run this script."; echo
     17   exit $E_WRONG_USER
     18 fi  
     19   
     20 
     21 blocks=${1:-$MINBLOCKS}          #  如果没在命令行上指定, 
     22                                  #+ 默认设置为40块. 
     23 # 上边这句等价于下面这个命令块. 
     24 # --------------------------------------------------
     25 # if [ -n "$1" ]
     26 # then
     27 #   blocks=$1
     28 # else
     29 #   blocks=$MINBLOCKS
     30 # fi
     31 # --------------------------------------------------
     32 
     33 
     34 if [ "$blocks" -lt $MINBLOCKS ]
     35 then
     36   blocks=$MINBLOCKS              # 至少要有40块. 
     37 fi  
     38 
     39 
     40 echo "Creating swap file of size $blocks blocks (KB)."
     41 dd if=/dev/zero of=$FILE bs=$BLOCKSIZE count=$blocks  # 用零填充文件. 
     42 
     43 mkswap $FILE $blocks             # 将其指定为交换文件(译者注: 或称为交换分区). 
     44 swapon $FILE                     # 激活交换文件. 
     45 
     46 echo "Swap file created and activated."
     47 
     48 exit $SUCCESS</pre>

     |

    * * *

    <tt class="FILENAME">/dev/zero</tt>还有其他的应用场合, 比如当你出于特殊目的, 需要<span class="QUOTE">"用0填充"</span>一个指定大小的文件时, 就可以使用它. 举个例子, 比如要将一个文件系统挂载到[环回设备(loopback device)](devref1.md#LOOPBACKREF)上(请参考[例子 13-8](system.md#CREATEFS)), 或者想<span class="QUOTE">"安全"</span>的删除一个文件(请参考[例子 12-55](extmisc.md#BLOTOUT)).

    * * *

    **例子 28-3\. 创建一个ramdisk**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # ramdisk.sh
      3 
      4 #  一个"ramdisk"就是系统RAM内存中的一部分, 
      5 #+ 只不过它被当作文件系统来操作. 
      6 #  它的优点是访问速度非常快(读/写时间快). 
      7 #  缺点: 易失性, 当机器重启或关机时, 会丢失数组. 
      8 #+                而且会减少系统可用的RAM. 
      9 #
     10 #  那么ramdisk有什么用呢? 
     11 #  保存一个大数据集, 比如保存表格或字典. 
     12 #+ 这样的话, 可以增加查询速度, 因为访问内存比访问硬盘快得多. 
     13 
     14 
     15 E_NON_ROOT_USER=70             # 必须以root身份来运行. 
     16 ROOTUSER_NAME=root
     17 
     18 MOUNTPT=/mnt/ramdisk
     19 SIZE=2000                      # 2K个块(可以进行适当的修改)
     20 BLOCKSIZE=1024                 # 每块的大小为1K(1024字节)
     21 DEVICE=/dev/ram0               # 第一个ram设备
     22 
     23 username=`id -nu`
     24 if [ "$username" != "$ROOTUSER_NAME" ]
     25 then
     26   echo "Must be root to run \"`basename $0`\"."
     27   exit $E_NON_ROOT_USER
     28 fi
     29 
     30 if [ ! -d "$MOUNTPT" ]         #  测试挂载点是否已经存在, 
     31 then                           #+ 如果做了这个判断的话, 当脚本运行多次的时候, 
     32   mkdir $MOUNTPT               #+ 就不会报错了. (译者注: 主要是为了避免多次创建目录.)
     33 fi
     34 
     35 dd if=/dev/zero of=$DEVICE count=$SIZE bs=$BLOCKSIZE  # 把RAM设备的内容用0填充. 
     36                                                       # 为什么必须这么做? 
     37 mke2fs $DEVICE                 # 在RAM上创建一个ext2文件系统. 
     38 mount $DEVICE $MOUNTPT         # 挂载上. 
     39 chmod 777 $MOUNTPT             # 使一般用户也可以访问这个ramdisk. 
     40                                # 然而, 只能使用root身份来卸载它. 
     41 
     42 echo "\"$MOUNTPT\" now available for use."
     43 # 现在ramdisk就可以访问了, 即使是普通用户也可以访问. 
     44 
     45 #  小心, ramdisk存在易失性, 
     46 #+ 如果重启或关机的话, 保存的内容就会消失. 
     47 #  所以, 还是要将你想保存的文件, 保存到常规磁盘目录下. 
     48 
     49 # 重启之后, 运行这个脚本, 将会再次建立一个ramdisk. 
     50 # 如果你仅仅重新加载/mnt/ramdisk, 而没有运行其他步骤的话, 那就不会正常工作. 
     51 
     52 #  如果对这个脚本进行适当的改进, 就可以将其放入/etc/rc.d/rc.local中, 
     53 #+ 这样, 在系统启动的时候就会自动建立一个ramdisk. 
     54 #  这么做非常适合于那些对速度要求很高的数据库服务器. 
     55 
     56 exit 0</pre>

     |

    * * *

    最后值得一提的是, ELF二进制文件需要使用<tt class="FILENAME">/dev/zero</tt>.