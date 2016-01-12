# F.2\. Bash命令行选项

_Bash_本身也带有许多命令行选项. 下面就是一些有用的选项.

*   `-c`

    _从这个选项后边的字符串中读取命令, 并且将参数分配到[位置参数](internalvariables.md#POSPARAMREF)中._

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">bash -c 'set a b c d; IFS="+-;"; echo "$*"'</kbd>
    <samp class="COMPUTEROUTPUT">a+b+c+d</samp>
    	      </pre>

     |

*   `-r`

    `--restricted`

    _使用[受限模式](restricted-sh.md#RESTRICTEDSHREF)运行这个shell, 或脚本._

*   `--posix`

    _强制Bash符合[POSIX](sha-bang.md#POSIX2REF)模式._

*   `--version`

    _显示Bash版本并退出._

*   `--`

    _选项的结束. 命令行上的其他东西就都是参数了, 不是选项._