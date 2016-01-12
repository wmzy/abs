# 12.1\. 基本命令

**新手必须要掌握的初级命令**

*   **ls**
*   <span class="QUOTE">"列出"</span>文件的基本命令. 但是往往就是因为这个命令太简单, 所以我们总是低估它. 比如, 使用`-R`选项, 递归选项, **ls**将会以目录树的形式列出所有文件. 另一个很有用的选项`-S`, 将会按照文件尺寸列出所有文件, `-t`, 将会按照修改时间来列出文件, `-i`选项会显示文件的inode(请参考[例子 12-4](moreadv.md#IDELETE)).

    * * *

    **例子 12-1\. 使用**ls**命令来创建一个烧录<abbr class="ABBREV">CDR</abbr>的内容列表**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # ex40.sh (burn-cd.sh)
      3 # 自动刻录CDR的脚本.
      4 
      5 
      6 SPEED=2          # 如果你的硬件支持的话, 你可以选用更高的速度.
      7 IMAGEFILE=cdimage.iso
      8 CONTENTSFILE=contents
      9 DEVICE=cdrom
     10 # DEVICE="0,0"     为了是用老版本的CDR
     11 DEFAULTDIR=/opt  # 这是包含需要被刻录内容的目录.
     12                  # 必须保证目录存在.
     13                  # 小练习: 测试一下目录是否存在.
     14 
     15 # 使用 Joerg Schilling 的 "cdrecord" 包:
     16 # http://www.fokus.fhg.de/usr/schilling/cdrecord.html
     17 
     18 #  如果一般用户调用这个脚本的话, 可能需要root身份
     19 #+ chmod u+s /usr/bin/cdrecord
     20 #  当然, 这会产生安全漏洞, 虽然这是一个比较小的安全漏洞.
     21 
     22 if [ -z "$1" ]
     23 then
     24   IMAGE_DIRECTORY=$DEFAULTDIR
     25   # 如果命令行没指定的话, 那么这个就是默认目录.
     26 else
     27     IMAGE_DIRECTORY=$1
     28 fi
     29 
     30 # 创建一个"内容列表"文件.
     31 ls -lRF $IMAGE_DIRECTORY > $IMAGE_DIRECTORY/$CONTENTSFILE
     32 # "l" 选项将给出一个"长"文件列表.
     33 # "R" 选项将使这个列表递归.
     34 # "F" 选项将标记出文件类型 (比如: 目录是以 /结尾, 而可执行文件以 *结尾).
     35 echo "Creating table of contents."
     36 
     37 # 在烧录到CDR之前创建一个镜像文件.
     38 mkisofs -r -o $IMAGEFILE $IMAGE_DIRECTORY
     39 echo "Creating ISO9660 file system image ($IMAGEFILE)."
     40 
     41 # 烧录CDR.
     42 echo "Burning the disk."
     43 echo "Please be patient, this will take a while."
     44 cdrecord -v -isosize speed=$SPEED dev=$DEVICE $IMAGEFILE
     45 
     46 exit $?</pre>

     |

    * * *

*   **cat**, **tac**
*   **cat**, 是单词_concatenate_的缩写, 把文件的内容输出到<tt class="FILENAME">stdout</tt>. 当与重定向操作符(<span class="TOKEN">></span>或<span class="TOKEN">>></span>), 一般都是用来将多个文件连接起来.

    | 

    <pre class="PROGRAMLISTING">  1 # Uses of 'cat'
      2 cat filename                          # 打印出文件内容.
      3 
      4 cat file.1 file.2 file.3 > file.123   # 把三个文件连接到一个文件中. </pre>

     |

    **cat**命令的`-n`选项是为了在目标文件中的所有行前边插入行号. `-b`也是用来加行号的, 但是不对空行进行编号. `-v`选项可以使用<span class="TOKEN">^</span>标记法来echo出不可打印字符. `-s`选项可以把多个空行压缩成一个空行.

    请参考[例子 12-25](textproc.md#LNUM)和[例子 12-21](textproc.md#ROT13).

    | ![Note](./images/note.gif) | 

    在一个[管道](special-chars.md#PIPEREF)中, 有一种把<tt class="FILENAME">stdin</tt>[重定向](io-redirection.md#IOREDIRREF)到一个文件中更有效的方法, 这种方法比使用**cat**文件的方法更高效.

    | 

    <pre class="PROGRAMLISTING">  1 cat filename | tr a-z A-Z
      2 
      3 tr a-z A-Z < filename   #  效果相同, 但是处理更少,
      4                         #+ 并且连管道都省掉了. </pre>

     |

     |

    **tac**命令, 就是_cat_命令的反转, 这个命令将会从文件结尾部分列出文件的内容.

*   **rev**
*   把每一行中的内容反转, 并且输出到<tt class="FILENAME">stdout</tt>上. 这个命令与**tac**命令的效果是不同的, 因为它并不反转行序, 而是把每行的内容反转.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cat file1.txt</kbd>
    <samp class="COMPUTEROUTPUT">This is line 1.
     This is line 2.</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">tac file1.txt</kbd>
    <samp class="COMPUTEROUTPUT">This is line 2.
     This is line 1.</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">rev file1.txt</kbd>
    <samp class="COMPUTEROUTPUT">.1 enil si sihT
     .2 enil si sihT</samp>
    	      </pre>

     |

*   **cp**
*   这是文件拷贝命令. <kbd class="USERINPUT">cp file1 file2</kbd>把文件<tt class="FILENAME">file1</tt>拷贝到<tt class="FILENAME">file2</tt>, 如果<tt class="FILENAME">file2</tt>存在的话, 那么<tt class="FILENAME">file2</tt>将被覆盖(请参考[例子 12-6](moreadv.md#EX42)).

    | ![Tip](./images/tip.gif) | 

    特别有用的选项就是`-a`选项, 这是归档标志(目的是为了copy一个完整的目录树), `-u`是更新选项, `-r`和`-R`选项是递归标志.

    | 

    <pre class="PROGRAMLISTING">  1 cp -u source_dir/* dest_dir
      2 #  把源目录"同步"到目标目录上,
      3 #+  也就是拷贝所有更新的文件和之前不存在的文件. </pre>

     |

     |

*   **mv**
*   这是文件_移动_命令. 它等价于**cp**和**rm**命令的组合. 它可以把多个文件移动到目录中,甚 至将目录重命名. 想察看**mv**在脚本中使用的例子, 请参考[例子 9-19](parameter-substitution.md#RFE)和[例子 A-2](contributed-scripts.md#RN).

    | ![Note](./images/note.gif) | 

    当使用非交互脚本时, 可以使用**mv**的`-f`(_强制_)选项来避免用户的输入.

    当一个目录被移动到一个已存在的目录时, 那么它将成为目标目录的子目录.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">mv source_directory target_directory</kbd>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ls -lF target_directory</kbd>
    <samp class="COMPUTEROUTPUT">total 1
     drwxrwxr-x    2 bozo  bozo      1024 May 28 19:20 source_directory/</samp>
    	      </pre>

     |

     |

*   **rm**
*   删除(清除)一个或多个文件. `-f`选项将强制删除文件, 即使这个文件是只读的. 并且可以用来避免用户输入(在非交互脚本中使用).

    | ![Note](./images/note.gif) | 

    **rm**将无法删除以破折号开头的文件.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">rm -badname</kbd>
    <samp class="COMPUTEROUTPUT">rm: invalid option -- b
     Try `rm --help' for more information.</samp></pre>

     |

    解决这个问题的一个方法就是在要删除的文件的前边加上_./_ .

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">rm ./-badname</kbd></pre>

     |

    另一种解决的方法是在文件名前边加上<span class="QUOTE">" -- "</span>.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">rm -- -badname</kbd></pre>

     |

     |

    | ![Warning](./images/warning.gif) | 

    当使用递归参数`-r`时, 这个命令将会删除整个目录树. 如果不慎的使用**rm -rf ***的话, 那整个目录树就真的完了.

     |

*   **rmdir**
*   删除目录. 但是只有这个目录中没有文件的时候 -- 当然会包含<span class="QUOTE">"不可见的"</span>_点文件_ [[1]](#FTN.AEN7278) -- 这个命令才会成功.

*   **mkdir**
*   生成目录, 创建一个空目录. 比如, <kbd class="USERINPUT">mkdir -p project/programs/December</kbd>将会创建指定的目录, 即使project目录和programs目录都不存在. <tt class="REPLACEABLE">_-p_</tt>选项将会自动产生必要的父目录, 这样也就同时创建了多个目录.

*   **chmod**
*   修改一个现存文件的属性(请参考[例子 11-12](internal.md#EX44)).

    | 

    <pre class="PROGRAMLISTING">  1 chmod +x filename
      2 # 使得文件"filename"对所有用户都可执行.
      3 
      4 chmod u+s filename
      5 # 设置"filename"文件的"suid"位.
      6 # 这样一般用户就可以在执行"filename"的时候, 拥有和文件宿主相同的权限.
      7 # (这并不适用于shell脚本.)</pre>

     |

    | 

    <pre class="PROGRAMLISTING">  1 chmod 644 filename
      2 # 对文件"filename"的宿主设置r/w权限, 
      3 # 对一般用户设置读权限
      4 # (8进制模式). </pre>

     |

    | 

    <pre class="PROGRAMLISTING">  1 chmod 1777 directory-name
      2 # 对这个目录设置r/w和可执行权限, 并开放给所有人.
      3 # 同时设置 "粘贴位".
      4 # 这意味着,　只有目录宿主,
      5 # 文件宿主, 当然, 
      6 # 还有root可以删除这个目录中的任何特定的文件.</pre>

     |

*   **chattr**
*   修改文件属性. 这个命令与上边的**chmod**命令项类似, 但是有不同的选项和不同的调用语法, 并且这个命令只能工作在_ext2_文件系统中.

    **chattr**命令的一个特别有趣的选项是`i`. **chattr +i <tt class="FILENAME">filename</tt>**将使得这个文件被标记为永远不变. 这个文件将不能被修改, 连接, 或删除, _即使是root也不行_. 这个文件属性只能被root设置和删除. 类似的, `a`选项将会把文件标记为只能追加数据

    | 

    <pre class="SCREEN"><samp class="PROMPT">root#</samp> <kbd class="USERINPUT">chattr +i file1.txt</kbd>

    <samp class="PROMPT">root#</samp> <kbd class="USERINPUT">rm file1.txt</kbd>

    <samp class="COMPUTEROUTPUT">rm: remove write-protected regular file `file1.txt'? y
     rm: cannot remove `file1.txt': Operation not permitted</samp>
    	      </pre>

     |

    如果文件设置了`s`(安全)属性, 那么当这个文件被删除时, 这个文件所在磁盘的块将全部被0填充.

    如果文件设置了`u`(不可删除)属性, 那么当这个文件被删除后, 这个文件的内容还可以被恢复(不可删除).

    如果文件设置了`c`(压缩)属性, 那么当这个文件在进行写操作时, 它将自动被压缩, 并且在读的时候, 自动解压.

    | ![Note](./images/note.gif) | 

    使用**chattr**命令设置过属性的文件将不会显示在文件列表中(**ls -l**).

     |

*   **ln**
*   创建文件链接, 前提是这个文件是存在的. <span class="QUOTE">"链接"</span>就是一个文件的引用, 也就是这个文件的另一个名字. **ln**命令允许对同一个文件引用多个链接, 并且是避免混淆的一个很好的方法(请参考[例子 4-6](othertypesv.md#EX18)).

    **ln**对于文件来说只不过是创建了一个引用, 一个指针而已, 因为创建出来的连接文件只有几个字节.

    绝大多数使用**ln**命令时, 使用的是`-s`选项, 可以称为符号链接, 或<span class="QUOTE">"软"</span>链接. 使用`-s`标志的一个优点是它可以穿越文件系统来链接目录.

    关于使用这个命令的语法还是有点小技巧的. 比如: <kbd class="USERINPUT">ln -s oldfile newfile</kbd>将对之前存在的<tt class="FILENAME">oldfile</tt>产生一个新的连接, <tt class="FILENAME">newfile</tt>.

    | ![Caution](./images/caution.gif) | 

    如果之前<tt class="FILENAME">newfile</tt>已经存在的话, 将会产生一个错误信息.

     |

    | 

    **使用链接中的哪种类型?**

    就像John Macdonald解释的那样:

    不论是那种类型的链接, 都提供了一种双向引用的手段 -- 也就是说, 不管你用文件的哪个名字对文件内容进行修改, 你修改的效果都即会影响到原始名字的文件, 也会影响到链接名字的文件. 当你工作在更高层次的时候, 才会发生软硬链接的不同. 硬链接的优点是, 原始文件与链接文件之间是相互独立的 -- 如果你删除或者重命名旧文件, 那么这种操作将不会影响硬链接的文件, 硬链接的文件讲还是原来文件的内容. 然而如果你使用软链接的话, 当你把旧文件删除或重命名后, 软链接将再也找不到原来文件的内容了. 而软链接的优点是它可以跨越文件系统(因为它只不过是文件名的一个引用, 而并不是真正的数据). 与硬链接的另一个不同是, 一个符号链接可以指向一个目录.

     |

    链接给出了一种可以用多个名字来调用脚本的能力(当然这也适用于任何其他可执行的类型), 并且脚本的行为将依赖于脚本是如何被调用的.

    * * *

    **例子 12-2\. 到底是Hello还是Good-bye**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # hello.sh: 显示"hello"还是"goodbye"
      3 #+          依赖于脚本是如何被调用的. 
      4 
      5 # 在当前目录下($PWD)为这个脚本创建一个链接:
      6 #    ln -s hello.sh goodbye
      7 # 现在, 通过如下两种方法来调用这个脚本:
      8 # ./hello.sh
      9 # ./goodbye
     10 
     11 
     12 HELLO_CALL=65
     13 GOODBYE_CALL=66
     14 
     15 if [ $0 = "./goodbye" ]
     16 then
     17   echo "Good-bye!"
     18   # 当然, 在这里你也可以添加一些其他的goodbye类型的命令.
     19   exit $GOODBYE_CALL
     20 fi
     21 
     22 echo "Hello!"
     23 # 当然, 在这里你也可以添加一些其他的hello类型的命令.
     24 exit $HELLO_CALL</pre>

     |

    * * *

*   **man**, **info**
*   这两个命令用来查看系统命令或安装工具的手册和信息. 当两者都可用时, _info_页一般会比_man_页包含更多的细节描述.

### 注意事项

| [[1]](basic.md#AEN7278) | 

_点文件_就是文件名以_点_开头的文件, 比如<tt class="FILENAME">~/.Xdefaults</tt>. 当使用一般的**ls**命令时, 这样的文件是不会被显示出来的. (当然**ls -a**会显示它们), 所以它们也不会被意外的**rm -rf ***命令所删除. 在用户的home目录中, 点文件一般被用作安装和配置文件.

 |