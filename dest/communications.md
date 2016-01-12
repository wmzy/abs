# 12.6\. 通讯命令

下边命令中的某几个命令你会在[追踪垃圾邮件](writingscripts.md#CSPAMMERS)练习中找到其用法, 用来进行网络数据的转换和分析.

**信息与统计**

*   **host**
*   通过名字或IP地址来搜索一个互联网主机的信息, 使用DNS.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">host surfacemail.com</kbd>
    <samp class="COMPUTEROUTPUT">surfacemail.com. has address 202.92.42.236</samp>
    	      </pre>

     |

*   **ipcalc**
*   显示一个主机IP信息. 使用`-h`选项, **ipcalc**将会做一个DNS的反向查询, 通过IP地址找到主机(服务器)名.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ipcalc -h 202.92.42.236</kbd>
    <samp class="COMPUTEROUTPUT">HOSTNAME=surfacemail.com</samp>
    	      </pre>

     |

*   **nslookup**
*   通过IP地址在一个主机上做一个互联网的<span class="QUOTE">"名字服务查询"</span>. 事实上, 这与**ipcalc -h**或**dig -x**等价. 这个命令既可以交互运行也可以非交互运行, 换句话说, 就是在脚本中运行.

    **nslookup**命令据说已经被慢慢的<span class="QUOTE">"忽视"</span>了, 但事实上它是有一定的作用.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">nslookup -sil 66.97.104.180</kbd>
    <samp class="COMPUTEROUTPUT">nslookup kuhleersparnis.ch
     Server:         135.116.137.2
     Address:        135.116.137.2#53

     Non-authoritative answer:
     Name:   kuhleersparnis.ch</samp>
    	      </pre>

     |

*   **dig**
*   **D**omain **I**nformation **G**roper(域信息查询). 与**nslookup**很相似, **dig**也可以在一个主机上做互联网的<span class="QUOTE">"名字服务查询"</span>. 这个命令既可以交互运行也可以非交互运行, 换句话说, 就是在脚本中运行.

    下面是一些**dig**命令有趣的选项, `+time=N`选项用来设置查询超时为_N_秒, `+nofail`选项用来持续查询服务器直到收到一个响应, `-x`会做反向地址查询.

    比较下边这3个命令的输出, **dig -x**, **ipcalc -h**和 **nslookup**.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">dig -x 81.9.6.2</kbd>
    <samp class="COMPUTEROUTPUT">;; Got answer:
     ;; ->>HEADER<<- opcode: QUERY, status: NXDOMAIN, id: 11649
     ;; flags: qr rd ra; QUERY: 1, ANSWER: 0, AUTHORITY: 1, ADDITIONAL: 0

     ;; QUESTION SECTION:
     ;2.6.9.81.in-addr.arpa.         IN      PTR

     ;; AUTHORITY SECTION:
     6.9.81.in-addr.arpa.    3600    IN      SOA     ns.eltel.net. noc.eltel.net.
     2002031705 900 600 86400 3600

     ;; Query time: 537 msec
     ;; SERVER: 135.116.137.2#53(135.116.137.2)
     ;; WHEN: Wed Jun 26 08:35:24 2002
     ;; MSG SIZE  rcvd: 91</samp>
    	      </pre>

     |

    * * *

    **例子 12-36\. 查找滥用的链接来报告垃圾邮件发送者**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # spam-lookup.sh: 查找滥用的连接来报告垃圾邮件发送者.
      3 # 感谢Michael Zick.
      4                                                       
      5 # 检查命令行参数.
      6 ARGCOUNT=1
      7 E_WRONGARGS=65
      8 if [ $# -ne "$ARGCOUNT" ]
      9 then
     10   echo "Usage: `basename $0` domain-name"
     11   exit $E_WRONGARGS
     12 fi
     13 
     14 
     15 dig +short $1.contacts.abuse.net -c in -t txt
     16 # 也试试:
     17 #     dig +nssearch $1
     18 #     尽量找到"可信赖的名字服务器"并且显示SOA记录.
     19                                                                
     20 # 下边这句也可以:
     21 #     whois -h whois.abuse.net $1
     22 #           ^^ ^^^^^^^^^^^^^^^  指定主机.
     23 #     使用这个命令也可以查找多个垃圾邮件发送者, 比如:"
     24 #     whois -h whois.abuse.net $spamdomain1 $spamdomain2 . . .
     25                                                                
     26                                                                
     27 #  练习:
     28 #  -----
     29 #  扩展这个脚本的功能,
     30 #+ 让它可以自动发送e-mail来通知
     31 #+ 需要对此负责的ISP的联系地址.
     32 #  暗示: 使用"mail"命令.
     33 
     34 exit $?
     35 
     36 # spam-lookup.sh chinatietong.com
     37 #                一个已知的垃圾邮件域. (译者: 中国铁通 . . .)
     38 
     39 # "crnet_mgr@chinatietong.com"
     40 # "crnet_tec@chinatietong.com"
     41 # "postmaster@chinatietong.com"
     42 
     43 
     44 #  如果想找到这个脚本的一个更详尽的版本,
     45 #+ 请访问SpamViz的主页, http://www.spamviz.net/index.html.</pre>

     |

    * * *

    * * *

    **例子 12-37\. 分析一个垃圾邮件域**

    | 

    <pre class="PROGRAMLISTING">  1 #! /bin/bash
      2 # is-spammer.sh: 鉴别一个垃圾邮件域
      3                                                           
      4 # $Id: is-spammer, v 1.4 2004/09/01 19:37:52 mszick Exp $
      5 # 上边这行是RCS ID信息.
      6 #                                                         
      7 #  这是附件中捐献脚本is_spammer.bash
      8 #+ 的一个简单版本.
      9                                                           
     10 # is-spammer <domain.name>
     11                                                           
     12 # 使用外部程序: 'dig'
     13 # 测试版本: 9.2.4rc5
     14                                                           
     15 # 使用函数. 
     16 # 使用IFS来分析分配在数组中的字符串. 
     17 # 做一些有用的事: 检查e-mail黑名单. 
     18 
     19 # 使用来自文本体中的domain.name:
     20 # http://www.good_stuff.spammer.biz/just_ignore_everything_else
     21 #                       ^^^^^^^^^^^
     22 # 或者使用来自任意e-mail地址的domain.name: 
     23 # Really_Good_Offer@spammer.biz
     24 #                                                               
     25 # 并将其作为这个脚本的唯一参数.
     26 #(另: 你的Inet连接应该保证连接好)
     27 #                                                               
     28 # 这样, 在上边两个实例中调用这个脚本:
     29 #       is-spammer.sh spammer.biz
     30 
     31 
     32 # Whitespace == :Space:Tab:Line Feed:Carriage Return:
     33 WSP_IFS=/pre>\x20'/pre>\x09'/pre>\x0A'/pre>\x0D'
     34 
     35 # No Whitespace == Line Feed:Carriage Return
     36 No_WSP=/pre>\x0A'/pre>\x0D'
     37 
     38 # 域分隔符为点分10进制ip地址
     39 ADR_IFS=${No_WSP}'.'
     40 
     41 # 取得dns文本资源记录. 
     42 # get_txt <error_code> <list_query>
     43 get_txt() {
     44 
     45     # 分析在"."中分配的$1.
     46     local -a dns
     47     IFS=$ADR_IFS
     48     dns=( $1 )
     49     IFS=$WSP_IFS
     50     if [ "${dns[0]}" == '127' ]
     51     then
     52         # 查看此处是否有原因.
     53         echo $(dig +short $2 -t txt)
     54     fi
     55 }
     56 
     57 # 取得dns地址资源纪录. 
     58 # chk_adr <rev_dns> <list_server>
     59 chk_adr() {
     60     local reply
     61     local server
     62     local reason
     63 
     64     server=${1}${2}
     65     reply=$( dig +short ${server} )
     66 
     67     # 假设应答可能是一个错误码 . . .
     68     if [ ${#reply} -gt 6 ]
     69     then
     70         reason=$(get_txt ${reply} ${server} )
     71         reason=${reason:-${reply}}
     72     fi
     73     echo ${reason:-' not blacklisted.'}
     74 }
     75 
     76 # 需要从名字中取得 IP 地址.
     77 echo 'Get address of: '$1
     78 ip_adr=$(dig +short $1)
     79 dns_reply=${ip_adr:-' no answer '}
     80 echo ' Found address: '${dns_reply}
     81 
     82 # 一个可用的应答至少是4个数字加上3个点.
     83 if [ ${#ip_adr} -gt 6 ]
     84 then
     85     echo
     86     declare query
     87 
     88     # 通过点中的分配进行分析. 
     89     declare -a dns
     90     IFS=$ADR_IFS
     91     dns=( ${ip_adr} )
     92     IFS=$WSP_IFS
     93 
     94     # 用8进制表示法将dns查询循序记录起来. 
     95     rev_dns="${dns[3]}"'.'"${dns[2]}"'.'"${dns[1]}"'.'"${dns[0]}"'.'
     96 
     97 # 查看: http://www.spamhaus.org (传统地址, 维护的很好)
     98     echo -n 'spamhaus.org says: '
     99     echo $(chk_adr ${rev_dns} 'sbl-xbl.spamhaus.org')
    100 
    101 # 查看: http://ordb.org (开放转发Open mail relay)
    102     echo -n '   ordb.org  says: '
    103     echo $(chk_adr ${rev_dns} 'relays.ordb.org')
    104 
    105 # 查看: http://www.spamcop.net/ (你可以在这里报告spammer)
    106     echo -n ' spamcop.net says: '
    107     echo $(chk_adr ${rev_dns} 'bl.spamcop.net')
    108 
    109 # # # 其他的黑名单操作 # # #
    110 
    111 # 查看: http://cbl.abuseat.org.
    112     echo -n ' abuseat.org says: '
    113     echo $(chk_adr ${rev_dns} 'cbl.abuseat.org')
    114 
    115 # 查看: http://dsbl.org/usage (不同的邮件转发mail relay)
    116     echo
    117     echo 'Distributed Server Listings'
    118     echo -n '       list.dsbl.org says: '
    119     echo $(chk_adr ${rev_dns} 'list.dsbl.org')
    120 
    121     echo -n '   multihop.dsbl.org says: '
    122     echo $(chk_adr ${rev_dns} 'multihop.dsbl.org')
    123 
    124     echo -n 'unconfirmed.dsbl.org says: '
    125     echo $(chk_adr ${rev_dns} 'unconfirmed.dsbl.org')
    126 
    127 else
    128     echo
    129     echo 'Could not use that address.'
    130 fi
    131 
    132 exit 0
    133 
    134 # 练习:
    135 # -----
    136 
    137 # 1) 检查脚本参数, 
    138 #    并且如果必要的话, 可以使用合适的错误消息退出.
    139 
    140 # 2) 察看调用这个脚本的时候是否在线, 
    141 #    并且如果必要的话, 可以使用合适的错误消息退出.
    142 
    143 # 3) 用一般变量来替换掉"硬编码"的BHL domain.
    144 
    145 # 4) 通过对'dig'命令使用"+time="选项
    146 #    来给这个脚本设置一个暂停.</pre>

     |

    * * *

    想获得比上边这个脚本更详细的版本, 请参考[例子 A-28](contributed-scripts.md#ISSPAMMER2).

*   **traceroute**
*   跟踪包发送到远端主机过程中的路由信息. 这个命令在LAN, WAN, 或者在Internet上都可以正常工作. 远端主机可以通过IP地址来指定. 这个命令的输出也可以通过管道中的[grep](textproc.md#GREPREF)或[sed](sedawk.md#SEDREF)命令来过滤.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">traceroute 81.9.6.2</kbd>
    <samp class="COMPUTEROUTPUT">traceroute to 81.9.6.2 (81.9.6.2), 30 hops max, 38 byte packets
     1  tc43.xjbnnbrb.com (136.30.178.8)  191.303 ms  179.400 ms  179.767 ms
     2  or0.xjbnnbrb.com (136.30.178.1)  179.536 ms  179.534 ms  169.685 ms
     3  192.168.11.101 (192.168.11.101)  189.471 ms  189.556 ms *
     ...</samp>
    	      </pre>

     |

*   **ping**
*   广播一个<span class="QUOTE">"ICMP ECHO_REQUEST"</span>包到其他主机上, 既可以是本地网络也可以是远端网络. 这是一个测试网络连接的诊断工具, 应该小心使用.

    如果**ping**成功之行, 那么返回的[退出状态码](exit-status.md#EXITSTATUSREF)为<span class="ERRORCODE">0</span>. 可以用在脚本的测试语句中.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ping localhost</kbd>
    <samp class="COMPUTEROUTPUT">PING localhost.localdomain (127.0.0.1) from 127.0.0.1 : 56(84) bytes of data.
     64 bytes from localhost.localdomain (127.0.0.1): icmp_seq=0 ttl=255 time=709 usec
     64 bytes from localhost.localdomain (127.0.0.1): icmp_seq=1 ttl=255 time=286 usec

     --- localhost.localdomain ping statistics ---
     2 packets transmitted, 2 packets received, 0% packet loss
     round-trip min/avg/max/mdev = 0.286/0.497/0.709/0.212 ms</samp>
    	      </pre>

     |

*   **whois**
*   执行DNS(域名系统)查询. `-h`选项允许指定需要查询的特定_whois_服务器. 请参考[例子 4-6](othertypesv.md#EX18)和[例子 12-36](communications.md#SPAMLOOKUP).

*   **finger**
*   取得网络上的用户信息. 另外这个命令可以显示一个用户的<tt class="FILENAME">~/.plan</tt>, <tt class="FILENAME">~/.project</tt>, 和<tt class="FILENAME">~/.forward</tt>文件, 当然, 前提是如果这些文件存在的话.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">finger</kbd>
    <samp class="COMPUTEROUTPUT">Login  Name           Tty      Idle  Login Time   Office     Office Phone
     bozo   Bozo Bozeman   tty1        8  Jun 25 16:59
     bozo   Bozo Bozeman   ttyp0          Jun 25 16:59
     bozo   Bozo Bozeman   ttyp1          Jun 25 17:07</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">finger bozo</kbd>
    <samp class="COMPUTEROUTPUT">Login: bozo                             Name: Bozo Bozeman
     Directory: /home/bozo                   Shell: /bin/bash
     Office: 2355 Clown St., 543-1234
     On since Fri Aug 31 20:13 (MST) on tty1    1 hour 38 minutes idle
     On since Fri Aug 31 20:13 (MST) on pts/0   12 seconds idle
     On since Fri Aug 31 20:13 (MST) on pts/1
     On since Fri Aug 31 20:31 (MST) on pts/2   1 hour 16 minutes idle
     No mail.
     No Plan.</samp>
    	      </pre>

     |

    出于安全上的考虑, 许多网络都禁用了**finger**, 以及和它相关的幽灵进程. [[1]](#FTN.AEN9898)

*   **chfn**
*   修改**finger**命令所显示出来的用户信息.

*   **vrfy**
*   验证一个互联网的e-mail地址.

**远端主机接入**

*   **sx**, **rx**
*   **sx**和**rx**命令使用_xmodem_协议, 置服务来向远端主机传输文件和接收文件. 这些都是通讯安装包的一般部分, 比如**minicom**.

*   **sz**, **rz**
*   **sz**和**rz**命令使用_zmodem_协议, 设置服务来向远端主机传输文件和接收文件. _Zmodem_协议在某些方面比_xmodem_协议强, 比如使用更快的传输波特率, 并且可以对中断的文件进行续传. 与**sx**和**rx**一样, 这些都是通讯安装包的一般部分.

*   **ftp**
*   向远端服务器上传或下载的工具, 也是一种协议. 一个ftp会话可以写到脚本中自动运行. (请参考[例子 17-6](here-docs.md#EX72), [例子 A-4](contributed-scripts.md#ENCRYPTEDPW), 和[例子 A-13](contributed-scripts.md#FTPGET)).

*   **uucp**, **uux**, **cu**
*   **uucp**: _UNIX到UNIX拷贝_. 这是一个通讯安装包, 目的是为了在UNIX服务器之间传输文件. 使用shell脚本来处理**uucp**命令序列是一种有效的方法.

    因为互联网和电子邮件的出现, **uucp**现在看起来已经很落伍了, 但是这个命令在互联网连接不可用或者不适合使用的地方, 这个命令还是可以完美的运行. **uucp**的优点就是它的容错性, 即使有一个服务将拷贝操作中断了, 那么当连接恢复的时候, 这个命令还是可以在中断的地方续传.

    ---

    **uux**: _UNIX到UNIX执行_. 在远端系统上执行一个命令. 这个命令是**uucp**包的一部分.

    ---

    **cu**: _C_all _U_p 一个远端系统并且作为一个简单终端进行连接. 这是一个[telnet](communications.md#TELNETREF)的缩减版本. 这个命令是**uucp**包的一部分.

*   **telnet**
*   连接远端主机的工具和协议.

    | ![Caution](./images/caution.gif) | 

    telnet协议本身包含安全漏洞, 因此我们应该适当的避免使用.

     |

*   **wget**
*   **wget**工具使用_非交互_的形式从web或ftp站点上取得或下载文件. 在脚本中使用正好.

    | 

    <pre class="PROGRAMLISTING">  1 wget -p http://www.xyz23.com/file01.html
      2 #  -p或--page-requisite选项将会使得wget取得所有在显示指定页时
      3 #+ 所需要的文件. (译者: 比如内嵌图片和样式表等.)
      4 
      5 wget -r ftp://ftp.xyz24.net/~bozo/project_files/ -O $SAVEFILE
      6 #  -r选项将会递归的从指定站点
      7 #+ 上下载所有连接. </pre>

     |

    * * *

    **例子 12-38\. 获得一份股票报价**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # quote-fetch.sh: 下载一份股票报价. 
      3 
      4 
      5 E_NOPARAMS=66
      6 
      7 if [ -z "$1" ]  #必须指定需要获取的股票(代号). 
      8   then echo "Usage: `basename $0` stock-symbol"
      9   exit $E_NOPARAMS
     10 fi
     11 
     12 stock_symbol=$1
     13 
     14 file_suffix=.html
     15 # 获得一个HTML文件, 所以要正确命名它. 
     16 URL='http://finance.yahoo.com/q?s='
     17 # Yahoo金融板块, 后缀是股票查询.
     18 
     19 # -----------------------------------------------------------
     20 wget -O ${stock_symbol}${file_suffix} "${URL}${stock_symbol}"
     21 # -----------------------------------------------------------
     22 
     23 
     24 # 在http://search.yahoo.com上查询相关材料:
     25 # -----------------------------------------------------------
     26 # URL="http://search.yahoo.com/search?fr=ush-news&p=${query}"
     27 # wget -O "$savefilename" "${URL}"
     28 # -----------------------------------------------------------
     29 # 保存相关URL的列表.
     30 
     31 exit $?
     32 
     33 # 练习:
     34 # -----
     35 #
     36 # 1) 添加一个测试来验证用户是否在线.
     37 #    (暗示: 对"ppp"或"connect"来分析'ps -ax'的输出.
     38 #
     39 # 2) 修改这个脚本, 让这个脚本具有获得本地天气预报的能力,
     40 #+   将用户的zip code作为参数.</pre>

     |

    * * *

    请参考[例子 A-30](contributed-scripts.md#WGETTER2)和[例子 A-31](contributed-scripts.md#BASHPODDER).

*   **lynx**
*   **lynx**是一个网页浏览器, 也是一个文件浏览器. 它可以(通过使用`-dump`选项)在脚本中使用. 它的作用是可以非交互的从Web或ftp站点上获得文件.

    | 

    <pre class="PROGRAMLISTING">  1 lynx -dump http://www.xyz23.com/file01.html >$SAVEFILE</pre>

     |

    使用`-traversal`选项, **lynx**将会从参数中指定的HTTP URL开始, <span class="QUOTE">"遍历"</span>指定服务器上的所有连接. 如果与`-crawl`选项一起用的话, 将会把每个输出的页面文本都放到一个log文件中.

*   **rlogin**
*   <tt class="REPLACEABLE">_远端登陆_</tt>, 在远端的主机上开启一个会话. 这个命令存在安全隐患, 所以要使用[ssh](communications.md#SSHREF)来代替.

*   **rsh**
*   <tt class="REPLACEABLE">_远端shell_</tt>, 在远端的主机上执行命令. 这个命令存在安全隐患, 所以要使用**ssh**来代替.

*   **rcp**
*   <tt class="REPLACEABLE">_远端拷贝_</tt>, 在网络上的不同主机间拷贝文件.

*   **rsync**
*   <tt class="REPLACEABLE">_远端同步_</tt>, 在网络上的不同主机间(同步)更新文件.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">rsync -a ~/sourcedir/*txt /node1/subdirectory/</kbd>
    	      </pre>

     |

    * * *

    **例子 12-39\. 更新FC4(Fedora 4)**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # fc4upd.sh
      3 
      4 # 脚本作者: Frank Wang.
      5 # 本书作者作了少量修改.
      6 # 授权在本书中使用.
      7 
      8 
      9 #  使用rsync命令从镜像站点上下载Fedora 4的更新. 
     10 #  为了节省空间, 如果有多个版本存在的话, 
     11 #+ 只下载最新的包. 
     12 
     13 URL=rsync://distro.ibiblio.org/fedora-linux-core/updates/
     14 # URL=rsync://ftp.kddilabs.jp/fedora/core/updates/
     15 # URL=rsync://rsync.planetmirror.com/fedora-linux-core/updates/
     16 
     17 DEST=${1:-/var/www/html/fedora/updates/}
     18 LOG=/tmp/repo-update-$(/bin/date +%Y-%m-%d).txt
     19 PID_FILE=/var/run/${0##*/}.pid
     20 
     21 E_RETURN=65        # 某些意想不到的错误.
     22 
     23 
     24 # 一般rsync选项
     25 # -r: 递归下载
     26 # -t: 保存时间
     27 # -v: verbose
     28 
     29 OPTS="-rtv --delete-excluded --delete-after --partial"
     30 
     31 # rsync include模式
     32 # 开头的"/"会导致绝对路径名匹配. 
     33 INCLUDE=(
     34     "/4/i386/kde-i18n-Chinese*" 
     35 #   ^                         ^
     36 # 双引号是必须的, 用来防止globbing.
     37 ) 
     38 
     39 
     40 # rsync exclude模式
     41 # 使用"#"临时注释掉一些不需要的包.
     42 EXCLUDE=(
     43     /1
     44     /2
     45     /3
     46     /testing
     47     /4/SRPMS
     48     /4/ppc
     49     /4/x86_64
     50     /4/i386/debug
     51    "/4/i386/kde-i18n-*"
     52    "/4/i386/openoffice.org-langpack-*"
     53    "/4/i386/*i586.rpm"
     54    "/4/i386/GFS-*"
     55    "/4/i386/cman-*"
     56    "/4/i386/dlm-*"
     57    "/4/i386/gnbd-*"
     58    "/4/i386/kernel-smp*"
     59 #  "/4/i386/kernel-xen*" 
     60 #  "/4/i386/xen-*" 
     61 )
     62 
     63 
     64 init () {
     65     # 让管道命令返回可能的rsync错误, 比如, 网络延时(stalled network).
     66     set -o pipefail
     67 
     68     TMP=${TMPDIR:-/tmp}/${0##*/}.$     # 保存精炼的下载列表.
     69     trap "{                                                   
     70         rm -f $TMP 2>/dev/null                                
     71     }" EXIT                             # 删除存在的临时文件.
     72 }
     73 
     74 
     75 check_pid () {
     76 # 检查进程是否存在. 
     77     if [ -s "$PID_FILE" ]; then
     78         echo "PID file exists. Checking ..."
     79         PID=$(/bin/egrep -o "^[[:digit:]]+" $PID_FILE)
     80         if /bin/ps --pid $PID &>/dev/null; then
     81             echo "Process $PID found. ${0##*/} seems to be running!"
     82            /usr/bin/logger -t ${0##*/} \
     83                  "Process $PID found. ${0##*/} seems to be running!"
     84             exit $E_RETURN
     85         fi
     86         echo "Process $PID not found. Start new process . . ."
     87     fi
     88 }
     89 
     90 
     91 #  根据上边的模式,
     92 #+ 设置整个文件的更新范围, 从root或$URL开始.
     93 set_range () {
     94     include=
     95     exclude=
     96     for p in "${INCLUDE[@]}"; do
     97         include="$include --include \"$p\""
     98     done
     99 
    100     for p in "${EXCLUDE[@]}"; do
    101         exclude="$exclude --exclude \"$p\""
    102     done
    103 }
    104 
    105 
    106 # 获得并提炼rsync更新列表.
    107 get_list () {
    108     echo $ > $PID_FILE || {
    109         echo "Can't write to pid file $PID_FILE"
    110         exit $E_RETURN
    111     }
    112 
    113     echo -n "Retrieving and refining update list . . ."
    114 
    115     # 获得列表 -- 作为单个命令来运行rsync的话需要'eval'.
    116     # $3和$4是文件创建的日期和时间.
    117     # $5是完整的包名字.
    118     previous=
    119     pre_file=
    120     pre_date=0
    121     eval /bin/nice /usr/bin/rsync \
    122         -r $include $exclude $URL | \
    123         egrep '^dr.x|^-r' | \
    124         awk '{print $3, $4, $5}' | \
    125         sort -k3 | \
    126         { while read line; do
    127             # 获得这段运行的秒数, 过滤掉不用的包. 
    128             cur_date=$(date -d "$(echo $line | awk '{print $1, $2}')" +%s)
    129             #  echo $cur_date
    130 
    131             # 取得文件名. 
    132             cur_file=$(echo $line | awk '{print $3}')
    133             #  echo $cur_file
    134 
    135             # 如果可能的话, 从文件名中取得rpm的包名字. 
    136             if [[ $cur_file == *rpm ]]; then
    137                 pkg_name=$(echo $cur_file | sed -r -e \
    138                     's/(^([^_-]+[_-])+)[[:digit:]]+\..*[_-].*$/\1/')
    139             else
    140                 pkg_name=
    141             fi
    142             # echo $pkg_name
    143 
    144             if [ -z "$pkg_name" ]; then   #  如果不是一个rpm文件,
    145                 echo $cur_file >> $TMP    #+ 然后添加到下载列表里.
    146             elif [ "$pkg_name" != "$previous" ]; then   # 发现一个新包.
    147                 echo $pre_file >> $TMP                  # 输出最新的文件.
    148                 previous=$pkg_name                      # 保存当前状态.
    149                 pre_date=$cur_date
    150                 pre_file=$cur_file
    151             elif [ "$cur_date" -gt "$pre_date" ]; then  #  如果是相同的包, 但是这个包更新一些, 
    152                 pre_date=$cur_date                      #+ 那么就更新最新的. 
    153                 pre_file=$cur_file
    154             fi
    155             done
    156             echo $pre_file >> $TMP                      #  TMP现在包含所有
    157                                                         #+ 提炼过的列表. 
    158             # echo "subshell=$BASH_SUBSHELL"
    159 
    160     }       # 这里的大括号是为了让最后这句"echo $pre_file >> $TMP"
    161             # 也能与整个循环一起放到同一个子shell ( 1 )中. 
    162 
    163     RET=$?  # 取得管道命令的返回状态. 
    164 
    165     [ "$RET" -ne 0 ] && {
    166         echo "List retrieving failed with code $RET"
    167         exit $E_RETURN
    168     }
    169 
    170     echo "done"; echo
    171 }
    172 
    173 # 真正的rsync下载部分. 
    174 get_file () {
    175 
    176     echo "Downloading..."
    177     /bin/nice /usr/bin/rsync \
    178         $OPTS \
    179         --filter "merge,+/ $TMP" \
    180         --exclude '*'  \
    181         $URL $DEST     \
    182         | /usr/bin/tee $LOG
    183 
    184     RET=$?
    185 
    186         #  --filter merge,+/ 对于这个目的来说, 这句是至关重要的. 
    187         #  + 修饰语意为着包含, / 意味着绝对路径. 
    188         #  然后$TMP中排过序的列表将会包含升序的路径名, 
    189         #+ 并从"简化的流程"(shortcutting the circuit)中阻止下边的 --exclude '*'. 
    190 
    191     echo "Done"
    192 
    193     rm -f $PID_FILE 2>/dev/null
    194 
    195     return $RET
    196 }
    197 
    198 # -------
    199 # Main
    200 init
    201 check_pid
    202 set_range
    203 get_list
    204 get_file
    205 RET=$?
    206 # -------
    207 
    208 if [ "$RET" -eq 0 ]; then
    209     /usr/bin/logger -t ${0##*/} "Fedora update mirrored successfully."
    210 else
    211     /usr/bin/logger -t ${0##*/} "Fedora update mirrored with failure code: $RET"
    212 fi
    213 
    214 exit $RET</pre>

     |

    * * *

    在使用**rcp**, **rsync**, 还有另外一些有安全问题的类似工具的时候, 一定要小心, 因为将这些工具用在shell脚本中是不明智的. 你应该考虑使用**ssh**, **scp**, 或者**expect**脚本来代替这些不安全的工具.

*   **ssh**
*   <tt class="REPLACEABLE">_安全shell_</tt>, 登陆远端主机并在其上运行命令. 这个工具具有身份认证和加密的功能, 可以安全的替换**telnet**, **rlogin**, **rcp**, 和**rsh**等工具. 请参考这个工具的_man页_来获取详细信息.

    * * *

    **例子 12-40\. 使用ssh**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # remote.bash: 使用ssh. 
      3 
      4 # 这个例子是Michael Zick编写的. 
      5 # 授权在本书中使用. 
      6 
      7 
      8 #   假设的一些前提:
      9 #   ---------------
     10 #   fd-2(文件描述符2)的内容并没有被丢弃( '2>/dev/null' ).
     11 #   ssh/sshd假设stderr ('2')将会显示给用户. 
     12 #
     13 #   假设sshd正运行在你的机器上. 
     14 #   对于绝大多数'标准'的发行版, 都是有sshd的, 
     15 #+  并且没有稀奇古怪的ssh-keygen. 
     16 
     17 # 在你的机器上从命令行中试着运行一下ssh:
     18 #
     19 # $ ssh $HOSTNAME
     20 # 不需要特别的设置, 也会要求你输入密码. 
     21 #   接下来输入密码, 
     22 #   完成后, $ exit
     23 #
     24 # 能够正常运行么? 如果正常的话, 接下来你可以获得更多的乐趣了. 
     25 
     26 # 尝试在你的机器上以'root'身份来运行ssh:
     27 #
     28 #   $  ssh -l root $HOSTNAME
     29 #   当要求询问密码时, 输入root的密码, 注意别输入你的用户密码. 
     30 #          Last login: Tue Aug 10 20:25:49 2004 from localhost.localdomain
     31 #   完成后键入'exit'.
     32 
     33 #  上边的动作将会带给你一个交互的shell. 
     34 #  也可以在'single command'模式下建立sshd, 
     35 #+ 但是这已经超出本例所讲解的范围了. 
     36 #  唯一需要注意的是, 下面的命令都可以运行在
     37 #+ 'single command'模式下.
     38 
     39 
     40 # 基本的, 写stdout(本地)命令.
     41 
     42 ls -l
     43 
     44 # 这样远端机器上就会执行相同的命令. 
     45 # 如果你想的话, 可以传递不同的'USERNAME'和'HOSTNAME': 
     46 USER=${USERNAME:-$(whoami)}
     47 HOST=${HOSTNAME:-$(hostname)}
     48 
     49 #  现在, 在远端主机上执行上边的命令, 
     50 #+ 当然, 所有的传输都会被加密.
     51 
     52 ssh -l ${USER} ${HOST} " ls -l "
     53 
     54 #  期望的结果就是在远端主机上列出
     55 #+ 你的用户名所拥有的主目录下的所有文件. 
     56 #  如果想看点不一样的东西, 
     57 #+ 那就在别的地方运行这个脚本, 别在你自己的主目录下运行这个脚本. 
     58 
     59 #  换句话说, Bash命令已经作为一个引用行
     60 #+ 被传递到了远端shell中, 这样远端机器就会运行它. 
     61 #  在这种情况下, sshd代表你运行了' bash -c "ls -l" '.
     62 
     63 #  如果你想不输入密码, 
     64 #+ 或者想更详细的了解相关的问题, 请参考: 
     65 #+    man ssh
     66 #+    man ssh-keygen
     67 #+    man sshd_config.
     68 
     69 exit 0</pre>

     |

    * * *

    | ![Caution](./images/caution.gif) | 

    在循环中, **ssh**可能会引起一些异常问题. 根据comp.unix上的shell文档 [Usenet post](http://groups-beta.google.com/group/comp.unix.shell/msg/dcb446b5fff7d230)所描述的内容, **ssh**继承了循环的<tt class="FILENAME">stdin</tt>. 为了解决这个问题, 请使用**ssh**的`-n`或者`-f`选项.

    感谢, Jason Bechtel, 为我们指出这个问题.

     |

*   **scp**
*   <tt class="REPLACEABLE">_安全拷贝_</tt>, 在功能上与**rcp**很相似, 就是在两个不同的网络主机之间拷贝文件, 但是要使用鉴权的方式, 并且要使用与**ssh**类似的安全层.

**本地网络**

*   **write**
*   这是一个端到端通讯的工具. 这个工具可以从你的终端上(console或者_xterm_)发送整行数据到另一个用户的终端上. [mesg](system.md#MESGREF)命令当然也可以用来禁用对于一个终端的写权限.

    因为**write**命令是需要交互的, 所以这个命令在脚本中很少使用.

*   **netconfig**
*   用来配置网络适配器(使用DHCP)的命令行工具. 这个命令对于红帽发行版来说是内置的.

**Mail**

*   **mail**
*   发送或者读取e-mail消息.

    如果把这个命令行的mail客户端当成一个脚本中的命令来使用的话, 效果非常好.

    * * *

    **例子 12-41\. 一个mail自身的脚本**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/sh
      2 # self-mailer.sh: mail自身的脚本. 
      3 
      4 adr=${1:-`whoami`}     # 如果没有指定的话, 默认是当前用户.
      5 #  键入'self-mailer.sh wiseguy@superdupergenius.com'
      6 #+ 将脚本发送到这个地址. 
      7 #  如果只键入'self-mailer.sh'(不给参数)的话, 
      8 #+ 那么这个脚本就会被发送给调用者, 比如, 比如, bozo@localhost.localdomain.
      9 #
     10 #  如果想了解${parameter:-default}结构的更多细节, 
     11 #+ 请参考"变量重游"那章中的
     12 #+ "参数替换"小节. 
     13 
     14 # ============================================================================
     15   cat $0 | mail -s "Script \"`basename $0`\" has mailed itself to you." "$adr"
     16 # ============================================================================
     17 
     18 # --------------------------------------------
     19 #  来自self-mailing脚本的一份祝福. 
     20 #  一个喜欢恶搞的家伙运行了这个脚本, 
     21 #+ 这导致了他自己收到了这份mail. 
     22 #  显然的, 有些人确实没什么事好做, 
     23 #+ 就只能浪费他们自己的时间玩了. 
     24 # --------------------------------------------
     25 
     26 echo "At `date`, script \"`basename $0`\" mailed to "$adr"."
     27 
     28 exit 0</pre>

     |

    * * *

*   **mailto**
*   与**mail**命令很相似, **mailto**可以使用命令行或在脚本中发送e-mail消息. 而且**mailto**也可以发送MIME(多媒体)消息.

*   **vacation**
*   这个工具可以自动回复e-mail给发送者, 表示邮件的接受者正在度假暂时无法收到邮件. 这个工具与**sendmail**一起运行于网络上, 并且这个工具不支持拨号的POPmail帐号.

### 注意事项

| [[1]](communications.md#AEN9898) | 

一个_幽灵进程_指的是并未附加在终端会话中的后台进程. 幽灵进程在指定的时间执行指定的服务, 或者由特定的事件触发来执行指定的服务.

希腊文中的<span class="QUOTE">"daemon"</span>意思是幽灵, 这个词充满了神秘感和神奇的力量, 在UNIX中幽灵进程总是在后台默默地执行着分配给它们的任务.

 |