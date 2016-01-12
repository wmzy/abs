# 2.1\. 调用一个脚本

编写完脚本之后,你可以使用<kbd class="USERINPUT">sh scriptname</kbd>, [[1]](#FTN.AEN283) 或者<kbd class="USERINPUT">bash scriptname</kbd>来调用这个脚本. (不推荐使用<kbd class="USERINPUT">sh <scriptname</kbd>, 因为这禁用了脚本从<tt class="FILENAME">stdin</tt>中读数据的功能. ) 更方便的方法是让脚本本身就具有可执行权限, 通过[chmod](basic.md#CHMODREF)命令可以修改.

*   比如:
*   <kbd class="USERINPUT">chmod 555 scriptname</kbd> (允许任何人都具有可读和执行权限) [[2]](#FTN.AEN296)

*   或者
*   <kbd class="USERINPUT">chmod +rx scriptname</kbd> (允许任何人都具有可读和执行权限)

    <kbd class="USERINPUT">chmod u+rx scriptname</kbd> (只给脚本的所有者可读和执行权限)

既然脚本已经具有了可执行权限,现在你可以使用 <kbd class="USERINPUT">./scriptname</kbd> [[3]](#FTN.AEN308) 来测试这个脚本了. 如果这个脚本以一个<span class="QUOTE">"sha-bang"</span>行开头, 那么脚本将会调用合适的命令解释器来运行.

最后一步, 在脚本被测试和debug之后, 你可能想把它移动到<tt class="FILENAME">/usr/local/bin</tt>下, (当然是以root身份), 来让你的脚本对所有用户都有用. 这样以来, 用户就可以在命令行上简单的输入**scriptname** **[ENTER]**就可以运行这个脚本了.

### 注意事项

| [[1]](invoking.md#AEN283) | 

小心: 使用<kbd class="USERINPUT">sh scriptname</kbd>来调用脚本的时候将会关闭一些Bash特定的扩展, 脚本可能因此而调用失败.

 |
| [[2]](invoking.md#AEN296) | 

脚本需要_读_和可执行的权限, 因为shell需要读这个脚本.

 |
| [[3]](invoking.md#AEN308) | 

为什么不直接使用<kbd class="USERINPUT">scriptname</kbd>来调用脚本? 如果你当前的目录下([$PWD](internalvariables.md#PWDREF)) 正好是 _scriptname_所在的目录, 为什么它运行不了呢? 失败的原因是出于安全考虑, 当前目录并没有被加在用户的 [$PATH](internalvariables.md#PATHREF)环境变量中. 因此,在当前目录下调用脚本必须使用<kbd class="USERINPUT">./scriptname</kbd>这种形式.

 |