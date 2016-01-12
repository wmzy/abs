# Appendix D. 带有特殊含义的退出码

* * *

**表格 D-1\. <span class="QUOTE">"保留的"</span>退出码**

<colgroup><col><col><col><col></colgroup>
| 退出码的值 | 含义 | 例子 | 注释 |
| --- | --- | --- | --- |
| `1` | 通用错误 | let "var1 = 1/0" | 各种各样的错误都可能使用这个退出码, 比如<span class="QUOTE">"除0错误"</span> |
| `2` | shell内建命令使用错误(Bash文档上有说明) | 很少看到, 通常情况下退出码都为<span class="ERRORCODE">1</span> |
| `126` | 命令调用不能执行 | 程序或命令的权限是不可执行的 |
| `127` | <span class="QUOTE">"command not found"</span> | 估计是`$PATH`不对, 或者是拼写错误 |
| `128` | [exit](exit-status.md#EXITCOMMANDREF)的参数错误 | exit 3.14159 | **exit**只能以整数作为参数, 范围是<span class="RETURNVALUE">0 - 255</span>(见脚注) |
| `128+n` | 信号<span class="QUOTE">"n"</span>的致命错误 | **kill -9** 脚本的`$PPID` | <kbd class="USERINPUT">$?</kbd> 返回<span class="ERRORCODE">137</span>(128 + 9) |
| `130` | 用Control-C来结束脚本 | Control-C是信号<span class="ERRORCODE">2</span>的致命错误, (130 = 128 + 2, 见上边) |
| `255*` | 超出范围的退出状态 | exit <span class="RETURNVALUE">-1</span> | **exit**命令只能够接受范围是<span class="ERRORCODE">0 - 255</span>的整数作为参数 |

* * *

通过上面的表, 我们了解到, 退出码<span class="ERRORCODE">1 - 2, 126 - 165, 和255</span> [[1]](#FTN.AEN18187) 都具有特殊的含义, 因此应该避免使用用户指定的退出参数. 如果脚本使用**exit 127**作为退出语句, 那么可能就会在故障诊断的时候产生混淆(如何判断这是由<span class="QUOTE">"command not found"</span>引起的, 还是由用户定义引起的?). 然而, 许多脚本使用**exit 1**作为通用的返回错误值. 因为退出码<span class="ERRORCODE">1</span>能够表示的错误太多了, 不过这么做, 对于调试来说, 也起不到任何帮助的作用.

其实早就有人对退出状态值进行了系统的分类(请参考<tt class="FILENAME">/usr/include/sysexits.h</tt>), 不过这个文件是为C/C++程序员准备的. 其实shell脚本也需要这样一个类似的标准. 所以本文作者呼吁限制使用用户定义的退出码, 尤其是范围<span class="RETURNVALUE">64 - 113</span>(还有<span class="RETURNVALUE">0</span>, 表示成功), 这么做, 就可以和C/C++标准保持一致. 这样我们就有了50个可用的退出码, 而且非常便于故障诊断.

本书中所有例子中的用户定义退出码都符合这个标准, 除了那些超出标准范围的例子, 比如[例子 9-2](internalvariables.md#TMDIN).

| ![Note](./images/note.gif) | 

只有在Bash或_sh_提示符下, 当shell脚本退出后, 在命令行上使用[$?](internalvariables.md#XSTATVARREF)才会得到与上表相一致的结果. 在某些情况下, 运行C-shell或者_tcsh_可能会给出不同的值.

 |

### 注意事项

| [[1]](exitcodes.md#AEN18187) | 

超出范围的退出值可能会产生意想不到的退出码. 如果退出值比<span class="ERRORCODE">255</span>大, 那么退出码将会取<span class="ERRORCODE">256</span>的[模](ops.md#MODULOREF). 举个例子, **exit 3809**的退出码将是<span class="ERRORCODE">225</span>(3809 % 256 = 225).

 |