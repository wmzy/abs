# 12.5\. 文件与归档命令

**归档命令**

*   **tar**
*   标准的UNIX归档工具. [[1]](#FTN.AEN8734) 起初这只是一个_磁带归档_程序, 而现在这个工具已经被开发为通用打包程序, 它能够处理所有设备的所有类型的归档文件, 包括磁带设备, 正常文件, 甚至是<tt class="FILENAME">stdout</tt>(请参考[例子 3-4](special-chars.md#EX58)). GNU的tar工具现在可以接受不同种类的压缩过滤器, 比如**tar czvf archive_name.tar.gz ***, 并且可以递归的处理归档文件, 还可以用[gzips](filearchiv.md#GZIPREF)压缩目录下的所有文件, 除了当前目录下(**$PWD**)的[点文件](basic.md#DOTFILESREF). [[2]](#FTN.AEN8744)

    一些有用的**tar**命令选项:

    1.  `-c` 创建(一个新的归档文件)

    2.  `-x` 解压文件(从存在的归档文件中)

    3.  `--delete` 删除文件(从存在的归档文件中)

        | ![Caution](./images/caution.gif) | 

        这个选项不能用于磁带类型设备.

         |

    4.  `-r` 将文件添加到现存的归档文件的尾部

    5.  `-A` 将_tar_文件添加到现存的归档文件的尾部

    6.  `-t` 列出现存的归档文件中包含的内容

    7.  `-u` 更新归档文件

    8.  `-d` 使用指定的文件系统, 比较归档文件

    9.  `-z` 用[gzip](filearchiv.md#GZIPREF)压缩归档文件

        (压缩还是解压, 依赖于是否组合了`-c`或`-x`)选项

    10.  `-j` 用[bzip2](filearchiv.md#BZIPREF)压缩归档文件

    | ![Caution](./images/caution.gif) | 

    如果想从损坏的用_gzipped_压缩过的tar文件中取得数据, 那将是非常困难的. 所以当我们归档重要的文件的时候, 一定要保留多个备份.

     |

*   **shar**
*   Shell归档工具. 存在于shell归档文件中的所有文件都是未经压缩的, 并且本质上是一个shell脚本, 以<span class="TOKEN">#!/bin/sh</span>开头, 并且包含所有必要的解档命令. _Shar 归档文件_至今还在Internet新闻组中使用, 否则的话, **shar**早就被**tar**/**gzip**所取代了. **unshar**命令用来解档_shar_归档文件.

*   **ar**
*   创建和操作归档文件的工具, 主要在对二进制目标文件打包成库时才会用到.

*   **rpm**
*   _Red Hat包管理器_, 或者说**rpm**工具提供了一种对源文件或二进制文件进行打包的方法. 除此之外, 它还包括安装命令, 并且还检查包的完整性.

    一个简单的**rpm -i package_name.rpm**命令对于安装一个包来说就足够了, 虽然这个命令还有好多其它的选项.

    | ![Tip](./images/tip.gif) | 

    <kbd class="USERINPUT">rpm -qf</kbd> 列出一个文件属于那个包.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">rpm -qf /bin/ls</kbd>
    <samp class="COMPUTEROUTPUT">coreutils-5.2.1-31</samp>
    	      </pre>

     |

     |

    | ![Tip](./images/tip.gif) | 

    <kbd class="USERINPUT">rpm -qa</kbd>将会列出给定系统上所有安装了的 _rpm_包. <kbd class="USERINPUT">rpm -qa package_name</kbd>命令将会列出与给定名字<tt class="FILENAME">package_name</tt>相匹配的包.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">rpm -qa</kbd>
    <samp class="COMPUTEROUTPUT">redhat-logos-1.1.3-1
     glibc-2.2.4-13
     cracklib-2.7-12
     dosfstools-2.7-1
     gdbm-1.8.0-10
     ksymoops-2.4.1-1
     mktemp-1.5-11
     perl-5.6.0-17
     reiserfs-utils-3.x.0j-2
     ...</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">rpm -qa docbook-utils</kbd>
    <samp class="COMPUTEROUTPUT">docbook-utils-0.6.9-2</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">rpm -qa docbook | grep docbook</kbd>
    <samp class="COMPUTEROUTPUT">docbook-dtd31-sgml-1.0-10
     docbook-style-dsssl-1.64-3
     docbook-dtd30-sgml-1.0-10
     docbook-dtd40-sgml-1.0-11
     docbook-utils-pdf-0.6.9-2
     docbook-dtd41-sgml-1.0-10
     docbook-utils-0.6.9-2</samp>
    	      </pre>

     |

     |

*   **cpio**
*   这个特殊的归档拷贝命令(拷贝输入和输出, **c**o**p**y **i**nput and **o**utput)现在已经很少能见到了, 因为它已经被**tar**/**gzip**所替代了. 现在这个命令只在一些比较特殊的地方还在使用, 比如拷贝一个目录树. 如果指定一个合适尺寸的块(用于拷贝), 那么这个命令会比**tar**命令快一些.

    * * *

    **例子 12-27\. 使用**cpio**来拷贝一个目录树**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 # 使用cpio来拷贝目录树.
      4 
      5 # 使用'cpio'的优点: 
      6 #   加速拷贝. 比通过管道使用'tar'命令快一些.
      7 #   很适合拷贝一些'cp'命令
      8 #+  搞不定的的特殊文件(比如名字叫pipes的文件, 等等)
      9 
     10 ARGS=2
     11 E_BADARGS=65
     12 
     13 if [ $# -ne "$ARGS" ]
     14 then
     15   echo "Usage: `basename $0` source destination"
     16   exit $E_BADARGS
     17 fi  
     18 
     19 source=$1
     20 destination=$2
     21 
     22 
     23 find "$source" -depth | cpio -admvp "$destination"
     24 #               ^^^^^         ^^^^^
     25 # 阅读'find'和'cpio'的man页来了解这些选项的意义. 
     26                                                          
     27                                                          
     28 # 练习:
     29 # -----
     30                                                          
     31 #  添加一些代码来检查'find | cpio'管道命令的退出码($?)
     32 #+ 并且如果出现错误的时候输出合适的错误码. 
     33 
     34 exit 0</pre>

     |

    * * *

*   **rpm2cpio**
*   这个命令可以从[rpm](filearchiv.md#RPMREF)归档文件中解出一个**cpio**归档文件.

    * * *

    **例子 12-28\. 解包一个_rpm_归档文件**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # de-rpm.sh: 解包一个'rpm'归档文件
      3 
      4 : ${1?"Usage: `basename $0` target-file"}
      5 # 必须指定'rpm'归档文件名作为参数. 
      6 
      7 
      8 TEMPFILE=$.cpio                         # Tempfile必须是一个"唯一"的名字.
      9                                          # $是这个脚本的进程ID.
     10                                                                                  
     11 rpm2cpio < $1 > $TEMPFILE                # 将rpm归档文件转换为cpio归档文件.
     12 cpio --make-directories -F $TEMPFILE -i  # 解包cpio归档文件.
     13 rm -f $TEMPFILE                          # 删除cpio归档文件.
     14 
     15 exit 0
     16 
     17 #  练习:
     18 #  添加一些代码来检查    1) "target-file"是否存在
     19 #+                       2) 这个文件是否是一个rpm归档文件.
     20 #  暗示:                    分析'file'命令的输出.</pre>

     |

    * * *

**压缩命令**

*   **gzip**
*   标准的GNU/UNIX压缩工具, 取代了比较差的**compress**命令. 相应的解压命令是**gunzip**, 与**gzip -d**是等价的.

    | ![Note](./images/note.gif) | 

    `-c`选项将会把**gzip**的输出打印到<tt class="FILENAME">stdout</tt>上. 当你想通过[管道](special-chars.md#PIPEREF)传递到其他命令的时候, 这就非常有用了.

     |

    **zcat**过滤器可以将一个_gzip_文件解压到<tt class="FILENAME">stdout</tt>, 所以尽可能的使用管道和重定向. 这个命令事实上就是一个可以工作于压缩文件(包括一些的使用老的**compress**工具压缩的文件)的**cat**命令. **zcat**命令等价于**gzip -dc**.

    | ![Caution](./images/caution.gif) | 

    在某些商业的UNIX系统上, **zcat**与**uncompress -c**等价, 并且不能工作于_gzip_文件.

     |

    请参考[例子 7-7](comparison-ops.md#EX14).

*   **bzip2**
*   用来压缩的一个可选的工具, 通常比**gzip**命令压缩率更高(所以更慢), 适用于比较大的文件. 相应的解压命令是**bunzip2**.

    | ![Note](./images/note.gif) | 

    新版本的[tar](filearchiv.md#TARREF)命令已经直接支持**bzip2**了.

     |

*   **compress**, **uncompress**
*   这是一个老的, 私有的压缩工具, 一般的商业UNIX发行版都会有这个工具. 更有效率的**gzip**工具早就把这个工具替换掉了. Linux发行版一般也会包含一个兼容的**compress**命令, 虽然**gunzip**也可以解压用**compress**工具压缩的文件.

    | ![Tip](./images/tip.gif) | 

    **znew**命令可以将_compress_压缩的文件转换为_gzip_压缩的文件.

     |

*   **sq**
*   另一种压缩工具, 一个只能工作于排过序的ASCII单词列表的过滤器. 这个命令使用过滤器标准的调用语法, **sq < input-file > output-file**. 速度很快, 但是效率远不及[gzip](filearchiv.md#GZIPREF). 相应的解压命令为**unsq**, 调用方法与**sq**相同.

    | ![Tip](./images/tip.gif) | 

    **sq**的输出可以通过管道传递给**gzip**, 以便于进一步的压缩.

     |

*   **zip**, **unzip**
*   跨平台的文件归档和压缩工具, 与DOS下的_pkzip.exe_兼容. <span class="QUOTE">"Zip"</span>归档文件看起来在互联网上比<span class="QUOTE">"tar包"</span>更流行.

*   **unarc**, **unarj**, **unrar**
*   这些Linux工具可以用来解档那些用DOS下的_arc.exe_, _arj.exe_, 和_rar.exe_ 程序进行归档的文件.

**文件信息**

*   **file**
*   确定文件类型的工具. 命令<kbd class="USERINPUT">file file-name</kbd>将会用<samp class="COMPUTEROUTPUT">ascii文本</samp>或<samp class="COMPUTEROUTPUT">数据</samp>的形式返回<tt class="FILENAME">file-name</tt>文件的详细描述. 这个命令会使用<tt class="FILENAME">/usr/share/magic</tt>, <tt class="FILENAME">/etc/magic</tt>, 或<tt class="FILENAME">/usr/lib/magic</tt>中定义的[魔法数字](sha-bang.md#MAGNUMREF)来标识包含某种魔法数字的文件, 上边所举出的这3个文件需要依赖于具体的 Linux/UNIX 发行版.

    `-f`选项将会让**file**命令运行于批处理模式, 也就是说它会分析`-f`后边所指定的文件, 从中读取需要处理的文件列表, 然后依次执行**file**命令. `-z`选项, 当对压缩过的目标文件使用时, 将会强制分析压缩的文件类型.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">file test.tar.gz</kbd>
    <samp class="COMPUTEROUTPUT">test.tar.gz: gzip compressed data, deflated, last modified: Sun Sep 16 13:34:51 2001, os: Unix</samp>

    <samp class="PROMPT">bash</samp> <kbd class="USERINPUT">file -z test.tar.gz</kbd>
    <samp class="COMPUTEROUTPUT">test.tar.gz: GNU tar archive (gzip compressed data, deflated, last modified: Sun Sep 16 13:34:51 2001, os: Unix)</samp>
    	      </pre>

     |

    | 

    <pre class="PROGRAMLISTING">  1 # 在给定的目录中找出sh和Bash脚本文件:
      2 
      3 DIRECTORY=/usr/local/bin
      4 KEYWORD=Bourne
      5 # Bourne和Bourne-Again shell脚本
      6 
      7 file $DIRECTORY/* | fgrep $KEYWORD
      8 
      9 # 输出:
     10 
     11 # /usr/local/bin/burn-cd:          Bourne-Again shell script text executable
     12 # /usr/local/bin/burnit:           Bourne-Again shell script text executable
     13 # /usr/local/bin/cassette.sh:      Bourne shell script text executable
     14 # /usr/local/bin/copy-cd:          Bourne-Again shell script text executable
     15 # . . .</pre>

     |

    * * *

    **例子 12-29\. 从C文件中去掉注释**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # strip-comment.sh: 去掉C程序中的注释(/* 注释 */). 
      3 
      4 E_NOARGS=0
      5 E_ARGERROR=66
      6 E_WRONG_FILE_TYPE=67
      7 
      8 if [ $# -eq "$E_NOARGS" ]
      9 then
     10   echo "Usage: `basename $0` C-program-file" >&2 # 将错误消息发到stderr.
     11   exit $E_ARGERROR
     12 fi  
     13 
     14 # 检查文件类型是否正确. 
     15 type=`file $1 | awk '{ print $2, $3, $4, $5 }'`
     16 # "file $1" echo出文件类型 . . .
     17 # 然后awk会删掉第一个域, 就是文件名 . . .
     18 # 然后结果将会传递到变量"type"中.
     19 correct_type="ASCII C program text"
     20 
     21 if [ "$type" != "$correct_type" ]
     22 then
     23   echo
     24   echo "This script works on C program files only."
     25   echo
     26   exit $E_WRONG_FILE_TYPE
     27 fi  
     28 
     29 
     30 # 相当隐秘的sed脚本:
     31 #--------
     32 sed '
     33 /^\/\*/d
     34 /.*\*\//d
     35 ' $1
     36 #--------
     37 # 如果你花上几个小时来学习sed语法的话, 上边这个命令还是很好理解的.
     38                                                                      
     39                                                                      
     40 #  如果注释和代码在同一行上, 上边的脚本就不行了.
     41 #+ 所以需要添加一些代码来处理这种情况.
     42 #  这是一个很重要的练习.
     43                                                                      
     44 #  当然, 上边的代码也会删除带有"*/"的非注释行 --
     45 #+ 这也不是一个令人满意的结果.
     46 
     47 exit 0
     48 
     49 
     50 # ----------------------------------------------------------------
     51 # 下边的代码不会执行, 因为上边已经'exit 0'了.
     52                                                 
     53 # Stephane Chazelas建议使用下边的方法:
     54 
     55 usage() {
     56   echo "Usage: `basename $0` C-program-file" >&2
     57   exit 1
     58 }
     59 
     60 WEIRD=`echo -n -e '\377'`   # 或者WEIRD=/pre>\377'
     61 [[ $# -eq 1 ]] || usage
     62 case `file "$1"` in
     63   *"C program text"*) sed -e "s%/\*%${WEIRD}%g;s%\*/%${WEIRD}%g" "$1" \
     64      | tr '\377\n' '\n\377' \
     65      | sed -ne 'p;n' \
     66      | tr -d '\n' | tr '\377' '\n';;
     67   *) usage;;
     68 esac
     69 
     70 #  如果是下列的这些情况, 还是很糟糕:
     71 #  printf("/*");
     72 #  或者
     73 #  /*  /* buggy embedded comment */
     74 #                                                                
     75 #  为了处理上边所有这些特殊情况(字符串中的注释, 含有 \", \\" ...
     76 #+ 的字符串中的注释)唯一的方法还是写一个C分析器
     77 #+ (或许可以使用lex或者yacc?).
     78 
     79 exit 0</pre>

     |

    * * *

*   **which**
*   **which command-xxx**将会给出<span class="QUOTE">"command-xxx"</span>的完整路径. 当你想在系统中准确定位一个特定的命令或工具的时候, 这个命令就非常有用了.

    <kbd class="USERINPUT">$bash which rm</kbd>

    | 

    <pre class="SCREEN"><samp class="COMPUTEROUTPUT">/usr/bin/rm</samp></pre>

     |

*   **whereis**
*   与上边的**which**很相似, **whereis command-xxx**不只会给出<span class="QUOTE">"command-xxx"</span>的完整路径, 而且还会给出这个命令的_man页_的完整路径.

    <kbd class="USERINPUT">$bash whereis rm</kbd>

    | 

    <pre class="SCREEN"><samp class="COMPUTEROUTPUT">rm: /bin/rm /usr/share/man/man1/rm.1.bz2</samp></pre>

     |

*   **whatis**
*   **whatis filexxx**将会在<tt class="REPLACEABLE">_whatis_</tt>数据库中查询<span class="QUOTE">"filexxx"</span>. 当你想确认系统命令和重要的配置文件的时候, 这个命令就非常重要了. 可以把这个命令认为是一个简单的**man**命令.

    <kbd class="USERINPUT">$bash whatis whatis</kbd>

    | 

    <pre class="SCREEN"><samp class="COMPUTEROUTPUT">whatis               (1)  - search the whatis database for complete words</samp></pre>

     |

    * * *

    **例子 12-30\. **浏览<tt class="FILENAME">/usr/X11R6/bin</tt>****

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 # 所有在/usr/X11R6/bin中的神秘2进制文件都是些什么东西?
      4 
      5 DIRECTORY="/usr/X11R6/bin"
      6 # 也试试 "/bin", "/usr/bin", "/usr/local/bin", 等等.
      7 
      8 for file in $DIRECTORY/*
      9 do
     10   whatis `basename $file`   # 将会echo出这个2进制文件的信息.
     11 done
     12 
     13 exit 0
     14 
     15 # 你可能希望将这个脚本的输出重定向, 像这样:
     16 # ./what.sh >>whatis.db
     17 # 或者一页一页的在stdout上察看,
     18 # ./what.sh | less</pre>

     |

    * * *

    请参考[例子 10-3](loops1.md#FILEINFO).

*   **vdir**
*   显示详细的目录列表. 与[ls -l](basic.md#LSREF)的效果相似.

    这是一个GNU _fileutils_.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">vdir</kbd>
    <samp class="COMPUTEROUTPUT">total 10
     -rw-r--r--    1 bozo  bozo      4034 Jul 18 22:04 data1.xrolo
     -rw-r--r--    1 bozo  bozo      4602 May 25 13:58 data1.xrolo.bak
     -rw-r--r--    1 bozo  bozo       877 Dec 17  2000 employment.xrolo</samp>

    <samp class="PROMPT">bash</samp> <kbd class="USERINPUT">ls -l</kbd>
    <samp class="COMPUTEROUTPUT">total 10
     -rw-r--r--    1 bozo  bozo      4034 Jul 18 22:04 data1.xrolo
     -rw-r--r--    1 bozo  bozo      4602 May 25 13:58 data1.xrolo.bak
     -rw-r--r--    1 bozo  bozo       877 Dec 17  2000 employment.xrolo</samp>
    	      </pre>

     |

*   **locate**, **slocate**
*   **locate**命令将会在预先建立好的档案数据库中查询文件. **slocate**命令是**locate**的安全版本(**locate**命令很有可能已经被关联到**slocate**命令上了).

    <kbd class="USERINPUT">$bash locate hickson</kbd>

    | 

    <pre class="SCREEN"><samp class="COMPUTEROUTPUT">/usr/lib/xephem/catalogs/hickson.edb</samp></pre>

     |

*   **readlink**
*   显示符号链接所指向的文件.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">readlink /usr/bin/awk</kbd>
    <samp class="COMPUTEROUTPUT">../../bin/gawk</samp>
    	      </pre>

     |

*   **strings**
*   使用**strings**命令在二进制或数据文件中找出可打印字符. 它将在目标文件中列出所有找到的可打印字符的序列. 这个命令对于想进行快速查找n个字符的打印检查来说是很方便的, 也可以用来检查一个未知格式的图片文件(<kbd class="USERINPUT">strings image-file | more</kbd>可能会搜索出像<samp class="COMPUTEROUTPUT">JFIF</samp>这样的字符串, 那么这就意味着这个文件是一个_jpeg_格式的图片文件). 在脚本中, 你可能会使用[grep](textproc.md#GREPREF)或者[sed](sedawk.md#SEDREF)命令来分析**strings**命令的输出. 请参考[例子 10-7](loops1.md#BINGREP)和[例子 10-9](loops1.md#FINDSTRING).

    * * *

    **例子 12-31\. 一个<span class="QUOTE">"改进过"</span>的_strings_命令**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # wstrings.sh: "word-strings" (增强的"strings"命令)
      3 #
      4 #  这个脚本将会通过排除标准单词列表的形式
      5 #+ 来过滤"strings"命令的输出. 
      6 #  这将有效的过滤掉无意义的字符, 
      7 #+ 并且只会输出可以识别的字符. 
      8 
      9 # ===========================================================
     10 #                 脚本参数的标准检查
     11 ARGS=1
     12 E_BADARGS=65
     13 E_NOFILE=66
     14 
     15 if [ $# -ne $ARGS ]
     16 then
     17   echo "Usage: `basename $0` filename"
     18   exit $E_BADARGS
     19 fi
     20 
     21 if [ ! -f "$1" ]                      # 检查文件是否存在. 
     22 then
     23     echo "File \"$1\" does not exist."
     24     exit $E_NOFILE
     25 fi
     26 # ===========================================================
     27 
     28 
     29 MINSTRLEN=3                           #  最小的字符串长度.
     30 WORDFILE=/usr/share/dict/linux.words  #  字典文件.
     31                                       #  也可以指定一个不同的
     32                                       #+ 单词列表文件,
     33                                       #+ 但这种文件必须是以每个单词一行的方式进行保存.
     34 
     35 
     36 wlist=`strings "$1" | tr A-Z a-z | tr '[:space:]' Z | \
     37 tr -cs '[:alpha:]' Z | tr -s '\173-\377' Z | tr Z ' '`
     38 
     39 #  将'strings'命令的输出通过管道传递到多个'tr'命令中.
     40 #  "tr A-Z a-z" 全部转换为小写字符.
     41 #  "tr '[:space:]'" 转换空白字符为多个Z.
     42 #  "tr -cs '[:alpha:]' Z" 将非字母表字符转换为多个Z,
     43 #+ 然后去除多个连续的Z.
     44 #  "tr -s '\173-\377' Z" 把所有z后边的字符都转换为Z.
     45 #+ 并且去除多余重复的Z. (注意173(123 ascii "{")和377(255 ascii 最后一个字符)都是8进制)
     46 #+ 这样处理之后, 我们所有之前需要处理的令我们头痛的字符
     47 #+ 就全都转换为字符Z了.
     48 #  最后"tr Z ' '" 将把所有的Z都转换为空格,
     49 #+ 这样我们在下边循环中用到的变量wlist中的内容就全部以空格分隔了.
     50 
     51 #  ****************************************************************
     52 #  注意, 我们使用管道来将多个'tr'的输出传递到下一个'tr'时 
     53 #+ 每次都使用了不同的参数. 
     54 #  ****************************************************************
     55 
     56 
     57 for word in $wlist                    # 重要:
     58                                       # $wlist 这里不能使用双引号.
     59                                       # "$wlist" 不能正常工作.
     60                                       # 为什么不行?
     61 do                                                                 
     62                                                                    
     63   strlen=${#word}                     # 字符串长度.
     64   if [ "$strlen" -lt "$MINSTRLEN" ]   # 跳过短的字符串.
     65   then                                                             
     66     continue                                                       
     67   fi                                                               
     68                                                                    
     69   grep -Fw $word "$WORDFILE"          #  只匹配整个单词.
     70 #      ^^^                            #  "固定字符串" 和
     71                                       #+ "整个单词" 选项. 
     72 
     73 done  
     74 
     75 
     76 exit $?</pre>

     |

    * * *

**Comparison**

*   **diff**, **patch**
*   **diff**: 一个非常灵活的文件比较工具. 这个工具将会以一行接一行的形式来比较目标文件. 在某些应用中, 比如说比较单词词典, 在通过管道将结果传递给**diff**命令之前, 使用诸如[sort](textproc.md#SORTREF)和**uniq**命令来对文件进行过滤将是非常有用的. <kbd class="USERINPUT">diff file-1 file-2</kbd> 将会输出两个文件中不同的行, 并会通过符号标识出每个不同行所属的文件.

    **diff**命令的`--side-by-side`选项将会按照左右分隔的形式, 把两个比较中的文件全部输出, 并且会把不同的行标记出来. `-c`和`-u`选项也会使得**diff**命令的输出变得容易解释一些.

    还有一些**diff**命令的变种, 比如**sdiff**, **wdiff**, **xdiff**, 和**mgdiff**.

    | ![Tip](./images/tip.gif) | 

    如果比较的两个文件是完全一样的话, 那么**diff**命令会返回0作为退出状态码, 如果不同的话就返回1作为退出码. 这样**diff**命令就可以用在shell脚本的测试结构中了. (见下边).

     |

    **diff**命令的一个重要用法就是产生区别文件, 这个文件将用作**patch**命令的`-e`选项的参数, `-e`选项接受**ed**或**ex**脚本.

    **patch**: 灵活的版本工具. 给出一个用**diff**命令产生的区别文件, **patch**命令可以将一个老版本的包更新为一个新版本的包. 因为你发布一个小的<span class="QUOTE">"区别"</span>文件远比重新发布一个大的软件包来的容易得多. 对于频繁更新的Linux内核来说, 使用内核<span class="QUOTE">"补丁包"</span>的形式来发布是一种非常好的办法.

    | 

    <pre class="PROGRAMLISTING">  1 patch -p1 <patch-file
      2 # 在'patch-file'中取得所有的修改列表, 
      3 # 然后把它们更新到相应的文件中. 
      4 # 那么这个包就被更新为新版本了. </pre>

     |

    更新内核:

    | 

    <pre class="PROGRAMLISTING">  1 cd /usr/src
      2 gzip -cd patchXX.gz | patch -p0
      3 # 使用'patch'来更新内核源文件.
      4 # 来自于linux内核文档"README",
      5 # 这份文档由匿名作者(Alan Cox?)所编写. </pre>

     |

    | ![Note](./images/note.gif) | 

    **diff**也可以递归的比较目录下的所有文件(包含子目录).

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">diff -r ~/notes1 ~/notes2</kbd>
    <samp class="COMPUTEROUTPUT">Only in /home/bozo/notes1: file02
     Only in /home/bozo/notes1: file03
     Only in /home/bozo/notes2: file04</samp>
    	      </pre>

     |

     |

    | ![Tip](./images/tip.gif) | 

    使用**zdiff**来比较_gzip_文件.

     |

*   **diff3**
*   这是**diff**命令的扩展版本, 可以同时比较三个文件. 如果成功执行那么这个命令就返回0, 但不幸的是这个命令不给出比较结果的信息.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">diff3 file-1 file-2 file-3</kbd>
    <samp class="COMPUTEROUTPUT">====
     1:1c
       This is line 1 of "file-1".
     2:1c
       This is line 1 of "file-2".
     3:1c
       This is line 1 of "file-3"</samp>
    	      </pre>

     |

*   **sdiff**
*   比较和(或)编辑两个文件, 将它们合并到一个输出文件中. 由于这个命令的交互特性, 所以在脚本中很少使用这个命令.

*   **cmp**
*   **cmp**命令是上边**diff**命令的一个简单版本. **diff**命令会报告两个文件的不同之处, 而**cmp**命令仅仅指出哪些位置有所不同, 不会显示不同之处的具体细节.

    | ![Note](./images/note.gif) | 

    就像**diff**命令那样, 如果两个文件相同的话, **cmp**将返回0作为退出状态码, 如果不同就返回1\. 这样能用在shell脚本的测试结构中了.

     |

    * * *

    **例子 12-32\. 在一个脚本中使用**cmp**命令来比较两个文件.**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 ARGS=2  # 脚本需要两个参数. 
      4 E_BADARGS=65
      5 E_UNREADABLE=66
      6 
      7 if [ $# -ne "$ARGS" ]
      8 then
      9   echo "Usage: `basename $0` file1 file2"
     10   exit $E_BADARGS
     11 fi
     12 
     13 if [[ ! -r "$1" || ! -r "$2" ]]
     14 then
     15   echo "Both files to be compared must exist and be readable."
     16   exit $E_UNREADABLE
     17 fi
     18 
     19 cmp $1 $2 &> /dev/null  # /dev/null将会禁止"cmp"命令的输出.
     20 #   cmp -s $1 $2 与上边这句的结果相同("-s"选项是禁止输出(silent)标志)
     21 #   感谢Anders Gustavsson指出这点.
     22 #
     23 # 使用'diff'命令也可以, 比如,   diff $1 $2 &> /dev/null
     24 
     25 if [ $? -eq 0 ]         # 测试"cmp"命令的退出状态.
     26 then
     27   echo "File \"$1\" is identical to file \"$2\"."
     28 else  
     29   echo "File \"$1\" differs from file \"$2\"."
     30 fi
     31 
     32 exit 0</pre>

     |

    * * *

    | ![Tip](./images/tip.gif) | 

    使用**zcmp**处理_gzip_文件.

     |

*   **comm**
*   多功能的文件比较工具. 使用这个命令之前必须先排序.

    **comm <tt class="REPLACEABLE">_-options_</tt> <tt class="REPLACEABLE">_first-file_</tt> <tt class="REPLACEABLE">_second-file_</tt>**

    <kbd class="USERINPUT">comm file-1 file-2</kbd> 将会输出3列:

    *   第1列 = 只在<tt class="FILENAME">file-1</tt>中存在的行

    *   第2列 = 只在<tt class="FILENAME">file-2</tt>中存在的行

    *   第3列 = 两边相同的行.

    下列选项可以禁止一列或多列的输出.

    *   `-1` 禁止显示第<tt class="LITERAL">1</tt>列 (译者: 在File1中的行)

    *   `-2` 禁止显示第<tt class="LITERAL">2</tt>列 (译者: 在File2中的行)

    *   `-3` 禁止显示第<tt class="LITERAL">3</tt>列 (译者: 在File3中的行)

    *   `-12` 禁止第<tt class="LITERAL">1</tt>列和第<tt class="LITERAL">2</tt>列, 等等. (译者: 就是说选项可以组合)

**Utilities**

*   **basename**
*   从文件名中去掉路径信息, 只打印出文件名. 结构<kbd class="USERINPUT">basename $0</kbd>可以让脚本获得它自己的名字, 也就是, 它被调用的名字. 可以用来显示<span class="QUOTE">"用法"</span>信息, 比如如果你调用脚本的时候缺少参数, 可以使用如下语句:

    | 

    <pre class="PROGRAMLISTING">  1 echo "Usage: `basename $0` arg1 arg2 ... argn"</pre>

     |

*   **dirname**
*   从带路径的文件名字符串中去掉文件名(**basename**), 只打印出路径信息.

    | ![Note](./images/note.gif) | 

    **basename**和**dirname**可以操作任意字符串. 它们的参数不一定是一个真正存在的文件, 甚至可以不是一个文件名. (请参考[例子 A-7](contributed-scripts.md#DAYSBETWEEN)).

     |

    * * *

    **例子 12-33\. **basename**和**dirname****

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 a=/home/bozo/daily-journal.txt
      4 
      5 echo "Basename of /home/bozo/daily-journal.txt = `basename $a`"
      6 echo "Dirname of /home/bozo/daily-journal.txt = `dirname $a`"
      7 echo
      8 echo "My own home is `basename ~/`."         # `basename ~` 也可以.
      9 echo "The home of my home is `dirname ~/`."  # `dirname ~`  也可以.
     10 
     11 exit 0</pre>

     |

    * * *

*   **split**, **csplit**
*   将一个文件分割为几个小段的工具. 这些命令通常会将大的文件分割, 然后备份到软盘上, 或者是为了将大文件切成合适的尺寸, 然后用email上传.

    **csplit**命令会根据_上下文_来切割文件, 切割的位置将会发生在模式匹配的地方.

*   **sum**, **cksum**, **md5sum**, **sha1sum**
*   这些都是用来产生checksum的工具. _checksum_是对文件的内容进行数学计算而得到的, 它的目的是用来检验文件的完整性, 出于安全目的一个脚本可能会有一个checksum列表, 这样可以确保关键系统文件的内容不会被修改或损坏. 对于需要安全性的应用来说, 应该使用**md5sum** (**m**essage **d**igest **5** check**sum**)命令, 或者使用更好更新的**sha1sum**命令(安全Hash算法).

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cksum /boot/vmlinuz</kbd>
    <samp class="COMPUTEROUTPUT">1670054224 804083 /boot/vmlinuz</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo -n "Top Secret" | cksum</kbd>
    <samp class="COMPUTEROUTPUT">3391003827 10</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">md5sum /boot/vmlinuz</kbd>
    <samp class="COMPUTEROUTPUT">0f43eccea8f09e0a0b2b5cf1dcf333ba  /boot/vmlinuz</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo -n "Top Secret" | md5sum</kbd>
    <samp class="COMPUTEROUTPUT">8babc97a6f62a4649716f4df8d61728f  -</samp>
    	      </pre>

     |

    | ![Note](./images/note.gif) | 

    **cksum**将会显示目标尺寸(以字节为单位), 目标可以是<tt class="FILENAME">stdout</tt>, 也可以是文件.

    **md5sum**和**sha1sum**命令在它们收到来自于<tt class="FILENAME">stdout</tt>的输入的时候, 显示一个[dash](special-chars.md#DASHREF2).

     |

    * * *

    **例子 12-34\. 检查文件完整性**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # file-integrity.sh: 检查一个给定目录下的文件
      3 #                    是否被改动了. 
      4 
      5 E_DIR_NOMATCH=70
      6 E_BAD_DBFILE=71
      7 
      8 dbfile=File_record.md5
      9 # 存储记录的文件名(数据库文件).
     10 
     11 
     12 set_up_database ()
     13 {
     14   echo ""$directory"" > "$dbfile"
     15   # 把目录名写到文件的第一行. 
     16   md5sum "$directory"/* >> "$dbfile"
     17   # 在文件中附上md5 checksum和filename. 
     18 }
     19 
     20 check_database ()
     21 {
     22   local n=0
     23   local filename
     24   local checksum
     25 
     26   # ------------------------------------------- #
     27   #  这个文件检查其实是不必要的,
     28   #+ 但是能更安全一些.
     29 
     30   if [ ! -r "$dbfile" ]
     31   then
     32     echo "Unable to read checksum database file!"
     33     exit $E_BAD_DBFILE
     34   fi
     35   # ------------------------------------------- #
     36 
     37   while read record[n]
     38   do
     39 
     40     directory_checked="${record[0]}"
     41     if [ "$directory_checked" != "$directory" ]
     42     then
     43       echo "Directories do not match up!"
     44       # 换个目录试一下. 
     45       exit $E_DIR_NOMATCH
     46     fi
     47 
     48     if [ "$n" -gt 0 ]   # 不是目录名. 
     49     then
     50       filename[n]=$( echo ${record[$n]} | awk '{ print $2 }' )
     51       #  md5sum向后写记录, 
     52       #+ 先写checksum, 然后写filename. 
     53       checksum[n]=$( md5sum "${filename[n]}" )
     54 
     55 
     56       if [ "${record[n]}" = "${checksum[n]}" ]
     57       then
     58         echo "${filename[n]} unchanged."
     59 
     60       elif [ "`basename ${filename[n]}`" != "$dbfile" ]
     61              #  跳过checksum数据库文件, 
     62              #+ 因为在每次调用脚本它都会被修改. 
     63 	     #  ---
     64 	     #  这不幸的意味着当我们在$PWD中运行这个脚本时侯, 
     65 	     #+ 篡改这个checksum数
     66 	     #+ 据库文件将不会被检测出来. 
     67 	     #  练习: 修正这个问题.
     68 	then
     69           echo "${filename[n]} : CHECKSUM ERROR!"
     70         # 从上次的检查之后, 文件已经被修改. 
     71       fi
     72 
     73       fi
     74 
     75 
     76 
     77     let "n+=1"
     78   done <"$dbfile"       # 从checksum数据库文件中读.  
     79 
     80 }  
     81 
     82 # =================================================== #
     83 # main ()
     84 
     85 if [ -z  "$1" ]
     86 then
     87   directory="$PWD"      #  如果没指定参数的话, 
     88 else                    #+ 那么就使用当前的工作目录. 
     89   directory="$1"
     90 fi  
     91 
     92 clear                   # 清屏.
     93 echo " Running file integrity check on $directory"
     94 echo
     95 
     96 # ------------------------------------------------------------------ #
     97   if [ ! -r "$dbfile" ] # 是否需要建立数据库文件? 
     98   then
     99     echo "Setting up database file, \""$directory"/"$dbfile"\"."; echo
    100     set_up_database
    101   fi  
    102 # ------------------------------------------------------------------ #
    103 
    104 check_database          # 调用主要处理函数. 
    105 
    106 echo 
    107 
    108 #  你可能想把这个脚本的输出重定向到文件中, 
    109 #+ 尤其在这个目录中有很多文件的时候. 
    110 
    111 exit 0
    112 
    113 #  如果要对数量非常多的文件做完整性检查, 
    114 #+ 可以考虑一下"Tripwire"包,
    115 #+ http://sourceforge.net/projects/tripwire/.
    116 </pre>

     |

    * * *

    请参考[例子 A-19](contributed-scripts.md#DIRECTORYINFO)和[例子 33-14](colorizing.md#HORSERACE), 这两个例子展示了**md5sum**命令的用法.

    | ![Note](./images/note.gif) | 

    到目前为止, 已经有128-bit的**md5sum**被破解的报告了, 所以现在更安全的160-bit的**sha1sum**非常受欢迎, 这个命令已经被加入到checksum工具包中了.

    一些安全顾问认为即使是**sha1sum**也是一种折衷的做法. 所以, 下一个工具是什么呢? -- 512-bit的checksum工具?

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">md5sum testfile</kbd>
    <samp class="COMPUTEROUTPUT">e181e2c8720c60522c4c4c981108e367  testfile</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">sha1sum testfile</kbd>
    <samp class="COMPUTEROUTPUT">5d7425a9c08a66c3177f1e31286fa40986ffc996  testfile</samp>
    	      </pre>

     |

     |

*   **shred**
*   用随机字符填充文件, 使得文件无法恢复, 这样就可以保证文件安全的被删除. 这个命令的效果与[例子 12-55](extmisc.md#BLOTOUT)一样, 但是使用这个命令是一种更优雅更彻底的方法.

    这是GNU的_文件工具_之一.

    | ![Caution](./images/caution.gif) | 

    即使使用了**shred**命令, 高级的辨别技术也还是能够恢复文件的内容.

     |

**编码和解码**

*   **uuencode**
*   这个工具用来把二进制文件编码成ASCII字符串, 这个工具适用于编码e-mail消息体, 或者新闻组消息.

*   **uudecode**
*   这个工具用来把uuencode后的ASCII字符串恢复为二进制文件.

    * * *

    **例子 12-35\. Uudecode编码后的文件**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 在当前目录下用Uudecode解码所有用uuencode编码的文件. 
      3 
      4 lines=35        # 允许读头部的35行(范围很宽). 
      5 
      6 for File in *   # 测试所有$PWD下的文件. 
      7 do
      8   search1=`head -$lines $File | grep begin | wc -w`
      9   search2=`tail -$lines $File | grep end | wc -w`
     10   #  用Uuencode编码过的文件在文件开始的地方都有个"begin", 
     11   #+ 在文件结尾的地方都有"end".
     12   if [ "$search1" -gt 0 ]
     13   then
     14     if [ "$search2" -gt 0 ]
     15     then
     16       echo "uudecoding - $File -"
     17       uudecode $File
     18     fi  
     19   fi
     20 done  
     21 
     22 #  小心不要让这个脚本运行自己, 
     23 #+ 因为它也会把自身也认为是一个经过uuencode编码过的文件, 
     24 #+ 这都是因为这个脚本自身也包含"begin"和"end". 
     25 
     26 #  练习:
     27 #  -----
     28 #  修改这个脚本, 让它可以检查一个新闻组的每个文件, 
     29 #+ 并且如果下一个没找到的话就跳过. 
     30 
     31 exit 0</pre>

     |

    * * *

    | ![Tip](./images/tip.gif) | 

    [fold -s](textproc.md#FOLDREF)命令在处理从Usenet新闻组下载下来的长的uudecode文本消息的时候可能会有用(可能在管道中).

     |

*   **mimencode**, **mmencode**
*   **mimencode**和**mmencode**命令用来处理多媒体编码的email附件. 虽然_mail用户代理_(比如**pine**或**kmail**)通常情况下都会自动处理, 但是这些特定的工具允许从命令行或shell脚本中来手动操作这些附件.

*   **crypt**
*   这个工具曾经是标准的UNIX文件加密工具. [[3]](#FTN.AEN9617) 政府由于政策上的动机规定禁止加密软件的输出, 这样导致了**crypt**命令从UNIX世界消失, 并且在大多数的Linux发行版中也没有这个命令. 幸运的是, 程序员们想出了一些替代它的方法, 在这些方法中有作者自己的[cruft](ftp://metalab.unc.edu/pub/Linux/utils/file/cruft-0.2.tar.gz) (请参考[例子 A-4](contributed-scripts.md#ENCRYPTEDPW)).

**Miscellaneous**

*   **mktemp**
*   使用一个<span class="QUOTE">"唯一"</span>的文件名来创建一个_临时文件_. [[4]](#FTN.AEN9640) 如果不带参数的在命令行下调用这个命令时, 将会在<tt class="FILENAME">/tmp</tt>目录下产生一个零长度的文件.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">mktemp</kbd>
    <samp class="COMPUTEROUTPUT">/tmp/tmp.zzsvql3154</samp>
    	      </pre>

     |

    | 

    <pre class="PROGRAMLISTING">  1 PREFIX=filename
      2 tempfile=`mktemp $PREFIX.XXXXXX`
      3 #                        ^^^^^^ 在这个临时的文件名中
      4 #+                              至少需要6个占位符. 
      5 #   如果没有指定临时文件的文件名, 
      6 #+  那么默认就是"tmp.XXXXXXXXXX". 
      7 
      8 echo "tempfile name = $tempfile"
      9 # tempfile name = filename.QA2ZpY
     10 #                 或者一些其他的相似的名字...
     11 
     12 #  使用600为文件权限
     13 #+ 来在当前工作目录下创建一个这样的文件.
     14 #  这样就不需要"umask 177"了.
     15 #  但不管怎么说, 这也是一个好的编程风格. </pre>

     |

*   **make**
*   build(建立)和compile(编译)二进制包的工具. 当源文件被增加或修改时就会触发一些操作, 这个工具用来控制这些操作.

    **make**命令会检查<tt class="FILENAME">Makefile</tt>, makefile是文件的依赖和操作列表.

*   **install**
*   特殊目的的文件拷贝命令, 与**cp**命令相似, 但是具有设置拷贝文件的权限和属性的能力. 这个命令看起来是为了安装软件包所定制的, 而且就其本身而言, 这个命令经常出现在<tt class="FILENAME">Makefiles</tt>中(在<tt class="REPLACEABLE">_make install :_</tt> 区域中). 在安装脚本中也会看到这个命令的使用.

*   **dos2unix**
*   这个工具是由Benjamin Lin及其同事共同编写的, 目的是将DOS格式的文本文件(以CR-LF为行结束符)转换为UNIX格式(以LF为行结束符), 反过来也一样.

*   **ptx**
*   **ptx [targetfile]**命令将输出目标文件的序列改变索引(交叉引用列表). 如果必要的话, 这个命令可以在管道中进行更深层次的过滤和格式化.

*   **more**, **less**
*   分页显示文本文件或<tt class="FILENAME">stdout</tt>, 一次一屏. 可以用来过滤<tt class="FILENAME">stdout</tt>的输出 . . . 或过滤一个脚本的输出.

    **more**命令的一个有趣的应用就是测试一个命令序列的执行, 这样做的目的是避免可能发生的糟糕的结果.

    | 

    <pre class="PROGRAMLISTING">  1 ls /home/bozo | awk '{print "rm -rf " $1}' | more
      2 #                                            ^^^^
      3 		 
      4 # 检查下边(灾难性的)命令行的效果: 
      5 #      ls /home/bozo | awk '{print "rm -rf " $1}' | sh
      6 #      推入shell中执行 . . .       ^^</pre>

     |

### 注意事项

| [[1]](filearchiv.md#AEN8734) | 

在这里所讨论的_归档文件_, 只不过是存储在一个单一位置上的一些相关文件的集合.

 |
| [[2]](filearchiv.md#AEN8744) | 

**tar czvf archive_name.tar.gz ***_可以_包含当前目录_下_的点文件. 这是一个未文档化的GNU**tar**的<span class="QUOTE">"特性"</span>.

 |
| [[3]](filearchiv.md#AEN9617) | 

这是一个对称的块密码, 过去曾在单系统或本地网络中用来加密文件, 用来对抗<span class="QUOTE">"public key"</span>密码类, **pgp**就是一个众所周知的例子.

 |
| [[4]](filearchiv.md#AEN9640) | 

使用`-d`选项可以创建一个临时的_目录_.

 |