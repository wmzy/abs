# Appendix I. 本地化

本地化是Bash的一个未文档化的特征.

对于一个本地化的shell脚本来说, 它的输出都会使用本地系统所定义的语言. 对于一个德国柏林的Linux用户来说, 他的脚本会输出德文, 而对于他在马里兰的堂兄来说, 同样运行这个脚本, 输出就是英文.

为了创建一个本地化的脚本, 可以使用下面的模版来编写所有的用户消息(错误消息, 提示符, 等等.).

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # localized.sh
  3 #  此脚本由Stephane Chazelas编写, 
  4 #+ Bruno Haible进行了修改, Alfredo Pironti修正了bug. 
  5 
  6 . gettext.sh
  7 
  8 E_CDERROR=65
  9 
 10 error()
 11 {
 12   printf "$@" >&2
 13   exit $E_CDERROR
 14 }
 15 
 16 cd $var || error "`eval_gettext \"Can\'t cd to \\\$var.\"`"
 17 #  $var前面之所以需要三个反斜线(转义)
 18 #+ "因为在变量值还没被替换之前, 
 19 #+ eval_gettext需要一个字符串."
 20 #    -- per Bruno Haible
 21 read -p "`gettext \"Enter the value: \"`" var
 22 #  ...
 23 
 24 
 25 #  ------------------------------------------------------------------
 26 #  Alfredo Pironti注释: 
 27 
 28 #  这个脚本已经被修改, 
 29 #+ 使用"`gettext \"...\"`"语法形式替换了$"..."语法形式. 
 30 #  这么做没问题, 但是在新的localized.sh程序中, 
 31 #+ 命令"bash -D filename" and "bash --dump-po-string filename"
 32 #+ 将不会产生输出
 33 #+ (因为那些命令只会搜索$"..."字符串)!
 34 #  从新文件中提取字符串的唯一方法就是使用'xgettext'程序. 
 35 #  然而, xgettext程序存在许多bug. 
 36 
 37 # 注意'xgettext'还有一个bug. 
 38 #
 39 # shell片断: 
 40 #    gettext -s "I like Bash"
 41 # 将会被正确的提取, 但是 . . .
 42 #    xgettext -s "I like Bash"
 43 # . . . 失败!
 44 #  'xgettext'将会提取"-s"
 45 #+ 因为这个命令仅仅会提取
 46 #+ 'gettext'后边的第一个参数. 
 47 
 48 
 49 #  转义字符:
 50 #
 51 #  为了本地化一个句子, 就像
 52 #     echo -e "Hello\tworld!"
 53 #+ 你必须使用
 54 #     echo -e "`gettext \"Hello\\tworld\"`"
 55 #  `t'前边的"双转义字符"是必须的, 
 56 #+ 因为'gettext'将会搜索那些字符串(就像'Hello\tworld')
 57 #  这是因为gettext将会读取一个字符`\')
 58 #+ 并将输出一个字符串(就像"Bonjour\tmonde"), 
 59 #+ 所以'echo'命令将会正确的显示消息. 
 60 #
 61 #  你可能不想使用
 62 #     echo "`gettext -e \"Hello\tworld\"`"
 63 #+ 因为我们上面解释的xgettext的bug. 
 64 
 65 
 66 
 67 # 让我们本地化下面的shell片断:
 68 #     echo "-h display help and exit"
 69 #
 70 # 首先, 可以用:
 71 #     echo "`gettext \"-h display help and exit\"`"
 72 #  这样'xgettext'工作正常, 
 73 #+ 但是'gettext'程序将会把"-h"当作选项来读取! 
 74 #
 75 # 一个解决方法是
 76 #     echo "`gettext -- \"-h display help and exit\"`"
 77 #  这样'gettext'工作正常, 
 78 #+ 但是'xgettext'将会提取"--", 就像上边那样. 
 79 #
 80 # 为了获得这个本地化的字符串, 你可能使用的变通方法就是: 
 81 #     echo -e "`gettext \"\\0-h display help and exit\"`"
 82 #  我们已经在这句的开头添加了\0 (NULL). 
 83 #  这样'gettext'能够正确工作, 就像'xgettext'一样.
 84 #  此外, NULL字符将不会修改
 85 #+ 'echo'命令的行为. 
 86 #  ------------------------------------------------------------------</pre>

 |

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">bash -D localized.sh</kbd>
<samp class="COMPUTEROUTPUT">"Can't cd to %s."
 "Enter the value: "</samp></pre>

 |

这将列出所有的本地化文本. (`-D`选项将会列出以<span class="TOKEN">$</span>为前缀, 并且使用双引号引用起来的字符串, 而不会执行这个脚本.)

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">bash --dump-po-strings localized.sh</kbd>
<samp class="COMPUTEROUTPUT">#: a:6
 msgid "Can't cd to %s."
 msgstr ""
 #: a:7
 msgid "Enter the value: "
 msgstr ""</samp></pre>

 |

Bash的`--dump-po-strings`选项与`-D`选项很相似, 但使用[gettext](textproc.md#GETTEXTREF) <span class="QUOTE">"po"</span>格式.

| ![Note](./images/note.gif) | 

Bruno Haible指出:

以gettext-0.12.2开始, **xgettext -o - localized.sh**被推荐代替**bash --dump-po-strings localized.sh**, 因为**xgettext** . . .

1\. 了解命令gettext和eval_gettext(而bash --dump-po-strings只认识它的$"..."语法)

2\. 可以提取程序中的注释, 进而可以被翻译者读取.

这个脚本将不再被特定于Bash, 它与Bash 1.x和其他的/bin/sh实现, 都使用相同的方式工作.

 |

现在, 为每种脚本需要被转换的语言都建立一个<tt class="FILENAME">language.po</tt>文件, 指定<tt class="REPLACEABLE">_msgstr_</tt>. Alfredo Pironti给出了下面的例子:

fr.po:

| 

<pre class="PROGRAMLISTING">  1 #: a:6
  2 msgid "Can't cd to $var."
  3 msgstr "Impossible de se positionner dans le repertoire $var."
  4 #: a:7
  5 msgid "Enter the value: "
  6 msgstr "Entrez la valeur : "
  7 
  8 #  这个字符串和变量名被打印, 没有%s语法, 
  9 #+ 与C程序很像. 
 10 #+ 如果程序员使用有意义的变量名, 
 11 #+ 那么这将会是一个非常酷的特点!</pre>

 |

然后, 运行[msgfmt](textproc.md#MSGFMTREF).

<kbd class="USERINPUT">msgfmt -o localized.sh.mo fr.po</kbd>

将文件<tt class="FILENAME">localized.sh.mo</tt>的结果放到<tt class="FILENAME">/usr/local/share/locale/fr/LC_MESSAGES</tt>目录下, 并且在脚本的开头插入如下行:

| 

<pre class="PROGRAMLISTING">  1 TEXTDOMAINDIR=/usr/local/share/locale
  2 TEXTDOMAIN=localized.sh</pre>

 |

如果法文系统上的用户运行这个脚本, 那么她将得到法文消息.

| ![Note](./images/note.gif) | 

在老本的Bash或其他shell中, 本地化需要使用`-s`选项的命令[gettext](textproc.md#GETTEXTREF). 在这种情况下, 脚本为:

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # localized.sh
  3 
  4 E_CDERROR=65
  5 
  6 error() {
  7   local format=$1
  8   shift
  9   printf "$(gettext -s "$format")" "$@" >&2
 10   exit $E_CDERROR
 11 }
 12 cd $var || error "Can't cd to %s." "$var"
 13 read -p "$(gettext -s "Enter the value: ")" var
 14 # ...</pre>

 |

 |

变量`TEXTDOMAIN`和`TEXTDOMAINDIR`需要被设置, 并且需要export到环境变量中. 这应该在脚本中完成.

---

此附录由Stephane Chazelas编写, Alfredo Pironti, 和Bruno Haible给出了一些建议, 是GNU[gettext](textproc.md#GETTEXTREF)的维护者.