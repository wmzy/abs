# F.1\. 标准命令行选项

随着时间的流逝, 对于命令行选项标志的含义来说, 已经建立起了一套比较宽松的标准. GNU工具比老式的UNIX工具更加符合这套<span class="QUOTE">"标准"</span>.

按惯例, UNIX命令行选项通常都包含一个破折号, 后边跟一个或多个小写字母. GNU工具增加了一个双破折号, 后边跟一个完整的单词或复合单词.

这两个最通用的选项是:

*   `-h`

    `--help`

    _帮助_: 给出使用信息, 然后退出.

*   `-v`

    `--version`

    _版本_: 现实程序版本号, 然后退出.

其他公用选项:

*   `-a`

    `--all`

    _全部_: 显示_所有_参数的_全部_信息或操作.

*   `-l`

    `--list`

    _列表_: 列出文件或参数, 不采取其他动作.

*   `-o`

    _输出_文件

*   `-q`

    `--quiet`

    _安静_: 抑制<tt class="FILENAME">stdout</tt>.

*   `-r`

    `-R`

    `--recursive`

    _递归_: 递归操作(包含子目录树).

*   `-v`

    `--verbose`

    _冗余_: 将额外的信息输出到<tt class="FILENAME">stdout</tt>或<tt class="FILENAME">stderr</tt>.

*   `-z`

    `--compress`

    _压缩_: 进行压缩(通常为[gzip](filearchiv.md#GZIPREF)).

然而:

*   在**tar**和**gawk**中:

    `-f`

    `--file`

    _文件_: 跟文件名参数.

*   在**cp**, **mv**, **rm**中:

    `-f`

    `--force`

    _强制_: 目标文件的强制覆盖.

| ![Caution](./images/caution.gif) | 

许多UNIX和Linux工具都严重的偏离了这个<span class="QUOTE">"标准"</span>, 所以, 按照标准来_假定_一个给定选项的行为是非常危险的. 当遇到拿不准的问题时, 一定要经常察看命令的man页.

 |

GNU工具有一张完整的推荐选项表, 在[http://www.gnu.org/prep/standards_19.html](http://www.gnu.org/prep/standards_19.md).