# 1\. 为什么使用shell编程?

 _没有程序语言是完美的. 甚至没有一个唯一最好的语言, 只有对于特定目的, 比较适合和不适合的程序语言._ |
 _Herbert Mayer_ |

对于任何想适当精通一些系统管理知识的人来说, 掌握shell脚本知识都是最基本的, 即使这些人可能并不打算真正的编写一些脚本. 想一下Linux机器的启动过程, 在这个过程中, 必将运行<tt class="FILENAME">/etc/rc.d</tt>目录下的脚本来存储系统配置和建立服务. 详细的理解这些启动脚本对于分析系统的行为是非常重要的, 并且有时候可能必须修改它.

学习如何编写shell脚本并不是一件很困难的事, 因为脚本可以分为很小的块, 并且相对于shell特性的操作和选项 [[1]](#FTN.AEN112)部分,只需要学习很小的一部分就可以了. 语法是简单并且直观的, 编写脚本很像是在命令行上把一些相关命令和工具连接起来, 并且只有很少的一部分<span class="QUOTE">"规则"</span>需要学习. 绝大部分脚本第一次就可以正常的工作, 而且即使调试一个长一些的脚本也是很直观的.

一个shell脚本是一个类似于<span class="QUOTE">"小吃店的(quick and dirty)"</span>方法, 在你使用原型设计一个复杂的应用的时候. 在工程开发的第一阶段, 即使从功能中取得很有限的一个子集放到shell脚本中来完成往往都是非常有用的. 使用这种方法, 程序的结果可以被测试和尝试运行, 并且在处理使用诸如C/C++, Java或者Perl语言编写的最终代码前, 主要的缺陷和陷阱往往就被发现了.

Shell脚本遵循典型的UNIX哲学, 就是把大的复杂的工程分成小规模的子任务, 并且把这些部件和工具组合起来. 许多人认为这种办法更好一些, 至少这种办法比使用那种高\大\全的语言更美, 更愉悦, 更适合解决问题. 比如Perl就是这种能干任何事能适合任何人的语言, 但是代价就是你需要强迫自己使用这种语言来思考解决问题的办法.

什么时候不适合使用Shell脚本

*   资源密集型的任务, 尤其在需要考虑效率时(比如, 排序, hash等等).

*   需要处理大任务的数学操作, 尤其是浮点运算, 精确运算, 或者复杂的算术运算(这种情况一般使用C++或FORTRAN来处理).

*   有跨平台移植需求(一般使用C或Java).

*   复杂的应用, 在必须使用结构化编程的时候(需要变量的类型检查, 函数原型, 等等).

*   至关重要的应用, 比如说为了这个应用, 你需要赌上自己的农场, 甚至赌上你们公司的未来.

*   对于安全有很高要求的任务, 比如你需要一个健壮的系统来防止入侵, 破解, 恶意破坏等等.

*   工程的每个组成部分之间, 需要连锁的依赖性.

*   需要大规模的文件操作(Bash受限于顺序地进行文件访问, 而且只能使用这种笨拙的效率低下的一行接一行的处理方式. ).

*   需要多维数组的支持.

*   需要数据结构的支持,比如链表或数组等数据结构.

*   需要产生或操作图形化界面GUI.

*   需要直接操作系统硬件.

*   需要I/O或socket接口.

*   需要使用库或者遗留下来的旧代码的接口.

*   个人的, 闭源的应用(shell脚本把代码就放在文本文件中, 全世界都能看到).

如果你的应用符合上边的任意一条, 那么就考虑一下更强大的语言吧--或许是Perl, Tcl, Python, Ruby -- 或者是更高层次的编译语言比如C/C++, 或者是Java. 即使如此, 你会发现, 使用shell来原型开发你的应用, 在开发步骤中也是非常有用的.

我们将开始使用<acronym class="ACRONYM">Bash</acronym>, Bash是<span class="QUOTE">"Bourne-Again shell"</span>首字母的缩写, 也是Stephen Bourne的经典的Bourne shell的一个双关语, (译者: 说实话, 我一直搞不清这个双关语是什么意思, 为什么叫"Bourn-Again shell", 这其中应该有个什么典故吧, 哪位好心, 告诉我一下^^). 对于所有UNIX上的shell脚本来说, Bash已经成为了_事实上_的标准了. 同时这本书也覆盖了绝大部分的其他一些shell的原则, 比如Korn Shell, Bash从ksh中继承了一部分特性, [[2]](#FTN.AEN156) C Shell和它的变种. (注意: C Shell编程是不被推荐的, 因为一些特定的内在问题, Tom Christiansen在1993年10月上的[Usenet post](http://www.etext.org/Quartz/computer/unix/csh.harmful.gz)指出了这个问题).

接下来是脚本的一些说明. 在展示shell不同的特征之前, 它可以减轻一些阅读书中例子的负担. 本书中的例子脚本, 都在尽可能的范围内进行了测试, 并且其中的一些将使用在真实的生活中. 读者可以运行这些例子脚本(使用<tt class="FILENAME">scriptname.sh</tt>或者<tt class="FILENAME">scriptname.bash</tt>的形式), [[3]](#FTN.AEN164) 并给这些脚本执行权限(<kbd class="USERINPUT">chmod u+rx scriptname</kbd>), 然后执行它们, 看看发生了什么. 如果你没有相应的源代码, 那么就从本书的 [HTML](http://www.tldp.org/LDP/abs/abs-guide.md.tar.gz), [pdf](http://www.tldp.org/LDP/abs/abs-guide.pdf), 或者[text](http://www.ibiblio.org/pub/Linux/docs/linux-doc-project/abs-guide/abs-guide.txt.gz)版本中将这些源代码拷贝出来. 考虑到这些脚本中的内容在我们还没解释它之前就被列在这里, 可能会影响读者的理解, 这就需要读者暂时忽略这些内容.

除非特别注明, 本书[作者](mailto:thegrendel@theriver.com)编写了本书中的绝大部分例子脚本.

### 注意事项

| [[1]](why-shell.md#AEN112) | 

这些将在[内建](internal.md#BUILTINREF)章节被引用, 这些都是shell的内部特征.

 |
| [[2]](why-shell.md#AEN156) | 

_ksh88_的许多特性,甚至是一些_ksh93_的特性都被合并到Bash中了.

 |
| [[3]](why-shell.md#AEN164) | 

根据惯例,用户编写的Bourne shell脚本应该在脚本的名字后边加上<tt class="FILENAME">.sh</tt>扩展名. 一些系统脚本, 比如那些在<tt class="FILENAME">/etc/rc.d</tt>中的脚本,则不遵循这种命名习惯.

 |