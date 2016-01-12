# 33.4\. 递归

脚本是否可以[递归](localvar.md#RECURSIONREF)调用自身? 当然可以.

* * *

**例子 33-8\. 递归调用自身的(没用的)脚本**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # recurse.sh
  3 
  4 #  脚本能否递归地调用自己? 
  5 #  是的, 但这有什么实际的用处吗? 
  6 #  (看下面的.)
  7 
  8 RANGE=10
  9 MAXVAL=9
 10 
 11 i=$RANDOM
 12 let "i %= $RANGE"  # 在0到$RANGE - 1之间, 产生一个随机数. 
 13 
 14 if [ "$i" -lt "$MAXVAL" ]
 15 then
 16   echo "i = $i"
 17   ./$0             #  脚本递归地产生自己的一个新实例, 并调用. 
 18 fi                 #  每个子脚本都做同样的事情, until
 19                    #+ 直到产生的变量$i等于$MAXVAL为止. 
 20 
 21 #  如果使用"while"循环来代替"if/then"测试结构的话, 会产生问题. 
 22 #  解释一下为什么. 
 23 
 24 exit 0
 25 
 26 # 注意:
 27 # -----
 28 # 脚本想要正常的工作, 就必须具备可执行权限. 
 29 # 即使使用"sh"命令来调用它, 但是没有设置正确的权限一样会导致问题. 
 30 # 解释一下原因. </pre>

 |

* * *

* * *

**例子 33-9\. 递归调用自身的(有用的)脚本**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # pb.sh: 电话本
  3 
  4 # 由Rick Boivie编写, 已经得到作者授权, 可以在本书中使用. 
  5 # 本书作者做了一些修改. 
  6 
  7 MINARGS=1     #  脚本至少需要一个参数. 
  8 DATAFILE=./phonebook
  9               #  当前目录下, 
 10               #+ 必须有一个名字为"phonebook"的数据文件. 
 11 PROGNAME=$0
 12 E_NOARGS=70   #  未传递参数错误. 
 13 
 14 if [ $# -lt $MINARGS ]; then
 15       echo "Usage: "$PROGNAME" data"
 16       exit $E_NOARGS
 17 fi      
 18 
 19 
 20 if [ $# -eq $MINARGS ]; then
 21       grep $1 "$DATAFILE"
 22       # 如果文件$DATAFILE不存在, 'grep'就会打印一个错误信息. 
 23 else
 24       ( shift; "$PROGNAME" $* ) | grep $1
 25       # 脚本递归调用自身. 
 26 fi
 27 
 28 exit 0        #  脚本在此退出. 
 29               #  因此, 在这句之后, 
 30 			  #+ 即使不加"#"号, 也可以添加注释和数据. 
 31 
 32 # ------------------------------------------------------------------------
 33 "phonebook"数据文件的例子: 
 34 
 35 John Doe        1555 Main St., Baltimore, MD 21228          (410) 222-3333
 36 Mary Moe        9899 Jones Blvd., Warren, NH 03787          (603) 898-3232
 37 Richard Roe     856 E. 7th St., New York, NY 10009          (212) 333-4567
 38 Sam Roe         956 E. 8th St., New York, NY 10009          (212) 444-5678
 39 Zoe Zenobia     4481 N. Baker St., San Francisco, SF 94338  (415) 501-1631
 40 # ------------------------------------------------------------------------
 41 
 42 $bash pb.sh Roe
 43 Richard Roe     856 E. 7th St., New York, NY 10009          (212) 333-4567
 44 Sam Roe         956 E. 8th St., New York, NY 10009          (212) 444-5678
 45 
 46 $bash pb.sh Roe Sam
 47 Sam Roe         956 E. 8th St., New York, NY 10009          (212) 444-5678
 48 
 49 #  如果给脚本传递的参数超过了一个, 
 50 #+ 那这个脚本就*只*会打印包含所有参数的行. </pre>

 |

* * *

* * *

**例子 33-10\. 另一个递归调用自身的(有用的)脚本**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # usrmnt.sh, 由Anthony Richardson编写, 
  3 # 经过作者授权, 可以在本书中使用. 
  4 
  5 # 用法:       usrmnt.sh
  6 # 描述: 挂载设备, 调用这个脚本的用户必须属于
  7 #              /etc/sudoers文件中的MNTUSERS组. 
  8 
  9 # ----------------------------------------------------------
 10 #  这是一个用户挂载设备的脚本, 脚本将会使用sudo来递归的调用自身. 
 11 #  只有拥有合适权限的用户才能使用
 12 
 13 #   usermount /dev/fd0 /mnt/floppy
 14 
 15 #  来代替
 16 
 17 #   sudo usermount /dev/fd0 /mnt/floppy
 18 
 19 #  我使用相同的技术来处理我所有的sudo脚本, 
 20 #+ 因为我觉得它很方便. 
 21 # ----------------------------------------------------------
 22 
 23 #  如果没有设置SUDO_COMMAND变量, 而且我们并没有处于sudo运行的状态下
 24 #+ (译者注: 也就是说第一次运行, 还没被递归), 这样就会开始递归了. 传递用户的真实id和组id . . . 
 25 
 26 if [ -z "$SUDO_COMMAND" ]
 27 then
 28    mntusr=$(id -u) grpusr=$(id -g) sudo $0 $*
 29    exit 0
 30 fi
 31 
 32 # 如果我们处于sudo调用自身的状态中(译者注: 就是说处于递归中), 那么我们就会运行到这里. 
 33 /bin/mount $* -o uid=$mntusr,gid=$grpusr
 34 
 35 exit 0
 36 
 37 # 附注(脚本作者添加的): 
 38 # -------------------------------------------------
 39 
 40 # 1) Linux允许在/etc/fstab文件中使用"users"选项, 
 41 #    以便于任何用户都可以挂载可移动设备. 
 42 #    但是, 在服务器上, 
 43 #    我希望只有一小部分用户可以访问可移动设备. 
 44 #    我发现使用sudo可以给我更多的控制空间. 
 45 
 46 # 2) 我还发现, 通过使用组, 
 47 #    我能够更容易的完成这个任务. 
 48 
 49 # 3) 这个方法可以将root访问mount命令的权利, 
 50 #    赋予任何具有合适权限的用户, 
 51 #    所以一定要小心那些被你赋予访问权限的用户. 
 52 #    你可以开发出类似于mntfloppy, mntcdrom,
 53 #    和mntsamba脚本, 将访问类型分类, 
 54 #    然后你就可以使用上面所讲的这种技术, 
 55 #    获得对mount命令更好的控制. </pre>

 |

* * *

| ![Caution](./images/caution.gif) | 

过多层次的递归会耗尽脚本的栈空间, 引起段错误.

 |