# 32.1\. 非官方的Shell脚本编写风格

*   习惯性的注释你的代码. 这可以让别人更容易看懂(或者感激)你的代码(译者注: 犯错时, 别人也会靠注释找到你), 而且也更便于维护.

    | 

    <pre class="PROGRAMLISTING">  1 PASS="$PASS${MATRIX:$(($RANDOM%${#MATRIX})):1}"
      2 # 去年你写下这段代码的时候, 你非常了解这段代码的含义, 但现在它对你来说完全是个谜. 
      3 # (摘自Antek Sawicki的"pw.sh"脚本.)</pre>

     |

    给脚本和函数加上描述性的头信息.

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 #************************************************#
      4 #                   xyz.sh                       #
      5 #           written by Bozo Bozeman              #
      6 #                July 05, 2001                   #
      7 #                                                #
      8 #           Clean up project files.              #
      9 #************************************************#
     10 
     11 E_BADDIR=65                       # 没有这个目录. 
     12 projectdir=/home/bozo/projects    # 想要清除的目录. 
     13 
     14 # --------------------------------------------------------- #
     15 # cleanup_pfiles ()                                         #
     16 # 删除指定目录中的所有文件.                                 #
     17 # Parameter: $target_directory                              #
     18 # 返回值: 0表示成功, 失败返回$E_BADDIR.                     #
     19 # --------------------------------------------------------- #
     20 cleanup_pfiles ()
     21 {
     22   if [ ! -d "$1" ]  # Test if target directory exists.
     23   then
     24     echo "$1 is not a directory."
     25     return $E_BADDIR
     26   fi
     27 
     28   rm -f "$1"/*
     29   return 0   # Success.
     30 }  
     31 
     32 cleanup_pfiles $projectdir
     33 
     34 exit 0</pre>

     |

    在脚本开头添加任何注释之前, 一定要确保_#!/bin/bash_放在脚本第一行的开头.
*   避免使用<span class="QUOTE">"魔法数字"</span>, [[1]](#FTN.AEN15556) 也就是, 避免<span class="QUOTE">"写死的"</span>字符常量. 可以使用有意义的变量名来代替. 这使得脚本更易于理解, 并且允许在不破坏应用的情况下进行修改和更新.

    | 

    <pre class="PROGRAMLISTING">  1 if [ -f /var/log/messages ]
      2 then
      3   ...
      4 fi
      5 # 一年以后, 你决定修改这个脚本, 让它来检查/var/log/syslog. 
      6 # 到时候你就必须一行一行的手动修改这个脚本, 
      7 # 并且寄希望于没有遗漏的地方. 
      8 
      9 # 更好的办法是: 
     10 LOGFILE=/var/log/messages  # 只需要改动一行就行了. 
     11 if [ -f "$LOGFILE" ]
     12 then
     13   ...
     14 fi</pre>

     |

*   给变量和函数起一些有意义的名字.

    | 

    <pre class="PROGRAMLISTING">  1 fl=`ls -al $dirname`                 # 含义模糊. 
      2 file_listing=`ls -al $dirname`       # 更好的名字. 
      3 
      4 
      5 MAXVAL=10   # 使用变量来代替脚本常量, 并且在脚本中都是用这个变量. 
      6 while [ "$index" -le "$MAXVAL" ]
      7 ...
      8 
      9 
     10 E_NOTFOUND=75                        #  错误码使用大写, 
     11                                      #+ 并且命名的时候用"E_"作为前缀. 
     12 if [ ! -e "$filename" ]
     13 then
     14   echo "File $filename not found."
     15   exit $E_NOTFOUND
     16 fi  
     17 
     18 
     19 MAIL_DIRECTORY=/var/spool/mail/bozo  # 环境变量名使用大写. 
     20 export MAIL_DIRECTORY
     21 
     22 
     23 GetAnswer ()                         # 函数名采用大小写混合的方式. 
     24 {
     25   prompt=$1
     26   echo -n $prompt
     27   read answer
     28   return $answer
     29 }  
     30 
     31 GetAnswer "What is your favorite number? "
     32 favorite_number=$?
     33 echo $favorite_number
     34 
     35 
     36 _uservariable=23                     # 语法上可以这么起名, 但是不推荐. 
     37 # 用户定义的变量名最好不要以下划线开头. 
     38 # 因为以下划线开头的变量, 一般都保留, 作为系统变量. </pre>

     |

*   [退出码](exit-status.md#EXITCOMMANDREF)最好也采用具有系统性的或有意义的命名方式.

    | 

    <pre class="PROGRAMLISTING">  1 E_WRONG_ARGS=65
      2 ...
      3 ...
      4 exit $E_WRONG_ARGS</pre>

     |

    也请参考[Appendix D](exitcodes.md).

    _最后_, 我们建议采用<tt class="FILENAME">/usr/include/sysexits.h</tt>中的定义作为退出码, 虽然这些定义主要用于C/C++编程语言.

*   在脚本调用中使用标准化的参数标志. _最后_, 我们建议使用下面的参数集.

    | 

    <pre class="PROGRAMLISTING">  1 -a      全部: 返回全部信息(包括隐藏的文件信息). 
      2 -b      摘要: 缩减版本, 通常用于其它版本. 通常用于其它脚本. 
      3 -c      拷贝, 连接, 等等.
      4 -d      日常的: 使用全天的信息, 
      5         而不仅仅是特定用户或特定实例的信息. 
      6 -e      扩展/详细描述: (通常不包括隐藏文件信息). 
      7 -h      帮助: 详细的使用方法, 附加信息, 讨论, 帮助.
      8         也请参考-V.
      9 -l      打印出脚本的输出记录. 
     10 -m      手册: 显示基本命令的man页. 
     11 -n      数字: 仅使用数字数据. 
     12 -r      递归: 这个目录中所有的文件(也包含所有子目录). 
     13 -s      安装&文件维护: 这个脚本的配置文件. 
     14 -u      用法: 列出脚本的调用方法. 
     15 -v      详细信息: 只读输出, 或多或少的会做一些格式化. 
     16 -V      版本/许可/版权Copy(right|left)/捐助(邮件列表). </pre>

     |

    也请参考[Section F.1](standard-options.md).

*   将一个复杂脚本分割成一些简单的模块. 使用合适的函数来实现模块的功能. 请参考[例子 34-4](bashver2.md#EX79).

*   如果有更简单的结构可以使用的话, 就不要使用复杂的结构.

    | 

    <pre class="PROGRAMLISTING">  1 COMMAND
      2 if [ $? -eq 0 ]
      3 ...
      4 # 多余, 而且不好理解. 
      5 
      6 if COMMAND
      7 ...
      8 # 更简练(可能会损失一些可读性). </pre>

     |

 _... 当我阅读UNIX中Bourne shell (/bin/sh)部分的源代码时. 我被震惊了, 有多少简单的算法被恶心的编码风格弄得令人看不懂, 并且因此变得没用. 我问我自己, "有人会对这种代码感到骄傲和自豪么?"_ |
 _Landon Noll_ |

### 注意事项

| [[1]](unofficialst.md#AEN15556) | 

在这种上下文中所说的<span class="QUOTE">"魔法数字"</span>与用来指明文件类型的[魔法数字](sha-bang.md#MAGNUMREF), 在含义上完全不同.

 |