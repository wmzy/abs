# Appendix G. 重要的文件

**启动文件**

*   这些文件包含别名和[环境变量](othertypesv.md#ENVREF), 正是这些别名和环境变量才使得Bash可以作为一个用户shell来运行, 当系统初始化之后, 这些别名和变量也可被其他的的Bash脚本调用.

*   <tt class="FILENAME">/etc/profile</tt>
*   系统范围的默认值, 大部分用来设置环境(所有的Bourne类型的shell, 而不仅仅是Bash [[1]](#FTN.AEN18436))

*   <tt class="FILENAME">/etc/bashrc</tt>
*   特定于Bash的, 系统范围函数与[别名](aliases.md#ALIASREF)

*   <tt class="FILENAME">`$HOME`/.bash_profile</tt>
*   用户定义的, 环境默认设置, 在每个用户的home目录下都可找到(本地副本保存在<tt class="FILENAME">/etc/profile</tt>)

*   <tt class="FILENAME">`$HOME`/.bashrc</tt>
*   用户定义的Bash初始化文件, 可以在每个用户的home目录下找到(本地副本保存在<tt class="FILENAME">/etc/bashrc</tt>). 只有交互式的shell和用户脚本才会读取这个文件. 请参考[Appendix K](sample-bashrc.md), 这是一个<tt class="FILENAME">.bashrc</tt>文件的例子.

**登出文件**

*   <tt class="FILENAME">`$HOME`/.bash_logout</tt>
*   用户定义的指令文件, 在每个用户的home目录下找到. 在登出(Bash)shell的时候, 这个文件中的命令就会得到执行.

### 注意事项

| [[1]](files.md#AEN18436) | 

不能应用于**csh**, **tcsh**, 或那些与经典Bourne shell无关的shell(也就是说那些不是派生自**sh**的shell).

 |