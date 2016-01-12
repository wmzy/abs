# Appendix C. 一个学习Sed和Awk的小手册

*   **目录**
*   C.1\. [Sed](x17814.md)
*   C.2\. [Awk](awk.md)

这是一份关于**sed**和**awk**文本处理工具的概要介绍. 我们在这里只讨论一些基本命令, 但是这些基本命令已经足够让我们了解如何在shell脚本中使用简单的sed和awk结构.

**sed**: 一个非交互的文本文件编辑器

**awk**: 一个面向域的模式处理语言, 使用类似C的语法

在我们讨论这两个工具的差异性之前, 我们先说一下它们的共性, 这两个工具都使用类似的调用语法, 都使用[正则表达式](regexp.md#REGEXREF), 默认情况下都从<tt class="FILENAME">stdin</tt>中读取输入, 并且都输出到<tt class="FILENAME">stdout</tt>. 它们都是行为良好的UNIX工具, 并且它们能够很好的在一起工作. 其中一个的输出可以通过管道传递给另一个, 正是由于它们组合能力, 才使得shell脚本能够具备一些Perl的特性.

| ![Note](./images/note.gif) | 

注意一下这两个工具之间的一个非常重要的区别, shell脚本可以很容易的给sed传递参数, 但是传递参数给awk就比较复杂(请参考[例子 33-5](wrapper.md#COLTOTALER)和[例子 9-24](ivr.md#COLTOTALER2)).

 |