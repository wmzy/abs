# Appendix H. 重要的系统目录

每位系统管理员或者是编写系统管理脚本的人员都应该对这些系统目录非常熟悉.

*   <tt class="FILENAME">/bin</tt>

    二进制(可执行文件). 基本的系统程序和工具(比如**bash**).

*   <tt class="FILENAME">/usr/bin</tt> [[1]](#FTN.AEN18484)

    更多的系统二进制可执行文件.

*   <tt class="FILENAME">/usr/local/bin</tt>

    一些局部于特定机器的杂项二进制可执行文件.

*   <tt class="FILENAME">/sbin</tt>

    系统二进制可执行文件. 基本的系统管理程序和工具(比如**fsck**).

*   <tt class="FILENAME">/usr/sbin</tt>

    更多的系统管理程序和工具.

*   <tt class="FILENAME">/etc</tt>

    _其他_. 系统范围的配置脚本.

    其中比较有趣的文件是<tt class="FILENAME">/etc/fstab</tt>(文件系统表), <tt class="FILENAME">/etc/mtab</tt>(挂载文件系统表), 还有文件[/etc/inittab](system.md#INITTABREF).

*   <tt class="FILENAME">/etc/rc.d</tt>

    启动脚本, 适用于红帽及其派生的Linux发行版.

*   <tt class="FILENAME">/usr/share/doc</tt>

    安装包的文档.

*   <tt class="FILENAME">/usr/man</tt>

    系统范围的man页.

*   <tt class="FILENAME">/dev</tt>

    设备目录. 物理设备和虚拟设备的入口(但_不是_挂载点). 请参考 [27](devproc.md).

*   <tt class="FILENAME">/proc</tt>

    进程目录. 包含关于运行进程和内核参数的统计信息与其他信息. 请参考 [27](devproc.md).

*   <tt class="FILENAME">/sys</tt>

    系统范围的设备目录. 包含关于设备和设备名称的统计信息与其他信息. 这是在Linux 2.6.X内核版本上新添加的目录.

*   <tt class="FILENAME">/mnt</tt>

    _挂载_. 挂载硬驱动分区的目录, 比如<tt class="FILENAME">/mnt/dos</tt>, 和物理驱动器. 在比较新的Linux发行版中, <tt class="FILENAME">/media</tt>目录已经成为了I/O设备的首选挂载点.

*   <tt class="FILENAME">/media</tt>

    在比较新的Linux发行版中, I/O设备的首选挂载点, 比如CD ROM或USB flash驱动器.

*   <tt class="FILENAME">/var</tt>

    _可变的_(可修改的)系统文件. 这是一个包罗万象的<span class="QUOTE">"杂项"</span>目录, 用于保存Linux/UNIX机器运行时产生的各种数据.

*   <tt class="FILENAME">/var/log</tt>

    系统范围的日志文件.

*   <tt class="FILENAME">/var/spool/mail</tt>

    用户的假脱机邮件(mail spool).

*   <tt class="FILENAME">/lib</tt>

    系统范围的库文件.

*   <tt class="FILENAME">/usr/lib</tt>

    更多系统范围的库文件.

*   <tt class="FILENAME">/tmp</tt>

    系统临时文件.

*   <tt class="FILENAME">/boot</tt>

    系统_引导_目录. 内核, 模块链接, 系统镜像, 和引导管理器都放在这.

    | ![Warning](./images/warning.gif) | 

    如果在这个目录下修改文件, 可能会导致系统不能启动.

     |

### 注意事项

| [[1]](systemdirs.md#AEN18484) | 

早期的UNIX系统一般都有两个磁盘设备, 一个是速度快但容量小的硬盘(主要包含<tt class="FILENAME">/</tt>, 即根目录), 另一个磁盘容量大, 但是速度慢(主要包含<tt class="FILENAME">/usr</tt>目录和其他分区). 所以, 使用频率最高的程序和工具都放到小而快的磁盘中, 也就是放到<tt class="FILENAME">/bin</tt>中, 而其他的东西都放到慢磁盘上, 即<tt class="FILENAME">/usr/bin</tt>中.

其他的类似的东西也是按照这种方式进行分类的, 比如<tt class="FILENAME">/sbin</tt>和<tt class="FILENAME">/usr/sbin</tt>, <tt class="FILENAME">/lib</tt>和<tt class="FILENAME">/usr/lib</tt>, 等等.

 |